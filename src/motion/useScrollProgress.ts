import { RefObject, useEffect } from "react";
import { prefersReducedMotion } from "./motion";

type ScrollProgressMode = "pin" | "pass" | "view";

/**
 * Writes scroll progress for an element into CSS custom properties without
 * re-rendering React. The scroll listener is only attached while the element
 * is near the viewport, and updates are batched to one per animation frame.
 *
 * - "pin":  0 when the element's top reaches the viewport top, 1 when its
 *           bottom reaches the viewport bottom (for tall sections with a
 *           sticky stage).
 * - "pass": 0 when the element's top enters the bottom of the viewport, 1
 *           when its bottom leaves the top (for gentle parallax).
 * - "view": 0 when the element's top reaches `start` (fraction of viewport
 *           height), 1 when its bottom reaches `end` (for reading-paced effects).
 *
 * `onProgress` can derive extra eased values; whatever it returns is written
 * as CSS variables on the element. Reduced-motion visitors get final values.
 */
export function useScrollProgress<T extends HTMLElement>(
  ref: RefObject<T | null>,
  {
    mode = "pass",
    start = 0.85,
    end = 0.5,
    onProgress,
  }: {
    mode?: ScrollProgressMode;
    start?: number;
    end?: number;
    onProgress?: (progress: number, element: T) => Record<string, number | string> | void;
  } = {},
) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    function write(progress: number) {
      if (!element) return;
      element.style.setProperty("--p", progress.toFixed(4));
      const extra = onProgress?.(progress, element);
      if (extra) {
        for (const [name, value] of Object.entries(extra)) {
          element.style.setProperty(name, typeof value === "number" ? value.toFixed(4) : value);
        }
      }
    }

    if (prefersReducedMotion()) {
      write(1);
      return;
    }

    let frame = 0;

    function update() {
      frame = 0;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const viewport = window.innerHeight;
      let progress: number;

      if (mode === "pin") {
        const travel = rect.height - viewport;
        progress = travel > 0 ? -rect.top / travel : rect.top <= 0 ? 1 : 0;
      } else if (mode === "view") {
        progress = (viewport * start - rect.top) / (rect.height + viewport * (start - end));
      } else {
        progress = (viewport - rect.top) / (viewport + rect.height);
      }

      write(Math.min(1, Math.max(0, progress)));
    }

    function onScroll() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }

    let listening = false;
    const visibility = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !listening) {
          listening = true;
          window.addEventListener("scroll", onScroll, { passive: true });
          window.addEventListener("resize", onScroll);
          update();
        } else if (!entry.isIntersecting && listening) {
          listening = false;
          window.removeEventListener("scroll", onScroll);
          window.removeEventListener("resize", onScroll);
          update();
        }
      },
      { rootMargin: "120px 0px" },
    );

    visibility.observe(element);
    update();

    return () => {
      visibility.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
    // onProgress is intentionally read from the first render; callers pass stable math.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, mode, start, end]);
}

export function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

/** Map progress within [start, end] to 0..1. */
export function segment(progress: number, start: number, end: number) {
  return clamp01((progress - start) / (end - start));
}

export function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
