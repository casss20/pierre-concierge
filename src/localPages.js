// Original, locally focused content pages for Pierre Concierge Nursing (Ocala / Marion County, FL).
// Everything here is written for this site. Facts about places are general public geography;
// facts about Elda's practice come from the existing site. Items marked CONFIRM need Elda's sign off.
//
// Section shape: { h, p: [..], ul: [..], steps: [..], table: { cols, rows }, note }

const ER_NOTE = 'If you think you or a loved one is having a medical emergency, call 911 right away. Do not wait for a nurse visit.';

export const COMPARE_PAGES = [
    {
        slug: 'home-care-vs-home-health',
        title: 'Home Care vs. Home Health Care',
        seoTitle: 'Home Care vs. Home Health Care in Ocala, FL | Pierre Concierge Nursing',
        description: 'The difference between home care and home health care, who pays for each, and how families in Ocala and Marion County can use both.',
        eyebrow: 'Compare care options',
        intro: 'The two names sound alike, but they are different kinds of help. Here is a plain comparison so you can tell which one fits your situation in Ocala and Marion County.',
        sections: [
            {
                h: 'The short version',
                p: [
                    'Home health care is skilled, short term medical care ordered by a doctor, usually after a hospital stay, surgery, or illness. Home care is longer term help with daily life, such as bathing, meals, and company.',
                    'Many Marion County families need a little of both, and the two can work side by side.',
                ],
            },
            {
                h: 'Side by side',
                table: {
                    cols: ['', 'Home care', 'Home health care'],
                    rows: [
                        ['What it is', 'Help with daily living and companionship', 'Skilled medical care at home'],
                        ['Who provides it', 'Caregivers and aides', 'Nurses and therapists'],
                        ['Doctor\'s order', 'Not needed', 'Required'],
                        ['How long', 'As long as you need it', 'A limited period, set by a care plan'],
                        ['Who pays', 'Mostly private pay or long term care insurance', 'Often Medicare or insurance if you qualify'],
                        ['Visit length', 'Hours, or around the clock', 'Short visits, often a few times a week'],
                    ],
                },
            },
            {
                h: 'Where private nursing fits',
                p: [
                    'A private duty or concierge nurse sits between the two. You get a licensed Registered Nurse for assessment, monitoring, and teaching, with more time per visit and no homebound rule. Treatments and medications still follow your doctor\'s orders.',
                    'That is the gap Pierre Concierge Nursing fills for families in Ocala: the same nurse each time, scheduled around your life.',
                ],
            },
            {
                h: 'How to decide',
                ul: [
                    'Just home from AdventHealth Ocala, HCA Florida Ocala Hospital, or HCA Florida West Marion Hospital and need wound care or injections? Ask your discharge team about home health first.',
                    'Need help with bathing, meals, and getting around, but no medical treatment? That is home care.',
                    'Need a nurse to check on a parent, track vitals, manage medications, or explain what the doctor said? That is private nursing.',
                ],
            },
        ],
        faqs: [
            { q: 'Can I use home care and home health at the same time?', a: 'Yes. Many families use a Medicare home health agency for a short period of skilled care and add private help for the hours and tasks it does not cover. We are glad to coordinate with your home health team.' },
            { q: 'Does Medicare pay for home care?', a: 'Medicare does not pay for ongoing help with daily living on its own. It can cover part time skilled home health care if you meet its rules, including being homebound and having a doctor\'s plan of care. Check Medicare.gov or call 1-800-MEDICARE for your situation.' },
            { q: 'Which should I call first?', a: 'If a doctor or hospital team has discharged you or a loved one, start with them and ask about home health. If you need help beyond what they set up, or you are not homebound, call a private nurse.' },
        ],
    },
    {
        slug: 'concierge-nursing-vs-home-health',
        title: 'Concierge Nursing vs. Medicare Home Health',
        seoTitle: 'Concierge Nursing vs. Medicare Home Health | Pierre Concierge Nursing, Ocala',
        description: 'How private pay concierge nursing differs from Medicare home health, what each covers, and when families in Ocala choose one or both.',
        eyebrow: 'Compare care options',
        intro: 'Medicare home health and concierge nursing solve different problems. This page lays out the differences honestly, including where Medicare is the better choice.',
        sections: [
            {
                h: 'Where Medicare home health is the right call',
                p: ['If you qualify and need skilled care for a limited time after surgery or a hospital stay, Medicare home health can cost you very little and is a good first step. Ask your doctor or hospital case manager to arrange it.'],
            },
            {
                h: 'Where concierge nursing helps',
                ul: [
                    'You are not homebound, so you do not qualify for Medicare home health.',
                    'Home health visits are short and you want more time with a nurse.',
                    'Your home health episode ended but you still need monitoring and support.',
                    'You want the same nurse every time instead of a rotating schedule.',
                    'You want visits at times that work for you and your family, Monday through Saturday.',
                ],
            },
            {
                h: 'Side by side',
                table: {
                    cols: ['', 'Concierge nursing', 'Medicare home health'],
                    rows: [
                        ['Payment', 'Private pay, posted prices', 'Medicare or insurance if you qualify'],
                        ['Homebound required', 'No', 'Generally yes'],
                        ['Same nurse each visit', 'Yes', 'Depends on the agency'],
                        ['Time per visit', 'Set by you and your nurse', 'Short, task focused'],
                        ['Duration', 'No time limit set by insurance', 'Limited by the plan of care'],
                        ['Treatments and medications', 'Follow your doctor\'s orders', 'Follow your doctor\'s orders'],
                    ],
                },
            },
        ],
        faqs: [
            { q: 'Do you bill Medicare or insurance?', a: 'Not at this time. Pierre Concierge Nursing is private pay and does not bill insurance directly.' },
            { q: 'Do I need my doctor\'s order?', a: 'For medications, IV therapy, injections, and wound treatments, yes. Assessments and check ins do not need one. Elda confirms this with you before the first visit.' },
        ],
    },
    {
        slug: 'nurse-vs-caregiver',
        title: 'Private Nurse vs. Non-Medical Caregiver',
        seoTitle: 'Private Nurse vs. Caregiver for Home Care in Ocala, FL | Pierre Concierge Nursing',
        description: 'What a Registered Nurse can do at home that a non-medical caregiver cannot, and how to choose the right help for a loved one in Marion County.',
        eyebrow: 'Compare care options',
        intro: 'A caregiver and a nurse do different jobs. Choosing the right one saves money and keeps your loved one safe.',
        sections: [
            {
                h: 'What a non-medical caregiver does',
                ul: ['Bathing, dressing, and toileting help', 'Meal preparation and light housekeeping', 'Companionship and reminders', 'Rides to appointments'],
            },
            {
                h: 'What a Registered Nurse does',
                ul: [
                    'Assesses health, checks vital signs, and notices changes early',
                    'Manages and teaches about medications',
                    'Gives injections, IV therapy, and wound care when your doctor orders them',
                    'Explains diagnoses and instructions in plain language',
                    'Talks with your doctors so nothing is missed',
                ],
            },
            {
                h: 'Using both',
                p: ['Many families hire a caregiver for daily hours and a nurse for weekly or monthly clinical oversight. The nurse can also tell the family when a loved one\'s needs have changed.'],
            },
        ],
        faqs: [
            { q: 'Is a nurse more expensive than a caregiver?', a: 'Per hour, yes, because a Registered Nurse has more training and can legally do more. Many families use a nurse for short, focused visits and a caregiver for longer hours.' },
            { q: 'Can a nurse help me find a caregiver?', a: 'Elda can talk through what level of help your loved one needs and what to ask when you interview a caregiver or an agency.' },
        ],
    },
    {
        slug: 'recovering-at-home-vs-rehab',
        title: 'Recovering at Home vs. a Rehab Facility',
        seoTitle: 'Recovering at Home vs. a Rehab Facility in Ocala, FL | Pierre Concierge Nursing',
        description: 'How to decide between going home or to a rehab facility after surgery or a hospital stay in Ocala, and what extra support makes home recovery safer.',
        eyebrow: 'Compare care options',
        intro: 'After a hospital stay in Ocala you may be offered rehab at a facility or a return home. Neither is always right. Here is how to think it through.',
        sections: [
            {
                h: 'A rehab facility may be best when',
                ul: ['You need daily therapy several times a day', 'You cannot safely get around your home yet', 'No one is available to help at home', 'Your doctor or therapist recommends it'],
            },
            {
                h: 'Home may be better when',
                ul: ['You are medically stable and can move with some help', 'Family can be around for part of the day', 'You recover best in your own surroundings', 'Your home can be made safe with a few changes'],
            },
            {
                h: 'What makes home recovery safer',
                p: ['A nurse visit in the first 72 hours can check incisions, review medications against the discharge list, spot warning signs, and set up the home. It is the most common point where recoveries go wrong, and it is where a nurse helps most.'],
            },
        ],
        faqs: [
            { q: 'Who decides between home and rehab?', a: 'Your doctor, the hospital case manager, and you. Ask for their recommendation and the reasons behind it. A nurse can help you prepare questions.' },
        ],
    },
];

