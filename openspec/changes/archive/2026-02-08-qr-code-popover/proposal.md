## Why

The QR code is no longer needed inline on the public home page and should be available on demand. Moving it into a small header icon reduces clutter while keeping access to the QR code for users who need to share the page.

## What Changes

- Remove the inline QR section from the public home page.
- Add a QR icon next to the language selector that opens a QR code popover/modal.

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `public-portal`: Public home QR availability and access pattern changes.

## Impact

- `src/features/public/PublicHome.tsx` (remove QR section)
- `src/features/public/PublicLayout.tsx` (add QR icon and popover)
- Tests for public header/QR behavior
