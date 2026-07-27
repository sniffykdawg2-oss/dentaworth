/** Purely decorative, low-opacity background flourishes. Not interactive —
 * always rendered with pointer-events disabled via CSS on the wrapper class. */

export function DotRing({ className = "" }: { className?: string }) {
  const dots = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * Math.PI * 2;
    const r = 110;
    return { x: 120 + Math.cos(angle) * r, y: 120 + Math.sin(angle) * r };
  });

  return (
    <svg className={`bg-art ${className}`} viewBox="0 0 240 240" aria-hidden="true" focusable="false">
      {dots.map((dot, i) => (
        <circle key={i} cx={dot.x} cy={dot.y} r={i % 3 === 0 ? 4.5 : 3} />
      ))}
    </svg>
  );
}

export function FlowLine({ className = "" }: { className?: string }) {
  return (
    <svg className={`bg-art ${className}`} viewBox="0 0 520 300" aria-hidden="true" focusable="false">
      <path
        d="M -20 220 C 80 260, 140 120, 240 150 S 400 260, 540 90"
        fill="none"
        strokeWidth="2.5"
      />
      <path
        d="M -20 160 C 90 200, 150 60, 260 100 S 420 210, 540 40"
        fill="none"
        strokeWidth="2"
      />
    </svg>
  );
}
