## ADDED Requirements

### Requirement: Public tag filter
The public home page MUST display a tag filter that allows guests to filter the combined resource and document listing by one or more tags. The filter SHALL use tag labels resolved from the `tags` collection. The filter SHALL be rendered as a pill/toggle group consistent with the existing category filter tabs. Selecting multiple tags SHALL show items that match ANY of the selected tags (OR logic). Selecting no tags SHALL show all items.

#### Scenario: Guest filters by a single tag
- **WHEN** a guest clicks the "Emergency Housing" tag pill on the public home page
- **THEN** the listing shows only resources and documents whose `tagIds` array contains the ID for "Emergency Housing"

#### Scenario: Guest filters by multiple tags
- **WHEN** a guest selects both "Emergency Housing" and "Food" tag pills
- **THEN** the listing shows resources and documents whose `tagIds` array contains the ID for "Emergency Housing" OR "Food"

#### Scenario: Guest clears tag filter
- **WHEN** a guest deselects all active tag pills
- **THEN** the listing returns to showing all items (subject to any active category filter)

#### Scenario: Tag filter and category filter combine
- **WHEN** a guest has a category filter active and also selects a tag
- **THEN** the listing shows only items matching BOTH the active category AND at least one selected tag

#### Scenario: Tag filter not shown when no tags exist
- **WHEN** the `tags` collection is empty
- **THEN** the tag filter section is not rendered on the public home page

## MODIFIED Requirements

### Requirement: Public home
The public home page MUST display both resources and documents in a combined view.
The public home page MUST include category filter tabs.
The public home page MUST include a tag filter pill group when tags exist in the `tags` collection.
The public home page MUST NOT display the QR code inline within the page content.
The QR code URL MUST be permanent (just a route path, no expiry).
The QR code MUST be accessible from a header icon next to the language selector on non-mobile viewports.
The QR code MUST be hidden on mobile viewports.
The QR code MUST include the organization logo centered within the code when displayed.
The QR code SHOULD be printable.

#### Scenario: Home page has no inline QR
- **WHEN** a guest views the public home page
- **THEN** the QR code section is not visible within the page content

#### Scenario: QR accessible from header icon
- **WHEN** a guest clicks the QR icon in the public header
- **THEN** a popover/modal opens showing the QR code

#### Scenario: Mobile view hides QR icon
- **WHEN** a guest views the public portal on a mobile-sized viewport
- **THEN** the QR icon is not visible in the header

#### Scenario: Desktop view shows QR icon
- **WHEN** a guest views the public portal on a desktop-sized viewport
- **THEN** the QR icon is visible next to the language selector

#### Scenario: QR code links to public portal
- **WHEN** a guest scans the QR code from the popover
- **THEN** the QR code resolves to the `/public` route
