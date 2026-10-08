import { disclaimerText } from "../content";

export function Disclaimer() {
  return (
    <section className="bottom-disclaimer tone-dark" aria-label="DentaWorth disclaimer">
      <div className="container bottom-disclaimer__inner">
        <span className="mono-label">Disclaimer</span>
        <p>{disclaimerText}</p>
      </div>
    </section>
  );
}
