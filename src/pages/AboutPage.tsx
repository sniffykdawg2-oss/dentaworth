import { CSSProperties, useRef } from "react";
import { ArrowRight, Database, FileCheck2, SearchCheck, ShieldCheck } from "lucide-react";
import { PageShell } from "../components/PageShell";
import { MaskHeading } from "../motion/MaskHeading";
import { useScrollProgress } from "../motion/useScrollProgress";

const missionText =
  "Empower patients by providing an online information marketplace for dental pricing. One that enables consumers to have prior knowledge of dental cost estimates and to know what other patients paid. Price transparency and peace of mind are only a few clicks away.";

const missionPrinciples = ["Clear ranges", "County context", "Reviewed submissions", "No fake certainty"];

/** The mission statement lights up word by word as it scrolls through the viewport. */
function MissionStatement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = missionText.split(" ");

  // 0 as the statement's top reaches 85% of the viewport, 1 as its bottom reaches 55%.
  useScrollProgress(ref, {
    mode: "view",
    start: 0.85,
    end: 0.55,
    onProgress: (progress) => ({ "--reveal": progress }),
  });

  return (
    <p ref={ref} className="mission-statement" style={{ "--words": words.length } as CSSProperties}>
      {words.map((word, index) => (
        <span key={index} className="mission-word" style={{ "--wi": index } as CSSProperties}>
          {word}{" "}
        </span>
      ))}
    </p>
  );
}

export function AboutPage({ navigate }: { navigate: (href: string) => void }) {
  return (
    <PageShell
      eyebrow="About us"
      title="Why DentaWorth?"
      intro="Our experience, and those of many friends and family, led us to realize that dental pricing is a mystery. DentaWorth can help eliminate the guesswork."
      variant="default"
      heroImage="/images/page-hero-smile-laugh.png"
    >
      <section className="about-manifesto tone-dark" aria-labelledby="about-mission-heading">
        <MaskHeading id="about-mission-heading">Our Mission</MaskHeading>
        <MissionStatement />
        <aside aria-label="DentaWorth principles">
          <ol className="about-principles" data-reveal="stagger">
            {missionPrinciples.map((label, index) => (
              <li key={label}>
                <span className="about-principles__index">{String(index + 1).padStart(2, "0")}</span>
                <span className="about-principles__label">{label}</span>
                <span className="about-principles__rule" aria-hidden="true" />
              </li>
            ))}
          </ol>
        </aside>
      </section>
      <div className="method-stack" data-reveal="stagger">
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
      <section className="about-method-note" data-reveal="up">
        <h2>What the methodology is, and what it is not.</h2>
        <p>
          We developed our unique algorithm to produce price ranges using market data and
          self-reported pricing within counties.{" "}
          DentaWorth provides informational ranges, not quotes, clinical recommendations, insurance
          guarantees, or rankings of individual dentists. That boundary matters. Real dental prices
          change with complexity, materials, sedation, imaging, and office policies.
        </p>
      </section>
      <section className="about-operating-system" aria-labelledby="about-operating-heading">
        <div>
          <MaskHeading id="about-operating-heading">The product has rules on purpose.</MaskHeading>
          <p>
            Dental pricing is sensitive. The site should help people ask better questions without
            acting like a dentist, broker, or guaranteed quote engine.
          </p>
        </div>
        <div className="operating-grid" data-reveal="stagger">
          {[
            { icon: SearchCheck, title: "Search stays public", text: "People can research county-level ranges without creating an account." },
            { icon: FileCheck2, title: "Reports are reviewed", text: "Self-reported prices are collected carefully before they influence public guidance." },
            { icon: ShieldCheck, title: "Claims stay modest", text: "No fake rankings, no invented outcomes, and no pretending a range is a final quote." },
          ].map((item) => (
            <article key={item.title}>
              <item.icon size={24} aria-hidden="true" />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="about-roadmap" aria-labelledby="about-roadmap-heading">
        <h2 id="about-roadmap-heading" data-reveal="up">What gets stronger as people use it.</h2>
        <ol data-reveal="stagger">
          <li><span>01</span>More reviewed price reports by county and procedure.</li>
          <li><span>02</span>More published practice profiles with useful contact context.</li>
          <li><span>03</span>Clearer patient education around estimates, coverage, and payment options.</li>
        </ol>
      </section>
      <div className="callout-band tone-dark" data-reveal="up">
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
