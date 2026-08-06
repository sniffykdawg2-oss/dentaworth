import { Building2, MapPinned, MousePointerClick, SearchCheck } from "lucide-react";
import { PageShell } from "../components/PageShell";
import { BackButton } from "../components/BackButton";
import { InquiryForm } from "../components/InquiryForm";

export function PromotePracticePage() {
  return (
    <PageShell
      eyebrow="Promote your practice"
      title="Promote your dental practice with pricing-aware visitors."
      intro="DentaWorth is preparing practice promotion options for dental offices that want to be discovered by people comparing care costs."
      variant="business"
    >
      <BackButton />
      <div className="provider-stage">
        <section>
          <p className="eyebrow">Practice profile foundation</p>
          <h2>Show up where patients are already comparing cost context.</h2>
          <p>
            Provider profiles can include service coverage, county, city, contact details, website,
            and launch notes. Admins publish profiles only after review, so drafts do not leak into
            the public directory.
          </p>
        </section>
        <div className="provider-profile-mock" aria-label="Example practice profile layout">
          <div>
            <Building2 size={26} aria-hidden="true" />
            <strong>Practice profile</strong>
          </div>
          <span>County + city</span>
          <span>Services offered</span>
          <span>Website and phone</span>
        </div>
      </div>
      <div className="provider-flow">
        {[
          { icon: SearchCheck, title: "1. Review fit", text: "Make sure the practice details match the directory's patient-first purpose." },
          { icon: MapPinned, title: "2. Build profile", text: "Add location, services, phone, website, and notes in the admin dashboard." },
          { icon: MousePointerClick, title: "3. Publish carefully", text: "Published profiles appear on Find a Dentist while drafts stay private." },
        ].map((item) => (
          <article key={item.title}>
            <item.icon size={22} aria-hidden="true" />
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
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
