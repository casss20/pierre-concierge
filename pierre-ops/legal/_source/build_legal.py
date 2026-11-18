from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
from pypdf import PdfReader, PdfWriter
import os, re

OUT = "/mnt/user-data/outputs/pcn/legal"
PINE = colors.HexColor("#1E3D34")
ENTITY = "Pierre Concierge Nursing"
ENTITY_NOTE = "[Legal entity name to be inserted after the LLC is filed: Pierre Concierge, LLC.]"
PHONE = "(754) 367-6929"
EMAIL = "pierreconciergenursing@gmail.com"

H1 = ParagraphStyle("h1", fontName="Helvetica-Bold", fontSize=16, textColor=PINE, spaceAfter=4, leading=19)
SUB = ParagraphStyle("sub", fontName="Helvetica", fontSize=9, textColor=colors.HexColor("#555555"), spaceAfter=8, leading=12)
H2 = ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=10.5, textColor=PINE, spaceBefore=8, spaceAfter=3, leading=13)
B = ParagraphStyle("b", fontName="Helvetica", fontSize=9.2, leading=12.4, spaceAfter=3)
BL = ParagraphStyle("bl", parent=B, leftIndent=12, bulletIndent=2)
SM = ParagraphStyle("sm", fontName="Helvetica", fontSize=8, leading=10.5, textColor=colors.HexColor("#444444"))

def footer(c, d):
    c.saveState()
    c.setFont("Helvetica", 7.5)
    c.setFillColor(colors.HexColor("#666666"))
    c.drawString(0.7*inch, 0.45*inch, ENTITY + "  |  " + PHONE + "  |  " + EMAIL)
    c.drawRightString(letter[0]-0.7*inch, 0.45*inch, "Page %d" % d.page)
    c.restoreState()

def build(path, story):
    doc = SimpleDocTemplate(path, pagesize=letter, leftMargin=0.7*inch, rightMargin=0.7*inch, topMargin=0.6*inch, bottomMargin=0.75*inch)
    doc.build(story, onFirstPage=footer, onLaterPages=footer)

def bullets(items):
    return [Paragraph(i, BL, bulletText="•") for i in items]

def client_block():
    rows = [["Client name", "", "Date of birth", ""],
            ["Visit address", "", "Phone", ""],
            ["Personal rep. (if any)", "", "Relationship", ""],
            ["Client email", "", "Emergency contact", ""]]
    t = Table(rows, colWidths=[1.55*inch, 2.0*inch, 1.2*inch, 2.35*inch], rowHeights=24)
    t.setStyle(TableStyle([("FONT", (0,0), (-1,-1), "Helvetica", 8.5),
        ("FONT", (0,0), (0,-1), "Helvetica-Bold", 8.5), ("FONT", (2,0), (2,-1), "Helvetica-Bold", 8.5),
        ("GRID", (0,0), (-1,-1), 0.5, colors.HexColor("#999999")),
        ("BACKGROUND", (0,0), (0,-1), colors.HexColor("#EEF3F0")), ("BACKGROUND", (2,0), (2,-1), colors.HexColor("#EEF3F0")),
        ("VALIGN", (0,0), (-1,-1), "MIDDLE")]))
    return t


def attest():
    u = "_" * 30
    c = ("<b>Client statement.</b> I, " + u + " (printed name of the client or personal representative), have read this document in full, have had the chance to ask questions and have them answered, and agree to its terms of my own free will. If I am signing for the client, I confirm that I have the legal authority to do so and I have named my relationship to the client above.")
    n = ("<b>Statement for the Practice.</b> I, " + u + ", a Registered Nurse licensed in the State of Florida, license number " + "_" * 12 + ", sign on behalf of Pierre Concierge, LLC, doing business as " + ENTITY + " (the Practice), and confirm that I am authorized to sign for the Practice and that the services described will be given by a licensed Registered Nurse within the scope of Florida nursing practice.")
    return [Spacer(1, 4), Paragraph(c, B), Paragraph(n, B)]

