import { ArrowRight, ClipboardCheck, MapPinned, PhoneCall, ReceiptText } from "lucide-react";
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
          <p className="eyebrow">Before you call</p>
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
          <p className="eyebrow">Question ladder</p>
          <h2 id="question-ladder-heading">Ask in this order.</h2>
        </div>
        <ol>
          <li><span>01</span>Is this a consultation estimate, a full treatment estimate, or a starting price?</li>
          <li><span>02</span>Does the quote assume a routine case, or could complexity change the final price?</li>
          <li><span>03</span>What payment options are available for patients paying cash?</li>
          <li><span>04</span>Can the office send the estimate in writing before the appointment?</li>
        </ol>
      </section>
      <div className="callout-band care-callout">
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
