import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, FileCheck2, ShieldCheck, TimerReset } from "lucide-react";
import { counties, ProcedureKey } from "../content";
import { createPriceReport } from "../backend/repository";
import { buildPriceReportInput } from "../backend/validation";
import { PageShell } from "../components/PageShell";
import { BackButton } from "../components/BackButton";
import { SpamTrap } from "../components/SpamTrap";

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

const reportProcedureFields: Array<{ key: ProcedureKey; label: string }> = [
  { key: "exam", label: "Exam" },
  { key: "cleaning", label: "Cleaning" },
  { key: "xray", label: "X-rays" },
  { key: "extraction", label: "Extraction" },
  { key: "crown", label: "Crown" },
  { key: "rootCanal", label: "Root canal" },
  { key: "filling", label: "Filling" },
  { key: "implant", label: "Implant" },
  { key: "whitening", label: "Whitening" },
  { key: "invisalign", label: "Invisalign" },
];

export function SelfReportingPage() {
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("submitting");
    setErrorMessage("");

    try {
      const input = buildPriceReportInput(new FormData(form));
      await createPriceReport(input);
      setStatus("success");
      form.reset();
      setFormStartedAt(Date.now());
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Unable to submit pricing report.");
    }
  }

  return (
    <PageShell
      eyebrow="Self reporting page"
      title="Help improve the pricing guide."
      intro="Share dental procedure pricing you recently received or paid. Submissions help Dentaworth build better county-level estimates, but they are reviewed before being used."
      variant="care"
    >
      <BackButton />
      <div className="report-layout">
        <aside className="report-trust-rail" aria-label="Reporting safeguards">
          {[
            { icon: ShieldCheck, title: "Privacy boundary", text: "Only submit information you are comfortable sharing. Public guide content is separated from contact details." },
            { icon: FileCheck2, title: "Reviewed first", text: "Reports are stored as pending records and reviewed before they influence public ranges." },
            { icon: TimerReset, title: "Spam protection", text: "A hidden field and timing check help block automated junk without adding a paid service." },
          ].map((item) => (
            <article key={item.title}>
              <item.icon size={22} aria-hidden="true" />
              <h2>{item.title}</h2>
              <p>{item.text}</p>
            </article>
          ))}
        </aside>
        <form className="form-card report-form" onSubmit={handleSubmit}>
          <SpamTrap formStartedAt={formStartedAt} />
          {status === "success" && (
            <div className="success-message" role="status">
              <CheckCircle2 size={19} aria-hidden="true" />
              Thanks. Your pricing report was submitted for review.
            </div>
          )}
          {status === "error" && (
            <div className="error-message" role="alert">
              {errorMessage}
            </div>
          )}
          <div className="form-grid">
            <label>
              County
              <select name="county" required defaultValue="">
                <option value="" disabled>
                  Select county
                </option>
                {counties.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              Dental office or provider
              <input name="provider" placeholder="Optional" />
            </label>
          </div>
          <div className="procedure-grid">
            {reportProcedureFields.map((field) => (
              <label key={field.key}>
                {field.label}
                <input name={field.key} inputMode="decimal" placeholder="$" />
              </label>
            ))}
          </div>
          <label>
            Notes
            <textarea
              name="notes"
              rows={5}
              placeholder="Share anything relevant, like whether insurance was involved or whether the quote included complications."
            />
          </label>
          <button className="button primary" type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Submitting..." : "Submit report"}
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </form>
      </div>
    </PageShell>
  );
}
