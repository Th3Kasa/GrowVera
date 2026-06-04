import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GrowVera — Terms of Service",
  description:
    "GrowVera's terms of service governing your use of our website and local marketing services.",
};

export default function TermsPage() {
  return (
    <div style={{ background: "#FAFAF8" }}>
      <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-40 pb-32">
        {/* Header */}
        <div className="mb-12">
          <span
            className="text-[10px] uppercase tracking-[0.2em] font-semibold"
            style={{ color: "#1A5C3A" }}
          >
            Legal
          </span>
          <h1
            className="text-4xl font-bold tracking-tight mt-3 mb-3"
            style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", color: "#0D0D0B" }}
          >
            Terms of Service
          </h1>
          <p className="text-sm" style={{ color: "#6B6B68" }}>
            Last updated: 1 June 2026
          </p>
        </div>

        <div className="space-y-10" style={{ color: "#0D0D0B" }}>
          <Section title="1. About GrowVera">
            <p>
              GrowVera is a trading name providing local search marketing
              services, including Google Business Profile optimisation, review
              generation, local citations management, and related services.
            </p>
            <p>
              Registered in New South Wales, Australia. Contact:{" "}
              <a
                href="mailto:admin@growvera.com.au"
                style={{ color: "#1A5C3A" }}
              >
                admin@growvera.com.au
              </a>
            </p>
            <p>
              By accessing our website at growvera.com.au or engaging our
              services, you agree to be bound by these Terms. If you do not
              agree, please do not use our website or services.
            </p>
          </Section>

          <Section title="2. Services">
            <p>
              GrowVera provides local search marketing services on a monthly
              retainer basis. The specific scope of services for each client is
              agreed in a separate Service Agreement prior to commencement.
            </p>
            <p>
              <strong>Free trial:</strong> We offer a first-month free trial to
              eligible clients. The free trial covers standard onboarding and
              service delivery as described in our service documentation. At
              the conclusion of the free trial, continued engagement is
              subject to a paid monthly retainer as agreed in your Service
              Agreement.
            </p>
            <p>
              We reserve the right to modify or discontinue any service with
              30 days&apos; notice to active clients.
            </p>
          </Section>

          <Section title="3. Client responsibilities">
            <p>To receive services from GrowVera, you agree to:</p>
            <ul>
              <li>
                Provide accurate and complete business information as requested.
              </li>
              <li>
                Grant us reasonable access to your Google Business Profile,
                Google Search Console, and any other platforms required to
                perform agreed services.
              </li>
              <li>
                Respond to our communications within a reasonable timeframe.
              </li>
              <li>
                Ensure that all information provided to GrowVera does not
                infringe the intellectual property rights or privacy of any
                third party.
              </li>
            </ul>
          </Section>

          <Section title="4. Payment terms">
            <p>
              Monthly retainer fees are invoiced in advance. Payment is due
              within 14 days of the invoice date unless otherwise agreed in
              writing.
            </p>
            <p>
              Prices are quoted in Australian Dollars (AUD) and inclusive of
              GST where applicable. GrowVera is entitled to adjust pricing with
              30 days&apos; written notice.
            </p>
            <p>
              Late payments may attract interest at the rate of 2% per month on
              the outstanding balance.
            </p>
          </Section>

          <Section title="5. Minimum term and cancellation">
            <p>
              All retainer agreements have a minimum term of 2 months. After the
              minimum term, the retainer continues on a month-to-month basis.
              You may cancel after the minimum term by providing 30 days&apos;
              written notice to{" "}
              <a
                href="mailto:admin@growvera.com.au"
                style={{ color: "#1A5C3A" }}
              >
                admin@growvera.com.au
              </a>
              . Service will continue through the notice period, and no further
              fees will be charged after the notice period expires.
            </p>
            <p>
              GrowVera may terminate services with 14 days&apos; notice if a
              client is in breach of these Terms or their Service Agreement, or
              if continued service would expose GrowVera to legal or
              reputational risk.
            </p>
          </Section>

          <Section title="6. Results disclaimer">
            <p>
              GrowVera applies proven local SEO and Google Business Profile
              optimisation practices. However, search engine rankings are
              determined by Google and other third parties over which we have
              no direct control.
            </p>
            <p>
              <strong>
                We do not guarantee specific rankings, review volumes, or
                revenue outcomes.
              </strong>{" "}
              Results may vary based on market conditions, industry competition,
              geographic factors, Google algorithm changes, and client
              responsiveness.
            </p>
            <p>
              Any results referenced in our marketing materials are
              illustrative of the types of outcomes clients have experienced.
              They are not a guarantee of what any individual client will
              achieve.
            </p>
          </Section>

          <Section title="7. Intellectual property">
            <p>
              All content on the GrowVera website — including text, graphics,
              logos, and code — is the property of GrowVera or its licensors
              and is protected by Australian copyright law.
            </p>
            <p>
              Any reports, strategies, or other deliverables produced by
              GrowVera for a client remain the property of the client upon full
              payment of all fees.
            </p>
            <p>
              GrowVera retains the right to reference the general nature of
              services provided to a client for marketing purposes, unless the
              client has specifically requested otherwise in writing.
            </p>
          </Section>

          <Section title="8. Limitation of liability">
            <p>
              To the maximum extent permitted by Australian law (including the
              Australian Consumer Law), GrowVera&apos;s liability for any loss
              or damage arising out of or in connection with our services is
              limited to the fees paid by the client in the preceding three (3)
              months.
            </p>
            <p>
              GrowVera is not liable for any indirect, consequential, or
              punitive loss, including loss of revenue, loss of customers, or
              loss of data.
            </p>
            <p>
              Nothing in these Terms limits your rights under the Australian
              Consumer Law where those rights cannot lawfully be excluded.
            </p>
          </Section>

          <Section title="9. Privacy">
            <p>
              Our collection and handling of personal information is governed
              by our{" "}
              <a href="/privacy" style={{ color: "#1A5C3A" }}>
                Privacy Policy
              </a>
              , which forms part of these Terms.
            </p>
          </Section>

          <Section title="10. Governing law">
            <p>
              These Terms are governed by the laws of New South Wales,
              Australia. You agree to submit to the exclusive jurisdiction of
              the courts of New South Wales for any dispute arising out of or
              in connection with these Terms.
            </p>
          </Section>

          <Section title="11. Changes to these Terms">
            <p>
              We may update these Terms from time to time. The updated Terms
              will be published on this page with a revised &ldquo;last
              updated&rdquo; date. Continued use of our website or services
              after changes are published constitutes acceptance of the revised
              Terms.
            </p>
          </Section>

          <Section title="12. Contact">
            <p>
              For any questions about these Terms, contact us at{" "}
              <a
                href="mailto:admin@growvera.com.au"
                style={{ color: "#1A5C3A" }}
              >
                admin@growvera.com.au
              </a>
              .
            </p>
          </Section>
        </div>
      </article>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2
        className="text-xl font-bold mb-4"
        style={{ fontFamily: "var(--font-cabinet), Outfit, sans-serif", color: "#0D0D0B" }}
      >
        {title}
      </h2>
      <div
        className="space-y-4 text-base leading-relaxed [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:list-disc [&_a]:underline [&_a]:underline-offset-2"
        style={{ color: "#6B6B68" }}
      >
        {children}
      </div>
    </section>
  );
}
