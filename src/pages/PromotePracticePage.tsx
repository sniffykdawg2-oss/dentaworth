import { PageShell } from "../components/PageShell";
import { BackButton } from "../components/BackButton";
import { InquiryForm } from "../components/InquiryForm";

export function PromotePracticePage() {
  return (
    <PageShell
      eyebrow="Promote your practice"
      title="Promote your dental practice with pricing-aware visitors."
      intro="Dentaworth is preparing practice promotion options for dental offices that want to be discovered by people comparing care costs."
      variant="business"
    >
      <BackButton />
      <div className="legal-copy">
        <h2>Practice promotion</h2>
        <p>
          Promotion opportunities can help dental practices share relevant information with people
          researching treatment costs. Future backend work can support practice profiles, location
          details, accepted services, and inquiry routing.
        </p>
        <p>
          To discuss practice promotion, contact <a href="mailto:info@dentaworth.com">info@dentaworth.com</a>.
        </p>
      </div>
      <InquiryForm
        buttonLabel="Send practice inquiry"
        messageLabel="Practice details"
        source="practice-promotion-page"
        topic="practice-promotion"
      />
    </PageShell>
  );
}
