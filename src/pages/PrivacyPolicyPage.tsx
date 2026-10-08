import { useRef } from "react";
import { PageShell } from "../components/PageShell";
import { ReadingProgress } from "../motion/ReadingProgress";

export function PrivacyPolicyPage() {
  const policyRef = useRef<HTMLElement>(null);

  return (
    <PageShell
      eyebrow="Privacy Policy"
      title="Privacy Policy"
      intro="How DentaWorth collects, uses, shares, and protects your information."
      variant="legal"
      heroImage="/images/page-hero-child-smile.png"
    >
      <ReadingProgress targetRef={policyRef} />
      <article
        className="legal-copy privacy-policy-copy"
        aria-labelledby="privacy-policy-title"
        data-reveal="fade"
        ref={policyRef}
      >
        <header className="privacy-policy-header">
          <h2 id="privacy-policy-title">Privacy Policy for Dentaworth</h2>
          <p className="privacy-policy-date">
            <strong>Effective Date:</strong> June 27, 2026
          </p>
        </header>

        <p>
          At Dentaworth (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), accessible from
          dentaworth.com, one of our main priorities is the privacy of our visitors. This Privacy
          Policy document contains types of information that is collected and recorded by
          Dentaworth and how we use it.
        </p>
        <p>
          If you have additional questions or require more information about our Privacy Policy,
          do not hesitate to contact us.
        </p>

        <section aria-labelledby="privacy-information-collected">
          <h2 id="privacy-information-collected">1. Information We Collect</h2>
          <p>
            We collect several different types of information for various purposes to provide and
            improve our service to you.
          </p>

          <h3>Personal Data</h3>
          <p>
            While using our site (e.g., filling out a self-report form), we may ask you to provide
            us with certain personally identifiable information that can be used to contact or
            identify you. This may include:
          </p>
          <ul>
            <li>First name and last name</li>
            <li>Email address</li>
            <li>
              <strong>Dental Information:</strong> Any details regarding your dental history or
              symptoms that you voluntarily submit through our site.
            </li>
          </ul>

          <h3>Usage Data</h3>
          <p>
            We also collect information on how the website is accessed and used. This may include
            your computer&apos;s Internet Protocol (IP) address, browser type, browser version, the
            pages of our site that you visit, the time and date of your visit, the time spent on
            those pages, and other diagnostic data.
          </p>
        </section>

        <section aria-labelledby="privacy-information-use">
          <h2 id="privacy-information-use">2. How We Use Your Information</h2>
          <p>Dentaworth uses the collected data for various purposes:</p>
          <ul>
            <li>To provide, operate, and maintain our website and services.</li>
            <li>To notify you about changes to our services or upcoming appointments.</li>
            <li>
              To allow you to participate in interactive features of our website when you choose
              to do so.
            </li>
            <li>To provide patient support and process dental inquiries.</li>
            <li>
              To gather analysis or valuable information so that we can improve our website.
            </li>
            <li>
              To monitor the usage of our website and detect, prevent, and address technical
              issues.
            </li>
            <li>
              To communicate with you, either directly or through one of our partners, for
              marketing and promotional purposes (with your consent).
            </li>
          </ul>
        </section>

        <section aria-labelledby="privacy-cookies">
          <h2 id="privacy-cookies">3. Cookies and Web Beacons</h2>
          <p>
            Like any other website, dentaworth.com uses &quot;cookies.&quot; These cookies are used
            to store information including visitors&apos; preferences, and the pages on the
            website that the visitor accessed or visited. The information is used to optimize the
            users&apos; experience by customizing our web page content based on visitors&apos;
            browser type and/or other information.
          </p>
          <p>You can choose to disable cookies through your individual browser options.</p>
        </section>

        <section aria-labelledby="privacy-sharing">
          <h2 id="privacy-sharing">4. Sharing and Disclosure of Data</h2>
          <p>
            We do not sell, trade, or rent your personal identification information to others. We
            may share your data under the following circumstances
          </p>
          <ul>
            <li>
              <strong>Service Providers:</strong> We may employ third-party companies and
              individuals to facilitate our website, perform website-related services, or assist us
              in analyzing how our website is used (e.g., website hosting, IT support). These third
              parties have access to your Personal Data only to perform these tasks on our behalf
              and are obligated not to disclose or use it for any other purpose.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose your personal data in the good
              faith belief that such action is necessary to comply with a legal obligation,
              protect and defend the rights or property of Dentaworth, or protect the personal
              safety of users of the site or the public.
            </li>
          </ul>
        </section>

        <section aria-labelledby="privacy-security">
          <h2 id="privacy-security">5. Data Security</h2>
          <p>
            The security of your data is incredibly important to us. We use industry-standard
            security measures (such as SSL encryption) to protect your personal information.
            However, please remember that no method of transmission over the Internet, or method of
            electronic storage, is 100% secure. While we strive to use commercially acceptable
            means to protect your personal data, we cannot guarantee its absolute security.
          </p>
        </section>

        <section aria-labelledby="privacy-rights">
          <h2 id="privacy-rights">6. Your Data Protection Rights</h2>
          <p>
            Depending on your location, you may have specific rights regarding your personal
            information, including:
          </p>
          <ul>
            <li>
              <strong>The right to access:</strong> You have the right to request copies of your
              personal data.
            </li>
            <li>
              <strong>The right to rectification:</strong> You have the right to request that we
              correct any information you believe is inaccurate.
            </li>
            <li>
              <strong>The right to erasure:</strong> You have the right to request that we erase
              your personal data, under certain conditions.
            </li>
            <li>
              <strong>The right to restrict or object to processing:</strong> You have the right to
              object to or restrict our processing of your personal data under certain conditions.
            </li>
          </ul>
          <p>
            If you make a request, we have one month to respond to you. If you would like to
            exercise any of these rights, please contact us.
          </p>
        </section>

        <section aria-labelledby="privacy-children">
          <h2 id="privacy-children">7. Children&apos;s Privacy</h2>
          <p>
            Another part of our priority is adding protection for children while using the
            internet. We do not knowingly collect any Personal Identifiable Information from
            children under the age of 18. If you think that your child provided this kind of
            information on our website, we strongly encourage you to contact us immediately and we
            will do our best efforts to promptly remove such information from our records.
          </p>
        </section>

        <section aria-labelledby="privacy-changes">
          <h2 id="privacy-changes">8. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes
            by posting the new Privacy Policy on this page and updating the &quot;Effective
            Date&quot; at the top of this policy. You are advised to review this Privacy Policy
            periodically for any changes.
          </p>
        </section>

        <section aria-labelledby="privacy-contact">
          <h2 id="privacy-contact">9. Contact Us</h2>
          <p>
            If you have any questions or suggestions about our Privacy Policy, do not hesitate to
            contact us at:
          </p>
          <ul>
            <li>
              <strong>Email:</strong>{" "}
              <a href="mailto:privacy@dentaworth.com">privacy@dentaworth.com</a>
            </li>
          </ul>
        </section>
      </article>
    </PageShell>
  );
}
