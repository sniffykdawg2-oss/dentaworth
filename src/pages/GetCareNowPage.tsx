import { ArrowRight, ClipboardCheck, CreditCard, FileSearch, MapPinned, PhoneCall, ReceiptText, ShieldQuestion } from "lucide-react";
import { PageShell } from "../components/PageShell";

export function GetCareNowPage({ navigate }: { navigate: (href: string) => void }) {
  return (
    <PageShell
      eyebrow="Get Covered Now"
      title="Use the guide before you book dental care."
      intro="DentaWorth helps you understand common cash price ranges before you contact a dental office."
      variant="care"
    >
      <div className="care-playbook">
        <section className="care-command">
          <h2>Turn a price range into a cleaner phone call.</h2>
          <p>
            DentaWorth does not replace a dentist's estimate, but it gives you enough context to ask
            sharper questions. Use the range as a reference point, then ask the office what is
            included, what could change, and when payment is due.
          </p>
          <button className="button primary" type="button" onClick={() => navigate("/")}>
            Compare county prices
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </section>
        <section className="care-checklist" aria-label="Care booking checklist">
          {[
            { icon: MapPinned, title: "Match the county", text: "Search the county where you expect to receive care, not just where you live." },
            { icon: ReceiptText, title: "Ask what is included", text: "Confirm exams, X-rays, sedation, materials, follow-up visits, and lab fees." },
            { icon: PhoneCall, title: "Call more than one office", text: "Two or three calls can reveal whether a quote is typical, high, or unusually low." },
            { icon: ClipboardCheck, title: "Save the final quote", text: "Keep the written estimate so you can compare it with the guide and report it later." },
          ].map((item) => (
            <article key={item.title}>
              <item.icon size={22} aria-hidden="true" />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </section>
      </div>
      <section className="question-ladder" aria-labelledby="question-ladder-heading">
        <div>
          <h2 id="question-ladder-heading">Ask in this order.</h2>
        </div>
        <ol>
          <li><span>01</span>Is this a consultation estimate, a full treatment estimate, or a starting price?</li>
          <li><span>02</span>Does the quote assume a routine case, or could complexity change the final price?</li>
          <li><span>03</span>What payment options are available for patients paying cash?</li>
          <li><span>04</span>Can the office send the estimate in writing before the appointment?</li>
        </ol>
      </section>
      <section className="coverage-redesign" aria-labelledby="coverage-redesign-heading">
        <div className="coverage-redesign-copy">
          <h2 id="coverage-redesign-heading">Keep the quote, coverage, and payment plan separate.</h2>
          <p>
            One office number can hide several different decisions. Before you compare prices, sort
            the conversation into what the dentist is charging, what a plan may cover, and how you
            would actually pay.
          </p>
        </div>
        <div className="coverage-redesign-list">
          {[
            { icon: ShieldQuestion, label: "01", title: "Coverage", text: "Ask about waiting periods, exclusions, annual maximums, and whether the dentist is in network." },
            { icon: FileSearch, label: "02", title: "Estimate", text: "Ask for procedure codes and whether the written number includes exams, imaging, materials, and follow-up visits." },
            { icon: CreditCard, label: "03", title: "Payment", text: "Ask what changes if you pay cash, finance treatment, use a membership plan, or split care across visits." },
          ].map((item) => (
            <article key={item.title}>
              <span>{item.label}</span>
              <item.icon size={24} aria-hidden="true" />
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <div className="care-next-step">
        <div>
          <h2>Already received a quote?</h2>
          <p>Share it after care or after receiving a written estimate so the guide gets stronger.</p>
        </div>
        <button className="button primary" type="button" onClick={() => navigate("/self-reporting")}>
          Self-report pricing
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </PageShell>
  );
}
