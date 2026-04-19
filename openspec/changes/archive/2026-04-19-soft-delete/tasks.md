## 1. Types

- [x] 1.1 Add `active?: boolean` and `deletedAt?: Timestamp` to `Resource` and `ServiceDocument` in `src/shared/types/index.ts`

## 2. DataProvider Queries

- [x] 2.1 Add `where('active', '!=', false)` filter to the resources `onSnapshot` query in `src/app/DataProvider.tsx`
- [x] 2.2 Add `where('active', '!=', false)` filter to the documents `onSnapshot` query in `src/app/DataProvider.tsx`
- [x] 2.3 Add `where('active', '!=', false)` filter to the resources `onSnapshot` query in `src/features/public/PublicDataProvider.tsx`
- [x] 2.4 Add `where('active', '!=', false)` filter to the documents `onSnapshot` query in `src/features/public/PublicDataProvider.tsx`

## 3. Resource Soft-Delete & Restore

- [x] 3.1 Replace `deleteDoc` with `updateDoc({ active: false, deletedAt: Timestamp.now() })` in the resource delete handler
- [x] 3.2 Add "Show deleted" toggle to `ResourceList.tsx`; fetch soft-deleted resources on demand with `getDocs(where('active', '==', false))`
- [x] 3.3 Render soft-deleted resources dimmed with a "Restore" button
- [x] 3.4 Implement restore: `updateDoc({ active: true, deletedAt: deleteField() })`

## 4. Document Soft-Delete & Restore

- [x] 4.1 Replace `deleteDoc` (and Storage deletion) with `updateDoc({ active: false, deletedAt: Timestamp.now() })` in the document delete handler
- [x] 4.2 Add "Show deleted" toggle to `DocumentList.tsx`; fetch soft-deleted documents on demand with `getDocs(where('active', '==', false))`
- [x] 4.3 Render soft-deleted documents dimmed with a "Restore" button
- [x] 4.4 Implement restore: `updateDoc({ active: true, deletedAt: deleteField() })`

## 5. Tests

- [x] 5.1 Update resource delete tests — assert `updateDoc` called with `{ active: false }` instead of `deleteDoc`
- [x] 5.2 Add resource tests: "Show deleted" toggle, restore button calls `updateDoc({ active: true })`
- [x] 5.3 Update document delete tests — assert `updateDoc` called with `{ active: false }` instead of `deleteDoc`
- [x] 5.4 Add document tests: "Show deleted" toggle, restore button calls `updateDoc({ active: true })`
