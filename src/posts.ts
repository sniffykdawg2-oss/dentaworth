export type Post = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  body: string[];
};

/**
 * Genuine entries only — no fabricated press mentions, metrics, or bylines.
 * Add real posts here as they're written; the page renders an honest empty
 * state when a list is empty rather than inventing filler content.
 */
export const newsPosts: Post[] = [
  {
    slug: "dentaworth-is-live",
    title: "DentaWorth is live",
    date: "2026-07-26",
    summary: "DentaWorth's Florida dental cost guide and self-reporting tool are now online.",
    body: [
      "DentaWorth is now live at dentaworth.web.app, offering a county-level cost guide for common dental procedures across Florida.",
      "The guide is built to give patients a starting point before they call around for care, and it grows over time as people self-report the prices they were actually quoted or charged.",
      "More updates will be posted here as new features, counties, and tools are added.",
    ],
  },
];

export const blogPosts: Post[] = [];

export const blogEmptyStateNote =
  "Longer articles about dental cost transparency, how to read a treatment estimate, and using the guide effectively are in progress. Check back soon.";
