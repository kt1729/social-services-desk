## Why

Guests currently can't browse resources or documents without a volunteer login. A public read-only portal lets guests access information directly from their phone — no account needed. A permanent QR code can be printed and posted for easy access. The organization's webp logo should brand the public pages.

## What Changes

- Add public routes (`/public/resources`, `/public/documents`, detail pages) outside the auth gate
- Create a `PublicDataProvider` that loads resources and documents without authentication
- Create read-only list and detail components for the public portal (no edit/delete/notes/feedback)
- Add a public layout with the organization's logo, language selector, and navigation
- Generate a permanent QR code linking to the public portal root
- Update Firestore rules to allow unauthenticated reads on `resources` and `documents` collections
- Add the webp logo to the project assets

## Capabilities

### New Capabilities

- `public-portal`: Read-only public-facing pages for resources and documents with QR code access and multi-language support
- `public-data-provider`: Unauthenticated Firestore data loading for resources and documents

### Modified Capabilities

- `firestore-rules`: Allow public read access on resources and documents collections

## Impact

- `src/app/App.tsx` — new public routes outside ProtectedRoute
- `src/features/public/` — new feature module for public portal components
- `src/app/PublicDataProvider.tsx` — new data provider without auth dependency
- `firestore.rules` — public read access for resources and documents
- `public/` — logo asset
