// Run: node scripts/test-cal-webhook.mjs
// Signs fake Cal.com payloads and checks the webhook handler without sending real email.
import { createHmac } from 'node:crypto';
import { Readable } from 'node:stream';
process.env.CAL_WEBHOOK_SECRET = 'test-secret';
process.env.RESEND_API_KEY = 'test-key';
process.env.REQUEST_TO_EMAIL = 'elda@example.com';
const sent = [];
globalThis.fetch = async (url, init) => { sent.push(JSON.parse(init.body)); return { ok: true }; };
const { default: handler } = await import('../api/cal-webhook.js');

const call = async (body, { sig, method = 'POST' } = {}) => {
    const raw = typeof body === 'string' ? body : JSON.stringify(body);
    const req = Readable.from([Buffer.from(raw)]);
    req.method = method;
    req.headers = { 'x-cal-signature-256': sig === undefined ? createHmac('sha256', 'test-secret').update(raw).digest('hex') : sig };
    const out = { code: 0, json: null, headers: {} };
    const res = { setHeader: (k, v) => (out.headers[k] = v), status: (c) => ((out.code = c), res), json: (j) => ((out.json = j), res) };
    await handler(req, res);
    return out;
};
let fail = 0;
const check = (name, ok) => { console.log((ok ? 'PASS ' : 'FAIL ') + name); if (!ok) fail++; };

const booking = {
    triggerEvent: 'BOOKING_REQUESTED',
    payload: {
        uid: 'abc123', eventTitle: 'Wound Care Visit', startTime: '2026-11-24T15:00:00Z',
        attendees: [{ name: 'Test Client', email: 'client@example.com', timeZone: 'America/New_York' }],
        responses: { name: { value: 'Test Client' }, location: { value: { optionValue: '12 Oak St, Ocala, FL 34471' } }, attendeePhoneNumber: { value: '+13525550123' }, zip: { value: '34471' }, notes: { value: 'Gate code 1234' } },
        location: '12 Oak St, Ocala, FL 34471',
    },
};
let r = await call(booking);
check('valid request returns 200', r.code === 200 && r.json.ok);
check('one email sent to Elda only', sent.length === 1 && sent[0].to[0] === 'elda@example.com');
check('email has name, zip, phone, approve link', /Test Client/.test(sent[0].text) && /34471/.test(sent[0].text) && /3525550123/.test(sent[0].text) && /bookings\/unconfirmed/.test(sent[0].text));
check('client is never emailed', !JSON.stringify(sent).includes('client@example.com'));
r = await call(booking);
check('duplicate delivery ignored', r.json.duplicate === true && sent.length === 1);
r = await call({ ...booking, payload: { ...booking.payload, uid: 'zzz' } }, { sig: 'bad' });
check('bad signature rejected', r.code === 401);
r = await call('{not json');
check('bad json rejected', r.code === 400);
r = await call({ triggerEvent: 'PING', payload: {} });
check('ping accepted', r.code === 200 && r.json.ping);
r = await call({ triggerEvent: 'RECORDING_READY', payload: {} });
check('other events ignored', r.json.ignored === 'RECORDING_READY' && sent.length === 1);
r = await call({}, { method: 'GET' });
check('GET rejected', r.code === 405);
r = await call({ triggerEvent: 'BOOKING_CANCELLED', payload: { uid: 'c1', eventTitle: 'Wellness Check', startTime: '2026-11-25T14:00:00Z', attendees: [{ name: 'A B' }], cancellationReason: 'Sick' } });
check('cancellation alert sent with reason', sent.length === 2 && /Sick/.test(sent[1].text));

// Phase 2 checks
const { inServiceArea, buildClientEmail } = await import('../api/cal-webhook.js');
check('Ocala ZIP is in area', inServiceArea('34471') && inServiceArea('34471-1234'));
check('Tampa ZIP is out of area', !inServiceArea('33602'));
const away = { ...booking, payload: { ...booking.payload, uid: 'far1', responses: { ...booking.payload.responses, zip: { value: '33602' } } } };
sent.length = 0; r = await call(away);
check('out-of-area alert warns Elda and has draft decline', /Warning/.test(sent[0].text) && /Draft decline/.test(sent[0].text) && sent.length === 1);
check('out-of-area decline is not sent to the client', !JSON.stringify(sent).includes('client@example.com'));
const created = { triggerEvent: 'BOOKING_CREATED', payload: { ...booking.payload, uid: 'ok1', type: 'wound-care-visit' } };
sent.length = 0; r = await call(created);
check('client email OFF by default (alert only)', sent.length === 1 && !r.json.client);
process.env.CLIENT_EMAILS = 'on'; process.env.PACKET_BASE_URL = 'https://example.com/legal/';
sent.length = 0; r = await call({ ...created, payload: { ...created.payload, uid: 'ok2' } });
check('client email ON sends alert plus one client email', sent.length === 2 && r.json.client === true);
check('client email goes to client with generic subject and packet link', sent[1].to[0] === 'client@example.com' && sent[1].subject === 'Your visit with Pierre Concierge Nursing' && /legal\/wound-care-visit\.pdf/.test(sent[1].text));
check('client email has no visit type or medical details', !/wound/i.test(sent[1].subject) && !/Gate code/.test(sent[1].text));
check('client email tells them to call 911 for emergencies', /911/.test(sent[1].text));
sent.length = 0; r = await call({ ...booking, payload: { ...booking.payload, uid: 'req2' } });
check('client email never sent on a mere request', sent.length === 1 && !r.json.client);
delete process.env.CLIENT_EMAILS;

// Phase 3 checks
const ended = { triggerEvent: 'MEETING_ENDED', payload: { ...booking.payload, uid: 'end1', type: 'wound-care-visit' } };
sent.length = 0; r = await call(ended);
check('visit end: Elda gets a draft thank you, client gets nothing by default', sent.length === 1 && sent[0].to[0] === 'elda@example.com' && /Draft thank you/.test(sent[0].text) && !r.json.client);
process.env.POST_VISIT_EMAILS = 'on'; process.env.REVIEW_URL = 'https://g.page/r/example/review';
sent.length = 0; r = await call({ ...ended, payload: { ...ended.payload, uid: 'end2' } });
check('thank yous ON: client gets one email with review link, generic subject', sent.length === 2 && sent[1].to[0] === 'client@example.com' && sent[1].subject === 'Thank you from Pierre Concierge Nursing' && /g\.page/.test(sent[1].text));
check('thank you has no visit type, no notes, mentions 911', !/wound|gate code/i.test(sent[1].text) && /911/.test(sent[1].text));
sent.length = 0; r = await call({ ...ended, payload: { ...ended.payload, uid: 'end2' } });
check('duplicate visit-end event ignored', r.json.duplicate === true && sent.length === 0);
sent.length = 0; r = await call({ ...booking, payload: { ...booking.payload, uid: 'req3' } });
check('thank you never sent on a booking request', sent.length === 1 && !r.json.client);
delete process.env.POST_VISIT_EMAILS; delete process.env.REVIEW_URL;
console.log(fail ? `${fail} FAILED` : 'ALL PASSED');
process.exit(fail ? 1 : 0);
