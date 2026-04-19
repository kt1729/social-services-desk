## MODIFIED Requirements

### Requirement: Public resource detail
The public resource detail MUST display translated name, category badge, description, address, phone, and operating hours. The description MUST be rendered using `RichTextDisplay` (sanitized HTML). The public resource detail MUST NOT display edit/delete buttons, notes, feedback buttons, or document attachment picker. The public resource detail SHOULD display linked documents as clickable links to `/public/documents/:id`.

#### Scenario: Public resource detail renders formatted description
- **WHEN** a guest views a resource detail page whose description contains HTML formatting (bold, list)
- **THEN** the formatted description is rendered visually with bold text and bullet points

#### Scenario: Public resource detail strips unsafe HTML
- **WHEN** a resource description contains a `<script>` tag or `onclick` attribute
- **THEN** the dangerous content is removed by DOMPurify before rendering

### Requirement: Public document detail
The public document detail MUST display translated title, category badge, description, type icon, and language availability. The description MUST be rendered using `RichTextDisplay` (sanitized HTML). The public document detail MUST display PDF/image previews via Supabase signed URLs. The public document detail MUST NOT display edit/delete buttons, notes, or print button. The public document detail SHOULD display linked resources as clickable links to `/public/resources/:id`.

#### Scenario: Public document detail renders formatted description
- **WHEN** a guest views a document detail page whose description contains HTML formatting
- **THEN** the formatted description is rendered visually with appropriate styling

#### Scenario: Public document detail strips unsafe HTML
- **WHEN** a document description contains unsafe HTML
- **THEN** the dangerous content is removed by DOMPurify before rendering
