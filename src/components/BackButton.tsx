import { ArrowRight } from "lucide-react";

export function BackButton() {
  return (
    <button className="back-button" type="button" onClick={() => window.history.back()}>
      <ArrowRight size={17} aria-hidden="true" />
      Back
    </button>
  );
}
