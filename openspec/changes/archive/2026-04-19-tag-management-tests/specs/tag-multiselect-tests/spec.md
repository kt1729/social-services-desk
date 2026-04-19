## ADDED Requirements

### Requirement: TagMultiselect renders correctly
The test suite SHALL verify the initial render state of `TagMultiselect` for both empty and populated `value` arrays.

#### Scenario: Shows placeholder when value is empty
- **WHEN** the component renders with `value={[]}` and `placeholder="Select tags…"`
- **THEN** the placeholder text is visible and no pills are rendered

#### Scenario: Shows pills for selected tag IDs
- **WHEN** the component renders with `value={['t1']}` and a `tags` array containing `{ id: 't1', label: 'Housing' }`
- **THEN** a pill with the text "Housing" is visible

#### Scenario: Skips orphaned tag IDs silently
- **WHEN** the component renders with `value={['unknown-id']}` and an empty `tags` array
- **THEN** no pill is rendered and no error is thrown

### Requirement: TagMultiselect selection and deselection
The test suite SHALL verify toggle behaviour when clicking tags in the dropdown.

#### Scenario: Selecting a tag calls onChange with the added ID
- **WHEN** a user opens the dropdown and clicks a tag not currently in `value`
- **THEN** `onChange` is called with the new ID appended to the existing `value`

#### Scenario: Deselecting a tag calls onChange with the ID removed
- **WHEN** a user opens the dropdown and clicks a tag that is already in `value`
- **THEN** `onChange` is called with that ID removed from the array

#### Scenario: Removing a pill calls onChange with the ID removed
- **WHEN** a user clicks the × button on a selected tag pill
- **THEN** `onChange` is called with that tag's ID removed

### Requirement: TagMultiselect search filter
The test suite SHALL verify that typing in the search box filters the visible tag list.

#### Scenario: Search filters tags case-insensitively
- **WHEN** a user opens the dropdown and types "hous"
- **THEN** only tags whose labels contain "hous" (case-insensitive) are visible in the list

#### Scenario: Search shows no-match message when filter yields zero results
- **WHEN** a user opens the dropdown and types a string that matches no tag labels
- **THEN** a "No matching tags." message is displayed

### Requirement: TagMultiselect empty and loading states
The test suite SHALL verify the dropdown empty and loading states.

#### Scenario: Loading state shows loading text
- **WHEN** the component renders with `tagsLoading={true}` and the dropdown is opened
- **THEN** "Loading…" text is displayed in the dropdown

#### Scenario: Empty tags list shows empty-state message
- **WHEN** `tags={[]}` and `tagsLoading={false}` and the dropdown is opened
- **THEN** "No tags yet." message is displayed
