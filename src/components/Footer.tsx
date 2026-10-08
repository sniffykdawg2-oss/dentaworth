import { ArrowUp } from "lucide-react";
import { footerColumns, handleLinkClick } from "../nav";
import { Newsletter } from "./Newsletter";

export function Footer({ navigate }: { navigate: (href: string) => void }) {
  return (
    <footer className="site-footer tone-dark">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand-col">
            <a className="brand footer-brand" href="/" onClick={(event) => handleLinkClick(event, "/", navigate)}>
              <span>Denta</span>
              <span className="brand-worth">Worth</span>
            </a>
            <span className="footer-legal-name">DentaWorth LLC</span>
            <p>Florida dental cash price range estimates by county.</p>
            <Newsletter />
          </div>
          {footerColumns.map((column) => (
            <div className="footer-nav-col" key={column.heading}>
              <h3>{column.heading}</h3>
              <nav aria-label={column.heading}>
                {column.links.map((item) => (
                  <a
                    key={`${column.heading}-${item.href}-${item.label}`}
                    href={item.href}
                    onClick={(event) => handleLinkClick(event, item.href, navigate)}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} DentaWorth LLC</span>
          <button className="footer-top-link" type="button" onClick={() => window.scrollTo({ top: 0 })}>
            Back to top
            <ArrowUp size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
