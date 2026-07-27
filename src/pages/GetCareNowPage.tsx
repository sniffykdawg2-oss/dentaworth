import { ArrowRight } from "lucide-react";
import { PageShell } from "../components/PageShell";
import { BackButton } from "../components/BackButton";

export function GetCareNowPage({ navigate }: { navigate: (href: string) => void }) {
  return (
    <PageShell
      eyebrow="Get care now"
      title="Use the guide before you book dental care."
      intro="Dentaworth helps you understand common cash price ranges before you contact a dental office."
      variant="care"
    >
      <BackButton />
      <div className="content-grid">
        <article>
          <h2>Start with the price range</h2>
          <p>
            Compare treatment ranges by county, then use that context when asking offices about
            estimates, payment options, and what is included in a quoted price.
          </p>
        </article>
        <article>
          <h2>Ask about complications</h2>
          <p>
            Treatment complexity can change the final cost. Ask whether the estimate assumes a
            routine case or includes potential complications.
          </p>
        </article>
      </div>
      <div className="callout-band">
        <div>
          <h2>Ready to compare?</h2>
          <p>Go back to the cost guide and search by treatment and location.</p>
        </div>
        <button className="button primary" type="button" onClick={() => navigate("/")}>
          Open cost guide
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </PageShell>
  );
}
