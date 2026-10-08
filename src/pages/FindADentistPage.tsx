import { CSSProperties, useEffect, useState } from "react";
import { ArrowRight, BadgeCheck, Building2, ClipboardList, MapPin, PhoneCall, Sparkles } from "lucide-react";
import { subscribeToPublishedDentistProfiles } from "../backend/repository";
import { DentistProfileRecord } from "../backend/schema";
import { getProcedureLabel } from "../pageHelpers";
import { PageShell } from "../components/PageShell";
import { MaskHeading } from "../motion/MaskHeading";

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
      title="Find Quality Dental Care At A Cost That's Fair."
      intro="Compare dental offices with county-level price context before you call."
      variant="dentist"
      heroImage="/images/page-hero-smile-braces.png"
    >
      <section className="dentist-radar">
        <div>
          <MaskHeading>Provider profiles are being built around useful pricing context.</MaskHeading>
          <p data-reveal="up" style={{ "--delay": "240ms" } as CSSProperties}>
            The directory is designed to pair practice details with procedure coverage and local
            price context. Published profiles appear below as they are reviewed.
          </p>
        </div>
        <div className="radar-visual" aria-hidden="true" data-reveal="fade">
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
              <h2 id="dentist-directory-heading">
                Published dentist profiles <span className="count-badge">{publishedDentists.length} published</span>
              </h2>
            </div>
          </div>
          <div className="directory-grid" data-reveal="stagger">
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
      <div className="dentist-comparison-strip" data-reveal="stagger">
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
      <section className="dentist-shortlist" aria-labelledby="dentist-shortlist-heading">
        <div>
          <h2 id="dentist-shortlist-heading">Compare offices on the things that make the quote usable.</h2>
        </div>
        <div className="shortlist-grid" data-reveal="stagger">
          {[
            { icon: PhoneCall, title: "Call clarity", text: "Can the office explain what is included before you book?" },
            { icon: ClipboardList, title: "Written estimate", text: "Will they send a treatment estimate with codes, assumptions, and payment terms?" },
            { icon: BadgeCheck, title: "Profile status", text: "Published profiles should give contact context without replacing your own due diligence." },
          ].map((item) => (
            <article key={item.title}>
              <item.icon size={24} aria-hidden="true" />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
      {publishedDentists.length === 0 && (
        <section className="directory-empty-panel" aria-label="Directory launch note" data-reveal="up">
          <div>
            <h2>Published profiles will appear here after review.</h2>
          </div>
          <p>
            Until then, use the cost guide first, call multiple offices, and ask each office to
            confirm what is included in the estimate before comparing totals.
          </p>
        </section>
      )}
      <div className="callout-band tone-dark" data-reveal="up">
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
