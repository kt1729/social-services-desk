## MODIFIED Requirements

### Requirement: Create a resource
The system SHALL allow authenticated volunteers to create a new community resource with the following fields: name (multilingual), description (multilingual), category, address, phone, email, website, openDays, openHours, tags, and notes. The `email` field SHALL be an optional plain string (not multilingual). The form SHALL render an email input with `type="email"` in the English-only contact info section beside website.

#### Scenario: Volunteer creates a resource with an email address
- **WHEN** a volunteer enters an email address in the email field and saves
- **THEN** the system stores `email` as a string on the resource document in Firestore

#### Scenario: Volunteer creates a resource without an email address
- **WHEN** a volunteer leaves the email field blank and saves
- **THEN** the system stores `email` as an empty string (or omits the field) without error

### Requirement: Read and display resources
The system SHALL display resources as cards showing name, category, address, phone, email, hours, description, feedback counts, and linked documents. Email SHALL be rendered as a `mailto:` hyperlink. Email SHALL be displayed beside website in both card and detail views.

#### Scenario: Resource card shows email link
- **WHEN** a resource has a non-empty `email` field
- **THEN** the resource card displays a `mailto:` link for the email address

#### Scenario: Resource card hides email when absent
- **WHEN** a resource has no `email` field or an empty string
- **THEN** no email element is rendered on the resource card

#### Scenario: Resource detail shows email link
- **WHEN** a volunteer views the full resource detail for a resource with an email address
- **THEN** the detail view displays a `mailto:` hyperlink for the email beside the website

### Requirement: Update a resource
The system SHALL allow authenticated volunteers to edit any resource's fields including the `email` field.

#### Scenario: Volunteer updates resource email
- **WHEN** a volunteer edits a resource's email address and saves
- **THEN** the system updates the `email` field in Firestore and sets `updatedAt` to the current timestamp
