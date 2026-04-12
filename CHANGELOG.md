# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.3.5] - 2026-02-08

### Added

- **Local Dev Mode**: Run the app without Firebase/Supabase credentials using `VITE_LOCAL_MODE=true`

### Changed

- **Public UI**: Use `VITE_PUBLIC_LOGO_URL` for branding assets and remove bundled logo asset

## [1.3.4] - 2026-02-08

### Changed

- **Public QR**: Hide the QR icon on mobile and keep QR access via header popover
- **Public Document Preview**: Add “View Document” link to open previews in a new tab

## [1.3.3] - 2026-02-08

### Changed

- **Public QR**: Replace inline QR section with a header QR icon and popover
- **Public Footer**: Update footer copy to “Crafted with NYC spirit”

## [1.3.2] - 2026-02-08

### Changed

- **Public QR**: Hide the QR code on mobile viewports and embed the logo in the desktop QR code

## [1.3.1] - 2026-02-08

### Added

- **Public Search**: Search bar on the public portal that filters resources and documents

### Changed

- **Public Header**: Removed public navigation and volunteer login links to avoid auth-only routes

## [1.3.0] - 2026-02-08

### Added

- **Public Portal**: Public read-only routes at `/public`, `/public/resources/:id`, `/public/documents/:id`
- **Public Layout**: Logo, language selector, and navigation between public resources/documents
- **Public Home**: Combined resources/documents view with category tabs and printable QR code
- **Public Detail Pages**: Read-only resource and document detail views with linked items
- **Public Data Provider**: Unauthenticated Firestore `onSnapshot` loading for resources/documents with error handling

### Changed

- **Firestore Rules**: Public read access for `resources` and `documents` collections
- **Print Styling**: Explicit print helper classes for hiding UI chrome and showing print-only content

## [1.2.0] - 2026-02-08

### Changed

- **Storage Backend**: Replaced Firebase Storage (requires Blaze plan) with Supabase Storage (1GB free, no credit card)
- **Storage Abstraction**: New `storageService.ts` with `uploadFile`, `getFileUrl`, `deleteFile` — swappable back to Firebase in minutes
- **Signed URLs**: Firestore now stores logical paths instead of permanent URLs; signed URLs (1hr expiry) resolved at render time
- **Storage Path Structure**: Files organized as `<category>/<lang>/<docId>/<filename>` for easier browsing in Supabase dashboard
- **CI/CD**: Added `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to deploy workflow

### Fixed

- **Search Navigation**: Clicking a search result no longer bounces back to the search page — debounced navigate was re-firing on route change because SearchBar stays mounted in Header
- **Search Input Clear**: Search bar now clears when navigating away from `/search`

### Removed

- **Firebase Storage**: Removed `getStorage` import and `storage` export from `firebase.ts`

## [1.1.0] - 2026-02-08

### Added

- **Shared UI Components**: TextInput, TextArea, Select, FileUpload (10MB validation), Card, Tabs, TranslationTabs
- **Document Library**: Full CRUD with DocumentCard, DocumentList, DocumentDetail, DocumentForm
- **Document Types**: PDF, Link, Internal, Image with per-language file uploads to Firebase Storage
- **Document Preview**: Inline PDF viewer, image display, external link, internal content render
- **Document-Resource Linking**: Bidirectional linking with search picker
- **Header "+ New" Dropdown**: Quick-create menu for Resources, Guests, and Documents
- **Sidebar View Toggles**: All/Recent filtering across Resources, Guests, and Documents
- **Debounced Search**: 300ms debounce on SearchBar with URL param initialization
- **Translation Sidebar Widget**: Per-language completion percentages with color-coded indicators
- **Print CSS**: @media print rules to hide UI chrome, print-specific layout styles
- **Print Documents**: Language selector modal + PrintDocumentCard for document printing
- **CI/CD Pipeline**: GitHub Actions workflow — lint, test, build, deploy to Firebase Hosting
- **Storage Security Rules**: Auth-gated with 10MB max file size enforcement
- **Test Coverage**: 80 new tests across 11 test files (129 total), covering all new components

### Changed

- **Firestore Rules**: Per-collection rules with admin-only deletes for resources and documents
- **ResourceList/GuestList/DocumentList**: Added viewMode (All/Recent) filtering via outlet context
- **Layout**: Passes viewMode and selectedCategory to child routes via React Router outlet context

## [1.0.0] - 2026-02-07

### Added

- **Project Setup**: Vite + React 19 + TypeScript + Tailwind CSS v4 scaffold
- **Firebase Integration**: Auth, Firestore, Storage, Hosting configuration
- **Dependencies**: firebase, react-router-dom, tailwindcss, @headlessui/react, qrcode.react
- **Google Fonts**: Noto Sans SC for Chinese character support
- **Shared Types**: Resource, Guest, ServiceDocument, Feedback, Note, Volunteer types
- **Language System**: 4-language support (en, es, zh, ht) with constants, labels, NonEnLanguageCode
- **Category System**: 10 categories with 4-language translations and icons
- **Translation Utils**: computeTranslationStatus, computeAllTranslationStatuses, getTranslatedText
- **Print Headers**: Translated print header constants for all 4 languages
- **Authentication**: Email/password login with AuthProvider, useAuth hook, ProtectedRoute
- **Login Page**: Email/password form with error handling and post-login redirect
- **Volunteer Profiles**: Firestore read on auth to fetch role from volunteers/{uid}
- **Pre-commit Hooks**: Husky + lint-staged with ESLint + Prettier
- **Test Suite**: Vitest with 49 tests (translationUtils, categories, languages, TagInput, CategoryBadge, LoginPage)
- **Code Quality**: ESLint flat config, eslint-config-prettier, TypeScript strict mode
- **Firestore Rules**: Basic auth-gated read/write access
- **Firebase Hosting**: firebase.json with SPA rewrite config
