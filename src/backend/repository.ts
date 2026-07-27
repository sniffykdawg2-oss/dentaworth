import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, requireFirebaseService } from "../firebase";
import {
  collectionNames,
  ContactMessageInput,
  ContactMessageRecord,
  DentistProfileInput,
  DentistProfileRecord,
  NewsletterSubscriptionInput,
  PriceRangeInput,
  PriceRangeRecord,
  PriceReportInput,
  PriceReportRecord,
  ReviewStatus,
} from "./schema";

export type FirestoreRecord<T> = T & { id: string };

export async function createPriceReport(input: PriceReportInput) {
  const configuredDb = requireFirebaseService(db, "Firestore");
  const now = serverTimestamp();

  return addDoc(collection(configuredDb, collectionNames.priceReports), {
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
  const configuredDb = requireFirebaseService(db, "Firestore");
  const now = serverTimestamp();

  return addDoc(collection(configuredDb, collectionNames.contactMessages), {
    ...input,
    source,
    status: "pending",
    schemaVersion: 1,
    createdAt: now,
    updatedAt: now,
  });
}

export async function createNewsletterSubscription(input: NewsletterSubscriptionInput) {
  const configuredDb = requireFirebaseService(db, "Firestore");
  const now = serverTimestamp();

  return addDoc(collection(configuredDb, collectionNames.newsletterSubscribers), {
    ...input,
    source: "footer-newsletter",
    schemaVersion: 1,
    createdAt: now,
    updatedAt: now,
  });
}

export function subscribeToAdminCollection<T>(
  collectionName: keyof typeof collectionNames,
  callback: (records: Array<FirestoreRecord<T>>) => void,
) {
  const configuredDb = requireFirebaseService(db, "Firestore");

  return onSnapshot(collection(configuredDb, collectionNames[collectionName]), (snapshot) => {
    callback(
      snapshot.docs.map((recordDoc) => ({
        id: recordDoc.id,
        ...(recordDoc.data() as T),
      })),
    );
  });
}

export function subscribeToPublishedPriceRanges(
  callback: (records: Array<FirestoreRecord<PriceRangeRecord>>) => void,
) {
  const configuredDb = requireFirebaseService(db, "Firestore");

  return onSnapshot(
    query(collection(configuredDb, collectionNames.priceRanges), where("status", "==", "published")),
    (snapshot) => {
    callback(
      snapshot.docs
        .map((recordDoc) => ({
          id: recordDoc.id,
          ...(recordDoc.data() as PriceRangeRecord),
        }))
        .filter((record) => record.status === "published"),
    );
    },
  );
}

export function subscribeToPublishedDentistProfiles(
  callback: (records: Array<FirestoreRecord<DentistProfileRecord>>) => void,
) {
  const configuredDb = requireFirebaseService(db, "Firestore");

  return onSnapshot(
    query(collection(configuredDb, collectionNames.dentistProfiles), where("status", "==", "published")),
    (snapshot) => {
    callback(
      snapshot.docs
        .map((recordDoc) => ({
          id: recordDoc.id,
          ...(recordDoc.data() as DentistProfileRecord),
        }))
        .filter((record) => record.status === "published"),
    );
    },
  );
}

export async function savePriceRange(input: PriceRangeInput, adminUserId: string) {
  const configuredDb = requireFirebaseService(db, "Firestore");
  const now = serverTimestamp();
  const rangeId = buildPriceRangeId(input.state, input.county, input.procedure);
  const publishedFields = input.status === "published" ? { publishedAt: now } : {};

  await setDoc(
    doc(configuredDb, collectionNames.priceRanges, rangeId),
    {
      ...input,
      ...publishedFields,
      schemaVersion: 1,
      updatedAt: now,
      createdAt: now,
    },
    { merge: true },
  );

  await createAuditLog(adminUserId, "priceRange.saved", collectionNames.priceRanges, rangeId, {
    county: input.county,
    procedure: input.procedure,
    status: input.status,
  });
}

export async function saveDentistProfile(input: DentistProfileInput, adminUserId: string) {
  const configuredDb = requireFirebaseService(db, "Firestore");
  const now = serverTimestamp();
  const profileId = input.slug || slugify(input.practiceName);
  const publishedFields = input.status === "published" ? { publishedAt: now } : {};

  await setDoc(
    doc(configuredDb, collectionNames.dentistProfiles, profileId),
    {
      ...input,
      slug: profileId,
      ...publishedFields,
      schemaVersion: 1,
      updatedAt: now,
      createdAt: now,
    },
    { merge: true },
  );

  await createAuditLog(adminUserId, "dentistProfile.saved", collectionNames.dentistProfiles, profileId, {
    county: input.county,
    practiceName: input.practiceName,
    status: input.status,
  });
}

export async function updateReviewStatus(
  collectionName: "priceReports" | "contactMessages",
  recordId: string,
  status: ReviewStatus,
  adminUserId: string,
  adminNotes = "",
) {
  const configuredDb = requireFirebaseService(db, "Firestore");

  await updateDoc(doc(configuredDb, collectionNames[collectionName], recordId), {
    status,
    adminNotes,
    reviewedAt: serverTimestamp(),
    reviewedBy: adminUserId,
    updatedAt: serverTimestamp(),
  });

  await createAuditLog(adminUserId, `${collectionName}.${status}`, collectionNames[collectionName], recordId, {
    status,
  });
}

export async function deleteAdminRecord(
  collectionName: "priceRanges" | "dentistProfiles",
  recordId: string,
  adminUserId: string,
) {
  const configuredDb = requireFirebaseService(db, "Firestore");

  await deleteDoc(doc(configuredDb, collectionNames[collectionName], recordId));
  await createAuditLog(adminUserId, `${collectionName}.deleted`, collectionNames[collectionName], recordId);
}

export function sortByUpdatedAt<T extends { updatedAt?: unknown; createdAt?: unknown }>(
  records: Array<FirestoreRecord<T>>,
) {
  return [...records].sort((a, b) => getMillis(b.updatedAt || b.createdAt) - getMillis(a.updatedAt || a.createdAt));
}

export type AdminPriceReportRecord = FirestoreRecord<PriceReportRecord>;
export type AdminContactMessageRecord = FirestoreRecord<ContactMessageRecord>;
export type AdminPriceRangeRecord = FirestoreRecord<PriceRangeRecord>;
export type AdminDentistProfileRecord = FirestoreRecord<DentistProfileRecord>;

function buildPriceRangeId(state: string, county: string, procedure: string) {
  return `${slugify(state)}-${slugify(county)}-${procedure}`;
}

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function createAuditLog(
  adminUserId: string,
  action: string,
  collectionName: string,
  recordId: string,
  metadata: Record<string, unknown> = {},
) {
  const configuredDb = requireFirebaseService(db, "Firestore");

  await addDoc(collection(configuredDb, collectionNames.auditLogs), {
    adminUserId,
    action,
    collectionName,
    recordId,
    metadata,
    createdAt: serverTimestamp(),
    schemaVersion: 1,
  });
}

function getMillis(value: unknown) {
  if (value && typeof value === "object" && "toMillis" in value && typeof value.toMillis === "function") {
    return value.toMillis();
  }

  return 0;
}
