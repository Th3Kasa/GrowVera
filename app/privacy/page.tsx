import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GrowVera — Privacy Policy",
  description: "GrowVera's privacy policy — how we collect, use, and protect your personal information under the Australian Privacy Act 1988.",
};

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-sm" style={{ color: "#6B6B68" }}>
            Last updated: 1 June 2026
          </p>
        </div>

        <div
          className="prose-content space-y-10"
          style={{ color: "#0D0D0B" }}
        >
          <Section title="1. About this policy">
            <p>
              GrowVera (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;)
              is committed to protecting your personal information in
              accordance with the{" "}
              <strong>Privacy Act 1988 (Cth)</strong> and the Australian
              Privacy Principles (APPs).
            </p>
            <p>
              This policy explains how we collect, use, hold, and disclose
              your personal information when you interact with our website at{" "}
              <a
                href="https://growvera.com.au"
                style={{ color: "#1A5C3A" }}
              >
                growvera.com.au
              </a>{" "}
              or use our services.
            </p>
            <p>
              GrowVera is a trading name operating in Sydney, New South Wales,
              Australia. Contact:{" "}
              <a
                href="mailto:admin@growvera.com.au"
                style={{ color: "#1A5C3A" }}
              >
                admin@growvera.com.au
              </a>
            </p>
          </Section>

          <Section title="2. What personal information we collect">
            <p>We may collect the following types of personal information:</p>
            <ul>
              <li>
                <strong>Contact information:</strong> your name, email address,
                and phone number when you submit an audit request or contact us.
              </li>
              <li>
                <strong>Business information:</strong> your business name,
                suburb, and business type, which helps us prepare your audit.
              </li>
              <li>
                <strong>Usage data:</strong> standard web analytics data
                including pages visited, browser type, and referring URL,
                collected through analytics tools.
              </li>
            </ul>
            <p>
              We do not collect sensitive information (as defined by the Privacy
              Act) unless you specifically provide it and consent to its
              collection.
            </p>
          </Section>

          <Section title="3. How we collect personal information">
            <p>We collect personal information:</p>
            <ul>
              <li>
                Directly from you when you submit a form on our website (e.g.
                the free audit request form).
              </li>
              <li>
                When you contact us by email or phone.
              </li>
              <li>
                Automatically through cookies and analytics tools when you
                browse our website. You may disable cookies through your browser
                settings, though this may affect site functionality.
              </li>
            </ul>
          </Section>

          <Section title="4. Why we collect personal information">
            <p>
              We collect and use your personal information to:
            </p>
            <ul>
              <li>Prepare and deliver your free Google Business Profile audit.</li>
              <li>Communicate with you about your enquiry or our services.</li>
              <li>Send you relevant information about GrowVera (with your consent, and always with an opt-out).</li>
              <li>Improve our website and services.</li>
              <li>Comply with our legal obligations.</li>
            </ul>
          </Section>

          <Section title="5. Electronic marketing and the Spam Act 2003">
            <p>
              We comply with the{" "}
              <strong>Spam Act 2003 (Cth)</strong>. We will only send you
              commercial electronic messages if you have provided your consent,
              either expressly or inferred from your business relationship with
              us.
            </p>
            <p>
              Every commercial message we send includes:
            </p>
            <ul>
              <li>Our identity and contact details.</li>
              <li>A clear and functional unsubscribe mechanism.</li>
            </ul>
            <p>
              We will action all unsubscribe requests promptly and no later
              than five (5) business days after receipt.
            </p>
          </Section>

          <Section title="6. Disclosure of personal information">
            <p>
              We do not sell, rent, or trade your personal information to third
              parties.
            </p>
            <p>We may disclose your personal information to:</p>
            <ul>
              <li>
                Service providers who assist us in operating our business (e.g.
                email delivery, analytics). These providers are contractually
                required to handle your data securely and in accordance with
                Australian privacy law.
              </li>
              <li>
                Regulatory authorities or law enforcement where required by law.
              </li>
            </ul>
            <p>
              We do not disclose personal information to overseas recipients
              unless we are satisfied the overseas recipient is subject to
              privacy obligations substantially similar to the APPs.
            </p>
          </Section>

          <Section title="7. Data security">
            <p>
              We take reasonable steps to protect the personal information we
              hold from misuse, interference, loss, unauthorised access,
              modification, and disclosure. These steps include:
            </p>
            <ul>
              <li>Encrypted transmission via HTTPS.</li>
              <li>Access controls limiting who can access personal data.</li>
              <li>Regular review of our data handling practices.</li>
            </ul>
            <p>
              No method of transmission over the internet is 100% secure. If
              you believe your information has been compromised, please contact
              us immediately.
            </p>
          </Section>

          <Section title="8. Access and correction">
            <p>
              Under the Privacy Act, you have the right to request access to the
              personal information we hold about you, and to request that we
              correct any inaccurate, out-of-date, or incomplete information.
            </p>
            <p>
              To make a request, contact us at{" "}
              <a
                href="mailto:admin@growvera.com.au"
                style={{ color: "#1A5C3A" }}
              >
                admin@growvera.com.au
              </a>
              . We will respond within a reasonable time (generally 30 days).
              We may need to verify your identity before processing your
              request.
            </p>
          </Section>

          <Section title="9. Complaints">
            <p>
              If you believe we have breached the Australian Privacy Principles,
              you may lodge a complaint by emailing{" "}
              <a
                href="mailto:admin@growvera.com.au"
                style={{ color: "#1A5C3A" }}
              >
                admin@growvera.com.au
              </a>
              . We will acknowledge your complaint within 5 business days and
              aim to resolve it within 30 business days.
            </p>
            <p>
              If you are not satisfied with our response, you may contact the{" "}
              <a
                href="https://www.oaic.gov.au"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1A5C3A" }}
              >
                Office of the Australian Information Commissioner (OAIC)
              </a>
              .
            </p>
          </Section>

          <Section title="10. Changes to this policy">
            <p>
              We may update this Privacy Policy from time to time. The updated
              policy will be published on this page with a revised &ldquo;last
              updated&rdquo; date. We encourage you to review this policy
              periodically.
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
