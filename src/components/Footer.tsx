import { footerColumns, handleLinkClick } from "../nav";
import { Newsletter } from "./Newsletter";

export function Footer({ navigate }: { navigate: (href: string) => void }) {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand-col">
          <a className="brand footer-brand" href="/" onClick={(event) => handleLinkClick(event, "/", navigate)}>
            <span>Denta</span>
            <span className="brand-worth">Worth</span>
          </a>
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
    </footer>
  );
}
