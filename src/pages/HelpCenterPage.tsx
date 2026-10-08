import { ArrowRight, FileQuestion, Plus, SearchCheck, ShieldQuestion } from "lucide-react";
import { PageShell } from "../components/PageShell";
import { MaskHeading } from "../motion/MaskHeading";
import { handleLinkClick } from "../nav";

const faqs = [
  {
    question: "Where do the price ranges come from?",
    answer:
      "County-level ranges combine independent market estimates with pricing that patients have self-reported after receiving care. Ranges are informational estimates, not quotes.",
  },
  {
    question: "Why is there a range instead of one price?",
    answer:
      "Dental pricing varies by provider, materials used, insurance status, and treatment complexity. A range gives you a realistic starting point instead of a false sense of precision.",
  },
  {
    question: "How does self-reporting work?",
    answer:
      "Anyone can submit pricing they were quoted or charged through the self-reporting form. Submissions are reviewed before they influence the public guide, and personal contact details are kept separate from published pricing.",
  },
  {
    question: "How do I get my practice listed or promoted?",
    answer:
      "Use the Promote your practice page to reach out. We're onboarding provider profiles and provider login access individually right now.",
  },
  {
    question: "I found an error in the guide. How do I report it?",
    answer:
      "Send a note through the Contact page with the county, procedure, and what looks wrong. Corrections are reviewed by an admin before anything changes.",
  },
];

export function HelpCenterPage({ navigate }: { navigate: (href: string) => void }) {
  return (
    <PageShell
      eyebrow="Help Center"
      title="Answers about how DentaWorth works."
      intro="Common questions about the cost guide, self-reporting, and getting a practice listed."
      variant="help"
      heroImage="/images/page-hero-smile-bright.png"
    >
      <div className="help-hub">
        <div className="help-intro-panel">
          <MaskHeading>Pick the help path that matches what you are trying to do.</MaskHeading>
          <p>
            Most questions fall into one of three buckets: reading the price guide, submitting a
            price, or asking about practice/provider access.
          </p>
          <figure className="help-photo-card" data-reveal="media" data-parallax>
            <img src="/images/mother-daughter-smile.webp" alt="A family smiling after a dental visit" loading="lazy" decoding="async" />
          </figure>
        </div>
        <section className="help-map" aria-label="Help topics" data-reveal="stagger">
          {[
            { icon: SearchCheck, title: "Using the guide", text: "How ranges, counties, and searches fit together." },
            { icon: ShieldQuestion, title: "Trust and review", text: "How submitted pricing is handled before anything public changes." },
            { icon: FileQuestion, title: "Provider questions", text: "How dentists and advertisers can ask about listings." },
          ].map((item) => (
            <article key={item.title}>
              <item.icon size={22} aria-hidden="true" />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </section>
        <div className="help-faq-list" data-reveal="stagger">
          {faqs.map((faq) => (
            <details className="help-faq-item" key={faq.question}>
              <summary>
                {faq.question}
                <Plus size={20} aria-hidden="true" />
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
      <section className="help-scenario-grid" aria-labelledby="help-scenarios-heading">
        <div>
          <MaskHeading id="help-scenarios-heading">Start with the page that matches your problem.</MaskHeading>
        </div>
        <div className="help-scenario-list" data-reveal="stagger">
          {[
            ["I have a quote", "Search the county and procedure, then use Get Covered Now to frame follow-up questions.", "/get-care-now"],
            ["I paid recently", "Use Self-report prices after signing in so the report can be reviewed.", "/self-reporting"],
            ["I run a practice", "Use Promote your practice for profile questions or Advertise with us for placement questions.", "/promote-your-practice"],
            ["I need help deciding", "Use the Help Center or Contact page if you are not sure which path fits your question.", "/contact"],
          ].map(([title, text, href]) => (
            <a key={title} href={href} onClick={(event) => handleLinkClick(event, href, navigate)}>
              <h3>{title}</h3>
              <p>{text}</p>
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>
      <div className="help-contact-band tone-dark" data-reveal="up">
        <div>
          <h2>Still need help?</h2>
          <p>Reach out directly and a real person will follow up.</p>
        </div>
        <a className="button primary" href="/contact" onClick={(event) => handleLinkClick(event, "/contact", navigate)}>
          Contact us
          <ArrowRight size={18} aria-hidden="true" />
        </a>
      </div>
    </PageShell>
  );
}
