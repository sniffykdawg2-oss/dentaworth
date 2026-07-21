# Dentaworth Backend

Dentaworth uses Firebase for the launch backend:

- Firebase Hosting serves the Vite app.
- Cloud Firestore stores submitted pricing reports, contact/inquiry messages, future price ranges, and future dentist profiles.
- Firebase Storage stores public practice/guide assets and private review files.
- Firebase Auth is reserved for admin access using a custom `admin: true` claim.

No Cloud Functions are required for the current MVP. This keeps the setup cheaper and simpler while the product is still taking shape.

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

Future source of truth for public price guide rows. Public visitors can only read records with `status == "published"`.

### `dentistProfiles`

Future source of truth for dentist/practice discovery. Public visitors can only read records with `status == "published"`.

### `auditLogs`

Admin-only collection for future review actions.

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

## Deploy Rules

```bash
firebase deploy --project dentaworth --only firestore,storage
```

## Current Form Writes

- `/self-reporting` writes to `priceReports`
- `/contact` writes to `contactMessages`
- `/advertise-with-us` writes to `contactMessages`
- `/promote-your-practice` writes to `contactMessages`
