## 1. Migration Files

- [x] 1.1 Create `scripts/migrations/001-backfill-active-field.ts` — move logic from `scripts/migrate-active-field.ts`, export `{ id: '001', name, run(db) }`
- [x] 1.2 Create `scripts/migrations/index.ts` — exports an array of all migrations in order

## 2. Runner

- [x] 2.1 Create `scripts/run-migrations.ts` — initialises Admin SDK, reads `_migrations` collection, iterates registered migrations, skips applied ones, writes `_migrations/{id}` on success, logs status per migration and a final summary

## 3. Cleanup

- [x] 3.1 Delete `scripts/migrate-active-field.ts`
