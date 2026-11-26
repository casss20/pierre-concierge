// Fill these in to switch on the matching sections of the site.
// Anything left empty is hidden, so the site never shows a promise or a credential that is not real.
export const SITE_CONFIG = {
    // Florida RN license number, shown in the credentials strip (e.g. "RN 1234567")
    licenseNumber: "",
    // Link to the Florida Department of Health license lookup for this nurse (optional, shown next to the number)
    licenseLookupUrl: "",
    // One line describing liability coverage (e.g. "Professional liability coverage through [carrier]")
    insuranceDetail: "",
    // Plain language visit cancellation and rescheduling policy
    cancellationPolicy: "Online visits are paid when you book. Cancel or reschedule at least 1 business day before your visit for a full refund or a free move to a new time. With less than 1 business day of notice, or if no one is home when the nurse arrives, the visit fee is not refunded. If Elda has to cancel, you get a full refund. Refunds go back to the original card.",
    // What happens if Elda is unavailable (sick, emergency, fully booked)
    backupPlan: "",
    // Set to true only if every client really receives a written care plan and cost before care begins
    writtenCarePlan: false,
    // Real testimonials only, with permission: { quote: "...", name: "First name, town", role: "Patient's daughter" }
    testimonials: [],
    // HIPAA privacy notice details. The notice must carry the date Elda adopts it.
    privacyEffectiveDate: "",   // e.g. "December 1, 2026"
    privacyContactEmail: "pierreconciergenursing@gmail.com",    // email for privacy questions and requests
    privacyMailingAddress: "",  // mailing address for written requests
    // The Safe Home Playbook (paid PDF guide). Leave the checkout link empty until the store is ready:
    // the site then shows "Coming soon". Once you paste the store link, the Get the Playbook button appears everywhere.
    playbookCheckoutUrl: "https://payhip.com/b/XgK9T",
    // Optional price text shown next to the button, for example "$34"
    playbookPrice: "$34",
    // Discharge Readiness Kit (printable workbook). Same rule: empty link shows "Coming soon".
    kitCheckoutUrl: "https://payhip.com/b/ep5b0",
    kitPrice: "$19",
    // Long Distance Caregiver Kit, Florida Assisted Living Family Guide, Care Plan Binder. Empty link shows "Coming soon".
    ldkCheckoutUrl: "https://payhip.com/b/NSQue",
    ldkPrice: "$29",
    alfCheckoutUrl: "https://payhip.com/b/4xSYX",
    alfPrice: "$25",
    binderCheckoutUrl: "https://payhip.com/b/GSAf8",
    binderPrice: "$39",
    // Optional bundle price for both guides, shown under the product carousel
    bundlePrice: "$44",
    // Bundles. Empty link shows "Coming soon". Starter Bundle = Safe Home Playbook + Discharge Readiness Kit.
    starterBundleUrl: "https://payhip.com/b/4AnJP",
    // Full Shelf = all five guides (Playbook, Discharge Kit, Long Distance Kit, Assisted Living Guide, Care Plan Binder)
    fullShelfUrl: "https://payhip.com/b/TRSnP",
    fullShelfPrice: "$89",
    // Free downloadable resource (static page in /public)
    checklistUrl: "https://payhip.com/b/HMxJU",
    // Online booking through Cal.com. The username is the part after cal.com/ on the booking page.
    calUsername: "pierre-concierge-nursing-dkkn9s",
    calOrigin: "https://app.cal.com",
    // Service name or button label to Cal.com visit link. Anything not listed opens the request form instead.
    calEvents: {
        "General Consultation": "free-phone-consultation",
        "Book a Consultation": "free-phone-consultation",
        "Book Post-Op Care": "post-op-check-in",
        "Post-Op Check-in": "post-op-check-in",
        "Book Transition Care": "hospital-to-home-transition",
        "Hospital-to-Home Transition": "hospital-to-home-transition",
        "Book Wound Care": "wound-care-visit",
        "Wound Care Visit": "wound-care-visit",
        "Book IV Therapy": "iv-hydration",
        "IV Hydration": "iv-hydration",
        "Book Medication Support": "medication-management",
        "Medication Management": "medication-management",
        "Book a Facility Visit": "facility-visit",
        "ALF / Facility Visit": "facility-visit",
        "Book a Check-In": "family-check-in",
        "Family Check-In": "family-check-in",
        "Book an Assessment": "wellness-check",
        "Wellness Check": "wellness-check",
        "Pierre Care Subscription": "care-plan-consultation",
    },
};
