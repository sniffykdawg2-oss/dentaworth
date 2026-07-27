import { Mail } from "lucide-react";
import { PageShell } from "../components/PageShell";
import { BackButton } from "../components/BackButton";

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
    question: "What does the county rating mean?",
    answer:
      "The rating reflects the overall pricing confidence and data coverage Dentaworth currently has for that county. It is not a review of any individual dentist.",
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

export function HelpCenterPage() {
  return (
    <PageShell
      eyebrow="Help Center"
      title="Answers about how Dentaworth works."
      intro="Common questions about the cost guide, self-reporting, ratings, and getting a practice listed."
      variant="help"
    >
      <BackButton />
      <div className="help-faq-list">
        {faqs.map((faq) => (
          <details className="help-faq-item" key={faq.question}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
      <div className="help-contact-band">
        <div>
          <h2>Still need help?</h2>
          <p>Reach out directly and a real person will follow up.</p>
        </div>
        <a className="button primary" href="mailto:info@dentaworth.com">
          <Mail size={18} aria-hidden="true" />
          info@dentaworth.com
        </a>
      </div>
    </PageShell>
  );
}
