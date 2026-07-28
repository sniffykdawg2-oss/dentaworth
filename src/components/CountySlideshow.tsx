import { useEffect, useState } from "react";

export type CountySlide = {
  name: string;
  src: string;
  alt: string;
};

export function CountySlideshow({ slides }: { slides: CountySlide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 7000);
    return () => clearInterval(id);
  }, [slides.length]);

  const active = slides[index];

  return (
    <div className="county-slideshow">
      <div className="county-slideshow-frame">
        {slides.map((slide, slideIndex) => (
          <img
            key={slide.name}
            src={slide.src}
            alt={slide.alt}
            className={slideIndex === index ? "is-active" : ""}
            loading={slideIndex === 0 ? "eager" : "lazy"}
          />
        ))}
      </div>
      <div className="county-slideshow-caption">
        <span className="county-slideshow-eyebrow">Florida county</span>
        <p>{active.name}</p>
      </div>
      <div className="county-slideshow-dots">
        {slides.map((slide, slideIndex) => (
          <span key={slide.name} className={slideIndex === index ? "is-active" : ""} />
        ))}
      </div>
    </div>
  );
}
