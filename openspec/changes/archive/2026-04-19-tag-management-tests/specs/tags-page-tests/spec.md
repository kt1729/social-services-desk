## ADDED Requirements

### Requirement: TagsPage list rendering
The test suite SHALL verify that the tags list renders correctly from context data.

#### Scenario: Renders all tags sorted alphabetically
- **WHEN** `useData()` returns tags `[{ label: 'Shelter' }, { label: 'Food' }]`
- **THEN** "Food" appears before "Shelter" in the rendered list

#### Scenario: Shows usage count per tag
- **WHEN** a tag with id `t1` is referenced by 2 resources and 1 document in context
- **THEN** the tag row displays "3 items"

#### Scenario: Shows empty state when no tags exist
- **WHEN** `useData()` returns an empty `tags` array
- **THEN** "No tags yet." message is displayed and no list items are rendered

### Requirement: TagsPage add tag flow
The test suite SHALL verify the add tag modal opens and submits correctly.

#### Scenario: "+ Add Tag" button opens the modal
- **WHEN** a user clicks the "+ Add Tag" button
- **THEN** the "Add Tag" modal is visible with a label input

#### Scenario: Submitting a valid label calls addDoc
- **WHEN** a user types a new label in the modal and submits
- **THEN** `addDoc` is called with the correct label and auto-generated slug

#### Scenario: Duplicate label shows inline error
- **WHEN** a user types a label that matches an existing tag (case-insensitive) and submits
- **THEN** an error message "A tag with this name already exists." is displayed and `addDoc` is not called

### Requirement: TagsPage rename flow
The test suite SHALL verify inline rename behaviour.

#### Scenario: Clicking Rename makes the row editable
- **WHEN** a user clicks "Rename" on a tag row
- **THEN** an input field pre-filled with the tag's label is shown in that row

#### Scenario: Saving a valid rename calls updateDoc
- **WHEN** a user edits the label and clicks Save
- **THEN** `updateDoc` is called with the new label and regenerated slug

#### Scenario: Pressing Escape cancels the rename
- **WHEN** a user presses Escape while the rename input is focused
- **THEN** the input disappears and the original label is still shown

### Requirement: TagsPage delete flow
The test suite SHALL verify delete confirmation behaviour.

#### Scenario: Delete unused tag shows generic confirmation
- **WHEN** a user clicks "Delete" on a tag with 0 usage
- **THEN** a confirmation dialog appears without an in-use warning

#### Scenario: Delete in-use tag shows usage warning
- **WHEN** a user clicks "Delete" on a tag referenced by items in context
- **THEN** the confirmation dialog mentions the usage count

#### Scenario: Confirming delete calls deleteDoc
- **WHEN** a user confirms deletion in the dialog
- **THEN** `deleteDoc` is called with the correct tag document reference
