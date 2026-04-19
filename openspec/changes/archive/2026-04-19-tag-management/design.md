## Context

Resources and documents currently store tags as free-text string arrays with no central registry. This means the same concept can appear as "housing", "Housing", or "housing-support" depending on who entered it. The public portal cannot offer a meaningful tag filter because the tag vocabulary is unbounded and inconsistent.

The app runs on Firebase (Firestore + Hosting), React 19 + Vite, Tailwind CSS v4, and targets 3–5 volunteer admins with a broader public audience on mobile. No new npm packages are introduced.

## Goals / Non-Goals

**Goals:**
- Central `tags` Firestore collection as the single source of truth for the tag vocabulary
- Admin CRUD page to manage tags (create, rename, delete with in-use guard)
- Reusable multiselect dropdown component backed by the tag registry
- Resource and document forms use the multiselect picker (tag IDs, not free text)
- Public portal resource/document listing gains a tag filter
- Firestore rules grant public read on `tags`, admin-only write

**Non-Goals:**
- Tag merging or bulk rename tooling
- Tag analytics or usage reporting
- Hierarchical or nested tags
- Migrating existing free-text tag strings to tag IDs (data migration out of scope for now; existing records keep their old string arrays and are treated as untagged until edited)

## Decisions

### 1. Tags stored as a top-level Firestore collection

**Decision**: `tags/{tagId}` with fields `{ label: string, slug: string, createdAt: Timestamp }`.

**Rationale**: A sub-collection per resource/document would make listing all tags for the filter expensive. A top-level collection is a single cheap read, fits well within the free tier, and is easy to secure with a single rule block.

**Alternative considered**: Storing tags as a config document with a map field. Rejected because map entries can't be individually secured or paginated, and atomic array operations are less ergonomic than individual documents.

### 2. Resources/documents store tag IDs, not labels

**Decision**: `tagIds: string[]` on resource and document documents, holding Firestore document IDs from the `tags` collection.

**Rationale**: Labels can change (admin renames a tag). Storing IDs means a rename is a single write to the `tags` collection with no fan-out updates to every resource/document. Labels are resolved at render time by joining against the in-memory tag list.

**Alternative considered**: Denormalizing label + id as objects. Rejected — adds write complexity and stale-label risk.

### 3. Multiselect built with Tailwind primitives, no new dependency

**Decision**: Implement `TagMultiselect` as a controlled React component using a popover pattern (button + absolute-positioned dropdown) styled with Tailwind.

**Rationale**: The app already uses Tailwind v4 throughout. Adding a headless-UI or react-select dependency for a single component is not justified at this scale.

### 4. Public tag filter is client-side

**Decision**: The public portal loads the full `tags` collection once (via `PublicDataProvider`) and filters resource/document lists in memory by `tagIds` intersection.

**Rationale**: Dataset is small (< 100 tags, < 500 resources/documents). Client-side filtering avoids composite Firestore indexes and keeps the architecture consistent with the existing client-side category filter.

### 5. Delete guard — soft check, no cascade

**Decision**: Before deleting a tag, query `resources` and `documents` where `tagIds array-contains tagId`. If any exist, show a count warning and require confirmation. No cascade removal from existing records.

**Rationale**: Cascade updates across potentially many documents could exceed Firestore free-tier write quotas and are hard to roll back. The warning gives admins enough context to decide, and orphaned tag IDs are harmless (they just don't resolve to a label).

## Risks / Trade-offs

- **Stale tag IDs after delete**: If an admin force-deletes a tag that is in use, `tagIds` on resources/documents will contain an ID with no matching `tags` document. The UI must handle this gracefully (skip unknown IDs rather than crash). → Mitigation: label resolution falls back to empty string / skips unknown IDs.
- **No migration for existing free-text tags**: Old records keep their old `tags: string[]` field. They won't appear in tag filters until re-saved with the new picker. → Accepted trade-off; admins can re-save records as needed.
- **Race on tag delete + resource save**: Unlikely at this user scale (3–5 volunteers), but possible. → No special handling needed; last write wins.

## Migration Plan

1. Deploy Firestore rules update (adds `tags` collection rules) before any client code ships
2. Deploy client — new `tags` collection is empty on first deploy; admin creates tags via the new CRUD page
3. Existing resource/document records retain old `tags` string field; new `tagIds` field is absent until a record is edited and saved with the new form
4. No rollback complexity — removing the feature means reverting Firestore rules and redeploying the previous client build

## Open Questions

- Should tag slugs be auto-generated from the label (e.g. `"Emergency Housing"` → `"emergency-housing"`) or manually entered? → Auto-generate on create, not editable, used for stable URL filtering in the future.
- Should the public portal tag filter be a checkbox list or a pill/toggle group? → Pill/toggle group, consistent with the existing category filter tabs.
