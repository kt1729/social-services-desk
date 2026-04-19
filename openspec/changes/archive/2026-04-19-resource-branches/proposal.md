## Why

Many community organizations (food banks, shelters, clinics) operate multiple branch locations under the same name. Currently each location must be entered as a completely separate resource, causing duplicated names, descriptions, categories, and linked documents — and making it hard to see that two locations belong to the same organization. Grouping branches under a single parent resource reduces data duplication and makes the directory easier to navigate.

## What Changes

- Add a `Branch` type with its own `id`, `label`, `address`, `phone`, `email`, and `operatingHours` fields.
- Add an optional `branches: Branch[]` field to the `Resource` type.
- Resource create/edit form gains a "Branches" section to add, edit, and remove branches inline.
- Resource card shows a branch count badge when branches exist.
- Resource detail lists all branches with their contact info expanded.
- Public portal resource detail shows branches the same way.
- Resources with branches display the parent's shared info (name, description, category, tags, documents) once, then list each branch's location-specific details below.

## Capabilities

### New Capabilities

_(none — branches are a field addition within existing capabilities)_

### Modified Capabilities

- `resource-management`: Resource type gains `branches?: Branch[]`; form gains branch management UI; card shows branch count; detail lists branches with contact info.
- `public-portal`: Public resource detail shows branch list with per-branch contact info.

## Impact

- **Types**: New `Branch` interface; `branches?: Branch[]` added to `Resource`.
- **Files**: `ResourceForm.tsx`, `ResourceCard.tsx`, `ResourceDetail.tsx`, `PublicResourceDetail.tsx`.
- **Firestore**: Optional field — existing resources are unaffected. Branch IDs generated client-side with `crypto.randomUUID()`.
- **No new npm dependencies**.
