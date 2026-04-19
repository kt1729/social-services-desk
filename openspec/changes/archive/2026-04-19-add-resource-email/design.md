## Context

Resources currently store contact info as `address`, `phone`, and `website`. Email is missing as a first-class field. The change is a narrow field addition with no architectural complexity.

## Goals / Non-Goals

**Goals:**
- Add `email` to the `Resource` type, form, and all display surfaces
- Render email as a `mailto:` hyperlink wherever it appears
- Remain backward-compatible (field is optional)

**Non-Goals:**
- Email validation beyond basic format (browser `type="email"` is sufficient)
- Multi-language email fields (email addresses are language-agnostic)
- Sending email from within the app

## Decisions

### 1. Optional field — `email?: string`

The field is optional on the TypeScript type and treated as `''` when absent, consistent with `website`. No Firestore migration needed.

### 2. Placement in the form

Email is shown in the same `en`-only contact info grid as address/phone/website, adjacent to website. The form already conditionally renders these fields only when `activeLang === 'en'`.

### 3. Display as `mailto:` link

Wherever `website` is rendered as a hyperlink (`<a href={website}>`), `email` is rendered as `<a href={`mailto:${email}`}>`. In cards, shown as `✉️ email@example.org`. In detail view, same pattern as phone/website.

### 4. Public portal

`PublicResourceDetail` already shows phone and website; add email in the same contact block with the same `mailto:` pattern.

## Risks / Trade-offs

- **Print card**: `PrintResourceCard` may show contact details — check and add email there too if present.
- **No validation concern**: Email is volunteer-entered content; basic HTML `type="email"` is adequate for format hints.
