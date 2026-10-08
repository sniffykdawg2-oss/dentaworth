import { RefObject, useEffect } from "react";
import { prefersReducedMotion } from "./motion";

/**
 * Marks whichever items sit in the middle band of the viewport with
 * `data-focus`, so CSS can bring the row being read forward and soften the
 * rest. Uses an IntersectionObserver band, so there is no scroll handler.
 */
export function useFocusBand<T extends HTMLElement>(ref: RefObject<T | null>, itemSelector: string) {
  useEffect(() => {
    const container = ref.current;
    if (!container || prefersReducedMotion() || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) entry.target.toggleAttribute("data-focus", entry.isIntersecting);
      },
      { rootMargin: "-42% 0px -42% 0px" },
    );
    container.querySelectorAll(itemSelector).forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [ref, itemSelector]);
}
