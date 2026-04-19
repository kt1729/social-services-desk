## Why

Hard-deleting resources and documents is irreversible. An accidental delete permanently loses data and audit history. Soft-delete (`active: false`) lets admins recover records and provides a clear audit trail of what was removed and when.

## What Changes

- Resource and document "delete" actions set `active: false` and record a `deletedAt` timestamp instead of calling `deleteDoc`
- Resource and document lists filter to show only `active != false` records by default
- Admins can toggle a "Show deleted" view to see soft-deleted items and restore them
- Restore sets `active: true` and clears `deletedAt`
- Firebase Storage files for documents are **not** deleted on soft-delete (preserved for restore)

## Capabilities

### New Capabilities

### Modified Capabilities
- `resource-management`: Delete is now soft-delete; list filters by active; restore action added
- `document-library`: Delete is now soft-delete (Storage files preserved); list filters by active; restore action added

## Impact

- **`src/features/resources/ResourceList.tsx`** and **`ResourceDetail.tsx`**: soft-delete handler, "Show deleted" toggle, restore
- **`src/features/documents/DocumentList.tsx`** and **`DocumentDetail.tsx`**: same pattern
- **`src/app/DataProvider.tsx`**: Firestore `onSnapshot` queries need to filter `active != false`
- **`src/shared/types/index.ts`**: `Resource` and `ServiceDocument` gain `active?: boolean` and `deletedAt?: Timestamp`
- **No Storage deletion** on soft-delete — files remain until a future hard-delete or cleanup job
