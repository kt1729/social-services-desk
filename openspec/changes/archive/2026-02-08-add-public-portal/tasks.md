## Tasks

### Group 1: Firestore Rules & Logo

- [x] Update `firestore.rules` to allow public read on `resources` and `documents` collections
- [x] Add the user's webp logo to `public/logo.webp` (user must provide the file)

### Group 2: Public Data Provider

- [x] Create `src/features/public/PublicDataContext.ts` — context definition with `resources` and `documents` arrays + `loading` + `error` state
- [x] Create `src/features/public/PublicDataProvider.tsx` — provider that uses `onSnapshot` on resources and documents without auth dependency, with error handling
- [x] Create `src/features/public/usePublicData.ts` — context hook

### Group 3: Public Layout & Home

- [x] Create `src/features/public/PublicLayout.tsx` — responsive layout with logo, language selector, nav links, "Volunteer Login" link, `<Outlet>` for child routes
- [x] Create `src/features/public/PublicHome.tsx` — combined resource + document list with category filter tabs, QR code section using `QRCodeSVG`

### Group 4: Public Detail Pages

- [x] Create `src/features/public/PublicResourceDetail.tsx` — read-only resource detail (name, category, description, address, phone, hours, linked documents as links to `/public/documents/:id`)
- [x] Create `src/features/public/PublicDocumentDetail.tsx` — read-only document detail (title, category, description, type, language availability, PDF/image preview via signed URLs, linked resources as links to `/public/resources/:id`)

### Group 5: Routing & Integration

- [x] Update `src/app/App.tsx` — add public routes at `/public/*` outside ProtectedRoute, wrapped in `PublicDataProvider` + `PublicLayout`

### Group 6: Verification

- [x] Run `npm run build` to verify no TypeScript errors
- [x] Run `npm test` to verify no test regressions
