import { ArrowRight, BarChart3, Eye, Mail, Megaphone } from "lucide-react";
import { PageShell } from "../components/PageShell";
import { InquiryForm } from "../components/InquiryForm";

export function AdvertiseWithUsPage() {
  return (
    <PageShell
      eyebrow="Advertise with us"
      title="Reach people researching dental care costs."
      intro="DentaWorth is built for visitors who are actively comparing dental treatment pricing and looking for clearer next steps."
      variant="business"
    >
      <div className="ad-layout ad-layout-refresh">
        <section className="ad-principles" aria-label="Advertising principles">
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
        <div className="ad-copy">
          <h2>Advertising inquiries</h2>
          <p>
            DentaWorth can support advertising opportunities for dental organizations that want to
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
          <a className="ad-text-link" href="mailto:info@dentaworth.com">
            Start a conversation
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
        <aside className="contact-card">
          <Mail size={22} aria-hidden="true" />
          <h2>Email</h2>
          <a href="mailto:info@dentaworth.com">info@dentaworth.com</a>
        </aside>
      </div>
      <section className="ad-fit-matrix" aria-labelledby="ad-fit-heading">
        <p className="eyebrow">Placement fit</p>
        <h2 id="ad-fit-heading">Advertising should support the research task.</h2>
        <div>
          {[
            ["Good fit", "Dental organizations, coverage partners, and patient-facing services that help people compare next steps."],
            ["Bad fit", "Anything that looks like pay-to-rank, hides sponsorship, or makes a guide estimate look like a recommendation."],
            ["Launch rule", "Keep ads visibly separated from methodology, search results, and self-reported data workflows."],
          ].map(([title, text]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <InquiryForm
        buttonLabel="Send advertising inquiry"
        messageLabel="Advertising goals"
        source="advertising-page"
        topic="advertising"
      />
    </PageShell>
  );
}
