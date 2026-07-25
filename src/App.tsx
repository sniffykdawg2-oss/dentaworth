import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Bookmark,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Mail,
  MapPin,
  Menu,
  Search,
  ShieldCheck,
  Star,
  Stethoscope,
  UserRound,
  Users,
  X,
} from "lucide-react";
import {
  counties,
  CountyCostRow,
  countyCostRows,
  disclaimerText,
  footerActions,
  navItems,
  procedures,
  ProcedureKey,
  treatmentOptions,
} from "./content";
import { buildContactMessageInput } from "./backend/contact";
import {
  AdminContactMessageRecord,
  AdminDentistProfileRecord,
  AdminPriceRangeRecord,
  AdminPriceReportRecord,
  createContactMessage,
  createPriceReport,
  deleteAdminRecord,
  saveDentistProfile,
  savePriceRange,
  slugify,
  sortByUpdatedAt,
  subscribeToAdminCollection,
  subscribeToPublishedDentistProfiles,
  subscribeToPublishedPriceRanges,
  updateReviewStatus,
} from "./backend/repository";
import { DentistProfileInput, DentistProfileRecord, PriceRangeInput, PriceRangeRecord, ReviewStatus } from "./backend/schema";
import { buildPriceReportInput } from "./backend/validation";
import {
  AuthUser,
  createSavedOperation,
  deleteSavedOperation,
  sendSignInReset,
  signInWithEmail,
  signOutCurrentUser,
  SavedOperation,
  subscribeToSavedOperations,
  subscribeToAuth,
  updateAccountProfile,
} from "./backend/auth";

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

type Page =
  | "home"
  | "self-reporting"
  | "about"
  | "privacy-policy"
  | "contact"
  | "get-care-now"
  | "find-a-dentist"
  | "advertise-with-us"
  | "promote-your-practice"
  | "sign-in"
  | "account"
  | "admin"
  | "not-found";

const routeTitles: Record<Page, string> = {
  home: "Florida dental ratings and cost guide",
  "self-reporting": "Self reporting page",
  about: "About Dentaworth",
  "privacy-policy": "Privacy Policy",
  contact: "Contact us",
  "get-care-now": "Get care now",
  "find-a-dentist": "Find a dentist",
  "advertise-with-us": "Advertise with us",
  "promote-your-practice": "Promote your practice",
  "sign-in": "Sign in",
  account: "Account center",
  admin: "Admin dashboard",
  "not-found": "Page not found",
};

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

function getCurrentPage(): Page {
  const path = window.location.pathname.replace(/\/$/, "");

  if (path === "") return "home";
  if (path === "/self-reporting") return "self-reporting";
  if (path === "/about") return "about";
  if (path === "/privacy-policy") return "privacy-policy";
  if (path === "/contact") return "contact";
  if (path === "/get-care-now") return "get-care-now";
  if (path === "/find-a-dentist") return "find-a-dentist";
  if (path === "/advertise-with-us") return "advertise-with-us";
  if (path === "/promote-your-practice") return "promote-your-practice";
  if (path === "/sign-in") return "sign-in";
  if (path === "/account") return "account";
  if (path === "/admin") return "admin";

  return "not-found";
}

function getGuideFiltersFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const treatment = params.get("treatment") || "";
  const county = params.get("county") || "";

  return {
    treatment: treatmentOptions.includes(treatment) ? treatment : "",
    county: counties.includes(county) ? county : "",
  };
}

