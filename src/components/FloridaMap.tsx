import { floridaOtherCountyPaths, floridaTrackedCountyPaths } from "./floridaCountyPaths";

/** Pin coordinates are real county centroids (derived from US Census county
 * geography data), projected into the same viewBox as the county outlines
 * below — so pins land in the right place on the actual map. The view is
 * cropped to the region around the currently-tracked counties. */
const countyPins: Record<string, { x: number; y: number }> = {
  Calhoun: { x: 131.5, y: 100.3 },
  "Bay County": { x: 111.9, y: 107.6 },
  Baker: { x: 264.3, y: 104.1 },
  Bradford: { x: 269.8, y: 123.8 },
  Alachua: { x: 260.8, y: 138.0 },
  Brevard: { x: 335.3, y: 209.5 },
  Broward: { x: 346.4, y: 320.0 },
};

const labelOffsets: Record<string, { dx: number; dy: number; anchor?: "start" | "middle" | "end" }> = {
  Calhoun: { dx: -10, dy: -6, anchor: "end" },
  "Bay County": { dx: -10, dy: 20, anchor: "end" },
  Baker: { dx: 12, dy: -4, anchor: "start" },
  Bradford: { dx: 12, dy: 12, anchor: "start" },
  Alachua: { dx: -12, dy: 20, anchor: "end" },
  Brevard: { dx: 14, dy: 4, anchor: "start" },
  Broward: { dx: 14, dy: 4, anchor: "start" },
};

const pinPath = "M0 0C0 0 -9 -14.5 -9 -21A9 9 0 1 1 9 -21C9 -14.5 0 0 0 0Z";

export function FloridaMap({
  counties,
  activeCounty,
  onSelectCounty,
}: {
  counties: string[];
  activeCounty?: string;
  onSelectCounty: (county: string) => void;
}) {
  return (
    <svg className="florida-map" viewBox="0 0 460 420" role="img" aria-label="Map of tracked Florida counties">
      <defs>
        <radialGradient id="florida-water" cx="30%" cy="20%" r="90%">
          <stop offset="0%" stopColor="#eef7fd" />
          <stop offset="100%" stopColor="#cfe7f5" />
        </radialGradient>
        <filter id="florida-land-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#0b2c63" floodOpacity="0.18" />
        </filter>
      </defs>
      <rect className="florida-water" x="0" y="0" width="460" height="420" />
      <g filter="url(#florida-land-shadow)">
        <path className="florida-county-lines florida-county-other" d={floridaOtherCountyPaths} />
        <path className="florida-county-lines florida-county-tracked" d={floridaTrackedCountyPaths} />
      </g>
      {counties.map((county) => {
        const position = countyPins[county];
        if (!position) return null;
        const isActive = activeCounty === county;
        const label = labelOffsets[county] || { dx: 0, dy: -15, anchor: "middle" as const };

        return (
          <g
            key={county}
            className={isActive ? "florida-pin is-active" : "florida-pin"}
            transform={`translate(${position.x} ${position.y})`}
            onClick={() => onSelectCounty(county)}
            role="button"
            tabIndex={0}
            aria-label={`View pricing for ${county}`}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelectCounty(county);
              }
            }}
          >
            <circle className="florida-pin-halo" cy="-18" r="15" />
            <path className="florida-pin-mark" d={pinPath} />
            <circle className="florida-pin-dot" cy="-21" r="3.2" />
            <text x={label.dx} y={label.dy} textAnchor={label.anchor}>
              {county}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
