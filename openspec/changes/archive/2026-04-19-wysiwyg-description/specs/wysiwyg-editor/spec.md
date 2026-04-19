## ADDED Requirements

### Requirement: RichTextEditor component
The system SHALL provide a reusable `RichTextEditor` controlled React component for editing rich-text description fields. The component SHALL accept `value: string` (HTML), `onChange: (html: string) => void`, and an optional `placeholder: string`. It SHALL use Tiptap with StarterKit and Link extensions. The toolbar SHALL include buttons for: bold, italic, unordered list, ordered list, link, and clear formatting. The component SHALL be styled with Tailwind CSS and require no additional CSS imports.

#### Scenario: Empty editor shows placeholder
- **WHEN** the component is rendered with an empty `value`
- **THEN** the editor displays the placeholder text

#### Scenario: Volunteer bolds selected text
- **WHEN** a volunteer selects text in the editor and clicks the Bold toolbar button
- **THEN** the selected text is wrapped in `<strong>` and `onChange` is called with the updated HTML

#### Scenario: Volunteer creates a bullet list
- **WHEN** a volunteer clicks the unordered list toolbar button
- **THEN** the current paragraph becomes a `<ul><li>` list item and `onChange` is called with updated HTML

#### Scenario: Volunteer adds a link
- **WHEN** a volunteer selects text and clicks the Link toolbar button and enters a URL
- **THEN** the selected text becomes an `<a href="...">` element and `onChange` is called with updated HTML

### Requirement: RichTextDisplay component
The system SHALL provide a reusable `RichTextDisplay` component for rendering HTML description content safely. The component SHALL accept `html: string` and an optional `className: string`. It SHALL sanitize the HTML using `DOMPurify.sanitize` before rendering via `dangerouslySetInnerHTML`. It SHALL apply prose styling so lists, bold, italic, and links render with appropriate visual formatting.

#### Scenario: HTML content renders formatted
- **WHEN** `RichTextDisplay` receives `html` containing `<strong>`, `<ul>`, and `<a>` elements
- **THEN** the output renders bold text, a bullet list, and a clickable link

#### Scenario: Malicious script tag is stripped
- **WHEN** `RichTextDisplay` receives `html` containing a `<script>` tag
- **THEN** the script tag is removed by DOMPurify and not rendered in the DOM

#### Scenario: Plain-text legacy value renders without error
- **WHEN** `RichTextDisplay` receives a plain-text string with no HTML tags
- **THEN** the text is rendered as-is without corruption or error
