import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SITE_CONFIG } from './siteConfig.js';
import PrivacyNotice from './PrivacyNotice.jsx';
import { SERVICE_BY_SLUG, SLUG_BY_TITLE } from './serviceDetails.js';
import { findLocalPage, COMPARE_PAGES, CONDITION_PAGES, SETTING_PAGES, AREA_PAGES, PAYING_PAGES } from './localPages.js';

const ORDER_LABEL = { required: "Required", partial: "Depends on the care", none: "Not needed" };
import {
    Heart,
    Stethoscope,
    Calendar,
    Clock,
    ChevronLeft,
    CheckCircle,
    Phone,
    Mail,
    MapPin,
    Menu,
    X,
    Syringe,
    Activity,
    ShieldAlert,
    ChevronRight,
    ChevronDown,
    ArrowRight,
    Award,
    BookOpen,
    HelpCircle,
    Briefcase,
    ShieldCheck,
    Languages,
    Home,
    Pill,
    Building2,
    PhoneCall,
    Lock,
    FileText,
    Users,
    Quote,
    Download,
} from 'lucide-react';

/* ============================================================
   Pierre Concierge Nursing — v2 redesign
   Palette is drawn from Elda's own portraits:
   charcoal studio backdrop, royal blue scrubs, warm beige.
   ============================================================ */

// --- Reveal-on-scroll hook ------------------------------------
function useReveal() {
    useEffect(() => {
        const snap = () => window.location.hash === '#snap' || !('IntersectionObserver' in window);
        const seen = new WeakSet();
        const io = snap() ? null : new IntersectionObserver(
            (entries) => entries.forEach((e) => {
                if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
            }),
            { threshold: 0.12 }
        );
        const register = (root) => {
            const list = [];
            if (root.nodeType !== 1) return;
            if (root.classList.contains('reveal')) list.push(root);
            root.querySelectorAll && root.querySelectorAll('.reveal').forEach((el) => list.push(el));
            list.forEach((el) => {
                if (seen.has(el)) return;
                seen.add(el);
                if (!io) { el.classList.add('is-visible'); return; }
                io.observe(el);
            });
        };
        if (!io) document.documentElement.classList.add('snap');
        register(document.body);
        // Pick up content that appears later (tabs, filters, route changes) so it never stays invisible.
        // React can also reuse an element and reset its class (e.g. switching pricing tabs), which drops
        // 'is-visible'. When that happens, watch the element again so it fades in instead of staying hidden.
        const mo = new MutationObserver((muts) => muts.forEach((m) => {
            if (m.type === 'attributes') {
                const el = m.target;
                if (io && el.classList && el.classList.contains('reveal') && !el.classList.contains('is-visible')) {
                    io.unobserve(el);
                    io.observe(el);
                }
                return;
            }
            m.addedNodes.forEach(register);
        }));
        mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
        return () => { mo.disconnect(); io && io.disconnect(); };
    }, []);
}

// --- Small building blocks ------------------------------------
const Eyebrow = ({ children, light = false }) => (
    <p className={`text-xs font-semibold uppercase tracking-[0.22em] mb-4 flex items-center gap-2 ${light ? 'text-sand' : 'text-brass'}`}>
        <span className={`inline-block h-px w-8 ${light ? 'bg-sand' : 'bg-brass'}`} />
        {children}
    </p>
);

const SectionHeading = ({ eyebrow, title, subtitle, centered = true, light = false }) => (
    <div className={`reveal mb-14 ${centered ? 'text-center' : 'text-left'}`}>
        {eyebrow && (centered
            ? <p className={`text-xs font-semibold uppercase tracking-[0.22em] mb-4 ${light ? 'text-sand' : 'text-brass'}`}>{eyebrow}</p>
            : <Eyebrow light={light}>{eyebrow}</Eyebrow>)}
        <h2 className={`font-serif text-3xl md:text-[2.75rem] leading-[1.15] font-semibold mb-5 ${light ? 'text-ivory' : 'text-pine'}`}>{title}</h2>
        {subtitle && <p className={`max-w-2xl leading-relaxed ${centered ? 'mx-auto' : ''} ${light ? 'text-ivory/70' : 'text-ink/75'}`}>{subtitle}</p>}
    </div>
);

const PillButton = ({ children, variant = 'primary', className = '', onClick, href, type, disabled }) => {
    const base = "inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer";
    const styles = {
        primary: "bg-pine text-ivory hover:bg-pine-dark",
        royal: "bg-royal text-white hover:bg-royal-dark",
        outline: "border border-pine/30 text-pine hover:border-pine hover:bg-pine hover:text-ivory",
        light: "bg-ivory text-pine hover:bg-sand",
        ghostLight: "border border-ivory/40 text-ivory hover:bg-ivory hover:text-pine",
    };
    const cls = `${base} ${styles[variant]} ${className}`;
    return href
        ? <a href={href} className={cls}>{children}</a>
        : <button type={type} disabled={disabled} onClick={onClick} className={`${cls}${disabled ? ' opacity-60 pointer-events-none' : ''}`}>{children}</button>;
};

// --- Data ------------------------------------------------------
const SERVICES = [
    {
        icon: Activity,
        title: "Post-Operative Recovery",
        description: "Peace of mind after surgery: incision checks, vitals monitoring, pain assessment, medication reconciliation, and safe mobility assistance while you heal. It works alongside your doctor and any Medicare home health visits, adding more time and attention between them.",
        price: "$160 per visit",
        tag: "Book Post-Op Care",
    },
    {
        icon: Heart,
        title: "Chronic Disease Management",
        description: "Ongoing support for diabetes, hypertension, and heart conditions — regular monitoring, medication oversight, and care plans that catch small problems before they become ER visits.",
        price: "Custom Plans",
        tag: "Book a Consultation",
    },
    {
        icon: Home,
        title: "Hospital-to-Home Transition",
        description: "The first 72 hours home are the riskiest. We coordinate your discharge, set up your medications and equipment, check incisions or wounds, and make sure your home is safe — so you never land alone.",
        price: "$185 per visit",
        tag: "Book Transition Care",
    },
    {
        icon: ShieldAlert,
        title: "Advanced Wound Care",
        description: "Expert management of surgical wounds, pressure ulcers, and diabetic wounds — sterile dressing changes, measurement, and close monitoring for signs of infection, all without the wheelchair-van trips to a wound clinic.",
        price: "Starting at $175",
        tag: "Book Wound Care",
    },
    {
        icon: Syringe,
        title: "IV Therapy & Hydration",
        description: "Physician-ordered IV fluids and medications, administered by a licensed Registered Nurse in the comfort of your home. We verify your order before every visit, then handle setup, administration, and monitoring.",
        price: "Starting at $200",
        tag: "Book IV Therapy",
    },
    {
        icon: Pill,
        title: "Medication Management",
        description: "Ten prescriptions and a missed dose shouldn't end in a hospital trip. We reconcile your medications, organize weekly pill systems, administer injections like insulin or B12, and coordinate refills with your pharmacy.",
        price: "$150 per visit",
        tag: "Book Medication Support",
    },
    {
        icon: Building2,
        title: "Assisted Living Facility Support",
        description: "Many assisted living communities limit the clinical tasks their staff can perform. We can provide them right inside your facility, with your doctor's orders: insulin administration, wound care, and clinical monitoring that may help your loved one stay where they live. Monthly contracts available.",
        price: "$175 per visit",
        tag: "Book a Facility Visit",
    },
    {
        icon: PhoneCall,
        title: "Family Peace-of-Mind Visits",
        description: "For families managing Mom or Dad from Orlando — or anywhere. Scheduled RN visits with a same-day report: vitals, medication status, how they really look, straight answers to your questions.",
        price: "$150 per visit",
        tag: "Book a Check-In",
    },
    {
        icon: Briefcase,
        title: "Patient Advocacy",
        description: "Help understanding doctor's orders, attending appointments with you, and organizing your medical life — a bridge between you and your specialists.",
        price: "Hourly Rates",
        tag: "Book Advocacy",
    },
    {
        icon: Stethoscope,
        title: "Wellness Assessments",
        description: "A full head-to-toe assessment — blood pressure, heart rate, oxygen levels, and lung sounds — with clear explanations and updates for family or your physician.",
        price: "$150 per visit",
        tag: "Book an Assessment",
    },
];

const STEPS = [
    { step: "01", title: "Book", desc: "Request your service or plan online, by phone, or by text." },
    { step: "02", title: "Intake", desc: "We review your needs and verify any physician orders." },
    { step: "03", title: "Home Visit", desc: "Elda arrives fully equipped to provide your care." },
    { step: "04", title: "Recovery", desc: "Full documentation and updates to your doctor or family." },
];

const SINGLE_VISITS = [
    { name: "Post-Op Check-in", price: "$160", desc: "Incision check, pain assessment & medication review." },
    { name: "Hospital-to-Home Transition", price: "$185", desc: "Discharge coordination, med setup, safety & wound check." },
    { name: "Wound Care Visit", price: "$175", desc: "Sterile dressing change, measurement & assessment." },
    { name: "Medication Management", price: "$150", desc: "Reconciliation, pill organization & injections." },
    { name: "IV Hydration", price: "$200+", desc: "Fluids & meds administration (requires prescription)." },
    { name: "ALF / Facility Visit", price: "$175", desc: "Insulin, wound care & monitoring inside your community." },
    { name: "Family Check-In", price: "$150", desc: "Visit + same-day report for out-of-town family." },
    { name: "Wellness Check", price: "$150", desc: "Complete physical assessment — heart, lungs, vitals." },
];

const SUBSCRIPTION_FEATURES = [
    { strong: "3 visits per month", rest: "included" },
    { strong: "Mix & match services", rest: "wound care, IV, check-ups" },
    { strong: "Priority scheduling", rest: "mornings & weekends" },
    { strong: "Direct text line", rest: "24/7 support with Elda" },
];

const FAQS = [
    {
        q: "Do you accept insurance?",
        a: "Not at this time. We do not bill insurance directly. We are a private-pay (concierge) service, which allows us to provide unhurried, higher-quality care without insurance restrictions. We provide a detailed superbill you can submit to your insurance for potential out-of-network reimbursement, though coverage depends on your plan.",
    },
    {
        q: "What forms of payment do you accept?",
        a: "All major credit cards, HSA/FSA cards, and Zelle. Payment is due at booking to secure your appointment.",
    },
    {
        q: "How is concierge nursing different from Medicare home health?",
        a: "Medicare home health is short, task-focused, physician-ordered, and generally requires that you are homebound. Pierre Concierge Nursing is private-pay: the same nurse each time, flexible visit times, no homebound requirement, and no insurance-imposed time limit. The two can work side by side, and we are glad to coordinate with your home health team.",
    },
    {
        q: "Is my health information kept private?",
        a: "Yes. Your records and visit updates are shared only with the doctors and family members you authorize.",
    },
    {
        q: "Can you prescribe medication?",
        a: "As a Registered Nurse, I administer medications prescribed by your physician. I cannot write new prescriptions, but I work closely with your doctor to make sure you get what you need.",
    },
    {
        q: "Which areas do you serve?",
        a: "Mobile nursing throughout Ocala, Silver Springs Shores, Belleview, and The Villages (North) — private residences, hotels, and assisted living facilities.",
    },
    {
        q: "Do I need a referral from a hospital or doctor?",
        a: "No referral is needed to book. Most families contact us directly, often the week of a hospital discharge or when a loved one needs more care than an assisted living facility can provide. Treatments and medications, such as IV therapy, injections, and wound dressings, do require your doctor's order, which we verify at intake. We're also happy to receive referrals from physicians, surgeons, senior living communities, and home-health agencies.",
    },
];

const POLICY_FAQS = [
    SITE_CONFIG.cancellationPolicy && { q: "What is your cancellation policy?", a: SITE_CONFIG.cancellationPolicy },
    SITE_CONFIG.backupPlan && { q: "What if my nurse is unavailable?", a: SITE_CONFIG.backupPlan },
    SITE_CONFIG.writtenCarePlan && { q: "Will I get a written care plan?", a: "Yes. Before care begins you receive a written plan that lists the specific care and the cost, so there are no surprises." },
].filter(Boolean);

const AREAS = ["Ocala", "Silver Springs Shores", "Belleview", "The Villages (North)"];

const EXPERIENCE = [
    {
        role: "Registered Nurse",
        org: "The Lodge Rehabilitation / HCA West Marion",
        period: "2022 — Present",
        desc: "High-quality post-operative care, medication administration, and patient education.",
        current: true,
    },
    {
        role: "Home Health Specialist",
        org: "Trend Home Health Services",
        period: "2022 — Present",
        desc: "Specialized in-home care, vital monitoring, and personalized care plans.",
        current: false,
    },
    {
        role: "Certified Nursing Assistant",
        org: "Nurse Care Inc & Synergy Health",
        period: "2000 — 2021",
        desc: "Decades of foundational, hands-on patient care experience.",
        current: false,
    },
];

const CERTIFICATIONS = [
    "Bachelor of Science in Nursing (BSN), Grand Canyon University",
    "Associate Degree in Nursing (ADN), Hosanna College",
    "Licensed Registered Nurse, State of Florida",
    "CPR & First Aid Certified",
];

