import { FormEvent, useState } from "react";
import { createNewsletterSubscription } from "../backend/repository";
import { buildNewsletterSubscriptionInput } from "../backend/validation";

type Status = "idle" | "submitting" | "success" | "error";

export function Newsletter() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [formStartedAt] = useState(() => Date.now());

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("submitting");
    setErrorMessage("");

    try {
      const input = buildNewsletterSubscriptionInput(new FormData(form));
      await createNewsletterSubscription(input);
      setStatus("success");
      form.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Unable to subscribe right now.");
    }
  }

  return (
    <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
      <h3>Get the DentaWorth newsletter</h3>
      <div aria-hidden="true" className="bot-field">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
        <input type="hidden" name="formStartedAt" value={formStartedAt} />
      </div>
      <div className="newsletter-form-row">
        <label className="sr-only" htmlFor="newsletter-email">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="you@email.com"
          autoComplete="email"
          disabled={status === "submitting" || status === "success"}
        />
        <button type="submit" disabled={status === "submitting" || status === "success"}>
          {status === "success" ? "Subscribed" : status === "submitting" ? "Joining..." : "Join"}
        </button>
      </div>
      {status === "success" && <p className="newsletter-status">Thanks — you're on the list.</p>}
      {status === "error" && <p className="newsletter-status is-error">{errorMessage}</p>}
    </form>
  );
}
