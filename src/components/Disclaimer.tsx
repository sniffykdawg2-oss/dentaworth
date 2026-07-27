import { disclaimerText } from "../content";

export function Disclaimer() {
  return (
    <section className="bottom-disclaimer" aria-label="Dentaworth disclaimer">
      <p>{disclaimerText}</p>
    </section>
  );
}
