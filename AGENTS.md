# DentaWorth Project Notes

DentaWorth is currently a Florida dental cost guide, with county-level cash price range estimates for common dental procedures and a self-reporting flow for submitted pricing. It may expand later into broader dental operations marketplace features, but the launch frontend is cost-guide-first.

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
- The owner notes specify a bottom disclaimer, treatment/state/county search controls, capitalized DentaWorth in public copy, back buttons on secondary pages, and a security reassurance on the self-reporting page.
- Backend docs live in `docs/backend.md`.
- Public form writes currently go to Firestore collections `priceReports` and `contactMessages`; sign-in writes/reads `userProfiles/{uid}` for the signed-in user.
- `/account` is the signed-in account center. It supports profile display-name updates and saved operations under `userProfiles/{uid}/savedOperations`.
- `/admin` is the Firebase-admin-only dashboard for reviewing submissions and managing launch `priceRanges` and `dentistProfiles`.
- The homepage reads published Firestore `priceRanges` when available, with `src/content.ts` county rows as the fallback seed display.
- The Find a Dentist page reads published Firestore `dentistProfiles` when available.
- Email/password sign-in is wired on `/sign-in`; Firebase Authentication must have the Email/Password provider enabled before real users can sign in. Private review/admin access still expects Firebase Auth custom claim `admin: true`.
- `/sign-in` and `/provider-login` both render the shared `AuthGatewayPage`: a centered card (no photo) on paper. Choosing Provider wipes a navy panel across the screen, Patient wipes it back. Provider login starts with Provider selected, while patient sign-in starts with Patient selected.
- The homepage hero plays the local video at `public/videos/dentaworth-hero.mp4` as a full-bleed background faded to navy from the left, with `/images/dentaworth-hero.webp` as its poster (no stat cards, no pause button, per Kevin). It scrolls normally; Kevin rejected a pinned scroll-zoom version. Its motion is in-place: a slow settle on load, the video drifting slower than the page on scroll, pointer-driven depth on desktop, and a scroll cue. Keep hero media project-local so visual QA does not depend on remote stock image loading.
- `/dev/loading-preview` previews the real DentaWorth loading animation. Use it to inspect/replay the loader instead of trying to catch the initial app load timing.
- The homepage procedure content is presented as the `Search → Compare → Find your fit` journey rail; the "Smiles are what we see first" section is a pinned scroll story (`src/components/SmileStory.tsx`) that falls back to a static layout on phones and for reduced motion.
- The public site uses the Editorial typography direction: serif display headlines (Source Serif 4, falling back to Georgia) with Inter body text and IBM Plex Mono labels, loaded from Google Fonts in `index.html`. The Help Center bottom CTA routes to `/contact`.
- The homepage compare section is intentionally image-free; avoid reintroducing the old procedure photo background.
- `/privacy-policy` contains the approved DentaWorth privacy policy effective June 27, 2026, including the contact address `privacy@dentaworth.com`; do not replace it with placeholder copy.

## Notes For Future Agents

- Do not try to deploy the old Wix/Velo code directly to Firebase Hosting.
- Use `.env.example` as the shape for frontend Firebase SDK config, and keep real `.env` files out of git.
- Treat the visible county pricing table data as seed/frontend content until the backend schema is implemented.
- Self-reporting, contact, advertise, and promote-practice forms save to Firestore. They do not send email yet.
- Footer newsletter signups save to `newsletterSubscribers` and are visible in the protected `/admin` Newsletter tab.
- Email notifications should use Resend when implemented later.
- Public Firestore form submissions include `submissionGuard` with a hidden honeypot and form-start timestamp. Firestore rules require an empty `website` field and at least 3 seconds between form render and submit.
- A local admin-claim helper exists: `bun run admin:claim USER_UID_HERE`. It uses Firebase CLI login by default and can also use `GOOGLE_APPLICATION_CREDENTIALS` with a service account JSON kept outside the repo.
- Interior pages intentionally use differentiated layout systems (`care-playbook`, `dentist-radar`, `report-layout`, `ad-layout`, `provider-stage`, `help-hub`, `drugs-lookup`), styled in `src/styles/pages.css` from the shared patterns in `src/styles/interior.css`. Preserve that separation instead of collapsing every secondary page back into one shared card layout.

## Design System (Oct 2026 redesign)

- Styles live in `src/styles/` (imported in order by `src/styles/index.css`): `tokens.css` (brand colors, type scale, spacing, motion timings, and the `.tone-dark` / `.tone-light` semantic palettes), `base.css`, `motion.css`, `components.css`, `chrome.css` (header, drawer, footer, loader), `home.css`, `interior.css`, `pages.css`, `auth.css`, `admin.css`. Add new values as tokens instead of hard-coding colors, and avoid `!important`.
- Brand palette is unchanged: navy `#0b2c63` ("Denta"), sky `#2f8fd6` ("Worth"), warm paper `#f7f5ef`. Pages alternate navy and paper sections; every route with the public header starts with a navy hero marked `data-hero`. The header is always visible (it never hides on scroll): transparent at the very top, a navy bar while still over the hero, a paper bar everywhere else.
- Motion is driven by `src/motion/`: add `data-reveal="up" | "fade" | "media" | "line" | "stagger"` to an element and the shared observer in `motion.ts` plays its entrance once. `MaskHeading` gives a heading the accent-block line reveal (use it for page titles and at most one or two key headings per page, not every h2). `useScrollProgress` writes scroll progress to CSS variables (hero depth, journey rail, smile story, mission statement). Framed photos can opt into `data-parallax`. Other primitives: `CountUp`, `useFocusBand` (dims list rows outside the reading zone), `ReadingProgress`.
- Never gate the results of a user action (search results, form feedback) behind a scroll entrance; animate them on mount instead (see the Drugs A-Z results).
- Motion is progressive enhancement: hidden pre-states only apply under `html.motion-ok`, which `index.html` sets before paint and `motion.ts` removes for `prefers-reduced-motion`. Reduced-motion visitors skip the intro loader, see no cycling text, and get a paused hero video.
- Do not add small uppercase "eyebrow" labels above headings anywhere; Kevin had them all removed. Put real counts in a `.count-badge` beside the heading instead.
- Every local photo in `public/images` has an optimized `.webp` sibling (max 1600px wide). Content keeps referencing the original paths; render through `toWebp()` from `src/media.ts`. When adding a new photo, generate its `.webp` with `cwebp -q 78 -resize 1600 0`.