def sig_block(nurse_label="Pierre Concierge Nursing (the Practice)"):
    line = "_" * 38
    rows = [[Paragraph("<b>Client or personal representative</b>", B), Paragraph("<b>" + nurse_label + "</b>", B)],
            [Paragraph(line + "<br/>Signature", SM), Paragraph(line + "<br/>Signature of authorized representative", SM)],
            [Paragraph(line + "<br/>Printed name", SM), Paragraph(line + "<br/>Printed name and title", SM)],
            [Paragraph(line + "<br/>Date", SM), Paragraph(line + "<br/>Date. Nurse giving care and Florida RN license number: ________", SM)]]
    t = Table(rows, colWidths=[3.55*inch, 3.55*inch], rowHeights=[16, 34, 34, 40])
    t.setStyle(TableStyle([("VALIGN", (0,0), (-1,-1), "BOTTOM")]))
    return KeepTogether([t])

# ---------------- MASTER AGREEMENT ----------------
def master_story():
    s = []
    s.append(Paragraph("Private Pay Nursing Service Agreement", H1))
    s.append(Paragraph(ENTITY + " | Ocala and Marion County, Florida | " + PHONE, SUB))
    s.append(Paragraph("This agreement is between the business, Pierre Concierge, LLC, doing business as <b>" + ENTITY + "</b> (the \"Practice\"), and the client named below. " + " The Practice, and not any individual nurse, is the party to this agreement. Nursing care is given by a Florida licensed Registered Nurse engaged by the Practice. The Service Addendum for the visit you booked, and the HIPAA Notice of Privacy Practices, are part of this agreement.", B))
    s.append(Spacer(1, 4)); s.append(client_block())
    s.append(Paragraph("1. Services", H2))
    s.append(Paragraph("The Practice provides private pay, nonemergency nursing services chosen by the client. Each visit type is described in its own Service Addendum. Frequency and length of visits are agreed with the client and may change by mutual agreement.", B))
    s.append(Paragraph("2. What this practice is and is not", H2))
    s += bullets([
        "The Practice is an independent, RN led, private pay nursing service. It is not a Medicare or Medicaid home health agency and does not bill insurance. A receipt may be provided for the client's own reimbursement requests.",
        "Services are provided by Registered Nurses within the scope of Registered Nurse practice under Florida law. The Practice does not diagnose, prescribe, or change a physician's orders. Medical care stays under the authority of the client's own physician or other treating provider.",
        "The Practice is not an emergency service. It does not provide 911 response, live in care, or round the clock on call coverage unless a written package says so. In an emergency, call 911 first."])
    s.append(Paragraph("3. Booking and approval", H2))
    s.append(Paragraph("Booking requests made online are not confirmed until the nurse approves them. The client will receive a confirmation by email. The Practice may decline a request, or call the client first, if the visit is outside the service area, outside the nurse's scope, or needs more information.", B))
    s.append(Paragraph("4. Client responsibilities", H2))
    s += bullets([
        "Give accurate and complete health information, a current medication list, and physician contact details.",
        "Keep an ongoing relationship with a physician for medical care, and follow the physician's instructions.",
        "Provide a reasonably safe place for the visit, with access (gate code, parking, entry) shared in advance.",
        "Tell the Practice about hospital stays, new diagnoses, or changes in condition between visits."])
    s.append(Paragraph("5. Fees and payment", H2))
    s.append(Paragraph("Fees are the amounts on the current fee schedule or quoted in writing before the visit. Payment method and timing: ______________________________. Balances unpaid after 30 days may carry a late fee of $25. Visits may be paused for accounts more than 45 days past due, after written notice. Supplies and travel outside Marion County may cost extra and are quoted in advance.", B))
    s.append(Paragraph("6. Cancellation and missed visits", H2))
    s += bullets([
        "Please give at least 24 hours notice to cancel or reschedule. Same day cancellations and no shows may be charged 50 percent of the visit fee.",
        "Fees are waived for genuine emergencies, such as a hospital admission or a 911 event.",
        "If the nurse must cancel because of illness, weather, or an emergency, the client is told as soon as possible and the visit is rescheduled at no charge.",
        "A 15 minute grace window applies at the start of a visit before it may count as a no show."])
    s.append(Paragraph("7. Consent to care", H2))
    s.append(Paragraph("The client (or personal representative) consents to the nursing services described in the Service Addendum, understands the visit is not a substitute for medical care from a physician, and may refuse or stop any service at any time.", B))
    s.append(Paragraph("8. Privacy and records", H2))
    s.append(Paragraph("Health information is handled as described in the Notice of Privacy Practices. The client may request copies of their records. Please do not send medical details through the online booking form or by unsecured email. The nurse will go over them with you by phone or in person.", B))
    s.append(Paragraph("9. No guarantee of outcomes", H2))
    s.append(Paragraph("Services are given professionally and in good faith under nursing standards. Health outcomes depend on many factors outside the Practice's control. The Practice does not guarantee any particular medical result.", B))
    s.append(Paragraph("10. Ending the agreement", H2))
    s.append(Paragraph("Either the client or the Practice may end this agreement at any time, with or without cause, by notice in writing, text, or phone. Fees for services already given remain due. Records are kept as required by professional standards and remain available to the client.", B))
    s.append(Paragraph("11. Electronic signatures and copies", H2))
    s.append(Paragraph("The parties agree that electronic signatures count as signatures, and that this agreement and any addendum may be signed electronically or on paper, in separate copies, and delivered as PDF files. A printed copy is kept in the Practice's records and a PDF copy goes to the client and the Practice.", B))
    s.append(Paragraph("12. General", H2))
    s.append(Paragraph("Florida law governs this agreement and venue is Marion County, Florida. If any part is found unenforceable, the rest stays in effect. This agreement and its addenda are the whole agreement and replace earlier verbal understandings. Changes must be in writing, and text or email is acceptable.", B))
    s.append(Spacer(1, 8))
    s.append(Paragraph("By signing, both sides agree to this agreement, the Service Addendum, and the Notice of Privacy Practices.", B))
    s += attest(); s.append(Spacer(1, 4)); s.append(sig_block())
    return s

