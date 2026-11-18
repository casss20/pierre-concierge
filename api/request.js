// Vercel serverless function: receives an appointment request from the website
// and emails it to Elda. Needs two environment variables in Vercel:
//   RESEND_API_KEY   (from resend.com)
//   REQUEST_TO_EMAIL (where requests go, e.g. pierreconciergenursing@gmail.com)
// Optional: REQUEST_FROM (a verified sender, default is Resend's test sender).

const clean = (v, max) =>
    String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Very light in memory rate limit (per warm instance). Slows down abuse, not a full defense.
const hits = new Map();
const limited = (ip) => {
    const now = Date.now();
    const list = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
    list.push(now);
    hits.set(ip, list);
    return list.length > 5;
};

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ ok: false, error: 'method' });
    }

    const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {};

    // Honeypot: real people never fill this hidden field. Pretend success to bots.
    if (clean(body.website, 200)) return res.status(200).json({ ok: true });

    const ip = clean(req.headers['x-forwarded-for'], 100).split(',')[0] || 'unknown';
    if (limited(ip)) return res.status(429).json({ ok: false, error: 'rate' });

    const name = clean(body.name, 120);
    const phone = clean(body.phone, 40);
    const service = clean(body.service, 120) || 'General Consultation';
    const when = clean(body.when, 200);
    const order = clean(body.order, 120);
    const notes = clean(body.notes, 1500);
    const page = clean(body.page, 200);

    const digits = phone.replace(/\D/g, '');
    if (!name || digits.length < 10 || digits.length > 15) {
        return res.status(400).json({ ok: false, error: 'invalid' });
    }

    const key = process.env.RESEND_API_KEY;
    const to = process.env.REQUEST_TO_EMAIL;
    if (!key || !to) return res.status(503).json({ ok: false, error: 'not_configured' });

    const lines = [
        ['Name', name],
        ['Phone', phone],
        ['Service', service],
        ['Preferred date and time', when || 'Not given'],
        ['Physician order', order || 'Not answered'],
        ['Notes', notes || 'None'],
        ['Sent from', page || 'website'],
    ];
    const text = `New appointment request\n\n${lines.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nCall or text back at ${phone}.`;
    const html = `<h2 style="font-family:Georgia,serif;color:#1E3D34">New appointment request</h2>
<table style="font-family:Arial,sans-serif;font-size:15px;border-collapse:collapse">${lines
        .map(([k, v]) => `<tr><td style="padding:6px 14px 6px 0;color:#6b6455;vertical-align:top">${esc(k)}</td><td style="padding:6px 0;color:#1C2321">${esc(v).replace(/\n/g, '<br>')}</td></tr>`)
        .join('')}</table>
<p style="font-family:Arial,sans-serif"><a href="tel:${esc(digits)}">Call ${esc(phone)}</a></p>`;

    try {
        const r = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                from: process.env.REQUEST_FROM || 'Pierre Concierge Website <onboarding@resend.dev>',
                to: [to],
                subject: `New request: ${service} (${name})`,
                text,
                html,
            }),
        });
        if (!r.ok) return res.status(502).json({ ok: false, error: 'send_failed' });
        return res.status(200).json({ ok: true });
    } catch {
        return res.status(502).json({ ok: false, error: 'send_failed' });
    }
}

function safeParse(s) {
    try { return JSON.parse(s); } catch { return {}; }
}
