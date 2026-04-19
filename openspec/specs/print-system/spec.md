# print-system Specification

## Purpose

TBD - created by archiving change social-service-desk. Update Purpose after archive.

## Requirements

### Requirement: Print resource card in guest's language

The system SHALL generate a print-friendly resource card that renders in the guest's selected language. The card SHALL include: translated title header, resource name, category (translated), address, phone, email, website, hours, sanitized rich-text description, branch locations (if any), blank notes lines, and date. Descriptions SHALL be rendered as sanitized HTML, not raw text, so rich formatting is preserved without exposing markup.

#### Scenario: Print resource card in Spanish

- **WHEN** a volunteer clicks the print button on a resource card and selects "Spanish"
- **THEN** the system renders a clean print card with Spanish name, Spanish description (rendered as HTML), Spanish category label, the print header "SERVICIO SOCIAL / Tarjeta de Información", blank notes lines labeled "Notas:", and the current date labeled "Fecha:"

#### Scenario: Print resource card in Mandarin

- **WHEN** a volunteer prints a resource card in Mandarin
- **THEN** the card renders using Noto Sans SC font with Chinese headers "社会服务台 / 资源信息卡" and Chinese content

#### Scenario: Print resource card with branches

- **WHEN** a volunteer prints a resource card for a resource that has branch locations
- **THEN** the card includes a "Locations" section listing each branch with its label, address (if present), phone (if present), and operating hours (if present)

#### Scenario: Print resource card without branches

- **WHEN** a volunteer prints a resource card for a resource with no branches
- **THEN** the card does not include a Locations section

### Requirement: Language selector before print

The system SHALL display a language selector when a volunteer clicks any print button. The selector SHALL show the four supported languages. For guest profiles, it SHALL default to the guest's preferred language.

#### Scenario: Language selector appears before printing

- **WHEN** a volunteer clicks the print button on any printable item
- **THEN** a language selector appears with options: English, Spanish, Mandarin, Haitian Creole

#### Scenario: Guest profile defaults to preferred language

- **WHEN** a volunteer prints from a guest profile where preferred language is "es"
- **THEN** the language selector defaults to Spanish

### Requirement: CSS @media print hides UI chrome

The system SHALL use CSS `@media print` rules to hide all application UI elements (header, sidebar, navigation, buttons) and show only the print card content when the browser print dialog is invoked.

#### Scenario: Print view shows only card content

- **WHEN** the browser print dialog is triggered
- **THEN** the header, sidebar, footer, and all interactive buttons are hidden; only the print card is visible

### Requirement: Print document card with QR code

The system SHALL generate a print card for link-type documents that includes the document title, category, sanitized rich-text description, URL text, and a QR code generated from the URL. The card SHALL render in the selected language. Descriptions SHALL be rendered as sanitized HTML, not raw text.

#### Scenario: Print link document in Haitian Creole

- **WHEN** a volunteer prints a link-type document card in Haitian Creole
- **THEN** the card displays with Haitian Creole headers "SÈVIS SOSYAL / Kat Enfòmasyon Resous", the translated title, description rendered as HTML, "Vizite sit entènèt sa a:" with the URL, "Eskane pou ouvri:" with a QR code, blank notes lines, and the date

### Requirement: Print guest summary

The system SHALL allow printing a guest summary showing the guest's name, preferred language, needs, recent visit log entries, and documents given.

#### Scenario: Print guest summary

- **WHEN** a volunteer clicks print on a guest profile
- **THEN** the system renders a print-friendly summary with the guest's name, needs, recent visits, and documents given

### Requirement: Static print header translations

The system SHALL store print card header translations as static constants in application code. Headers include: title, subtitle, notes label, date label, scan label, and website visit label in all four languages.

#### Scenario: Print headers render in correct language

- **WHEN** a print card is rendered in any supported language
- **THEN** the header text (title, subtitle, labels) uses the corresponding static translation from the PRINT_HEADERS constant
