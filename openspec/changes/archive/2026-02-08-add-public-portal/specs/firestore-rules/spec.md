## firestore-rules

### Public Read Access

- `resources` collection MUST allow unauthenticated read access (`allow read: if true`)
- `documents` collection MUST allow unauthenticated read access (`allow read: if true`)
- Write access on both collections MUST remain auth-gated (no change)
- All other collections (guests, feedback, notes, volunteers) MUST remain fully auth-gated (no change)
