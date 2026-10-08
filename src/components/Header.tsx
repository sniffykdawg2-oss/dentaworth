import { CSSProperties, FormEvent, KeyboardEvent as ReactKeyboardEvent, useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, Search, X } from "lucide-react";
import { counties, treatmentOptions } from "../content";
import { footerColumns, handleLinkClick, Page } from "../nav";
import { AuthUser, signOutCurrentUser } from "../backend/auth";

type HeaderTone = "hero-top" | "hero" | "paper";

export function Header({
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
  const [tone, setTone] = useState<HeaderTone>("hero-top");
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  // Publish the real header height so heroes can sit underneath it.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const observer = new ResizeObserver(() => {
      document.documentElement.style.setProperty("--header-height", `${header.offsetHeight}px`);
    });
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  // Always visible: transparent at the very top of a page, then a solid bar that
  // matches the section beneath it (navy over the hero, paper everywhere else).
  useEffect(() => {
    let frame = 0;

    function update() {
      frame = 0;
      const y = window.scrollY;
      const headerHeight = headerRef.current?.offsetHeight ?? 76;
      const hero = document.querySelector("[data-hero]");
      const isOverHero = hero ? hero.getBoundingClientRect().bottom > headerHeight * 0.6 : false;

      setTone(isOverHero ? (y < 8 ? "hero-top" : "hero") : "paper");
    }

    function onScroll() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [currentPage]);

  // Drawer: lock scroll, move focus in, close on Escape, return focus on close.
  useEffect(() => {
    if (!isMenuOpen) return;
    const toggle = toggleRef.current;
    document.body.classList.add("has-open-drawer");
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsMenuOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("has-open-drawer");
      window.removeEventListener("keydown", onKeyDown);
      toggle?.focus({ preventScroll: true });
    };
  }, [isMenuOpen]);

  function trapDrawerFocus(event: ReactKeyboardEvent<HTMLElement>) {
    if (event.key !== "Tab" || !drawerRef.current) return;
    const focusable = drawerRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function handleNav(href: string) {
    setIsMenuOpen(false);
    navigate(href);
  }

  function handleHeaderSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();

    if (headerTreatment) params.set("treatment", headerTreatment);
    if (headerCounty) params.set("county", headerCounty);

    navigate(params.toString() ? `/search?${params.toString()}` : "/search");
  }

  async function handleSignOut() {
    await signOutCurrentUser();
    setIsMenuOpen(false);
    navigate("/");
  }

  const headerClassName = [
    "site-header",
    tone === "paper" ? "" : "tone-dark",
    tone === "hero-top" ? "is-at-top" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header ref={headerRef} className={headerClassName}>
        <div className="site-header__inner">
          <button
            ref={toggleRef}
            className="drawer-toggle"
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="site-drawer"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu size={22} aria-hidden="true" />
            <span className="sr-only">Open navigation</span>
          </button>
          <a className="brand" href="/" onClick={(event) => handleLinkClick(event, "/", navigate)}>
            <span>Denta</span>
            <span className="brand-worth">Worth</span>
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
              <Search size={18} aria-hidden="true" />
            </button>
          </form>
          <div className="header-actions">
            <a
              className="header-provider-link"
              href="/find-a-dentist"
              aria-current={currentPage === "find-a-dentist" ? "page" : undefined}
              onClick={(event) => handleLinkClick(event, "/find-a-dentist", navigate)}
            >
              Find a Dentist
            </a>
            <a
              className="header-provider-link"
              href="/provider-login"
              aria-current={currentPage === "provider-login" ? "page" : undefined}
              onClick={(event) => handleLinkClick(event, "/provider-login", navigate)}
            >
              For Providers
            </a>
            <button className="button primary compact header-cta" type="button" onClick={() => navigate("/get-care-now")}>
              Get Dental Coverage
            </button>
          </div>
        </div>
      </header>

      <button
        className={isMenuOpen ? "drawer-scrim is-open" : "drawer-scrim"}
        type="button"
        aria-label="Close navigation"
        tabIndex={-1}
        aria-hidden={!isMenuOpen}
        onClick={() => setIsMenuOpen(false)}
      />
      <aside
        ref={drawerRef}
        id="site-drawer"
        className={isMenuOpen ? "site-drawer tone-dark is-open" : "site-drawer tone-dark"}
        aria-hidden={!isMenuOpen}
        aria-label="Site navigation"
        inert={!isMenuOpen}
        onKeyDown={trapDrawerFocus}
      >
        <div className="drawer-header">
          <a className="brand" href="/" onClick={(event) => { event.preventDefault(); handleNav("/"); }}>
            <span>Denta</span>
            <span className="brand-worth">Worth</span>
          </a>
          <button ref={closeRef} className="drawer-close" type="button" onClick={() => setIsMenuOpen(false)} aria-label="Close navigation">
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="drawer-scroll">
          {footerColumns.map((column, columnIndex) => (
            <div className="drawer-group" key={column.heading} style={{ "--group": columnIndex } as CSSProperties}>
              <h3>{column.heading}</h3>
              <nav aria-label={column.heading}>
                {column.links.map((item) => (
                  <a
                    key={`${column.heading}-${item.href}-${item.label}`}
                    href={item.href}
                    aria-current={currentPage === pageFromHref(item.href) ? "page" : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      handleNav(item.href);
                    }}
                  >
                    <span>{item.label}</span>
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                ))}
              </nav>
            </div>
          ))}
          {authUser?.isAdmin && (
            <div className="drawer-group" style={{ "--group": footerColumns.length } as CSSProperties}>
              <h3>Admin</h3>
              <nav aria-label="Admin">
                <a
                  href="/admin"
                  aria-current={currentPage === "admin" ? "page" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    handleNav("/admin");
                  }}
                >
                  <span>Admin dashboard</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
              </nav>
            </div>
          )}
        </div>
        <div className="drawer-account">
          <p>{authUser ? authUser.email : "Account access"}</p>
          <div className="drawer-account__actions">
            <button className="button secondary compact" type="button" onClick={() => handleNav(authUser ? "/account" : "/sign-in")}>
              {authUser ? "Open account" : "Sign in"}
            </button>
            {authUser && (
              <button className="text-button" type="button" onClick={handleSignOut}>
                Sign out
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

function pageFromHref(href: string): Page {
  return href === "/" ? "home" : (href.slice(1) as Page);
}
