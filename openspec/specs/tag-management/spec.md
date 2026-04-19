# tag-management Specification

## Purpose

Admin CRUD interface for managing the global tag registry. Tags are stored in a top-level `tags` Firestore collection and are used to categorize resources and documents consistently across the app and public portal.

## Requirements

### Requirement: Tag data model
The system SHALL store tags in a top-level Firestore collection `tags` where each document has the fields: `label: string`, `slug: string` (auto-generated, URL-safe, lowercase-hyphenated from label), and `createdAt: Timestamp`.

#### Scenario: Tag document structure
- **WHEN** a tag with label "Emergency Housing" is created
- **THEN** a document is written to `tags/{id}` with `label: "Emergency Housing"`, `slug: "emergency-housing"`, and `createdAt` set to the server timestamp

### Requirement: List tags
The admin MUST be able to view all tags in the system on a dedicated Tags admin page at `/admin/tags` (or equivalent admin route). The list SHALL display each tag's label and a count of resources and documents using it.

#### Scenario: Admin views tag list
- **WHEN** an authenticated admin navigates to the Tags admin page
- **THEN** the system displays all tags sorted alphabetically by label, each showing its label and combined usage count across resources and documents

#### Scenario: Empty state
- **WHEN** no tags exist in the `tags` collection
- **THEN** the system displays an empty-state message prompting the admin to create the first tag

### Requirement: Create a tag
The admin MUST be able to create a new tag by entering a label. The system SHALL auto-generate the slug from the label. Duplicate labels (case-insensitive) SHALL be rejected.

#### Scenario: Admin creates a valid tag
- **WHEN** an admin enters the label "Overnight Shelter" and submits the create form
- **THEN** the system writes a new document to `tags` with `label: "Overnight Shelter"` and `slug: "overnight-shelter"` and the new tag appears in the list

#### Scenario: Duplicate label rejected
- **WHEN** an admin attempts to create a tag with a label that already exists (case-insensitive)
- **THEN** the system displays an inline error "A tag with this name already exists" and does not write to Firestore

#### Scenario: Empty label rejected
- **WHEN** an admin submits the create form with a blank label
- **THEN** the system displays a validation error and does not write to Firestore

### Requirement: Rename a tag
The admin MUST be able to rename an existing tag's label. The slug SHALL be updated to match the new label. Renaming SHALL not affect tag IDs stored on resources and documents.

#### Scenario: Admin renames a tag
- **WHEN** an admin edits a tag's label from "Shelter" to "Emergency Shelter" and saves
- **THEN** the system updates the `tags/{id}` document with the new label and regenerated slug, and all resources/documents referencing that tag ID automatically display the new label

### Requirement: Delete a tag
The admin MUST be able to delete a tag. Before deletion, the system SHALL check if any resources or documents reference the tag ID. If in use, the system SHALL display a warning with the usage count and require explicit confirmation before proceeding. Deletion SHALL NOT cascade-remove the tag ID from resource/document records.

#### Scenario: Admin deletes an unused tag
- **WHEN** an admin clicks delete on a tag that is not referenced by any resource or document
- **THEN** the system deletes the `tags/{id}` document immediately with no confirmation prompt

#### Scenario: Admin deletes a tag that is in use
- **WHEN** an admin clicks delete on a tag referenced by 3 resources and 1 document
- **THEN** the system displays a warning: "This tag is used by 4 items. Deleting it will remove it from filters but will not update those items." and requires the admin to confirm before deletion proceeds

#### Scenario: Admin cancels deletion
- **WHEN** an admin dismisses the confirmation dialog
- **THEN** the tag document is not deleted and the list remains unchanged
