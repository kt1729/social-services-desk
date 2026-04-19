## Why

The soft-delete feature uses `where('active', '!=', false)` in Firestore queries. This filter excludes documents where the `active` field is absent — meaning all pre-soft-delete resources and documents are invisible. A one-time migration sets `active: true` on every existing record so the Firestore query works correctly going forward. New documents will also include `active: true` on creation.

## What Changes

- **Migration script** (`scripts/migrate-active-field.ts`): fetches all resources and documents, writes `active: true` in batches on any doc missing the field
- **ResourceForm**: include `active: true` in the `addDoc` payload for new resources
- **DocumentForm**: include `active: true` in the `addDoc` payload for new documents

## Capabilities

### New Capabilities

### Modified Capabilities

## Impact

- **`scripts/migrate-active-field.ts`**: new one-time script, run once via `npx ts-node`
- **`src/features/resources/ResourceForm.tsx`**: `addDoc` payload gains `active: true`
- **`src/features/documents/DocumentForm.tsx`**: `addDoc` payload gains `active: true`
- **No query changes needed** — `where('active', '!=', false)` is already correct once all docs have the field
