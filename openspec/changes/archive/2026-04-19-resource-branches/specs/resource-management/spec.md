## MODIFIED Requirements

### Requirement: Create a resource
The system SHALL allow authenticated volunteers to create a new community resource with the following fields: name (multilingual), description (multilingual), category, address, phone, email, website, openDays, openHours, tags, notes, and an optional list of branches. Each branch SHALL have a `label` (required), and optional `address`, `phone`, `email`, and `operatingHours` fields. Branch IDs SHALL be generated client-side using `crypto.randomUUID()`. The branch management UI SHALL appear in the English-only contact section of the form.

#### Scenario: Volunteer adds a branch to a new resource
- **WHEN** a volunteer clicks "+ Add Branch" in the resource form and enters a label and address for the branch
- **THEN** the system saves the resource with a `branches` array containing the new branch including a generated `id`

#### Scenario: Volunteer saves a resource with no branches
- **WHEN** a volunteer saves a resource without adding any branches
- **THEN** the system saves the resource with `branches: []` and no branch-related fields are shown on the card

#### Scenario: Branch label is required
- **WHEN** a volunteer attempts to save a branch with an empty label
- **THEN** the branch label input is marked invalid and the form cannot be submitted

### Requirement: Read and display resources
The system SHALL display resources as cards showing name, category, address, phone, hours, description, feedback counts, and linked documents. When a resource has one or more branches, the card SHALL display a "N locations" badge. The resource detail view SHALL display a "Locations" section listing each branch with its label and contact details (address, phone, email, hours) after the parent contact block.

#### Scenario: Resource card shows branch count
- **WHEN** a resource has 2 or more branches
- **THEN** the resource card displays a badge showing "2 locations"

#### Scenario: Resource card hides branch count when no branches
- **WHEN** a resource has no branches or an empty branches array
- **THEN** no branch badge is shown on the card

#### Scenario: Resource detail shows branch list
- **WHEN** a volunteer views the detail page of a resource with branches
- **THEN** a "Locations" section appears below the main contact block listing each branch's label, address, phone, email, and hours

#### Scenario: Resource detail hides branch section when no branches
- **WHEN** a resource has no branches
- **THEN** no "Locations" section is rendered in the detail view

### Requirement: Update a resource
The system SHALL allow authenticated volunteers to edit branches on an existing resource: add new branches, edit existing branch fields, and remove branches. Removing a branch SHALL immediately reflect in the saved document.

#### Scenario: Volunteer removes a branch
- **WHEN** a volunteer clicks "Remove" on a branch in the edit form and saves
- **THEN** the branch is removed from the `branches` array in Firestore
