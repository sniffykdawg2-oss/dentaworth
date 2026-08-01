import { BarChart3, Eye, Mail, Megaphone } from "lucide-react";
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
      <div className="ad-layout">
        <section className="ad-principles">
          {[
            { icon: Eye, title: "High-intent readers", text: "Visitors are researching dental costs, not casually scrolling a generic local directory." },
            { icon: Megaphone, title: "Clear placement rules", text: "Advertising has to be labeled and visually separated from guide methodology." },
            { icon: BarChart3, title: "Useful over noisy", text: "The best placements should help people compare options, not interrupt the cost guide." },
          ].map((item) => (
            <article key={item.title}>
              <item.icon size={22} aria-hidden="true" />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </section>
        <div className="legal-copy ad-copy">
          <h2>Advertising inquiries</h2>
          <p>
            Dentaworth can support advertising opportunities for dental organizations that want to
            reach patients during the research phase. Advertising must remain clearly separate from
            cost guide methodology and informational content.
          </p>
          <p>
            For advertising questions, contact <a href="mailto:info@dentaworth.com">info@dentaworth.com</a>.
          </p>
          <p>
            We are keeping this intentionally careful while the product grows. No fake scarcity, no
            pay-to-rank language, and no ad treatment that makes an estimate look like an endorsement.
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
