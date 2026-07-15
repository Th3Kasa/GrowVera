import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — GrowVera",
  description: "GrowVera Terms of Service governing the provision of AI automation engine services.",
};

const sections = [
  {
    title: "1. Parties and Agreement",
    content: `These Terms of Service ("Terms") constitute a legally binding agreement between GrowVera (ABN 50 329 139 726), a business registered in New South Wales, Australia ("GrowVera", "we", "us", or "our") and the business entity or individual ("Client", "you", or "your") that engages GrowVera's services.

By requesting a Pipeline Audit, executing a Statement of Work, paying an invoice, or otherwise using GrowVera's services, you agree to be bound by these Terms. If you do not agree, do not engage our services.`,
  },
  {
    title: "2. Services",
    content: `GrowVera designs, builds, integrates, and maintains custom AI automation engines for mid-market businesses. Current service offerings include:

(a) Speed-to-Lead Voice Agent (marketed as "Vera Reach") — an automated outbound call engine that triggers voice calls to leads captured via your website or CRM, qualifies prospects using a client-approved script, and facilitates calendar bookings.

(b) Automated Internal Quoting Engine (marketed as "Vera Quote") — a staff-facing AI tool that retrieves live pricing from third-party supplier APIs, applies client-provided standard operating procedures (SOPs), labour rates, and margin rules to produce internal price guides.

The specific scope, deliverables, integration requirements, and fees for each engagement are set out in a separate Statement of Work ("SOW") or proposal document agreed in writing between the parties. These Terms apply to all SOWs unless otherwise expressly stated.`,
  },
  {
    title: "3. Fees and Payment",
    content: `(a) Setup Fee. A flat technical setup fee is invoiced upon execution of a SOW, or as otherwise specified in the SOW. The setup fee covers scoping, development, integration, testing, and staff onboarding as described. The setup fee is non-refundable once development work has commenced.

(b) Monthly Retainer. A monthly maintenance retainer is invoiced in advance on the first business day of each calendar month. The retainer covers ongoing calibration, supplier API updates, script refinements, performance monitoring, and reporting.

(c) Payment Terms. Invoices are payable within 7 days of issue. GrowVera reserves the right to suspend services, including live engine functionality, if payment is more than 14 days overdue. Reinstatement following suspension may incur an additional fee.

(d) GST. All fees are quoted exclusive of GST. GST will be added where applicable under the A New Tax System (Goods and Services Tax) Act 1999 (Cth).

(e) Price Changes. GrowVera may adjust monthly retainer fees with 30 days written notice. Continued use of services after the notice period constitutes acceptance of revised fees.`,
  },
  {
    title: "4. Client Obligations",
    content: `The performance of GrowVera's engines depends materially on the accuracy and completeness of information provided by the Client. You agree to:

(a) provide accurate business SOPs, call scripts, pricing rules, labour rates, and margin requirements prior to and during the engagement;

(b) grant GrowVera necessary access to your CRM, calendar systems, and third-party supplier portals required to build and maintain the engine;

(c) promptly notify GrowVera of changes to your suppliers, pricing rules, SOPs, or business operations that may affect engine performance;

(d) ensure that any staff who interact with the Quoting Engine are adequately trained and use the tool in accordance with GrowVera's provided guidelines;

(e) maintain valid credentials and API access with your third-party suppliers — GrowVera is not responsible for interruptions caused by supplier credential expiry, API changes, or supplier platform downtime.

GrowVera's performance obligations are conditioned on the Client fulfilling these obligations. Delays or failures caused by the Client's non-compliance do not constitute a breach by GrowVera.`,
  },
  {
    title: "5. AI Engine Limitations and No Guarantee of Outcomes",
    content: `You acknowledge and agree that:

(a) AI-generated outputs, including voice call scripts and price guides, are generated programmatically and may contain errors, omissions, or results that are contextually inappropriate. GrowVera does not warrant that engine outputs will be error-free or suitable for every situation.

(b) The performance of the Speed-to-Lead Voice Agent depends on factors outside GrowVera's control, including but not limited to telephony network availability, prospect behaviour, call acceptance rates, and CRM webhook reliability.

(c) The Quoting Engine produces price guides based on data provided by third-party supplier APIs. GrowVera does not guarantee the accuracy or timeliness of supplier data. Prices returned by the engine should be reviewed by qualified staff before being communicated to customers as final binding quotes.

(d) GrowVera makes no representation or warranty that the use of its engines will result in any specific increase in revenue, lead conversion rates, or operational efficiency. Any projected outcomes discussed during a Pipeline Audit or sales process are illustrative estimates only, not guarantees.

(e) You are solely responsible for reviewing engine outputs, ensuring compliance with applicable laws (including consumer law, pricing accuracy obligations, and Australian Consumer Law), and making final business decisions based on that output.`,
  },
  {
    title: "6. Intellectual Property",
    content: `(a) GrowVera IP. GrowVera retains all intellectual property rights in its proprietary systems, automation frameworks, workflow templates, and methodologies used to build and operate the engines. These rights are not transferred to the Client.

(b) Client IP. All data, SOPs, scripts, pricing rules, and business information provided by the Client remain the intellectual property of the Client. GrowVera uses this data solely to build and maintain your engines.

(c) Licence. GrowVera grants the Client a non-exclusive, non-transferable licence to use the engine(s) built for the Client during the term of the engagement, contingent on payment of applicable fees.

(d) Post-Termination. Upon termination of the engagement, the Client's licence to use GrowVera-built engine components ceases. GrowVera will, upon written request, provide reasonable assistance to export Client-owned data within 30 days of termination.`,
  },
  {
    title: "7. Confidentiality",
    content: `Each party agrees to keep confidential all non-public information disclosed by the other party in connection with the engagement ("Confidential Information"), and not to disclose such information to any third party without prior written consent, except as required by law or as necessary to perform obligations under these Terms.

GrowVera's obligations under this clause do not apply to information that: (a) is or becomes publicly available through no fault of GrowVera; (b) was already known to GrowVera prior to disclosure; or (c) is required to be disclosed by applicable law or court order, provided GrowVera gives reasonable prior notice to the Client.`,
  },
  {
    title: "8. Data Handling and Privacy",
    content: `GrowVera handles personal information in accordance with its Privacy Policy, which is incorporated into these Terms by reference, and the Privacy Act 1988 (Cth).

In providing the services, GrowVera may process personal data on behalf of the Client (for example, prospect name and phone number processed by the Speed-to-Lead engine). The Client warrants that it has obtained all necessary consents and has a lawful basis under applicable privacy law to share this data with GrowVera for the purpose of providing the services. The Client indemnifies GrowVera against any loss or liability arising from the Client's failure to comply with this obligation.`,
  },
  {
    title: "9. Cancellation and Termination",
    content: `(a) Client Cancellation. You may cancel the monthly retainer at any time by providing 30 days written notice to contact.basemmorkos@gmail.com. The retainer will continue to be charged during the notice period. No refunds are provided for unused portions of a prepaid month.

(b) Setup Fee. The setup fee is non-refundable once development work has commenced. If a Client cancels prior to commencement of development, GrowVera may retain a reasonable portion of the setup fee to cover scoping and preparatory work completed to that point.

(c) Termination for Cause. Either party may terminate immediately upon written notice if the other party: (i) commits a material breach of these Terms and fails to remedy it within 14 days of written notice; (ii) becomes insolvent, enters administration, or ceases trading; or (iii) engages in conduct that is unlawful or causes reputational harm to the other party.

(d) Effect of Termination. Upon termination, GrowVera will cease providing services and disable active engine integrations. Any outstanding invoices remain payable.`,
  },
  {
    title: "10. Limitation of Liability",
    content: `To the maximum extent permitted by law:

(a) GrowVera's total aggregate liability to the Client for any claim arising under or in connection with these Terms or the services, whether in contract, tort (including negligence), statute, or otherwise, is limited to the total fees paid by the Client to GrowVera in the 30 days immediately preceding the event giving rise to the claim.

(b) GrowVera is not liable for any indirect, consequential, special, incidental, or punitive loss or damage, including loss of revenue, loss of profit, loss of business, loss of data, or business interruption, even if GrowVera has been advised of the possibility of such loss.

(c) GrowVera is not liable for losses arising from: third-party API downtime or data inaccuracies; CRM or telephony platform outages; the Client's failure to fulfil its obligations under Clause 4; the Client's failure to review engine outputs before acting on them; or any consequential business decisions made by the Client based on engine outputs.

Nothing in these Terms excludes or limits liability that cannot be excluded or limited by law, including any statutory consumer guarantees under the Australian Consumer Law.`,
  },
  {
    title: "11. Indemnification",
    content: `You agree to indemnify, defend, and hold harmless GrowVera and its officers, employees, and contractors from and against any claims, damages, losses, and expenses (including reasonable legal fees) arising out of or relating to: (a) your use of the engines or outputs in a manner inconsistent with these Terms; (b) your provision of inaccurate or incomplete SOPs, scripts, or data; (c) your failure to review engine outputs before acting on them; (d) any breach of applicable law by you or your staff; or (e) any third-party claim arising from your customer-facing pricing decisions.`,
  },
  {
    title: "12. Third-Party Services",
    content: `GrowVera's engines integrate with third-party platforms including CRM systems, calendar software, telephony providers, and supplier APIs. GrowVera is not responsible for: the performance, availability, or accuracy of any third-party platform; changes to third-party APIs or pricing structures that require engine reconfiguration; or any costs charged by third-party providers in connection with the use of their services.

Where third-party API reconfiguration is required due to changes made by the supplier (not by the Client's request), GrowVera will perform such updates under the standard monthly retainer. Updates required due to Client-initiated changes may be scoped and quoted separately.`,
  },
  {
    title: "13. Warranties",
    content: `GrowVera warrants that: (a) it will perform the services with reasonable care and skill; and (b) it has the right to grant the licences described in Clause 6.

Except as expressly stated in these Terms, all other warranties, conditions, and representations, whether express or implied by statute, common law, or otherwise, are excluded to the maximum extent permitted by law. In particular, GrowVera does not warrant that the engines will be uninterrupted, error-free, or fit for any particular purpose beyond those described in the applicable SOW.`,
  },
  {
    title: "14. Amendments",
    content: `GrowVera may update these Terms from time to time. Material changes will be communicated to active Clients by email at least 30 days before taking effect. Continued use of the services after the effective date constitutes acceptance of the revised Terms. The current version of these Terms is available at growvera.com.au/terms.`,
  },
  {
    title: "15. Governing Law and Disputes",
    content: `These Terms are governed by the laws of New South Wales, Australia. Any dispute arising in connection with these Terms that cannot be resolved by good-faith negotiation between the parties will be referred to mediation before either party initiates court proceedings. The courts of New South Wales have non-exclusive jurisdiction over any dispute that proceeds to litigation.`,
  },
  {
    title: "16. General",
    content: `(a) Entire Agreement. These Terms, together with any applicable SOW, constitute the entire agreement between the parties regarding the services and supersede all prior representations, discussions, and agreements.

(b) Severability. If any provision of these Terms is held to be invalid or unenforceable, that provision will be modified to the minimum extent necessary to make it enforceable, and the remaining provisions will continue in full force.

(c) No Waiver. Failure to enforce any provision of these Terms does not constitute a waiver of the right to enforce it in the future.

(d) Assignment. You may not assign or transfer your rights or obligations under these Terms without GrowVera's prior written consent. GrowVera may assign its rights to a related entity or in connection with a business sale.

(e) Contact. For all Terms-related queries: contact.basemmorkos@gmail.com`,
  },
];

