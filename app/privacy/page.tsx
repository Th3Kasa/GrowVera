import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — GrowVera",
  description: "GrowVera Privacy Policy — how we collect, use, and protect your personal information in accordance with the Australian Privacy Act 1988.",
};

const sections = [
  {
    title: "1. About This Policy",
    content: `This Privacy Policy explains how GrowVera (ABN 50 329 139 726) ("GrowVera", "we", "us", or "our") collects, uses, holds, and discloses personal information. It applies to all personal information collected through our website (growvera.com.au), our Pipeline Audit process, and the AI automation engines we build and operate for clients.

GrowVera is bound by the Australian Privacy Principles (APPs) contained in the Privacy Act 1988 (Cth). This policy is written to be clear and practical, not exhaustive legalese.

If you have questions about this policy or how we handle your information, contact us at contact.basemmorkos@gmail.com.`,
  },
  {
    title: "2. What Personal Information We Collect",
    content: `We collect personal information in two contexts:

(a) Website visitors and audit enquiries. When you submit a Pipeline Audit request, we collect: your full name, business name, email address, phone number, suburb or region, and business type. We may also collect basic analytics data (browser type, referral source, page views) through privacy-respecting analytics tools.

(b) Client business operations. When we build and operate AI automation engines for a client, we may process personal information on behalf of that client in the course of delivering the service. This includes:
- For the Speed-to-Lead Voice Agent: prospect names, phone numbers, call recordings (if enabled by the client and disclosed to prospects), and CRM data passed via webhook.
- For the Quoting Engine: employee names or identifiers linked to quoting activity; no end-customer data is required or stored by default.

We do not collect sensitive information (as defined in the Privacy Act) and do not ask for it. If you inadvertently provide sensitive information, we will delete it.`,
  },
  {
    title: "3. How We Collect Personal Information",
    content: `We collect personal information:

(a) directly from you when you complete the Pipeline Audit request form on our website, email us, or call us;

(b) from our clients, when they share CRM data, lead records, or staff identifiers required to build or operate an engine;

(c) automatically via website analytics (page visits, device type, referral source) using tools that do not use persistent cross-site tracking cookies.

We do not purchase, rent, or obtain personal information from data brokers or third-party list providers.`,
  },
  {
    title: "4. Why We Collect and Use Personal Information",
    content: `We use personal information for the following purposes:

(a) To respond to Pipeline Audit enquiries and schedule calls with prospective clients.

(b) To build, configure, test, and maintain AI automation engines for clients who engage our services.

(c) To contact clients regarding their ongoing engagement, invoicing, and service updates.

(d) To comply with our legal obligations, including tax and accounting requirements.

(e) To improve our services, where data is aggregated and de-identified.

We do not use your personal information for direct marketing without your consent. We will not sell, rent, or trade your personal information to any third party for commercial purposes.`,
  },
  {
    title: "5. How We Use Data Processed Within Client Engines",
    content: `When GrowVera processes personal data as part of a client's engine (for example, prospect phone numbers processed by the Speed-to-Lead Voice Agent), we act as a data processor on behalf of the client. In this context:

(a) We use the data solely to perform the contracted service and will not use it for any other purpose.

(b) We rely on the client to have obtained all necessary consents from their prospects and end-customers, and to have a lawful basis for sharing that data with us.

(c) We do not retain prospect data processed through client engines beyond the period required to operate and maintain the engine, unless the client's CRM retains it independently.

(d) Call recordings, where enabled, are stored securely and retained only as long as specified in the client's SOW. Clients are responsible for informing their prospects that calls may be recorded, in accordance with applicable telecommunications law.`,
  },
  {
    title: "6. Disclosure of Personal Information",
    content: `We may disclose personal information to:

(a) Third-party service providers who help us deliver our services, including cloud infrastructure providers, CRM platforms, telephony providers, calendar software, and supplier API services. These providers are selected for their data security practices and are bound by confidentiality obligations.

(b) Our contractors and staff who need access to perform work on an engagement, subject to confidentiality obligations.

(c) Law enforcement or government agencies, where required or authorised by law.

(d) Prospective purchasers of GrowVera's business, where disclosure is necessary for due diligence purposes and subject to equivalent confidentiality protections.

We do not disclose personal information to overseas third parties unless the recipient is subject to equivalent privacy protections, and we take reasonable steps to ensure this before disclosure.`,
  },
  {
    title: "7. Third-Party Services and Processors",
    content: `Our AI engines integrate with third-party platforms. The personal data that passes through these integrations is subject to those platforms' own privacy policies. Relevant categories of third-party processors include:

- CRM providers (e.g. HubSpot, GoHighLevel, Salesforce) — for lead capture and contact management
- Calendar platforms (e.g. Calendly, Google Calendar) — for appointment booking
- Telephony providers — for automated outbound call delivery
- Cloud hosting providers — for engine infrastructure and data storage
- Parts supplier API platforms — for live pricing data (no personal data is transmitted to suppliers)

Where clients provide API credentials for these services, GrowVera stores those credentials securely using encryption at rest and accesses them only as required to operate the engine.`,
  },
  {
    title: "8. Data Security",
    content: `We take reasonable steps to protect personal information from misuse, interference, loss, and unauthorised access, modification, or disclosure. Our security practices include:

(a) Encryption of data in transit (TLS) and at rest for all stored credentials and engine configuration data.

(b) Access controls — only staff and contractors who require access to personal data for their role are granted it.

(c) We do not store credit card information. Payments are processed through third-party payment platforms.

(d) We review our security practices regularly and apply updates when vulnerabilities are identified.

Despite these measures, no system can guarantee absolute security. If you believe your personal information held by GrowVera has been compromised, contact us immediately at contact.basemmorkos@gmail.com.

In the event of an eligible data breach under the Notifiable Data Breaches scheme (Part IIIC of the Privacy Act), we will notify the Office of the Australian Information Commissioner and affected individuals in accordance with our legal obligations.`,
  },
  {
    title: "9. Data Retention",
    content: `We retain personal information only for as long as necessary for the purposes described in this policy, and as required by law. Our general retention practices:

(a) Pipeline Audit enquiries — contact details are retained for up to 24 months following the initial enquiry, or until you ask us to delete them.

(b) Client engagement records — business contact details, SOW documentation, and invoice records are retained for 7 years from the end of the engagement, as required for tax and accounting purposes.

(c) Prospect data processed through engines — retained for the period specified in the client SOW, typically not exceeding 12 months after the engine is decommissioned. Clients may request earlier deletion.

(d) Website analytics data — retained in aggregated, de-identified form only. No personally identifiable page-visit data is stored beyond 30 days.

When data is no longer required, we securely delete or anonymise it.`,
  },
  {
    title: "10. Your Rights",
    content: `Under the Australian Privacy Principles, you have the following rights regarding personal information GrowVera holds about you:

(a) Access. You may request access to the personal information we hold about you. We will provide access within 30 days of receiving a written request, subject to exceptions permitted by the Privacy Act (for example, where access would unreasonably affect another person's privacy).

(b) Correction. If you believe personal information we hold is inaccurate, incomplete, or out of date, you may request that we correct it. We will take reasonable steps to correct information or attach a notation if we decline to correct it.

(c) Deletion. You may request deletion of personal information we hold about you. We will comply where we are not required by law to retain it and where deletion does not affect our ability to deliver contracted services.

(d) Complaints. If you believe we have handled your personal information in a way that does not comply with the Privacy Act, you may lodge a complaint by emailing contact.basemmorkos@gmail.com. We will investigate and respond within 30 days. If you are not satisfied with our response, you may lodge a complaint with the Office of the Australian Information Commissioner (OAIC) at oaic.gov.au.

To exercise any of these rights, contact us at contact.basemmorkos@gmail.com. We may need to verify your identity before responding.`,
  },
  {
    title: "11. Cookies and Website Tracking",
    content: `Our website uses minimal tracking. We do not use persistent advertising cookies or cross-site tracking. We may use:

(a) Functional cookies — session cookies necessary for the website to function correctly. These are not used for tracking.

(b) Analytics — if we use a third-party analytics tool, it is configured to anonymise IP addresses and not share data with advertising networks.

You can control cookies through your browser settings. Disabling cookies will not prevent you from using any core features of our website.`,
  },
  {
    title: "12. Contact Information on Our Website",
    content: `When you contact us via the Pipeline Audit form or by email, the information you provide is used only to respond to your enquiry and to follow up on the audit process. We will not add you to any mailing list or marketing database without your explicit consent.

We comply with the Spam Act 2003 (Cth). Any promotional communications we send will include an unsubscribe mechanism, and we will action unsubscribe requests promptly.`,
  },
  {
    title: "13. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. Material changes will be communicated to active clients by email. The current version of this policy is always available at growvera.com.au/privacy. The date at the top of the policy reflects the last update.

Continued use of our services or website after a policy update constitutes acceptance of the revised policy.`,
  },
  {
    title: "14. Contact Us",
    content: `For any privacy-related queries, access requests, correction requests, or complaints:

Email: contact.basemmorkos@gmail.com
Business name: GrowVera
ABN: 50 329 139 726
Location: Sydney, New South Wales, Australia

We aim to respond to all privacy enquiries within 5 business days.`,
  },
];

export default function PrivacyPage() {
  return (
    <main style={{ background: "#FAFAF8" }}>
      <div
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ paddingTop: "clamp(6rem, 12vw, 9rem)", paddingBottom: "clamp(4rem, 7vw, 7rem)" }}
      >
        <h1
          style={{ fontFamily: "var(--font-cabinet)", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3rem)", letterSpacing: "-0.03em", color: "#0D0D0B", marginBottom: "10px" }}
        >
          Privacy Policy
        </h1>
        <p style={{ color: "#9E9E9A", fontSize: "14px", marginBottom: "8px" }}>Last updated: June 2026</p>
        <p style={{ color: "#6B6B68", fontSize: "14px", lineHeight: 1.7, marginBottom: "48px", maxWidth: "36rem" }}>
          GrowVera is committed to handling personal information responsibly and in accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          {sections.map((s) => (
            <div key={s.title}>
              <h2
                style={{ fontFamily: "var(--font-cabinet)", fontWeight: 700, fontSize: "18px", color: "#0D0D0B", letterSpacing: "-0.02em", marginBottom: "12px" }}
              >
                {s.title}
              </h2>
              {s.content.split("\n\n").map((para, i) => (
                <p key={i} style={{ color: "#6B6B68", fontSize: "15px", lineHeight: 1.8, marginBottom: "12px" }}>
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
