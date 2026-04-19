## Why

Tags on resources and documents are currently free-text fields with no central registry, leading to duplicates, inconsistent casing, and unusable filters on the public website. A managed tag system gives admins control over the tag vocabulary and lets visitors reliably filter by tag.

## What Changes

- New **Tags admin page** — list, create, rename, and delete tags (CRUD)
- Tags stored in a top-level `tags` Firestore collection (id, label, slug, createdAt)
- **Multiselect tag picker** component replaces any free-text tag input on resource and document forms; values are tag IDs referencing the `tags` collection
- Public portal resource and document listing pages gain a **tag filter** using the same tag registry
- Firestore security rules updated to allow public read of `tags` and restrict writes to authenticated admins

## Capabilities

### New Capabilities

- `tag-management`: Admin CRUD UI for the tag registry — list all tags, create new tags, rename existing tags, delete tags (with guard if tag is in use)
- `tag-selection`: Reusable multiselect dropdown component for selecting one or more tags from the registry; used on resource and document edit forms

### Modified Capabilities

- `resource-management`: Tag field changes from free-text string to array of tag IDs referencing the `tags` collection
- `document-library`: Tag field changes from free-text string to array of tag IDs referencing the `tags` collection
- `public-portal`: Resource and document listing views gain a tag filter panel powered by the `tags` collection
- `firestore-rules`: New `tags` collection requires public read + admin-only write rules

## Impact

- **Firestore schema**: New top-level `tags` collection; `resources` and `documents` documents get `tagIds: string[]` replacing any existing free-text tag field
- **Admin UI**: New route (e.g. `/admin/tags`) added to the admin navigation
- **Public portal**: Filter UI on resource/document listing pages; `tags` collection read on public data provider
- **Forms**: Resource and document create/edit forms swap tag input for the multiselect picker
- **Dependencies**: No new npm packages required — multiselect built with existing Tailwind + React primitives
