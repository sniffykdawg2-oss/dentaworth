import { FormEvent, MouseEvent, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, KeyRound, Mail, Stethoscope, UserRound } from "lucide-react";
import { AuthUser, createAccountWithEmail, sendSignInReset, signInWithEmail } from "../backend/auth";
import { readAuthError } from "../pageHelpers";

type Audience = "patient" | "provider";
type AuthStep = "audience" | "sign-in" | "create-account" | "reset-password";
type SubmissionStatus = "idle" | "submitting" | "success" | "error";

type AuthGatewayPageProps = {
  authUser: AuthUser | null;
  initialAudience?: Audience;
  navigate: (href: string) => void;
};

export function AuthGatewayPage({
  authUser,
  initialAudience = "patient",
  navigate,
}: AuthGatewayPageProps) {
  const [audience, setAudience] = useState<Audience>(initialAudience);
  const [step, setStep] = useState<AuthStep>("audience");
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [message, setMessage] = useState("");

  const isProvider = audience === "provider";

  function resetFeedback() {
    setStatus("idle");
    setMessage("");
  }

  function changeStep(nextStep: AuthStep) {
    resetFeedback();
    setStep(nextStep);
  }

  function handleLocalNav(event: MouseEvent<HTMLAnchorElement>, href: string) {
    event.preventDefault();
    navigate(href);
  }

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    setStatus("submitting");
    setMessage("");

    try {
      await signInWithEmail(email, password);
      setStatus("success");
      navigate("/account");
    } catch (error) {
      setStatus("error");
      setMessage(readAuthError(error));
    }
  }

  async function handleCreateAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords need to match before we can create the account.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      await createAccountWithEmail(email, password);
      setStatus("success");
      navigate("/account");
    } catch (error) {
      setStatus("error");
      setMessage(readAuthError(error));
    }
  }

  async function handleReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();

    setStatus("submitting");
    setMessage("");

    try {
      await sendSignInReset(email);
      setStatus("success");
      setMessage("Password reset email sent.");
    } catch (error) {
      setStatus("error");
      setMessage(readAuthError(error));
    }
  }

  return (
    <section className={isProvider ? "auth-gateway is-provider" : "auth-gateway"}>
      <div className="auth-art auth-art-rings" aria-hidden="true" />
      <div className="auth-art auth-art-flow" aria-hidden="true" />
      <a className="auth-logo" href="/" onClick={(event) => { event.preventDefault(); navigate("/"); }}>
        <span>DentaWorth</span>
      </a>

      <div className="auth-panel-shell">
        <div className="auth-panel" key={step}>
          {step !== "audience" && (
            <button className="auth-back" type="button" onClick={() => changeStep("audience")}>
              <ArrowLeft size={18} aria-hidden="true" />
              <span>Back</span>
            </button>
          )}

          {step === "audience" && (
            <>
              <p className="auth-kicker">Account access</p>
              <h1>Who are you signing in as?</h1>
              <div className="audience-picker" role="radiogroup" aria-label="Choose account type">
                <button
                  className={audience === "patient" ? "audience-option is-selected" : "audience-option"}
                  type="button"
                  role="radio"
                  aria-checked={audience === "patient"}
                  onClick={() => setAudience("patient")}
                >
                  <UserRound size={26} aria-hidden="true" />
                  <span>Patient</span>
                </button>
                <button
                  className={audience === "provider" ? "audience-option is-selected" : "audience-option"}
                  type="button"
                  role="radio"
                  aria-checked={audience === "provider"}
                  onClick={() => setAudience("provider")}
                >
                  <Stethoscope size={26} aria-hidden="true" />
                  <span>Provider</span>
                </button>
              </div>
              <button className="auth-submit" type="button" onClick={() => changeStep("sign-in")}>
                Next
                <ArrowRight size={20} aria-hidden="true" />
              </button>
            </>
          )}

          {step === "sign-in" && (
            <form className="auth-form" onSubmit={handleSignIn} noValidate>
              <p className="auth-kicker">{isProvider ? "Provider access" : "Patient access"}</p>
              <h1>Welcome back.</h1>
              {authUser && <AuthSuccessMessage message={`Signed in as ${authUser.email}.`} />}
              {status === "error" && <AuthErrorMessage message={message} />}
              <label>
                Email
                <span>
                  <Mail size={18} aria-hidden="true" />
                  <input name="email" type="email" required autoComplete="email" />
                </span>
              </label>
              <label>
                Password
                <span>
                  <KeyRound size={18} aria-hidden="true" />
                  <input name="password" type="password" required autoComplete="current-password" />
                </span>
              </label>
              <div className="auth-links">
                <button type="button" onClick={() => changeStep("create-account")}>
                  New to DentaWorth? <span>Create an account</span>
                </button>
                <button type="button" onClick={() => changeStep("reset-password")}>
                  Forgot Password
                </button>
              </div>
              <button className="auth-submit" type="submit" disabled={status === "submitting"}>
                {status === "submitting" ? "Signing in..." : "Sign in"}
                <ArrowRight size={20} aria-hidden="true" />
              </button>
            </form>
          )}

          {step === "create-account" && (
            <form className="auth-form" onSubmit={handleCreateAccount} noValidate>
              <p className="auth-kicker">{isProvider ? "Provider account" : "Patient account"}</p>
              <h1>Create your account.</h1>
              {status === "error" && <AuthErrorMessage message={message} />}
              <label>
                Email
                <span>
                  <Mail size={18} aria-hidden="true" />
                  <input name="email" type="email" required autoComplete="email" />
                </span>
              </label>
              <label>
                Password
                <span>
                  <KeyRound size={18} aria-hidden="true" />
                  <input name="password" type="password" required autoComplete="new-password" />
                </span>
              </label>
              <label>
                Confirm password
                <span>
                  <KeyRound size={18} aria-hidden="true" />
                  <input name="confirmPassword" type="password" required autoComplete="new-password" />
                </span>
              </label>
              <button className="auth-submit" type="submit" disabled={status === "submitting"}>
                {status === "submitting" ? "Creating..." : "Create account"}
                <ArrowRight size={20} aria-hidden="true" />
              </button>
            </form>
          )}

          {step === "reset-password" && (
            <form className="auth-form" onSubmit={handleReset} noValidate>
              <p className="auth-kicker">Password help</p>
              <h1>Reset your password.</h1>
              {status === "success" && <AuthSuccessMessage message={message} />}
              {status === "error" && <AuthErrorMessage message={message} />}
              <label>
                Email
                <span>
                  <Mail size={18} aria-hidden="true" />
                  <input name="email" type="email" required autoComplete="email" />
                </span>
              </label>
              <button className="auth-submit" type="submit" disabled={status === "submitting"}>
                {status === "submitting" ? "Sending..." : "Send reset link"}
                <ArrowRight size={20} aria-hidden="true" />
              </button>
            </form>
          )}

          <p className="auth-terms">
            By continuing, you agree to our{" "}
            <a href="/terms-of-use" onClick={(event) => handleLocalNav(event, "/terms-of-use")}>
              terms
            </a>{" "}
            &{" "}
            <a href="/privacy-policy" onClick={(event) => handleLocalNav(event, "/privacy-policy")}>
              privacy policy
            </a>
          </p>
        </div>
      </div>
      <p className="auth-footer-copy">© 2026 DentaWorth • Dental Operations</p>
    </section>
  );
}

function AuthSuccessMessage({ message }: { message: string }) {
  return (
    <div className="success-message" role="status">
      <CheckCircle2 size={19} aria-hidden="true" />
      {message}
    </div>
  );
}

function AuthErrorMessage({ message }: { message: string }) {
  return (
    <div className="error-message" role="alert">
      {message}
    </div>
  );
}
