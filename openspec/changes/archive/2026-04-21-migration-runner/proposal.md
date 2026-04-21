## Why

The one-off `scripts/migrate-active-field.ts` works for the current backfill but leaves no reusable pattern for future schema changes. As the app grows, ad-hoc migration scripts will become hard to track, easy to accidentally re-run, and impossible to audit.

## What Changes

- Replace `scripts/migrate-active-field.ts` with a numbered migration framework
- Add `scripts/migrations/` directory for individual numbered migration files
- Add `scripts/run-migrations.ts` runner that tracks applied migrations in a Firestore `_migrations` collection and skips already-applied ones
- Move existing backfill logic into `scripts/migrations/001-backfill-active-field.ts`
- Delete the old one-off script

## Capabilities

### New Capabilities

- `migration-runner`: Numbered migration files with a runner that tracks applied migrations in Firestore and skips duplicates

### Modified Capabilities

## Impact

- New dev dependency: `firebase-admin` (already installed), `tsx` (already installed)
- New files: `scripts/run-migrations.ts`, `scripts/migrations/001-backfill-active-field.ts`
- Deleted file: `scripts/migrate-active-field.ts`
- Firestore: new `_migrations` collection (admin-only, one doc per applied migration)
- No changes to app source code or existing Firestore rules
