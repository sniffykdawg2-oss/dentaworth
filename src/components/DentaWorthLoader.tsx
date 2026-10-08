/**
 * Brand intro: the wordmark is uncovered by the same accent-block sweep the
 * site uses for headlines, a rule draws beneath "Worth", then the navy
 * curtain lifts to reveal the page. App.tsx unmounts it after 1.7s.
 */
export function DentaWorthLoader({
  isPreview = false,
  replayKey = 0,
}: {
  isPreview?: boolean;
  replayKey?: number;
}) {
  return (
    <div className={isPreview ? "dw-loader-shell is-preview" : "dw-loader-shell"} aria-label="DentaWorth loading">
      <div className="dw-loader" key={replayKey}>
        <div className="dw-loader-mark" aria-hidden="true">
          <span className="dw-loader-denta">Denta</span>
          <span className="dw-loader-worth-wrap">
            <span className="dw-loader-worth">Worth</span>
            <span className="dw-loader-line" aria-hidden="true" />
          </span>
          <span className="dw-loader-block" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
