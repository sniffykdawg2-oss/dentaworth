# Dentaworth Project Notes

Dentaworth is a marketplace-style website for dental operations in Florida, with plans to expand geographically. Think Craigslist-style listings, but focused on dental practice opportunities, operations, equipment, services, or related dental business needs.

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
- Storage deploy was blocked by missing permission `firebasestorage.defaultBucket.get` / default bucket access. Enable Firebase Storage in the console or grant a role that can manage the default bucket before deploying storage rules.

## Notes For Future Agents

- Do not try to deploy the old Wix/Velo code directly to Firebase Hosting.
- Use `.env.example` as the shape for frontend Firebase SDK config, and keep real `.env` files out of git.
- Firestore listing documents are expected to include a `status` field; public reads are intended for `status == "published"`.
