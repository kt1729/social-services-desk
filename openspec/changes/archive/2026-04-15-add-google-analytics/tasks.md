## 1. Environment Setup

- [x] 1.1 Add `VITE_GA_MEASUREMENT_ID=` (empty) to `.env.example` with a comment explaining where to get the value
- [x] 1.2 Verify `.env.local` (or `.env`) is in `.gitignore` so the real measurement ID is never committed

## 2. GoogleAnalytics Component

- [x] 2.1 Create `src/features/public/GoogleAnalytics.tsx` — renders `null` when `import.meta.env.VITE_GA_MEASUREMENT_ID` is falsy
- [x] 2.2 Add async `gtag.js` CDN `<script>` tag and inline `gtag` init config block using the measurement ID env var
- [x] 2.3 Add `useLocation` + `useEffect` hook that fires `gtag('event', 'page_view', { page_path, page_location })` on every route change
- [x] 2.4 Ensure the component only fires on mount and on location changes (correct `useEffect` dependency array)

## 3. Mount in Public Layout

- [x] 3.1 Locate the public portal layout component (`PublicLayout` or equivalent in `src/features/public/`)
- [x] 3.2 Import and mount `<GoogleAnalytics>` inside the public layout (not the authenticated layout)
- [x] 3.3 Confirm `<GoogleAnalytics>` is NOT present in any authenticated-only layout component

## 4. Verification

- [x] 4.1 Run `npm run build` and confirm no TypeScript or lint errors
- [x] 4.2 Set `VITE_GA_MEASUREMENT_ID=` (empty) in local `.env`, start dev server, open `/public` — confirm no `gtag.js` script tag in DOM
- [x] 4.3 Set a dummy `VITE_GA_MEASUREMENT_ID=G-TEST12345`, rebuild, open `/public` — confirm `gtag.js` script tag is present in DOM
- [x] 4.4 Navigate between public routes and verify `page_view` events fire in browser Network tab (requests to `google-analytics.com`)
- [x] 4.5 Navigate to an authenticated route and confirm no GA network requests from the analytics component
