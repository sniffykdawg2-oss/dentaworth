import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { buildContactMessageInput } from "../backend/contact";
import { createContactMessage } from "../backend/repository";
import { SpamTrap } from "./SpamTrap";

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

export function InquiryForm({
  buttonLabel,
  messageLabel,
  source,
  topic,
}: {
  buttonLabel: string;
  messageLabel: string;
  source: "advertising-page" | "practice-promotion-page";
  topic: "advertising" | "practice-promotion";
}) {
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("submitting");
    setErrorMessage("");

    try {
      const input = buildContactMessageInput(new FormData(form), topic);
      await createContactMessage(input, source);
      setStatus("success");
      form.reset();
      setFormStartedAt(Date.now());
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Unable to submit inquiry.");
    }
  }

  return (
    <form className="form-card inquiry-form" onSubmit={handleSubmit} noValidate>
      <SpamTrap formStartedAt={formStartedAt} />
      {status === "success" && (
        <div className="success-message" role="status">
          <CheckCircle2 size={19} aria-hidden="true" />
          Thanks. Your inquiry was submitted.
        </div>
      )}
      {status === "error" && (
        <div className="error-message" role="alert">
          {errorMessage}
        </div>
      )}
      <div className="form-grid">
        <label>
          Name
          <input name="name" required autoComplete="name" />
        </label>
        <label>
          Email
          <input name="email" type="email" required autoComplete="email" />
        </label>
      </div>
      <label>
        {messageLabel}
        <textarea name="message" rows={5} required />
      </label>
      <button className="button primary" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending..." : buttonLabel}
        <ArrowRight size={18} aria-hidden="true" />
      </button>
    </form>
  );
}
