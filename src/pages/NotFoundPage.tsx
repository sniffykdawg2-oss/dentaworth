import { PageShell } from "../components/PageShell";

export function NotFoundPage({ navigate }: { navigate: (href: string) => void }) {
  return (
    <PageShell eyebrow="404" title="That page is not in the guide." intro="The page may have moved, or the link may be wrong.">
      <button className="button primary" type="button" onClick={() => navigate("/")}>
        Return to cost guide
      </button>
    </PageShell>
  );
}
