## 1. TagMultiselect Tests

- [x] 1.1 Create `src/shared/components/__tests__/TagMultiselect.test.tsx`
- [x] 1.2 Test: shows placeholder when value is empty
- [x] 1.3 Test: shows pills for selected tag IDs
- [x] 1.4 Test: skips orphaned tag IDs silently (no pill, no error)
- [x] 1.5 Test: selecting a tag calls onChange with ID appended
- [x] 1.6 Test: deselecting a tag calls onChange with ID removed
- [x] 1.7 Test: removing a pill via × calls onChange with ID removed
- [x] 1.8 Test: search filters tags case-insensitively
- [x] 1.9 Test: search with no matches shows "No matching tags."
- [x] 1.10 Test: tagsLoading=true shows "Loading…" in dropdown
- [x] 1.11 Test: empty tags list shows "No tags yet." message

## 2. TagsPage Tests

- [x] 2.1 Create `src/features/tags/__tests__/TagsPage.test.tsx`; mock `useData` and `firebase/firestore`
- [x] 2.2 Test: renders tags sorted alphabetically
- [x] 2.3 Test: shows per-tag usage count (resources + documents with matching tagIds)
- [x] 2.4 Test: shows empty state when tags array is empty
- [x] 2.5 Test: "+ Add Tag" button opens modal
- [x] 2.6 Test: submitting valid label calls addDoc with label and slug
- [x] 2.7 Test: duplicate label (case-insensitive) shows error and does not call addDoc
- [x] 2.8 Test: clicking Rename makes row editable with pre-filled input
- [x] 2.9 Test: saving rename calls updateDoc with new label and slug
- [x] 2.10 Test: pressing Escape cancels rename
- [x] 2.11 Test: delete on unused tag shows generic confirm dialog
- [x] 2.12 Test: delete on in-use tag shows usage count in dialog
- [x] 2.13 Test: confirming delete calls deleteDoc with correct ref

## 3. PublicHome Tag Filter Tests

- [x] 3.1 Add `tags` field to `mockPublicData` in existing `PublicHome.test.tsx`
- [x] 3.2 Test: tag pills render when tags exist in mock data
- [x] 3.3 Test: no tag pills when tags array is empty
- [x] 3.4 Test: selecting a tag pill filters resources to those with matching tagId
- [x] 3.5 Test: selecting a tag pill filters documents to those with matching tagId
- [x] 3.6 Test: selecting two tag pills shows items matching either (OR logic)
- [x] 3.7 Test: deselecting a tag pill restores all items
- [x] 3.8 Test: tag filter combined with category filter uses AND logic

## 4. PublicDataProvider Tags Test

- [x] 4.1 Update consumer component in `PublicDataProvider.test.tsx` to render `tags` field
- [x] 4.2 Test: `tags` field is present (and is an array) in local mode context value
