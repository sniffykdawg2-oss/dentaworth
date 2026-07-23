# Dentaworth Admin Launch Setup

Use this checklist when preparing the backend for launch.

## 1. Enable Auth

In Firebase Console for project `dentaworth`:

1. Open Authentication.
2. Enable Email/Password sign-in.
3. Create the owner/admin user.

## 2. Set Admin Claim

The `/admin` dashboard requires a Firebase custom claim:

```json
{
  "admin": true
}
```

Set this with the Firebase Admin SDK from a trusted environment, such as a local script or Google Cloud Shell. Do not expose claim-setting in the public app.

Example Admin SDK snippet:

```js
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

initializeApp({
  credential: cert("./service-account.json"),
});

await getAuth().setCustomUserClaims("USER_UID_HERE", { admin: true });
```

After setting the claim, sign out and sign back in so the browser receives a fresh ID token.

## 3. Enter Launch Data

1. Sign in at `/sign-in`.
2. Open `/admin`.
3. Add price ranges as `draft`.
4. Publish only reviewed price ranges.
5. Add dentist profiles as `draft`.
6. Publish only approved profiles with verified public contact details.
7. Review self-reported prices and contact messages from the review queue.

## 4. Public Data Rules

- The homepage reads `priceRanges` where `status == "published"`.
- If no published price ranges exist, the homepage shows the seed data in `src/content.ts`.
- The Find a Dentist page reads `dentistProfiles` where `status == "published"`.
- Draft and archived records are admin-only.

## 5. Final Smoke Test

Before launch:

1. Submit a self-report price from `/self-reporting`.
2. Confirm it appears in `/admin`.
3. Mark it approved or archived.
4. Submit a contact form.
5. Confirm it appears in `/admin`.
6. Publish one price range and confirm it appears on the homepage.
7. Publish one dentist profile and confirm it appears on `/find-a-dentist`.
