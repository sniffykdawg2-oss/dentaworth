import { ChangeEvent, useMemo, useRef, useState } from "react";
import { Search, ShieldCheck } from "lucide-react";
import { drugDirectory, drugDirectoryDisclaimer } from "../drugs";
import { PageShell } from "../components/PageShell";
import { MaskHeading } from "../motion/MaskHeading";
import { prefersReducedMotion } from "../motion/motion";

export function DrugsAZPage() {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const searchRef = useRef<HTMLLabelElement>(null);
  const resultsRef = useRef<HTMLElement>(null);

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    const nextQuery = event.target.value;
    // On the first keystroke, bring the results into view if they would land below the fold.
    if (!query.trim() && nextQuery.trim()) {
      const resultsTop = resultsRef.current?.getBoundingClientRect().top ?? 0;
      if (resultsTop > window.innerHeight * 0.7) {
        searchRef.current?.scrollIntoView({ block: "start", behavior: prefersReducedMotion() ? "auto" : "smooth" });
      }
    }
    setQuery(nextQuery);
  }

  const filtered = useMemo(() => {
    if (!normalizedQuery) return [];
    return drugDirectory.filter(
      (drug) => drug.name.toLowerCase().includes(normalizedQuery) || drug.category.toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery]);

  return (
    <PageShell
      eyebrow="Drugs A-Z"
      title="Look up dental medication terms."
      intro="Search medication names patients commonly hear around dental care. This is general information only, not medical advice."
      variant="drugs"
      heroImage="/images/page-hero-dental-office.png"
    >
      <section className="drugs-lookup drugs-lookup-no-photo" aria-labelledby="drugs-lookup-heading">
        <div className="drugs-lookup-copy">
          <MaskHeading id="drugs-lookup-heading">Start with a name, category, or word from your estimate.</MaskHeading>
          <p>
            The directory stays search-first on purpose, so the page does not dump a long medication
            list on people who are already trying to decode a treatment plan.
          </p>
          <label className="drugs-search" data-reveal="up" ref={searchRef}>
            <span>Search medications</span>
            <div>
              <Search size={20} aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={handleQueryChange}
                placeholder="Try Amoxicillin, anesthetic, rinse..."
              />
            </div>
          </label>
          <p className="drugs-disclaimer">{drugDirectoryDisclaimer}</p>
        </div>
      </section>

      <section className="drugs-results-panel" aria-live="polite" ref={resultsRef}>
        {!normalizedQuery ? (
          <div className="empty-state" key="prompt">
            <h3>Search to see matches</h3>
            <p>Results will appear here after you type a medication name or category.</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="drugs-grid" key="results">
            {filtered.map((drug) => (
              <article key={drug.name} className="drug-card">
                <img src={drug.imageUrl} alt={drug.imageAlt} loading="lazy" decoding="async" />
                <div className="drug-card-body">
                  <p className="drug-category">{drug.category}</p>
                  <h3>{drug.name}</h3>
                  <p>{drug.note}</p>
                  <dl>
                    <div>
                      <dt>Where people usually get it</dt>
                      <dd>{drug.whereToGet}</dd>
                    </div>
                    <div>
                      <dt>What to ask</dt>
                      <dd>{drug.askAbout}</dd>
                    </div>
                  </dl>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state" key="no-matches">
            <h3>No matches</h3>
            <p>Try a different medication name or broader category.</p>
          </div>
        )}
      </section>

      <section className="drugs-explainer" aria-labelledby="drugs-explainer-heading" data-reveal="up">
        <ShieldCheck size={30} aria-hidden="true" />
        <div>
          <h2 id="drugs-explainer-heading">Use this as vocabulary help before you ask a clinician.</h2>
          <p>
            DentaWorth can help you recognize common terms, but your dentist, physician, or
            pharmacist should always be the source for allergies, dosage, interactions, and whether a
            medication is right for you.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
