import { CSSProperties, ReactNode } from "react";
import { BackButton } from "./BackButton";

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
        className={`page-hero page-hero-${variant}${heroImage ? " page-hero-with-image" : ""}`}
        style={heroImage ? ({ "--hero-image": `url(${heroImage})` } as CSSProperties) : undefined}
      >
        <BackButton />
        <h1>{title}</h1>
        <p>{intro}</p>
      </section>
      <section className="section page-section">{children}</section>
    </>
  );
}
