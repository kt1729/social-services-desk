## MODIFIED Requirements

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
