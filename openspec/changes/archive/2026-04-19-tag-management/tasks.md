## 1. Firestore & Data Layer

- [x] 1.1 Update `firestore.rules` to add public read + auth-gated write for the `tags` collection
- [x] 1.2 Add `Tag` TypeScript type (`{ id: string; label: string; slug: string; createdAt: Timestamp }`) to shared types
- [x] 1.3 Add `tagIds: string[]` field to the `Resource` and `Document` TypeScript types (replacing free-text `tags`)
- [x] 1.4 Add `tags` collection listener to `DataProvider` (or equivalent data context) so tag list is available app-wide
- [x] 1.5 Add `tags` collection read to `PublicDataProvider` for the public portal

## 2. Tag Management Admin Page

- [x] 2.1 Create `src/features/tags/TagsPage.tsx` — list all tags sorted alphabetically with label and usage count
- [x] 2.2 Implement create tag form (inline or modal): label input, auto-generate slug, duplicate-label validation, submit writes to `tags` collection
- [x] 2.3 Implement rename tag: inline edit on label, updates `label` and `slug` on the `tags/{id}` document
- [x] 2.4 Implement delete tag: query resources + documents for usage count, show warning dialog if in use, delete on confirm
- [x] 2.5 Add empty-state message when no tags exist
- [x] 2.6 Add Tags page route to admin navigation (sidebar/header link)

## 3. TagMultiselect Component

- [x] 3.1 Create `src/shared/components/TagMultiselect.tsx` — controlled component with `value: string[]` and `onChange` props
- [x] 3.2 Implement trigger button: shows placeholder when empty, shows removable tag pills when tags are selected
- [x] 3.3 Implement dropdown: full tag list with text search filter (case-insensitive), checkmark on selected items, toggle on click
- [x] 3.4 Implement loading state (spinner in dropdown while tags are loading)
- [x] 3.5 Implement empty state (message + link to Tags admin page when no tags exist)
- [x] 3.6 Handle unknown/orphaned tag IDs — skip rendering a pill if ID not found in tag list

## 4. Resource & Document Form Integration

- [x] 4.1 Replace free-text tag input with `TagMultiselect` on the resource create/edit form; bind to `tagIds` field
- [x] 4.2 Replace free-text tag input with `TagMultiselect` on the document create/edit form; bind to `tagIds` field
- [x] 4.3 Update resource save logic to write `tagIds: string[]` instead of `tags: string[]`
- [x] 4.4 Update document save logic to write `tagIds: string[]` instead of `tags: string[]`

## 5. Public Portal Tag Filter

- [x] 5.1 Add tag filter pill group to the public home page below the category filter tabs (hidden when `tags` collection is empty)
- [x] 5.2 Implement client-side tag filtering: items shown if `tagIds` intersects any selected tag (OR logic)
- [x] 5.3 Combine tag filter with existing category filter (AND logic between category and tags)
- [x] 5.4 Ensure tag labels on the public portal are rendered in the active language where translations exist, falling back to English
