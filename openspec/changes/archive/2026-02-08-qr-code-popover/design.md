## Context

The public portal currently includes a QR code section on the home page. We want a cleaner layout and only show the QR code when explicitly requested. The language selector lives in the public header and is a good anchor point for a QR access icon.

## Goals / Non-Goals

**Goals:**

- Remove the QR code section from the public home content.
- Add a QR icon next to the language selector that opens a popover/modal with the QR code.
- Keep the QR scannable and printable.

**Non-Goals:**

- Changing routing or data loading.
- Introducing new dependencies or design systems.
- Changing existing search or filter behavior.

## Decisions

- **Use a lightweight modal/popover in `PublicLayout`.**
  - Decision: Render a small overlay panel anchored to the header icon, using existing Tailwind classes and a local `useState` toggle.
  - Rationale: Avoids new dependencies and keeps the QR accessible site-wide.
  - Alternative: Keep a page section with conditional rendering. Rejected because it doesn’t reduce clutter.

- **Reuse existing `QRCodeSVG` with embedded logo.**
  - Decision: Use the same QR settings currently used (logo embedded, high error correction), but render inside the popover.
  - Rationale: Consistent branding and scannability without extra assets.

## Risks / Trade-offs

- **[Risk]** Popover might obscure header on small screens → **Mitigation:** use a centered modal with backdrop and ensure close button.
- **[Risk]** QR icon discoverability → **Mitigation:** add accessible label and optional tooltip text.
