import { ArrowRight, Database, SearchCheck, ShieldCheck } from "lucide-react";
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
      <section className="about-manifesto">
        <div>
          <p className="eyebrow">The simple idea</p>
          <h2>Dental pricing should not feel like opening a mystery envelope.</h2>
          <p>
            Empower patients by providing an online information marketplace for dental pricing. One
            that enables consumers to have prior knowledge of dental cost estimates and to know what
            other patients paid. Price transparency and peace of mind are only a few clicks away.
          </p>
        </div>
        <aside aria-label="Dentaworth principles">
          <span>Clear ranges</span>
          <span>County context</span>
          <span>Reviewed submissions</span>
          <span>No fake certainty</span>
        </aside>
      </section>
      <div className="method-stack">
        {[
          {
            icon: SearchCheck,
            title: "Start with patient questions",
            text: "The guide is organized around what people search before they call an office: treatment, location, likely cash range, and what to ask next.",
          },
          {
            icon: Database,
            title: "Blend seed data with reports",
            text: "Current ranges use launch data and can improve as reviewed self-reported pricing comes in by county and procedure.",
          },
          {
            icon: ShieldCheck,
            title: "Keep review separate from publishing",
            text: "Public submissions enter a review queue before they influence the guide, which keeps the site useful without pretending raw submissions are verified prices.",
          },
        ].map((item) => (
          <article key={item.title}>
            <item.icon size={24} aria-hidden="true" />
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
      <section className="about-method-note">
        <h2>What the methodology is, and what it is not.</h2>
          <p>
          Dentaworth provides informational ranges, not quotes, clinical recommendations, insurance
          guarantees, or rankings of individual dentists. That boundary matters. Real dental prices
          change with complexity, materials, sedation, imaging, and office policies.
          </p>
      </section>
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