export const CONDITION_PAGES = [
    {
        slug: 'diabetes',
        title: 'Diabetes Care at Home',
        seoTitle: 'Diabetes Nursing Care at Home in Ocala, FL | Pierre Concierge Nursing',
        description: 'Home nursing support for people with diabetes in Ocala and Marion County: monitoring, medication review, teaching, and early warning signs.',
        eyebrow: 'Conditions',
        intro: 'Diabetes is managed day by day. A nurse who knows you can help you spot trends before they become emergencies.',
        sections: [
            { h: 'How a nurse can help', ul: ['Review blood sugar logs and spot patterns', 'Check that medications and insulin are taken as ordered', 'Teach checking blood sugar, injection technique, and foot checks', 'Look for skin and foot problems early', 'Share findings with your doctor'] },
            { h: 'Call your doctor if', ul: ['Blood sugar stays higher or lower than your doctor\'s targets', 'You have a sore on your foot that is not healing', 'You are unsure how to adjust for illness or a missed meal'] },
        ],
        faqs: [{ q: 'Do you change my insulin?', a: 'No. Medication changes come from your doctor. A nurse monitors, teaches, and reports what she sees.' }],
    },
    {
        slug: 'heart-failure',
        title: 'Heart Failure Care at Home',
        seoTitle: 'Heart Failure Nursing Care at Home in Ocala, FL | Pierre Concierge Nursing',
        description: 'Regular nurse visits for people with heart failure in Marion County: weight and symptom checks, medication review, and clear guidance on when to call.',
        eyebrow: 'Conditions',
        intro: 'Small changes in weight, swelling, or breathing can be early signs of trouble. Regular checks help catch them sooner.',
        sections: [
            { h: 'How a nurse can help', ul: ['Track weight, blood pressure, pulse, and swelling', 'Review medications, including water pills', 'Teach low sodium eating and fluid guidance your doctor has set', 'Make a simple plan for what to do and who to call'] },
            { h: 'Get help quickly if', ul: ['Weight goes up fast, as your doctor has told you to watch for', 'Swelling or breathlessness gets worse', 'You wake up short of breath'] },
            { note: ER_NOTE },
        ],
        faqs: [{ q: 'Can a nurse replace my cardiologist?', a: 'No. A nurse supports your care between appointments and keeps your doctors informed.' }],
    },
    {
        slug: 'copd',
        title: 'COPD Care at Home',
        seoTitle: 'COPD Nursing Care at Home in Ocala, FL | Pierre Concierge Nursing',
        description: 'Nursing support for people living with COPD in Ocala and Marion County: breathing checks, inhaler teaching, medication review, and an action plan.',
        eyebrow: 'Conditions',
        intro: 'COPD can flare up quickly. Knowing your normal and having a plan makes flare ups easier to catch.',
        sections: [
            { h: 'How a nurse can help', ul: ['Check breathing, oxygen level, and vital signs', 'Review inhaler and nebulizer technique', 'Go over medications and how to take them', 'Help you set up a written action plan with your doctor'] },
            { h: 'Call your doctor if', ul: ['Breathing is harder than usual', 'Your cough or phlegm changes', 'You need your rescue inhaler more often'] },
            { note: ER_NOTE },
        ],
        faqs: [{ q: 'Do you provide oxygen?', a: 'No. Oxygen is ordered by your doctor and supplied by a medical equipment company. A nurse can check that it is being used as prescribed.' }],
    },
    {
        slug: 'high-blood-pressure',
        title: 'High Blood Pressure Care at Home',
        seoTitle: 'High Blood Pressure Monitoring at Home in Ocala, FL | Pierre Concierge Nursing',
        description: 'Home blood pressure checks, medication review, and teaching for adults in Ocala and Marion County.',
        eyebrow: 'Conditions',
        intro: 'High blood pressure often has no symptoms. Regular, accurate readings at home give your doctor better information.',
        sections: [
            { h: 'How a nurse can help', ul: ['Check blood pressure the right way and compare it with your home cuff', 'Review medications and side effects', 'Talk through food, activity, and sleep habits your doctor recommends', 'Report trends to your doctor'] },
        ],
        faqs: [{ q: 'Is my home cuff accurate?', a: 'A nurse can compare your cuff with a reading taken by hand and show you how to take readings correctly.' }],
    },
    {
        slug: 'stroke-recovery',
        title: 'Stroke Recovery at Home',
        seoTitle: 'Stroke Recovery Nursing Support at Home in Ocala, FL | Pierre Concierge Nursing',
        description: 'Nursing support for stroke survivors and families in Marion County: monitoring, medication safety, and guidance between therapy visits.',
        eyebrow: 'Conditions',
        intro: 'Recovery continues long after the hospital stay. A nurse helps keep the plan on track and families informed.',
        sections: [
            { h: 'How a nurse can help', ul: ['Check vital signs and watch for changes', 'Keep blood pressure and blood thinner medications on track as ordered', 'Look at swallowing, skin, and fall risks', 'Coordinate with therapists and your doctors'] },
            { h: 'Know the signs of a stroke', p: ['Sudden face drooping, arm weakness, speech trouble, vision loss, or loss of balance need emergency care.'] },
            { note: ER_NOTE },
        ],
        faqs: [{ q: 'Do you provide therapy?', a: 'No. Physical, occupational, and speech therapy come from licensed therapists. A nurse supports the overall plan.' }],
    },
    {
        slug: 'dementia',
        title: 'Dementia and Memory Care Support at Home',
        seoTitle: 'Dementia Care Support at Home in Ocala, FL | Pierre Concierge Nursing',
        description: 'Nurse support for families caring for someone with dementia in Ocala and Marion County: medication safety, health checks, and caregiver guidance.',
        eyebrow: 'Conditions',
        intro: 'Dementia affects the whole family. A nurse can keep an eye on health, make medications safer, and help caregivers feel less alone.',
        sections: [
            { h: 'How a nurse can help', ul: ['Set up a simple, safe medication system', 'Check for infections, dehydration, and pain that can look like confusion', 'Watch for changes that need the doctor', 'Teach family members what to expect and how to respond', 'Talk through when more help or a different setting may be needed'] },
            { h: 'Support for you', p: ['The Alzheimer\'s Association runs a free helpline, 1-800-272-3900, open 24 hours a day.'] },
        ],
        faqs: [{ q: 'Can a nurse stay all day?', a: 'Pierre Concierge Nursing provides scheduled visits. For daily hands on help, many families add a caregiver. We can help you work out the right mix.' }],
    },
];

