import { disclaimerText } from "../content";

export function Disclaimer() {
  return (
    <section className="bottom-disclaimer" aria-label="DentaWorth disclaimer">
      <p>{disclaimerText}</p>
    </section>
  );
}
