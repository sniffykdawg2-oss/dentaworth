import { ArrowRight } from "lucide-react";
import { PageShell } from "../components/PageShell";
import { BackButton } from "../components/BackButton";

export function AboutPage({ navigate }: { navigate: (href: string) => void }) {
  return (
    <PageShell
      eyebrow="About us"
      title="Why Dentaworth?"
      intro="Our experience, and those of many friends and family, led us to realize that dental pricing is a mystery. Dentaworth can help eliminate the guesswork."
      variant="default"
    >
      <BackButton />
      <div className="content-grid">
        <article>
          <h2>Our mission</h2>
          <p>
            Empower patients by providing an online information marketplace for dental pricing. One
            that enables consumers to have prior knowledge of dental cost estimates and to know what
            other patients paid. Price transparency and peace of mind are only a few clicks away.
          </p>
        </article>
        <article>
          <h2>Our methodology</h2>
          <p>
            We developed our algorithm to calculate price ranges using market data and unique
            self-reported pricing within counties.
          </p>
        </article>
      </div>
      <div className="callout-band">
        <div>
          <h2>Have recent pricing to share?</h2>
          <p>Self-reported prices help improve future guide coverage.</p>
        </div>
        <button className="button primary" type="button" onClick={() => navigate("/self-reporting")}>
          Self report pricing
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </PageShell>
  );
}
