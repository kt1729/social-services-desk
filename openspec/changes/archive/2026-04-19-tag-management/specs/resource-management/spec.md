## MODIFIED Requirements

### Requirement: Tag-based organization
The system SHALL support tag selection on resources using tag IDs from the central `tags` Firestore collection. Resources SHALL store selected tags as `tagIds: string[]` (an array of Firestore document IDs from the `tags` collection). The resource form SHALL use the `TagMultiselect` component for tag selection instead of a free-text field.

#### Scenario: Volunteer adds tags to a resource
- **WHEN** a volunteer opens the tag field on a resource form and selects "Emergency Housing" and "Overnight Shelter" from the `TagMultiselect` dropdown
- **THEN** the system stores `tagIds: ["<emergencyHousingId>", "<overnightShelterId>"]` on the resource document in Firestore

#### Scenario: Volunteer removes a tag from a resource
- **WHEN** a volunteer removes a tag pill from the `TagMultiselect` on a resource form and saves
- **THEN** the corresponding tag ID is removed from the resource's `tagIds` array in Firestore

#### Scenario: Resource with no tags
- **WHEN** a volunteer saves a resource with no tags selected
- **THEN** the resource document stores `tagIds: []` (empty array)
