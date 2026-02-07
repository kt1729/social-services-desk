## Context

This is a greenfield React SPA for community service desk volunteers (3-5 concurrent users) who manage local resources, guest profiles, and multilingual documents. The system replaces paper binders and spreadsheets with a real-time, shared web application. Key constraints: zero budget (Firebase free tier only), multi-language guest-facing content (en/es/zh/ht) with English-only volunteer UI, and print-first output for guests.

The existing repository contains a movie discovery app (meatloafkitchen) that will be fully replaced with the Social Service Desk application.

## Goals / Non-Goals

**Goals:**

- Real-time collaboration across 3-5 volunteer desks via Firestore listeners
- Full CRUD for resources, guests, and documents with category-based organization
- Multi-language content fields (en/es/zh/ht) on resources and documents, manually entered by volunteers
- Print-friendly output cards in guest's preferred language with QR code support
- Firebase Authentication with volunteer/admin roles
- File uploads (PDF, images) with per-language versions stored in Firebase Storage
- Cross-collection global search
- Translation completeness tracking dashboard
- Zero-cost deployment on Firebase Spark plan

**Non-Goals:**

- Auto-translation (no Google Translate API — volunteers enter translations manually)
- Offline mode (Phase 2)
- Analytics dashboard (Phase 2)
- CSV export (Phase 2)
- Guest self-service portal (volunteers operate on behalf of guests)
- Mobile-native app (responsive web only)
- Multi-tenant / multi-organization support

## Decisions

### 1. React with Vite (not Create React App)

CRA is deprecated. Vite provides faster dev builds, HMR, and a simpler config. The existing project uses CRA with `config-overrides.js` but we're replacing the entire codebase.

**Alternatives considered:**

- **Next.js**: SSR/SSG unnecessary for an authenticated internal tool; adds complexity
- **CRA**: Deprecated, slow builds, no active maintenance

### 2. Firebase SDK v9+ modular imports

Use tree-shakeable modular imports (`import { getFirestore } from 'firebase/firestore'`) to minimize bundle size. The app only needs Auth, Firestore, Storage, and Hosting.

**Alternatives considered:**

- **Firebase v8 compat**: Larger bundle, being phased out
- **REST API directly**: Loses real-time listener support, more boilerplate

### 3. Firestore data model — flat collections with ID references

Six top-level collections: `resources`, `guests`, `documents`, `feedback`, `notes`, `volunteers`. Cross-references via ID arrays (e.g., `linkedDocuments: string[]` on resources, `resourcesReferred: string[]` on guest visits).

**Alternatives considered:**

- **Subcollections**: Would require collection group queries for cross-entity search; harder to manage references
- **Single collection with type discriminator**: Loses Firestore security rule granularity per entity type

### 4. Client-side search over Firestore queries

Firestore doesn't support full-text search natively. Strategy: load collection data into memory on initial page load (small dataset for a service desk), then filter client-side using a search utility. Collections are small enough (hundreds of records, not thousands) to fit in memory.

**Alternatives considered:**

- **Algolia/Typesense**: Adds cost and external dependency, violates zero-budget constraint
- **Firestore compound queries**: Limited to exact matches and range queries; can't search across multilingual text fields effectively

### 5. Translation as nested objects on documents

Translatable fields use `{ en: "...", es: "...", zh: "...", ht: "..." }` objects directly on the document. A `translationStatus` field tracks completeness per language.

**Alternatives considered:**

- **Separate translations collection**: More queries per render, harder to keep in sync
- **Locale-prefixed fields** (`name_en`, `name_es`): Doesn't scale, harder to iterate over languages programmatically

### 6. CSS @media print for print layouts

Use CSS `@media print` rules to hide UI chrome and render clean print cards. No server-side PDF generation needed — the browser's native print dialog handles it.

**Alternatives considered:**

- **jsPDF / Puppeteer**: Server-side PDF generation adds infrastructure and cost
- **React-to-print library**: Adds a dependency for something CSS handles natively

### 7. QR codes generated client-side with qrcode.js