# ---------------- ADDENDA ----------------
SERVICES = [
 dict(slug="free-phone-consultation", title="Free Phone Consultation", mins=15, where="by phone",
  what=["A free call of up to 15 minutes to talk through the client's situation and which kind of care may fit.", "General nursing information and next steps, such as which visit type to book."],
  notnot=["No nursing visit, assessment, or treatment takes place on this call.", "No medical advice specific to a diagnosis, and no changes to any medication or physician order.", "Not for emergencies. Call 911."],
  prep=["Have a short list of questions and the best phone number to reach the client."],
  ack=["I understand this call is informational and creates no nursing care relationship until a visit is booked and approved."]),
 dict(slug="post-op-check-in", title="Post Op Check In", mins=60, where="in the client's home",
  what=["A nursing check after surgery or a procedure: general condition, comfort, mobility and fall risks, and review of the discharge instructions.", "Review of the medication list against the discharge papers and a look at the incision area as part of a general check.", "Teaching on warning signs and when to call the surgeon or 911, and a plan for what to watch between visits."],
  notnot=["The nurse does not change the surgeon's orders, prescribe, or clear the client for activity.", "Wound dressing changes and similar treatments need the written order of the treating physician.", "Not an emergency visit. Call 911 for chest pain, trouble breathing, heavy bleeding, or sudden confusion."],
  prep=["Have the discharge papers, medication list, and the surgeon's contact details ready.", "Make sure someone can let the nurse in, and tell the nurse about pets and parking."],
  ack=["I will share the surgeon's written instructions and follow them.", "I understand the nurse supports recovery and does not replace the surgeon's follow up care."]),
 dict(slug="hospital-to-home-transition", title="Hospital to Home Transition", mins=90, where="in the client's home",
  what=["A home visit after a hospital or rehab stay to help the first days at home go safely.", "Walk through of the discharge plan, medication reconciliation against the discharge list, and a home safety look.", "Help organizing medications and appointments, and a written list of questions for the physician."],
  notnot=["The nurse does not change physician orders or prescribe.", "No personal care, housekeeping, or live in help is included unless a written package says so.", "Not an emergency service. Call 911 if the client's condition worsens."],
  prep=["Have the discharge summary, medication bottles, and appointment dates ready.", "If possible, a family member or caregiver should be present or on the phone."],
  ack=["I will share the discharge papers and all current medications, including over the counter items and supplements.", "I understand questions about the plan of care go back to my physician."]),
 dict(slug="wound-care-visit", title="Wound Care Visit", mins=45, where="in the client's home",
  what=["A nursing look at the wound, cleaning and dressing as ordered by the client's physician or wound care provider.", "Teaching the client or caregiver how to protect the area and signs of infection to watch for.", "Notes on the wound's condition so the physician can follow healing."],
  notnot=["The nurse does not diagnose the wound or choose treatments that are not ordered. Dressing and treatment follow the physician's written orders.", "Surgical or sharp debridement is not part of this visit.", "Not an emergency service. Call 911 for heavy bleeding, spreading redness with fever, or sudden worsening."],
  prep=["Have the physician's wound care orders and the supplies named in them, or ask the Practice to quote supplies in advance."],
  ack=["I will share the physician's written orders before treatment starts.", "I agree to photographs of the wound for the record only if I initial here: ______. The photos stay in the client's record and are not shared outside it without written permission."]),
 dict(slug="medication-management", title="Medication Management Visit", mins=60, where="in the client's home",
  what=["A nurse review of every medication the client has at home, including over the counter products and supplements.", "A written, up to date medication list, a check for duplicates or expired items, and questions to take to the physician or pharmacist.", "Help setting up a pill organizer or schedule that matches the prescriber's directions."],
  notnot=["The nurse does not prescribe, stop, start, or change the dose of any medication. Questions about changes go to the prescriber or pharmacist.", "This is not a pharmacy service and the nurse does not dispense medication.", "Not an emergency service. Call 911 for a suspected overdose or allergic reaction, and Poison Control at 1 800 222 1222."],
  prep=["Gather every bottle, box, and supplement in the home, and the names of the prescribers and pharmacy."],
  ack=["I will share every medication the client takes.", "I understand any medication change must come from the prescriber."]),
 dict(slug="iv-hydration", title="IV Hydration Visit", mins=90, where="in the client's home",
  what=["Intravenous fluids given by the Registered Nurse under a valid written order or prescription from a licensed prescriber.", "Before treatment the nurse reviews the order, checks vital signs, and reviews allergies and current medications.", "The nurse monitors the client during the infusion and gives after care instructions."],
  notnot=["The Practice does not give IV therapy without a valid prescriber order. The nurse may decline or stop a treatment for safety reasons.", "The nurse does not diagnose or choose the treatment. The order comes from the prescriber.", "Risks of IV therapy include bruising, infection, infiltration, fluid overload, and allergic reaction. Emergency care is not available on site. Call 911 for any serious reaction."],
  prep=["Have the prescriber's written order, a list of medications and allergies, and a recent medical history ready.", "Eat and drink as the prescriber directs, and have a comfortable place to sit or recline."],
  ack=["I understand the risks listed above and agree to the IV treatment ordered for me.", "I will tell the nurse right away about pain, swelling, shortness of breath, itching, or any new symptom during the visit."]),
 dict(slug="facility-visit", title="Assisted Living and Facility Visit", mins=60, where="at the client's assisted living or care facility",
  what=["A nursing visit with a client who lives in an assisted living or care facility: general check, medication review, and coordination with family.", "Observations and questions the client's family wants shared with the physician and facility staff."],
  notnot=["The Practice is not part of the facility's staff and does not replace the facility's own nursing or care plan.", "The nurse does not change physician orders. Care of the client in the facility remains with the facility and the client's physician.", "Not an emergency service. In an emergency, follow the facility's procedure and call 911."],
  prep=["The family confirms with the facility that outside nurse visits are allowed, and gives the nurse the front desk and unit contacts."],
  ack=["I have confirmed the facility allows this visit.", "I agree the nurse may share visit notes with the client's physician and the people I name here: ______________________."]),
 dict(slug="family-check-in", title="Family Check In", mins=45, where="in the loved one's home",
  what=["A nursing visit for a family member who lives at a distance from their loved one, to see how they are really doing.", "A report to the family after the visit covering general condition, safety, medications, and any concerns."],
  notnot=["Information is shared with the family only as the client allows in writing.", "The nurse does not give personal care or housekeeping, and does not change physician orders.", "Not an emergency service. Call 911 for an emergency."],
  prep=["The client agrees to the visit and names who may receive the report."],
  ack=["The client agrees the nurse may share the visit report with these people: ______________________.", "The person who booked the visit is the family contact and is responsible for the fee unless we agree otherwise in writing."]),
 dict(slug="wellness-check", title="Wellness Check", mins=45, where="in the client's home",
  what=["A general wellness nursing visit: vital signs, a conversation about how the client has been feeling, sleep, eating, mobility, and safety at home.", "A short written summary of observations and suggestions to discuss with the physician."],
  notnot=["This is not a medical exam or diagnosis, and it does not replace a physician visit.", "The nurse does not change physician orders.", "Not an emergency service. Call 911 for chest pain, trouble breathing, or other emergencies."],
  prep=["Have a list of current medications and any questions or concerns written down."],
  ack=["I understand the wellness check gives general information and I will see my physician for medical care."]),
 dict(slug="care-plan-consultation", title="Care Plan Consultation", mins=90, where="in the client's home",
  what=["A longer visit to build a personal care plan: health history, daily routine, goals, safety, and the support the client has.", "A written care plan summary with recommended visit types and a schedule, which the client may share with their physician."],
  notnot=["The care plan is a nursing support plan and not a medical treatment plan. Medical decisions stay with the client's physician.", "A plan does not obligate the client to buy any further visits.", "Not an emergency service. Call 911 for an emergency."],
  prep=["Have medication lists, recent hospital or physician papers, and the family contacts ready."],
  ack=["I will share my health history honestly so the plan fits my needs."]),
]

