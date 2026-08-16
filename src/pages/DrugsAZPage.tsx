import { useMemo, useState } from "react";
import { Search, ShieldCheck } from "lucide-react";
import { drugDirectory, drugDirectoryDisclaimer } from "../drugs";
import { PageShell } from "../components/PageShell";

export function DrugsAZPage() {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

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
    >
      <section className="drugs-lookup drugs-lookup-no-photo" aria-labelledby="drugs-lookup-heading">
        <div className="drugs-lookup-copy">
          <h2 id="drugs-lookup-heading">Start with a name, category, or word from your estimate.</h2>
          <p>
            The directory stays search-first on purpose, so the page does not dump a long medication
            list on people who are already trying to decode a treatment plan.
          </p>
          <label className="drugs-search">
            <span>Search medications</span>
            <div>
              <Search size={20} aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try Amoxicillin, anesthetic, rinse..."
              />
            </div>
          </label>
          <p className="drugs-disclaimer">{drugDirectoryDisclaimer}</p>
        </div>
      </section>

      <section className="drugs-results-panel" aria-live="polite">
        {!normalizedQuery ? (
          <div className="empty-state">
            <h3>Search to see matches</h3>
            <p>Results will appear here after you type a medication name or category.</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="drugs-grid">
            {filtered.map((drug) => (
              <article key={drug.name} className="drug-card">
                <img src={drug.imageUrl} alt={drug.imageAlt} loading="lazy" />
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
          <div className="empty-state">
            <h3>No matches</h3>
            <p>Try a different medication name or broader category.</p>
          </div>
        )}
      </section>

      <section className="drugs-explainer" aria-labelledby="drugs-explainer-heading">
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
