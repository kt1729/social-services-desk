## Why

The public portal QR code is redundant when visitors are already on a phone, and it takes valuable screen space. Adding the logo in the QR code reinforces branding for printed/desktop use.

## What Changes

- Hide the QR code section on mobile-sized viewports.
- Add the organization logo centered inside the QR code on larger screens.

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `public-portal`: Public home QR code behavior and presentation changes.

## Impact

- `src/features/public/PublicHome.tsx` (QR code rendering and responsive visibility)
- QR code generation settings (`qrcode.react`)
- Possible snapshot/unit tests for PublicHome
