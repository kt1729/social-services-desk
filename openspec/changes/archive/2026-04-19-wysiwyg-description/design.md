## Context

Description fields on Resource and Document forms are currently plain `<textarea>` inputs storing raw strings in Firestore. Volunteers cannot add formatting (bold, lists, links) which limits how clearly service information is communicated to guests on the public portal.

## Goals / Non-Goals

**Goals:**
- Provide a WYSIWYG editing experience for all description fields (resource + document, all languages)
- Store rich-text content as sanitized HTML in Firestore
- Render HTML safely in all views (volunteer app + public portal)
- Backward-compatible with existing plain-text descriptions

**Non-Goals:**
- Image uploads within the editor (not needed for descriptions)
- Collaborative real-time editing
- Markdown storage format (HTML is simpler given the rendering target)
- Editor for fields other than `description` (name, address, notes remain plain text)

## Decisions

### 1. Library: Tiptap (headless) over react-quill or TinyMCE

Tiptap is headless — it has no bundled CSS, so styling is done entirely with Tailwind. React-Quill ships its own CSS that conflicts with Tailwind v4. TinyMCE requires a cloud key for full features. Tiptap's `@tiptap/react` + `@tiptap/starter-kit` gives bold, italic, lists, links, and hard breaks with ~35 KB gzipped, no cloud dependency, and full TypeScript support.

**Packages to add:**
- `@tiptap/react`
- `@tiptap/pm` (ProseMirror peer)
- `@tiptap/starter-kit`
- `@tiptap/extension-link`
- `dompurify` + `@types/dompurify`

### 2. Storage format: HTML string

`description` remains a `string` field in Firestore. Going forward it contains HTML such as `<p>text</p><ul><li>item</li></ul>`. Existing plain-text values are treated as-is — browsers render untagged text correctly inside `dangerouslySetInnerHTML` containers.

### 3. Sanitization: DOMPurify on every render

Every place that renders a `description` value with `dangerouslySetInnerHTML` MUST call `DOMPurify.sanitize(html)` first. This is the only defense layer needed since content is volunteer-authored, but XSS prevention is non-negotiable per project standards.

### 4. Reusable `RichTextEditor` component + `RichTextDisplay` component

- `RichTextEditor`: Tiptap editor wrapped in a Tailwind-styled toolbar + content area. Props: `value: string`, `onChange: (html: string) => void`, `placeholder?: string`. Used everywhere a description textarea currently exists.
- `RichTextDisplay`: Renders sanitized HTML. Props: `html: string`, `className?: string`. Applies `DOMPurify.sanitize` and uses `dangerouslySetInnerHTML`. Used in all detail/card views.

### 5. Toolbar buttons: bold, italic, bullet list, ordered list, link, clear formatting

Matches common volunteer needs. No heading levels (overkill for descriptions). No image embed.

## Risks / Trade-offs

- **Existing data**: Plain-text descriptions render fine inside `dangerouslySetInnerHTML` — no migration script needed. Risk: descriptions that contain `<` or `&` in plain text will be HTML-escaped by Tiptap on first edit. Mitigation: acceptable edge case given the volunteer-managed dataset.
- **Bundle size**: Tiptap + ProseMirror adds ~80–100 KB gzipped. Mitigation: within acceptable range for an SPA on fast-tier hosting with small user base.
- **Testing**: Tiptap's ProseMirror internals are hard to unit-test. Mitigation: test `RichTextDisplay` (sanitization) thoroughly; test editor integration via RTL interaction tests.
- **DOMPurify in SSR/tests**: jsdom doesn't have a full DOM — DOMPurify works but requires `window` present. Mitigation: mock or stub in unit tests where needed.
