import { maxLengths, PriceReportInput, ProcedurePriceMap } from "./schema";
import { counties, ProcedureKey, procedures } from "../content";
import { Timestamp } from "firebase/firestore";

const procedureKeys = new Set<ProcedureKey>(procedures.map((procedure) => procedure.key));

export function cleanText(value: FormDataEntryValue | null, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

export function cleanLongText(value: FormDataEntryValue | null, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function parseDollarAmount(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return undefined;
  const cleaned = value.replace(/[$,\s]/g, "");
  if (!cleaned) return undefined;

  const amount = Number(cleaned);
  if (!Number.isFinite(amount) || amount <= 0) return undefined;

  return Math.round(amount * 100) / 100;
}

export function parseProcedurePrices(formData: FormData) {
  const procedurePrices: ProcedurePriceMap = {};

  for (const procedure of procedures) {
    const parsed = parseDollarAmount(formData.get(procedure.key));
    if (parsed !== undefined && procedureKeys.has(procedure.key)) {
      procedurePrices[procedure.key] = parsed;
    }
  }

  return procedurePrices;
}

export function buildPriceReportInput(formData: FormData): PriceReportInput {
  const county = cleanText(formData.get("county"), 80);
  const providerName = cleanText(formData.get("provider"), maxLengths.providerName);
  const notes = cleanLongText(formData.get("notes"), maxLengths.notes);
  const procedurePrices = parseProcedurePrices(formData);

  if (!counties.includes(county)) {
    throw new Error("Choose a Florida county.");
  }

  if (Object.keys(procedurePrices).length === 0) {
    throw new Error("Enter at least one procedure price.");
  }

  return {
    county,
    state: "Florida",
    providerName: providerName || undefined,
    procedurePrices,
    notes: notes || undefined,
    submissionGuard: buildSubmissionGuard(formData),
  };
}

export function buildSubmissionGuard(formData: FormData) {
  const startedAt = Number(formData.get("formStartedAt"));
  const website = cleanText(formData.get("website"), 200);

  if (!Number.isFinite(startedAt) || startedAt <= 0) {
    throw new Error("Reload the page and try again.");
  }

  if (website) {
    throw new Error("Unable to submit this form.");
  }

  return {
    formStartedAt: Timestamp.fromMillis(startedAt),
    website: "" as const,
  };
}