def addendum_story(sv):
    s = []
    s.append(Paragraph("Service Addendum: " + sv["title"], H1))
    s.append(Paragraph(ENTITY + " | About " + str(sv["mins"]) + " minutes | " + sv["where"][0].upper() + sv["where"][1:] + " | Part of the Private Pay Nursing Service Agreement", SUB))
    s.append(Spacer(1, 2)); s.append(client_block())
    s.append(Paragraph("Visit date and time: ______________________     Fee quoted: ______________________", B))
    s.append(Paragraph("What this visit includes", H2)); s += bullets(sv["what"])
    s.append(Paragraph("What this visit does not include", H2)); s += bullets(sv["notnot"])
    s.append(Paragraph("How to prepare", H2)); s += bullets(sv["prep"])
    s.append(Paragraph("Acknowledgements for this visit", H2))
    s += bullets(sv["ack"] + ["I have read this addendum, my questions were answered, and I consent to the services described in it."])
    s += attest(); s.append(Spacer(1, 4)); s.append(sig_block())
    return s

def slugify(t): return re.sub(r"[^a-z0-9]+", "_", t.lower()).strip("_")

master_path = OUT + "/Service_Agreement_Master.pdf"
build(master_path, master_story())
for i, sv in enumerate(SERVICES, 1):
    p = OUT + "/Addendum_%02d_%s.pdf" % (i, slugify(sv["title"]))
    build(p, addendum_story(sv))
    # signing packet: master + addendum
    w = PdfWriter()
    for src in (master_path, p):
        for pg in PdfReader(src).pages: w.add_page(pg)
    w.write(OUT + "/Signing_Packet_%02d_%s.pdf" % (i, slugify(sv["title"])))
print(sorted(os.listdir(OUT)))
