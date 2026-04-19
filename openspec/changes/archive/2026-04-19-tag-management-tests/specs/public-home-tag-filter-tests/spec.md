## ADDED Requirements

### Requirement: PublicHome tag filter rendering
The test suite SHALL verify the tag filter pill row renders based on available tags.

#### Scenario: Tag filter pills render when tags exist
- **WHEN** `usePublicData()` returns a non-empty `tags` array
- **THEN** a pill button for each tag label is rendered below the category filter

#### Scenario: Tag filter section is hidden when no tags exist
- **WHEN** `usePublicData()` returns `tags: []`
- **THEN** no tag pill buttons are rendered

### Requirement: PublicHome tag filter logic
The test suite SHALL verify client-side filtering behaviour.

#### Scenario: Selecting a tag filters resources to matching tagIds
- **WHEN** a user clicks a tag pill and a resource has that tag's ID in its `tagIds`
- **THEN** only that resource is shown; resources without the tag are hidden

#### Scenario: Selecting a tag filters documents to matching tagIds
- **WHEN** a user clicks a tag pill and a document has that tag's ID in its `tagIds`
- **THEN** only that document is shown; documents without the tag are hidden

#### Scenario: Multiple selected tags use OR logic
- **WHEN** a user selects two tag pills
- **THEN** items matching either tag are shown

#### Scenario: Deselecting a tag restores unfiltered results
- **WHEN** a user clicks an active tag pill to deselect it
- **THEN** all items (subject to category filter) are shown again

#### Scenario: Tag filter and category filter combine with AND logic
- **WHEN** a user has a category filter active and selects a tag
- **THEN** only items matching BOTH the category AND the tag are shown

### Requirement: PublicDataProvider exposes tags
The test suite SHALL verify that `tags` is available from `usePublicData()` in local mode.

#### Scenario: tags field is present in context value
- **WHEN** `PublicDataProvider` renders in local mode
- **THEN** `usePublicData()` returns a `tags` field (array, may be empty)
