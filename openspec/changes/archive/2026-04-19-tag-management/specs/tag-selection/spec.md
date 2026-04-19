## ADDED Requirements

### Requirement: TagMultiselect component
The system SHALL provide a reusable `TagMultiselect` controlled React component that allows selecting zero or more tags from the registry. The component SHALL accept `value: string[]` (selected tag IDs), `onChange: (ids: string[]) => void`, and an optional `placeholder` prop. It SHALL be built with Tailwind CSS primitives and no additional npm dependencies.

#### Scenario: No tags selected — shows placeholder
- **WHEN** the component is rendered with an empty `value` array
- **THEN** the trigger button displays the placeholder text (default: "Select tags…")

#### Scenario: Tags selected — shows pills
- **WHEN** the component has one or more tag IDs in `value`
- **THEN** the trigger button displays the selected tags as removable pills showing their labels

### Requirement: Tag search and selection
The dropdown SHALL display all available tags from the `tags` collection. The admin MUST be able to filter the list by typing. Selecting a tag SHALL add its ID to the value array. Selecting an already-selected tag SHALL remove it (toggle behavior).

#### Scenario: Admin opens dropdown and searches
- **WHEN** an admin opens the TagMultiselect and types "hous"
- **THEN** the dropdown filters to only tags whose labels contain "hous" (case-insensitive)

#### Scenario: Admin selects a tag
- **WHEN** an admin clicks a tag in the dropdown
- **THEN** the tag ID is added to the value array and the tag appears as a pill in the trigger

#### Scenario: Admin deselects a tag via dropdown
- **WHEN** an admin clicks an already-selected tag in the dropdown
- **THEN** the tag ID is removed from the value array

#### Scenario: Admin removes a pill
- **WHEN** an admin clicks the × on a selected tag pill
- **THEN** the tag ID is removed from the value array

### Requirement: Empty and loading states
The component SHALL handle the case where the tag list is still loading (show a loading indicator in the dropdown) and where no tags exist (show an empty-state message with a link to the Tags admin page).

#### Scenario: Tags loading
- **WHEN** the component renders before the `tags` collection has loaded
- **THEN** the dropdown displays a loading spinner

#### Scenario: No tags available
- **WHEN** the `tags` collection is empty and the dropdown is opened
- **THEN** the dropdown displays "No tags yet. Create tags in Settings → Tags."

### Requirement: Unknown tag ID handling
If a `value` array contains a tag ID that no longer exists in the `tags` collection (e.g., deleted tag), the component SHALL silently skip rendering a pill for that ID rather than crashing or showing a broken label.

#### Scenario: Orphaned tag ID in value
- **WHEN** the component receives a `value` containing an ID not present in the `tags` collection
- **THEN** no pill is rendered for that ID and no error is thrown
