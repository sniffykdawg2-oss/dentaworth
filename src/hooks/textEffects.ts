import { useEffect, useState } from "react";

/** Cycles through a list of items, fading/rising each one out before the next rises in. */
export function useWordCycle<T>(items: T[], intervalMs = 5000, transitionMs = 350) {
  const [index, setIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (items.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setIsExiting(true);
      window.setTimeout(() => {
        setIndex((current) => (current + 1) % items.length);
        setIsExiting(false);
      }, transitionMs);
    }, intervalMs);

    return () => window.clearInterval(intervalId);
  }, [items.length, intervalMs, transitionMs]);

  return { item: items[index % items.length], index: index % items.length, isExiting };
}
