import { useState } from "react";
import { ArrowRight, BarChart3, ClipboardCheck, FileText, Search, Users } from "lucide-react";
import { counties, heroSlogans, smileCycleWords, treatmentOptions } from "../content";
import { useWordCycle } from "../hooks/textEffects";
import { useReveal } from "../hooks/useReveal";
import { Typeahead } from "../components/Typeahead";
import { FloridaMap } from "../components/FloridaMap";
import { DotRing, FlowLine } from "../components/BackgroundArt";

function revealClass(isVisible: boolean, extra = "") {
  return `${extra} reveal${isVisible ? " is-visible" : ""}`.trim();
}

export function HomePage({ navigate }: { navigate: (href: string) => void }) {
  const [treatment, setTreatment] = useState("");
  const [county, setCounty] = useState("");
  const { item: heroSlogan, isExiting: isHeroSloganExiting } = useWordCycle(heroSlogans, 5000);
  const { index: cycleWordIndex, isExiting: isCycleWordExiting } = useWordCycle(smileCycleWords);
  const proceduresReveal = useReveal<HTMLElement>();
  const browseReveal = useReveal<HTMLElement>();
  const howReveal = useReveal<HTMLElement>();
  const stepsReveal = useReveal<HTMLDivElement>();
  const smileReveal = useReveal<HTMLElement>();
  const audienceReveal = useReveal<HTMLElement>();
  const panelReveal = useReveal<HTMLDivElement>();

  function runSearch() {
    const params = new URLSearchParams();
    if (treatment) params.set("treatment", treatment);
    if (county) params.set("county", county);
    navigate(params.toString() ? `/search?${params.toString()}` : "/search");
  }

  function searchCounty(selectedCounty: string) {
    navigate(`/search?county=${encodeURIComponent(selectedCounty)}`);
  }

  return (
    <>
      <section className="hero guide-hero">
        <div className="hero-copy">
          <div className="hero-slogan-wrap">
            <h1 className={isHeroSloganExiting ? "hero-slogan is-exiting" : "hero-slogan"}>
              {heroSlogan[0]}{" "}
              <br />
              {heroSlogan[1]}
            </h1>
          </div>
          <p className="hero-subtitle">
            Search by treatment and location to compare Florida dental price ranges before you call
            around.
          </p>
        </div>
        <div className="hero-search-card" aria-label="Find dental pricing">
          <div className="search-card-heading">
            <h2>Find the dental price range you need</h2>
          </div>
          <div className="guide-controls" aria-label="Filter cost guide">
            <Typeahead
              id="hero-treatment"
              label="Treatment"
              placeholder="Start typing a procedure..."
              options={treatmentOptions}
              value={treatment}
              onChange={setTreatment}
            />
            <Typeahead
              id="hero-county"
              label="County"
              placeholder="Start typing a Florida county..."
              options={counties}
              value={county}
              onChange={setCounty}
            />
            <button className="button primary guide-search-button" type="button" onClick={runSearch}>
              Search
              <Search size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <section
        ref={proceduresReveal.ref}
        className={revealClass(proceduresReveal.isVisible, "section home-services")}
        aria-labelledby="home-services-heading"
      >
        <DotRing className="dot-ring-decoration" />
        <FlowLine className="flow-line-decoration home-services-flow" />
        <div className="section-heading">
          <p className="eyebrow">Start your search</p>
          <h2 id="home-services-heading">Compare common dental procedures.</h2>
        </div>
        <div className="split-media-block">
          <div className="split-media-copy">
            <p>
              From routine cleanings to major treatment, Dentaworth breaks procedures into three
              groups so you always know roughly where a quote should land before you book.
            </p>
            <ul className="plain-link-list">
              <li>
                <span>Routine care</span>
                <div>
                  {["Cleaning", "Exam", "X-ray"].map((item) => (
                    <a key={item} href="#" onClick={(event) => { event.preventDefault(); navigate(`/search?treatment=${encodeURIComponent(item)}`); }}>
                      {item}
                    </a>
                  ))}
                </div>
              </li>
              <li>
                <span>Restorative work</span>
                <div>
                  {["Filling", "Crown, ceramic", "Root canal"].map((item) => (
                    <a key={item} href="#" onClick={(event) => { event.preventDefault(); navigate(`/search?treatment=${encodeURIComponent(item)}`); }}>
                      {item}
                    </a>
                  ))}
                </div>
              </li>
              <li>
                <span>Major treatment</span>
                <div>
                  {["Extraction", "Implant", "Invisalign"].map((item) => (
                    <a key={item} href="#" onClick={(event) => { event.preventDefault(); navigate(`/search?treatment=${encodeURIComponent(item)}`); }}>
                      {item}
                    </a>
                  ))}
                </div>
              </li>
            </ul>
            <button className="button secondary dark procedures-cta" type="button" onClick={() => navigate("/get-care-now")}>
              How to use the guide
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
          <figure className="split-media-figure">
            <img
              src="/images/procedures-overview.jpg"
              alt="Dentist reviewing a treatment plan with a patient"
              loading="lazy"
            />
          </figure>
        </div>
      </section>

      <section
        ref={browseReveal.ref}
        className={revealClass(browseReveal.isVisible, "section browse-section")}
        aria-labelledby="browse-heading"
      >
        <DotRing className="dot-ring-decoration" />
        <div className="browse-copy">
          <p className="eyebrow">Browse Florida</p>
          <h2 id="browse-heading">Find price context by county.</h2>
          <p>
            Dental cash prices can vary by local market. Select a county on the map to see pricing
            context for that area.
          </p>
          <div className="browse-stats">
            <div>
              <strong>{counties.length}</strong>
              <span>Florida counties tracked</span>
            </div>
            <div>
              <strong>{treatmentOptions.length}</strong>
              <span>Procedures compared</span>
            </div>
            <div>
              <strong>Growing</strong>
              <span>Updated as reports come in</span>
            </div>
          </div>
        </div>
        <div className="florida-map-frame">
          <FloridaMap counties={counties} onSelectCounty={searchCounty} />
        </div>
      </section>

      <section
        ref={howReveal.ref}
        className={revealClass(howReveal.isVisible, "section how-section")}
        aria-labelledby="how-heading"
      >
        <DotRing className="dot-ring-decoration" />
        <div className="section-heading centered-heading">
          <p className="eyebrow">How Dentaworth works</p>
          <h2 id="how-heading">A clearer path before you call around.</h2>
          <p>
            Dentaworth is built to help people understand dental pricing earlier in the care
            journey, without pretending estimates are final quotes.
          </p>
        </div>
        <div
          ref={stepsReveal.ref}
          className={`process-strip reveal-stagger${stepsReveal.isVisible ? " is-visible" : ""}`}
        >
          {[
            {
              icon: Search,
              title: "Search by treatment",
              text: "Choose the procedure you are researching and narrow results by Florida county.",
            },
            {
              icon: BarChart3,
              title: "Compare local ranges",
              text: "Use county-level cash price ranges to frame questions for dental offices.",
            },
            {
              icon: ClipboardCheck,
              title: "Ask better questions",
              text: "Confirm what is included, whether complications change pricing, and what payment options exist.",
            },
          ].map((step, index) => {
            const Icon = step.icon;
            return (
              <article key={step.title} className="process-step">
                <span className="process-step-number">STEP {index + 1}</span>
                <Icon size={26} strokeWidth={1.75} aria-hidden="true" />
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section
        ref={smileReveal.ref}
        className={revealClass(smileReveal.isVisible, "section smile-section")}
        aria-labelledby="smile-heading"
      >
        <DotRing className="dot-ring-decoration" />
        <div className="smile-copy">
          <h2 id="smile-heading">
            Smiles are what we see first.
            <br />
            <span className="cycle-word-wrap">
              {smileCycleWords.map((word, index) => (
                <span
                  key={word}
                  className={
                    index !== cycleWordIndex ? "cycle-word is-hidden" : isCycleWordExiting ? "cycle-word is-exiting" : "cycle-word"
                  }
                >
                  {word}
                </span>
              ))}
            </span>{" "}
            yours.
          </h2>
        </div>
        <figure className="smile-figure">
          <img src="/images/mother-daughter-smile.jpg" alt="A mother smiling with her daughter" loading="lazy" />
          <figcaption>
            <span>Read our blog</span>
            <button className="button primary compact" type="button" onClick={() => navigate("/blog")}>
              Visit the blog
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </figcaption>
        </figure>
      </section>

      <section
        ref={audienceReveal.ref}
        className={revealClass(audienceReveal.isVisible, "section audience-section")}
        aria-labelledby="audience-heading"
      >
        <FlowLine className="flow-line-decoration" />
        <DotRing className="dot-ring-decoration dot-ring-secondary" />
        <div className="section-heading centered-heading">
          <p className="eyebrow">Built for both sides</p>
          <h2 id="audience-heading">Patients need context. Practices need visibility.</h2>
        </div>
        <div
          ref={panelReveal.ref}
          className={`split-panel reveal-stagger${panelReveal.isVisible ? " is-visible" : ""}`}
        >
          <article>
            <Users size={30} strokeWidth={1.75} aria-hidden="true" />
            <h3>For patients</h3>
            <p>
              Compare procedure ranges, save operations in your account, and submit pricing you
              have received to improve the guide over time.
            </p>
            <div className="card-actions">
              <button className="button primary" type="button" onClick={() => navigate("/account")}>
                Open account
                <ArrowRight size={18} aria-hidden="true" />
              </button>
              <button className="button secondary" type="button" onClick={() => navigate("/self-reporting")}>
                Self-report prices
              </button>
            </div>
          </article>
          <article>
            <FileText size={30} strokeWidth={1.75} aria-hidden="true" />
            <h3>For dental practices</h3>
            <p>
              Dentaworth is preparing practice profiles and promotion options for offices that want
              to reach people researching treatment costs.
            </p>
            <div className="card-actions">
              <button className="button primary" type="button" onClick={() => navigate("/promote-your-practice")}>
                Promote your practice
                <ArrowRight size={18} aria-hidden="true" />
              </button>
              <button className="button secondary" type="button" onClick={() => navigate("/advertise-with-us")}>
                Advertise
              </button>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
