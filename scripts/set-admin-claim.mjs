import { applicationDefault, cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { readFile } from "node:fs/promises";

const uid = process.argv[2];
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!uid) {
  console.error("Usage: bun run admin:claim <firebase-user-uid>");
  process.exit(1);
}

const credential = serviceAccountPath
  ? cert(JSON.parse(await readFile(serviceAccountPath, "utf8")))
  : applicationDefault();

initializeApp({ credential, projectId: process.env.GCLOUD_PROJECT || "dentaworth" });

await getAuth().setCustomUserClaims(uid, { admin: true });

console.log(`Admin claim set for ${uid}. Sign out and back in to refresh the browser token.`);
