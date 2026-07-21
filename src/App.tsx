import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowRight, BarChart3, CheckCircle2, Mail, Menu, Search, ShieldCheck, Star, Users, X } from "lucide-react";
import { counties, countyCostRows, navItems, procedures, ProcedureKey } from "./content";

type Page = "home" | "self-reporting" | "about" | "privacy-policy" | "contact" | "not-found";

const routeTitles: Record<Page, string> = {
  home: "Florida dental ratings and cost guide",
  "self-reporting": "Self reporting page",
  about: "About Dentaworth",
  "privacy-policy": "Privacy Policy",
  contact: "Contact us",
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

  return "not-found";
}

export function App() {
  const [page, setPage] = useState<Page>(getCurrentPage);

  useEffect(() => {
    function handlePopState() {
      setPage(getCurrentPage());
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function navigate(href: string) {
    window.history.pushState(null, "", href);
    setPage(getCurrentPage());
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <PageMeta page={page} />
      <Header currentPage={page} navigate={navigate} />
      <main id="main-content">
        {page === "home" && <HomePage navigate={navigate} />}
        {page === "self-reporting" && <SelfReportingPage />}
        {page === "about" && <AboutPage navigate={navigate} />}
        {page === "privacy-policy" && <PrivacyPolicyPage />}
        {page === "contact" && <ContactPage />}
        {page === "not-found" && <NotFoundPage navigate={navigate} />}
      </main>
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
}: {
  currentPage: Page;
  navigate: (href: string) => void;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleNav(href: string) {
    setIsMenuOpen(false);
    navigate(href);
  }

  return (
    <header className="site-header">
      <a className="brand" href="/" onClick={(event) => handleLinkClick(event, "/", navigate)}>
        <span className="brand-mark" aria-hidden="true">
          D
        </span>
        <span>Dentaworth</span>
      </a>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={isMenuOpen}
        aria-controls="site-navigation"
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        {isMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        <span className="sr-only">Toggle menu</span>
      </button>
      <nav id="site-navigation" className={isMenuOpen ? "is-open" : ""} aria-label="Primary">
        {navItems.map((item) => {
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
    </header>
  );
}

function HomePage({ navigate }: { navigate: (href: string) => void }) {
  const [query, setQuery] = useState("");
  const [county, setCounty] = useState("");

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return countyCostRows.filter((row) => {
      const matchesCounty = county ? row.county === county : true;
      const matchesQuery = normalizedQuery
        ? [row.county, row.rating, ...procedures.map((procedure) => row[procedure.key])]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery)
        : true;

      return matchesCounty && matchesQuery;
    });
  }, [county, query]);

  return (
    <>
      <section className="notice-bar">
        Cash price ranges are estimates only, for informational purposes only. They are not
        quotations and are non-binding. Price ranges are based on independent estimations and
        self-reported data. Dentaworth does not verify or guarantee accuracy.
      </section>

      <section className="hero guide-hero">
        <div className="hero-copy">
          <p className="eyebrow">Florida dental cost intelligence</p>
          <h1>Feel clearer about dental costs in Florida.</h1>
          <p className="hero-subtitle">
            Search county-level rating estimates and cash price ranges for common dental treatments.
          </p>
          <div className="hero-cues" aria-label="Dentaworth guide highlights">
            <div>
              <BarChart3 aria-hidden="true" />
              <span>County-level cost ranges</span>
            </div>
            <div>
              <Star aria-hidden="true" />
              <span>Dental ratings by area</span>
            </div>
            <div>
              <Users aria-hidden="true" />
              <span>Self-reported pricing support</span>
            </div>
          </div>
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
              Search table
              <span className="input-shell">
                <Search size={17} aria-hidden="true" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Procedure, county, rating, or price"
                />
              </span>
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
              <a key={item} href="#guide-heading" onClick={() => setQuery(item)}>
                {item}
              </a>
            ))}
          </div>
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
            <p>Clear the filters or try another county name.</p>
          </div>
        )}
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

function CostGuideTable({ rows }: { rows: typeof countyCostRows }) {
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
  const [status, setStatus] = useState<"idle" | "success">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("success");
    event.currentTarget.reset();
  }

  return (
    <PageShell
      eyebrow="Self reporting page"
      title="Help improve the pricing guide."
      intro="Share dental procedure pricing you recently received or paid. Submissions help Dentaworth build better county-level estimates, but they are reviewed before being used."
    >
      <form className="form-card report-form" onSubmit={handleSubmit}>
        {status === "success" && (
          <div className="success-message" role="status">
            <CheckCircle2 size={19} aria-hidden="true" />
            Thanks. Your pricing report is ready to save once backend submission is connected.
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
        <button className="button primary" type="submit">
          Submit report
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
      title="Dentaworth makes Florida dental pricing easier to compare."
      intro="The site exists to organize dental cost information in a simpler, more useful format for people trying to understand procedure pricing before they contact a provider."
    >
      <div className="content-grid">
        <article>
          <h2>What Dentaworth does</h2>
          <p>
            Dentaworth publishes informational cash price ranges for common dental procedures and
            presents them by county. The goal is not to replace a dental consultation. The goal is to
            give people a cleaner starting point.
          </p>
        </article>
        <article>
          <h2>What Dentaworth does not do</h2>
          <p>
            Dentaworth does not verify every price, guarantee accuracy, diagnose treatment needs, or
            provide medical advice. Procedure complexity and provider-specific recommendations can
            materially affect final pricing.
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
    >
      <div className="legal-copy">
        <p>
          At dentaworth ("we," "our," or "us"), accessible from dentaworth.com, one of our main
          priorities is the privacy of our visitors. This Privacy Policy contains types of
          information that is collected and recorded by dentaworth and how we use it.
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
          dentaworth uses collected data to provide, operate, and maintain our website and services;
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
          dentaworth, or protect the personal safety of users or the public.
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
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");

    if (!email.includes("@")) {
      setStatus("error");
      return;
    }

    setStatus("success");
    event.currentTarget.reset();
  }

  return (
    <PageShell
      eyebrow="Contact us"
      title="Get in touch about Dentaworth."
      intro="Send questions, corrections, pricing context, or partnership notes. Keep medical emergencies and urgent treatment questions with a licensed dental provider."
    >
      <div className="contact-layout">
        <form className="form-card" onSubmit={handleSubmit} noValidate>
          {status === "success" && (
            <div className="success-message" role="status">
              <CheckCircle2 size={19} aria-hidden="true" />
              Thanks. Your message is ready to send once backend submission is connected.
            </div>
          )}
          {status === "error" && (
            <div className="error-message" role="alert">
              Please enter a valid email address.
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
          <button className="button primary" type="submit">
            Send message
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
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
      </section>
      <section className="section page-section">{children}</section>
    </>
  );
}

function Footer({ navigate }: { navigate: (href: string) => void }) {
  return (
    <footer className="site-footer">
      <div>
        <a className="brand footer-brand" href="/" onClick={(event) => handleLinkClick(event, "/", navigate)}>
          <span className="brand-mark" aria-hidden="true">
            D
          </span>
          <span>Dentaworth</span>
        </a>
        <p>Florida dental ratings and cash price range estimates.</p>
      </div>
      <nav aria-label="Footer navigation">
        {navItems.map((item) => (
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
