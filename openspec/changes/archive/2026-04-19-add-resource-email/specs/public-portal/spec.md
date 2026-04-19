## MODIFIED Requirements

### Requirement: Public resource detail
The public resource detail MUST display translated name, category badge, description, address, phone, email, and operating hours. Email MUST be rendered as a `mailto:` hyperlink. The public resource detail MUST NOT display edit/delete buttons, notes, feedback buttons, or document attachment picker. The public resource detail SHOULD display linked documents as clickable links to `/public/documents/:id`.

#### Scenario: Public resource detail shows email link
- **WHEN** a guest views a resource detail page for a resource with a non-empty `email` field
- **THEN** the contact block displays a `mailto:` hyperlink for the email address

#### Scenario: Public resource detail hides email when absent
- **WHEN** a guest views a resource detail page for a resource with no email address
- **THEN** no email element is rendered in the contact block