export function App() {
  const [page, setPage] = useState<Page>(getCurrentPage);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [routeVersion, setRouteVersion] = useState(0);

  useEffect(() => {
    function handlePopState() {
      setPage(getCurrentPage());
      setRouteVersion((version) => version + 1);
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => subscribeToAuth(setAuthUser), []);

  function navigate(href: string) {
    window.history.pushState(null, "", href);
    setPage(getCurrentPage());
    setRouteVersion((version) => version + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <PageMeta page={page} />
      <Header currentPage={page} navigate={navigate} authUser={authUser} />
      <main id="main-content">
        {page === "home" && <HomePage navigate={navigate} routeVersion={routeVersion} />}
        {page === "self-reporting" && <SelfReportingPage />}
        {page === "about" && <AboutPage navigate={navigate} />}
        {page === "privacy-policy" && <PrivacyPolicyPage />}
        {page === "contact" && <ContactPage />}
        {page === "get-care-now" && <GetCareNowPage navigate={navigate} />}
        {page === "find-a-dentist" && <FindADentistPage navigate={navigate} />}
        {page === "advertise-with-us" && <AdvertiseWithUsPage />}
        {page === "promote-your-practice" && <PromotePracticePage />}
        {page === "sign-in" && <SignInPage authUser={authUser} navigate={navigate} />}
        {page === "account" && <AccountPage authUser={authUser} navigate={navigate} />}
        {page === "admin" && <AdminPage authUser={authUser} navigate={navigate} />}
        {page === "not-found" && <NotFoundPage navigate={navigate} />}
      </main>
      <Disclaimer />
      <Footer navigate={navigate} />
    </>
  );
}

function PageMeta({ page }: { page: Page }) {
  const title = `${routeTitles[page]} | Dentaworth`;
  const description =
    "Dentaworth provides Florida dental ratings and cash price range estimates for common dental procedures.";

  useEffect(() => {
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
  }, [description, title]);

  return null;
}

function Header({
  currentPage,
  navigate,
  authUser,
}: {
  currentPage: Page;
  navigate: (href: string) => void;
  authUser: AuthUser | null;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [headerTreatment, setHeaderTreatment] = useState("");
  const [headerCounty, setHeaderCounty] = useState("");

  function handleNav(href: string) {
    setIsMenuOpen(false);
    navigate(href);
  }

  function handleHeaderSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();

    if (headerTreatment) params.set("treatment", headerTreatment);
    if (headerCounty) params.set("county", headerCounty);

    navigate(params.toString() ? `/?${params.toString()}` : "/");

    requestAnimationFrame(() => {
      document.getElementById("guide-heading")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  async function handleSignOut() {
    await signOutCurrentUser();
    navigate("/");
  }

  return (
    <header className="site-header">
      <button
        className="drawer-toggle"
        type="button"
        aria-expanded={isMenuOpen}
        aria-controls="site-drawer"
        onClick={() => setIsMenuOpen(true)}
      >
        <Menu size={28} aria-hidden="true" />
        <span className="sr-only">Open navigation</span>
      </button>
      <a className="brand" href="/" onClick={(event) => handleLinkClick(event, "/", navigate)}>
        <img src="/images/dentaworth-mark.svg" alt="" aria-hidden="true" />
        <span>Dentaworth</span>
      </a>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <form className="header-search" onSubmit={handleHeaderSearch} aria-label="Search dental prices">
        <label>
          <span>Search</span>
          <select value={headerTreatment} onChange={(event) => setHeaderTreatment(event.target.value)}>
            <option value="">Treatment or procedure</option>
            {treatmentOptions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Location</span>
          <select value={headerCounty} onChange={(event) => setHeaderCounty(event.target.value)}>
            <option value="">Florida counties</option>
            {counties.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <button type="submit" aria-label="Search">
          <Search size={21} aria-hidden="true" />
        </button>
      </form>
      <div className="header-actions">
        {authUser ? (
          <button className="header-link-button" type="button" onClick={() => navigate("/account")}>
            Account
          </button>
        ) : (
          <button className="header-link-button" type="button" onClick={() => navigate("/sign-in")}>
            Sign in
          </button>
        )}
        <button className="button primary compact" type="button" onClick={() => navigate("/find-a-dentist")}>
          Find care
        </button>
      </div>
      {isMenuOpen && <button className="drawer-scrim" type="button" aria-label="Close navigation" onClick={() => setIsMenuOpen(false)} />}
      <aside id="site-drawer" className={isMenuOpen ? "site-drawer is-open" : "site-drawer"} aria-hidden={!isMenuOpen}>
        <div className="drawer-header">
          <a className="brand" href="/" onClick={(event) => handleLinkClick(event, "/", navigate)}>
            <img src="/images/dentaworth-mark.svg" alt="" aria-hidden="true" />
            <span>Dentaworth</span>
          </a>
          <button type="button" onClick={() => setIsMenuOpen(false)} aria-label="Close navigation">
            <X size={22} aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Main pages">
          {[
            ...navItems,
            { label: "Advertise with us", href: "/advertise-with-us" },
            { label: "Promote your practice", href: "/promote-your-practice" },
            { label: "Privacy Policy", href: "/privacy-policy" },
            ...(authUser ? [{ label: "Account center", href: "/account" }] : []),
            ...(authUser?.isAdmin ? [{ label: "Admin dashboard", href: "/admin" }] : []),
          ].map((item) => {
            const itemPage = item.href === "/" ? "home" : (item.href.slice(1) as Page);
            return (
            <a
              key={item.href}
              href={item.href}
              aria-current={currentPage === itemPage ? "page" : undefined}
              onClick={(event) => {
                event.preventDefault();
                handleNav(item.href);
              }}
            >
              {item.label}
            </a>
            );
          })}
        </nav>
        <div className="drawer-account">
          <p>{authUser ? authUser.email : "Admin and owner tools"}</p>
          <button className="button secondary" type="button" onClick={() => handleNav(authUser ? "/account" : "/sign-in")}>
            {authUser ? "Open account" : "Sign in"}
          </button>
          {authUser && (
            <button className="text-button" type="button" onClick={handleSignOut}>
              Sign out
            </button>
          )}
        </div>
      </aside>
    </header>
  );
}

function HomePage({ navigate, routeVersion }: { navigate: (href: string) => void; routeVersion: number }) {
  const initialFilters = getGuideFiltersFromUrl();
  const [treatment, setTreatment] = useState(initialFilters.treatment);
  const [state, setState] = useState("Florida");
  const [county, setCounty] = useState(initialFilters.county);
  const [publishedPriceRanges, setPublishedPriceRanges] = useState<Array<{ id: string } & PriceRangeRecord>>([]);

  useEffect(() => {
    const nextFilters = getGuideFiltersFromUrl();
    setTreatment(nextFilters.treatment);
    setCounty(nextFilters.county);
  }, [routeVersion]);

  useEffect(() => {
    try {
      return subscribeToPublishedPriceRanges(setPublishedPriceRanges);
    } catch (error) {
      console.warn("Published price ranges are unavailable. Using seed table data.", error);
      return undefined;
    }
  }, []);

  const guideRows = useMemo(
    () => buildCountyRowsFromPriceRanges(publishedPriceRanges) || countyCostRows,
    [publishedPriceRanges],
  );

  const filteredRows = useMemo(() => {
    const selectedProcedure = procedures.find((procedure) => procedure.label === treatment);

    return guideRows.filter((row) => {
      const matchesCounty = county ? row.county === county : true;
      const matchesTreatment = selectedProcedure ? Boolean(row[selectedProcedure.key]) : true;

      return matchesCounty && matchesTreatment;
    });
  }, [county, guideRows, treatment]);

  return (
    <>
      <section className="hero guide-hero">
        <div className="hero-copy">
          <p className="eyebrow">Dental price tool</p>
          <h1>Know before you go.</h1>
          <p className="hero-subtitle">
            Search by treatment and location to compare Florida dental price ranges before you call
            around.
          </p>
        </div>
        <figure className="hero-visual">
          <img
            src="/images/dentaworth-hero.png"
            alt="Dental care team preparing a patient room"
          />
        </figure>
        <div className="hero-search-card" aria-label="Find dental pricing">
          <div className="search-card-heading">
            <h2>Find the dental price range you need</h2>
            <a href="#method-note">Treatment complications may affect pricing</a>
          </div>
          <div className="guide-controls" aria-label="Filter cost guide">
            <label>
              Treatment
              <select value={treatment} onChange={(event) => setTreatment(event.target.value)}>
                <option value="">All treatments</option>
                {treatmentOptions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              State
              <select value={state} onChange={(event) => setState(event.target.value)}>
                <option>Florida</option>
              </select>
            </label>
            <label>
              County
              <select value={county} onChange={(event) => setCounty(event.target.value)}>
                <option value="">All counties</option>
                {counties.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <a className="button primary" href="#guide-heading">
              Search
              <Search size={18} aria-hidden="true" />
            </a>
          </div>
          <div className="quick-links" aria-label="Popular procedures">
            {["Cleaning", "Exam", "Implant", "Root canal", "Whitening", "Invisalign"].map((item) => (
              <a key={item} href="#guide-heading" onClick={() => setTreatment(item)}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section home-services" aria-labelledby="home-services-heading">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">Start your search</p>
            <h2 id="home-services-heading">Compare common dental procedures.</h2>
          </div>
          <button className="button secondary dark" type="button" onClick={() => navigate("/get-care-now")}>
            How to use the guide
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="procedure-spotlight-grid">
          {[
            {
              title: "Routine care",
              items: ["Cleaning", "Exam", "X-ray"],
              description: "Set expectations before booking preventive visits or first appointments.",
            },
            {
              title: "Restorative work",
              items: ["Filling", "Crown, ceramic", "Root canal"],
              description: "Compare common treatment ranges before talking through a treatment plan.",
            },
            {
              title: "Major treatment",
              items: ["Extraction", "Implant", "Invisalign"],
              description: "Use county-level ranges as a starting point for bigger financial decisions.",
            },
          ].map((group) => (
            <article key={group.title} className="procedure-spotlight-card">
              <Stethoscope aria-hidden="true" />
              <h3>{group.title}</h3>
              <p>{group.description}</p>
              <div>
                {group.items.map((item) => (
                  <a key={item} href="#guide-heading" onClick={() => setTreatment(item)}>
                    {item}
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section browse-section" aria-labelledby="browse-heading">
        <div className="browse-copy">
          <p className="eyebrow">Browse Florida</p>
          <h2 id="browse-heading">Find price context by county.</h2>
          <p>
            Dental cash prices can vary by local market. Start with a county, then compare the
            procedures most relevant to your appointment.
          </p>
        </div>
        <div className="county-link-grid" aria-label="Popular counties">
          {counties.slice(0, 8).map((item) => (
            <a
              key={item}
              href={`/?county=${encodeURIComponent(item)}`}
              onClick={(event) => {
                event.preventDefault();
                navigate(`/?county=${encodeURIComponent(item)}`);
                requestAnimationFrame(() => {
                  document.getElementById("guide-heading")?.scrollIntoView({ behavior: "smooth" });
                });
              }}
            >
              <MapPin size={18} aria-hidden="true" />
              {item}
            </a>
          ))}
        </div>
      </section>

      <section className="section how-section" aria-labelledby="how-heading">
        <div className="section-heading centered-heading">
          <p className="eyebrow">How Dentaworth works</p>
          <h2 id="how-heading">A clearer path before you call around.</h2>
          <p>
            Dentaworth is built to help people understand dental pricing earlier in the care
            journey, without pretending estimates are final quotes.
          </p>
        </div>
        <div className="how-step-grid">
          {[
            {
              icon: Search,
              title: "Search by treatment",
              text: "Choose the procedure you are researching and narrow results by Florida county.",
            },
            {
              icon: BarChart3,
              title: "Compare local ranges",
              text: "Use county-level cash price ranges to frame questions for dental offices.",
            },
            {
              icon: ClipboardCheck,
              title: "Ask better questions",
              text: "Confirm what is included, whether complications change pricing, and what payment options exist.",
            },
          ].map((step, index) => {
            const Icon = step.icon;
            return (
              <article key={step.title} className="how-step-card">
                <span>{index + 1}</span>
                <Icon aria-hidden="true" />
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section table-section" aria-labelledby="guide-heading">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">Cost guide</p>
            <h2 id="guide-heading">Compare procedure ranges by county</h2>
          </div>
          <button className="button secondary dark" type="button" onClick={() => navigate("/self-reporting")}>
            Submit pricing
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>

        <CostGuideTable rows={filteredRows} />
        <p className="table-hint">Scroll sideways to compare more procedures.</p>
        {filteredRows.length === 0 && (
          <div className="empty-state">
            <h3>No matching rows</h3>
            <p>Clear the filters or try another treatment and county.</p>
          </div>
        )}
      </section>

      <section className="section audience-section" aria-labelledby="audience-heading">
        <div className="section-heading centered-heading">
          <p className="eyebrow">Built for both sides</p>
          <h2 id="audience-heading">Patients need context. Practices need visibility.</h2>
        </div>
        <div className="audience-grid">
          <article>
            <Users aria-hidden="true" />
            <h3>For patients</h3>
            <p>
              Compare procedure ranges, save operations in your account, and submit pricing you
              have received to improve the guide over time.
            </p>
            <div className="card-actions">
              <button className="button primary" type="button" onClick={() => navigate("/account")}>
                Open account
                <ArrowRight size={18} aria-hidden="true" />
              </button>
              <button className="button secondary dark" type="button" onClick={() => navigate("/self-reporting")}>
                Self-report prices
              </button>
            </div>
          </article>
          <article>
            <FileText aria-hidden="true" />
            <h3>For dental practices</h3>
            <p>
              Dentaworth is preparing practice profiles and promotion options for offices that want
              to reach people researching treatment costs.
            </p>
            <div className="card-actions">
              <button className="button primary" type="button" onClick={() => navigate("/promote-your-practice")}>
                Promote your practice
                <ArrowRight size={18} aria-hidden="true" />
              </button>
              <button className="button secondary dark" type="button" onClick={() => navigate("/advertise-with-us")}>
                Advertise
              </button>
            </div>
          </article>
        </div>
      </section>

      <section className="section method-section" id="method-note">
        <div className="method-copy">
          <p className="eyebrow">Important context</p>
          <h2>Treatment complications may affect pricing.</h2>
          <p>
            Dental procedures can vary based on complexity, materials, provider recommendations,
            insurance status, and patient-specific treatment needs. Use Dentaworth as a starting
            point, not as a final quote.
          </p>
        </div>
        <div className="method-list">
          <div>
            <BarChart3 aria-hidden="true" />
            <span>County-level ranges</span>
          </div>
          <div>
            <ShieldCheck aria-hidden="true" />
            <span>Clear disclaimer language</span>
          </div>
          <div>
            <Star aria-hidden="true" />
            <span>Self-reported pricing support</span>
          </div>
        </div>
      </section>
    </>
  );
}

function CostGuideTable({ rows }: { rows: CountyCostRow[] }) {
  return (
    <div className="table-wrap" tabIndex={0} aria-label="Scrollable dental cost guide table">
      <table>
        <caption>Florida dental rating and cash price range estimates by county</caption>
        <thead>
          <tr>
            <th scope="col">County</th>
            <th scope="col">Rating</th>
            {procedures.map((procedure) => (
              <th key={procedure.key} scope="col">
                {procedure.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.county}>
              <th scope="row">{row.county}</th>
              <td>{row.rating}</td>
              {procedures.map((procedure) => (
                <td key={procedure.key}>{row[procedure.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SelfReportingPage() {
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
      <div className="security-note">
        <ShieldCheck aria-hidden="true" />
        <div>
          <h2>Security and privacy</h2>
          <p>
            Only submit information you are comfortable sharing. Personal contact details are kept
            separate from public-facing price range content when backend storage is connected.
          </p>
        </div>
      </div>
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
    </PageShell>
  );
}

function AboutPage({ navigate }: { navigate: (href: string) => void }) {
  return (
    <PageShell
      eyebrow="About us"
      title="Why Dentaworth?"
      intro="Our experience, and those of many friends and family, led us to realize that dental pricing is a mystery. Dentaworth can help eliminate the guesswork."
      variant="default"
    >
      <BackButton />
      <div className="content-grid">
        <article>
          <h2>Our mission</h2>
          <p>
            Empower patients by providing an online information marketplace for dental pricing. One
            that enables consumers to have prior knowledge of dental cost estimates and to know what
            other patients paid. Price transparency and peace of mind are only a few clicks away.
          </p>
        </article>
        <article>
          <h2>Our methodology</h2>
          <p>
            We developed our algorithm to calculate price ranges using market data and unique
            self-reported pricing within counties.
          </p>
        </article>
      </div>
      <div className="callout-band">
        <div>
          <h2>Have recent pricing to share?</h2>
          <p>Self-reported prices help improve future guide coverage.</p>
        </div>
        <button className="button primary" type="button" onClick={() => navigate("/self-reporting")}>
          Self report pricing
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </PageShell>
  );
}

function PrivacyPolicyPage() {
  return (
    <PageShell
      eyebrow="Privacy Policy"
      title="Privacy Policy"
      intro="Effective Date: June 27, 2026"
      variant="legal"
    >
      <BackButton />
      <div className="legal-copy">
        <p>
          At Dentaworth ("we," "our," or "us"), accessible from dentaworth.com, one of our main
          priorities is the privacy of our visitors. This Privacy Policy contains types of
          information that is collected and recorded by Dentaworth and how we use it.
        </p>
        <p>
          If you have additional questions or require more information about our Privacy Policy, do
          not hesitate to contact us.
        </p>
        <h2>Information we collect</h2>
        <p>
          We collect several different types of information for various purposes to provide and
          improve our service to you. While using our site, such as filling out a self-report form,
          we may ask you to provide certain personally identifiable information that can be used to
          contact or identify you. This may include first and last name, email address, and dental
          information that you voluntarily submit through our site.
        </p>
        <p>
          We also collect information on how the website is accessed and used. This may include your
          computer's internet protocol address, browser type, browser version, pages visited, time
          and date of visit, time spent on pages, and other diagnostic data.
        </p>
        <h2>How we use your information</h2>
        <p>
          Dentaworth uses collected data to provide, operate, and maintain our website and services;
          notify you about service changes or upcoming appointments; allow participation in
          interactive website features; provide patient support and process dental inquiries; gather
          analysis to improve the website; monitor usage; detect, prevent, and address technical
          issues; and communicate with you for marketing or promotional purposes with your consent.
        </p>
        <h2>Cookies and web beacons</h2>
        <p>
          Like many websites, dentaworth.com uses cookies. Cookies may store information including
          visitor preferences and pages accessed or visited. This information is used to optimize the
          user experience by customizing page content based on browser type or other information.
          You can choose to disable cookies through your individual browser options.
        </p>
        <h2>Sharing and disclosure of data</h2>
        <p>
          We do not sell, trade, or rent your personal identification information to others. We may
          share data with service providers who help operate the website or analyze usage, and they
          are obligated not to disclose or use it for other purposes. We may also disclose personal
          data when necessary to comply with a legal obligation, protect the rights or property of
          Dentaworth, or protect the personal safety of users or the public.
        </p>
        <h2>Data security</h2>
        <p>
          The security of your data is important to us. We use industry-standard measures, such as
          SSL encryption, to protect personal information. However, no method of transmission over
          the Internet or method of electronic storage is 100% secure, and we cannot guarantee
          absolute security.
        </p>
        <h2>Your data protection rights</h2>
        <p>
          Depending on your location, you may have rights regarding your personal information,
          including the right to access copies of your personal data, request correction of
          inaccurate information, request erasure under certain conditions, and object to or restrict
          processing under certain conditions. If you make a request, we have one month to respond.
        </p>
        <h2>Children's privacy</h2>
        <p>
          We do not knowingly collect personally identifiable information from children under the age
          of 18. If you believe a child provided this kind of information on our website, contact us
          immediately and we will do our best to promptly remove it from our records.
        </p>
        <h2>Changes to this Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of changes by
          posting the new Privacy Policy on this page and updating the effective date. You are
          advised to review this Privacy Policy periodically for changes.
        </p>
        <h2>Contact</h2>
        <p>
          Questions about this policy can be sent to{" "}
          <a href="mailto:info@dentaworth.com">info@dentaworth.com</a>.
        </p>
      </div>
    </PageShell>
  );
}

function ContactPage() {
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
      title="Get in touch about Dentaworth."
      intro="Send questions, corrections, pricing context, or partnership notes. Keep medical emergencies and urgent treatment questions with a licensed dental provider."
      variant="business"
    >
      <BackButton />
      <div className="contact-layout">
        <form className="form-card" onSubmit={handleSubmit} noValidate>
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
        <aside className="contact-card">
          <Mail size={22} aria-hidden="true" />
          <h2>Email</h2>
          <a href="mailto:info@dentaworth.com">info@dentaworth.com</a>
          <p>Use email for corrections, self-reported price questions, or business inquiries.</p>
        </aside>
      </div>
    </PageShell>
  );
}

function GetCareNowPage({ navigate }: { navigate: (href: string) => void }) {
  return (
    <PageShell
      eyebrow="Get care now"
      title="Use the guide before you book dental care."
      intro="Dentaworth helps you understand common cash price ranges before you contact a dental office."
      variant="care"
    >
      <BackButton />
      <div className="content-grid">
        <article>
          <h2>Start with the price range</h2>
          <p>
            Compare treatment ranges by county, then use that context when asking offices about
            estimates, payment options, and what is included in a quoted price.
          </p>
        </article>
        <article>
          <h2>Ask about complications</h2>
          <p>
            Treatment complexity can change the final cost. Ask whether the estimate assumes a
            routine case or includes potential complications.
          </p>
        </article>
      </div>
      <div className="callout-band">
        <div>
          <h2>Ready to compare?</h2>
          <p>Go back to the cost guide and search by treatment and location.</p>
        </div>
        <button className="button primary" type="button" onClick={() => navigate("/")}>
          Open cost guide
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </PageShell>
  );
}

function FindADentistPage({ navigate }: { navigate: (href: string) => void }) {
  const [publishedDentists, setPublishedDentists] = useState<Array<{ id: string } & DentistProfileRecord>>([]);

  useEffect(() => {
    try {
      return subscribeToPublishedDentistProfiles(setPublishedDentists);
    } catch (error) {
      console.warn("Published dentist profiles are unavailable.", error);
      return undefined;
    }
  }, []);

  return (
    <PageShell
      eyebrow="Find a dentist"
      title="Find a dentist with better pricing context."
      intro="Dentaworth is preparing tools to help patients compare dental offices alongside county-level pricing information."
      variant="dentist"
    >
      <BackButton />
      {publishedDentists.length > 0 && (
        <section className="dentist-directory" aria-labelledby="dentist-directory-heading">
          <div className="section-heading split-heading compact-heading">
            <div>
              <p className="eyebrow">{publishedDentists.length} published</p>
              <h2 id="dentist-directory-heading">Published dentist profiles</h2>
            </div>
          </div>
          <div className="directory-grid">
            {publishedDentists.map((profile) => (
              <article key={profile.id}>
                <h3>{profile.practiceName}</h3>
                <p>{[profile.city, profile.county, profile.state].filter(Boolean).join(", ")}</p>
                <p>{profile.services.map(getProcedureLabel).join(", ")}</p>
                <div className="card-actions">
                  {profile.websiteUrl && (
                    <a className="button primary" href={profile.websiteUrl} target="_blank" rel="noreferrer">
                      Visit website
                      <ArrowRight size={18} aria-hidden="true" />
                    </a>
                  )}
                  {profile.phone && <a className="button secondary dark" href={`tel:${profile.phone}`}>Call</a>}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
      <div className="content-grid">
        <article>
          <h2>What is available now</h2>
          <p>
            The cost guide gives you a starting point for common procedures, including cleaning,
            exam, X-ray, filling, whitening, extraction, root canal, crown, implant, and Invisalign.
          </p>
        </article>
        <article>
          <h2>What comes next</h2>
          <p>
            Future dentist discovery features can build on the same treatment and location data
            model once the backend is connected.
          </p>
        </article>
      </div>
      <div className="callout-band">
        <div>
          <h2>Use the price tool first</h2>
          <p>Search by treatment and county before contacting offices.</p>
        </div>
        <button className="button primary" type="button" onClick={() => navigate("/")}>
          Search prices
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </PageShell>
  );
}

function AdvertiseWithUsPage() {
  return (
    <PageShell
      eyebrow="Advertise with us"
      title="Reach people researching dental care costs."
      intro="Dentaworth is built for visitors who are actively comparing dental treatment pricing and looking for clearer next steps."
      variant="business"
    >
      <BackButton />
      <div className="contact-layout">
        <div className="legal-copy">
          <h2>Advertising inquiries</h2>
          <p>
            Dentaworth can support advertising opportunities for dental organizations that want to
            reach patients during the research phase. Advertising must remain clearly separate from
            cost guide methodology and informational content.
          </p>
          <p>
            For advertising questions, contact{" "}
            <a href="mailto:info@dentaworth.com">info@dentaworth.com</a>.
          </p>
        </div>
        <aside className="contact-card">
          <Mail size={22} aria-hidden="true" />
          <h2>Email</h2>
          <a href="mailto:info@dentaworth.com">info@dentaworth.com</a>
        </aside>
      </div>
      <InquiryForm
        buttonLabel="Send advertising inquiry"
        messageLabel="Advertising goals"
        source="advertising-page"
        topic="advertising"
      />
    </PageShell>
  );
}

function PromotePracticePage() {
  return (
    <PageShell
      eyebrow="Promote your practice"
      title="Promote your dental practice with pricing-aware visitors."
      intro="Dentaworth is preparing practice promotion options for dental offices that want to be discovered by people comparing care costs."
      variant="business"
    >
      <BackButton />
      <div className="legal-copy">
        <h2>Practice promotion</h2>
        <p>
          Promotion opportunities can help dental practices share relevant information with people
          researching treatment costs. Future backend work can support practice profiles, location
          details, accepted services, and inquiry routing.
        </p>
        <p>
          To discuss practice promotion, contact{" "}
          <a href="mailto:info@dentaworth.com">info@dentaworth.com</a>.
        </p>
      </div>
      <InquiryForm
        buttonLabel="Send practice inquiry"
        messageLabel="Practice details"
        source="practice-promotion-page"
        topic="practice-promotion"
      />
    </PageShell>
  );
}

function SignInPage({
  authUser,
  navigate,
}: {
  authUser: AuthUser | null;
  navigate: (href: string) => void;
}) {
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

  async function handleReset(event: React.MouseEvent<HTMLButtonElement>) {
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

function InquiryForm({
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

function SpamTrap({ formStartedAt }: { formStartedAt: number }) {
  return (
    <div className="bot-field" aria-hidden="true">
      <label>
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <input type="hidden" name="formStartedAt" value={formStartedAt} />
    </div>
  );
}

function AccountPage({
  authUser,
  navigate,
}: {
  authUser: AuthUser | null;
  navigate: (href: string) => void;
}) {
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
          <p className="eyebrow">Account center</p>
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
      title="Your Dentaworth workspace."
      intro="Manage account details, keep track of procedures you are researching, and prepare for future review tools."
      variant="account"
    >
      <div className="account-layout">
        <aside className="account-summary" aria-label="Account summary">
          <UserRound size={24} aria-hidden="true" />
          <h2>{signedInUser.displayName || "Dentaworth account"}</h2>
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

function AdminPage({
  authUser,
  navigate,
}: {
  authUser: AuthUser | null;
  navigate: (href: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<"review" | "prices" | "dentists">("review");
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

  async function handleReview(
    collectionName: "priceReports" | "contactMessages",
    recordId: string,
    nextStatus: ReviewStatus,
  ) {
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
      intro="Review public submissions, publish price ranges, and maintain dentist profile records from one protected workspace."
      variant="account"
    >
      <div className="admin-shell">
        <div className="admin-tabs" role="tablist" aria-label="Admin sections">
          {[
            { id: "review", label: "Review queue" },
            { id: "prices", label: "Price ranges" },
            { id: "dentists", label: "Dentists" },
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
                    <button className="button secondary dark" type="button" onClick={() => handleReview("priceReports", record.id, "rejected")}>
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
                  <h3>{record.county} · {getProcedureLabel(record.procedure)}</h3>
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
                  <p>{record.services.map(getProcedureLabel).join(", ")}</p>
                  <button className="text-button" type="button" onClick={() => runAdminAction(() => deleteAdminRecord("dentistProfiles", record.id, adminUser.uid), "Dentist profile deleted.")}>
                    Delete
                  </button>
                </>
              )}
            />
          </div>
        )}
      </div>
    </PageShell>
  );
}

function AdminReviewPanel<T extends { id: string }>({
  title,
  emptyText,
  records,
  renderRecord,
}: {
  title: string;
  emptyText: string;
  records: T[];
  renderRecord: (record: T) => React.ReactNode;
}) {
  return (
    <section className="admin-panel">
      <div className="compact-heading">
        <p className="eyebrow">{records.length} pending</p>
        <h2>{title}</h2>
      </div>
      {records.length > 0 ? (
        <div className="admin-list">
          {records.map((record) => (
            <article key={record.id}>{renderRecord(record)}</article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>{emptyText}</h3>
          <p>New submissions will appear here when visitors use the public forms.</p>
        </div>
      )}
    </section>
  );
}

function AdminRecordList<T extends { id: string }>({
  title,
  emptyText,
  records,
  renderRecord,
}: {
  title: string;
  emptyText: string;
  records: T[];
  renderRecord: (record: T) => React.ReactNode;
}) {
  return (
    <section className="admin-panel">
      <div className="compact-heading">
        <p className="eyebrow">{records.length} records</p>
        <h2>{title}</h2>
      </div>
      {records.length > 0 ? (
        <div className="admin-list">
          {records.map((record) => (
            <article key={record.id}>{renderRecord(record)}</article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>{emptyText}</h3>
          <p>Use the form to create the first launch record.</p>
        </div>
      )}
    </section>
  );
}

function NotFoundPage({ navigate }: { navigate: (href: string) => void }) {
  return (
    <PageShell
      eyebrow="404"
      title="That page is not in the guide."
      intro="The page may have moved, or the link may be wrong."
    >
      <button className="button primary" type="button" onClick={() => navigate("/")}>
        Return to cost guide
        <ArrowRight size={18} aria-hidden="true" />
      </button>
    </PageShell>
  );
}

function PageShell({
  eyebrow,
  title,
  intro,
  children,
  variant = "default",
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
  variant?: "default" | "care" | "dentist" | "business" | "legal" | "auth" | "account";
}) {
  return (
    <>
      <section className={`page-hero page-hero-${variant}`}>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
      </section>
      <section className="section page-section">{children}</section>
    </>
  );
}

function BackButton() {
  return (
    <button className="back-button" type="button" onClick={() => window.history.back()}>
      <ArrowRight size={17} aria-hidden="true" />
      Back
    </button>
  );
}

function Disclaimer() {
  return (
    <section className="bottom-disclaimer" aria-label="Dentaworth disclaimer">
      <p>{disclaimerText}</p>
    </section>
  );
}

function Footer({ navigate }: { navigate: (href: string) => void }) {
  return (
    <footer className="site-footer">
      <div>
        <a className="brand footer-brand" href="/" onClick={(event) => handleLinkClick(event, "/", navigate)}>
          <img src="/images/dentaworth-mark.svg" alt="" aria-hidden="true" />
          <span>Dentaworth</span>
        </a>
        <p>Florida dental ratings and cash price range estimates.</p>
      </div>
      <nav aria-label="Footer navigation">
        {footerActions.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={(event) => handleLinkClick(event, item.href, navigate)}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}

function handleLinkClick(
  event: React.MouseEvent<HTMLAnchorElement>,
  href: string,
  navigate: (href: string) => void,
) {
  event.preventDefault();
  navigate(href);
}

function readAuthError(error: unknown) {
  if (!(error instanceof Error)) return "Unable to sign in.";

  if (error.message.includes("auth/invalid-credential")) {
    return "The email or password did not match an account.";
  }

  if (error.message.includes("auth/operation-not-allowed")) {
    return "Email/password sign-in is not enabled in Firebase Authentication yet.";
  }

  if (error.message.includes("auth/too-many-requests")) {
    return "Too many attempts. Wait a bit and try again.";
  }

  return error.message;
}

function getProcedureLabel(procedureKey: ProcedureKey) {
  return procedures.find((procedure) => procedure.key === procedureKey)?.label || procedureKey;
}

function formatProcedurePrices(procedurePrices: Partial<Record<ProcedureKey, number>>) {
  const entries = Object.entries(procedurePrices) as Array<[ProcedureKey, number]>;

  if (entries.length === 0) return "No procedure prices submitted.";

  return entries.map(([procedureKey, price]) => `${getProcedureLabel(procedureKey)}: $${price}`).join(" · ");
}

function buildCountyRowsFromPriceRanges(priceRanges: Array<{ id: string } & PriceRangeRecord>) {
  if (priceRanges.length === 0) return null;

  const rowsByCounty = new Map<string, CountyCostRow>();

  for (const range of priceRanges) {
    const existingRow = rowsByCounty.get(range.county);
    const row =
      existingRow ||
      ({
        county: range.county,
        rating: range.rating ? String(range.rating) : "Not rated",
        rootCanal: "",
        xray: "",
        extraction: "",
        crown: "",
        cleaning: "",
        exam: "",
        implant: "",
        filling: "",
        whitening: "",
        invisalign: "",
      } satisfies CountyCostRow);

    row[range.procedure] = `${range.low} - ${range.high}`;
    if (range.rating) row.rating = String(range.rating);
    rowsByCounty.set(range.county, row);
  }

  return [...rowsByCounty.values()].sort((a, b) => {
    if (a.county === "Statewide average") return -1;
    if (b.county === "Statewide average") return 1;
    return a.county.localeCompare(b.county);
  });
}