export const SETTING_PAGES = [
    {
        slug: 'in-home-nursing',
        title: 'In-Home Nursing in Ocala',
        seoTitle: 'In-Home Nursing in Ocala and Marion County, FL | Pierre Concierge Nursing',
        description: 'A Registered Nurse comes to your home in Ocala or Marion County for assessments, medication management, wound care, and more.',
        eyebrow: 'Care settings',
        intro: 'Care in your own home, from a nurse who knows you.',
        sections: [
            { h: 'What a visit looks like', steps: ['You call or text and we talk through what you need.', 'Elda confirms any doctor\'s order that is needed.', 'She visits at a time that works for you, Monday through Saturday.', 'You and your family get clear notes on what was done and what to watch.'] },
            { h: 'Who it helps', ul: ['Adults recovering from surgery or illness', 'People managing long term conditions', 'Families who live far away from a parent in Marion County', 'Anyone who wants an experienced nurse to check in'] },
        ],
        faqs: [{ q: 'Do you serve all of Marion County?', a: 'We serve Ocala and Marion County. See our area pages for the communities we visit, and call if yours is not listed.' }],
    },
    {
        slug: 'after-a-hospital-stay',
        title: 'Care After a Hospital Stay in Ocala',
        seoTitle: 'Care After a Hospital Stay in Ocala, FL | Pierre Concierge Nursing',
        description: 'A nurse at home in the first days after discharge from an Ocala hospital: medication review, incision checks, and a safe home setup.',
        eyebrow: 'Care settings',
        intro: 'The first days at home are the riskiest. A nurse visit helps you get through them safely.',
        sections: [
            { h: 'Ocala hospitals we often work around', p: ['Families in Marion County are commonly discharged from AdventHealth Ocala, HCA Florida Ocala Hospital, or HCA Florida West Marion Hospital. Pierre Concierge Nursing is not affiliated with any hospital. We work from your discharge papers and your doctor\'s orders.'] },
            { h: 'What we check', ul: ['Medications on the discharge list against what is in the house', 'Incisions, dressings, and drains', 'Pain, swelling, breathing, and other warning signs', 'Equipment, fall risks, and daily needs', 'Follow up appointments and who to call with questions'] },
            { h: 'Related', p: ['See our Hospital to Home Transition and Post Operative Recovery service pages for the details.'] },
        ],
        faqs: [{ q: 'Should I start with home health?', a: 'If you qualify, Medicare home health can be a good first step. Ask your discharge team. We can add visits when you need more time or more support.' }],
    },
    {
        slug: 'visitors-and-travelers',
        title: 'Nursing for Visitors and Travelers in Ocala',
        seoTitle: 'Nursing for Visitors and Travelers in Ocala, FL | Pierre Concierge Nursing',
        description: 'Nurse visits at your hotel, rental, or vacation home in Ocala and Marion County when you need care while away from home. Call to confirm availability.',
        eyebrow: 'Care settings',
        intro: 'Getting sick or needing care while away from home is stressful. A visiting nurse can come to you. Please call first so Elda can confirm she can help.',
        sections: [
            { h: 'When this helps', ul: ['Injections or medications your doctor has prescribed while you travel', 'A check on someone who is recovering and cannot travel yet', 'Help for a family member staying in a rental or vacation home'] },
            { h: 'What to have ready', ul: ['A current medication list', 'Your doctor\'s orders if a treatment is needed', 'The address where you are staying'] },
        ],
        faqs: [{ q: 'Is this an emergency service?', a: 'No. For an emergency, call 911. For urgent illness, use an urgent care or emergency room.' }],
    },
];

