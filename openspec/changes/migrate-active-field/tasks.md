## 1. Migration Script

- [x] 1.1 Create `scripts/migrate-active-field.ts` — connects to Firestore via Admin SDK, fetches all `resources` and `documents`, batch-writes `active: true` on any doc where the field is absent, logs progress and count
- [x] 1.2 Add `service-account.json` to `.gitignore` if not already present

## 2. Form Updates

- [x] 2.1 Add `active: true` to the `addDoc` payload in `ResourceForm.tsx`
- [x] 2.2 Add `active: true` to the `addDoc` payload in `DocumentForm.tsx`

## 3. Run Migration

- [ ] 3.1 Run `npx ts-node scripts/migrate-active-field.ts` (requires service account JSON in project root) and verify output shows 0 errors
