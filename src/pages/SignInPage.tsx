import { FormEvent, MouseEvent, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { AuthUser, sendSignInReset, signInWithEmail } from "../backend/auth";
import { readAuthError } from "../pageHelpers";

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

export function SignInPage({ authUser, navigate }: { authUser: AuthUser | null; navigate: (href: string) => void }) {
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [resetStatus, setResetStatus] = useState<"idle" | "sent">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    setStatus("submitting");
    setErrorMessage("");

    try {
      await signInWithEmail(email, password);
      setStatus("success");
      navigate("/account");
    } catch (error) {
      setStatus("error");
      setErrorMessage(readAuthError(error));
    }
  }

  async function handleReset(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    const form = event.currentTarget.closest("form");
    const email = String(new FormData(form || undefined).get("email") || "").trim();

    if (!email) {
      setStatus("error");
      setErrorMessage("Enter your email first, then request a password reset.");
      return;
    }

    try {
      await sendSignInReset(email);
      setResetStatus("sent");
      setStatus("idle");
    } catch (error) {
      setStatus("error");
      setErrorMessage(readAuthError(error));
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-copy">
        <p className="eyebrow">Account sign in</p>
        <h1>Access Dentaworth review tools.</h1>
        <p>
          Sign in is for the owner/admin workflow: reviewing self-reported pricing, contact
          messages, future practice profiles, and guide data.
        </p>
      </div>
      <form className="form-card auth-card" onSubmit={handleSubmit} noValidate>
        {authUser && (
          <div className="success-message" role="status">
            <CheckCircle2 size={19} aria-hidden="true" />
            Signed in as {authUser.email}.
          </div>
        )}
        {status === "error" && (
          <div className="error-message" role="alert">
            {errorMessage}
          </div>
        )}
        {resetStatus === "sent" && (
          <div className="success-message" role="status">
            <CheckCircle2 size={19} aria-hidden="true" />
            Password reset email sent.
          </div>
        )}
        <label>
          Email
          <input name="email" type="email" required autoComplete="email" />
        </label>
        <label>
          Password
          <input name="password" type="password" required autoComplete="current-password" />
        </label>
        <button className="button primary" type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Signing in..." : "Sign in"}
          <ArrowRight size={18} aria-hidden="true" />
        </button>
        <button className="text-button" type="button" onClick={handleReset}>
          Send password reset
        </button>
      </form>
    </section>
  );
}
