/**
 * DentaWorth motion system.
 *
 * One shared IntersectionObserver drives every scroll entrance on the site.
 * Elements opt in declaratively with `data-reveal="up" | "fade" | "media" |
 * "mask" | "line" | "stagger"`; when they cross ~90% of the viewport the
 * observer stamps `data-inview` and CSS (styles/motion.css) plays the
 * entrance once.
 *
 * Framed photos can also opt into `data-parallax`: while on screen they get a
 * `--parallax` value (-1 below centre … 1 above) that CSS uses to drift the
 * image inside its frame. One shared scroll handler serves all of them.
 *
 * Motion is progressive enhancement: hidden pre-states only apply while
 * `html.motion-ok` is present, which index.html sets before first paint and
 * this module removes again if the visitor prefers reduced motion or the
 * browser lacks IntersectionObserver. Without it, everything renders as-is.
 */

const REVEAL_SELECTOR = "[data-reveal]";
const STAGGER_SELECTOR = '[data-reveal="stagger"]';
const PARALLAX_SELECTOR = "[data-parallax]";

let observer: IntersectionObserver | null = null;
let mutationObserver: MutationObserver | null = null;
let introPending = false;
const queuedDuringIntro = new Set<Element>();
// Tracked reveal elements that have not played yet (for the bottom-of-page fallback).
const pendingReveals = new Set<Element>();
let parallaxObserver: IntersectionObserver | null = null;
const parallaxOnScreen = new Set<HTMLElement>();
let parallaxFrame = 0;

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function markInView(element: Element) {
  pendingReveals.delete(element);
  element.setAttribute("data-inview", "");
}

function indexStaggerChildren(group: Element) {
  Array.from(group.children).forEach((child, index) => {
    (child as HTMLElement).style.setProperty("--i", String(index));
  });
}

function track(element: Element) {
  if (element.hasAttribute("data-inview")) return;
  if (element.matches(STAGGER_SELECTOR)) indexStaggerChildren(element);
  pendingReveals.add(element);
  observer?.observe(element);
}

function scan(root: ParentNode) {
  if (root instanceof Element && root.matches(REVEAL_SELECTOR)) track(root);
  root.querySelectorAll(REVEAL_SELECTOR).forEach(track);
  if (root instanceof Element && root.matches(PARALLAX_SELECTOR)) parallaxObserver?.observe(root);
  root.querySelectorAll(PARALLAX_SELECTOR).forEach((element) => parallaxObserver?.observe(element));
}

function forget(node: Element) {
  const all = [node, ...Array.from(node.querySelectorAll(`${REVEAL_SELECTOR}, ${PARALLAX_SELECTOR}`))];
  for (const element of all) {
    observer?.unobserve(element);
    parallaxObserver?.unobserve(element);
    parallaxOnScreen.delete(element as HTMLElement);
    pendingReveals.delete(element);
  }
}

function updateParallax() {
  parallaxFrame = 0;
  const viewport = window.innerHeight;
  parallaxOnScreen.forEach((element) => {
    const rect = element.getBoundingClientRect();
    const offset = (rect.top + rect.height / 2 - viewport / 2) / (viewport / 2 + rect.height / 2);
    element.style.setProperty("--parallax", Math.max(-1, Math.min(1, offset)).toFixed(4));
  });
}

function requestParallax() {
  if (!parallaxFrame && parallaxOnScreen.size > 0) parallaxFrame = window.requestAnimationFrame(updateParallax);
}

// Entrances normally fire at 90% of the viewport height, which the last elements on a
// short page may never reach. At the bottom of the page, reveal whatever is on screen.
let bottomFrame = 0;
function checkPageBottom() {
  bottomFrame = 0;
  if (introPending || pendingReveals.size === 0) return;
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
  if (!atBottom) return;
  pendingReveals.forEach((element) => {
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      observer?.unobserve(element);
      markInView(element);
    }
  });
}

function onScrollForBottom() {
  if (!bottomFrame) bottomFrame = window.requestAnimationFrame(checkPageBottom);
}

function disableMotion() {
  document.documentElement.classList.remove("motion-ok");
  observer?.disconnect();
  mutationObserver?.disconnect();
  parallaxObserver?.disconnect();
  window.removeEventListener("scroll", requestParallax);
  window.removeEventListener("resize", requestParallax);
  window.removeEventListener("scroll", onScrollForBottom);
  parallaxOnScreen.clear();
  pendingReveals.clear();
  observer = null;
  mutationObserver = null;
  parallaxObserver = null;
  queuedDuringIntro.clear();
  introPending = false;
}

export function startMotion() {
  const root = document.documentElement;

  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    root.classList.remove("motion-ok");
    return;
  }

  root.classList.add("motion-ok");

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer?.unobserve(entry.target);
        if (introPending) queuedDuringIntro.add(entry.target);
        else markInView(entry.target);
      }
    },
    // Fire when an element's top crosses 90% of the viewport height.
    { rootMargin: "0px 0px -10% 0px", threshold: 0 },
  );

  parallaxObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) parallaxOnScreen.add(entry.target as HTMLElement);
        else parallaxOnScreen.delete(entry.target as HTMLElement);
      }
      requestParallax();
    },
    { rootMargin: "10% 0px" },
  );
  window.addEventListener("scroll", requestParallax, { passive: true });
  window.addEventListener("resize", requestParallax);
  window.addEventListener("scroll", onScrollForBottom, { passive: true });

  scan(document);

  mutationObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      // React can reuse an existing element and only add data-reveal to it (e.g. an
      // empty state swapped for a results grid in the same slot), so watch attributes too.
      if (mutation.type === "attributes" && mutation.target instanceof Element) {
        if (mutation.target.hasAttribute("data-reveal")) track(mutation.target);
        continue;
      }
      mutation.addedNodes.forEach((node) => {
        if (node instanceof Element) scan(node);
      });
      mutation.removedNodes.forEach((node) => {
        if (node instanceof Element) forget(node);
      });
    }
    onScrollForBottom();
  });
  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["data-reveal"],
  });

  window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", (event) => {
    if (event.matches) disableMotion();
  });
}

/** Hold first-screen entrances while the brand intro covers the page. */
export function holdIntro() {
  introPending = true;
}

/** Release held entrances so they play as the intro curtain lifts. */
export function releaseIntro() {
  introPending = false;
  queuedDuringIntro.forEach(markInView);
  queuedDuringIntro.clear();
  onScrollForBottom();
}
