import { CSSProperties, useEffect, useRef, useState } from "react";
import { ArrowRight, BarChart3, ClipboardCheck, FileText, RotateCcw, RotateCw, Search, Users } from "lucide-react";
import { counties, countySlides, heroSlogans, treatmentOptions } from "../content";
import { useWordCycle } from "../hooks/textEffects";
import { Typeahead } from "../components/Typeahead";
import { CountySlideshow } from "../components/CountySlideshow";
import { SmileStory } from "../components/SmileStory";
import { ProcedureMarquee } from "../components/ProcedureMarquee";
import { CountUp } from "../motion/CountUp";
import { useFocusBand } from "../motion/useFocusBand";
import { MaskHeading } from "../motion/MaskHeading";
import { prefersReducedMotion } from "../motion/motion";
import { clamp01, useScrollProgress } from "../motion/useScrollProgress";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

const journeySteps = [
  { icon: Search, number: "01", title: "Search", text: "Start with a treatment and your Florida county." },
  { icon: BarChart3, number: "02", title: "Compare", text: "See local cash price ranges, grouped by type of care." },
  { icon: ClipboardCheck, number: "03", title: "Find your fit", text: "Take useful context into the conversation with a dental office." },
];

// Card backs reuse guidance already published on Get Covered Now and the blog.
const quoteQuestions = [
  {
    number: "01",
    label: "Scope",
    question: "Is this the full treatment price?",
    answer:
      "Ask whether it is a consultation estimate, a full treatment estimate, or a starting price, and whether complexity could change the final number.",
  },
  {
    number: "02",
    label: "Materials",
    question: "Which materials are included?",
    answer: "A different material can change the final price. Ask which material the estimate assumes and whether lab fees are included.",
  },
  {
    number: "03",
    label: "Imaging",
    question: "Are scans and follow-ups included?",
    answer: "Exams, X-rays, and follow-up visits can sit outside the first number. Ask for a written estimate that lists them.",
  },
  {
    number: "04",
    label: "Payment",
    question: "Does this price require cash payment?",
    answer: "Ask what changes if you pay cash, finance treatment, use a membership plan, or split care across visits.",
  },
];

const processSteps = [
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
];

