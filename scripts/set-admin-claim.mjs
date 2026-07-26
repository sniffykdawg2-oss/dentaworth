import { applicationDefault, cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

const uid = process.argv[2];
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const projectId = process.env.GCLOUD_PROJECT || "dentaworth";

if (!uid) {
  console.error("Usage: bun run admin:claim <firebase-user-uid>");
  process.exit(1);
}

if (serviceAccountPath || process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  const credential = serviceAccountPath
    ? cert(JSON.parse(await readFile(serviceAccountPath, "utf8")))
    : applicationDefault();

  initializeApp({ credential, projectId });

  await getAuth().setCustomUserClaims(uid, { admin: true });
} else {
  await setAdminClaimWithFirebaseCliLogin(uid);
}

console.log(`Admin claim set for ${uid}. Sign out and back in to refresh the browser token.`);

async function setAdminClaimWithFirebaseCliLogin(userId) {
  const firebaseToolsConfigPath = join(homedir(), ".config", "configstore", "firebase-tools.json");

  if (!existsSync(firebaseToolsConfigPath)) {
    throw new Error(
      "No service account was provided and Firebase CLI login was not found. Run firebase login or set GOOGLE_APPLICATION_CREDENTIALS.",
    );
  }

  const config = JSON.parse(readFileSync(firebaseToolsConfigPath, "utf8"));
  const refreshToken = config.tokens?.refresh_token;

  if (!refreshToken) {
    throw new Error(
      "Firebase CLI login is missing a refresh token. Run firebase login --reauth or set GOOGLE_APPLICATION_CREDENTIALS.",
    );
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: "563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com",
      client_secret: "j9iVZfS8kkCEFUPaAeJV0sAi",
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const tokenData = await tokenResponse.json();

  if (!tokenResponse.ok || !tokenData.access_token) {
    throw new Error(tokenData.error_description || tokenData.error || "Unable to refresh Firebase CLI access token.");
  }

  const claimResponse = await fetch(`https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:update`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      localId: userId,
      customAttributes: JSON.stringify({ admin: true }),
    }),
  });

  const claimData = await claimResponse.json();

  if (!claimResponse.ok) {
    throw new Error(claimData.error?.message || "Unable to set Firebase Auth custom claim.");
  }
}
