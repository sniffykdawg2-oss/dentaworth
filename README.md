# Dentaworth

Dentaworth is a dental operations marketplace starting in Florida. The app is being migrated away from Wix into a GitHub + Firebase setup.

## Stack

- React
- TypeScript
- Vite
- Firebase Hosting
- Firebase Firestore
- Firebase Auth
- Firebase Storage

The old Wix/Velo export is kept in `legacy-wix/` as reference material only.

## Local Development

Install dependencies:

```bash
bun install
```

Start the dev server:

```bash
bun run dev
```

Build the app:

```bash
bun run build
```

Lint the app:

```bash
bun run lint
```

## Firebase

The Firebase project id is configured as `dentaworth` in `.firebaserc`.

Copy `.env.example` to `.env.local` and fill in the Firebase web app config values from the Firebase console before using live Firebase services in the browser.
