# global-search Specification

## Purpose

TBD - created by archiving change social-service-desk. Update Purpose after archive.

## Requirements

### Requirement: Cross-collection global search

The system SHALL provide a global search bar in the header that searches across resources, documents, and guests simultaneously. Results SHALL be grouped by collection type.

#### Scenario: Search returns results from multiple collections

- **WHEN** a volunteer types "food" in the global search bar
- **THEN** the system displays results grouped into three sections: Resources (matching resources), Documents (matching documents), and Guests (matching guests with "food" in their needs)

#### Scenario: Search returns no results

- **WHEN** a volunteer searches for a term with no matches
- **THEN** the system displays "No results found"

### Requirement: Resource search fields

The system SHALL search resources across: `name` (all languages), `description` (all languages), `category`, `tags` (plain string array), `tagIds` (resolved to tag labels via the `tags` collection), `address`, and branch sub-fields (`label`, `address`, `phone`, `email` of each branch in `branches`).

#### Scenario: Search matches resource by Spanish name

- **WHEN** a volunteer searches "refugio"
- **THEN** resources with "refugio" in their `name.es` field appear in results

#### Scenario: Search matches resource by tag

- **WHEN** a volunteer searches "emergency"
- **THEN** resources with "emergency" in their `tags` array appear in results

#### Scenario: Search matches resource by structured tag label

- **WHEN** a volunteer searches a tag name (e.g., "walk-in") that exists in the `tags` collection and is linked to a resource via `tagIds`
- **THEN** that resource appears in search results

#### Scenario: Search matches resource by branch address

- **WHEN** a volunteer searches a street name that appears in a branch's `address` field (not the top-level resource address)
- **THEN** the resource containing that branch appears in results

#### Scenario: Search matches resource by branch label

- **WHEN** a volunteer searches a branch location name (e.g., "Downtown Office")
- **THEN** the resource containing that branch appears in results

#### Scenario: Search matches resource by branch email

- **WHEN** a volunteer searches an email address that appears in a branch's `email` field
- **THEN** the resource containing that branch appears in results

### Requirement: Document search fields

The system SHALL search documents across: `title` (all languages), `description` (all languages), `category`, `tags` (plain string array), and `tagIds` (resolved to tag labels via the `tags` collection).

#### Scenario: Search matches document by title

- **WHEN** a volunteer searches "SNAP"
- **THEN** documents with "SNAP" in their title appear in results

#### Scenario: Search matches document by structured tag label

- **WHEN** a volunteer searches a tag name linked to a document via `tagIds`
- **THEN** that document appears in search results

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
