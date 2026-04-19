## Context

`PrintResourceCard` and `PrintDocumentCard` pass the description string directly into a `<p>` tag. When descriptions contain Tiptap-generated HTML (`<p><strong>...</strong></p>`, `<ul><li>...</li></ul>` etc.) the raw markup appears verbatim on the printed card. `RichTextDisplay` already solves this with `DOMPurify.sanitize` + `dangerouslySetInnerHTML` — the print components just need the same treatment.

`PrintResourceCard` also has no awareness of `resource.branches`. Guests picking up a printed card for a resource with multiple locations see only the primary address.

## Goals / Non-Goals

**Goals:**
- Sanitize and render rich-text descriptions as HTML in both print components
- Add a Branches/Locations section to `PrintResourceCard` showing label, address, phone, and hours per branch

**Non-Goals:**
- Changing print layout, paper sizes, or styling beyond what's needed for correctness
- Adding branch support to `PrintDocumentCard` (documents don't have branches)
- Translating branch labels (branch `label` is a single free-text string, not a `TranslatedField`)

## Decisions

### 1. Inline sanitize with DOMPurify, no new component

The print components are already non-interactive render-only trees. Inlining `DOMPurify.sanitize` + `dangerouslySetInnerHTML` keeps them self-contained without pulling in `RichTextDisplay` (which imports React hooks and is overkill for a pure render). Consistent with the pattern in `PublicHome.tsx` which also strips HTML for plain-text contexts.

### 2. Branches rendered as a compact list under a "Locations" heading

Each branch gets: label (bold), address, phone (if present), and hours (if present). Same `formatOperatingHours` helper used elsewhere. Heading uses the existing `headers` translation map — add a `locations` key to `PRINT_HEADERS` for all four languages.

### 3. Skip branches section when `branches` is empty or undefined

Guard with `resource.branches?.length > 0` so existing resources without branches are unaffected.
