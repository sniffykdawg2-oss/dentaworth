import { ReactNode } from "react";

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
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
  variant?: PageHeroVariant;
}) {
  return (
    <>
      <section className={`page-hero page-hero-${variant}`}>
        <h1>{title}</h1>
        <p>{intro}</p>
      </section>
      <section className="section page-section">{children}</section>
    </>
  );
}
