## MODIFIED Requirements

### Requirement: Public home

The public home page MUST display both resources and documents in a combined view.
The public home page MUST include category filter tabs.
The public home page MUST NOT display the QR code inline within the page content.
The QR code URL MUST be permanent (just a route path, no expiry).
The QR code MUST be accessible from a header icon next to the language selector on non-mobile viewports.
The QR code MUST be hidden on mobile viewports.
The QR code MUST include the organization logo centered within the code when displayed.
The QR code SHOULD be printable.

#### Scenario: Mobile view hides QR icon

- **WHEN** a guest views the public portal on a mobile-sized viewport
- **THEN** the QR icon is not visible in the header

#### Scenario: Desktop view shows QR icon

- **WHEN** a guest views the public portal on a desktop-sized viewport
- **THEN** the QR icon is visible next to the language selector

#### Scenario: QR code links to public portal

- **WHEN** a guest scans the QR code from the popover
- **THEN** the QR code resolves to the `/public` route
