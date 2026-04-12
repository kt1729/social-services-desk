# notes-system Specification

## Purpose

TBD - created by archiving change social-service-desk. Update Purpose after archive.

## Requirements

### Requirement: Create standalone notes

The system SHALL allow authenticated volunteers to create standalone notes in the `notes` collection with fields: `parentType`, `parentId`, `text`, `volunteerId`, and `createdAt`.

#### Scenario: Volunteer creates a general note

- **WHEN** a volunteer creates a note without attaching it to a specific entity
- **THEN** the system creates a note document with `parentType: "general"`, `parentId: null`, the note text, volunteer ID, and timestamp

#### Scenario: Volunteer creates a note attached to a resource

- **WHEN** a volunteer creates a note from a resource's detail view
- **THEN** the system creates a note document with `parentType: "resource"`, `parentId` set to the resource ID, the note text, volunteer ID, and timestamp

### Requirement: Attach notes to any entity

The system SHALL support attaching notes to resources, guests, documents, or as general (unattached) notes. The `parentType` field SHALL be one of: "resource", "guest", "document", "general".

#### Scenario: Note attached to a guest

- **WHEN** a volunteer adds a note from a guest profile
- **THEN** the note's `parentType` is "guest" and `parentId` is the guest's ID

#### Scenario: Note attached to a document

- **WHEN** a volunteer adds a note from a document detail view
- **THEN** the note's `parentType` is "document" and `parentId` is the document's ID

### Requirement: Display notes on parent entities

The system SHALL display all associated notes on the detail view of resources, guests, and documents. Notes SHALL show the text, volunteer name, and timestamp in reverse chronological order.

#### Scenario: Resource detail shows attached notes

- **WHEN** a volunteer views a resource detail page
- **THEN** all notes with `parentType: "resource"` and matching `parentId` are displayed chronologically

### Requirement: Notes tab view

The system SHALL provide a dedicated Notes tab that displays all notes across all entity types, with the parent entity name and type visible for context.

#### Scenario: Volunteer views all notes

- **WHEN** a volunteer navigates to the Notes tab
- **THEN** the system displays all notes from the `notes` collection, sorted by creation date, with the parent entity type and name shown for each

### Requirement: Volunteer attribution on notes

Every note SHALL display the name of the volunteer who created it, resolved from the `volunteers` collection using the `volunteerId` field.

#### Scenario: Note shows volunteer name

- **WHEN** a note is displayed
- **THEN** it shows the volunteer's name (e.g., "— Vol. Sarah, Jan 15") resolved from the volunteers collection
