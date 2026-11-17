# Pierre Ops — Practice Manager for Elda

Everything Elda needs to run the practice day-to-day, in plain files. **No accounts, no subscriptions, no cloud.**
All client data stays on her device.

## Files

| File | What it is |
|---|---|
| `elda-ops.html` | **The practice manager app** — clients, visits, dashboard, documents. Open in any browser. |
| `print/intake-packet.html` | 4-page new-client packet (welcome, meds, services, consents) — print blanks, keep a clipboard stack in the car |
| `print/who-we-are.html` | Client-facing brand story + value one-pager — the 'why call her' document for families
| `print/referral-onepager.html` | Leave-behind for discharge planners, surgeons, ALF admins, home-health liaisons |
| `print/home-safety-checklist.html` | Detailed safety walk-through used with Hospital-to-Home Transition visits |
| `print/google-business-setup.html` | Step-by-step Google Business Profile setup with copy-paste text + the review engine SOP |
| `print/hipaa-notice.html` | Notice of Privacy Practices + consent (HIPAA format, 3pp) + authorization-to-disclose form |
| `print/service-agreement.html` | Independent Practice Service Agreement + Missed-Visit & Cancellation Policy (3pp) — sign with every client |
| `print/referral-form.html` | Referral pad form (1p) + referral acknowledgment card (1p) — how referrers send patients in, and how we close the loop |
| `print/home-care-playbook.html` | **The flagship product** — 8-page step-by-step family guide (5 modules + templates + services back page). Sell standalone ($35), include with first visits, free with Care Plan |
| `print/holiday-parent-checkup.html` | **Digital product #2** — 2-page 'home for the holidays' parent assessment for adult children. $12 download, seasonal push Nov–Dec. Funnels to Wellness Assessment $150 |

### Digital products (Payhip/Gumroad store — TBD)

| Product | Price | Funnels to |
|---|---|---|
| Home Care Playbook (8pp) | $35 | all services |
| Holiday Parent Checkup (2pp) | $12 | Wellness Assessment $150 |
| 2 A.M. Fridge Pack | $15 | Wellness Assessment $150 |
| Long-Distance Caregiver Kit | $29 | Care Plan $450/mo |
| Medication Command Center | $25 | Medication Mgmt $150 |
| Post-Op Recovery Roadmap | $19 | Post-Op $160 |
| ALF Family Guide | $25 | ALF Support $175 |
| Care Plan Binder | $59 | premium / gifting |
| **The Full Shelf** (bundle) | **$89** | everything |

Every product: PDF download + fillable fields + click-to-call + QR to booking site (`assets/qr-booking.png`).

## How Elda uses the app (5-minute orientation)

1. **Open `elda-ops.html`** — double-click it. Works offline. Add to phone/tablet home screen like an app.
2. **Dashboard** — today's schedule, active clients, monthly plan revenue, collected this month.
3. **Clients → + New client** — enter the intake info (or fill the paper packet first, then copy in). Add medications via **Manage** (one per line: `Name | Dose | Schedule | Notes`).
4. **Visits → + Schedule visit** — pick client, date, service. At the visit, open it and enter **vitals + what was done**. Tap **Save & make family report**.
5. **Documents tab** — generates, per client, in one click:
   - **Same-Day Family Visit Report** (her signature differentiator — print to PDF, text/email it)
   - **Personal Care Plan** (with "call Elda if / call 911 if" red-flag criteria)
   - **Invoice / Superbill** (running balance per client)
   - **Medication Schedule** (pill-organizer sheet for the fridge)
6. **Backup (top bar)** — downloads a JSON file. **Do this weekly** and after any big change. Restore = Restore button + pick the file.

## The weekly rhythm this enables

- **After every visit:** mark Done → make the family report → mark Report sent → ask family for a Google review while they're grateful
- **Weekly:** Backup file + check unpaid visits (Visits tab shows balance due per client)
- **Monthly:** review plan clients, raise rates as reviews accumulate

## Security & privacy (read this, Elda)

- Records live in this browser's storage **on this device only**. Nothing is transmitted anywhere.
- **Set a device passcode** (phone/laptop) and the in-app passcode (Settings tab).
- **Backups are the only protection against device loss.** Keep backup files on an encrypted USB or a password-protected computer.
- This local-first design is a *stronger* privacy posture than typical cloud apps, but confirm specifics (liability coverage, record-retention expectations) with your liability insurer.

## Maintenance

All settings (name, license #, NPI, rates) are editable in the app's **Settings** tab — no code changes needed.

Built 2026-11-17. Brand-matched to pierre-concierge.vercel.app.
