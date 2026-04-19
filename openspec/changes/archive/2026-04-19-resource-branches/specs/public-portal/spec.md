## MODIFIED Requirements

### Requirement: Public resource detail
The public resource detail MUST display translated name, category badge, description, address, phone, email, and operating hours. When a resource has branches, the public resource detail MUST display a "Locations" section below the main contact block listing each branch with its label, address, phone, email, and hours. Branch email MUST be rendered as a `mailto:` hyperlink. Branch phone MUST be rendered as a `tel:` hyperlink. The public resource detail MUST NOT display edit/delete buttons, notes, feedback buttons, or document attachment picker.

#### Scenario: Public detail shows branch locations
- **WHEN** a guest views a resource detail page for a resource with branches
- **THEN** a "Locations" section is shown beneath the contact block, listing each branch by label with its address, phone, email, and hours

#### Scenario: Public detail hides locations section when no branches
- **WHEN** a guest views a resource detail page for a resource with no branches
- **THEN** no "Locations" section is rendered