const AREA_NOTE = 'Please call to confirm travel to your address.';

export const AREA_PAGES = [
    {
        slug: 'ocala',
        title: 'Ocala',
        seoTitle: 'Home Nursing in Ocala, FL | Pierre Concierge Nursing',
        description: 'Private pay mobile nursing in Ocala, Florida: post surgery care, wound care, IV therapy, and medication management at home.',
        eyebrow: 'Areas we serve',
        intro: 'Ocala is the county seat and home base for Pierre Concierge Nursing. Elda visits homes across the city.',
        sections: [
            { h: 'Care close to home', p: ['Ocala has three main hospitals: AdventHealth Ocala, HCA Florida Ocala Hospital, and HCA Florida West Marion Hospital. There is also Encompass Health Rehabilitation Hospital of Ocala for inpatient rehab. When you or a loved one comes home from any of them, a nurse visit can help the transition.'] },
            { h: 'What we help with', ul: ['Recovery after surgery and hospital stays', 'Medication management and teaching', 'Wound care and IV therapy with a doctor\'s order', 'Wellness checks for older adults and their families'] },
        ],
    },
    {
        slug: 'belleview',
        title: 'Belleview',
        seoTitle: 'Home Nursing in Belleview, FL | Pierre Concierge Nursing',
        description: 'Mobile private pay nursing in Belleview, Florida, including post surgery care, medication management, and wellness visits at home.',
        eyebrow: 'Areas we serve',
        intro: 'Belleview is a city in southern Marion County. A nurse can come to you instead of you driving into Ocala.',
        sections: [
            { h: 'Why it matters', p: ['If you are recovering or managing a long term condition, fewer trips are easier on your body and on your family. Visits happen at your home.'] },
            { h: 'Services', ul: ['Post operative recovery', 'Chronic disease monitoring', 'Medication management', 'Wellness assessments'] },
            { note: AREA_NOTE },
        ],
    },
    {
        slug: 'dunnellon',
        title: 'Dunnellon',
        seoTitle: 'Home Nursing in Dunnellon, FL | Pierre Concierge Nursing',
        description: 'Mobile private pay nursing for Dunnellon, Florida residents: care after surgery, medication management, and wellness checks at home.',
        eyebrow: 'Areas we serve',
        intro: 'Dunnellon is in western Marion County. We visit when you cannot easily get to Ocala.',
        sections: [
            { h: 'Services', ul: ['Recovery after surgery or a hospital stay', 'Medication management and teaching', 'Wound care and IV therapy with a doctor\'s order', 'Family peace of mind visits for loved ones who live nearby'] },
            { note: AREA_NOTE },
        ],
    },
    {
        slug: 'silver-springs',
        title: 'Silver Springs and Silver Springs Shores',
        seoTitle: 'Home Nursing in Silver Springs and Silver Springs Shores, FL | Pierre Concierge Nursing',
        description: 'Mobile private pay nursing in Silver Springs and Silver Springs Shores, Florida, including post surgery care and chronic condition monitoring.',
        eyebrow: 'Areas we serve',
        intro: 'Silver Springs and Silver Springs Shores sit east of Ocala. A nurse can visit you at home in these communities.',
        sections: [
            { h: 'Services', ul: ['Post operative recovery', 'Chronic disease management', 'Medication management', 'Wellness assessments'] },
            { note: AREA_NOTE },
        ],
    },
    {
        slug: 'marion-oaks',
        title: 'Marion Oaks',
        seoTitle: 'Home Nursing in Marion Oaks, FL | Pierre Concierge Nursing',
        description: 'Mobile private pay nursing in Marion Oaks, Florida: care at home after surgery, medication help, and wellness visits.',
        eyebrow: 'Areas we serve',
        intro: 'Marion Oaks is a large community in southern Marion County. Care at home saves a long drive.',
        sections: [
            { h: 'Services', ul: ['Hospital to home transition', 'Medication management', 'Chronic disease monitoring', 'Family peace of mind visits'] },
            { note: AREA_NOTE },
        ],
    },
    {
        slug: 'summerfield',
        title: 'Summerfield',
        seoTitle: 'Home Nursing in Summerfield, FL | Pierre Concierge Nursing',
        description: 'Mobile private pay nursing in Summerfield, Florida: post surgery recovery, wound care with orders, and medication management at home.',
        eyebrow: 'Areas we serve',
        intro: 'Summerfield is in southern Marion County, along U.S. 441. A nurse can come to your home.',
        sections: [
            { h: 'Services', ul: ['Post operative recovery', 'Wound care with a doctor\'s order', 'Medication management', 'Wellness assessments'] },
            { note: AREA_NOTE },
        ],
    },
    {
        slug: 'on-top-of-the-world',
        title: 'On Top of the World',
        seoTitle: 'Home Nursing in On Top of the World, Ocala, FL | Pierre Concierge Nursing',
        description: 'Mobile private pay nursing for residents of On Top of the World and nearby 55 plus communities in Ocala, Florida.',
        eyebrow: 'Areas we serve',
        intro: 'On Top of the World is a large retirement community in Marion County. A nurse can check in at your home when you need it.',
        sections: [
            { h: 'Why residents call', ul: ['Recovery after surgery or a hospital stay', 'Medication reviews', 'A second set of eyes on how a parent is doing', 'Help for adult children who live out of state'] },
            { note: AREA_NOTE },
        ],
    },
];

