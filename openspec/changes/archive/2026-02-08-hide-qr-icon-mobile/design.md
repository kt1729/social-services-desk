## Context

The public header now includes a QR icon that opens a popover. On mobile, the header is already dense with search and language controls, and the QR icon provides limited value for users already on a phone.

## Goals / Non-Goals

**Goals:**

- Hide the QR icon on mobile-sized viewports.
- Preserve QR popover behavior on tablet/desktop.

**Non-Goals:**

- Changing the QR popover content or behavior on larger screens.
- Removing the QR functionality entirely.

## Decisions

- **Use responsive CSS to hide on mobile.**
  - Decision: Apply a responsive utility class (e.g., `hidden md:inline-flex`) to the QR icon button.
  - Rationale: Keeps logic in CSS, avoids runtime viewport checks, and matches existing Tailwind usage.
  - Alternative: JS `matchMedia` logic. Rejected due to complexity and hydration risk.

## Risks / Trade-offs

- **[Risk]** Users on small tablets may not see the icon → **Mitigation:** use a conservative breakpoint (`md`) to keep it visible on tablets.
