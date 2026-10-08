import { CSSProperties, useEffect, useState } from "react";
import { prefersReducedMotion } from "../motion/motion";
import { toWebp } from "../media";
import { MaskHeading } from "../motion/MaskHeading";

export type CountySlide = {
  name: string;
  src: string;
  alt: string;
};

const SLIDE_MS = 7000;

export function CountySlideshow({ slides }: { slides: CountySlide[] }) {
  const [index, setIndex] = useState(0);
  const [isAutoplay] = useState(() => !prefersReducedMotion());

  useEffect(() => {
    if (slides.length < 2 || !isAutoplay) return;

    const id = window.setTimeout(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, SLIDE_MS);
    return () => window.clearTimeout(id);
  }, [index, isAutoplay, slides.length]);

  const active = slides[index];

  return (
    <div className="county-slideshow" style={{ "--slide-ms": `${SLIDE_MS}ms` } as CSSProperties}>
      <div className="county-slideshow-frame">
        {slides.map((slide, slideIndex) => (
          <img
            key={slide.name}
            src={toWebp(slide.src)}
            alt={slide.alt}
            className={slideIndex === index ? "is-active" : ""}
            aria-hidden={slideIndex === index ? undefined : true}
            loading={slideIndex === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        ))}
        <div className="county-slideshow-caption">
          <MaskHeading as="p" key={active.name}>
            {active.name}
          </MaskHeading>
        </div>
      </div>
      <div className="county-slideshow-dots" role="group" aria-label="Choose a county photo">
        {slides.map((slide, slideIndex) => (
          <button
            key={slide.name}
            type="button"
            className={slideIndex === index ? "is-active" : ""}
            aria-label={`Show ${slide.name}`}
            aria-current={slideIndex === index ? "true" : undefined}
            onClick={() => setIndex(slideIndex)}
          >
            {slideIndex === index && isAutoplay && <span className="county-slideshow-progress" key={index} />}
          </button>
        ))}
      </div>
    </div>
  );
}
