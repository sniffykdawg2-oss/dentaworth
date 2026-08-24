import { CountyCostRow, procedures, ProcedureKey } from "./content";
import { PriceRangeRecord } from "./backend/schema";

export function readAuthError(error: unknown) {
  if (!(error instanceof Error)) return "Unable to sign in.";

  const message = error.message.toLowerCase();

  if (message.includes("permission-denied") || message.includes("missing or insufficient permissions")) {
    return "Your account was recognized, but DentaWorth could not finish loading your profile. Please try again, and contact us if it keeps happening.";
  }

  if (message.includes("auth/invalid-credential") || message.includes("auth/wrong-password") || message.includes("auth/user-not-found")) {
    return "The email or password did not match an account.";
  }

  if (message.includes("auth/email-already-in-use")) {
    return "This email is already in use. Try signing in instead.";
  }

  if (message.includes("auth/weak-password")) {
    return "Choose a stronger password with at least six characters.";
  }

  if (message.includes("auth/invalid-email")) {
    return "Enter a valid email address.";
  }

  if (message.includes("auth/operation-not-allowed")) {
    return "Email/password sign-in is not enabled in Firebase Authentication yet.";
  }

  if (message.includes("auth/too-many-requests")) {
    return "Too many attempts. Wait a bit and try again.";
  }

  return "Something went wrong while connecting to DentaWorth. Please try again.";
}

export function getProcedureLabel(procedureKey: ProcedureKey) {
  return procedures.find((procedure) => procedure.key === procedureKey)?.label || procedureKey;
}

export function formatProcedurePrices(procedurePrices: Partial<Record<ProcedureKey, number>>) {
  const entries = Object.entries(procedurePrices) as Array<[ProcedureKey, number]>;

  if (entries.length === 0) return "No procedure prices submitted.";

  return entries.map(([procedureKey, price]) => `${getProcedureLabel(procedureKey)}: $${price}`).join(" · ");
}

export function buildCountyRowsFromPriceRanges(priceRanges: Array<{ id: string } & PriceRangeRecord>) {
  if (priceRanges.length === 0) return null;

  const rowsByCounty = new Map<string, CountyCostRow>();

  for (const range of priceRanges) {
    const existingRow = rowsByCounty.get(range.county);
    const row =
      existingRow ||
      ({
        county: range.county,
        rating: range.rating ? String(range.rating) : "Not rated",
        rootCanal: "",
        xray: "",
        extraction: "",
        crown: "",
        cleaning: "",
        exam: "",
        implant: "",
        filling: "",
        whitening: "",
        invisalign: "",
      } satisfies CountyCostRow);

    row[range.procedure] = `${range.low} - ${range.high}`;
    if (range.rating) row.rating = String(range.rating);
    rowsByCounty.set(range.county, row);
  }

  return [...rowsByCounty.values()].sort((a, b) => {
    if (a.county === "Statewide average") return -1;
    if (b.county === "Statewide average") return 1;
    return a.county.localeCompare(b.county);
  });
}