// --- Section components ----------------------------------------
function Hero({ openBooking }) {
    return (
        <header className="relative overflow-hidden bg-ivory">
            {/* soft decorative blobs */}
            <div className="pointer-events-none absolute -top-32 -right-32 w-[34rem] h-[34rem] rounded-full bg-sand/25 blur-3xl" />
            <div className="pointer-events-none absolute top-64 -left-40 w-[28rem] h-[28rem] rounded-full bg-pine/5 blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-16 md:pb-24 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-8 items-center">
                {/* Copy */}
                <div className="reveal order-2 lg:order-1">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pine/5 border border-pine/10 text-pine text-xs font-semibold uppercase tracking-[0.14em] mb-7">
                        Premier Concierge Nursing · Ocala, FL
                    </div>

                    <h1 className="font-serif text-[2.6rem] leading-[1.08] sm:text-5xl xl:text-[4.1rem] font-semibold text-pine mb-6">
                        Skilled, RN-led care,
                        <br />
                        <span className="italic font-medium text-royal">right at home.</span>
                    </h1>

                    <p className="text-lg text-ink/75 leading-relaxed max-w-xl mb-9">
                        Expert post-operative support, IV therapy, and wound care by{' '}
                        <strong className="text-pine font-semibold">Elda Marie Pierre, RN, BSN</strong>.
                        Skip the waiting room. Recover in the comfort of your own home.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mb-10">
                        <PillButton onClick={() => openBooking('General Consultation')}>
                            Book a Visit <ArrowRight className="w-4 h-4" />
                        </PillButton>
                        <PillButton variant="outline" href="tel:+17543676929">
                            <Phone className="w-4 h-4" /> +1 (754) 367-6929
                        </PillButton>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-7 gap-y-3 text-sm font-medium text-ink/70">
                        {[
                            { icon: ShieldCheck, label: "Licensed RN" },
                            { icon: CheckCircle, label: "Fully Insured" },
                            { icon: Languages, label: "Bilingual" },
                        ].map(({ icon: Icon, label }) => (
                            <span key={label} className="inline-flex items-center gap-2">
                                <Icon className="w-4.5 h-4.5 w-5 h-5 text-pine" /> {label}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Portrait */}
                <div className="reveal order-1 lg:order-2 relative mx-auto w-full max-w-md lg:max-w-none">
                    <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2rem] border border-brass/40" />
                    <LogoAnimation />
                </div>
            </div>
        </header>
    );
}

// Hero logo animation: plays, holds on the finished logo for a few seconds, then plays again.
function LogoAnimation() {
    const ref = useRef(null);
    const [still, setStill] = useState(false);
    useEffect(() => {
        const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) setStill(true);
    }, []);
    useEffect(() => {
        const v = ref.current;
        if (!v) return;
        let timer;
        const onEnded = () => {
            timer = setTimeout(() => { v.currentTime = 0; const p = v.play(); if (p && p.catch) p.catch(() => {}); }, 3000);
        };
        v.addEventListener('ended', onEnded);
        return () => { v.removeEventListener('ended', onEnded); clearTimeout(timer); };
    }, [still]);
    return (
        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl bg-[#FDF7ED] aspect-square w-full">
            {still ? (
                <img src="/pierre-logo-animation-poster.webp" width="1080" height="1080" alt="Pierre Concierge Nursing logo" className="w-full h-full object-contain" />
            ) : (
                <video ref={ref} src="/videos/pierre-logo-animation.mp4" poster="/pierre-logo-animation-poster.webp" width="1080" height="1080" autoPlay muted playsInline preload="auto" aria-label="Pierre Concierge Nursing logo animation" className="w-full h-full object-contain" />
            )}
        </div>
    );
}

// About page: why we exist, what concierge nursing means, and our values.
const ABOUT_VALUES = [
    { icon: Heart, t: 'Personal attention', d: 'You get one nurse who knows you, your history, and what matters to your family.' },
    { icon: BookOpen, t: 'Clear communication', d: 'Plain language, written notes after each visit, and answers to your questions.' },
    { icon: ShieldCheck, t: 'Advocacy', d: 'Elda speaks up for you with your doctors so nothing is missed or misunderstood.' },
    { icon: Lock, t: 'Privacy and discretion', d: 'Your information is shared only with the doctors and family you authorize.' },
    { icon: FileText, t: 'Honest pricing', d: 'Posted per visit rates and a monthly Care Plan, with no surprises.' },
    { icon: MapPin, t: 'Rooted in Marion County', d: 'Care at home across Ocala and Marion County, close to the people we serve.' },
];
const ABOUT_FAQS = [
    { q: 'What is concierge nursing?', a: 'A Registered Nurse comes to your home for scheduled, private pay visits. You get more time, one familiar nurse, and clear communication, without a clinic trip.' },
    { q: 'How is it different from home health?', a: 'Home health is short term skilled care ordered by your doctor and often covered by Medicare if you qualify. Concierge nursing is private pay, has no homebound rule, and is scheduled around your life. Many families use both.' },
    { q: 'Who provides the care?', a: 'Elda Marie Pierre, RN, BSN, provides your care herself.' },
    { q: 'Do I need a doctor\'s referral?', a: 'Not to start. Assessments and check ins do not need one. Medications, IV therapy, injections, and wound treatments need your doctor\'s order, and Elda will confirm that with you.' },
    { q: 'Does insurance pay?', a: 'We are private pay and do not bill insurance at this time. Some long term care policies and veterans benefits may reimburse you. We can give you a receipt.' },
    { q: 'Where do you serve?', a: 'Ocala and Marion County, Florida. Call or text (754) 367-6929 to confirm travel to your address.' },
];
function AboutWhy() {
    return (
        <section className="bg-cream/50 py-16 md:py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 md:gap-14">
                <div>
                    <Eyebrow>Why we exist</Eyebrow>
                    <h2 className="font-serif text-3xl font-semibold text-pine leading-tight mb-5">Care the way it <span className="italic font-medium text-royal">should be</span></h2>
                    <p className="text-ink/80 leading-relaxed mb-4">Too many people go home from the hospital with confusing instructions and little support. Visits are rushed, the person changes every time, and no one explains what the doctor said.</p>
                    <p className="text-ink/80 leading-relaxed">Pierre Concierge Nursing exists to close that gap. One Registered Nurse, who takes the time to listen, explain, and follow through, in the comfort of your own home.</p>
                </div>
                <div>
                    <Eyebrow>What it means</Eyebrow>
                    <h2 className="font-serif text-3xl font-semibold text-pine leading-tight mb-5">Skilled, RN-led care, <span className="italic font-medium text-royal">at home</span></h2>
                    <p className="text-ink/80 leading-relaxed mb-4">Concierge nursing is private pay, nurse led care that comes to you. You choose the visits you need, and treatments follow your doctor&rsquo;s orders.</p>
                    <ul className="space-y-2.5">
                        {['Recovery after surgery or a hospital stay', 'Help managing a chronic condition', 'Medication reviews and health checks for an aging parent'].map((t) => (
                            <li key={t} className="flex gap-3 text-ink/80 leading-relaxed"><CheckCircle className="w-5 h-5 text-brass shrink-0 mt-0.5" /><span>{t}</span></li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
function AboutValues() {
    return (
        <section className="bg-ivory py-16 md:py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <div className="flex justify-center"><Eyebrow>Our values</Eyebrow></div>
                    <h2 className="font-serif text-3xl md:text-4xl font-semibold text-pine leading-tight">What we stand <span className="italic font-medium text-royal">for</span></h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {ABOUT_VALUES.map(({ icon: Icon, t, d }) => (
                        <div key={t} className="rounded-3xl bg-cream/60 border border-pine/10 p-6">
                            <div className="w-11 h-11 rounded-2xl bg-pine text-ivory flex items-center justify-center mb-4"><Icon className="w-5 h-5" /></div>
                            <h3 className="font-serif text-xl font-semibold text-pine mb-2">{t}</h3>
                            <p className="text-sm text-ink/75 leading-relaxed">{d}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
function AboutFaqNext() {
    const links = [
        { href: '/services', label: 'All services' }, { href: '/how-it-works', label: 'How it works' },
        { href: '/pricing', label: 'Pricing' }, { href: '/conditions', label: 'Conditions' },
        { href: '/care-settings', label: 'Care settings' }, { href: '/areas', label: 'Areas we serve' }, { href: '/contact', label: 'Contact' },
    ];
    return (
        <section className="bg-ivory py-16 md:py-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="font-serif text-3xl font-semibold text-pine mb-6">Questions, answered</h2>
                <LocalFaq faqs={ABOUT_FAQS} />
                <h2 className="font-serif text-2xl font-semibold text-pine mt-14 mb-4">Where to next</h2>
                <div className="flex flex-wrap gap-2.5">
                    {links.map((l) => <a key={l.href} href={l.href} className="px-4 py-2 rounded-full bg-cream/70 border border-pine/10 text-sm font-semibold text-pine hover:bg-pine hover:text-ivory transition-colors">{l.label}</a>)}
                </div>
                <p className="mt-10 text-xs text-ink/60 leading-relaxed">This page is general information, not medical advice. Services are non-emergency. In a medical emergency, call 911.</p>
            </div>
        </section>
    );
}

function ValuesTeaser() {
    return (
        <section className="bg-cream/50 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="font-serif text-2xl md:text-3xl font-semibold text-pine mb-3">Why Pierre exists, and what we stand for</h2>
                <p className="text-ink/75 leading-relaxed mb-5">Personal attention, clear communication, advocacy, privacy, honest pricing, and care rooted in Marion County.</p>
                <a href="/our-values" className="inline-flex items-center gap-2 font-semibold text-royal hover:underline min-h-[44px]">Read our values <ArrowRight className="w-4 h-4" /></a>
            </div>
        </section>
    );
}

function QuoteBand() {
    return (
        <section className="relative bg-pine text-ivory overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-pine/85" />
            <div className="pointer-events-none absolute -bottom-40 -left-32 w-96 h-96 rounded-full bg-pine-light/40 blur-3xl" />
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 text-center reveal">
                <Heart className="w-8 h-8 text-sand mx-auto mb-6 fill-sand/20" />
                <blockquote className="font-serif text-2xl md:text-[2.1rem] leading-snug font-medium mb-6">
                    “Healing happens best where you're most comfortable — at home.
                    You should never have to compromise clinical safety to get there.”
                </blockquote>
                <p className="text-sand text-sm font-semibold uppercase tracking-[0.2em]">Elda Marie Pierre, RN, BSN</p>
            </div>
        </section>
    );
}

function WhyUs() {
    const items = [
        { icon: Clock, title: "Unrushed Visits", desc: "Time to listen, assess, and explain everything clearly — never a 15-minute conveyor belt." },
        { icon: Calendar, title: "Flexible Scheduling", desc: "Morning, evening, and weekend appointments built around your life, not a clinic's." },
        { icon: MapPin, title: "We Come to You", desc: "Homes, hotels, and assisted living facilities across Marion County." },
    ];
    return (
        <section className="bg-ivory py-20 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    eyebrow="Why Pierre Concierge"
                    title="Care that revolves around you"
                    subtitle="One nurse, one relationship, no waiting rooms."
                />
                <div className="grid md:grid-cols-3 gap-6">
                    {items.map(({ icon: Icon, title, desc }, i) => (
                        <div key={title} className="reveal group relative bg-cream/60 border border-pine/10 rounded-3xl p-8 hover:bg-cream hover:border-pine/25 hover:-translate-y-1 transition-all duration-300" style={{ transitionDelay: `${i * 60}ms` }}>
                            <div className="w-12 h-12 rounded-2xl bg-pine text-ivory flex items-center justify-center mb-6 group-hover:bg-royal transition-colors">
                                <Icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-serif text-xl font-semibold text-pine mb-3">{title}</h3>
                            <p className="text-ink/75 leading-relaxed text-[0.95rem]">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Services({ openBooking, hideHeading = false }) {
    return (
        <section id="services" className="bg-cream/50 py-20 md:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {!hideHeading && (
                    <SectionHeading
                        eyebrow="Services"
                        title="Comprehensive nursing, delivered"
                        subtitle="Professional medical care tailored to your recovery and wellness needs, with sterile equipment, clear communication, and genuine warmth."
                    />
                )}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SERVICES.map(({ icon: Icon, title, description, price, tag }, i) => (
                        <article key={title} className="reveal group bg-ivory rounded-3xl p-8 border border-transparent hover:border-pine/15 shadow-sm hover:shadow-xl flex flex-col h-full transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-start justify-between mb-7">
                                <div className="w-12 h-12 rounded-2xl bg-pine/5 text-pine flex items-center justify-center group-hover:bg-pine group-hover:text-ivory transition-colors duration-300">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <span className="font-serif text-brass text-lg">{String(i + 1).padStart(2, "0")}</span>
                            </div>
                            <h3 className="font-serif text-[1.35rem] font-semibold text-pine mb-3">
                                <a href={`/services/${SLUG_BY_TITLE[title]}`} className="hover:text-royal transition-colors">{title}</a>
                            </h3>
                            <p className="text-ink/75 leading-relaxed text-[0.93rem] flex-grow mb-4">{description}</p>
                            <a href={`/services/${SLUG_BY_TITLE[title]}`} className="inline-flex items-center gap-1 min-h-[44px] text-sm font-semibold text-royal hover:text-royal-dark mb-2">
                                What is this treatment? <ArrowRight className="w-4 h-4" />
                            </a>
                            <div className="pt-5 border-t border-pine/10 flex items-center justify-between mt-auto">
                                <span className="text-pine font-bold text-base">{price}</span>
                                <button onClick={() => openBooking(tag)} className="inline-flex items-center gap-1 min-h-[44px] min-w-[44px] justify-end text-sm font-semibold text-pine hover:text-royal transition-colors">
                                    Book <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

function HowItWorks() {
    return (
        <section className="bg-ivory py-20 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading eyebrow="The Process" title="Simple, from first call to recovery" />
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
                    {STEPS.map(({ step, title, desc }, i) => (
                        <div key={step} className="reveal relative text-center lg:text-left" style={{ transitionDelay: `${i * 70}ms` }}>
                            <div className="font-serif text-[3.4rem] leading-none text-brass/35 select-none mb-4">{step}</div>
                            <h4 className="font-serif text-lg font-semibold text-pine mb-2">{title}</h4>
                            <p className="text-ink/75 text-sm leading-relaxed">{desc}</p>
                            {i < STEPS.length - 1 && (
                                <ChevronRight className="hidden lg:block absolute top-8 -right-4 w-5 h-5 text-brass/50" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Pricing({ openBooking, hideHeading = false }) {
    const [tab, setTab] = useState('subscription');
    return (
        <section id="pricing" className="bg-pine text-ivory relative overflow-hidden py-20 md:py-28">
            <div className="pointer-events-none absolute -top-40 right-0 w-[30rem] h-[30rem] rounded-full bg-pine-light/30 blur-3xl" />
            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {!hideHeading && (
                    <SectionHeading
                        light
                        eyebrow="Pricing"
                        title="Simple, transparent, no surprises"
                        subtitle="One visit for immediate needs, or consistent monthly care at a better value."
                    />
                )}

                <div className="flex justify-center mb-12">
                    <div className="bg-ivory/10 p-1 rounded-full inline-flex backdrop-blur">
                        {[
                            { key: 'subscription', label: 'Monthly Plan' },
                            { key: 'alacarte', label: 'Single Visits' },
                        ].map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => setTab(key)}
                                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${tab === key ? 'bg-ivory text-pine shadow-md' : 'text-ivory/85 hover:text-ivory hover:bg-ivory/10'}`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {tab === 'subscription' ? (
                    <div className="reveal max-w-lg mx-auto bg-ivory text-ink rounded-[2rem] shadow-2xl overflow-hidden">
                        <div className="bg-brass px-6 py-3 text-center text-ivory text-xs font-bold uppercase tracking-[0.18em]">
                            Most popular · Best for post-op recovery
                        </div>
                        <div className="p-9">
                            <h3 className="font-serif text-3xl font-semibold text-pine text-center mb-1">The Pierre Care Plan</h3>
                            <p className="text-center text-ink/70 text-sm mb-7">A nurse on call, every month.</p>
                            <div className="text-center mb-8">
                                <span className="font-serif text-6xl font-semibold text-pine">$450</span>
                                <span className="text-ink/70 font-medium">/month</span>
                            </div>
                            <ul className="space-y-4 mb-9">
                                {SUBSCRIPTION_FEATURES.map(({ strong, rest }) => (
                                    <li key={strong} className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-brass shrink-0 mt-0.5" />
                                        <span className="text-ink/80"><strong className="font-semibold text-pine">{strong}</strong> — {rest}</span>
                                    </li>
                                ))}
                            </ul>
                            <PillButton onClick={() => openBooking('Pierre Care Subscription')} className="w-full py-4 text-base">
                                Start the Care Plan
                            </PillButton>
                            <p className="text-xs text-center text-ink/60 mt-4">No long-term contract. Cancel anytime.</p>
                        </div>
                    </div>
                ) : (
                    <div className="reveal grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
                        {SINGLE_VISITS.map(({ name, price, desc }) => (
                            <div key={name} className="bg-ivory/[0.07] border border-ivory/15 rounded-3xl p-7 backdrop-blur hover:bg-ivory/10 hover:border-sand/40 transition-all duration-300">
                                <div className="flex items-start justify-between gap-4 mb-3">
                                    <h4 className="font-serif text-xl font-semibold">{name}</h4>
                                    <span className="bg-sand/15 text-sand px-3.5 py-1 rounded-full text-sm font-semibold whitespace-nowrap">{price}</span>
                                </div>
                                <p className="text-ivory/65 text-sm leading-relaxed mb-5">{desc}</p>
                                <button onClick={() => openBooking(name)} className="inline-flex items-center gap-1 text-sm font-semibold text-sand hover:text-ivory transition-colors">
                                    Book this visit <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <p className="reveal text-center text-ivory/65 text-xs mt-10 max-w-xl mx-auto leading-relaxed">
                    Private-pay service — a detailed superbill is provided for potential out-of-network reimbursement.
                    HSA/FSA cards, all major credit cards, and Zelle accepted.
                </p>
            </div>
        </section>
    );
}

function About({ hideEyebrow = false }) {
    return (
        <section id="about" className="bg-ivory py-20 md:py-28 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-14 lg:gap-20 items-start">
                    {/* Portrait */}
                    <div className="reveal relative mx-auto w-full max-w-sm lg:sticky lg:top-28">
                        <div className="absolute -inset-3 rounded-t-full rounded-b-[2rem] border border-brass/40 translate-x-3 translate-y-3" />
                        <div className="relative rounded-t-full rounded-b-[2rem] overflow-hidden shadow-2xl bg-pine-dark">
                            <img
                                src="/elda-portrait.webp"
                                width="848" height="1024" loading="lazy" decoding="async"
                                alt="Elda Marie Pierre, RN, BSN, smiling"
                                className="w-full h-[30rem] object-cover object-top"
                            />
                        </div>
                        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-pine text-ivory rounded-full px-6 py-2.5 shadow-xl text-sm font-semibold whitespace-nowrap">
                            20+ years of patient care
                        </div>
                    </div>

                    {/* Story */}
                    <div className="reveal pt-6">
                        {!hideEyebrow && <Eyebrow>Meet your nurse</Eyebrow>}
                        <h2 className="font-serif text-3xl md:text-[2.6rem] leading-tight font-semibold text-pine mb-6">
                            Elda Marie Joe Pierre, <span className="italic font-medium text-royal">RN, BSN</span>
                        </h2>
                        <p className="text-lg text-ink/70 leading-relaxed mb-5">
                            A Registered Nurse with a Bachelor of Science in Nursing and over two decades of hands-on
                            experience — from the fast pace of rehabilitation centers to the personal setting of home health care.
                        </p>
                        <p className="text-ink/75 leading-relaxed mb-10">
                            Elda founded <strong className="text-pine">Pierre Concierge Nursing</strong> after seeing too many
                            patients discharged home with confusing instructions and little support. Her goal: to be your
                            advocate, your nurse, and your peace of mind.
                        </p>

                        <figure className="reveal mb-10 rounded-[1.5rem] overflow-hidden shadow-lg border border-pine/10">
                            <img
                                src="/care-couple.webp" width="1000" height="667" loading="lazy" decoding="async"
                                alt="An older couple together in their living room at home"
                                className="w-full h-60 sm:h-72 object-cover"
                            />
                            <figcaption className="bg-cream/80 px-5 py-3 text-xs text-ink/55 font-medium leading-relaxed">
                                Most families come to us the week of a hospital discharge — or the day caring for Mom or Dad starts feeling bigger than the family.
                            </figcaption>
                        </figure>

                        {/* Experience timeline */}
                        <div className="mb-10">
                            <h4 className="flex items-center gap-2 font-bold text-pine mb-5">
                                <Briefcase className="w-5 h-5 text-brass" /> Professional Experience
                            </h4>
                            <div className="space-y-0 border-l border-pine/15 ml-2">
                                {EXPERIENCE.map(({ role, org, period, desc, current }) => (
                                    <div key={role} className="relative pl-6 pb-6 last:pb-0">
                                        <span className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-ivory ${current ? 'bg-brass' : 'bg-pine/30'}`} />
                                        <div className="font-semibold text-pine">{role}</div>
                                        <div className="text-xs text-ink/70 font-medium mb-1.5">{org} · {period}</div>
                                        <p className="text-sm text-ink/75">{desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Education */}
                        <div>
                            <h4 className="flex items-center gap-2 font-bold text-pine mb-4">
                                <BookOpen className="w-5 h-5 text-brass" /> Education & Certifications
                            </h4>
                            <ul className="grid sm:grid-cols-2 gap-3">
                                {CERTIFICATIONS.map((cert) => (
                                    <li key={cert} className="flex items-start gap-2.5 text-sm text-ink/70 bg-cream/60 rounded-xl px-4 py-3">
                                        <Award className="w-4 h-4 text-brass shrink-0 mt-0.5" />
                                        {cert}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function FAQ({ hideHeading = false }) {
    const [open, setOpen] = useState(0);
    return (
        <section className="bg-cream/50 py-20 md:py-24">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {!hideHeading && <SectionHeading eyebrow="FAQ" title="Questions, answered" />}
                <div className="space-y-4">
                    {[...FAQS, ...POLICY_FAQS].map(({ q, a }, i) => {
                        const isOpen = open === i;
                        return (
                            <div key={q} className="reveal bg-ivory rounded-2xl border border-pine/10 overflow-hidden transition-shadow hover:shadow-md">
                                <button
                                    onClick={() => setOpen(isOpen ? -1 : i)}
                                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                                >
                                    <span className={`font-serif text-lg font-semibold ${isOpen ? 'text-royal' : 'text-pine'}`}>{q}</span>
                                    <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-pine text-ivory' : 'bg-pine/5 text-pine'}`}>
                                        {isOpen ? <X className="w-4 h-4" /> : <HelpCircle className="w-4 h-4" />}
                                    </span>
                                </button>
                                <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                    <div className="overflow-hidden">
                                        <p className="px-6 pb-6 text-ink/75 leading-relaxed text-[0.95rem]">{a}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function ServiceArea() {
    return (
        <section className="bg-ivory py-16">
            <div className="reveal max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-cream/70 border border-pine/10 rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-sm">
                    <div className="md:w-[42%] shrink-0">
                        <img
                            src="/senior-couple.webp" width="800" height="1198" loading="lazy" decoding="async"
                            alt="A senior couple resting together at home"
                            className="w-full h-56 md:h-full object-cover"
                        />
                    </div>
                    <div className="p-8 md:p-10 flex-grow flex flex-col justify-center">
                        <div className="w-12 h-12 rounded-2xl bg-pine text-ivory flex items-center justify-center mb-5">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <h3 className="font-serif text-2xl font-semibold text-pine mb-2">Serving Ocala & Marion County</h3>
                        <p className="text-ink/75 text-sm mb-5">Mobile nursing at private residences, hotels, and assisted living facilities throughout:</p>
                        <div className="flex flex-wrap gap-2.5">
                            {AREAS.map((area) => (
                                <span key={area} className="px-4 py-1.5 rounded-full bg-ivory border border-pine/15 text-pine text-sm font-semibold">
                                    {area}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function FinalCTA({ openBooking }) {
    return (
        <section className="bg-pine-dark text-ivory relative overflow-hidden py-20 md:py-24">
            <div className="pointer-events-none absolute -top-24 right-10 w-80 h-80 rounded-full bg-brass/10 blur-3xl" />
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <SectionHeading
                    light
                    eyebrow="Get Started"
                    title="Ready to put your health first?"
                    subtitle="One-time check-up or continuous care — booking is simple, secure, and personal."
                />
                <div className="reveal flex flex-col sm:flex-row justify-center gap-4 mb-10">
                    <PillButton variant="light" href="tel:+17543676929" className="text-base px-8 py-4">
                        <Phone className="w-4 h-4" /> Call or Text: (754) 367-6929
                    </PillButton>
                    <PillButton variant="ghostLight" href="mailto:pierreconciergenursing@gmail.com" className="text-base px-8 py-4">
                        <Mail className="w-4 h-4" /> Email Elda
                    </PillButton>
                </div>
                <button onClick={() => openBooking('General Consultation')} className="reveal text-sand text-sm font-semibold underline underline-offset-4 decoration-sand/40 hover:text-ivory transition-colors">
                    Or request an appointment online →
                </button>
            </div>
        </section>
    );
}

function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer className="bg-[#101B17] text-ivory/60 py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-10 mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <img src="/logo-mark-light.png" alt="" width="33" height="40" className="h-10 w-auto" />
                            <span className="font-serif text-xl font-semibold text-ivory">Pierre Concierge Nursing</span>
                        </div>
                        <p className="text-sm leading-relaxed">
                            Skilled, RN-led nursing care in the comfort and privacy of your home, with compassion and integrity.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-ivory font-bold mb-4 text-sm uppercase tracking-wider">Explore</h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-0 text-sm">
                            <a href="/services" className="inline-block py-2 hover:text-sand transition-colors">Services</a>
                            <a href="/pricing" className="inline-block py-2 hover:text-sand transition-colors">Pricing</a>
                            <a href="/about" className="inline-block py-2 hover:text-sand transition-colors">About Elda</a>
                            <a href="/our-values" className="inline-block py-2 hover:text-sand transition-colors">Our values</a>
                            <a href="/faq" className="inline-block py-2 hover:text-sand transition-colors">FAQ</a>
                            <a href="/conditions" className="inline-block py-2 hover:text-sand transition-colors">Conditions</a>
                            <a href="/areas" className="inline-block py-2 hover:text-sand transition-colors">Areas we serve</a>
                            <a href="/compare" className="inline-block py-2 hover:text-sand transition-colors">Compare care options</a>
                            <a href="/paying-for-care" className="inline-block py-2 hover:text-sand transition-colors">Paying for care</a>
                            <a href="/resources" className="inline-block py-2 hover:text-sand transition-colors">Resources</a>
                            <a href="/contact" className="inline-block py-2 hover:text-sand transition-colors">Contact</a>
                            <a href="/accessibility" className="inline-block py-2 hover:text-sand transition-colors">Accessibility</a>
                            <a href="/privacy-practices" className="inline-block py-2 hover:text-sand transition-colors">Privacy (HIPAA)</a>
                            <a href="/policies" className="inline-block py-2 hover:text-sand transition-colors">Policies</a>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-ivory font-bold mb-4 text-sm uppercase tracking-wider">Contact</h4>
                        <ul className="space-y-2.5 text-sm">
                            <li className="flex items-center gap-2.5"><Phone size={15} className="text-brass" /> <a href="tel:+17543676929" className="inline-block py-2 hover:text-sand transition-colors">+1 (754) 367-6929</a></li>
                            <li className="flex items-center gap-2.5"><Mail size={15} className="text-brass" /> <a href="mailto:pierreconciergenursing@gmail.com" className="inline-block py-2 hover:text-sand transition-colors">pierreconciergenursing@gmail.com</a></li>
                            <li className="flex items-center gap-2.5"><Clock size={15} className="text-brass" /> Mon–Sat: 8am – 6pm</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-ivory/10 pt-8 text-center text-xs text-ivory/60 space-y-2">
                    <p>© {year} Pierre Concierge Nursing & Wellness. All rights reserved.</p>
                    <p className="font-semibold text-ivory/90">In case of a medical emergency, call 911. Pierre Concierge Nursing is not an emergency service.</p>
                    <p className="text-ivory/40">Stock photography: Pexels (free license).</p>
                </div>
            </div>
        </footer>
    );
}

// --- Booking modal ----------------------------------------------
// --- Trust and education sections -------------------------------
function CredentialsStrip() {
    const { licenseNumber, licenseLookupUrl, insuranceDetail } = SITE_CONFIG;
    const items = [
        { icon: ShieldCheck, title: "Licensed Florida RN", text: licenseNumber ? `License ${licenseNumber}` : "BSN prepared Registered Nurse", href: licenseNumber ? licenseLookupUrl : '' },
        insuranceDetail && { icon: Award, title: "Insured", text: insuranceDetail },
        { icon: Lock, title: "Private and confidential", text: "Records and updates are shared only with the doctors and family you authorize.", href: "/privacy-practices", linkText: "Read our privacy notice" },
    ].filter(Boolean);
    return (
        <section className="bg-ivory py-12">
            <div className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-4 ${items.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
                {items.map(({ icon: Icon, title, text, href, linkText }) => (
                    <div key={title} className="reveal flex items-start gap-4 bg-cream/60 border border-pine/10 rounded-2xl p-5">
                        <div className="w-11 h-11 rounded-xl bg-pine text-ivory flex items-center justify-center shrink-0"><Icon className="w-5 h-5" /></div>
                        <div>
                            <p className="font-serif text-lg font-semibold text-pine">{title}</p>
                            <p className="text-sm text-ink/75 leading-relaxed">
                                {href && !linkText ? <a href={href} target="_blank" rel="noopener noreferrer" className="underline decoration-brass underline-offset-4">{text}</a> : text}
                            </p>
                            {linkText && <a href={href} className="inline-block py-3 mt-0 text-sm font-semibold text-royal underline decoration-brass underline-offset-4">{linkText}</a>}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function CompareHomeHealth() {
    const rows = [
        ["Who visits", "Often different clinicians", "The same nurse, every visit"],
        ["Visit style", "Short, task-focused visits", "Unrushed visits built around your needs"],
        ["Schedule", "Set by the agency, for a limited period", "Mornings, evenings, and weekends"],
        ["Eligibility", "Physician order and generally homebound", "No homebound requirement"],
        ["Payment", "Usually covered by Medicare when you qualify", "Private pay, with a superbill for possible reimbursement"],
    ];
    return (
        <section className="bg-cream/50 py-20 md:py-24">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    eyebrow="Concierge nursing vs. home health"
                    title="Why families add a private nurse"
                    subtitle="Medicare home health is valuable when you qualify, and it has limits. Concierge nursing fills the gaps, and the two can work together."
                />
                <div className="reveal overflow-x-auto rounded-2xl border border-pine/10 bg-ivory">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-pine text-ivory">
                                <th className="px-5 py-4 font-semibold"><span className="sr-only">Topic</span></th>
                                <th className="px-5 py-4 font-semibold">Medicare home health</th>
                                <th className="px-5 py-4 font-semibold">Pierre Concierge Nursing</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(([topic, a, b]) => (
                                <tr key={topic} className="border-t border-pine/10 align-top">
                                    <th scope="row" className="px-5 py-4 font-serif text-pine font-semibold whitespace-nowrap">{topic}</th>
                                    <td className="px-5 py-4 text-ink/75">{a}</td>
                                    <td className="px-5 py-4 text-ink/90 font-medium">{b}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

function CareTeam() {
    const points = [
        { icon: FileText, title: "We verify physician orders", desc: "Before IV therapy, injections, or wound treatments, we confirm your doctor's order at intake." },
        { icon: Stethoscope, title: "Your doctor stays informed", desc: "After visits, you and your physician receive clear documentation and updates, with family included if you wish." },
        { icon: Users, title: "Referrals welcome", desc: "Surgeons, senior living communities, and home health agencies can send patients directly." },
    ];
    return (
        <section className="bg-ivory py-20 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading eyebrow="Working with your care team" title="Coordinated with your doctors" />
                <div className="grid gap-6 md:grid-cols-3">
                    {points.map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="reveal bg-cream/60 border border-pine/10 rounded-3xl p-8">
                            <div className="w-12 h-12 rounded-2xl bg-pine/5 text-pine flex items-center justify-center mb-5"><Icon className="w-6 h-6" /></div>
                            <h3 className="font-serif text-xl font-semibold text-pine mb-2">{title}</h3>
                            <p className="text-ink/75 leading-relaxed text-[0.95rem]">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Testimonials() {
    const list = SITE_CONFIG.testimonials;
    if (!list.length) return null;
    return (
        <section className="bg-ivory py-20 md:py-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading eyebrow="Kind words" title="What families say" />
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {list.map(({ quote, name, role }) => (
                        <figure key={name + quote} className="reveal bg-cream/60 border border-pine/10 rounded-3xl p-8">
                            <Quote className="w-7 h-7 text-brass mb-4" />
                            <blockquote className="text-ink/90 leading-relaxed mb-5">{quote}</blockquote>
                            <figcaption className="text-sm"><span className="font-semibold text-pine">{name}</span>{role ? <span className="text-ink/70">, {role}</span> : null}</figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
}

// The Safe Home Playbook: paid PDF guide. The buy button appears only when a checkout link is set in siteConfig.
const PLAYBOOK_POINTS = [
    'Nine common problems after discharge, each with numbered steps',
    'Exact words to say to nurses, doctors, pharmacists, and family',
    'A 14 day plan with Day 7 and Day 14 review worksheets',
    'Local Ocala and Marion County help numbers',
];
// Sales preview only: the cover plus short descriptions. The guide's real pages are not shown on the site.
const PLAYBOOK_SLIDES = [
    { cover: true, src: '/playbook/p1.webp', title: 'The Safe Home Playbook', cap: 'The Safe Home Playbook' },
    { t: 'Nine problems, solved', d: 'Rushed discharge, confusing medicines, pain at home, tasks nobody taught you, no one calling back, and more.', cap: 'What it covers' },
    { t: 'Numbered steps', d: 'Each problem has clear steps you can start today, in order, with nothing to figure out.', cap: 'Step by step' },
    { t: 'Words to say', d: 'Ready to use scripts for nurses, doctors, pharmacists, and family, so you know what to ask and how.', cap: 'Scripts' },
    { t: 'A 14 day plan', d: 'Tick boxes from before you leave the hospital through the first two weeks at home.', cap: 'The plan' },
    { t: 'Day 7 and Day 14 reviews', d: 'Simple worksheets to decide whether to carry on, add help, or call the doctor.', cap: 'Reviews' },
    { t: 'Red, yellow, green', d: 'An emergency ladder and fridge card, so you know what can wait and what cannot.', cap: 'The 2 a.m. question' },
    { t: 'Doctors and family', d: 'Forms that let you speak with the care team, five questions for every visit, and a family meeting agenda.', cap: 'Doctors and family' },
    { t: 'Local help', d: 'Phone numbers and agencies for Ocala and Marion County, plus when to call 911.', cap: 'Ocala and Marion County' },
];
const KIT_SLIDES = [
    { cover: true, src: '/playbook/kit-cover.webp', title: 'The Discharge Readiness Kit', cap: 'The Discharge Readiness Kit' },
    { t: 'Questions to ask', d: 'Printable question pages for before you leave, with space to write each answer as the nurse speaks.', cap: 'Before discharge' },
    { t: 'Medication list and schedule', d: 'Fill in the medicines from the discharge papers, then build a simple daily schedule chart for the week.', cap: 'Day of discharge' },
    { t: 'Getting the home ready', d: 'A home checklist, plus a simple plan for the first 72 hours, one day at a time.', cap: 'Before you arrive home' },
    { t: 'Daily recovery log', d: 'One line a day for the first two weeks, ready to bring to follow up visits.', cap: 'Days 1 to 14' },
    { t: 'When to get help', d: 'Warning signs to know before you need them, and a contacts and appointments page for the fridge.', cap: 'Keep it on the fridge' },
    { t: 'Family care schedule', d: 'Who is with the patient, and when, so everyone shares the load.', cap: 'Sharing the care' },
];
const LDK_SLIDES = [
    { cover: true, src: '/playbook/ldk-cover.webp', title: 'The Long Distance Caregiver Kit', cap: 'The Long Distance Caregiver Kit' },
    { t: 'Your care team sheet', d: 'One page that lists every doctor, neighbor, and helper, ready to share with the whole family.', cap: 'Who is who' },
    { t: 'Permissions and papers', d: 'The forms that let you speak with doctors and act in a crisis, and when to ask an attorney.', cap: 'Before a crisis' },
    { t: 'Call scripts', d: 'The exact words for hard calls: with your parent, a doctor, a neighbor, and an agency.', cap: 'What to say' },
    { t: 'Check in system and weekly log', d: 'A simple rhythm of calls and visits, plus a log that shows change over time.', cap: 'Notice changes early' },
    { t: 'Hiring help and crisis plan', d: 'How to hire from out of state, what to ask an agency, and a plan for the day you get the call.', cap: 'Be ready' },
    { t: 'A nurse on the ground', d: 'How a Registered Nurse in Ocala can be your eyes in the home.', cap: 'Ocala and Marion County' },
];
const ALF_SLIDES = [
    { cover: true, src: '/playbook/alf-cover.webp', title: 'The Florida Assisted Living Family Guide', cap: 'The Florida Assisted Living Family Guide' },
    { t: 'Is assisted living the right level?', d: 'A needs checklist that shows when assisted living fits and when more care is needed.', cap: 'Start here' },
    { t: 'Florida license types', d: 'Plain language on what each Florida assisted living license allows.', cap: 'Know the license' },
    { t: 'Tour checklists and scorecard', d: 'What to notice, what to ask about staffing and care, and a side by side scorecard.', cap: 'Compare facilities' },
    { t: 'Understand the contract', d: 'What to look for before you sign, including rates, fees, and move out notice.', cap: 'Before you sign' },
    { t: 'Medicines, costs, and the move', d: 'What staff can and cannot do with medicines, how families pay, and a move in countdown.', cap: 'Plan the move' },
    { t: 'Rights and who to call', d: 'Resident rights and the Florida numbers to call with concerns.', cap: 'You have power' },
];
const BINDER_SLIDES = [
    { cover: true, src: '/playbook/binder-cover.webp', title: 'The Care Plan Binder', cap: 'The Care Plan Binder' },
    { t: 'Emergency card', d: 'A one page summary for the refrigerator, ready for a paramedic or ER nurse.', cap: 'Tab 1' },
    { t: 'Medicine list and schedule', d: 'Every medicine, dose, and time on a page you can bring to any visit.', cap: 'Tab 2' },
    { t: 'Contacts and health history', d: 'Your care team, health history, vital signs, and daily care notes in one place.', cap: 'Tabs 3 to 5' },
    { t: 'Appointments and visit pages', d: 'Track every visit and bring a one page summary to the doctor.', cap: 'Tab 6' },
    { t: 'Legal papers, money, and home safety', d: 'Know what documents exist and where they are, plus a home and hurricane check.', cap: 'Tabs 7 and 8' },
    { t: 'Logs and notes', d: 'Daily care logs and note pages for shared caregivers.', cap: 'Tab 9' },
];
function PlaybookCarousel({ compact = false, arrows = true, slides = PLAYBOOK_SLIDES, label = 'What The Safe Home Playbook includes' }) {
    const trackRef = useRef(null);
    const [idx, setIdx] = useState(0);
    const go = (i) => {
        const el = trackRef.current; if (!el) return;
        const n = Math.max(0, Math.min(slides.length - 1, i));
        el.scrollTo({ left: n * el.clientWidth, behavior: 'smooth' });
    };
    const onScroll = () => {
        const el = trackRef.current; if (!el) return;
        setIdx(Math.round(el.scrollLeft / el.clientWidth));
    };
    return (
        <div className={`relative mx-auto ${compact ? 'max-w-xs' : 'max-w-md'}`} role="region" aria-roledescription="carousel" aria-label={label}>
            <div ref={trackRef} onScroll={onScroll} className="flex overflow-x-auto snap-x snap-mandatory rounded-2xl shadow-xl bg-white" style={{ scrollbarWidth: 'none' }}>
                {slides.map((s, i) => (
                    <figure key={s.cap} className="snap-center shrink-0 w-full m-0" style={{ aspectRatio: '680 / 880' }} aria-label={`${i + 1} of ${slides.length}: ${s.cap}`}>
                        {s.cover ? (
                            <img src={s.src} width="680" height="880" loading={i === 0 ? 'eager' : 'lazy'} decoding="async" alt={`Cover of ${s.title} by Pierre Concierge Nursing`} className="w-full h-full block object-cover" />
                        ) : (
                            <div className="w-full h-full bg-pine text-ivory flex flex-col justify-center px-14 text-center">
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass mb-4">{i} of {slides.length - 1}</p>
                                <h3 className="font-serif text-3xl font-semibold leading-tight mb-4">{s.t}</h3>
                                <p className="text-ivory/85 leading-relaxed">{s.d}</p>
                            </div>
                        )}
                    </figure>
                ))}
            </div>
            {arrows && <button type="button" onClick={() => go(idx - 1)} disabled={idx === 0} aria-label="Previous" className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-ivory/95 text-pine shadow-lg flex items-center justify-center disabled:opacity-30"><ChevronLeft className="w-5 h-5" /></button>}
            {arrows && <button type="button" onClick={() => go(idx + 1)} disabled={idx === slides.length - 1} aria-label="Next" className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-ivory/95 text-pine shadow-lg flex items-center justify-center disabled:opacity-30"><ChevronRight className="w-5 h-5" /></button>}
            <p className="mt-3 text-center text-sm text-ink/70" aria-live="polite">{slides[idx].cap}</p>
            <div className="mt-2 flex justify-center gap-1">
                {slides.map((s, i) => (
                    <button key={s.cap} type="button" onClick={() => go(i)} aria-label={`Go to slide ${i + 1}`} className="w-6 h-6 flex items-center justify-center"><span className={`block rounded-full transition-all ${i === idx ? 'w-5 h-2 bg-pine' : 'w-2 h-2 bg-pine/25'}`} /></button>
                ))}
            </div>
        </div>
    );
}

function PlaybookAction({ light = false }) {
    const { playbookCheckoutUrl, playbookPrice } = SITE_CONFIG;
    if (playbookCheckoutUrl) {
        return (
            <PillButton href={playbookCheckoutUrl} variant={light ? 'light' : 'primary'}>
                Get the Playbook{playbookPrice ? ` · ${playbookPrice}` : ''} <ArrowRight className="w-4 h-4" />
            </PillButton>
        );
    }
    return (
        <span className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold border ${light ? 'border-ivory/40 text-ivory' : 'border-brass/60 text-pine bg-brass/10'}`}>
            <Clock className="w-4 h-4" /> Coming soon{playbookPrice ? ` · ${playbookPrice}` : ''}
        </span>
    );
}

function ProductAction({ url, price }) {
    if (url) {
        return <PillButton href={url} variant="primary">Get it{price ? ` · ${price}` : ''} <ArrowRight className="w-4 h-4" /></PillButton>;
    }
    return (
        <span className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold border border-brass/60 text-pine bg-brass/10">
            <Clock className="w-4 h-4" /> Coming soon{price ? ` · ${price}` : ''}
        </span>
    );
}

// Home page product carousel. Slow auto loop with a gentle crossfade; pauses on hover, focus, touch, or the pause button.
// Add another PDF by adding one entry here. Real guide pages are never shown, only covers and descriptions.
const PRODUCTS = [
    {
        id: 'playbook', eyebrow: 'Guide for families', title: 'The Safe Home Playbook', cover: '/playbook/p1.webp',
        blurb: 'A step by step plan for the first 14 days after surgery or a hospital stay, written by a Registered Nurse. It turns the problems families struggle with most into clear steps, scripts, and when to call for help.',
        slides: PLAYBOOK_SLIDES, points: PLAYBOOK_POINTS, href: '/safe-home-playbook', hrefLabel: 'See what is inside', priceKey: 'playbookPrice', urlKey: 'playbookCheckoutUrl',
    },
    {
        id: 'kit', eyebrow: 'Printable workbook', title: 'The Discharge Readiness Kit', cover: '/playbook/kit-cover.webp',
        blurb: 'Everything you need to bring your loved one home from the hospital with confidence. Print it, bring it to the hospital, and write the answers down as the nurse speaks.',
        points: ['Questions to ask before discharge day', 'A medication list and daily schedule', 'A home preparation checklist', 'A daily log for the first two weeks'],
        slides: KIT_SLIDES, href: '/discharge-readiness-kit', hrefLabel: 'See what is inside', priceKey: 'kitPrice', urlKey: 'kitCheckoutUrl',
    },
    {
        id: 'ldk', eyebrow: 'Kit for far away families', title: 'The Long Distance Caregiver Kit', cover: '/playbook/ldk-cover.webp',
        blurb: 'Care for a parent in Florida from anywhere. A plan for building a local team, scripts for hard calls, a check in rhythm, and a crisis plan, written by a Registered Nurse.',
        points: ['A care team sheet to share with family', 'Call scripts for parents, doctors, and neighbors', 'A weekly check in log', 'A plan for the day you get the call'],
        slides: LDK_SLIDES, href: '/long-distance-caregiver-kit', hrefLabel: 'See what is inside', priceKey: 'ldkPrice', urlKey: 'ldkCheckoutUrl',
    },
    {
        id: 'alf', eyebrow: 'Guide for families', title: 'The Florida Assisted Living Family Guide', cover: '/playbook/alf-cover.webp',
        blurb: 'How to choose, tour, pay for, and settle into an assisted living facility in Florida, with the questions that protect your parent.',
        points: ['What each Florida license allows', 'Tour checklists and a scorecard', 'What to look for in the contract', 'Rights and who to call'],
        slides: ALF_SLIDES, href: '/florida-assisted-living-family-guide', hrefLabel: 'See what is inside', priceKey: 'alfPrice', urlKey: 'alfCheckoutUrl',
    },
    {
        id: 'binder', eyebrow: 'Printable organizer', title: 'The Care Plan Binder', cover: '/playbook/binder-cover.webp',
        blurb: 'One organized place for everything about a loved one\'s care. Print it, put it in a binder, and keep it where anyone can find it.',
        points: ['An emergency card for the refrigerator', 'Medicine list and schedule', 'Contacts, appointments, and logs', 'Legal papers and home safety checks'],
        slides: BINDER_SLIDES, href: '/care-plan-binder', hrefLabel: 'See what is inside', priceKey: 'binderPrice', urlKey: 'binderCheckoutUrl',
    },
];

const BUNDLES = [
    {
        id: 'starter', eyebrow: 'Best for a hospital stay', title: 'The Starter Bundle', badge: 'Save $4',
        blurb: 'The two guides most families need first when a loved one is coming home.',
        ids: ['playbook', 'kit'], items: ['The Safe Home Playbook', 'The Discharge Readiness Kit'], was: '$53', priceKey: 'bundlePrice', urlKey: 'starterBundleUrl',
    },
    {
        id: 'shelf', eyebrow: 'Best value', title: 'The Full Shelf', badge: 'Save $77',
        blurb: 'Every guide we make, for every stage of caring for an aging parent. New guides will be added.',
        ids: ['playbook', 'kit', 'ldk', 'alf', 'binder'], items: ['The Safe Home Playbook', 'The Discharge Readiness Kit', 'The Long Distance Caregiver Kit', 'The Florida Assisted Living Family Guide', 'The Care Plan Binder'], was: '$166', priceKey: 'fullShelfPrice', urlKey: 'fullShelfUrl',
    },
];

function BundleCards() {
    return (
        <div id="bundles" className="mt-12 scroll-mt-24">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-pine mb-2 text-center">Bundles</h2>
            <p className="text-center text-sm text-ink/70 mb-6">Buy together and save.</p>
            <div className="grid md:grid-cols-2 gap-6">
                {BUNDLES.map((b) => (
                    <div key={b.id} className="bg-cream/60 border border-pine/10 rounded-3xl p-6 flex flex-col">
                        <div className="flex items-start justify-between gap-3 mb-2">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass">{b.eyebrow}</p>
                            <span className="shrink-0 rounded-full bg-pine text-ivory text-xs font-semibold px-3 py-1">{b.badge}</span>
                        </div>
                        <h3 className="font-serif text-2xl font-semibold text-pine mb-2">{b.title}</h3>
                        <p className="text-sm text-ink/80 leading-relaxed mb-4">{b.blurb}</p>
                        <ul className="space-y-2 mb-5">
                            {b.items.map((t) => (
                                <li key={t} className="flex gap-3 text-sm text-ink/80 leading-relaxed"><CheckCircle className="w-5 h-5 text-royal shrink-0" /><span>{t}</span></li>
                            ))}
                        </ul>
                        <p className="mt-auto mb-3 text-sm text-ink/70">Separately {b.was}. Together <span className="font-semibold text-pine">{SITE_CONFIG[b.priceKey]}</span>.</p>
                        <div><ProductAction url={SITE_CONFIG[b.urlKey]} price={SITE_CONFIG[b.priceKey]} /></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ProductCards() {
    return (
        <div className="space-y-8">
            {PRODUCTS.map((p) => (
                <div key={p.id} className="grid md:grid-cols-[0.8fr_1.2fr] gap-6 md:gap-10 items-center bg-cream/60 border border-pine/10 rounded-3xl p-6">
                    <PlaybookCarousel compact slides={p.slides} label={`What ${p.title} includes`} />
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass mb-2">{p.eyebrow}</p>
                        <h2 className="font-serif text-2xl font-semibold text-pine mb-2"><a href={p.href} className="hover:underline">{p.title}</a></h2>
                        <p className="text-sm text-ink/80 leading-relaxed mb-4">{p.blurb}</p>
                        <ul className="space-y-2 mb-5">
                            {p.points.map((t) => (
                                <li key={t} className="flex gap-3 text-sm text-ink/80 leading-relaxed"><CheckCircle className="w-5 h-5 text-royal shrink-0" /><span>{t}</span></li>
                            ))}
                        </ul>
                        <div className="flex flex-wrap items-center gap-4">
                            <ProductAction url={SITE_CONFIG[p.urlKey]} price={SITE_CONFIG[p.priceKey]} />
                            <a href={p.href} className="inline-flex items-center gap-1 min-h-[44px] font-semibold text-royal hover:underline">See what is inside <ArrowRight className="w-4 h-4" /></a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

const CATEGORIES = { playbook: 'recovery', kit: 'recovery', ldk: 'caregiving', alf: 'caregiving', binder: 'caregiving' };
const CATALOG_FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'recovery', label: 'Hospital and recovery' },
    { id: 'caregiving', label: 'Family caregiving' },
    { id: 'bundle', label: 'Bundles' },
];

function ProductCatalog() {
    const [filter, setFilter] = useState('all');
    const covers = Object.fromEntries(PRODUCTS.map((p) => [p.id, p.cover]));
    const items = [
        ...PRODUCTS.map((p) => ({ kind: 'product', id: p.id, cat: CATEGORIES[p.id] || 'all', title: p.title, blurb: p.blurb, href: p.href, cover: p.cover, price: SITE_CONFIG[p.priceKey], url: SITE_CONFIG[p.urlKey], tag: p.eyebrow })),
        ...BUNDLES.map((b) => ({ kind: 'bundle', id: b.id, cat: 'bundle', title: b.title, blurb: b.blurb, href: null, covers: b.ids.map((i) => covers[i]), price: SITE_CONFIG[b.priceKey], was: b.was, url: SITE_CONFIG[b.urlKey], tag: b.badge, count: b.ids.length })),
    ].filter((x) => filter === 'all' || x.cat === filter);
    return (
        <div>
            <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter products">
                {CATALOG_FILTERS.map((f) => (
                    <button key={f.id} type="button" onClick={() => setFilter(f.id)} aria-pressed={filter === f.id}
                        className={`min-h-[44px] rounded-full px-5 text-sm font-semibold border transition-colors ${filter === f.id ? 'bg-pine text-ivory border-pine' : 'bg-ivory text-pine border-pine/20 hover:border-pine/50'}`}>{f.label}</button>
                ))}
            </div>
            <ul className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 sm:gap-x-8">
                {items.map((x) => {
                    const media = x.kind === 'bundle' ? (
                        <div className="relative aspect-[17/22] bg-cream rounded-2xl overflow-hidden flex items-center justify-center">
                            {x.covers.slice(0, 3).map((c, i) => (
                                <img key={c} src={c} alt="" loading="lazy" decoding="async" width="680" height="880" className="absolute w-[46%] rounded-lg shadow-lg" style={{ transform: `translateX(${(i - 1) * 40}%) rotate(${(i - 1) * 7}deg)`, zIndex: 3 - i }} />
                            ))}
                        </div>
                    ) : (
                        <div className="aspect-[17/22] bg-cream rounded-2xl overflow-hidden flex items-center justify-center p-3 sm:p-6">
                            <img src={x.cover} alt={`Cover of ${x.title}`} loading="lazy" decoding="async" width="680" height="880" className="w-full rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-[1.03]" />
                        </div>
                    );
                    return (
                        <li key={x.id} className="group flex flex-col">
                            <div className="relative">
                                {x.href ? <a href={x.href} aria-label={`See what is inside ${x.title}`} className="block">{media}</a> : <a href="#bundle-contents" className="block" tabIndex={-1} aria-hidden="true">{media}</a>}
                                <span className="absolute top-2 left-2 rounded-full bg-ivory/95 text-pine text-[11px] font-semibold px-2.5 py-1 shadow">{x.kind === 'bundle' ? x.tag : (x.url ? 'Available' : 'Coming soon')}</span>
                            </div>
                            <h2 className="font-serif text-base sm:text-xl font-semibold text-pine mt-3 leading-snug">
                                {x.href ? <a href={x.href} className="hover:underline">{x.title}</a> : x.title}
                            </h2>
                            <p className="mt-1 text-sm text-ink/70 leading-snug">
                                {x.kind === 'bundle' ? `${x.count} guides in one` : x.tag}
                            </p>
                            <p className="mt-2 text-sm">
                                <span className="font-semibold text-pine text-base">{x.price}</span>
                                {x.was && <span className="ml-2 text-ink/50 line-through">{x.was}</span>}
                            </p>
                            <div className="mt-3 mt-auto pt-3 flex flex-wrap items-center gap-3">
                                {x.url
                                    ? <ProductAction url={x.url} price={x.price} />
                                    : <span className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold border border-brass/60 text-pine bg-brass/10"><Clock className="w-3.5 h-3.5" /> Coming soon</span>}
                                {x.href && <a href={x.href} className="inline-flex items-center gap-1 min-h-[44px] text-sm font-semibold text-royal hover:underline">See inside <ArrowRight className="w-4 h-4" /></a>}
                            </div>
                        </li>
                    );
                })}
            </ul>
            {(filter === 'all' || filter === 'bundle') && (
                <div id="bundle-contents" className="mt-14 grid md:grid-cols-2 gap-6 scroll-mt-24">
                    {BUNDLES.map((b) => (
                        <div key={b.id} className="bg-cream/60 border border-pine/10 rounded-3xl p-6">
                            <h3 className="font-serif text-xl font-semibold text-pine mb-1">{b.title} includes</h3>
                            <p className="text-xs text-ink/60 mb-3">Separately {b.was}. Together {SITE_CONFIG[b.priceKey]}.</p>
                            <ul className="space-y-2">
                                {b.items.map((t) => (<li key={t} className="flex gap-3 text-sm text-ink/80"><CheckCircle className="w-5 h-5 text-royal shrink-0" /><span>{t}</span></li>))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function PlaybookCTA({ standalone = false }) {
    const [idx, setIdx] = useState(0);
    const [paused, setPaused] = useState(false);
    const [reduced, setReduced] = useState(true);
    const hold = useRef(false);
    const swipe = useRef(null);
    useEffect(() => {
        const q = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReduced(q.matches);
        const on = (e) => setReduced(e.matches);
        q.addEventListener && q.addEventListener('change', on);
        return () => q.removeEventListener && q.removeEventListener('change', on);
    }, []);
    useEffect(() => {
        if (paused || reduced) return undefined;
        const t = setInterval(() => { if (!hold.current) setIdx((i) => (i + 1) % PRODUCTS.length); }, 9000);
        return () => clearInterval(t);
    }, [paused, reduced]);
    const go = (i) => setIdx((i + PRODUCTS.length) % PRODUCTS.length);
    const { bundlePrice } = SITE_CONFIG;
    return (
        <section className={standalone ? 'py-4' : 'bg-ivory py-16 md:py-20'}>
            <div className={standalone ? 'max-w-5xl mx-auto' : 'reveal max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'}>
                {!standalone && (
                <div className="text-center mb-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass mb-3">Our products</p>
                    <h2 className="font-serif text-3xl md:text-4xl font-semibold text-pine leading-tight">Guides for the first weeks at home</h2>
                    <a href="/products" className="mt-3 inline-flex items-center gap-1 min-h-[44px] font-semibold text-royal hover:underline">See all our products <ArrowRight className="w-4 h-4" /></a>
                </div>
                )}
                <div className="relative bg-cream/60 border border-pine/10 rounded-[2rem] p-6 md:p-10"
                    role="region" aria-roledescription="carousel" aria-label="Guides for families"
                    onMouseEnter={() => { hold.current = true; }} onMouseLeave={() => { hold.current = false; }}
                    onFocus={() => { hold.current = true; }} onBlur={() => { hold.current = false; }}
                    onTouchStart={(e) => { hold.current = true; const t = e.touches[0]; swipe.current = e.target.closest('[aria-roledescription="carousel"] [aria-roledescription="carousel"]') ? null : { x: t.clientX, y: t.clientY }; }}
                    onTouchEnd={(e) => { const s = swipe.current; swipe.current = null; if (s) { const t = e.changedTouches[0]; const dx = t.clientX - s.x; if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(t.clientY - s.y) * 1.5) go(idx + (dx < 0 ? 1 : -1)); } setTimeout(() => { hold.current = false; }, 4000); }}>
                    <button type="button" onClick={() => go(idx - 1)} aria-label="Previous guide" className="absolute z-10 left-1 md:-left-5 lg:-left-16 top-[24%] md:top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-ivory/95 text-pine shadow-lg flex items-center justify-center hover:bg-white"><ChevronLeft className="w-5 h-5" /></button>
                    <button type="button" onClick={() => go(idx + 1)} aria-label="Next guide" className="absolute z-10 right-1 md:-right-5 lg:-right-16 top-[24%] md:top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-ivory/95 text-pine shadow-lg flex items-center justify-center hover:bg-white"><ChevronRight className="w-5 h-5" /></button>
                    <div className="grid">
                        {PRODUCTS.map((p, i) => {
                            const active = i === idx;
                            return (
                                <div key={p.id} aria-hidden={!active} {...(!active ? { inert: '' } : {})}
                                    className={`[grid-area:1/1] grid md:grid-cols-[0.8fr_1.2fr] gap-8 md:gap-12 items-center transition-opacity duration-[2200ms] ease-in-out ${active ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                                    <PlaybookCarousel compact arrows={false} slides={p.slides} label={`What ${p.title} includes`} />
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass mb-3">{p.eyebrow}</p>
                                        <h3 className="font-serif text-3xl md:text-4xl font-semibold text-pine leading-tight mb-3">{p.title}</h3>
                                        <p className="text-ink/80 leading-relaxed mb-5">{p.blurb}</p>
                                        <ul className="space-y-2 mb-6">
                                            {p.points.map((t) => (
                                                <li key={t} className="flex gap-3 text-sm text-ink/80 leading-relaxed"><CheckCircle className="w-5 h-5 text-royal shrink-0" /><span>{t}</span></li>
                                            ))}
                                        </ul>
                                        <div className="flex flex-wrap items-center gap-4">
                                            <ProductAction url={SITE_CONFIG[p.urlKey]} price={SITE_CONFIG[p.priceKey]} />
                                            {p.href && <a href={p.href} className="inline-flex items-center gap-1 min-h-[44px] font-semibold text-royal hover:underline">{p.hrefLabel} <ArrowRight className="w-4 h-4" /></a>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-8 flex items-center justify-center gap-1">
                        {PRODUCTS.map((p, i) => (
                            <button key={p.id} type="button" onClick={() => go(i)} aria-label={`Show ${p.title}`} className="w-8 h-11 flex items-center justify-center"><span className={`block rounded-full transition-all ${i === idx ? 'w-6 h-2 bg-pine' : 'w-2 h-2 bg-pine/25'}`} /></button>
                        ))}
                        {!reduced && (
                            <button type="button" onClick={() => setPaused((v) => !v)} aria-label={paused ? 'Play slideshow' : 'Pause slideshow'} className="ml-2 min-h-[44px] px-3 text-xs font-semibold text-pine/70 hover:text-pine">{paused ? 'Play' : 'Pause'}</button>
                        )}
                    </div>
                    <p className="sr-only" aria-live="polite">{PRODUCTS[idx].title}</p>
                    {bundlePrice && <p className="mt-2 text-center text-sm text-ink/70">Bundles from {bundlePrice}. <a href="/products#bundles" className="font-semibold text-royal hover:underline">See the bundles</a></p>}
                </div>
            </div>
        </section>
    );
}

function ChecklistCTA() {
    return (
        <section className="bg-cream/50 py-16">
            <div className="reveal max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-pine text-ivory rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-ivory/10 flex items-center justify-center shrink-0"><Download className="w-7 h-7" /></div>
                    <div className="flex-grow">
                        <h3 className="font-serif text-2xl font-semibold mb-2">Free: Going Home After Surgery checklist</h3>
                        <p className="text-ivory/80 text-sm leading-relaxed">Questions to ask before discharge and a simple plan for the first 72 hours. Print it and bring it to the hospital.</p>
                    </div>
                    <PillButton href={SITE_CONFIG.checklistUrl} variant="light">Open the checklist <ArrowRight className="w-4 h-4" /></PillButton>
                </div>
            </div>
        </section>
    );
}

// --- Service detail page -----------------------------------------
// Banner at the top of a treatment page. Plays a silent looping video when one
// exists, unless the visitor prefers reduced motion; the still image is the
// poster and the fallback.
function ServiceBanner({ detail }) {
    const [reduceMotion, setReduceMotion] = useState(false);
    useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return;
        const q = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReduceMotion(q.matches);
    }, []);
    const cls = 'w-full rounded-3xl object-cover aspect-[16/9] shadow-lg shadow-pine/10';
    if (detail.video && !reduceMotion) {
        return (
            <video className={cls} poster={detail.image} autoPlay muted loop playsInline preload="metadata" aria-label={detail.imageAlt}>
                <source src={detail.video} type="video/mp4" />
            </video>
        );
    }
    return <img src={detail.image} alt={detail.imageAlt} width="1600" height="900" className={cls} />;
}


// --- Locally focused content pages (compare, conditions, areas, etc.) ---
function LocalFaq({ faqs }) {
    const [open, setOpen] = useState(0);
    // The knowledge base build sets this flag so every answer is rendered. It is unset on the live site.
    const expandAll = typeof globalThis !== 'undefined' && globalThis.__KB_EXPAND_ALL__ === true;
    return (
        <div className="space-y-3">
            {faqs.map(({ q, a }, i) => {
                const isOpen = open === i || expandAll;
                return (
                    <div key={q} className="bg-ivory rounded-2xl border border-pine/10 overflow-hidden">
                        <button onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen} className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left">
                            <span className={`font-serif text-lg font-semibold ${isOpen ? 'text-royal' : 'text-pine'}`}>{q}</span>
                            <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isOpen ? 'bg-pine text-ivory' : 'bg-pine/5 text-pine'}`}>
                                {isOpen ? <X className="w-4 h-4" /> : <HelpCircle className="w-4 h-4" />}
                            </span>
                        </button>
                        {isOpen && <p className="px-6 pb-6 text-ink/75 leading-relaxed text-[0.95rem]">{a}</p>}
                    </div>
                );
            })}
        </div>
    );
}

function LocalSection({ section }) {
    const { h, p, ul, steps, table, note, link, links, features } = section;
    return (
        <div className="mb-10">
            {h && <h2 className="font-serif text-2xl font-semibold text-pine mb-4">{h}</h2>}
            {p && p.map((t) => <p key={t} className="text-ink/80 leading-relaxed mb-4">{t}</p>)}
            {ul && (
                <ul className="space-y-2.5 mb-2">
                    {ul.map((t) => (
                        <li key={t} className="flex gap-3 text-ink/80 leading-relaxed">
                            <CheckCircle className="w-5 h-5 text-brass shrink-0 mt-0.5" />
                            <span>{t}</span>
                        </li>
                    ))}
                </ul>
            )}
            {steps && (
                <ol className="space-y-4">
                    {steps.map((t, i) => (
                        <li key={t} className="flex gap-4 items-start">
                            <span className="w-8 h-8 rounded-full bg-pine text-ivory flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</span>
                            <span className="text-ink/80 leading-relaxed pt-1">{t}</span>
                        </li>
                    ))}
                </ol>
            )}
            {table && (
                <div className="overflow-x-auto rounded-2xl border border-pine/10">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-pine text-ivory">
                            <tr>{table.cols.map((c, i) => <th key={i} className="px-4 py-3 font-semibold">{c}</th>)}</tr>
                        </thead>
                        <tbody>
                            {table.rows.map((row, ri) => (
                                <tr key={ri} className="border-t border-pine/10 odd:bg-ivory even:bg-cream/50">
                                    {row.map((c, ci) => <td key={ci} className={`px-4 py-3 ${ci === 0 ? 'font-semibold text-pine' : 'text-ink/80'}`}>{c}</td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {note && (
                <p className="flex gap-3 items-start rounded-2xl bg-cream/70 border border-pine/10 px-5 py-4 text-sm text-pine">
                    <ShieldAlert className="w-5 h-5 text-brass shrink-0 mt-0.5" />
                    <span>{note}</span>
                </p>
            )}
            {features && (
                <div className="grid sm:grid-cols-2 gap-4">
                    {features.map((f) => (
                        <div key={f.t} className="rounded-2xl bg-cream/60 border border-pine/10 p-5">
                            <h3 className="font-serif text-lg font-semibold text-pine mb-1">{f.t}</h3>
                            <p className="text-sm text-ink/75 leading-relaxed">{f.d}</p>
                        </div>
                    ))}
                </div>
            )}
            {links && (
                <div className="flex flex-wrap gap-2.5">
                    {links.map((l) => (
                        <a key={l.href} href={l.href} className="px-4 py-2 rounded-full bg-ivory border border-pine/10 text-sm font-semibold text-pine hover:bg-pine hover:text-ivory transition-colors">{l.label}</a>
                    ))}
                </div>
            )}
            {link && <a href={link.href} className="inline-flex items-center gap-2 font-semibold text-royal hover:underline">{link.label} <ArrowRight className="w-4 h-4" /></a>}
        </div>
    );
}

function LocalPage({ found, openBooking }) {
    const { page, kind, base, siblings } = found;
    const parentLabel = { '/compare': 'Compare care options', '/conditions': 'Conditions', '/care-settings': 'Care settings', '/areas': 'Areas we serve', '/paying-for-care': 'Paying for care' }[base];
    return (
        <>
            <section className="bg-ivory pt-14 pb-6 md:pt-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    {kind === 'detail' && (
                        <a href={base} className="inline-flex items-center gap-1 text-sm font-semibold text-royal hover:underline mb-5">← {parentLabel}</a>
                    )}
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass mb-4">{page.eyebrow}</p>
                    <h1 className="font-serif text-4xl md:text-5xl font-semibold text-pine leading-tight mb-4">{page.title}</h1>
                    {page.intro && <p className="text-lg text-ink/80 leading-relaxed">{page.intro}</p>}
                    {page.path === '/safe-home-playbook' && <div className="mt-6"><PlaybookAction /></div>}
                    {page.path === '/long-distance-caregiver-kit' && <div className="mt-6"><ProductAction url={SITE_CONFIG.ldkCheckoutUrl} price={SITE_CONFIG.ldkPrice} /></div>}
                    {page.path === '/florida-assisted-living-family-guide' && <div className="mt-6"><ProductAction url={SITE_CONFIG.alfCheckoutUrl} price={SITE_CONFIG.alfPrice} /></div>}
                    {page.path === '/care-plan-binder' && <div className="mt-6"><ProductAction url={SITE_CONFIG.binderCheckoutUrl} price={SITE_CONFIG.binderPrice} /></div>}
                    {page.path === '/discharge-readiness-kit' && <div className="mt-6"><ProductAction url={SITE_CONFIG.kitCheckoutUrl} price={SITE_CONFIG.kitPrice} /></div>}
                </div>
            </section>

            <section className="bg-ivory py-10">
                <div className={`${page.path === '/products' ? 'max-w-6xl' : 'max-w-3xl'} mx-auto px-4 sm:px-6 lg:px-8`}>
                    {page.path === '/products' ? (
                        <>
                            <ProductCatalog />
                            {page.faqs && page.faqs.length > 0 && (
                                <div className="mt-12">
                                    <h2 className="font-serif text-2xl font-semibold text-pine mb-4">Questions, answered</h2>
                                    <LocalFaq faqs={page.faqs} />
                                </div>
                            )}
                            <p className="mt-10 text-xs text-ink/60 leading-relaxed">These guides are general information, not medical advice. Always follow the instructions of your own doctor. In a medical emergency, call 911.</p>
                        </>
                    ) : kind === 'index' ? (
                        <div className="grid sm:grid-cols-2 gap-5">
                            {page.items.map((it) => (
                                <a key={it.slug} href={`${page.base}/${it.slug}`} className="group block bg-cream/60 border border-pine/10 rounded-3xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition">
                                    <h2 className="font-serif text-xl font-semibold text-pine mb-2 group-hover:text-royal">{it.title}</h2>
                                    <p className="text-sm text-ink/70 leading-relaxed mb-4">{it.intro}</p>
                                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-royal">Read more <ArrowRight className="w-4 h-4" /></span>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <>
                            {page.path === '/safe-home-playbook' && <div className="mb-12"><PlaybookCarousel /></div>}
                            {page.path === '/long-distance-caregiver-kit' && <div className="mb-12"><PlaybookCarousel slides={LDK_SLIDES} label="What The Long Distance Caregiver Kit includes" /></div>}
                            {page.path === '/florida-assisted-living-family-guide' && <div className="mb-12"><PlaybookCarousel slides={ALF_SLIDES} label="What The Florida Assisted Living Family Guide includes" /></div>}
                            {page.path === '/care-plan-binder' && <div className="mb-12"><PlaybookCarousel slides={BINDER_SLIDES} label="What The Care Plan Binder includes" /></div>}
                            {page.path === '/discharge-readiness-kit' && <div className="mb-12"><PlaybookCarousel slides={KIT_SLIDES} label="What The Discharge Readiness Kit includes" /></div>}
                            {page.sections.map((sec, i) => <LocalSection key={i} section={sec} />)}
                            {page.faqs && page.faqs.length > 0 && (
                                <div className="mt-12">
                                    <h2 className="font-serif text-2xl font-semibold text-pine mb-4">Questions, answered</h2>
                                    <LocalFaq faqs={page.faqs} />
                                </div>
                            )}
                            <p className="mt-10 text-xs text-ink/60 leading-relaxed">
                                This page is general information, not medical advice. Always follow the instructions of your own doctor. Services are non-emergency. In a medical emergency, call 911.
                            </p>
                        </>
                    )}
                </div>
            </section>

            {kind === 'detail' && siblings && (
                <section className="bg-cream/50 py-12">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="font-serif text-xl font-semibold text-pine mb-4">More in {parentLabel}</h2>
                        <div className="flex flex-wrap gap-2.5">
                            {siblings.filter((x) => x.slug !== page.slug).map((x) => (
                                <a key={x.slug} href={`${base}/${x.slug}`} className="px-4 py-2 rounded-full bg-ivory border border-pine/10 text-sm font-semibold text-pine hover:bg-pine hover:text-ivory transition-colors">{x.title}</a>
                            ))}
                        </div>
                    </div>
                </section>
            )}
            <FinalCTA openBooking={openBooking} />
        </>
    );
}


function ServicePage({ slug, openBooking }) {
    const detail = SERVICE_BY_SLUG[slug];
    const service = SERVICES.find((x) => x.title === detail?.title);
    if (!detail || !service) {
        return (
            <section className="bg-ivory py-28 text-center">
                <h1 className="font-serif text-3xl font-semibold text-pine mb-4">Page not found</h1>
                <PillButton href="/services">See all services</PillButton>
            </section>
        );
    }
    const Icon = service.icon;
    const others = SERVICES.filter((x) => x.title !== detail.title);
    const List = ({ items }) => (
        <ul className="space-y-3">
            {items.map((t) => (
                <li key={t} className="flex items-start gap-3 text-ink/80 leading-relaxed">
                    <CheckCircle className="w-5 h-5 text-brass shrink-0 mt-0.5" /> <span>{t}</span>
                </li>
            ))}
        </ul>
    );
    return (
        <>
            <section className="bg-ivory pt-12 pb-10 md:pt-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <a href="/services" className="inline-flex items-center gap-1 text-sm font-semibold text-royal hover:text-royal-dark mb-8">
                        <ArrowRight className="w-4 h-4 rotate-180" /> All services
                    </a>
                    <div className="flex items-center gap-4 mb-5">
                        <div className="w-14 h-14 rounded-2xl bg-pine text-ivory flex items-center justify-center"><Icon className="w-7 h-7" /></div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass">Service</p>
                    </div>
                    <h1 className="font-serif text-4xl md:text-5xl font-semibold text-pine leading-tight mb-5">{detail.title}</h1>
                    <p className="text-lg text-ink/80 leading-relaxed mb-8">{detail.intro}</p>
                    <div className="flex flex-wrap items-center gap-4">
                        <PillButton onClick={() => openBooking(service.tag)}>{service.tag} <ArrowRight className="w-4 h-4" /></PillButton>
                        <PillButton href="tel:+17543676929" variant="outline"><Phone className="w-4 h-4" /> (754) 367-6929</PillButton>
                        <span className="font-bold text-pine text-lg">{service.price}</span>
                    </div>
                    <div className="mt-6 flex items-start gap-3 rounded-2xl border border-pine/15 bg-cream/60 p-4">
                        <FileText className="w-5 h-5 text-brass shrink-0 mt-0.5" />
                        <p className="text-sm leading-relaxed text-ink/85">
                            <span className="font-semibold text-pine">Physician's order: {ORDER_LABEL[detail.orderLevel]}.</span>{' '}
                            {detail.orderText}
                        </p>
                    </div>
                </div>
            </section>

            {detail.image && (
                <section className="bg-ivory pb-4">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <ServiceBanner detail={detail} />
                    </div>
                </section>
            )}

            <section className="bg-cream/50 py-14">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10 md:grid-cols-2">
                    <div>
                        <h2 className="font-serif text-2xl font-semibold text-pine mb-4">Who it is for</h2>
                        <List items={detail.whoFor} />
                    </div>
                    <div>
                        <h2 className="font-serif text-2xl font-semibold text-pine mb-4">What to have ready</h2>
                        <List items={detail.bring} />
                    </div>
                </div>
            </section>

            <section className="bg-ivory py-14">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="font-serif text-2xl font-semibold text-pine mb-6">What happens during a visit</h2>
                    <ol className="space-y-4">
                        {detail.visit.map((t, i) => (
                            <li key={t} className="flex items-start gap-4 bg-cream/60 border border-pine/10 rounded-2xl p-5">
                                <span className="font-serif text-brass text-2xl leading-none w-8 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                                <span className="text-ink/85 leading-relaxed">{t}</span>
                            </li>
                        ))}
                    </ol>
                    <div className="mt-8 rounded-2xl bg-pine text-ivory p-6 leading-relaxed">
                        <p className="font-semibold mb-1">Good to know</p>
                        <p className="text-ivory/85">{detail.note}</p>
                    </div>
                    <p className="text-xs text-ink/70 mt-6">
                        This page is general information, not medical advice. Always follow the instructions of your own doctor. Services are non-emergency. In a medical emergency, call 911.
                    </p>
                </div>
            </section>

            <section className="bg-cream/50 py-14">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="font-serif text-2xl font-semibold text-pine mb-6">Other services</h2>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {others.map(({ title }) => (
                            <a key={title} href={`/services/${SLUG_BY_TITLE[title]}`} className="bg-ivory border border-pine/10 rounded-2xl px-5 py-4 font-semibold text-pine hover:border-pine/30 hover:shadow-md transition-all flex items-center justify-between">
                                {title} <ChevronRight className="w-4 h-4 text-brass" />
                            </a>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

// Decorative background that responds to scrolling (and to the mouse on desktop).
// Only transform and opacity change, it never intercepts clicks, and it stays still for reduced motion.
function ScrollBackdrop() {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        let raf = 0, px = 0, py = 0;
        const update = () => {
            raf = 0;
            const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
            el.style.setProperty('--sp', Math.min(1, window.scrollY / max).toFixed(4));
            el.style.setProperty('--px', px.toFixed(3));
            el.style.setProperty('--py', py.toFixed(3));
        };
        const queue = () => { if (!raf) raf = requestAnimationFrame(update); };
        const onMove = (e) => { px = e.clientX / window.innerWidth - 0.5; py = e.clientY / window.innerHeight - 0.5; queue(); };
        update();
        window.addEventListener('scroll', queue, { passive: true });
        window.addEventListener('resize', queue);
        window.addEventListener('pointermove', onMove, { passive: true });
        return () => {
            window.removeEventListener('scroll', queue);
            window.removeEventListener('resize', queue);
            window.removeEventListener('pointermove', onMove);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);
    return (
        <div ref={ref} className="scroll-backdrop" aria-hidden="true">
            <div className="sb-glow sb-glow-gold"><div className="sb-idle sb-idle-a" /></div>
            <div className="sb-glow sb-glow-green"><div className="sb-idle sb-idle-b" /></div>
            <div className="sb-mark"><img className="sb-idle sb-idle-c" src="/logo-mark-bg.webp" alt="" width="390" height="465" /></div>
        </div>
    );
}

// --- Standalone pages ---------------------------------------------
function PageHeader({ eyebrow, title, subtitle }) {
    return (
        <section className="bg-ivory pt-14 pb-6 md:pt-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass mb-4">{eyebrow}</p>
                <h1 className="font-serif text-4xl md:text-5xl font-semibold text-pine leading-tight mb-4">{title}</h1>
                {subtitle && <p className="text-lg text-ink/80 leading-relaxed">{subtitle}</p>}
            </div>
        </section>
    );
}

const PAGE_HEADERS = {
    '/services': { eyebrow: 'Services', title: 'Our nursing services', subtitle: 'Ten ways we bring professional nursing care to your home. Choose a service to see exactly what it involves.' },
    '/pricing': { eyebrow: 'Pricing', title: 'Plans and per visit rates', subtitle: 'Pay per visit or choose the monthly Care Plan. Posted prices, no surprises.' },
    '/about': { eyebrow: 'About', title: 'Meet your nurse', subtitle: 'Elda Marie Pierre, RN, BSN, and the care philosophy behind Pierre Concierge Nursing.' },
    '/our-values': { eyebrow: 'About', title: 'Our values', subtitle: 'Why Pierre Concierge Nursing exists, and the principles behind every visit.' },
    '/privacy-practices': { eyebrow: 'Privacy', title: 'HIPAA Notice of Privacy Practices', subtitle: 'How your health information is used, shared, and protected, and the rights you have.' },
    '/faq': { eyebrow: 'FAQ', title: 'Frequently asked questions', subtitle: 'Insurance, payment, physician orders, and how a visit works.' },
};

function BookingModal({ isOpen, onClose, service }) {
    const [submitted, setSubmitted] = useState(false);
    const [status, setStatus] = useState('idle'); // idle | sending | error
    const [errorMsg, setErrorMsg] = useState('');
    useEffect(() => { if (isOpen) { setSubmitted(false); setStatus('idle'); setErrorMsg(''); } }, [isOpen]);

    useEffect(() => {
        if (errorMsg) document.getElementById('booking-error')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, [errorMsg]);

    const sendRequest = async (e) => {
        e.preventDefault();
        if (status === 'sending') return;
        const fd = new FormData(e.currentTarget);
        setStatus('sending');
        setErrorMsg('');
        try {
            const res = await fetch('/api/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: fd.get('name'),
                    phone: fd.get('phone'),
                    when: fd.get('when'),
                    order: fd.get('order'),
                    notes: fd.get('notes'),
                    website: fd.get('website'),
                    service,
                    page: window.location.pathname,
                }),
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok && data.ok) { setSubmitted(true); setStatus('idle'); return; }
            setErrorMsg(data.error === 'invalid'
                ? 'Please check your name and a phone number with area code, then try again.'
                : 'We could not send your request just now. Please call or text (754) 367-6929 and Elda will help you right away.');
        } catch {
            setErrorMsg('We could not send your request just now. Please call or text (754) 367-6929 and Elda will help you right away.');
        }
        setStatus('error');
    };
    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && onClose();
        if (isOpen) window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

    const dialogRef = useRef(null);
    useEffect(() => {
        if (!isOpen) return;
        const prev = document.activeElement;
        const node = dialogRef.current;
        const focusables = () => node ? [...node.querySelectorAll('a[href],button:not([disabled]),input,select,textarea')] : [];
        (focusables()[1] || focusables()[0])?.focus();
        const trap = (e) => {
            if (e.key !== 'Tab') return;
            const f = focusables();
            if (!f.length) return;
            const first = f[0], last = f[f.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        };
        document.addEventListener('keydown', trap);
        return () => { document.removeEventListener('keydown', trap); prev && prev.focus && prev.focus(); };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-pine-dark/70 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="booking-title"
                className="bg-ivory rounded-[1.75rem] shadow-2xl max-w-lg w-full p-7 md:p-9 relative animate-fade-up max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} aria-label="Close" className="absolute top-5 right-5 w-11 h-11 rounded-full bg-pine/5 text-pine/60 hover:bg-pine/15 hover:text-pine flex items-center justify-center transition-colors">
                    <X size={18} />
                </button>

                {submitted ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 rounded-full bg-pine text-ivory flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <h3 className="font-serif text-2xl font-semibold text-pine mb-3">Request received</h3>
                        <p className="text-ink/75 leading-relaxed mb-8">
                            Thank you! Elda will contact you shortly to confirm details, timing, and pricing for your
                            <span className="text-pine font-semibold"> {service}</span>.
                        </p>
                        <PillButton onClick={onClose} className="w-full">Done</PillButton>
                    </div>
                ) : (
                    <>
                        <div className="mb-7">
                            <div className="w-12 h-12 rounded-2xl bg-pine/5 text-pine flex items-center justify-center mb-4">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <h2 id="booking-title" className="font-serif text-2xl font-semibold text-pine">Request an appointment</h2>
                            <p className="text-ink/70 text-sm mt-1.5">
                                You're requesting: <span className="text-royal font-semibold">{service}</span>
                            </p>
                        </div>

                        <form className="space-y-4" onSubmit={sendRequest}>
                            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
                                <label>Leave this empty<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-pine mb-1.5">Full Name</label>
                                <input required name="name" autoComplete="name" maxLength={120} type="text" placeholder="Jane Doe" className="w-full px-4 py-3 rounded-xl border border-pine/15 bg-white focus:ring-2 focus:ring-royal/40 focus:border-royal outline-none transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-pine mb-1.5">Phone Number</label>
                                <input required name="phone" autoComplete="tel" maxLength={40} type="tel" placeholder="(555) 123-4567" className="w-full px-4 py-3 rounded-xl border border-pine/15 bg-white focus:ring-2 focus:ring-royal/40 focus:border-royal outline-none transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-pine mb-1.5">Preferred Date / Time</label>
                                <input name="when" maxLength={200} type="text" placeholder="e.g. Monday morning" className="w-full px-4 py-3 rounded-xl border border-pine/15 bg-white focus:ring-2 focus:ring-royal/40 focus:border-royal outline-none transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-pine mb-1.5">Do you have a physician's order for this care?</label>
                                <select name="order" defaultValue="" className="w-full px-4 py-3 rounded-xl border border-pine/15 bg-white focus:ring-2 focus:ring-royal/40 focus:border-royal outline-none transition">
                                    <option value="" disabled>Select one</option>
                                    <option>Yes, I have an order</option>
                                    <option>Not yet, I am waiting on one</option>
                                    <option>I am not sure if I need one</option>
                                    <option>No order needed (assessment or check in)</option>
                                </select>
                                <p className="text-xs text-ink/70 mt-1.5">Medications, IV therapy, injections, and wound treatments require your doctor's order. Elda will confirm this with you.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-pine mb-1.5">Notes <span className="text-ink/55 font-normal">(optional)</span></label>
                                <textarea name="notes" maxLength={1500} rows="3" placeholder="Please keep medical details brief. Elda will ask the rest by phone." className="w-full px-4 py-3 rounded-xl border border-pine/15 bg-white focus:ring-2 focus:ring-royal/40 focus:border-royal outline-none transition resize-none" />
                            </div>

                            <p className="rounded-xl bg-cream/70 border border-pine/10 px-4 py-3 text-sm text-pine">
                                <strong>Emergency?</strong> Do not use this form. If you or someone you care for is having a medical emergency, call <a href="tel:911" className="font-bold underline">911</a> right away.
                            </p>

                            {errorMsg && (
                                <p id="booking-error" role="alert" className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900">{errorMsg}</p>
                            )}
                            <PillButton type="submit" disabled={status === 'sending'} className="w-full py-4 text-base">
                                {status === 'sending' ? 'Sending…' : <>Send Request <ArrowRight className="w-4 h-4" /></>}
                            </PillButton>
                            <p className="text-xs text-center text-ink/60">Please do not include detailed medical information here. Your details are used only to contact you. <a href="/privacy-practices" className="text-royal font-semibold underline">Privacy notice</a></p>
                            <p className="text-xs text-center text-ink/60">Prefer to talk? <a href="tel:+17543676929" className="text-royal font-semibold">Call (754) 367-6929</a></p>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

// --- Nav ---------------------------------------------------------

function MobileGroup({ item, current, onNavigate, depth = 0 }) {
    const isActive = (href) => current === href || current.startsWith(href + '/');
    const hasKids = item.children && item.children.length > 0;
    const [open, setOpen] = useState(() => hasKids && item.children.some((c) => (c.href && isActive(c.href)) || (c.children && c.children.some((g) => isActive(g.href)))));
    const pad = depth === 0 ? 'px-4' : depth === 1 ? 'pl-8 pr-4' : 'pl-12 pr-4';
    if (!hasKids) {
        return (
            <a href={item.href} onClick={onNavigate} aria-current={current === item.href ? 'page' : undefined} className={`flex items-center min-h-[48px] ${pad} font-semibold ${depth === 0 ? 'text-pine text-base' : 'text-pine/90 text-[0.95rem]'} hover:bg-pine/5 transition-colors`}>
                {item.label}
            </a>
        );
    }
    return (
        <div className={open && depth === 0 ? 'bg-cream/60' : ''}>
            <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className={`w-full flex items-center justify-between min-h-[48px] ${pad} font-semibold text-left ${open ? 'text-royal' : 'text-pine'} ${depth === 0 ? 'text-base' : 'text-[0.95rem]'} hover:bg-pine/5 transition-colors`}>
                <span>{item.label}</span>
                <ChevronDown className={`w-4 h-4 text-brass transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div className="pb-2">
                    {item.href && (
                        <a href={item.href} onClick={onNavigate} className={`flex items-center min-h-[44px] ${depth === 0 ? 'pl-8' : 'pl-12'} pr-4 text-[0.95rem] font-semibold text-pine hover:bg-pine/5`}>All {item.label}</a>
                    )}
                    {item.children.map((c) => <MobileGroup key={c.label} item={c} current={current} onNavigate={onNavigate} depth={depth + 1} />)}
                </div>
            )}
        </div>
    );
}

function Nav({ openBooking, path = '/' }) {
    const current = path.replace(/\/+$/, '') || '/';
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const links = [
        { label: 'Services', href: '/services' },
        { label: 'Conditions', href: '/conditions' },
        { label: 'Areas', href: '/areas' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Our Products', href: '/products' },
        { label: 'About', href: '/about' },
    ];
    const moreLinks = [
        { label: 'Our Values', href: '/our-values' },
        { label: 'Care Settings', href: '/care-settings' },
        { label: 'Compare Care Options', href: '/compare' },
        { label: 'Paying for Care', href: '/paying-for-care' },
        { label: 'How It Works', href: '/how-it-works' },
        { label: 'Resources', href: '/resources' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Contact', href: '/contact' },
    ];
    const moreActive = moreLinks.some(({ href }) => current === href || current.startsWith(href + '/'));
    const kids = (list, base) => list.map((x) => ({ label: x.title, href: `${base}/${x.slug}` }));
    const mobileItems = [
        { label: 'Home', href: '/' },
        { label: 'About', children: [{ label: 'About Elda', href: '/about' }, { label: 'Our Values', href: '/our-values' }] },
        { label: 'Services', href: '/services', children: Object.values(SERVICE_BY_SLUG).map((x) => ({ label: x.title, href: `/services/${x.slug}` })) },
        { label: 'Care Settings', href: '/care-settings', children: kids(SETTING_PAGES, '/care-settings') },
        { label: 'Conditions', href: '/conditions', children: kids(CONDITION_PAGES, '/conditions') },
        { label: 'Areas', href: '/areas', children: kids(AREA_PAGES, '/areas') },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Our Products', href: '/products', children: [{ label: 'The Safe Home Playbook', href: '/safe-home-playbook' }, { label: 'The Discharge Readiness Kit', href: '/discharge-readiness-kit' }, { label: 'The Long Distance Caregiver Kit', href: '/long-distance-caregiver-kit' }, { label: 'The Florida Assisted Living Family Guide', href: '/florida-assisted-living-family-guide' }, { label: 'The Care Plan Binder', href: '/care-plan-binder' }] },
        { label: 'How It Works', href: '/how-it-works' },
        { label: 'FAQs', href: '/faq' },
        { label: 'More', children: [
            { label: 'Compare Care Options', href: '/compare', children: kids(COMPARE_PAGES, '/compare') },
            { label: 'Paying for Care', href: '/paying-for-care', children: kids(PAYING_PAGES, '/paying-for-care') },
            { label: 'Resources', href: '/resources' },
            { label: 'Accessibility', href: '/accessibility' },
            { label: 'Privacy (HIPAA)', href: '/privacy-practices' },
            { label: 'Policies', href: '/policies' },
            { label: 'Contact', href: '/contact' },
        ] },
    ];

    return (
        <>
            {/* announcement bar: looping ticker (static for reduced motion) */}
            <div className="ticker bg-pine text-ivory/90 text-xs font-medium tracking-wide" role="region" aria-label="Announcements">
                <div className="ticker-track">
                    {[0, 1, 2, 3, 4, 5].map((n) => (
                        <span className="ticker-item" key={n} aria-hidden={n > 0 ? 'true' : undefined}>
                            Now serving Ocala &amp; Marion County — <a href="tel:+17543676929" tabIndex={n > 0 ? -1 : undefined} className="inline-block py-[15px] px-1 text-sand font-semibold hover:text-ivory transition-colors">call or text (754) 367-6929</a>
                            <span className="mx-4 text-ivory/40">•</span>
                            Medical emergency? <a href="tel:911" tabIndex={n > 0 ? -1 : undefined} className="inline-block py-[15px] px-1 font-bold text-ivory underline underline-offset-2">Call 911</a>
                            <span className="mx-4 text-ivory/40">•</span>
                            Private-pay mobile nursing · Mon–Sat 8am–6pm
                        </span>
                    ))}
                </div>
                <p className="ticker-static text-center px-4 py-0.5">
                    Now serving Ocala &amp; Marion County — <a href="tel:+17543676929" className="inline-block py-[15px] px-1 text-sand font-semibold">call or text (754) 367-6929</a>
                    <span className="block sm:inline sm:ml-3 sm:pl-3 sm:border-l sm:border-ivory/30">Medical emergency? <a href="tel:911" className="inline-block py-[15px] px-1 font-bold text-ivory underline underline-offset-2">Call 911</a></span>
                </p>
            </div>

            <nav aria-label="Main" className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-ivory/90 backdrop-blur-lg shadow-lg shadow-pine/5' : 'bg-ivory/60 backdrop-blur'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-[4.5rem]">
                    <a href="/" className="flex items-center gap-3 group">
                        <img src="/logo-mark.png" alt="" width="33" height="40" className="h-10 w-auto" />
                        <span className="font-serif text-lg font-semibold text-pine leading-tight">
                            Pierre <span className="hidden sm:inline text-ink/70 font-normal">Concierge Nursing</span>
                        </span>
                    </a>

                    <div className="hidden md:flex items-center gap-8">
                        {links.map(({ label, href }) => (
                            <a key={label} href={href} aria-current={current === href || current.startsWith(href + '/') ? 'page' : undefined} className={`text-sm font-semibold transition-colors hover:text-pine py-3 ${current === href || current.startsWith(href + '/') ? 'text-pine underline decoration-brass decoration-2 underline-offset-8' : 'text-ink/75'}`}>{label}</a>
                        ))}
                        <div className="relative group">
                            <button type="button" aria-haspopup="true" className={`text-sm font-semibold transition-colors hover:text-pine py-3 inline-flex items-center gap-1 ${moreActive ? 'text-pine underline decoration-brass decoration-2 underline-offset-8' : 'text-ink/75'}`}>
                                More <ChevronDown size={14} />
                            </button>
                            <div className="hidden group-hover:block group-focus-within:block absolute right-0 top-full pt-3 z-50">
                                <div className="w-60 bg-ivory border border-pine/10 rounded-2xl shadow-xl shadow-pine/10 py-2">
                                    {moreLinks.map(({ label, href }) => (
                                        <a key={label} href={href} className="block px-4 py-2.5 text-sm font-semibold text-pine hover:bg-pine/5">{label}</a>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <PillButton onClick={() => openBooking('General Consultation')} className="py-2.5 px-6 text-sm">
                            Book Now
                        </PillButton>
                    </div>

                    <button onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-menu" className="md:hidden w-11 h-11 rounded-xl bg-pine/5 text-pine flex items-center justify-center">
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {menuOpen && (
                    <div id="mobile-menu" className="md:hidden bg-ivory border-t border-pine/10 shadow-xl max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain">
                        <div className="divide-y divide-pine/10">
                            {mobileItems.map((it) => <MobileGroup key={it.label} item={it} current={current} onNavigate={() => setMenuOpen(false)} />)}
                        </div>
                        <div className="sticky bottom-0 bg-ivory border-t border-pine/10 p-3 grid grid-cols-2 gap-3">
                            <button type="button" onClick={() => { openBooking('General Consultation'); setMenuOpen(false); }} className="min-h-[48px] rounded-full border-2 border-pine text-pine font-semibold inline-flex items-center justify-center gap-2 hover:bg-pine hover:text-ivory transition-colors">
                                <Calendar className="w-4 h-4" /> Request Care
                            </button>
                            <a href="tel:+17543676929" className="min-h-[48px] rounded-full bg-brass text-pine-dark font-semibold inline-flex items-center justify-center gap-2">
                                <Phone className="w-4 h-4" /> Call
                            </a>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}

// --- App ----------------------------------------------------------
export default function App({ path = '/' }) {
    const clean = path.replace(/\/+$/, '') || '/';
    const match = clean.match(/^\/services\/([a-z0-9-]+)$/);
    const serviceSlug = match ? match[1] : null;
    const [bookingOpen, setBookingOpen] = useState(false);
    const [service, setService] = useState('General Consultation');

    const openBooking = useCallback((svc) => {
        setService(svc || 'General Consultation');
        setBookingOpen(true);
    }, []);

    useReveal();

    let content;
    const local = serviceSlug ? null : findLocalPage(clean);
    if (serviceSlug) {
        content = <ServicePage slug={serviceSlug} openBooking={openBooking} />;
    } else if (local) {
        content = <LocalPage found={local} openBooking={openBooking} />;
    } else if (clean === '/services') {
        content = (<><PageHeader {...PAGE_HEADERS['/services']} /><Services openBooking={openBooking} hideHeading /><HowItWorks /><FinalCTA openBooking={openBooking} /></>);
    } else if (clean === '/pricing') {
        content = (<><PageHeader {...PAGE_HEADERS['/pricing']} /><Pricing openBooking={openBooking} hideHeading /><CompareHomeHealth /><FinalCTA openBooking={openBooking} /></>);
    } else if (clean === '/our-values') {
        content = (<><PageHeader {...PAGE_HEADERS['/our-values']} /><AboutWhy /><AboutValues /><FinalCTA openBooking={openBooking} /></>);
    } else if (clean === '/about') {
        content = (<><PageHeader {...PAGE_HEADERS['/about']} /><About hideEyebrow /><ValuesTeaser /><CredentialsStrip /><CareTeam /><Testimonials /><AboutFaqNext /><ServiceArea /><FinalCTA openBooking={openBooking} /></>);
    } else if (clean === '/privacy-practices') {
        content = (<><PageHeader {...PAGE_HEADERS['/privacy-practices']} /><PrivacyNotice /></>);
    } else if (clean === '/faq') {
        content = (<><PageHeader {...PAGE_HEADERS['/faq']} /><FAQ hideHeading /><ChecklistCTA /><FinalCTA openBooking={openBooking} /></>);
    } else {
        content = (
            <>
                <Hero openBooking={openBooking} />
                <QuoteBand />
                <CredentialsStrip />
                <WhyUs />
                <Services openBooking={openBooking} />
                <HowItWorks />
                <CompareHomeHealth />
                <CareTeam />
                <Pricing openBooking={openBooking} />
                <Testimonials />
                <FAQ />
                <ChecklistCTA />
                <PlaybookCTA />
                <ServiceArea />
                <FinalCTA openBooking={openBooking} />
            </>
        );
    }

    return (
        <div id="top" className="min-h-screen bg-ivory font-sans text-ink">
            <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:bg-pine focus:text-ivory focus:px-5 focus:py-3 focus:rounded-xl focus:font-semibold">Skip to main content</a>
            <Nav openBooking={openBooking} path={clean} />
            <ScrollBackdrop />
            <main id="main" tabIndex={-1} className="outline-none">{content}</main>
            <Footer />
            <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} service={service} />
        </div>
    );
}