export function HomePage({ navigate }: { navigate: (href: string) => void }) {
  const railRef = useRef<HTMLDivElement>(null);
  const processListRef = useRef<HTMLOListElement>(null);

  // The journey line fills as the rail scrolls through view, lighting each step as it arrives.
  useScrollProgress(railRef, {
    mode: "view",
    start: 0.92,
    end: 0.6,
    onProgress: (progress, element) => {
      element.querySelectorAll(".journey-step").forEach((step, index) => {
        step.toggleAttribute("data-lit", progress >= [0.02, 0.36, 0.7][index]);
      });
      return { "--rail": progress };
    },
  });

  // Bring the "clearer path" row being read forward; soften the others.
  useFocusBand(processListRef, ".process-step");

  return (
    <>
      <HomeHero navigate={navigate} />
      <ProcedureMarquee navigate={navigate} />

      <section className="section home-journey" aria-labelledby="home-services-heading">
        <div className="container">
          <div className="split-head">
            <div>
              <MaskHeading id="home-services-heading">Compare common dental procedures.</MaskHeading>
            </div>
            <div className="split-head__aside" data-reveal="up" style={delay(200)}>
              <p>
                From routine cleanings to major treatment, DentaWorth breaks procedures into three
                groups so you always know roughly where a quote should land before you book.
              </p>
              <p className="journey-lede">A simple way to move from “what does this cost?” to “what should I ask next?”</p>
              <button className="button secondary procedures-cta" type="button" onClick={() => navigate("/get-care-now")}>
                How to use the guide
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="journey-rail" ref={railRef} aria-label="How to use the DentaWorth guide">
            <span className="journey-rail__line" aria-hidden="true">
              <span className="journey-rail__fill" />
            </span>
            <ol data-reveal="stagger">
              {journeySteps.map(({ icon: JourneyIcon, number, title, text }) => (
                <li className="journey-step" key={number}>
                  <div className="journey-step-top">
                    <span>{number}</span>
                    <span className="icon-tile">
                      <JourneyIcon size={22} aria-hidden="true" />
                    </span>
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section home-questions tone-dark" aria-labelledby="quote-anatomy-heading">
        <div className="container home-questions__grid">
          <div className="home-questions__intro">
            <MaskHeading id="quote-anatomy-heading">Questions worth asking.</MaskHeading>
            <p className="quote-supporting-copy" data-reveal="up" style={delay(240)}>
              A clearer quote starts with knowing what to ask before treatment begins.
            </p>
            <div data-reveal="up" style={delay(340)}>
              <button className="button secondary quote-faq-button" type="button" onClick={() => navigate("/help-center")}>
                See what to ask
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="quote-board" data-reveal="stagger">
            {quoteQuestions.map((card) => (
              <QuoteFlipCard key={card.label} {...card} />
            ))}
          </div>
        </div>
      </section>

      <section className="section home-county" aria-labelledby="browse-heading">
        <div className="container home-county__grid">
          <div className="browse-copy">
            <MaskHeading id="browse-heading">Find price context by county.</MaskHeading>
            <p className="lead" data-reveal="up" style={delay(200)}>
              Dental cash prices can vary by local market. Here is a look at a few of the Florida
              counties DentaWorth tracks pricing for.
            </p>
            <dl className="browse-stats" data-reveal="stagger" style={delay(300)}>
              <div>
                <dt>Florida counties tracked</dt>
                <dd>
                  <CountUp value={counties.length} />
                </dd>
              </div>
              <div>
                <dt>Procedures compared</dt>
                <dd>
                  <CountUp value={treatmentOptions.length} />
                </dd>
              </div>
              <div>
                <dt>Updated as reports come in</dt>
                <dd>Growing</dd>
              </div>
            </dl>
          </div>
          <div data-reveal="media" style={delay(120)}>
            <CountySlideshow slides={countySlides} />
          </div>
        </div>
      </section>

      <SmileStory navigate={navigate} />

      <section className="section home-how tone-dark" aria-labelledby="how-heading">
        <div className="container">
          <div className="centered-head">
            <MaskHeading id="how-heading">A clearer path before you call around.</MaskHeading>
            <p data-reveal="up" style={delay(240)}>
              DentaWorth is built to help people understand dental pricing earlier in the care
              journey, without pretending estimates are final quotes.
            </p>
          </div>
          <ol className="process-list" ref={processListRef} data-reveal="stagger">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <li key={step.title} className="process-step">
                  <span className="process-step-number">Step {index + 1}</span>
                  <span className="icon-tile">
                    <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="section home-audience" aria-labelledby="audience-heading">
        <div className="container">
          <div className="centered-head">
            <MaskHeading id="audience-heading">Patients need context. Practices need visibility.</MaskHeading>
          </div>
          <div className="audience-panels" data-reveal="stagger">
            <article className="audience-panel audience-panel--patients tone-dark">
              <span className="icon-tile">
                <Users size={24} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h3>For patients</h3>
              <p>
                Compare procedure ranges, save operations in your account, and submit pricing you
                have received to improve the guide over time.
              </p>
              <div className="card-actions">
                <button className="button primary" type="button" onClick={() => navigate("/account")}>
                  Create account
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
                <button className="button secondary" type="button" onClick={() => navigate("/self-reporting")}>
                  Self-report prices
                </button>
              </div>
            </article>
            <article className="audience-panel audience-panel--practices">
              <span className="icon-tile">
                <FileText size={24} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h3>For dental practices</h3>
              <p>
                DentaWorth is preparing practice profiles and promotion options for offices that want
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
        </div>
      </section>
    </>
  );
}

/** Flashcard: the question on the front, what to ask on the back. */
function QuoteFlipCard({ number, label, question, answer }: (typeof quoteQuestions)[number]) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <button
      type="button"
      className={isFlipped ? "quote-card is-flipped" : "quote-card"}
      aria-pressed={isFlipped}
      onClick={() => setIsFlipped((flipped) => !flipped)}
    >
      <span className="quote-card__inner">
        <span className="quote-card__face quote-card__front" aria-hidden={isFlipped}>
          <span className="quote-card__label">
            <b>{number}</b> {label}
          </span>
          <span className="quote-card__question">{question}</span>
          <span className="quote-card__hint">
            <RotateCw size={15} aria-hidden="true" />
            See what to ask
          </span>
        </span>
        <span className="quote-card__face quote-card__back" aria-hidden={!isFlipped}>
          <span className="quote-card__label">
            <b>{number}</b> {label}
          </span>
          <span className="quote-card__answer">{answer}</span>
          <span className="quote-card__hint">
            <RotateCcw size={15} aria-hidden="true" />
            Back to question
          </span>
        </span>
      </span>
    </button>
  );
}

function HomeHero({ navigate }: { navigate: (href: string) => void }) {
  const [treatment, setTreatment] = useState("");
  const [county, setCounty] = useState("");
  const { item: heroSlogan, isExiting: isHeroSloganExiting } = useWordCycle(heroSlogans, 5500);
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldAutoplay] = useState(() => !prefersReducedMotion());

  // Depth on scroll: the video drifts down slower than the page (and the copy eases away),
  // so the hero reads as layered rather than flat.
  useScrollProgress(heroRef, {
    onProgress: (_progress, element) => ({
      "--hero-q": clamp01(-element.getBoundingClientRect().top / element.offsetHeight),
    }),
  });

  // Depth on pointer: the video and headline shift by different amounts as the
  // cursor moves (eased, desktop pointers only). The search card never moves.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;
    const heroElement = hero;
    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    function tick() {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      heroElement.style.setProperty("--mx", currentX.toFixed(4));
      heroElement.style.setProperty("--my", currentY.toFixed(4));
      const settled = Math.abs(targetX - currentX) < 0.001 && Math.abs(targetY - currentY) < 0.001;
      frame = settled ? 0 : window.requestAnimationFrame(tick);
    }

    function onPointerMove(event: PointerEvent) {
      const rect = heroElement.getBoundingClientRect();
      targetX = (event.clientX - rect.left) / rect.width - 0.5;
      targetY = (event.clientY - rect.top) / rect.height - 0.5;
      if (!frame) frame = window.requestAnimationFrame(tick);
    }

    function onPointerLeave() {
      targetX = 0;
      targetY = 0;
      if (!frame) frame = window.requestAnimationFrame(tick);
    }

    heroElement.addEventListener("pointermove", onPointerMove);
    heroElement.addEventListener("pointerleave", onPointerLeave);
    return () => {
      heroElement.removeEventListener("pointermove", onPointerMove);
      heroElement.removeEventListener("pointerleave", onPointerLeave);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  // Stop decoding the video while the hero is off screen.
  useEffect(() => {
    const video = videoRef.current;
    const hero = heroRef.current;
    if (!video || !hero || !shouldAutoplay) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => undefined);
      else video.pause();
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [shouldAutoplay]);

  function runSearch() {
    const params = new URLSearchParams();
    if (treatment) params.set("treatment", treatment);
    if (county) params.set("county", county);
    navigate(params.toString() ? `/search?${params.toString()}` : "/search");
  }

  return (
    <section ref={heroRef} className="home-hero tone-dark" data-hero aria-labelledby="home-hero-title">
      <div className="home-hero__stage">
        <div className="home-hero__media" aria-hidden="true">
          <video
            ref={videoRef}
            className="hero-video"
            autoPlay={shouldAutoplay}
            muted
            loop
            playsInline
            preload="auto"
            poster="/images/dentaworth-hero.webp"
          >
            <source src="/videos/dentaworth-hero.mp4" type="video/mp4" />
          </video>
          <div className="home-hero__shade" />
        </div>

        <div className="container home-hero__content">
          <div className="home-hero__copy">
            <div className={isHeroSloganExiting ? "hero-slogan-wrap is-exiting" : "hero-slogan-wrap"}>
              <MaskHeading key={heroSlogan.join(" ")} as="h1" id="home-hero-title" className="hero-slogan" delay={80}>
                {heroSlogan[0]}
                <br />
                {heroSlogan[1]}
              </MaskHeading>
            </div>
            <p className="hero-subtitle" data-reveal="up" style={delay(620)}>
              Search by treatment and location to compare Florida dental price ranges before you call
              around.
            </p>
          </div>

          <div className="hero-search-card tone-light" role="search" aria-label="Find dental pricing" data-reveal="up" style={delay(760)}>
            <div className="search-card-heading">
              <h2>Find the dental price range you need</h2>
            </div>
            <div className="guide-controls">
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
                <Search size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
        <span className="hero-scroll-cue" aria-hidden="true" />
      </div>
    </section>
  );
}
