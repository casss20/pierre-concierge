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
    cancellationPolicy: "",
    // What happens if Elda is unavailable (sick, emergency, fully booked)
    backupPlan: "",
    // Set to true only if every client really receives a written care plan and cost before care begins
    writtenCarePlan: false,
    // Real testimonials only, with permission: { quote: "...", name: "First name, town", role: "Patient's daughter" }
    testimonials: [],
    // Free downloadable resource (static page in /public)
    checklistUrl: "/going-home-checklist.html",
};
