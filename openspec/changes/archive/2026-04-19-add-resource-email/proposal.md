## Why

Resources often have a contact email address that volunteers and guests use to reach the organization. Without an email field, volunteers are forced to put email addresses in the notes or description, making them hard to find and impossible to link.

## What Changes

- Add an `email` field (string) to the `Resource` Firestore document.
- Add an email input to the Resource create/edit form, displayed alongside the existing website field.
- Display the email as a `mailto:` link beside the website in the resource card, detail view, and public portal resource detail.
- No breaking changes — existing resources without `email` default to empty string.

## Capabilities

### New Capabilities

_(none — this is a field addition within existing capabilities)_

### Modified Capabilities

- `resource-management`: Create/update resource form gains an `email` field; read/display views render email as a `mailto:` link beside website.
- `public-portal`: Public resource detail displays email as a `mailto:` link.

## Impact

- **Types**: Add `email?: string` to the `Resource` interface in `src/shared/types/index.ts`.
- **Files**: `ResourceForm.tsx`, `ResourceCard.tsx`, `ResourceDetail.tsx`, `PublicResourceDetail.tsx`, `PrintResourceCard.tsx` (if it shows contact info).
- **Firestore**: No schema migration — field is optional; missing values treated as `''`.
- **No new dependencies**.
