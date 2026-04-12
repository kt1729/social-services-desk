# resource-management Specification

## Purpose

TBD - created by archiving change social-service-desk. Update Purpose after archive.

## Requirements

### Requirement: Create a resource

The system SHALL allow authenticated volunteers to create a new community resource with the following fields: name (multilingual), description (multilingual), category, address, phone, website, openDays, openHours, tags, and notes.

#### Scenario: Volunteer creates a resource with English content

- **WHEN** a volunteer fills out the resource creation form with English name, description, category, and contact details and clicks Save
- **THEN** the system creates a new document in the `resources` collection with the provided fields, sets `createdBy` to the volunteer's UID, sets `createdAt` and `updatedAt` timestamps, and initializes `feedbackSummary` to zero

#### Scenario: Volunteer creates a resource with translations

- **WHEN** a volunteer fills out the resource form including Spanish, Mandarin, or Haitian Creole translations
- **THEN** the system stores the translations in the nested `name` and `description` objects and sets `translationStatus` for each provided language to "complete"

### Requirement: Read and display resources

The system SHALL display resources as cards showing name, category, address, phone, hours, description, feedback counts, and linked documents.

#### Scenario: Resource list displays all resources

- **WHEN** a volunteer navigates to the Resources tab
- **THEN** the system displays all resources as cards with their English name, category icon, address, phone, hours, and feedback summary

#### Scenario: Resource detail view

- **WHEN** a volunteer clicks on a resource card
- **THEN** the system displays the full resource detail including all fields, notes, linked documents, and feedback

### Requirement: Update a resource

The system SHALL allow authenticated volunteers to edit any resource's fields including adding or modifying translations.

#### Scenario: Volunteer updates resource contact info

- **WHEN** a volunteer edits a resource's address, phone, or hours and saves
- **THEN** the system updates the resource document in Firestore and sets `updatedAt` to the current timestamp

#### Scenario: Volunteer adds a translation to an existing resource

- **WHEN** a volunteer opens the translation tab on a resource edit form and enters Spanish translation for name and description
- **THEN** the system updates the `name.es` and `description.es` fields and sets `translationStatus.es` to "complete"

### Requirement: Delete a resource

The system SHALL allow only admin-role volunteers to delete resources. Deletion SHALL remove the resource document from Firestore.

#### Scenario: Admin deletes a resource

- **WHEN** an admin clicks delete on a resource and confirms the action
- **THEN** the system removes the resource document from Firestore

### Requirement: Category filtering

The system SHALL support filtering resources by one of the 10 predefined categories: housing, food, medical, mental_health, legal, employment, financial, transportation, clothing, other. Category filter SHALL be accessible from the sidebar.

#### Scenario: Volunteer filters by category

- **WHEN** a volunteer selects "Food & Meals" from the sidebar category filter
- **THEN** the system displays only resources with category "food"

#### Scenario: Volunteer clears category filter

- **WHEN** a volunteer selects "All" in the sidebar
- **THEN** the system displays all resources regardless of category

### Requirement: Tag-based organization

The system SHALL support flexible string tags on resources for additional categorization beyond the primary category.

#### Scenario: Volunteer adds tags to a resource

- **WHEN** a volunteer enters tags "shelter, emergency, overnight" on a resource form
- **THEN** the system stores the tags as a string array on the resource document

### Requirement: Resource feedback

The system SHALL allow authenticated volunteers to submit upvote or downvote feedback on resources. Feedback SHALL be stored in the `feedback` collection and aggregated in the resource's `feedbackSummary`.

#### Scenario: Volunteer upvotes a resource

- **WHEN** a volunteer clicks the thumbs-up button on a resource card
- **THEN** the system creates a feedback document with `rating: "up"` and increments the resource's `feedbackSummary.upvotes`

#### Scenario: Volunteer downvotes with comment

- **WHEN** a volunteer clicks thumbs-down and enters a comment "Hours are outdated"
- **THEN** the system creates a feedback document with `rating: "down"`, the comment, and increments `feedbackSummary.downvotes`

### Requirement: Link documents to resources

The system SHALL allow volunteers to attach documents to resources via the `linkedDocuments` array field on the resource. Linked documents SHALL display on the resource card.

#### Scenario: Volunteer links a document to a resource

- **WHEN** a volunteer clicks "Attach Document" on a resource and selects a document from the library
- **THEN** the system adds the document ID to the resource's `linkedDocuments` array and the document appears in the resource card's related documents section
