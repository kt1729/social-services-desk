## MODIFIED Requirements

### Requirement: Public read access for resources and documents
The system MUST allow unauthenticated read access for `resources`, `documents`, and `tags` collections (`allow read: if true`).
Write access on `resources` and `documents` MUST remain auth-gated (no change).
Write access on `tags` MUST be restricted to authenticated users only (`allow write: if request.auth != null`).
All other collections (guests, feedback, notes, volunteers) MUST remain fully auth-gated (no change).

#### Scenario: Unauthenticated read of tags collection
- **WHEN** an unauthenticated user (public portal guest) reads the `tags` collection
- **THEN** Firestore returns the tag documents without requiring authentication

#### Scenario: Unauthenticated write to tags rejected
- **WHEN** an unauthenticated client attempts to create, update, or delete a document in the `tags` collection
- **THEN** Firestore rejects the operation with a permissions error

#### Scenario: Authenticated write to tags allowed
- **WHEN** an authenticated volunteer writes to the `tags` collection
- **THEN** Firestore allows the operation
