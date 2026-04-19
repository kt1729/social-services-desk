# document-library Specification

## Purpose

TBD - created by archiving change social-service-desk. Update Purpose after archive.

## Requirements

### Requirement: Create a document entry

The system SHALL allow authenticated volunteers to create a document entry with title (multilingual), description (multilingual), type, category, tagIds, and print settings. The `tagIds` field SHALL store an array of Firestore document IDs from the `tags` collection, selected via the `TagMultiselect` component. The previous free-text `tags` field is replaced by `tagIds`.

#### Scenario: Volunteer uploads a PDF document

- **WHEN** a volunteer selects type "PDF Upload", enters title and description, selects a category, selects tags via the `TagMultiselect` picker, uploads a PDF file, and clicks Save
- **THEN** the system uploads the file to Firebase Storage at `documents/{documentId}/en/`, creates a document entry in the `documents` collection with `type: "pdf"`, `source.storagePath` pointing to the uploaded file, and `tagIds` containing the selected tag IDs

#### Scenario: Volunteer adds a website link

- **WHEN** a volunteer selects type "Website Link", enters a URL, and selects tags via the `TagMultiselect` picker
- **THEN** the system creates a document entry with `type: "link"`, `source.url` set to the provided URL, and `tagIds` containing the selected tag IDs

#### Scenario: Volunteer creates an internal document

- **WHEN** a volunteer selects type "Internal Document", enters text content, and selects tags
- **THEN** the system creates a document entry with `type: "internal"`, `source.internalContent.en` set to the provided text, and `tagIds` containing the selected tag IDs

#### Scenario: Volunteer uploads an image/flyer

- **WHEN** a volunteer selects type "Image / Flyer Upload", uploads an image file, and selects tags
- **THEN** the system uploads to Firebase Storage and creates a document entry with `type: "image"` and `tagIds` containing the selected tag IDs

### Requirement: Per-language file versions

The system SHALL support separate file uploads for each language (en, es, zh, ht). Each language version SHALL be stored at its own Firebase Storage path.

#### Scenario: Volunteer uploads a Spanish version of a document

- **WHEN** a volunteer opens a document's edit form and uploads a PDF under the Spanish language section
- **THEN** the system uploads to `documents/{documentId}/es/` and sets `languages.es.available: true` and `languages.es.storagePath` to the upload path

#### Scenario: Language version not available

- **WHEN** no file has been uploaded for a language
- **THEN** the `languages.{lang}.available` field SHALL be `false` and `storagePath` SHALL be `null`

### Requirement: Display document library

The system SHALL display documents in a list/grid view showing title, type icon, category, available languages, and linked resources.

#### Scenario: Document library view

- **WHEN** a volunteer navigates to the Documents tab
- **THEN** the system displays all documents with their type icon (PDF/link/internal/image), English title, category, language availability flags, and linked resource names

#### Scenario: Filter documents by type

- **WHEN** a volunteer selects "PDF" from the type filter dropdown
- **THEN** the system displays only documents with `type: "pdf"`

#### Scenario: Filter documents by category

- **WHEN** a volunteer selects a category from the category filter dropdown
- **THEN** the system displays only documents matching that category

### Requirement: Document preview

The system SHALL allow volunteers to preview documents. PDF and image types SHALL display inline. Links SHALL open in a new tab. Internal documents SHALL render the text content.

#### Scenario: Volunteer previews a PDF

- **WHEN** a volunteer clicks "Preview" on a PDF document
- **THEN** the system displays the PDF inline using the browser's PDF viewer or an embedded viewer

#### Scenario: Volunteer opens a link document

- **WHEN** a volunteer clicks "Open Link" on a link-type document
- **THEN** the system opens the URL in a new browser tab

### Requirement: Link documents to resources

The system SHALL allow volunteers to link documents to resources bidirectionally. The document stores `linkedResources` (resource IDs) and the resource stores `linkedDocuments` (document IDs).

#### Scenario: Volunteer links a document to resources during creation

- **WHEN** a volunteer searches for and selects resources in the "Link to Resources" section of the document form
- **THEN** the system adds the resource IDs to the document's `linkedResources` array and adds the document ID to each selected resource's `linkedDocuments` array

### Requirement: QR code generation for link documents

The system SHALL generate QR codes client-side using qrcode.js for documents of type "link". QR codes SHALL be displayed on print cards.

#### Scenario: QR code generated for a link document

- **WHEN** a volunteer prints a link-type document card
- **THEN** the system generates a QR code from the document's URL and displays it on the print card

### Requirement: Print settings per document

The system SHALL store print settings per document: paper size (letter/half/quarter), orientation (portrait/landscape), and showQRCode (boolean).

#### Scenario: Volunteer configures print settings

- **WHEN** a volunteer sets paper size to "half" and orientation to "landscape" on a document
- **THEN** the system stores these settings and applies them when the document's print card is rendered

### Requirement: File size limit enforcement

The system SHALL enforce a maximum file size of 10MB per upload, consistent with Firebase Storage security rules.

#### Scenario: Volunteer attempts to upload a file over 10MB

- **WHEN** a volunteer selects a file larger than 10MB
- **THEN** the system displays an error message and prevents the upload

### Requirement: Delete a document

The system SHALL allow only admin-role volunteers to soft-delete documents. Soft-deletion SHALL set `active: false` and record a `deletedAt` timestamp on the document; the Firestore document and associated Firebase Storage files SHALL NOT be removed. Admins MAY view soft-deleted documents via a "Show deleted" toggle and restore them.

#### Scenario: Admin soft-deletes a document

- **WHEN** an admin clicks delete on a document and confirms
- **THEN** the system sets `active: false` and `deletedAt` to the current timestamp on the document, and the document no longer appears in the active list; Storage files are preserved

#### Scenario: Admin cancels deletion

- **WHEN** an admin clicks delete but cancels the confirmation dialog
- **THEN** no change is made and the document remains in the active list

#### Scenario: Admin views deleted documents

- **WHEN** an admin toggles "Show deleted" on the document list
- **THEN** the page displays soft-deleted documents in a visually distinct (dimmed) state

#### Scenario: Admin restores a soft-deleted document

- **WHEN** an admin clicks "Restore" on a soft-deleted document
- **THEN** the system sets `active: true` and removes `deletedAt` from the document, and the document reappears in the active list
