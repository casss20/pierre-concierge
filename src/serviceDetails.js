// Plain language explanations for each service. Titles must match the titles in SERVICES (App.jsx).
// General education only. Nothing here replaces the instructions of a patient's own doctor.
export const SERVICE_DETAILS = [
    {
        slug: "post-operative-recovery",
        // TEMPORARY: hosted by Higgsfield. Replace with /images/services/post-operative-recovery.webp once the file is in the repo.
        image: "https://d8j0ntlcm91z4.cloudfront.net/user_3J6k2NqUdop7ql5LBnexUFOwgUi/hf_20261116_231513_0cdcebcb-a57f-4e87-97f4-7a389af27296.png",
        imageAlt: "A calm recovery corner with a folded blanket, a glass of water, and a plant by a sunny window",
        orderLevel: "partial",
        orderText: "Checking vitals and your incision is nursing assessment and needs no order. Any treatment or medication follows your surgeon's orders.",
        title: "Post-Operative Recovery",
        seoDescription: "In home post surgery nursing in Ocala, FL: incision checks, vitals, pain assessment, medication review, and safe mobility help from a licensed RN.",
        intro: "Recovery after surgery is easier when a nurse watches for small problems early. We come to your home in the days and weeks after surgery to check how you are healing and to make sure the plan from your surgeon is actually being followed.",
        whoFor: [
            "Patients going home after a planned or unplanned surgery",
            "Older adults who live alone or whose family cannot be there every day",
            "Anyone who wants a nurse to confirm they are healing as expected",
        ],
        visit: [
            "Check the incision for redness, swelling, warmth, drainage, or other changes",
            "Measure vitals such as blood pressure, heart rate, temperature, and oxygen level",
            "Ask about pain, appetite, sleep, and bowel and bladder function",
            "Review every medication against your discharge list",
            "Help with safe movement, getting up, and fall prevention around the home",
            "Explain what is normal, what to watch for, and when to call your surgeon",
        ],
        bring: [
            "Your discharge paperwork and medication list",
            "Your surgeon's name and phone number",
            "Any questions you have written down",
        ],
        note: "We do not change your surgeon's orders. If something looks wrong, we contact your doctor and tell you what to do next.",
    },
    {
        slug: "chronic-disease-management",
        // TEMPORARY: hosted by Higgsfield. Replace with /images/services/chronic-disease-management.webp once the file is in the repo.
        image: "https://d8j0ntlcm91z4.cloudfront.net/user_3J6k2NqUdop7ql5LBnexUFOwgUi/hf_20261116_231548_4d6025f6-3bea-499a-a9e7-4ba62ceaa234.png",
        imageAlt: "A home blood pressure cuff, a weekly pill organizer, and a notebook on a linen table",
        orderLevel: "partial",
        orderText: "Monitoring and teaching are nursing care and need no order. Medications and treatments follow your doctor's plan.",
        title: "Chronic Disease Management",
        seoDescription: "Ongoing in home nursing support in Ocala, FL for diabetes, high blood pressure, and heart conditions: monitoring, medication oversight, and clear care plans.",
        intro: "Long term conditions such as diabetes, high blood pressure, and heart disease are managed day by day. Regular nurse visits help catch small changes before they turn into an emergency room trip.",
        whoFor: [
            "People living with diabetes, hypertension, or heart conditions",
            "Families who want regular, reliable check ins between doctor appointments",
            "Patients who feel overwhelmed by their medications or instructions",
        ],
        visit: [
            "Check blood pressure, heart rate, oxygen level, weight, and other readings your doctor wants tracked",
            "Review blood sugar logs or home monitor readings where they apply",
            "Go over medications, refills, and how each one is taken",
            "Talk through diet, fluids, activity, and symptoms in plain language",
            "Keep a simple record and share it with your doctor or family",
        ],
        bring: [
            "Your current medication list and any home readings or logs",
            "Your doctor's instructions and upcoming appointment dates",
        ],
        note: "We support the plan your doctor has set. We do not diagnose conditions or change treatments.",
    },
    {
        slug: "hospital-to-home-transition",
        // TEMPORARY: hosted by Higgsfield. Replace with /images/services/hospital-to-home-transition.webp once the file is in the repo.
        image: "https://d8j0ntlcm91z4.cloudfront.net/user_3J6k2NqUdop7ql5LBnexUFOwgUi/hf_20261116_231512_01f64562-9a8f-4383-afb1-83b52b97a633.png",
        imageAlt: "A tidy, welcoming home entryway with a folder and tote bag on a console table",
        orderLevel: "partial",
        orderText: "Education, coordination, and home safety checks need no order. Any treatment or medication follows your doctor's orders.",
        title: "Hospital-to-Home Transition",
        seoDescription: "Hospital to home transition nursing in Ocala, FL: discharge coordination, medication setup, home safety checks, and wound or incision checks in the first days.",
        intro: "The first days after leaving the hospital are when confusion about medications, equipment, and instructions is most likely. We help you land safely at home so nothing falls through the cracks.",
        whoFor: [
            "Patients being discharged after a hospital stay or procedure",
            "Families coordinating care from a distance",
            "Anyone going home with new medications, a new wound, or new equipment",
        ],
        visit: [
            "Go through the discharge instructions and explain them step by step",
            "Set up medications and compare them to the discharge list",
            "Check incisions or wounds and look for early signs of trouble",
            "Review the home for fall risks and help arrange a safe resting space",
            "Confirm that needed equipment and follow up appointments are in place",
        ],
        bring: [
            "Discharge paperwork and prescriptions",
            "Names and numbers for your doctors and pharmacy",
        ],
        note: "Our free Going Home After Surgery checklist can help you prepare before you leave the hospital.",
    },
    {
        slug: "advanced-wound-care",
        // TEMPORARY: hosted by Higgsfield. Replace with /images/services/advanced-wound-care.webp once the file is in the repo.
        image: "https://d8j0ntlcm91z4.cloudfront.net/user_3J6k2NqUdop7ql5LBnexUFOwgUi/hf_20261116_231514_a67eaeee-a46c-4a36-a39c-d3722cd93648.png",
        imageAlt: "Sterile gauze rolls, medical tape, and a saline bottle arranged neatly on a tray",
        orderLevel: "required",
        orderText: "Dressings and wound treatments follow the orders of your doctor or wound clinic. We confirm them at intake.",
        title: "Advanced Wound Care",
        seoDescription: "In home wound care in Ocala, FL for surgical wounds, pressure ulcers, and diabetic wounds: sterile dressing changes, measurement, and infection monitoring.",
        intro: "Wounds heal best when they are cleaned, dressed, and measured the same careful way each time. We bring supplies and sterile technique to your home so you can avoid repeated trips to a wound clinic.",
        whoFor: [
            "Patients with surgical wounds that need dressing changes",
            "People with pressure ulcers or diabetic wounds",
            "Family caregivers who are nervous about changing dressings themselves",
        ],
        visit: [
            "Wash hands, set up a clean work area, and use sterile technique",
            "Remove the old dressing, clean the wound, and apply the dressing your provider ordered",
            "Measure and record the wound so changes can be tracked over time",
            "Look for signs of infection, such as spreading redness, increasing pain, warmth, odor, or drainage",
            "Teach you or your family what to do between visits",
        ],
        bring: [
            "Your doctor's or wound clinic's orders for the dressing",
            "A list of current medications",
        ],
        note: "We follow the wound care orders from your physician. If a wound looks worse, we contact your doctor right away.",
    },
    {
        slug: "iv-therapy-hydration",
        // TEMPORARY: hosted by Higgsfield. Replace with /images/services/iv-therapy-hydration.webp once the file is in the repo.
        image: "https://d8j0ntlcm91z4.cloudfront.net/user_3J6k2NqUdop7ql5LBnexUFOwgUi/hf_20261116_231513_0a091f14-0192-4a73-9780-3a26de5a091b.png",
        imageAlt: "A comfortable armchair and an IV stand in a bright, peaceful living room",
        orderLevel: "required",
        orderText: "We verify your physician's order before every visit.",
        title: "IV Therapy & Hydration",
        seoDescription: "Physician ordered IV fluids and medications at home in Ocala, FL, given by a licensed RN. Order verified before every visit.",
        intro: "Some people need fluids or medications through a vein but would rather not sit in a clinic or infusion center. With a physician's order, a licensed Registered Nurse can give them at home and monitor you the whole time.",
        whoFor: [
            "Patients whose doctor has ordered IV fluids or IV medications",
            "People recovering from illness or surgery who are dehydrated",
            "Patients who find it hard to travel to a clinic",
        ],
        visit: [
            "Confirm the physician's order, your identity, and your allergies before starting",
            "Check vitals and ask how you are feeling",
            "Prepare the supplies, start the IV, and give the ordered fluid or medication",
            "Stay with you and monitor throughout the infusion",
            "Remove the IV when finished, and record what was given",
        ],
        bring: [
            "A written or prescribed order from your physician",
            "A list of allergies and current medications",
        ],
        note: "IV therapy at Pierre Concierge Nursing requires a physician's order, and we verify it before every visit. Without an order, we cannot give IV treatment.",
    },
    {
        slug: "medication-management",
        // TEMPORARY: hosted by Higgsfield. Replace with /images/services/medication-management.webp once the file is in the repo.
        image: "https://d8j0ntlcm91z4.cloudfront.net/user_3J6k2NqUdop7ql5LBnexUFOwgUi/hf_20261116_231548_17bc2ae1-4b33-4f2c-adeb-d49495129913.png",
        imageAlt: "A weekly pill organizer, a glass of water, and a notebook on a kitchen table",
        orderLevel: "partial",
        orderText: "Giving medications and injections such as insulin or B12 requires a physician's order. Reviewing medications and organizing a pill box does not.",
        title: "Medication Management",
        seoDescription: "In home medication management in Ocala, FL: medication reconciliation, weekly pill organizers, injections such as insulin or B12, and pharmacy coordination.",
        intro: "When someone takes many prescriptions, a missed or doubled dose is easy and can be dangerous. We help organize medications so they are taken correctly and consistently.",
        whoFor: [
            "People taking several prescriptions, especially after a hospital stay",
            "Patients who need regular injections such as insulin or B12",
            "Families who worry about missed doses or confusing labels",
        ],
        visit: [
            "Compare every bottle in the home to your doctor's current list",
            "Flag duplicates, expired medications, and anything that does not match",
            "Set up a weekly pill organizer and a simple schedule",
            "Give ordered injections and teach safe technique where appropriate",
            "Coordinate refills with your pharmacy and share questions with your doctor",
        ],
        bring: [
            "All medications, including over the counter products and supplements",
            "Your doctor's medication list or discharge list",
        ],
        note: "We do not prescribe or change doses. Any concern about a medication goes to your prescribing doctor.",
    },
    {
        slug: "assisted-living-facility-support",
        // TEMPORARY: hosted by Higgsfield. Replace with /images/services/assisted-living-facility-support.webp once the file is in the repo.
        image: "https://d8j0ntlcm91z4.cloudfront.net/user_3J6k2NqUdop7ql5LBnexUFOwgUi/hf_20261116_231514_2a016d47-16be-4d5c-b5df-266c33fdfaf1.png",
        imageAlt: "A bright, cozy assisted living room with an armchair, a lamp, and a window",
        orderLevel: "required",
        orderText: "Clinical tasks such as insulin and wound care require a physician's order, which we confirm at intake.",
        title: "Assisted Living Facility Support",
        seoDescription: "Clinical nursing inside assisted living communities in Ocala, FL: insulin, wound care, and monitoring so residents can stay where they live.",
        intro: "Assisted living communities help with daily living, but many cannot perform clinical tasks. We provide those clinical services right inside the facility so a resident may not need to move to a higher level of care.",
        whoFor: [
            "Residents who need insulin, injections, or wound care",
            "Families who want their loved one to stay in their current community",
            "Facilities that want a reliable outside nurse for specific residents",
        ],
        visit: [
            "Coordinate with facility staff on timing and access",
            "Provide ordered clinical care such as insulin administration and wound care",
            "Monitor vitals and watch for changes in condition",
            "Document the visit and update the resident's physician and family as authorized",
        ],
        bring: [
            "Physician orders for the clinical care needed",
            "Contact information for the facility's care team",
        ],
        note: "Monthly contracts are available. Facilities and families can ask about a schedule that fits the resident's needs.",
    },
    {
        slug: "family-peace-of-mind-visits",
        // TEMPORARY: hosted by Higgsfield. Replace with /images/services/family-peace-of-mind-visits.webp once the file is in the repo.
        image: "https://d8j0ntlcm91z4.cloudfront.net/user_3J6k2NqUdop7ql5LBnexUFOwgUi/hf_20261116_231513_38800264-452a-49bb-b313-e1b947bb28d2.png",
        imageAlt: "A warm living room table with two cups of tea and a phone by a sunny window",
        orderLevel: "none",
        orderText: "No order needed. These are check in visits with vitals, observations, and a report.",
        title: "Family Peace-of-Mind Visits",
        seoDescription: "Scheduled RN check in visits for aging parents in Ocala, FL, with a same day report on vitals, medications, and how they are really doing.",
        intro: "When you manage a parent or relative from far away, you want honest answers. A scheduled nurse visit gives you a clear picture, with a report the same day.",
        whoFor: [
            "Adult children and relatives who live in another city or state",
            "Families who want a professional set of eyes on a loved one",
            "Seniors who are living independently and want a regular check in",
        ],
        visit: [
            "Spend unhurried time with your loved one and check how they are doing",
            "Measure vitals and review medications and supplies",
            "Look at the home for safety concerns and signs they may be struggling",
            "Send you a same day report with plain, honest observations",
        ],
        bring: [
            "The name and phone number of the family contact who receives the report",
            "Permission from your loved one to share information with you",
        ],
        note: "Reports go only to the people your loved one authorizes.",
    },
    {
        slug: "patient-advocacy",
        // TEMPORARY: hosted by Higgsfield. Replace with /images/services/patient-advocacy.webp once the file is in the repo.
        image: "https://d8j0ntlcm91z4.cloudfront.net/user_3J6k2NqUdop7ql5LBnexUFOwgUi/hf_20261116_231513_a706646f-8e75-45a7-860a-63f5732aaabf.png",
        imageAlt: "A tidy desk with a folder of papers, reading glasses, a pen, and a cup of tea",
        orderLevel: "none",
        orderText: "No order needed. We explain, organize, and support. Your doctors make the medical decisions.",
        title: "Patient Advocacy",
        seoDescription: "Nurse patient advocacy in Ocala, FL: help understanding doctor's orders, attending appointments, and organizing medical records and questions.",
        intro: "Medical visits move fast and the language can be confusing. A nurse at your side helps you understand your options, ask the right questions, and keep your care organized.",
        whoFor: [
            "Patients who feel lost after a new diagnosis or surgery",
            "Families helping a parent navigate several specialists",
            "Anyone who wants support at an important appointment",
        ],
        visit: [
            "Review your doctor's orders and explain them in plain language",
            "Attend appointments with you when you want company and a second set of ears",
            "Help you prepare questions and keep notes",
            "Organize medical records, medication lists, and appointment dates",
        ],
        bring: [
            "Your records, test results, or orders you want explained",
            "A list of your questions and concerns",
        ],
        note: "Advocacy is billed by the hour. We explain and support, and your doctors remain in charge of medical decisions.",
    },
    {
        slug: "wellness-assessments",
        // TEMPORARY: hosted by Higgsfield. Replace with /images/services/wellness-assessments.webp once the file is in the repo.
        image: "https://d8j0ntlcm91z4.cloudfront.net/user_3J6k2NqUdop7ql5LBnexUFOwgUi/hf_20261116_231514_3daecf96-0954-4581-af88-b26672d5b915.png",
        imageAlt: "A stethoscope, a pulse oximeter, and a blood pressure cuff arranged on linen",
        orderLevel: "none",
        orderText: "No order needed for an assessment.",
        title: "Wellness Assessments",
        seoDescription: "Head to toe nursing wellness assessments at home in Ocala, FL: blood pressure, heart rate, oxygen levels, lung sounds, and clear explanations.",
        intro: "A wellness assessment is a full nursing check up at home. It gives you a baseline, and a nurse's explanation of what the numbers and findings mean.",
        whoFor: [
            "Anyone who wants a thorough check without going to a clinic",
            "Families who want a clear update on a loved one's health",
            "People who want a baseline before or after a change in health",
        ],
        visit: [
            "Measure blood pressure, heart rate, oxygen level, and temperature",
            "Listen to heart and lung sounds and assess breathing",
            "Check skin, swelling, mobility, and general condition from head to toe",
            "Review medications and ask about symptoms, sleep, appetite, and mood",
            "Explain the findings clearly and send updates to family or your physician if you wish",
        ],
        bring: [
            "Your medication list",
            "Questions about anything you have noticed lately",
        ],
        note: "An assessment is not a medical diagnosis. If we find something concerning, we recommend contacting your doctor.",
    },
];

export const SERVICE_BY_SLUG = Object.fromEntries(SERVICE_DETAILS.map((d) => [d.slug, d]));
export const SLUG_BY_TITLE = Object.fromEntries(SERVICE_DETAILS.map((d) => [d.title, d.slug]));
