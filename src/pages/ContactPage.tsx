import { CSSProperties, FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, Mail, MessageSquareText, PencilLine, TriangleAlert } from "lucide-react";
import { buildContactMessageInput } from "../backend/contact";
import { createContactMessage } from "../backend/repository";
import { PageShell } from "../components/PageShell";
import { MaskHeading } from "../motion/MaskHeading";
import { SpamTrap } from "../components/SpamTrap";

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

export function ContactPage() {
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("submitting");
    setErrorMessage("");

    try {
      const input = buildContactMessageInput(new FormData(form));
      await createContactMessage(input, "contact-form");
      setStatus("success");
      form.reset();
      setFormStartedAt(Date.now());
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Unable to send message.");
    }
  }

  return (
    <PageShell
      eyebrow="Contact us"
      title="Get in touch about DentaWorth."
      intro="Send questions, corrections, pricing context, or partnership notes. Keep medical emergencies and urgent treatment questions with a licensed dental provider."
      variant="business"
      heroImage="/images/page-hero-tools-tray.png"
    >
      <section className="contact-router" data-reveal="stagger">
        {[
          { icon: PencilLine, title: "Corrections", text: "Send the county, procedure, and what looks wrong so an admin can review it." },
          { icon: MessageSquareText, title: "Product notes", text: "Ask about the guide, provider profiles, or self-reported pricing." },
          { icon: TriangleAlert, title: "Not urgent care", text: "Medical emergencies and treatment decisions belong with a licensed provider." },
        ].map((item) => (
          <article key={item.title}>
            <item.icon size={22} aria-hidden="true" />
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </section>
      <div className="contact-layout">
        <form className="form-card" onSubmit={handleSubmit} noValidate data-reveal="up">
          <SpamTrap formStartedAt={formStartedAt} />
          {status === "success" && (
            <div className="success-message" role="status">
              <CheckCircle2 size={19} aria-hidden="true" />
              Thanks. Your message was submitted.
            </div>
          )}
          {status === "error" && (
            <div className="error-message" role="alert">
              {errorMessage}
            </div>
          )}
          <label>
            Name
            <input name="name" required autoComplete="name" />
          </label>
          <label>
            Email
            <input name="email" type="email" required autoComplete="email" />
          </label>
          <label>
            Message
            <textarea name="message" rows={6} required />
          </label>
          <button className="button primary" type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Sending..." : "Send message"}
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </form>
        <aside className="contact-card tone-dark" data-reveal="up" style={{ "--delay": "120ms" } as CSSProperties}>
          <Mail size={22} aria-hidden="true" />
          <h2>Email</h2>
          <a href="mailto:info@dentaworth.com">info@dentaworth.com</a>
          <p>Use email for corrections, self-reported price questions, or business inquiries.</p>
        </aside>
      </div>
      <section className="contact-prep" aria-labelledby="contact-prep-heading">
        <div>
          <MaskHeading id="contact-prep-heading">Include enough context for a useful reply.</MaskHeading>
        </div>
        <div data-reveal="stagger">
          {[
            "County and procedure if you are reporting a pricing issue.",
            "Whether the number came from an estimate, bill, or office website.",
            "Practice name and city for provider profile questions.",
          ].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
