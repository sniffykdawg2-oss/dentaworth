import { treatmentOptions } from "../content";
import { handleLinkClick } from "../nav";

/**
 * A slow-moving band of every procedure the guide covers; each name opens its
 * search results. The list is rendered twice for a seamless loop; the second
 * copy is hidden from assistive tech and the tab order. Pauses on hover/focus,
 * and becomes a static wrapped list for reduced motion.
 */
export function ProcedureMarquee({ navigate }: { navigate: (href: string) => void }) {
  function hrefFor(treatment: string) {
    return `/search?${new URLSearchParams({ treatment }).toString()}`;
  }

  function renderList(isDuplicate: boolean) {
    return (
      <ul className="procedure-marquee__list" aria-hidden={isDuplicate || undefined}>
        {treatmentOptions.map((treatment) => (
          <li key={treatment}>
            <a
              href={hrefFor(treatment)}
              tabIndex={isDuplicate ? -1 : undefined}
              onClick={(event) => handleLinkClick(event, hrefFor(treatment), navigate)}
            >
              {treatment}
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <nav className="procedure-marquee" aria-label="Browse prices by procedure">
      <div className="procedure-marquee__track">
        {renderList(false)}
        {renderList(true)}
      </div>
    </nav>
  );
}
