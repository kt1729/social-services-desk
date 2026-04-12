## Context

The public home page currently shows a QR code linking to `/public` for easy access from another device. On mobile, the QR code is unnecessary because the user is already on the destination device. The QR code should remain for desktop/print contexts, and it should include branding.

## Goals / Non-Goals

**Goals:**

- Hide the QR code section on mobile-sized screens.
- Embed the organization logo inside the QR code while keeping it scannable.

**Non-Goals:**

- Changing public portal routing or data loading.
- Altering resource/document list behavior or filters.
- Adding new external dependencies.

## Decisions

- **Use responsive CSS to hide on mobile.**
  - Decision: Apply a responsive visibility class to the QR section (e.g., `hidden md:block`).
  - Rationale: Keeps logic in CSS, avoids user-agent detection, and aligns with existing Tailwind usage.
  - Alternative: JS-based `matchMedia` rendering. Rejected due to extra complexity and hydration concerns.

- **Use `qrcode.react` logo embedding.**
  - Decision: Use `QRCodeSVG` `imageSettings` to embed `/logo.webp` at the center, and set a high error-correction level.
  - Rationale: Supported by current dependency, no new assets needed, and preserves scannability.
  - Alternative: Manually overlay an `<img>` on top of the SVG. Rejected due to alignment/print issues.

## Risks / Trade-offs

- **[Risk]** QR becomes less scannable with a large logo → **Mitigation:** keep logo size modest and use high error correction.
- **[Risk]** Breakpoint choice hides QR on small tablets → **Mitigation:** choose a conservative breakpoint (`md`) and confirm in UI review.
