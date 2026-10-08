import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { smileCycleWords } from "../content";
import { useWordCycle } from "../hooks/textEffects";
import { easeInOutCubic, easeOutCubic, segment, useScrollProgress } from "../motion/useScrollProgress";

/**
 * Homepage storytelling moment. On wide screens with motion enabled the
 * section pins for one viewport of scroll: the photo opens from a small
 * window between the two headline lines into a full panel, the lines part
 * to make room, and the blog invitation settles in at the end.
 * On phones, or with reduced motion, it renders as a plain heading + photo.
 */
export function SmileStory({ navigate }: { navigate: (href: string) => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { index: cycleWordIndex, isExiting: isCycleWordExiting } = useWordCycle(smileCycleWords);

  useScrollProgress(sectionRef, {
    mode: "pin",
    onProgress: (progress, element) => {
      const expand = easeInOutCubic(segment(progress, 0.05, 0.66));
      const caption = easeOutCubic(segment(progress, 0.68, 0.9));
      element.toggleAttribute("data-caption-ready", caption > 0.35);
      return { "--e": expand, "--c": caption };
    },
  });

  return (
    <section ref={sectionRef} className="home-smile" aria-labelledby="smile-heading">
      <div className="home-smile__stage">
        <h2 id="smile-heading" className="home-smile__heading">
          <span className="home-smile__line home-smile__line--a">Smiles are what we see first.</span>{" "}
          <span className="home-smile__line home-smile__line--b">
            <span className="cycle-word-wrap">
              {smileCycleWords.map((word, index) => (
                <span
                  key={word}
                  aria-hidden={index !== cycleWordIndex ? true : undefined}
                  className={
                    index !== cycleWordIndex ? "cycle-word is-hidden" : isCycleWordExiting ? "cycle-word is-exiting" : "cycle-word"
                  }
                >
                  {word}
                </span>
              ))}
            </span>{" "}
            yours.
          </span>
        </h2>
        <figure className="home-smile__window">
          <img src="/images/mother-daughter-smile.webp" alt="A mother smiling with her daughter" loading="lazy" decoding="async" />
          <figcaption className="home-smile__caption tone-dark">
            <span>Read our blog</span>
            <button className="button primary compact" type="button" onClick={() => navigate("/blog")}>
              Visit the blog
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
