import { ProcedureKey } from "../content";

export type ReviewStatus = "pending" | "approved" | "rejected" | "archived";

export type ModerationFields = {
  status: ReviewStatus;
  adminNotes?: string;
  reviewedAt?: unknown;
  reviewedBy?: string;
};

export type ProcedurePriceMap = Partial<Record<ProcedureKey, number>>;

export type PriceReportInput = {
  county: string;
  state: "Florida";
  providerName?: string;
  procedurePrices: ProcedurePriceMap;
  notes?: string;
};

export type PriceReportRecord = PriceReportInput &
  ModerationFields & {
    createdAt: unknown;
    updatedAt: unknown;
    source: "self-reporting-form";
    schemaVersion: 1;
  };

export type ContactMessageInput = {
  name: string;
  email: string;
  message: string;
  topic: "general" | "correction" | "advertising" | "practice-promotion";
};

export type ContactMessageRecord = ContactMessageInput &
  ModerationFields & {
    createdAt: unknown;
    updatedAt: unknown;
    source: "contact-form" | "advertising-page" | "practice-promotion-page";
    schemaVersion: 1;
  };

export type PriceRangeRecord = {
  state: "Florida";
  county: string;
  procedure: ProcedureKey;
  low: number;
  high: number;
  currency: "USD";
  rating?: number;
  status: "draft" | "published" | "archived";
  sourceSummary: string;
  createdAt: unknown;
  updatedAt: unknown;
  publishedAt?: unknown;
  schemaVersion: 1;
};

export type PriceRangeInput = Omit<
  PriceRangeRecord,
  "createdAt" | "updatedAt" | "publishedAt" | "schemaVersion"
>;

export type DentistProfileRecord = {
  practiceName: string;
  slug: string;
  state: "Florida";
  county: string;
  city?: string;
  address?: string;
  zipCode?: string;
  websiteUrl?: string;
  phone?: string;
  email?: string;
  services: ProcedureKey[];
  notes?: string;
  status: "draft" | "published" | "archived";
  createdAt: unknown;
  updatedAt: unknown;
  publishedAt?: unknown;
  schemaVersion: 1;
};

export type DentistProfileInput = Omit<
  DentistProfileRecord,
  "createdAt" | "updatedAt" | "publishedAt" | "schemaVersion"
>;

export const collectionNames = {
  priceReports: "priceReports",
  contactMessages: "contactMessages",
  priceRanges: "priceRanges",
  dentistProfiles: "dentistProfiles",
  auditLogs: "auditLogs",
} as const;

export const maxLengths = {
  name: 120,
  email: 180,
  providerName: 180,
  message: 3000,
  notes: 3000,
} as const;
