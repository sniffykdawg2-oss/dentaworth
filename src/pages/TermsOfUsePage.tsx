import { PageShell } from "../components/PageShell";

export function TermsOfUsePage() {
  return (
    <PageShell
      eyebrow="Terms of Use"
      title="Terms of Use"
      intro="This page is a placeholder while final legal language is prepared."
      variant="legal"
    >
      <section className="legal-placeholder" aria-labelledby="terms-placeholder-heading">
        <h2 id="terms-placeholder-heading">Terms of use coming soon.</h2>
        <p>
          Final terms should be reviewed before launch. DentaWorth will publish the approved terms
          here once the legal copy is ready.
        </p>
      </section>
    </PageShell>
  );
}
