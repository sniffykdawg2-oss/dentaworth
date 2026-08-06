import { MouseEvent } from "react";

export type Page =
  | "home"
  | "search"
  | "self-reporting"
  | "about"
  | "privacy-policy"
  | "terms-of-use"
  | "contact"
  | "get-care-now"
  | "find-a-dentist"
  | "advertise-with-us"
  | "promote-your-practice"
  | "drugs-a-z"
  | "provider-login"
  | "news"
  | "help-center"
  | "blog"
  | "sign-in"
  | "account"
  | "admin"
  | "not-found";

export const routeTitles: Record<Page, string> = {
  home: "Florida dental cost guide",
  search: "Search results",
  "self-reporting": "Self reporting page",
  about: "About DentaWorth",
  "privacy-policy": "Privacy Policy",
  "terms-of-use": "Terms of Use",
  contact: "Contact us",
  "get-care-now": "Get Covered Now",
  "find-a-dentist": "Find a dentist",
  "advertise-with-us": "Advertise with us",
  "promote-your-practice": "Promote your practice",
  "drugs-a-z": "Drugs A-Z",
  "provider-login": "Provider login",
  news: "News and features",
  "help-center": "Help Center",
  blog: "Blog",
  "sign-in": "Sign in",
  account: "Account center",
  admin: "Admin dashboard",
  "not-found": "Page not found",
};

const pathToPage: Record<string, Page> = {
  "": "home",
  "/search": "search",
  "/self-reporting": "self-reporting",
  "/about": "about",
  "/privacy-policy": "privacy-policy",
  "/terms-of-use": "terms-of-use",
  "/contact": "contact",
  "/get-care-now": "get-care-now",
  "/find-a-dentist": "find-a-dentist",
  "/advertise-with-us": "advertise-with-us",
  "/promote-your-practice": "promote-your-practice",
  "/drugs-a-z": "drugs-a-z",
  "/provider-login": "provider-login",
  "/news": "news",
  "/help-center": "help-center",
  "/blog": "blog",
  "/sign-in": "sign-in",
  "/account": "account",
  "/admin": "admin",
};

export function getCurrentPage(): Page {
  const path = window.location.pathname.replace(/\/$/, "");
  return pathToPage[path] ?? "not-found";
}

/** Free-text friendly — search inputs are now typeahead fields, not constrained selects. */
export function getSearchFiltersFromUrl() {
  const params = new URLSearchParams(window.location.search);

  return {
    treatment: (params.get("treatment") || "").trim(),
    county: (params.get("county") || "").trim(),
  };
}

export function handleLinkClick(event: MouseEvent<HTMLAnchorElement>, href: string, navigate: (href: string) => void) {
  event.preventDefault();
  navigate(href);
}

export type NavLink = { label: string; href: string };

export type FooterColumn = { heading: string; links: NavLink[] };

export const footerColumns: FooterColumn[] = [
  {
    heading: "For Patients",
    links: [
      { label: "Cost guide", href: "/" },
      { label: "Get Covered Now", href: "/get-care-now" },
      { label: "Get Dental Coverage", href: "/get-care-now" },
      { label: "Find a Dentist", href: "/find-a-dentist" },
      { label: "Self-report prices", href: "/self-reporting" },
      { label: "Drugs A-Z", href: "/drugs-a-z" },
      { label: "Help Center", href: "/help-center" },
    ],
  },
  {
    heading: "For Providers",
    links: [
      { label: "Provider login", href: "/provider-login" },
      { label: "Promote your practice", href: "/promote-your-practice" },
      { label: "Advertise with us", href: "/advertise-with-us" },
    ],
  },
  {
    heading: "Our Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "News and features", href: "/news" },
      { label: "Blog", href: "/blog" },
      { label: "Contact us", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Use", href: "/terms-of-use" },
    ],
  },
];

/** Flat list of every page, used by the admin "Pages" preview tab. */
export const allPagesForPreview: Array<{ label: string; href: string; group: string }> = [
  { label: "Cost guide (home)", href: "/", group: "For Patients" },
  { label: "Search results (example)", href: "/search?treatment=Cleaning&county=Broward", group: "For Patients" },
  { label: "Get Covered Now", href: "/get-care-now", group: "For Patients" },
  { label: "Find a Dentist", href: "/find-a-dentist", group: "For Patients" },
  { label: "Self-report prices", href: "/self-reporting", group: "For Patients" },
  { label: "Drugs A-Z", href: "/drugs-a-z", group: "For Patients" },
  { label: "Help Center", href: "/help-center", group: "For Patients" },
  { label: "Provider login", href: "/provider-login", group: "For Providers" },
  { label: "Promote your practice", href: "/promote-your-practice", group: "For Providers" },
  { label: "Advertise with us", href: "/advertise-with-us", group: "For Providers" },
  { label: "About us", href: "/about", group: "Our Company" },
  { label: "News and features", href: "/news", group: "Our Company" },
  { label: "Blog", href: "/blog", group: "Our Company" },
  { label: "Contact us", href: "/contact", group: "Our Company" },
  { label: "Privacy Policy", href: "/privacy-policy", group: "Our Company" },
  { label: "Terms of Use", href: "/terms-of-use", group: "Our Company" },
  { label: "Sign in", href: "/sign-in", group: "Account" },
  { label: "Account center", href: "/account", group: "Account" },
];
