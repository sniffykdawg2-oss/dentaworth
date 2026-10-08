import { useEffect, useState } from "react";
import { prefersReducedMotion } from "../motion/motion";

/** Cycles through a list of items, fading/rising each one out before the next rises in.
 * Reduced-motion visitors keep the first item, so text never changes on its own. */
export function useWordCycle<T>(items: T[], intervalMs = 5000, transitionMs = 350) {
  const [index, setIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (items.length <= 1 || prefersReducedMotion()) return;

    let swapTimer = 0;
    const intervalId = window.setInterval(() => {
      // Don't swap while the tab is hidden; throttled timers would otherwise fire in a burst on return.
      if (document.hidden) return;
      setIsExiting(true);
      swapTimer = window.setTimeout(() => {
        setIndex((current) => (current + 1) % items.length);
        setIsExiting(false);
      }, transitionMs);
    }, intervalMs);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(swapTimer);
    };
  }, [items.length, intervalMs, transitionMs]);

  return { item: items[index % items.length], index: index % items.length, isExiting };
}
