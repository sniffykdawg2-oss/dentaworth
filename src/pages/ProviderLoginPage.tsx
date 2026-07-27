import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, Info } from "lucide-react";
import { AuthUser, signInWithEmail } from "../backend/auth";
import { readAuthError } from "../pageHelpers";

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

export function ProviderLoginPage({ authUser, navigate }: { authUser: AuthUser | null; navigate: (href: string) => void }) {
  const [status, setStatus] = useState<SubmissionStatus>("idle");
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

  return (
    <section className="auth-page">
      <div className="auth-copy">
        <p className="eyebrow">Provider access</p>
        <h1>Sign in to your practice account.</h1>
        <p>
          Provider accounts let dental practices manage how they appear to patients researching
          treatment costs on Dentaworth.
        </p>
        <div className="provider-note">
          <Info size={19} aria-hidden="true" />
          <p>
            Provider accounts are being onboarded individually right now. If your practice does not
            have login access yet,{" "}
            <a href="/promote-your-practice" onClick={(event) => { event.preventDefault(); navigate("/promote-your-practice"); }}>
              get in touch about promoting your practice
            </a>{" "}
            and we will set your account up.
          </p>
        </div>
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
      </form>
    </section>
  );
}
