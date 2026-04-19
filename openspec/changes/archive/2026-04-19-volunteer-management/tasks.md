## 1. Page and Routing

- [x] 1.1 Create `src/features/volunteers/VolunteersPage.tsx` — admin-only page with volunteer list, add button, role change, and delete
- [x] 1.2 Add `/volunteers` route to `src/app/App.tsx` guarded by `isAdmin` (redirect to `/` if not admin)
- [x] 1.3 Add "Volunteers" link to `src/app/Sidebar.tsx` under the Settings section (visible to admins only)

## 2. Volunteer List

- [x] 2.1 Display all `volunteers` collection documents in a table/list: name, email, role selector, delete button
- [x] 2.2 Show empty-state message when no volunteers exist

## 3. Add Volunteer

- [x] 3.1 "Add Volunteer" button opens a `Modal` with fields: Name (text), Email (email), Role (select), Firebase UID (text) plus a helper note about finding the UID
- [x] 3.2 On submit, check if `volunteers/{uid}` already exists — show error if so, otherwise create doc with `{ name, email, role, createdAt: Timestamp.now() }`

## 4. Role Change

- [x] 4.1 Render role as an inline `<select>` per row; on change call `updateDoc` to update `role` in Firestore immediately

## 5. Delete

- [x] 5.1 Delete button per row opens `ConfirmDialog`; on confirm call `deleteDoc` to remove the Firestore document

## 6. Tests

- [x] 6.1 Create `src/features/volunteers/__tests__/VolunteersPage.test.tsx` — tests for: list render, empty state, role change, delete confirmation, add form validation
