## Context

Firestore's `!=` operator only matches documents where the queried field exists. All existing resources and documents were created before the `active` field was introduced and have no such field. The migration backfills `active: true` on all existing records so the Firestore query behaves as designed.

## Decisions

### 1. Firestore batch writes, skip docs that already have the field

Use `writeBatch` (max 500 ops per batch) to update documents efficiently. Skip any doc where `active` is already set to avoid unnecessary writes. This makes the script idempotent — safe to re-run.

### 2. Script uses the Firebase Admin SDK via service account

The script runs server-side (Node.js) with a service account JSON, bypassing Firestore security rules. This is the standard pattern for one-time migrations. The service account key is read from a `GOOGLE_APPLICATION_CREDENTIALS` env var or a local `service-account.json` file (gitignored).

### 3. `active: true` added to `addDoc` in both forms

Ensures every new resource and document is visible from creation without relying solely on the migration. Belt-and-suspenders.

### 4. No changes to `updateDoc` calls

Existing records updated via the edit form will have `active: true` set by the migration before the update runs, so no change needed there.
