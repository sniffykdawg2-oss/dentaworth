import { useState } from "react";
import { X } from "lucide-react";

export function DevelopmentBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="dev-banner" role="status">
      <p>
        Dentaworth is currently under active development and expansion. Some data, pricing, and
        features are placeholders and the site is not yet ready for everyday use.
      </p>
      <button type="button" aria-label="Dismiss notice" onClick={() => setIsVisible(false)}>
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
