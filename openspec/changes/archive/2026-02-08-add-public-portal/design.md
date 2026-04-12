## Overview

Add a public read-only portal at `/public/*` that lets guests browse resources and documents without logging in. Reuse existing card components, create stripped-down detail views, and add a branded layout with language selector and QR code.

## Route Architecture

```
App.tsx
├─ /login → LoginPage
├─ /public → PublicLayout (NO auth required)
│  ├─ /public → PublicHome (resource + document lists, QR code)
│  ├─ /public/resources/:id → PublicResourceDetail
│  └─ /public/documents/:id → PublicDocumentDetail
└─ /* → ProtectedRoute + DataProvider + Layout (auth required)
```

Public routes sit outside ProtectedRoute entirely. A `PublicDataProvider` wraps PublicLayout and loads only `resources` and `documents` collections (no auth check).

## Component Strategy

**Reuse existing components directly:**

- `ResourceCard` — already read-only
- `DocumentCard` — already read-only
- `CategoryBadge` — used in cards/detail
- `TranslationTabs` / language utilities

**Create new public-specific components:**

- `PublicLayout` — simple header (logo + language selector) + content area, no sidebar
- `PublicHome` — combined resource + document list with category filter tabs, QR code section
- `PublicResourceDetail` — resource info display without edit/delete/notes/feedback/print
- `PublicDocumentDetail` — document info display without edit/delete/notes, signed URLs for PDFs/images
- `PublicDataProvider` / `PublicDataContext` / `usePublicData` — context pattern for public data

**QR Code:**

- Use existing `qrcode.react` dependency (`QRCodeSVG`)
- Generate QR code pointing to the public portal URL (derived from `window.location.origin + '/public'`)
- Display on PublicHome and make it printable
- QR code URL is permanent (no expiry) — it's just a route, not a signed URL

## Data Flow

`PublicDataProvider` uses `onSnapshot` on `resources` and `documents` collections without requiring `user` state. Error handling for permission denied (if rules aren't updated yet).

## Files Changed

| File                                           | Action | Description                                 |
| ---------------------------------------------- | ------ | ------------------------------------------- |
| `src/app/App.tsx`                              | MODIFY | Add public routes outside ProtectedRoute    |
| `src/features/public/PublicLayout.tsx`         | CREATE | Public layout with logo + language selector |
| `src/features/public/PublicHome.tsx`           | CREATE | Combined list view with QR code             |
| `src/features/public/PublicResourceDetail.tsx` | CREATE | Read-only resource detail                   |
| `src/features/public/PublicDocumentDetail.tsx` | CREATE | Read-only document detail with signed URLs  |
| `src/features/public/PublicDataProvider.tsx`   | CREATE | Unauthenticated data provider               |
| `src/features/public/PublicDataContext.ts`     | CREATE | Context definition                          |
| `src/features/public/usePublicData.ts`         | CREATE | Context hook                                |
| `firestore.rules`                              | MODIFY | Allow public read on resources + documents  |
| `public/logo.webp`                             | CREATE | Organization logo (user provides)           |

## Risks

- **Firestore rules change**: Public read on resources/documents exposes all data in those collections. No PII should be stored in these collections.
- **Supabase signed URLs**: Public document detail needs to call `getFileUrl` which requires Supabase anon key (already public in client bundle) — this is fine.
