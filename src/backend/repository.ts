import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import {
  collectionNames,
  ContactMessageInput,
  PriceReportInput,
} from "./schema";

export async function createPriceReport(input: PriceReportInput) {
  const now = serverTimestamp();

  return addDoc(collection(db, collectionNames.priceReports), {
    ...input,
    source: "self-reporting-form",
    status: "pending",
    schemaVersion: 1,
    createdAt: now,
    updatedAt: now,
  });
}

export async function createContactMessage(
  input: ContactMessageInput,
  source: "contact-form" | "advertising-page" | "practice-promotion-page" = "contact-form",
) {
  const now = serverTimestamp();

  return addDoc(collection(db, collectionNames.contactMessages), {
    ...input,
    source,
    status: "pending",
    schemaVersion: 1,
    createdAt: now,
    updatedAt: now,
  });
}
