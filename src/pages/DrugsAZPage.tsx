import { useMemo, useState } from "react";
import { drugDirectory, drugDirectoryDisclaimer } from "../drugs";
import { PageShell } from "../components/PageShell";
import { BackButton } from "../components/BackButton";

const letters = Array.from(new Set(drugDirectory.map((drug) => drug.name[0].toUpperCase()))).sort();

export function DrugsAZPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return drugDirectory;
    return drugDirectory.filter(
      (drug) => drug.name.toLowerCase().includes(normalized) || drug.category.toLowerCase().includes(normalized),
    );
  }, [query]);

  return (
    <PageShell
      eyebrow="Drugs A-Z"
      title="Common medications used in dental care."
      intro="Browse medication names patients commonly encounter around dental treatment. This is a general directory, not medical advice."
      variant="drugs"
    >
      <BackButton />
      <div className="drugs-toolbar">
        <label className="drugs-search">
          Search by name or category
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="e.g. Amoxicillin, antibiotic, anesthetic"
          />
        </label>
        <nav className="drugs-alpha-nav" aria-label="Jump to letter">
          {letters.map((letter) => (
            <a key={letter} href={`#drug-${letter}`}>
              {letter}
            </a>
          ))}
        </nav>
        <p className="drugs-disclaimer">{drugDirectoryDisclaimer}</p>
      </div>

      {filtered.length > 0 ? (
        <div className="drugs-grid">
          {filtered.map((drug, index) => {
            const letter = drug.name[0].toUpperCase();
            const isFirstOfLetter = index === 0 || filtered[index - 1].name[0].toUpperCase() !== letter;
            return (
              <article key={drug.name} id={isFirstOfLetter ? `drug-${letter}` : undefined} className="drug-card">
                <p className="eyebrow">{drug.category}</p>
                <h3>{drug.name}</h3>
                <p>{drug.note}</p>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No matches</h3>
          <p>Try a different name or category.</p>
        </div>
      )}
    </PageShell>
  );
}
