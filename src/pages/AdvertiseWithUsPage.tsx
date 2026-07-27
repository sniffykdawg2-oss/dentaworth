import { Mail } from "lucide-react";
import { PageShell } from "../components/PageShell";
import { BackButton } from "../components/BackButton";
import { InquiryForm } from "../components/InquiryForm";

export function AdvertiseWithUsPage() {
  return (
    <PageShell
      eyebrow="Advertise with us"
      title="Reach people researching dental care costs."
      intro="Dentaworth is built for visitors who are actively comparing dental treatment pricing and looking for clearer next steps."
      variant="business"
    >
      <BackButton />
      <div className="contact-layout">
        <div className="legal-copy">
          <h2>Advertising inquiries</h2>
          <p>
            Dentaworth can support advertising opportunities for dental organizations that want to
            reach patients during the research phase. Advertising must remain clearly separate from
            cost guide methodology and informational content.
          </p>
          <p>
            For advertising questions, contact <a href="mailto:info@dentaworth.com">info@dentaworth.com</a>.
          </p>
        </div>
        <aside className="contact-card">
          <Mail size={22} aria-hidden="true" />
          <h2>Email</h2>
          <a href="mailto:info@dentaworth.com">info@dentaworth.com</a>
        </aside>
      </div>
      <InquiryForm
        buttonLabel="Send advertising inquiry"
        messageLabel="Advertising goals"
        source="advertising-page"
        topic="advertising"
      />
    </PageShell>
  );
}
