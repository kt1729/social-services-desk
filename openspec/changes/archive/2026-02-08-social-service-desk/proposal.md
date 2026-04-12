## Why

Community service desks with 3-5 volunteers need a shared, real-time system to manage local resources (shelters, food banks, clinics), track guest interactions, and distribute multilingual print materials — all at zero cost. Currently volunteers rely on paper binders and spreadsheets that go stale, can't be shared across desks simultaneously, and don't support non-English-speaking guests.

## What Changes

- **New React SPA** hosted on Firebase Hosting with Firebase Auth (email/password) for volunteer access
- **Resource management** — CRUD for community resources (housing, food, medical, etc.) with category filtering, tagging, search, and volunteer feedback (upvote/downvote)
- **Guest profiles** — track visitors by first name + last initial, preferred language, needs, visit history, and notes (privacy-aware, no full names)
- **Document library** — upload PDFs/images, link external URLs, write internal docs; attach documents to resources; per-language file versions
- **Multi-language content** — resources, documents, and print cards support English, Spanish, Mandarin, and Haitian Creole; volunteer UI stays English-only
- **Print system** — `@media print` CSS generates clean resource cards, document cards with QR codes, and guest summaries in the guest's preferred language
- **Real-time sync** — Firestore `onSnapshot()` listeners so all desks see changes within 1-2 seconds
- **Global search** — cross-collection search across resources, documents, and guests
- **Translation dashboard** — track translation completeness (complete/partial/missing) per resource and document per language
- **Notes system** — timestamped quick notes attachable to any resource, guest, or document
- **GitHub repository** for source code and CI/CD
- **Firebase Hosting** deployment for production

## Capabilities

### New Capabilities

- `firebase-auth`: Volunteer authentication via Firebase email/password, role-based access (volunteer/admin), protected routes
- `resource-management`: CRUD for community resources with categories, tags, address/phone/hours, multilingual name/description/notes, feedback, and linked documents
- `guest-profiles`: Guest profile CRUD with first name + last initial, preferred language, needs tracking, visit log timeline, notes, and referred resources/documents
- `document-library`: Document management supporting PDF upload, image upload, external links, and internal docs; per-language file versions via Firebase Storage; linked resources; print settings and QR code generation
- `multi-language`: Translation infrastructure for 4 languages (en/es/zh/ht), static category translations in code, translatable content fields on resources/documents, translation status tracking dashboard
- `print-system`: Print-friendly layouts for resource cards, document cards with QR codes, and guest summaries; language selector before print; CSS `@media print` approach
- `global-search`: Cross-collection search across resources, documents, and guests by name, description, category, tags, and needs
- `real-time-sync`: Firestore real-time listeners for instant updates across all connected volunteer desks
- `notes-system`: Standalone and attached quick notes on resources, guests, documents, or general; timestamped with volunteer attribution

### Modified Capabilities

<!-- None — greenfield project, no existing specs -->

## Impact

- **New codebase**: Entire React SPA built from scratch (replaces previous frontend content)
- **Dependencies**: React, Firebase SDK (Auth, Firestore, Storage, Hosting), qrcode.js, Google Fonts (Noto Sans SC for Chinese)
- **Infrastructure**: Firebase project required (free Spark plan) — Firestore, Storage, Auth, Hosting
- **Security rules**: Firestore and Storage security rules needed (auth-gated, admin-only deletes)
- **Hosting**: Firebase Hosting (free tier HTTPS) + GitHub repository for source
- **Free tier limits**: Well within bounds — 50K reads/day, 20K writes/day, 5GB storage, 10GB transfer/month