export const AREA_NAMES = AREA_PAGES.map((a) => a.title);

// Single pages (no sub pages)
export const SINGLE_PAGES = {
    '/paying-for-care': {
        title: 'Paying for Care',
        seoTitle: 'Paying for Home Nursing Care in Ocala, FL | Pierre Concierge Nursing',
        description: 'How families in Ocala and Marion County pay for private home nursing: private pay, long term care insurance, HSA and FSA, and veterans benefits.',
        eyebrow: 'Paying for care',
        intro: 'Here is a plain guide to the ways families cover private nursing, and what to ask.',
        sections: [
            { h: 'Private pay', p: ['Pierre Concierge Nursing is private pay with posted prices. We do not bill insurance directly at this time. See the pricing page for per visit rates and the monthly Care Plan.'] },
            { h: 'Medicare and insurance', p: ['Medicare can cover part time skilled home health if you qualify. It does not pay for ongoing help with daily living on its own, and it does not pay for private nursing visits from us. Call 1-800-MEDICARE or visit Medicare.gov to check your coverage.'] },
            { h: 'Long term care insurance', p: ['Policies differ. Ask your carrier what triggers benefits, whether there is a waiting period, and whether they reimburse a private nurse. Keep your receipts.'] },
            { h: 'HSA and FSA', p: ['Some nursing services may be eligible for reimbursement from a health savings or flexible spending account. Check with your plan administrator before you pay.'] },
            { h: 'Veterans benefits', p: ['Marion County Veterans Services helps veterans and families with VA benefits, including questions about Aid and Attendance, at (352) 671-8422. The Ocala VA Clinic is at 4826 SW 49th Road, Ocala. Benefits and rules change, so confirm details with the VA.'] },
            { h: 'Questions about cost', p: ['Call or text (754) 367-6929 and we will walk you through it.'] },
        ],
        faqs: [
            { q: 'Do you accept insurance?', a: 'Not at this time. We do not bill insurance directly.' },
            { q: 'Can I get a receipt?', a: 'Yes. Ask Elda for a receipt for your records.' },
        ],
    },
    '/resources': {
        title: 'Resources for Ocala and Marion County Families',
        seoTitle: 'Healthcare Resources for Ocala and Marion County Families | Pierre Concierge Nursing',
        description: 'Trusted phone numbers and official websites for Medicare, veterans, elder help, dementia, and emergencies in Ocala and Marion County, FL.',
        eyebrow: 'Resources',
        intro: 'Helpful numbers and official sites. We are not affiliated with any of them.',
        sections: [
            { h: 'Emergencies and crisis', ul: ['Medical emergency: 911', 'Suicide and Crisis Lifeline: call or text 988', 'Poison Control: 1-800-222-1222'] },
            { h: 'Medicare and health coverage', ul: ['Medicare: 1-800-MEDICARE or Medicare.gov', 'Florida facility and provider lookup: FloridaHealthFinder.gov'] },
            { h: 'Older adults and caregivers', ul: ['Florida Elder Helpline: 1-800-963-5337', 'Alzheimer\'s Association 24 hour helpline: 1-800-272-3900'] },
            { h: 'Veterans', ul: ['Marion County Veterans Services: (352) 671-8422', 'Ocala VA Clinic: 4826 SW 49th Road, Ocala', 'Veterans Crisis Line: dial 988 then press 1'] },
            { h: 'From us', p: ['Download our printable Going Home Checklist for the first days after a hospital stay.'], link: { href: '/going-home-checklist.html', label: 'Open the checklist' } },
        ],
    },
    '/how-it-works': {
        title: 'How It Works',
        seoTitle: 'How Concierge Nursing Works | Pierre Concierge Nursing, Ocala, FL',
        description: 'How to get started with private nursing at home in Ocala and Marion County: call, confirm your doctor\'s order, schedule a visit, and get clear notes.',
        eyebrow: 'How it works',
        intro: 'Getting started is simple.',
        sections: [
            { steps: ['Call or text (754) 367-6929, or send a request. Tell us what is going on.', 'Elda talks with you about what you need and confirms whether a doctor\'s order is required.', 'She visits you at home, Monday through Saturday, at a time that works.', 'You and your family get clear notes on what was done and what to watch.', 'Visits continue as you need them, per visit or on the monthly Care Plan.'] },
            { h: 'Before the first visit', ul: ['Have a current list of medications', 'Have your doctor\'s orders or discharge papers handy', 'Know who the family contact is'] },
        ],
    },
    '/contact': {
        title: 'Contact Pierre Concierge Nursing',
        seoTitle: 'Contact Pierre Concierge Nursing | Ocala, FL',
        description: 'Call or text (754) 367-6929 to request nursing care at home in Ocala and Marion County, FL. Monday to Saturday, 8am to 6pm.',
        eyebrow: 'Contact',
        intro: 'The fastest way to reach Elda is by phone or text.',
        sections: [
            { h: 'Reach us', ul: ['Call or text: (754) 367-6929', 'Hours: Monday to Saturday, 8am to 6pm', 'Area: Ocala and Marion County, Florida'] },
            { note: 'Please do not send detailed medical information by text or regular email. For anything urgent, call. In a medical emergency, call 911.' },
        ],
    },
    '/accessibility': {
        title: 'Accessibility',
        seoTitle: 'Accessibility | Pierre Concierge Nursing',
        description: 'Our commitment to making this website usable by everyone, and how to reach us if you have trouble.',
        eyebrow: 'Accessibility',
        intro: 'We want everyone to be able to use this website.',
        sections: [
            { h: 'What we do', ul: ['Use clear headings, readable text, and good color contrast', 'Provide descriptions for images', 'Support keyboard use', 'Respect your device setting to reduce motion, including the scrolling banner and page videos'] },
            { h: 'Need help?', p: ['If something on this site is hard to use, call or text (754) 367-6929 and we will help you another way.'] },
        ],
    },
};

