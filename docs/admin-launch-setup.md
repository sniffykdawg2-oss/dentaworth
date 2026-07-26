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

This repo includes a local helper script:

```bash
bun run admin:claim USER_UID_HERE
```

The helper uses your Firebase CLI login by default. If you prefer a service account, you can also run:

```bash
GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account.json bun run admin:claim USER_UID_HERE
```

You can get the user's UID from Firebase Console > Authentication > Users. Do not commit service account JSON files. Keep them outside the repo.

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

## 5. Public Submission Spam Guard

Public Firestore writes include a hidden honeypot field and a short form-time check enforced by Firestore rules. This blocks simple bot posts without adding paid infrastructure.

For stronger protection later, enable Firebase App Check for the web app and enforce it on Firestore after testing real submissions.

## 6. Final Smoke Test

Before launch:

1. Submit a self-report price from `/self-reporting`.
2. Confirm it appears in `/admin`.
3. Mark it approved or archived.
4. Submit a contact form.
5. Confirm it appears in `/admin`.
6. Publish one price range and confirm it appears on the homepage.
7. Publish one dentist profile and confirm it appears on `/find-a-dentist`.
