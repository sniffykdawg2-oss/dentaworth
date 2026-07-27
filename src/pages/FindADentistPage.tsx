import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { subscribeToPublishedDentistProfiles } from "../backend/repository";
import { DentistProfileRecord } from "../backend/schema";
import { getProcedureLabel } from "../pageHelpers";
import { PageShell } from "../components/PageShell";
import { BackButton } from "../components/BackButton";

export function FindADentistPage({ navigate }: { navigate: (href: string) => void }) {
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
                  {profile.phone && <a className="button secondary" href={`tel:${profile.phone}`}>Call</a>}
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
