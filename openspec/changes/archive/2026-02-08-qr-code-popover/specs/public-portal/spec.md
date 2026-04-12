## MODIFIED Requirements

### Requirement: Public home

The public home page MUST display both resources and documents in a combined view.
The public home page MUST include category filter tabs.
The public home page MUST NOT display the QR code inline within the page content.
The QR code URL MUST be permanent (just a route path, no expiry).
The QR code MUST be accessible from a header icon next to the language selector.
The QR code MUST include the organization logo centered within the code when displayed.
The QR code SHOULD be printable.

#### Scenario: Home page has no inline QR

- **WHEN** a guest views the public home page
- **THEN** the QR code section is not visible within the page content

#### Scenario: QR accessible from header icon

- **WHEN** a guest clicks the QR icon in the public header
- **THEN** a popover/modal opens showing the QR code

#### Scenario: QR code links to public portal

- **WHEN** a guest scans the QR code from the popover
- **THEN** the QR code resolves to the `/public` route
