## Context

The public portal (`/public`) is a read-only SPA served via Firebase Hosting. It has no analytics today. We want to add GA4 page-view tracking so the volunteer team can see which resources and documents guests view most. The integration must be lightweight (no npm package), environment-driven (ID in env var), and must not load any tracking script when the measurement ID is absent (dev / CI environments).

The app is built with Vite + React 19. All public routes are rendered inside a shared `PublicLayout` component, making it a natural mount point for the analytics component.

## Goals / Non-Goals

**Goals:**
- Track page views for all three public routes: `/public`, `/public/resources/:id`, `/public/documents/:id`.
- Load GA4 script only when `VITE_GA_MEASUREMENT_ID` is set at build time.
- Zero npm packages — GA4 loads via its own CDN script.
- No UI changes visible to guests.

**Non-Goals:**
- Custom events (clicks, resource impressions) — out of scope for this change.
- Cookie consent / GDPR banner — deferred; no PII is collected by basic page-view tracking.
- Analytics for authenticated volunteer routes — only the `/public` subtree.
- Server-side or Measurement Protocol hits.

## Decisions

### 1. React component (`<GoogleAnalytics>`) vs. direct `index.html` injection

**Decision**: React component mounted inside `PublicLayout`.

**Rationale**: Injecting directly into `index.html` would load GA on every route — including the authenticated volunteer app — which is out of scope. A component mounted only inside `PublicLayout` keeps tracking strictly scoped to public routes and makes it easy to remove or extend later.

**Alternative considered**: Vite plugin (`vite-plugin-html`) to inject the script conditionally — adds a dev dependency and complexity for minimal gain.

### 2. SPA page-view tracking strategy

**Decision**: Use `react-router` `useLocation` hook inside `<GoogleAnalytics>` with a `useEffect` that fires `gtag('event', 'page_view', ...)` on every location change.

**Rationale**: GA4's `gtag.js` auto-detects the first page load, but does not fire for SPA client-side navigation. The `useLocation` effect pattern is the idiomatic, dependency-free way to track subsequent navigations.

### 3. Script loading

**Decision**: Render two `<script>` tags via React (async CDN script + inline `gtag` init) using `dangerouslySetInnerHTML` for the inline config block, with the measurement ID sourced only from `import.meta.env.VITE_GA_MEASUREMENT_ID`.

**Security note**: The inline script content is fully static — it only interpolates the env var (a string controlled by the developer, not user input), so XSS risk is nil. No user-supplied data enters the script.

**Alternative considered**: `react-helmet-async` — adds a dependency; not worth it for two static script tags.

### 4. No-op when ID is absent

**Decision**: Return `null` from `<GoogleAnalytics>` when `import.meta.env.VITE_GA_MEASUREMENT_ID` is falsy.

**Rationale**: Ensures dev/CI environments never make outbound analytics calls, and the app works correctly with no env var set.

## Risks / Trade-offs

- **Script bloat on public routes**: GA4's `gtag.js` is ~28 KB (gzip). Acceptable for a public portal; guests on slow connections see a minor delay for analytics — not for content. The script is `async` so it does not block rendering.
- **Ad blockers**: Many guests will block GA. This is expected; the team should interpret numbers as lower-bound estimates, not exact counts.
- **`dangerouslySetInnerHTML` for inline script**: Mitigated by ensuring the only interpolated value (`VITE_GA_MEASUREMENT_ID`) comes from a build-time env var, not runtime user input.

## Migration Plan

1. Add `VITE_GA_MEASUREMENT_ID=` to `.env.example` (empty default → no-op in dev).
2. Set `VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX` in Firebase Hosting environment or `.env.production`.
3. Deploy with `npm run build && firebase deploy`.
4. **Rollback**: Remove or blank the env var and redeploy — no code changes needed.

## Open Questions

- Does the volunteer team want a specific GA4 property created, or do they already have one? (Measurement ID needed before first deploy.)
- Should documents views pass the document title to GA as `page_title`? Could be added as a small enhancement in this same change if desired.
