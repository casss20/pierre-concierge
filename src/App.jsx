import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SITE_CONFIG } from './siteConfig.js';
import {
    Heart,
    Stethoscope,
    Calendar,
    Clock,
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
        const els = document.querySelectorAll('.reveal');
        // Screenshot/print mode: reveal everything instantly (also a safe fallback)
        if (window.location.hash === '#snap' || !('IntersectionObserver' in window)) {
            document.documentElement.classList.add('snap');
            els.forEach((el) => el.classList.add('is-visible'));
            return;
        }
        const io = new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-visible')),
            { threshold: 0.12 }
        );
        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
    });
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

const PillButton = ({ children, variant = 'primary', className = '', onClick, href }) => {
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
        : <button onClick={onClick} className={cls}>{children}</button>;
};

// --- Data ------------------------------------------------------
const SERVICES = [
    {
        icon: Activity,
        title: "Post-Operative Recovery",
        description: "Peace of mind after surgery: incision checks, vitals monitoring, pain assessment, medication reconciliation, and safe mobility assistance while you heal — care Medicare's few-and-far-between visits don't cover.",
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
        description: "Assisted living communities can't perform clinical tasks — we can, right inside your facility. Insulin administration, wound care, and clinical monitoring that let your loved one stay in their home, not move to a higher level of care. Monthly contracts available.",
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
        a: "No — most families contact us directly, often the week of a hospital discharge or when a loved one needs more care than an assisted living facility can provide. We're also happy to receive referrals from physicians, surgeons, senior living communities, and home-health agencies.",
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
                        Hospital-grade care,
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
                    <div className="relative rounded-[2rem] overflow-hidden shadow-2xl bg-pine-dark">
                        <img
                            src="/elda-coat.jpg"
                            alt="Elda Marie Pierre, RN, BSN — white coat portrait"
                            className="w-full h-[26rem] sm:h-[32rem] lg:h-[36rem] object-cover object-top"
                        />
                        {/* sparkle watermark in source image sits bottom-right — cover it */}
                        <div className="absolute bottom-0 right-0 h-16 w-16 bg-gradient-to-tl from-pine-dark/90 to-transparent" />
                        <div className="absolute bottom-5 left-5 right-5 sm:right-auto bg-ivory/95 backdrop-blur rounded-2xl px-5 py-4 shadow-xl flex items-center gap-4">
                            <div className="w-11 h-11 rounded-full bg-pine text-ivory flex items-center justify-center font-serif font-semibold text-lg shrink-0">E</div>
                            <div>
                                <p className="font-serif font-semibold text-pine leading-tight">Elda Marie Pierre</p>
                                <p className="text-xs text-ink/70 font-medium">RN, BSN · 20+ years in patient care</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

function QuoteBand() {
    return (
        <section className="bg-pine text-ivory relative overflow-hidden">
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

function Services({ openBooking }) {
    return (
        <section id="services" className="bg-cream/50 py-20 md:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    eyebrow="Services"
                    title="Comprehensive nursing, delivered"
                    subtitle="Professional medical care tailored to your recovery and wellness needs — sterile equipment, clear communication, genuine warmth."
                />
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SERVICES.map(({ icon: Icon, title, description, price, tag }, i) => (
                        <article key={title} className="reveal group bg-ivory rounded-3xl p-8 border border-transparent hover:border-pine/15 shadow-sm hover:shadow-xl flex flex-col h-full transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-start justify-between mb-7">
                                <div className="w-12 h-12 rounded-2xl bg-pine/5 text-pine flex items-center justify-center group-hover:bg-pine group-hover:text-ivory transition-colors duration-300">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <span className="font-serif text-brass text-lg">{String(i + 1).padStart(2, "0")}</span>
                            </div>
                            <h3 className="font-serif text-[1.35rem] font-semibold text-pine mb-3">{title}</h3>
                            <p className="text-ink/75 leading-relaxed text-[0.93rem] flex-grow mb-7">{description}</p>
                            <div className="pt-5 border-t border-pine/10 flex items-center justify-between mt-auto">
                                <span className="text-pine font-bold text-base">{price}</span>
                                <button onClick={() => openBooking(tag)} className="inline-flex items-center gap-1 text-sm font-semibold text-pine hover:text-royal transition-colors">
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

function Pricing({ openBooking }) {
    const [tab, setTab] = useState('subscription');
    return (
        <section id="pricing" className="bg-pine text-ivory relative overflow-hidden py-20 md:py-28">
            <div className="pointer-events-none absolute -top-40 right-0 w-[30rem] h-[30rem] rounded-full bg-pine-light/30 blur-3xl" />
            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    light
                    eyebrow="Pricing"
                    title="Simple, transparent, no surprises"
                    subtitle="One visit for immediate needs, or consistent monthly care at a better value."
                />

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

function About() {
    return (
        <section id="about" className="bg-ivory py-20 md:py-28 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-14 lg:gap-20 items-start">
                    {/* Portrait */}
                    <div className="reveal relative mx-auto w-full max-w-sm lg:sticky lg:top-28">
                        <div className="absolute -inset-3 rounded-t-full rounded-b-[2rem] border border-brass/40 translate-x-3 translate-y-3" />
                        <div className="relative rounded-t-full rounded-b-[2rem] overflow-hidden shadow-2xl bg-sand">
                            <img
                                src="/elda-scrubs.jpg"
                                alt="Elda Marie Pierre in royal blue scrubs"
                                className="w-full h-[30rem] object-cover object-top"
                            />
                            <div className="absolute bottom-0 right-0 h-16 w-16 bg-gradient-to-tl from-sand/80 to-transparent" />
                        </div>
                        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-pine text-ivory rounded-full px-6 py-2.5 shadow-xl text-sm font-semibold whitespace-nowrap">
                            20+ years of patient care
                        </div>
                    </div>

                    {/* Story */}
                    <div className="reveal pt-6">
                        <Eyebrow>Meet your nurse</Eyebrow>
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

function FAQ() {
    const [open, setOpen] = useState(0);
    return (
        <section className="bg-cream/50 py-20 md:py-24">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading eyebrow="FAQ" title="Questions, answered" />
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
                <div className="bg-cream/70 border border-pine/10 rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-8">
                    <div className="w-14 h-14 rounded-2xl bg-pine text-ivory flex items-center justify-center shrink-0">
                        <MapPin className="w-7 h-7" />
                    </div>
                    <div className="flex-grow">
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
                    <PillButton variant="ghostLight" href="mailto:jpjojo565@gmail.com" className="text-base px-8 py-4">
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
                            <div className="w-10 h-10 rounded-xl bg-ivory text-pine flex items-center justify-center font-serif font-semibold text-xl">P</div>
                            <span className="font-serif text-xl font-semibold text-ivory">Pierre Concierge Nursing</span>
                        </div>
                        <p className="text-sm leading-relaxed">
                            Hospital-grade nursing care in the comfort and privacy of your home — compassion, integrity, and clinical excellence.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-ivory font-bold mb-4 text-sm uppercase tracking-wider">Explore</h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <a href="#services" className="hover:text-sand transition-colors">Services</a>
                            <a href="#pricing" className="hover:text-sand transition-colors">Pricing</a>
                            <a href="#about" className="hover:text-sand transition-colors">About Elda</a>
                            <a href="#faq" className="hover:text-sand transition-colors">FAQ</a>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-ivory font-bold mb-4 text-sm uppercase tracking-wider">Contact</h4>
                        <ul className="space-y-2.5 text-sm">
                            <li className="flex items-center gap-2.5"><Phone size={15} className="text-brass" /> <a href="tel:+17543676929" className="hover:text-sand transition-colors">+1 (754) 367-6929</a></li>
                            <li className="flex items-center gap-2.5"><Mail size={15} className="text-brass" /> <a href="mailto:jpjojo565@gmail.com" className="hover:text-sand transition-colors">jpjojo565@gmail.com</a></li>
                            <li className="flex items-center gap-2.5"><Clock size={15} className="text-brass" /> Mon–Sat: 8am – 6pm</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-ivory/10 pt-8 text-center text-xs text-ivory/60 space-y-2">
                    <p>© {year} Pierre Concierge Nursing & Wellness. All rights reserved.</p>
                    <p>Services are non-emergency. In case of a medical emergency, dial 911.</p>
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
        { icon: Lock, title: "Private and confidential", text: "Records and updates are shared only with the doctors and family you authorize." },
    ].filter(Boolean);
    return (
        <section className="bg-ivory py-12">
            <div className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-4 ${items.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
                {items.map(({ icon: Icon, title, text, href }) => (
                    <div key={title} className="reveal flex items-start gap-4 bg-cream/60 border border-pine/10 rounded-2xl p-5">
                        <div className="w-11 h-11 rounded-xl bg-pine text-ivory flex items-center justify-center shrink-0"><Icon className="w-5 h-5" /></div>
                        <div>
                            <h3 className="font-serif text-lg font-semibold text-pine">{title}</h3>
                            <p className="text-sm text-ink/75 leading-relaxed">
                                {href ? <a href={href} target="_blank" rel="noopener noreferrer" className="underline decoration-brass underline-offset-4">{text}</a> : text}
                            </p>
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

function BookingModal({ isOpen, onClose, service }) {
    const [submitted, setSubmitted] = useState(false);
    useEffect(() => { if (isOpen) setSubmitted(false); }, [isOpen]);
    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && onClose();
        if (isOpen) window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-pine-dark/70 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div
                className="bg-ivory rounded-[1.75rem] shadow-2xl max-w-lg w-full p-7 md:p-9 relative animate-fade-up max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-5 right-5 w-9 h-9 rounded-full bg-pine/5 text-pine/60 hover:bg-pine/15 hover:text-pine flex items-center justify-center transition-colors">
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
                            <h3 className="font-serif text-2xl font-semibold text-pine">Request an appointment</h3>
                            <p className="text-ink/70 text-sm mt-1.5">
                                You're requesting: <span className="text-royal font-semibold">{service}</span>
                            </p>
                        </div>

                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                            <div>
                                <label className="block text-sm font-semibold text-pine mb-1.5">Full Name</label>
                                <input required type="text" placeholder="Jane Doe" className="w-full px-4 py-3 rounded-xl border border-pine/15 bg-white focus:ring-2 focus:ring-royal/40 focus:border-royal outline-none transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-pine mb-1.5">Phone Number</label>
                                <input required type="tel" placeholder="(555) 123-4567" className="w-full px-4 py-3 rounded-xl border border-pine/15 bg-white focus:ring-2 focus:ring-royal/40 focus:border-royal outline-none transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-pine mb-1.5">Preferred Date / Time</label>
                                <input type="text" placeholder="e.g. Monday morning" className="w-full px-4 py-3 rounded-xl border border-pine/15 bg-white focus:ring-2 focus:ring-royal/40 focus:border-royal outline-none transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-pine mb-1.5">Notes <span className="text-ink/55 font-normal">(optional)</span></label>
                                <textarea rows="3" placeholder="Anything Elda should know beforehand…" className="w-full px-4 py-3 rounded-xl border border-pine/15 bg-white focus:ring-2 focus:ring-royal/40 focus:border-royal outline-none transition resize-none" />
                            </div>

                            <PillButton type="submit" className="w-full py-4 text-base">
                                Send Request <ArrowRight className="w-4 h-4" />
                            </PillButton>
                            <p className="text-xs text-center text-ink/60">Prefer to talk? <a href="tel:+17543676929" className="text-royal font-semibold">Call (754) 367-6929</a></p>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

// --- Nav ---------------------------------------------------------
function Nav({ openBooking }) {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const links = [
        { label: 'Services', href: '#services' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'About', href: '#about' },
        { label: 'FAQ', href: '#faq' },
    ];

    return (
        <>
            {/* announcement bar */}
            <div className="bg-pine text-ivory/90 text-xs font-medium text-center py-2 px-4 tracking-wide">
                Now serving Ocala & Marion County — <a href="tel:+17543676929" className="text-sand font-semibold hover:text-ivory transition-colors">call or text (754) 367-6929</a>
            </div>

            <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-ivory/90 backdrop-blur-lg shadow-lg shadow-pine/5' : 'bg-ivory/60 backdrop-blur'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-[4.5rem]">
                    <a href="#top" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-pine text-ivory flex items-center justify-center font-serif font-semibold text-xl group-hover:bg-royal transition-colors">P</div>
                        <span className="font-serif text-lg font-semibold text-pine leading-tight">
                            Pierre <span className="hidden sm:inline text-ink/70 font-normal">Concierge Nursing</span>
                        </span>
                    </a>

                    <div className="hidden md:flex items-center gap-8">
                        {links.map(({ label, href }) => (
                            <a key={label} href={href} className="text-sm font-semibold text-ink/75 hover:text-pine transition-colors">{label}</a>
                        ))}
                        <PillButton onClick={() => openBooking('General Consultation')} className="py-2.5 px-6 text-sm">
                            Book Now
                        </PillButton>
                    </div>

                    <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden w-10 h-10 rounded-xl bg-pine/5 text-pine flex items-center justify-center">
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {menuOpen && (
                    <div className="md:hidden bg-ivory border-t border-pine/10 shadow-xl">
                        <div className="px-4 py-4 flex flex-col gap-1">
                            {links.map(({ label, href }) => (
                                <a key={label} href={href} onClick={() => setMenuOpen(false)} className="py-3 px-3 rounded-xl font-semibold text-pine hover:bg-pine/5 transition-colors">
                                    {label}
                                </a>
                            ))}
                            <PillButton onClick={() => { openBooking('General Consultation'); setMenuOpen(false); }} className="w-full mt-2">
                                Book Now
                            </PillButton>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}

// --- App ----------------------------------------------------------
export default function App() {
    const [bookingOpen, setBookingOpen] = useState(false);
    const [service, setService] = useState('General Consultation');

    const openBooking = useCallback((svc) => {
        setService(svc || 'General Consultation');
        setBookingOpen(true);
    }, []);

    useReveal();

    return (
        <div id="top" className="min-h-screen bg-ivory font-sans text-ink">
            <Nav openBooking={openBooking} />
            <main>
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
                <About />
                <FAQ />
                <ChecklistCTA />
                <ServiceArea />
                <FinalCTA openBooking={openBooking} />
            </main>
            <Footer />
            <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} service={service} />
        </div>
    );
}
