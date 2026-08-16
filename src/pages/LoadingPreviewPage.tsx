import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { DentaWorthLoader } from "../components/DentaWorthLoader";
import { PageShell } from "../components/PageShell";

export function LoadingPreviewPage() {
  const [replayKey, setReplayKey] = useState(0);

  return (
    <PageShell
      eyebrow="Development preview"
      title="Loading animation preview."
      intro="Replay the DentaWorth brand loader without trying to catch a route transition at the exact right millisecond."
      variant="account"
    >
      <section className="loader-preview-stage">
        <DentaWorthLoader isPreview replayKey={replayKey} />
        <button className="button primary" type="button" onClick={() => setReplayKey((key) => key + 1)}>
          <RotateCcw size={18} aria-hidden="true" />
          Replay animation
        </button>
      </section>
    </PageShell>
  );
}
