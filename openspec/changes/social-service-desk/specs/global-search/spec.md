## ADDED Requirements

### Requirement: Cross-collection global search

The system SHALL provide a global search bar in the header that searches across resources, documents, and guests simultaneously. Results SHALL be grouped by collection type.

#### Scenario: Search returns results from multiple collections

- **WHEN** a volunteer types "food" in the global search bar
- **THEN** the system displays results grouped into three sections: Resources (matching resources), Documents (matching documents), and Guests (matching guests with "food" in their needs)

#### Scenario: Search returns no results

- **WHEN** a volunteer searches for a term with no matches
- **THEN** the system displays "No results found"

### Requirement: Resource search fields

The system SHALL search resources across: `name` (all languages), `description` (all languages), `category`, `tags`, and `address`.

#### Scenario: Search matches resource by Spanish name

- **WHEN** a volunteer searches "refugio"
- **THEN** resources with "refugio" in their `name.es` field appear in results

#### Scenario: Search matches resource by tag

- **WHEN** a volunteer searches "emergency"
- **THEN** resources with "emergency" in their `tags` array appear in results

### Requirement: Document search fields

The system SHALL search documents across: `title` (all languages), `description` (all languages), `category`, and `tags`.

#### Scenario: Search matches document by title

- **WHEN** a volunteer searches "SNAP"
- **THEN** documents with "SNAP" in their title appear in results

### Requirement: Guest search fields

The system SHALL search guests across: `firstName`, `lastInitial`, `needs`, and `quickNotes` text.

#### Scenario: Search matches guest by name

- **WHEN** a volunteer searches "Maria"
- **THEN** guests with first name "Maria" appear in results

#### Scenario: Search matches guest by need

- **WHEN** a volunteer searches "housing"
- **THEN** guests with "housing" in their needs array appear in results

### Requirement: Client-side search implementation

The system SHALL implement search client-side by filtering in-memory data loaded from Firestore real-time listeners. Search SHALL be case-insensitive and match partial strings.

#### Scenario: Case-insensitive partial match

- **WHEN** a volunteer searches "shel"
- **THEN** resources with "Shelter" in their name appear in results (case-insensitive, partial match)