export const INDEX_PAGES = {
    '/compare': { title: 'Compare Care Options', seoTitle: 'Compare Home Care Options | Pierre Concierge Nursing, Ocala, FL', description: 'Plain language comparisons of home care, home health, concierge nursing, caregivers, and rehab for families in Ocala and Marion County.', eyebrow: 'Compare care options', intro: 'Straight answers on the choices families face.', items: COMPARE_PAGES, base: '/compare' },
    '/conditions': { title: 'Conditions We Support', seoTitle: 'Conditions We Support at Home | Pierre Concierge Nursing, Ocala, FL', description: 'Nursing support at home for diabetes, heart failure, COPD, high blood pressure, stroke recovery, and dementia in Ocala and Marion County.', eyebrow: 'Conditions', intro: 'General information and how a nurse can help. This is not medical advice.', items: CONDITION_PAGES, base: '/conditions' },
    '/care-settings': { title: 'Care Settings', seoTitle: 'Care Settings | Pierre Concierge Nursing, Ocala, FL', description: 'Nursing care at home, after a hospital stay, or while visiting Ocala and Marion County.', eyebrow: 'Care settings', intro: 'Wherever you are recovering in Marion County.', items: SETTING_PAGES, base: '/care-settings' },
    '/areas': { title: 'Areas We Serve', seoTitle: 'Areas We Serve | Pierre Concierge Nursing, Ocala and Marion County, FL', description: 'Mobile nursing in Ocala, Belleview, Dunnellon, Silver Springs, Marion Oaks, Summerfield, and On Top of the World.', eyebrow: 'Areas we serve', intro: 'Mobile nursing across Ocala and Marion County.', items: AREA_PAGES, base: '/areas' },
};

