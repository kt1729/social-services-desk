## MODIFIED Requirements

### Requirement: Delete a document

The system SHALL allow only admin-role volunteers to soft-delete documents. Soft-deletion SHALL set `active: false` and record a `deletedAt` timestamp on the document; the Firestore document and associated Firebase Storage files SHALL NOT be removed. Admins MAY view soft-deleted documents via a "Show deleted" toggle and restore them.

#### Scenario: Admin soft-deletes a document
- **WHEN** an admin clicks delete on a document and confirms
- **THEN** the system sets `active: false` and `deletedAt` to the current timestamp on the document, and the document no longer appears in the active list; Storage files are preserved

#### Scenario: Admin cancels deletion
- **WHEN** an admin clicks delete but cancels the confirmation dialog
- **THEN** no change is made and the document remains in the active list

#### Scenario: Admin views deleted documents
- **WHEN** an admin toggles "Show deleted" on the document list
- **THEN** the page displays soft-deleted documents in a visually distinct (dimmed) state

#### Scenario: Admin restores a soft-deleted document
- **WHEN** an admin clicks "Restore" on a soft-deleted document
- **THEN** the system sets `active: true` and removes `deletedAt` from the document, and the document reappears in the active list
