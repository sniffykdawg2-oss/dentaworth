import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import { counties, procedures } from "../content";
import { allPagesForPreview } from "../nav";
import { AuthUser } from "../backend/auth";
import {
  AdminContactMessageRecord,
  AdminDentistProfileRecord,
  AdminPriceRangeRecord,
  AdminPriceReportRecord,
  deleteAdminRecord,
  saveDentistProfile,
  savePriceRange,
  slugify,
  sortByUpdatedAt,
  subscribeToAdminCollection,
  updateReviewStatus,
} from "../backend/repository";
import { DentistProfileInput, PriceRangeInput, ReviewStatus } from "../backend/schema";
import { formatProcedurePrices } from "../pageHelpers";
import { PageShell } from "../components/PageShell";
import { AdminRecordList, AdminReviewPanel } from "../components/AdminPanels";

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

export function AdminPage({ authUser, navigate }: { authUser: AuthUser | null; navigate: (href: string) => void }) {
  const [activeTab, setActiveTab] = useState<"review" | "prices" | "dentists" | "pages">("review");
  const [priceReports, setPriceReports] = useState<AdminPriceReportRecord[]>([]);
  const [contactMessages, setContactMessages] = useState<AdminContactMessageRecord[]>([]);
  const [priceRanges, setPriceRanges] = useState<AdminPriceRangeRecord[]>([]);
  const [dentistProfiles, setDentistProfiles] = useState<AdminDentistProfileRecord[]>([]);
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!authUser?.isAdmin) return;

    const unsubscribePriceReports = subscribeToAdminCollection("priceReports", setPriceReports);
    const unsubscribeContactMessages = subscribeToAdminCollection("contactMessages", setContactMessages);
    const unsubscribePriceRanges = subscribeToAdminCollection("priceRanges", setPriceRanges);
    const unsubscribeDentistProfiles = subscribeToAdminCollection("dentistProfiles", setDentistProfiles);

    return () => {
      unsubscribePriceReports();
      unsubscribeContactMessages();
      unsubscribePriceRanges();
      unsubscribeDentistProfiles();
    };
  }, [authUser]);

  if (!authUser) {
    return (
      <section className="auth-page">
        <div className="auth-copy">
          <p className="eyebrow">Admin dashboard</p>
          <h1>Sign in to manage Dentaworth.</h1>
          <p>Admin tools require Firebase Auth and an owner-approved admin claim.</p>
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

  if (!authUser.isAdmin) {
    return (
      <PageShell
        eyebrow="Admin dashboard"
        title="Admin access is required."
        intro="Your account is signed in, but it does not have the Firebase custom admin claim needed for review and publishing tools."
        variant="legal"
      >
        <button className="button primary" type="button" onClick={() => navigate("/account")}>
          Back to account
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </PageShell>
    );
  }

  const adminUser = authUser;
  const pendingReports = priceReports.filter((record) => record.status === "pending");
  const pendingMessages = contactMessages.filter((record) => record.status === "pending");
  const sortedPriceRanges = sortByUpdatedAt(priceRanges);
  const sortedDentistProfiles = sortByUpdatedAt(dentistProfiles);
  const pageGroups = groupPagesByGroup();

  async function runAdminAction(action: () => Promise<unknown>, successMessage: string) {
    setStatus("submitting");
    setMessage("");

    try {
      await action();
      setStatus("success");
      setMessage(successMessage);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Admin action failed.");
    }
  }

  async function handleReview(collectionName: "priceReports" | "contactMessages", recordId: string, nextStatus: ReviewStatus) {
    await runAdminAction(
      () => updateReviewStatus(collectionName, recordId, nextStatus, adminUser.uid),
      `Marked ${recordId} as ${nextStatus}.`,
    );
  }

  async function handlePriceRangeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const low = Number(formData.get("low"));
    const high = Number(formData.get("high"));

    if (!Number.isFinite(low) || !Number.isFinite(high) || low < 0 || high < low) {
      setStatus("error");
      setMessage("Enter a valid low/high price range.");
      return;
    }

    const input: PriceRangeInput = {
      state: "Florida",
      county: String(formData.get("county") || ""),
      procedure: formData.get("procedure") as PriceRangeInput["procedure"],
      low,
      high,
      currency: "USD",
      rating: Number(formData.get("rating")) || undefined,
      status: formData.get("status") as PriceRangeInput["status"],
      sourceSummary: String(formData.get("sourceSummary") || "").trim(),
    };

    await runAdminAction(async () => {
      await savePriceRange(input, adminUser.uid);
      form.reset();
    }, "Price range saved.");
  }

  async function handleDentistProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const practiceName = String(formData.get("practiceName") || "").trim();
    const services = formData.getAll("services") as DentistProfileInput["services"];

    if (!practiceName || services.length === 0) {
      setStatus("error");
      setMessage("Enter a practice name and select at least one service.");
      return;
    }

    const input: DentistProfileInput = {
      practiceName,
      slug: slugify(String(formData.get("slug") || practiceName)),
      state: "Florida",
      county: String(formData.get("county") || ""),
      city: String(formData.get("city") || "").trim() || undefined,
      address: String(formData.get("address") || "").trim() || undefined,
      zipCode: String(formData.get("zipCode") || "").trim() || undefined,
      websiteUrl: String(formData.get("websiteUrl") || "").trim() || undefined,
      phone: String(formData.get("phone") || "").trim() || undefined,
      email: String(formData.get("email") || "").trim() || undefined,
      services,
      notes: String(formData.get("notes") || "").trim() || undefined,
      status: formData.get("status") as DentistProfileInput["status"],
    };

    await runAdminAction(async () => {
      await saveDentistProfile(input, adminUser.uid);
      form.reset();
    }, "Dentist profile saved.");
  }

  return (
    <PageShell
      eyebrow="Admin dashboard"
      title="Manage Dentaworth launch data."
      intro="Review public submissions, publish price ranges, maintain dentist profile records, and preview every site page from one protected workspace."
      variant="account"
    >
      <div className="admin-shell">
        <div className="admin-tabs" role="tablist" aria-label="Admin sections">
          {[
            { id: "review", label: "Review queue" },
            { id: "prices", label: "Price ranges" },
            { id: "dentists", label: "Dentists" },
            { id: "pages", label: "Pages" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {status === "success" && (
          <div className="success-message" role="status">
            <CheckCircle2 size={19} aria-hidden="true" />
            {message}
          </div>
        )}
        {status === "error" && (
          <div className="error-message" role="alert">
            {message}
          </div>
        )}

        {activeTab === "review" && (
          <div className="admin-grid">
            <AdminReviewPanel
              title="Self-reported prices"
              emptyText="No pending price reports."
              records={pendingReports}
              renderRecord={(record) => (
                <>
                  <h3>{record.county}, {record.state}</h3>
                  <p>{record.providerName || "No provider listed"}</p>
                  <p>{formatProcedurePrices(record.procedurePrices)}</p>
                  {record.notes && <p>{record.notes}</p>}
                  <div className="card-actions">
                    <button className="button primary" type="button" onClick={() => handleReview("priceReports", record.id, "approved")}>
                      Approve
                    </button>
                    <button className="button secondary" type="button" onClick={() => handleReview("priceReports", record.id, "rejected")}>
                      Reject
                    </button>
                    <button className="text-button" type="button" onClick={() => handleReview("priceReports", record.id, "archived")}>
                      Archive
                    </button>
                  </div>
                </>
              )}
            />
            <AdminReviewPanel
              title="Contact messages"
              emptyText="No pending messages."
              records={pendingMessages}
              renderRecord={(record) => (
                <>
                  <h3>{record.name}</h3>
                  <p>{record.email} · {record.topic}</p>
                  <p>{record.message}</p>
                  <div className="card-actions">
                    <button className="button primary" type="button" onClick={() => handleReview("contactMessages", record.id, "approved")}>
                      Mark handled
                    </button>
                    <button className="text-button" type="button" onClick={() => handleReview("contactMessages", record.id, "archived")}>
                      Archive
                    </button>
                  </div>
                </>
              )}
            />
          </div>
        )}

        {activeTab === "prices" && (
          <div className="admin-grid">
            <form className="form-card admin-form" onSubmit={handlePriceRangeSubmit}>
              <h2>Add or update price range</h2>
              <div className="form-grid">
                <label>
                  County
                  <select name="county" required defaultValue="">
                    <option value="" disabled>Choose county</option>
                    {counties.map((countyName) => (
                      <option key={countyName}>{countyName}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Procedure
                  <select name="procedure" required defaultValue="">
                    <option value="" disabled>Choose procedure</option>
                    {procedures.map((procedure) => (
                      <option key={procedure.key} value={procedure.key}>{procedure.label}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Low
                  <input name="low" type="number" min="0" step="1" required />
                </label>
                <label>
                  High
                  <input name="high" type="number" min="0" step="1" required />
                </label>
                <label>
                  Rating
                  <input name="rating" type="number" min="0" max="5" step="0.01" />
                </label>
                <label>
                  Status
                  <select name="status" required defaultValue="draft">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </label>
              </div>
              <label>
                Source summary
                <textarea name="sourceSummary" rows={3} required placeholder="Describe where this range came from and when it was reviewed." />
              </label>
              <button className="button primary" type="submit" disabled={status === "submitting"}>
                Save price range
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </form>
            <AdminRecordList
              title="Existing ranges"
              emptyText="No price ranges entered yet."
              records={sortedPriceRanges}
              renderRecord={(record) => (
                <>
                  <h3>{record.county} · {getLabel(record.procedure)}</h3>
                  <p>${record.low} - ${record.high} · {record.status}</p>
                  <p>{record.sourceSummary}</p>
                  <button className="text-button" type="button" onClick={() => runAdminAction(() => deleteAdminRecord("priceRanges", record.id, adminUser.uid), "Price range deleted.")}>
                    Delete
                  </button>
                </>
              )}
            />
          </div>
        )}

        {activeTab === "dentists" && (
          <div className="admin-grid">
            <form className="form-card admin-form" onSubmit={handleDentistProfileSubmit}>
              <h2>Add or update dentist profile</h2>
              <div className="form-grid">
                <label>
                  Practice name
                  <input name="practiceName" required />
                </label>
                <label>
                  Slug
                  <input name="slug" placeholder="auto-generated if blank" />
                </label>
                <label>
                  County
                  <select name="county" required defaultValue="">
                    <option value="" disabled>Choose county</option>
                    {counties.map((countyName) => (
                      <option key={countyName}>{countyName}</option>
                    ))}
                  </select>
                </label>
                <label>
                  City
                  <input name="city" />
                </label>
                <label>
                  Address
                  <input name="address" />
                </label>
                <label>
                  ZIP code
                  <input name="zipCode" />
                </label>
                <label>
                  Website
                  <input name="websiteUrl" type="url" />
                </label>
                <label>
                  Phone
                  <input name="phone" type="tel" />
                </label>
                <label>
                  Email
                  <input name="email" type="email" />
                </label>
                <label>
                  Status
                  <select name="status" required defaultValue="draft">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </label>
              </div>
              <fieldset className="checkbox-group">
                <legend>Services</legend>
                {procedures.map((procedure) => (
                  <label key={procedure.key}>
                    <input name="services" type="checkbox" value={procedure.key} />
                    {procedure.label}
                  </label>
                ))}
              </fieldset>
              <label>
                Notes
                <textarea name="notes" rows={3} placeholder="Internal launch notes, contact context, or review details." />
              </label>
              <button className="button primary" type="submit" disabled={status === "submitting"}>
                Save dentist
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </form>
            <AdminRecordList
              title="Existing dentist profiles"
              emptyText="No dentist profiles entered yet."
              records={sortedDentistProfiles}
              renderRecord={(record) => (
                <>
                  <h3>{record.practiceName}</h3>
                  <p>{[record.city, record.county, record.state].filter(Boolean).join(", ")} · {record.status}</p>
                  <p>{record.services.map(getLabel).join(", ")}</p>
                  <button className="text-button" type="button" onClick={() => runAdminAction(() => deleteAdminRecord("dentistProfiles", record.id, adminUser.uid), "Dentist profile deleted.")}>
                    Delete
                  </button>
                </>
              )}
            />
          </div>
        )}

        {activeTab === "pages" && (
          <div className="admin-panel">
            <div className="compact-heading">
              <p className="eyebrow">{allPagesForPreview.length} pages</p>
              <h2>Preview every site page</h2>
            </div>
            <div className="admin-pages-groups">
              {pageGroups.map(([group, links]) => (
                <div className="admin-pages-group" key={group}>
                  <h3>{group}</h3>
                  <div className="admin-pages-list">
                    {links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={(event) => {
                          event.preventDefault();
                          navigate(link.href);
                        }}
                      >
                        {link.label}
                        <ExternalLink size={15} aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}

function groupPagesByGroup() {
  const groups = new Map<string, typeof allPagesForPreview>();

  for (const page of allPagesForPreview) {
    const existing = groups.get(page.group) || [];
    existing.push(page);
    groups.set(page.group, existing);
  }

  return [...groups.entries()];
}

function getLabel(procedureKey: string) {
  return procedures.find((procedure) => procedure.key === procedureKey)?.label || procedureKey;
}
