import { useEffect, useState } from "react";
import { ArrowRight, BadgeCheck, Building2, MapPin, Sparkles } from "lucide-react";
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
      <section className="dentist-radar">
        <div>
          <p className="eyebrow">Directory status</p>
          <h2>Provider profiles are being built around useful context, not ad clutter.</h2>
          <p>
            The directory is designed to pair practice details with procedure coverage and local
            price context. Published profiles appear below as they are reviewed.
          </p>
        </div>
        <div className="radar-visual" aria-hidden="true">
          <span />
          <span />
          <span />
          <Building2 size={34} />
        </div>
      </section>
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
      <div className="dentist-comparison-strip">
        {[
          { icon: MapPin, title: "Location first", text: "Compare by Florida county so the directory matches the same geography as the price guide." },
          { icon: BadgeCheck, title: "Reviewed profiles", text: "Admin-published profiles keep draft or archived listings away from public search." },
          { icon: Sparkles, title: "Useful next steps", text: "Profiles can link out to a website or phone number without turning the page into a billboard." },
        ].map((item) => (
          <article key={item.title}>
            <item.icon size={22} aria-hidden="true" />
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
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
