import { PageShell } from "../components/PageShell";

export function TermsOfUsePage() {
  return (
    <PageShell eyebrow="Terms of Use" title="Terms of Use" intro="Effective Date: June 27, 2026" variant="legal">
      <div className="legal-copy">
        <p>
          These Terms of Use ("Terms") govern your access to and use of DentaWorth, accessible from
          dentaworth.com (the "Service"). By using the Service, you agree to these Terms. If you do
          not agree, please do not use the Service.
        </p>
        <h2>Informational purposes only</h2>
        <p>
          DentaWorth provides estimated dental price ranges and related information for general
          informational purposes only. Nothing on this site is a quote, offer, guarantee, medical
          advice, or financial advice. Actual costs depend on your specific treatment, provider, and
          circumstances, and can differ significantly from any range shown here.
        </p>
        <h2>Self-reported and third-party data</h2>
        <p>
          Some content on DentaWorth, including self-reported pricing, is submitted by users and
          reviewed before publication. DentaWorth does not independently verify the accuracy of
          self-reported submissions and makes no guarantee as to their completeness or correctness.
        </p>
        <h2>Acceptable use</h2>
        <p>
          You agree not to misuse the Service, including by submitting false or misleading
          information, attempting to bypass form protections, scraping the site in an automated and
          abusive manner, or interfering with other users' access to the Service.
        </p>
        <h2>Accounts</h2>
        <p>
          If you create an account, you are responsible for maintaining the confidentiality of your
          credentials and for all activity under your account. Notify us promptly if you suspect
          unauthorized use.
        </p>
        <h2>Third-party links</h2>
        <p>
          The Service may link to dental practices, websites, or other third-party resources.
          DentaWorth does not control and is not responsible for the content, policies, or practices
          of any third-party site.
        </p>
        <h2>No warranty</h2>
        <p>
          The Service is provided "as is" and "as available," without warranties of any kind, express
          or implied, including warranties of accuracy, reliability, or fitness for a particular
          purpose.
        </p>
        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, DentaWorth is not liable for any indirect,
          incidental, or consequential damages arising from your use of, or inability to use, the
          Service, including decisions made based on information found on the site.
        </p>
        <h2>Changes to these Terms</h2>
        <p>
          We may update these Terms from time to time. We will post the revised Terms on this page
          and update the effective date. Continued use of the Service after changes take effect
          constitutes acceptance of the revised Terms.
        </p>
        <h2>Contact</h2>
        <p>
          Questions about these Terms can be sent to <a href="mailto:info@dentaworth.com">info@dentaworth.com</a>.
        </p>
      </div>
    </PageShell>
  );
}
