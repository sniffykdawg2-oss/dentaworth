export type Post = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  body: string[];
  image?: string;
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

export const blogPosts: Post[] = [
  {
    slug: "how-to-read-a-dental-estimate-before-you-book",
    title: "How to read a dental estimate before you book",
    date: "2026-08-24",
    summary: "A simple way to compare what an office says it will do, what the estimate includes, and what could still change.",
    image: "/images/mother-daughter-smile.jpg",
    body: [
      "A dental estimate is easier to compare when you slow it down into three questions: what is being done, what is included, and what could change the final number.",
      "Start with the procedure name and code, if one is provided. Two offices may use different everyday language for similar care, so the written details matter more than a headline number. Ask whether the estimate is for one visit, a treatment phase, or the full plan.",
      "Next, ask what is included. Exams, X-rays, materials, lab fees, sedation, and follow-up visits can sit outside the first number. A lower estimate is not automatically a better estimate if it leaves out pieces the other office included.",
      "Finally, ask what could change. Complexity, additional imaging, or a different material can affect the final price. DentaWorth gives you local context for that conversation, but the treating office is the right place to confirm your actual care and cost.",
    ],
  },
  {
    slug: "why-dental-prices-come-as-ranges",
    title: "Why dental prices come as ranges",
    date: "2026-08-26",
    summary: "A range is more useful than a pretend-perfect number when treatment, materials, and local costs can change.",
    image: "/images/procedures-overview.jpg",
    body: [
      "Dental care rarely has one universal price. The same procedure can vary by county, office, materials, treatment complexity, and what is included in the visit.",
      "That is why DentaWorth uses ranges. A range gives you context without pretending that an online guide can replace an office's examination and written estimate.",
      "Use the lower and upper ends as conversation starters. Ask what assumptions created the number, what is included, and which findings could move the estimate outside the range.",
    ],
  },
  {
    slug: "five-questions-to-ask-before-paying-cash",
    title: "Five questions to ask before paying cash",
    date: "2026-08-28",
    summary: "The questions that make a dental quote easier to compare before you schedule treatment.",
    image: "/images/page-hero-dentist-patient.png",
    body: [
      "Before you compare totals, ask whether the estimate is for a consultation, one procedure, or a complete treatment plan.",
      "Ask what is included, whether the office expects additional imaging or lab fees, and whether the estimate assumes a routine case.",
      "Finally, ask for the estimate in writing and confirm payment timing. A clear conversation up front can prevent a confusing bill later.",
    ],
  },
];

export const blogEmptyStateNote =
  "Longer articles about dental cost transparency, how to read a treatment estimate, and using the guide effectively are in progress. Check back soon.";
