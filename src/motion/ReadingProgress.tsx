import { RefObject, useEffect, useRef } from "react";

/**
 * A thin sky bar under the header showing how far through a long read
 * (blog article, privacy policy) the visitor is.
 */
export function ReadingProgress({ targetRef }: { targetRef: RefObject<HTMLElement | null> }) {
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;

    function update() {
      frame = 0;
      const target = targetRef.current;
      const bar = barRef.current;
      if (!target || !bar) return;
      const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 76;
      const rect = target.getBoundingClientRect();
      const readable = rect.height - (window.innerHeight - headerHeight);
      const progress = readable > 0 ? Math.min(1, Math.max(0, (headerHeight - rect.top) / readable)) : 1;
      bar.style.transform = `scaleX(${progress.toFixed(4)})`;
      bar.parentElement?.toggleAttribute("data-active", progress > 0 && progress < 1);
    }

    function onScroll() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [targetRef]);

  return (
    <div className="reading-progress" aria-hidden="true">
      <span ref={barRef} />
    </div>
  );
}
