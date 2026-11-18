// Vercel serverless function: receives Cal.com booking webhooks and emails Elda.
// Phase 1 of the booking agent. It never contacts the client.
//
// Environment variables in Vercel:
//   CAL_WEBHOOK_SECRET  secret set on the Cal.com webhook (signs every request)
//   RESEND_API_KEY      same key used by api/request.js
//   REQUEST_TO_EMAIL    where Elda's alerts go (same variable as api/request.js)
// Optional:
//   REQUEST_FROM        a verified sender, default is Resend's test sender
//
// Privacy: alerts carry only what the booking form collects (name, phone, address,
// ZIP, access notes, visit type, time). Nothing is stored. Logs hold no personal data.

import { createHmac, timingSafeEqual } from 'node:crypto';

export const config = { api: { bodyParser: false } };

const clean = (v, max) =>
    String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const readRaw = async (req) => {
    if (typeof req.rawBody === 'string' || Buffer.isBuffer(req.rawBody)) return Buffer.from(req.rawBody);
    const chunks = [];
    for await (const c of req) chunks.push(typeof c === 'string' ? Buffer.from(c) : c);
    return Buffer.concat(chunks);
};

export const verifySignature = (raw, signature, secret) => {
    if (!signature || !secret) return false;
    const expected = createHmac('sha256', secret).update(raw).digest('hex');
    const a = Buffer.from(expected);
    const b = Buffer.from(String(signature).trim());
    return a.length === b.length && timingSafeEqual(a, b);
};

const TITLES = {
    BOOKING_REQUESTED: 'New booking request, needs your approval',
    BOOKING_CREATED: 'New booking',
    BOOKING_CANCELLED: 'Booking cancelled',
    BOOKING_RESCHEDULED: 'Booking rescheduled',
    BOOKING_REJECTED: 'Booking declined',
};

// Pull a value out of Cal.com's "responses" object by key pattern.
const fromResponses = (responses, pattern) => {
    if (!responses || typeof responses !== 'object') return '';
    for (const [k, v] of Object.entries(responses)) {
        if (pattern.test(k)) {
            const val = v && typeof v === 'object' && 'value' in v ? v.value : v;
            if (val && typeof val === 'object') return clean(val.optionValue || val.value || '', 300);
            return clean(val, 300);
        }
    }
    return '';
};

export const summarize = (event) => {
    const p = event.payload || {};
    const attendee = (p.attendees && p.attendees[0]) || {};
    const r = p.responses || {};
    const tz = attendee.timeZone || p.organizer?.timeZone || 'America/New_York';
    const fmt = (d) => {
        if (!d) return 'Not given';
        try {
            return new Date(d).toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'full', timeStyle: 'short' }) + ' (Eastern)';
        } catch {
            return clean(d, 60);
        }
    };
    const phone =
        fromResponses(r, /phone/i) ||
        (/^\+?[\d\s().]{10,}$/.test(String(p.location || '')) ? clean(p.location, 40) : '') ||
        clean(attendee.phoneNumber, 40);
    const address = fromResponses(r, /^location$/i) || fromResponses(r, /address/i) || (phone && p.location === phone ? '' : clean(p.location, 300));
    return {
        trigger: event.triggerEvent,
        uid: clean(p.uid, 80),
        visit: clean(p.eventTitle || p.type || p.title, 120) || 'Visit',
        name: clean(attendee.name || fromResponses(r, /^name$/i), 120) || 'Not given',
        email: clean(attendee.email || fromResponses(r, /^email$/i), 160),
        phone,
        address,
        zip: fromResponses(r, /zip/i),
        notes: clean(p.additionalNotes || fromResponses(r, /notes|access/i), 800),
        start: fmt(p.startTime),
        tz,
        reason: clean(p.cancellationReason || p.rejectionReason || '', 300),
    };
};

export const buildEmail = (s) => {
    const title = TITLES[s.trigger] || 'Booking update';
    const rows = [
        ['Visit', s.visit],
        ['When', s.start],
        ['Name', s.name],
        ['Phone', s.phone || 'Not given'],
        ['Visit address', s.address || 'Not given'],
        ['ZIP code', s.zip || 'Not given'],
        ['Access notes', s.notes || 'None'],
    ];
    if (s.reason) rows.push(['Reason', s.reason]);
    const action =
        s.trigger === 'BOOKING_REQUESTED'
            ? 'Open Cal.com to approve or decline: https://app.cal.com/bookings/unconfirmed . Check the ZIP code is in Ocala or Marion County first.'
            : 'See it in Cal.com: https://app.cal.com/bookings/upcoming';
    const digits = s.phone.replace(/\D/g, '');
    const text = `${title}\n\n${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${action}`;
    const html = `<h2 style="font-family:Georgia,serif;color:#1E3D34">${esc(title)}</h2>
<table style="font-family:Arial,sans-serif;font-size:15px;border-collapse:collapse">${rows
        .map(([k, v]) => `<tr><td style="padding:6px 14px 6px 0;color:#6b6455;vertical-align:top">${esc(k)}</td><td style="padding:6px 0;color:#1C2321">${esc(v).replace(/\n/g, '<br>')}</td></tr>`)
        .join('')}</table>
<p style="font-family:Arial,sans-serif">${esc(action)}</p>${digits.length >= 10 ? `<p style="font-family:Arial,sans-serif"><a href="tel:${esc(digits)}">Call ${esc(s.phone)}</a></p>` : ''}`;
    return { subject: `${title}: ${s.visit} (${s.name})`, text, html };
};

const seen = new Map(); // light in memory duplicate guard per warm instance
const duplicate = (key) => {
    const now = Date.now();
    for (const [k, t] of seen) if (now - t > 60 * 60 * 1000) seen.delete(k);
    if (seen.has(key)) return true;
    seen.set(key, now);
    return false;
};

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ ok: false, error: 'method' });
    }

    const secret = process.env.CAL_WEBHOOK_SECRET;
    const key = process.env.RESEND_API_KEY;
    const to = process.env.REQUEST_TO_EMAIL;
    if (!secret || !key || !to) return res.status(503).json({ ok: false, error: 'not_configured' });

    const raw = await readRaw(req);
    if (!verifySignature(raw, req.headers['x-cal-signature-256'], secret)) {
        return res.status(401).json({ ok: false, error: 'signature' });
    }

    let event;
    try {
        event = JSON.parse(raw.toString('utf8'));
    } catch {
        return res.status(400).json({ ok: false, error: 'json' });
    }

    // Cal.com sends a PING when the webhook is created or tested.
    if (event.triggerEvent === 'PING') return res.status(200).json({ ok: true, ping: true });
    if (!TITLES[event.triggerEvent]) return res.status(200).json({ ok: true, ignored: event.triggerEvent });

    const s = summarize(event);
    if (duplicate(`${s.trigger}:${s.uid}`)) return res.status(200).json({ ok: true, duplicate: true });

    const mail = buildEmail(s);
    try {
        const r = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                from: process.env.REQUEST_FROM || 'Pierre Concierge Bookings <onboarding@resend.dev>',
                to: [to],
                subject: mail.subject,
                text: mail.text,
                html: mail.html,
            }),
        });
        console.log(JSON.stringify({ event: s.trigger, uid: s.uid, emailed: r.ok }));
        if (!r.ok) return res.status(502).json({ ok: false, error: 'email' });
        return res.status(200).json({ ok: true });
    } catch {
        console.log(JSON.stringify({ event: s.trigger, uid: s.uid, emailed: false }));
        return res.status(502).json({ ok: false, error: 'email' });
    }
}
