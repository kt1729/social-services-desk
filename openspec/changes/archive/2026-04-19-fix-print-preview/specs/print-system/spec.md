## MODIFIED Requirements

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

### Requirement: Print document card with QR code

The system SHALL generate a print card for link-type documents that includes the document title, category, sanitized rich-text description, URL text, and a QR code generated from the URL. The card SHALL render in the selected language. Descriptions SHALL be rendered as sanitized HTML, not raw text.

#### Scenario: Print link document in Haitian Creole

- **WHEN** a volunteer prints a link-type document card in Haitian Creole
- **THEN** the card displays with Haitian Creole headers, the translated title, description rendered as HTML, "Vizite sit entènèt sa a:" with the URL, "Eskane pou ouvri:" with a QR code, blank notes lines, and the date
