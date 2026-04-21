## Context

The app currently has a one-off Admin SDK script (`scripts/migrate-active-field.ts`) for backfilling the `active` field. There is no mechanism to track whether the script has been run, prevent double-runs, or add future migrations in a consistent way.

## Goals / Non-Goals

**Goals:**

- Numbered migration files that are easy to add and understand (`001-`, `002-`, …)
- Runner that checks Firestore `_migrations` collection to skip already-applied migrations
- Idempotent by design — safe to re-run at any time
- Move existing backfill into `001-backfill-active-field.ts` with no behavior change

**Non-Goals:**

- Down migrations / rollback
- Automatic execution on app startup or CI (manual `npx tsx` for now)
- Parallel migration execution

## Decisions

### Migration tracking in Firestore `_migrations`

Each applied migration writes a document `{ appliedAt: Timestamp, name: string }` to `_migrations/{id}` where `id` is the migration number (e.g. `"001"`). The runner reads this collection first and skips any migration whose id already has a document.

**Alternative considered**: track in a local JSON file. Rejected — doesn't survive machine switches or team handoffs.

### Numbered file naming: `NNN-description.ts`

Zero-padded 3-digit prefix (`001`, `002`, …) ensures natural alphabetical ordering. The runner extracts the id from the filename prefix.

**Alternative considered**: timestamp-based (like Rails). Rejected — harder to read and review.

### Each migration exports `{ id, name, run }`

- `id`: the 3-digit string matching the filename prefix
- `name`: human-readable label stored in Firestore
- `run(db)`: async function receiving the admin Firestore instance

### Runner imports migrations statically

The runner imports all migrations from an index file (`scripts/migrations/index.ts`). Adding a new migration requires adding it to the index.

**Alternative considered**: dynamic glob import. Rejected — requires extra tooling and obscures what runs.

## Risks / Trade-offs

- [Risk] Developer forgets to add new migration to index → Mitigation: runner logs which migrations it found, making omissions visible
- [Risk] `_migrations` collection accumulates but is never read by the app → Acceptable — admin-only collection, tiny size

## Migration Plan

1. Create `scripts/migrations/001-backfill-active-field.ts` with existing logic
2. Create `scripts/migrations/index.ts` exporting all migrations
3. Create `scripts/run-migrations.ts` runner
4. Delete `scripts/migrate-active-field.ts`
5. Run `npx tsx scripts/run-migrations.ts` — migration 001 will apply (or skip if already applied)
