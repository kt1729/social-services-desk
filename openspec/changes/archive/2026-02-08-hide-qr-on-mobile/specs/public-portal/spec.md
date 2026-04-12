## MODIFIED Requirements

### Requirement: Public home

The public home page MUST display both resources and documents in a combined view.
The public home page MUST include category filter tabs.
The public home page MUST display a QR code linking to itself (`/public`) on non-mobile viewports.
The public home page MUST hide the QR code section on mobile viewports.
The QR code URL MUST be permanent (just a route path, no expiry).
The QR code MUST include the organization logo centered within the code on non-mobile viewports.
The QR code SHOULD be printable.

#### Scenario: Desktop view shows QR code with logo

- **WHEN** a guest views the public home page on a desktop-sized viewport
- **THEN** the QR code is visible and includes the organization logo centered in the QR image

#### Scenario: Mobile view hides QR code

- **WHEN** a guest views the public home page on a mobile-sized viewport
- **THEN** the QR code section is not rendered or visible

#### Scenario: QR code links to public portal

- **WHEN** a guest scans the QR code
- **THEN** the QR code resolves to the `/public` route
