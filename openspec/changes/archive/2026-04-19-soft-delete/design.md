## Context

Resources and documents are fetched via `onSnapshot` in two places: `DataProvider` (admin app) and `PublicDataProvider` (public portal). Both use unfiltered collection queries today. Soft-delete requires both to exclude inactive records so soft-deleted items never surface to guests or the public.

## Goals / Non-Goals

**Goals:**
- Replace hard-delete with `updateDoc({ active: false, deletedAt: Timestamp.now() })`
- Filter `onSnapshot` queries in `DataProvider` and `PublicDataProvider` to exclude soft-deleted records (`where('active', '!=', false)`)
- Admin-only "Show deleted" toggle in resource and document list pages to view and restore soft-deleted items
- Restore via `updateDoc({ active: true, deletedAt: deleteField() })`
- Preserve Firebase Storage files on soft-delete

**Non-Goals:**
- Hard-delete / permanent purge UI (future admin cleanup tool)
- Soft-delete for guests, notes, or tags
- Automatic purge after a retention period

## Decisions

### 1. Filter in DataProvider queries, not client-side

`onSnapshot` already uses `collection(db, 'resources')` with no filters. Adding `where('active', '!=', false)` at the query level means soft-deleted records are never pushed into DataContext — zero changes needed across all consumers (ResourceCard, ResourceDetail, PublicHome, search, print, etc.).

Alternative: filter client-side in `useData`. Rejected — leaks inactive records into every consumer and wastes bandwidth.

### 2. `active` absent = active (backwards compatible)

`where('active', '!=', false)` includes documents where `active` is missing. Existing records continue to appear without any migration or backfill.

### 3. "Show deleted" is a separate fetch, not a query toggle

The deleted items view is fetched on-demand (`getDocs` with `where('active', '==', false)`) when the admin opens the trash view — not via the real-time `onSnapshot`. Keeps the live subscription lean.

### 4. Storage files not deleted on soft-delete

Documents reference Storage files. Deleting them on soft-delete would make restore impossible. Files are preserved; a future hard-delete action will clean them up.

### 5. `deleteField()` clears `deletedAt` on restore

Using Firestore's `deleteField()` sentinel removes the `deletedAt` field cleanly on restore rather than leaving a stale timestamp.

## Risks / Trade-offs

- **Firestore `!=` query requires index with `orderBy`**: We're not using `orderBy` server-side, so no composite index is needed. If ordering is added later, an index will be required.
- **Soft-deleted records accumulate in Firestore**: Acceptable for a small dataset. A future admin purge feature can address this.
- **Storage costs for orphaned files**: Minimal at current scale. Acceptable until hard-delete is implemented.
