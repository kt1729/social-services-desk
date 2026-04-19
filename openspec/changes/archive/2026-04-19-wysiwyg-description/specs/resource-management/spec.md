## MODIFIED Requirements

### Requirement: Create a resource
The system SHALL allow authenticated volunteers to create a new community resource with the following fields: name (multilingual), description (multilingual), category, address, phone, website, openDays, openHours, tags, and notes. The description field SHALL use the `RichTextEditor` component; the stored value SHALL be an HTML string. The `description` Firestore field type remains `string`.

#### Scenario: Volunteer creates a resource with English content
- **WHEN** a volunteer fills out the resource creation form with English name, description (via WYSIWYG editor), category, and contact details and clicks Save
- **THEN** the system creates a new document in the `resources` collection with the provided fields (description stored as HTML), sets `createdBy` to the volunteer's UID, sets `createdAt` and `updatedAt` timestamps, and initializes `feedbackSummary` to zero

#### Scenario: Volunteer creates a resource with translations
- **WHEN** a volunteer fills out the resource form including Spanish, Mandarin, or Haitian Creole translations using the WYSIWYG editor
- **THEN** the system stores the translations in the nested `name` and `description` objects (description as HTML) and sets `translationStatus` for each provided language to "complete"

### Requirement: Read and display resources
The system SHALL display resources as cards showing name, category, address, phone, hours, description, feedback counts, and linked documents. The description field SHALL be rendered using `RichTextDisplay` (sanitized HTML rendering).

#### Scenario: Resource list displays all resources
- **WHEN** a volunteer navigates to the Resources tab
- **THEN** the system displays all resources as cards with their English name, category icon, address, phone, hours, and feedback summary

#### Scenario: Resource detail view
- **WHEN** a volunteer clicks on a resource card
- **THEN** the system displays the full resource detail including all fields with description rendered as formatted HTML, notes, linked documents, and feedback
