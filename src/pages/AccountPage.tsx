import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, Bookmark, CheckCircle2, UserRound } from "lucide-react";
import { counties, treatmentOptions } from "../content";
import {
  AuthUser,
  createSavedOperation,
  deleteSavedOperation,
  SavedOperation,
  subscribeToSavedOperations,
  updateAccountProfile,
} from "../backend/auth";
import { PageShell } from "../components/PageShell";

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

export function AccountPage({ authUser, navigate }: { authUser: AuthUser | null; navigate: (href: string) => void }) {
  const [savedOperations, setSavedOperations] = useState<SavedOperation[]>([]);
  const [profileStatus, setProfileStatus] = useState<SubmissionStatus>("idle");
  const [savedStatus, setSavedStatus] = useState<SubmissionStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!authUser) return;
    return subscribeToSavedOperations(authUser.uid, setSavedOperations);
  }, [authUser]);

  if (!authUser) {
    return (
      <section className="auth-page">
        <div className="auth-copy">
          <h1>Sign in to view your account.</h1>
          <p>Saved operations, profile settings, and future review tools live behind sign in.</p>
        </div>
        <div className="form-card auth-card">
          <button className="button primary" type="button" onClick={() => navigate("/sign-in")}>
            Sign in
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </section>
    );
  }

  const signedInUser = authUser;

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const displayName = String(new FormData(event.currentTarget).get("displayName") || "");

    setProfileStatus("submitting");
    setErrorMessage("");

    try {
      await updateAccountProfile(displayName);
      setProfileStatus("success");
    } catch (error) {
      setProfileStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Unable to update account.");
    }
  }

  async function handleSavedOperationSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setSavedStatus("submitting");
    setErrorMessage("");

    try {
      await createSavedOperation(signedInUser.uid, {
        treatment: String(formData.get("treatment") || ""),
        county: String(formData.get("county") || ""),
        state: "Florida",
        notes: String(formData.get("notes") || "").trim(),
      });
      setSavedStatus("success");
      form.reset();
    } catch (error) {
      setSavedStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Unable to save operation.");
    }
  }

  async function handleRemoveSavedOperation(operationId: string) {
    setErrorMessage("");

    try {
      await deleteSavedOperation(signedInUser.uid, operationId);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to remove operation.");
    }
  }

  return (
    <PageShell
      eyebrow="Account center"
      title="Your DentaWorth workspace."
      intro="Manage account details, keep track of procedures you are researching, and prepare for future review tools."
      variant="account"
    >
      <div className="account-layout">
        <aside className="account-summary" aria-label="Account summary">
          <UserRound size={24} aria-hidden="true" />
          <h2>{signedInUser.displayName || "DentaWorth account"}</h2>
          <p>{signedInUser.email}</p>
          <span>{signedInUser.isAdmin ? "Admin access" : "Standard access"}</span>
          <button className="button secondary" type="button" onClick={() => navigate("/")}>
            Open cost guide
            <ArrowRight size={18} aria-hidden="true" />
          </button>
          {signedInUser.isAdmin && (
            <button className="button primary" type="button" onClick={() => navigate("/admin")}>
              Admin dashboard
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          )}
        </aside>

        <div className="account-panels">
          {(profileStatus === "error" || savedStatus === "error" || errorMessage) && (
            <div className="error-message" role="alert">
              {errorMessage}
            </div>
          )}
          <form className="form-card" onSubmit={handleProfileSubmit} noValidate>
            {profileStatus === "success" && (
              <div className="success-message" role="status">
                <CheckCircle2 size={19} aria-hidden="true" />
                Account updated.
              </div>
            )}
            <h2>Account information</h2>
            <label>
              Display name
              <input name="displayName" defaultValue={signedInUser.displayName || ""} autoComplete="name" />
            </label>
            <label>
              Email
              <input value={signedInUser.email || ""} readOnly />
            </label>
            <button className="button primary" type="submit" disabled={profileStatus === "submitting"}>
              {profileStatus === "submitting" ? "Saving..." : "Save account"}
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </form>

          <form className="form-card" onSubmit={handleSavedOperationSubmit} noValidate>
            {savedStatus === "success" && (
              <div className="success-message" role="status">
                <CheckCircle2 size={19} aria-hidden="true" />
                Operation saved.
              </div>
            )}
            <h2>Save an operation</h2>
            <div className="form-grid">
              <label>
                Treatment
                <select name="treatment" required defaultValue="">
                  <option value="" disabled>
                    Choose treatment
                  </option>
                  {treatmentOptions.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label>
                County
                <select name="county" required defaultValue="">
                  <option value="" disabled>
                    Choose county
                  </option>
                  {counties.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              Notes
              <textarea name="notes" rows={3} placeholder="Office name, quote context, or questions to ask." />
            </label>
            <button className="button primary" type="submit" disabled={savedStatus === "submitting"}>
              {savedStatus === "submitting" ? "Saving..." : "Save operation"}
              <Bookmark size={18} aria-hidden="true" />
            </button>
          </form>

          <section className="saved-operations" aria-labelledby="saved-operations-heading">
            <div className="section-heading split-heading compact-heading">
              <div>
                <p className="eyebrow">Saved operations</p>
                <h2 id="saved-operations-heading">Procedures you are tracking</h2>
              </div>
            </div>
            {savedOperations.length > 0 ? (
              <div className="saved-list">
                {savedOperations.map((operation) => (
                  <article key={operation.id} className="saved-item">
                    <div>
                      <h3>{operation.treatment}</h3>
                      <p>
                        {operation.county}, {operation.state}
                      </p>
                      {operation.notes && <p>{operation.notes}</p>}
                    </div>
                    <button className="text-button" type="button" onClick={() => handleRemoveSavedOperation(operation.id)}>
                      Remove
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>No saved operations yet</h3>
                <p>Save procedures you are researching so the future marketplace flow has a place to build from.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </PageShell>
  );
}
