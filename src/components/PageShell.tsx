import { CSSProperties, ReactNode } from "react";
import { BackButton } from "./BackButton";
import { MaskHeading } from "../motion/MaskHeading";
import { toWebp } from "../media";

export type PageHeroVariant =
  | "default"
  | "care"
  | "dentist"
  | "business"
  | "legal"
  | "auth"
  | "account"
  | "provider"
  | "help"
  | "drugs"
  | "editorial";

/**
 * Interior page frame: a navy hero (title, intro, optional framed photo that
 * overlaps into the page) followed by the page body on paper. `eyebrow` is
 * still accepted for each route's label but is intentionally not rendered in
 * the hero (removed in an earlier launch review).
 */
export function PageShell({
  title,
  intro,
  children,
  variant = "default",
  heroImage,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
  variant?: PageHeroVariant;
  heroImage?: string;
}) {
  return (
    <>
      <section
        className={`page-hero tone-dark page-hero-${variant}${heroImage ? " page-hero-with-image" : ""}`}
        data-hero
      >
        <div className="container page-hero__inner">
          <div className="page-hero__copy">
            <div data-reveal="fade">
              <BackButton />
            </div>
            <MaskHeading as="h1" className="page-hero__title" delay={120}>
              {title}
            </MaskHeading>
            <p className="page-hero__intro" data-reveal="up" style={{ "--delay": "520ms" } as CSSProperties}>
              {intro}
            </p>
          </div>
          {heroImage && (
            <figure className="page-hero__media" data-reveal="media" data-parallax style={{ "--delay": "200ms" } as CSSProperties}>
              <img src={toWebp(heroImage)} alt="" decoding="async" fetchPriority="high" />
            </figure>
          )}
        </div>
      </section>
      <div className={`page-body page-body-${variant}${heroImage ? " has-hero-media" : ""}`}>
        <div className="container page-body__inner">{children}</div>
      </div>
    </>
  );
}
