# Dentaworth Project Notes

Dentaworth is currently a Florida dental ratings and cost guide, with county-level cash price range estimates for common dental procedures and a self-reporting flow for submitted pricing. It may expand later into broader dental operations marketplace features, but the launch frontend is cost-guide-first.

The project was originally started on Wix and is being moved to a GitHub-backed codebase with Firebase hosting/services.

## Working Assumptions

- Keep costs low and prefer free-tier-friendly architecture.
- Favor straightforward, maintainable backend decisions over overbuilt infrastructure.
- The user is learning development and may want simple explanations of technical tradeoffs.
- Use GitHub for version control and Firebase for deployment/services unless the project direction changes.

## Current Architecture

- The active app is a React + Vite + TypeScript frontend.
- Firebase is intended to provide Hosting, Firestore, Auth, and Storage.
- Firebase project id is `dentaworth`.
- Firebase web app id is `1:361083559500:web:8d35d11dea90d120e95ee9`.
- The Wix export has been preserved under `legacy-wix/` for reference.
- Firebase Hosting is deployed at `https://dentaworth.web.app`.
- Firestore rules have been deployed.
- Storage rules have been deployed.
- Launch frontend pages are: cost guide, get care now, find a dentist, self reporting, about, advertise with us, promote your practice, privacy policy, contact, sign in, and 404.
- The public header is Healthgrades-inspired: hamburger drawer on the left, logo, treatment/location search in the middle, and sign-in/find-care actions on the right.
- The owner notes specify a bottom disclaimer, treatment/state/county search controls, capitalized Dentaworth in public copy, back buttons on secondary pages, and a security reassurance on the self-reporting page.
- Backend docs live in `docs/backend.md`.
- Public form writes currently go to Firestore collections `priceReports` and `contactMessages`; sign-in writes/reads `userProfiles/{uid}` for the signed-in user.
- `/account` is the signed-in account center. It supports profile display-name updates and saved operations under `userProfiles/{uid}/savedOperations`.
- `/admin` is the Firebase-admin-only dashboard for reviewing submissions and managing launch `priceRanges` and `dentistProfiles`.
- The homepage reads published Firestore `priceRanges` when available, with `src/content.ts` county rows as the fallback seed display.
- The Find a Dentist page reads published Firestore `dentistProfiles` when available.
- Email/password sign-in is wired on `/sign-in`; Firebase Authentication must have the Email/Password provider enabled before real users can sign in. Private review/admin access still expects Firebase Auth custom claim `admin: true`.
- The homepage hero uses a local generated image at `public/images/dentaworth-hero.png`; keep it project-local so visual QA does not depend on remote stock image loading.

## Notes For Future Agents

- Do not try to deploy the old Wix/Velo code directly to Firebase Hosting.
- Use `.env.example` as the shape for frontend Firebase SDK config, and keep real `.env` files out of git.
- Treat the visible county pricing table data as seed/frontend content until the backend schema is implemented.
- Self-reporting, contact, advertise, and promote-practice forms save to Firestore. They do not send email yet.
