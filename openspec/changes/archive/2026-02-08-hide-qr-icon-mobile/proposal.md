## Why

On small screens the QR icon competes with the search and language controls, and the QR itself is less useful when the user is already on a phone. Hiding the icon on mobile keeps the header clean while preserving QR access on larger screens.

## What Changes

- Hide the QR icon button in the public header on mobile viewports.
- Keep the QR icon available on tablet/desktop and preserve popover behavior.

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `public-portal`: Public header QR icon visibility rules.

## Impact

- `src/features/public/PublicLayout.tsx` (responsive visibility for QR icon)
- Public layout tests for QR icon visibility
