import { PageShell } from "../components/PageShell";

export function NotFoundPage({ navigate }: { navigate: (href: string) => void }) {
  return (
    <PageShell eyebrow="404" title="That page is not in the guide." intro="The page may have moved, or the link may be wrong.">
      <section className="not-found-panel">
        <div>
          <p className="eyebrow">Try a safer path</p>
          <h2>Most visitors are looking for one of these.</h2>
        </div>
        <div>
          <button className="button primary" type="button" onClick={() => navigate("/")}>
            Return to cost guide
          </button>
          <button className="button secondary" type="button" onClick={() => navigate("/find-a-dentist")}>
            Find a Dentist
          </button>
          <button className="button secondary" type="button" onClick={() => navigate("/help-center")}>
            Help Center
          </button>
        </div>
      </section>
    </PageShell>
  );
}
