## Why

The public portal (`/public`) has no visibility into how guests use it — page views, popular resources, and drop-off points are unknown. Adding Google Analytics 4 gives the volunteer team actionable usage data so they can prioritize which resources to keep up-to-date and improve the guest experience.

## What Changes

- Add the GA4 script tag (via `gtag.js`) to the app's `index.html` or inject it only on public routes via a React component.
- Track page views automatically as guests navigate between public routes (`/public`, `/public/resources/:id`, `/public/documents/:id`).
- Expose the GA Measurement ID as a `VITE_GA_MEASUREMENT_ID` environment variable so it stays out of source control and can differ across environments.
- Analytics is **opt-in at deploy time**: if `VITE_GA_MEASUREMENT_ID` is not set, no tracking script is loaded.

## Capabilities

### New Capabilities

- `google-analytics`: Client-side GA4 integration scoped to public portal routes — page-view tracking, measurement ID from env var, no-op when ID is absent.

### Modified Capabilities

- `public-portal`: Public layout gains passive analytics tracking (no UI change; no new user-facing requirement). This is an implementation addition, not a requirement change — no delta spec needed.

## Impact

- **New file**: `src/features/public/GoogleAnalytics.tsx` — renders `<script>` tags only when measurement ID env var is set.
- **Modified**: `src/features/public/PublicLayout.tsx` (or equivalent shell) — mounts the `<GoogleAnalytics>` component.
- **Modified**: `.env.example` — documents `VITE_GA_MEASUREMENT_ID`.
- **No backend / Firestore changes.**
- **No new dependencies** — GA4 loads via CDN script tag, no npm package needed.
- **Privacy**: GA4 collects anonymized page-view data; no PII from the app is sent. No cookie banner is required for basic analytics under the current scope.
