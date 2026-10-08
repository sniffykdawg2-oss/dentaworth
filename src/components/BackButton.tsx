import { ArrowLeft } from "lucide-react";

export function BackButton() {
  return (
    <button className="back-button" type="button" onClick={() => window.history.back()}>
      <ArrowLeft size={16} aria-hidden="true" />
      Back
    </button>
  );
}
