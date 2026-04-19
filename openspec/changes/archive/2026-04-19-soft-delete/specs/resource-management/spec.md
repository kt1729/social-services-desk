## MODIFIED Requirements

### Requirement: Delete a resource

The system SHALL allow only admin-role volunteers to soft-delete resources. Soft-deletion SHALL set `active: false` and record a `deletedAt` timestamp on the resource document; the document SHALL NOT be removed from Firestore. Admins MAY view soft-deleted resources via a "Show deleted" toggle and restore them.

#### Scenario: Admin soft-deletes a resource
- **WHEN** an admin clicks delete on a resource and confirms the action
- **THEN** the system sets `active: false` and `deletedAt` to the current timestamp on the resource document, and the resource no longer appears in the active list

#### Scenario: Admin cancels deletion
- **WHEN** an admin clicks delete but cancels the confirmation dialog
- **THEN** no change is made and the resource remains in the active list

#### Scenario: Admin views deleted resources
- **WHEN** an admin toggles "Show deleted" on the resource list
- **THEN** the page displays soft-deleted resources in a visually distinct (dimmed) state

#### Scenario: Admin restores a soft-deleted resource
- **WHEN** an admin clicks "Restore" on a soft-deleted resource
- **THEN** the system sets `active: true` and removes `deletedAt` from the resource document, and the resource reappears in the active list
