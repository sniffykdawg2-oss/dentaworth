# Dentaworth Backend

Dentaworth uses Firebase for the launch backend:

- Firebase Hosting serves the Vite app.
- Cloud Firestore stores submitted pricing reports, contact/inquiry messages, published price ranges, dentist profiles, account data, and admin audit logs.
- Firebase Storage stores public practice/guide assets and private review files.
- Firebase Auth is reserved for admin access using a custom `admin: true` claim.

No Cloud Functions are required for the current MVP. This keeps the setup cheaper and simpler while the product is still taking shape. Email notifications can be added later with Cloud Functions or a low-cost transactional email provider.

## Launch Admin Workflow

The protected admin dashboard is available at `/admin`.

Detailed setup steps live in `docs/admin-launch-setup.md`.

It supports:

- reviewing self-reported price submissions
- marking contact messages as handled or archived
- creating/updating/deleting county-level price ranges
- creating/updating/deleting dentist profiles
- writing audit log records for admin actions

Access requires:

- Firebase Email/Password Auth enabled
- a signed-in Firebase user
- Firebase custom claim `admin: true`

The public site reads only `published` records from `priceRanges` and `dentistProfiles`. If no published `priceRanges` exist yet, the homepage falls back to the current seed table in `src/content.ts`.

## Collections

### `priceReports`

Created by the self-reporting page. Public visitors can create records. Only admins can read, update, or delete them.

Important fields:

- `state`: currently `Florida`
- `county`
- `providerName`
- `procedurePrices`: map of procedure keys to numeric submitted prices
- `notes`
- `source`: `self-reporting-form`
- `status`: `pending`, later reviewed by admin
- `schemaVersion`: `1`
- `createdAt`, `updatedAt`

### `contactMessages`

Created by contact, advertising, and practice-promotion forms. Public visitors can create records. Only admins can read, update, or delete them.

Important fields:

- `name`
- `email`
- `message`
- `topic`: `general`, `correction`, `advertising`, or `practice-promotion`
- `source`: `contact-form`, `advertising-page`, or `practice-promotion-page`
- `status`: `pending`
- `schemaVersion`: `1`
- `createdAt`, `updatedAt`

### `priceRanges`

Source of truth for public price guide rows. Public visitors can only read records with `status == "published"`. Admins manage these through `/admin`.

Recommended document id:

```text
florida-{county-slug}-{procedureKey}
```

Important fields:

- `state`: currently `Florida`
- `county`
- `procedure`: one of the internal procedure keys from `src/content.ts`
- `low`, `high`
- `currency`: `USD`
- `rating`: optional county/practice context rating
- `status`: `draft`, `published`, or `archived`
- `sourceSummary`
- `schemaVersion`: `1`
- `createdAt`, `updatedAt`, `publishedAt`

### `dentistProfiles`

Source of truth for dentist/practice discovery. Public visitors can only read records with `status == "published"`. Admins manage these through `/admin`.

Important fields:

- `practiceName`
- `slug`
- `state`: currently `Florida`
- `county`
- `city`, `address`, `zipCode`
- `websiteUrl`, `phone`, `email`
- `services`: procedure keys from `src/content.ts`
- `notes`: internal admin notes
- `status`: `draft`, `published`, or `archived`
- `schemaVersion`: `1`

### `auditLogs`

Admin-only collection for review, publish, and delete actions.

### `userProfiles`

Created or updated when a user signs in. A signed-in user can read/update only their own profile. Admins can read all profiles.

Important fields:

- `uid`
- `email`
- `displayName`
- `isAdmin`
- `lastSignedInAt`
- `updatedAt`
- `schemaVersion`: `1`

Subcollections:

- `savedOperations`: signed-in users can save treatment/county research items for their own account center.

## Storage Paths

### `practice-assets/{practiceId}/{fileName}`

Publicly readable images for future practice profiles. Admin write only.

### `guide-assets/{fileName}`

Publicly readable guide images. Admin write only.

### `private-review/{...}`

Admin-only review files.

## Admin Access

Admin access expects a Firebase Auth custom claim:

```json
{
  "admin": true
}
```

Set this later using Firebase Admin SDK or a trusted admin script. Do not expose admin claim management in the public app.

Email/password sign-in must be enabled in Firebase Authentication before the sign-in form can authenticate real users.

## Deploy Rules

```bash
firebase deploy --project dentaworth --only firestore,storage
```

## Current Form Writes

- `/self-reporting` writes to `priceReports`
- `/contact` writes to `contactMessages`
- `/advertise-with-us` writes to `contactMessages`
- `/promote-your-practice` writes to `contactMessages`
- `/account` writes profile updates to `userProfiles/{uid}` and saved operations to `userProfiles/{uid}/savedOperations`
- `/admin` writes to `priceRanges`, `dentistProfiles`, review metadata on `priceReports` and `contactMessages`, and `auditLogs`

## Launch Data Entry Checklist

Before launch:

1. Create the owner/admin account in Firebase Auth.
2. Set the admin custom claim on that user.
3. Sign in at `/sign-in`, then open `/admin`.
4. Enter reviewed `priceRanges` for each county/procedure that should appear publicly.
5. Set only launch-ready price ranges to `published`.
6. Enter dentist profiles as `draft`.
7. Publish only profiles that have owner-approved contact details.
8. Submit a test self-reporting form and contact form.
9. Confirm both appear in `/admin` review queue.
10. Confirm approving/archiving writes audit logs.