export default function TermsPage() {
  return (
    <main style={{ background: "var(--color-text-brightest)" }}>
      <div
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ paddingTop: "clamp(6rem, 12vw, 9rem)", paddingBottom: "clamp(4rem, 7vw, 7rem)" }}
      >
        <h1
          style={{ fontFamily: "var(--font-cabinet)", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3rem)", letterSpacing: "-0.03em", color: "var(--color-text-on-light)", marginBottom: "10px" }}
        >
          Terms of Service
        </h1>
        <p style={{ color: "var(--color-text-muted-alt)", fontSize: "14px", marginBottom: "8px" }}>Last updated: June 2026</p>
        <p style={{ color: "var(--color-text-dim)", fontSize: "14px", lineHeight: 1.7, marginBottom: "48px", maxWidth: "36rem" }}>
          These Terms govern the provision of AI automation engine services by GrowVera to its clients. Please read them carefully before engaging our services.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          {sections.map((s) => (
            <div key={s.title}>
              <h2
                style={{ fontFamily: "var(--font-cabinet)", fontWeight: 700, fontSize: "18px", color: "var(--color-text-on-light)", letterSpacing: "-0.02em", marginBottom: "12px" }}
              >
                {s.title}
              </h2>
              {s.content.split("\n\n").map((para, i) => (
                <p key={i} style={{ color: "var(--color-text-dim)", fontSize: "15px", lineHeight: 1.8, marginBottom: "12px" }}>
                  {para}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