Generate QR codes in the browser for website links on print cards. No API calls needed.

**Alternatives considered:**

- **QR code API services**: Adds external dependency and potential rate limits
- **Server-side generation**: Unnecessary complexity for a client-rendered app

### 8. Project structure — feature-based modules

Organize by feature domain, not by file type:

```
src/
├── app/                    # App shell, routing, providers
├── features/
│   ├── auth/               # Login, auth context, protected route
│   ├── resources/          # Resource CRUD, cards, forms
│   ├── guests/             # Guest profiles, visit log
│   ├── documents/          # Document library, upload, preview
│   ├── search/             # Global search bar and results
│   ├── notes/              # Notes system
│   ├── translation/        # Translation dashboard
│   └── print/              # Print layouts, language selector
├── shared/
│   ├── components/         # Reusable UI (buttons, modals, forms)
│   ├── hooks/              # Shared hooks (useFirestore, useAuth)
│   ├── lib/                # Firebase config, constants, categories
│   └── types/              # Shared TypeScript types
└── main.tsx
```

**Alternatives considered:**

- **FSD (Feature-Sliced Design)**: The existing project used this but it's over-engineered for a small team; feature-based is simpler
- **File-type grouping** (`components/`, `hooks/`, `services/`): Scatters related code across directories

### 9. UI component approach — Tailwind CSS + headless components

Use Tailwind CSS for styling (fast to build, consistent, small bundle with purging) and a lightweight headless component library (Headless UI or Radix) for accessible dropdowns, modals, and tabs.

**Alternatives considered:**

- **Material UI / Ant Design**: Heavy bundle, opinionated styling that's hard to customize for print
- **Plain CSS modules**: Slower to develop, more maintenance
- **Styled-components**: Runtime CSS-in-JS adds overhead

### 10. State management — React Context + Firestore listeners

Each feature module sets up Firestore `onSnapshot()` listeners in a context provider. No external state library needed — Firestore is the source of truth and pushes updates to all clients.

**Alternatives considered:**

- **Redux / Zustand**: Adds a caching layer that duplicates Firestore's real-time state
- **React Query / TanStack Query**: Designed for request/response, not real-time listeners

### 11. Routing — React Router v6

Standard client-side routing with protected route wrapper that checks Firebase Auth state.

Routes:

- `/login` — public
- `/` — dashboard/resources (default tab)
- `/resources/:id` — resource detail
- `/guests` — guest list
- `/guests/:id` — guest detail
- `/documents` — document library
- `/documents/:id` — document detail
- `/notes` — notes view
- `/translation` — translation dashboard

### 12. Deployment — Firebase Hosting + GitHub Actions

Deploy via `firebase deploy` from a GitHub Actions workflow on push to `main`. Firebase Hosting provides free HTTPS and CDN.

## Risks / Trade-offs

**Client-side search won't scale past ~1000 records** → Acceptable for a service desk with hundreds of resources. If growth exceeds this, migrate to Algolia (free community tier available).

**No offline support** → Volunteers need internet at all desks. Firestore has built-in offline persistence that can be enabled later (Phase 2) with minimal code changes.

**Manual translations are labor-intensive** → Volunteers must enter translations by hand. The translation dashboard helps prioritize what's missing. Auto-translate can be added in Phase 2.

**Firebase free tier has hard limits** → 50K reads/day is generous for 5 volunteers, but a runaway `onSnapshot()` listener bug could burn through reads. Mitigation: use targeted listeners (per-collection, not global), and monitor usage in Firebase Console.

**Guest data privacy** → Guest profiles contain sensitive info (needs, visit history). Mitigation: Firebase Auth gates all access, Firestore rules enforce authentication, and guest records use first name + last initial only (no full names, no SSN, no addresses).

**Single Firebase project = single point of failure** → If Firebase has an outage, the app is down. Acceptable risk for a free-tier community tool.

**Chinese font adds ~2MB to initial load** → Noto Sans SC is loaded from Google Fonts CDN and only needed for print/display in Chinese. Use `display=swap` to prevent blocking render.