export const DETAIL_GROUPS = {
    '/compare': COMPARE_PAGES,
    '/conditions': CONDITION_PAGES,
    '/care-settings': SETTING_PAGES,
    '/areas': AREA_PAGES,
};

// Lookup any local page by path. Returns { page, kind } or null.
export function findLocalPage(clean) {
    if (SINGLE_PAGES[clean]) return { page: SINGLE_PAGES[clean], kind: 'single' };
    if (INDEX_PAGES[clean]) return { page: INDEX_PAGES[clean], kind: 'index' };
    for (const [base, list] of Object.entries(DETAIL_GROUPS)) {
        if (clean.startsWith(base + '/')) {
            const slug = clean.slice(base.length + 1);
            const page = list.find((p) => p.slug === slug);
            if (page) return { page, kind: 'detail', base, siblings: list };
        }
    }
    return null;
}

// Every route with SEO data, for prerender and the sitemap.
export const LOCAL_ROUTES = [
    ...Object.entries(SINGLE_PAGES).map(([path, p]) => ({ path, title: p.seoTitle, description: p.description })),
    ...Object.entries(INDEX_PAGES).map(([path, p]) => ({ path, title: p.seoTitle, description: p.description })),
    ...Object.entries(DETAIL_GROUPS).flatMap(([base, list]) => list.map((p) => ({ path: `${base}/${p.slug}`, title: p.seoTitle, description: p.description }))),
];
