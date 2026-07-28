import { FormEvent, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { counties, treatmentOptions } from "../content";
import { footerColumns, handleLinkClick, Page } from "../nav";
import { AuthUser, signOutCurrentUser } from "../backend/auth";

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
    navigate("/");
  }

  return (
    <>
      <header className="site-header">
        <button
          className="drawer-toggle"
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="site-drawer"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu size={26} aria-hidden="true" />
          <span className="sr-only">Open navigation</span>
        </button>
        <a className="brand" href="/" onClick={(event) => handleLinkClick(event, "/", navigate)}>
          <img src="/images/dentaworth-logo.svg" alt="DentaWorth" />
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
            <Search size={19} aria-hidden="true" />
          </button>
        </form>
        <div className="header-actions">
          <a
            className="header-provider-link"
            href="/provider-login"
            onClick={(event) => handleLinkClick(event, "/provider-login", navigate)}
          >
            For providers
          </a>
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
      </header>

      {isMenuOpen && (
        <button className="drawer-scrim" type="button" aria-label="Close navigation" onClick={() => setIsMenuOpen(false)} />
      )}
      <aside id="site-drawer" className={isMenuOpen ? "site-drawer is-open" : "site-drawer"} aria-hidden={!isMenuOpen}>
        <div className="drawer-header">
          <a className="brand" href="/" onClick={(event) => handleLinkClick(event, "/", navigate)}>
            <img src="/images/dentaworth-logo.svg" alt="DentaWorth" />
          </a>
          <button type="button" onClick={() => setIsMenuOpen(false)} aria-label="Close navigation">
            <X size={22} aria-hidden="true" />
          </button>
        </div>
        <div className="drawer-scroll">
          {footerColumns.map((column) => (
            <div className="drawer-group" key={column.heading}>
              <h3>{column.heading}</h3>
              <nav aria-label={column.heading}>
                {column.links.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    aria-current={currentPage === pageFromHref(item.href) ? "page" : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      handleNav(item.href);
                    }}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          ))}
          {authUser?.isAdmin && (
            <div className="drawer-group">
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
                  Admin dashboard
                </a>
              </nav>
            </div>
          )}
        </div>
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
    </>
  );
}

function pageFromHref(href: string): Page {
  return href === "/" ? "home" : (href.slice(1) as Page);
}
