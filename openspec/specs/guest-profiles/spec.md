# guest-profiles Specification

## Purpose

TBD - created by archiving change social-service-desk. Update Purpose after archive.

## Requirements

### Requirement: Create a guest profile

The system SHALL allow authenticated volunteers to create a guest profile with first name, last initial (privacy — no full last names), preferred language, and needs categories.

#### Scenario: Volunteer creates a new guest profile

- **WHEN** a volunteer fills out the guest creation form with first name "Maria", last initial "G", preferred language "es", and needs ["housing", "food"]
- **THEN** the system creates a document in the `guests` collection with those fields, sets `createdBy` to the volunteer's UID, and sets `createdAt` and `updatedAt` timestamps

### Requirement: Display guest profiles

The system SHALL display guest profiles as cards showing first name + last initial, preferred language, needs, visit count, last visit date, and recent notes.

#### Scenario: Guest list view

- **WHEN** a volunteer navigates to the Guests tab
- **THEN** the system displays all guest profiles as cards with summary info

#### Scenario: Guest detail view

- **WHEN** a volunteer clicks on a guest card
- **THEN** the system displays the full guest profile including visit log timeline, all notes, and documents given

### Requirement: Update a guest profile

The system SHALL allow authenticated volunteers to edit a guest's preferred language, needs, and name fields.

#### Scenario: Volunteer updates guest needs

- **WHEN** a volunteer adds "legal" to a guest's needs array
- **THEN** the system updates the guest document and sets `updatedAt`

### Requirement: Visit log

The system SHALL allow volunteers to log visits on a guest profile. Each visit entry SHALL include date, purpose, volunteer ID, notes, resources referred, and documents given.

#### Scenario: Volunteer logs a visit

- **WHEN** a volunteer clicks "Log Visit" on a guest profile and enters purpose "Housing assistance", notes "Referred to City Shelter", and selects resources and documents
- **THEN** the system appends a visit entry to the guest's `visitLog` array with the current timestamp, volunteer ID, and provided details

#### Scenario: Visit log displays as timeline

- **WHEN** a volunteer views a guest's detail page
- **THEN** the system displays the visit log as a chronological timeline with volunteer name, date, purpose, notes, and linked resources/documents

### Requirement: Guest quick notes

The system SHALL allow volunteers to add timestamped quick notes to a guest profile. Each note SHALL include text, volunteer ID, and timestamp.

#### Scenario: Volunteer adds a quick note

- **WHEN** a volunteer clicks "Add Note" on a guest profile and enters "Needs SNAP application help"
- **THEN** the system appends a note to the guest's `quickNotes` array with the text, volunteer ID, and current timestamp

### Requirement: Privacy-aware data model

The system SHALL store only first name and last initial for guests. The system SHALL NOT store full last names, social security numbers, or home addresses for guests.

#### Scenario: Guest creation enforces privacy

- **WHEN** a volunteer creates a guest profile
- **THEN** the form collects only first name and a single-character last initial, not a full last name
