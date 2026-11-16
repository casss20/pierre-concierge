import React from 'react';
import { SITE_CONFIG } from './siteConfig.js';

const Section = ({ title, children }) => (
    <section className="mb-10">
        <h2 className="font-serif text-2xl font-semibold text-pine mb-3">{title}</h2>
        <div className="space-y-3 text-ink/85 leading-relaxed">{children}</div>
    </section>
);

const Bullets = ({ items }) => (
    <ul className="list-disc pl-6 space-y-2 marker:text-brass">
        {items.map((t) => <li key={t}>{t}</li>)}
    </ul>
);

export default function PrivacyNotice() {
    const { privacyEffectiveDate, privacyContactEmail, privacyMailingAddress } = SITE_CONFIG;
    return (
        <article className="bg-ivory pb-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="rounded-2xl bg-pine text-ivory p-6 mb-10 text-sm font-semibold uppercase tracking-wide leading-relaxed">
                    This notice describes how medical information about you may be used and disclosed and how you can get access to this information. Please review it carefully.
                </div>
                {privacyEffectiveDate && <p className="text-sm text-ink/70 mb-8">Effective date: {privacyEffectiveDate}</p>}

                <Section title="Who follows this notice">
                    <p>This notice applies to Pierre Concierge Nursing & Wellness and to Elda Marie Pierre, RN, BSN, who provides your nursing care. It covers the health information we create or receive about you, including records of your visits, assessments, medications, and care.</p>
                </Section>

                <Section title="Our promise to you">
                    <p>Your health information is personal. We keep a record of the care you receive so we can give you good care and meet legal requirements. We are required by law to keep your health information private, to give you this notice, and to follow what it says.</p>
                </Section>

                <Section title="How we may use and share your information">
                    <p><strong className="text-pine">For treatment.</strong> We may share information with your doctor, surgeon, pharmacy, wound clinic, assisted living staff, or home health team so everyone caring for you has what they need. For example, we may send your physician a report of your vital signs and wound measurements after a visit.</p>
                    <p><strong className="text-pine">For payment.</strong> We may use your information to process your payment, and to prepare a receipt or a detailed statement (superbill) when you ask for one to submit to your insurance.</p>
                    <p><strong className="text-pine">For health care operations.</strong> We may use your information to schedule visits, keep records, review the quality of our care, and run our practice.</p>
                    <p><strong className="text-pine">People involved in your care.</strong> With your permission, we may share information with family members or others you name who help care for you. If you cannot agree because of an emergency, we may share what is needed in your best interest.</p>
                </Section>

                <Section title="Other times we may share your information without your authorization">
                    <p>The law allows or requires us to share information in limited situations, such as:</p>
                    <Bullets items={[
                        "When the law requires it",
                        "For public health activities, such as reporting certain diseases or injuries",
                        "To report suspected abuse, neglect, or domestic violence to the proper authorities",
                        "To health oversight agencies for audits, investigations, and licensing",
                        "In response to a court order or other lawful legal process",
                        "To law enforcement, in limited situations the law allows",
                        "To prevent or lessen a serious and imminent threat to someone's health or safety",
                        "To coroners, medical examiners, or funeral directors, as the law allows",
                        "For workers' compensation, as the law allows",
                    ]} />
                </Section>

                <Section title="Uses that need your written permission">
                    <p>We will get your written authorization before we use or share your information for marketing, before any sale of your information, and for any other use not described in this notice. You may cancel an authorization at any time by telling us in writing. Cancelling it will not undo anything we already did while it was in effect.</p>
                </Section>

                <Section title="Your rights">
                    <Bullets items={[
                        "See and get a copy of your records. You may ask to see or receive a copy, including an electronic copy where available. We will respond within the time the law requires, and may charge a reasonable fee for copying.",
                        "Ask us to correct your records. If you think something is wrong or missing, you may ask us to amend it. We may say no in some cases, and we will explain why in writing.",
                        "Ask for a list of disclosures. You may request a list of certain times we shared your information, going back up to six years.",
                        "Ask us to limit how we use or share your information. We are not always required to agree, but we must agree if you ask us not to share information with your health plan about care you paid for in full out of pocket.",
                        "Choose how we contact you. You may ask us to contact you in a certain way, such as by phone only, or at a different address.",
                        "Get a paper copy of this notice, even if you agreed to receive it electronically.",
                        "Be told about a breach. We will notify you if your health information is improperly used or shared in a way that puts it at risk.",
                        "Choose someone to act for you. If you have given someone medical power of attorney or a legal guardian, that person may exercise your rights.",
                    ]} />
                    <p>To use any of these rights, contact us using the details below. We may ask you to put your request in writing.</p>
                </Section>

                <Section title="Our responsibilities">
                    <Bullets items={[
                        "We keep your health information private and secure.",
                        "We give you this notice and follow the terms in it.",
                        "We tell you promptly if a breach may have exposed your information.",
                        "We will not use or share your information in ways not described here without your written permission.",
                    ]} />
                </Section>

                <Section title="Communicating with us">
                    <p>Please do not send detailed medical information through the website, by regular email, or by text message, because these are not always secure. For anything urgent or private, call us. In a medical emergency, call 911.</p>
                </Section>

                <Section title="Changes to this notice">
                    <p>We may change this notice, and the changes will apply to all the information we hold. The current notice is always posted on this page, and you may ask us for a copy at any visit.</p>
                </Section>

                <Section title="Questions or complaints">
                    <p>If you have a question, or believe your privacy rights were violated, contact us first. You may also file a complaint with the U.S. Department of Health and Human Services, Office for Civil Rights, online at <a className="text-royal font-semibold underline" href="https://ocrportal.hhs.gov" target="_blank" rel="noopener noreferrer">ocrportal.hhs.gov</a> or by calling 1-800-368-1019. We will not retaliate against you for filing a complaint.</p>
                </Section>

                <Section title="Privacy contact">
                    <p className="font-semibold text-pine">Elda Marie Pierre, RN, BSN<br />Pierre Concierge Nursing & Wellness</p>
                    <p>
                        Phone or text: <a className="text-royal font-semibold" href="tel:+17543676929">(754) 367-6929</a>
                        {privacyContactEmail && <><br />Email: <a className="text-royal font-semibold" href={`mailto:${privacyContactEmail}`}>{privacyContactEmail}</a></>}
                        {privacyMailingAddress && <><br />Mail: {privacyMailingAddress}</>}
                    </p>
                </Section>
            </div>
        </article>
    );
}
