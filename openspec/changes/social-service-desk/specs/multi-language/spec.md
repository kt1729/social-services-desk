## ADDED Requirements

### Requirement: Four supported languages

The system SHALL support four languages: English (en), Spanish (es), Mandarin Chinese (zh), and Haitian Creole (ht). Language codes SHALL be used consistently across all multilingual fields.

#### Scenario: Language codes used in resource content

- **WHEN** a resource stores multilingual name and description fields
- **THEN** the fields use keys `en`, `es`, `zh`, `ht` as nested object properties

### Requirement: English-only volunteer UI

The system SHALL render all volunteer-facing UI elements (navigation, buttons, labels, form fields) in English only. Translations apply only to guest-facing content (resource names, descriptions, notes, document titles, and print cards).

#### Scenario: UI labels remain English regardless of content language

- **WHEN** a volunteer views a resource with Spanish translations
- **THEN** the form labels, buttons, and navigation remain in English; only the content fields show Spanish text

### Requirement: Static category translations in application code

The system SHALL store category translations (10 categories × 4 languages) as static constants in the application code, not in Firestore. Categories: housing, food, medical, mental_health, legal, employment, financial, transportation, clothing, other.

#### Scenario: Category displayed in guest's language on print card

- **WHEN** a resource card is printed in Spanish
- **THEN** the category "housing" displays as "Vivienda y Refugio" using the static translation map

### Requirement: Translatable content fields

The system SHALL support multilingual content on: resource `name`, resource `description`, resource `notes[].text`, document `title`, document `description`, and document `source.internalContent`. Each field SHALL be an object with language code keys.

#### Scenario: Resource name stored in multiple languages

- **WHEN** a volunteer enters "City Shelter Downtown" as English name and "Refugio del Centro" as Spanish name
- **THEN** the system stores `name: { en: "City Shelter Downtown", es: "Refugio del Centro" }`

### Requirement: Translation status tracking

The system SHALL track translation completeness per language per resource and document. Status values SHALL be: "complete" (all translatable fields filled), "partial" (some fields filled), or "missing" (no translations for that language).

#### Scenario: Translation status set to complete

- **WHEN** a volunteer provides Spanish translations for all translatable fields on a resource (name, description)
- **THEN** the system sets `translationStatus.es` to "complete"

#### Scenario: Translation status set to partial

- **WHEN** a volunteer provides a Spanish name but no Spanish description on a resource
- **THEN** the system sets `translationStatus.es` to "partial"

#### Scenario: Translation status set to missing

- **WHEN** a resource has no Mandarin translations
- **THEN** the `translationStatus.zh` field SHALL be "missing"

### Requirement: Translation dashboard

The system SHALL provide a translation dashboard that displays translation completeness across all resources and documents for each language, with overall percentage per language and the ability to filter to items with missing translations.

#### Scenario: Dashboard shows overall translation progress

- **WHEN** a volunteer navigates to the Translation Dashboard
- **THEN** the system displays a table of resources and documents with translation status icons (complete/partial/missing) per language and overall percentages (e.g., "ES 80% | ZH 40% | HT 55%")

#### Scenario: Filter to missing translations

- **WHEN** a volunteer clicks "Missing translations only"
- **THEN** the dashboard shows only items where at least one language has status "missing"

### Requirement: Chinese font support

The system SHALL load Google Fonts "Noto Sans SC" for rendering Mandarin Chinese characters. The font SHALL be applied to elements displaying Chinese content and print cards with language "zh".

#### Scenario: Chinese text renders correctly

- **WHEN** a resource's Mandarin name "市中心收容所" is displayed
- **THEN** the text renders using Noto Sans SC font with correct CJK characters

### Requirement: Manual translation entry

The system SHALL NOT use auto-translation APIs. All translations SHALL be entered manually by volunteers through the translation tabs on resource and document edit forms.

#### Scenario: Volunteer manually enters translation

- **WHEN** a volunteer opens the translation tab on a resource edit form
- **THEN** the system shows text fields for each language where the volunteer types translations manually
