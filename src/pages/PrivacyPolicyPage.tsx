import { PageShell } from "../components/PageShell";

export function PrivacyPolicyPage() {
  return (
    <PageShell
      eyebrow="Privacy Policy"
      title="Privacy Policy"
      intro="This page is a placeholder while final legal language is prepared."
      variant="legal"
    >
      <section className="legal-placeholder" aria-labelledby="privacy-placeholder-heading">
        <h2 id="privacy-placeholder-heading">Privacy policy coming soon.</h2>
        <p>
          Final privacy terms should be reviewed before launch. DentaWorth will publish the approved
          policy here once the legal copy is ready.
        </p>
      </section>
    </PageShell>
  );
}
