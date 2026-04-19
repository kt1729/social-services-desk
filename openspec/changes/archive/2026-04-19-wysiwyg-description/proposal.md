## Why

Plain-text `<textarea>` fields for resource and document descriptions limit how volunteers express important service information — line breaks, bullet lists, bold text, and links are lost. A WYSIWYG editor lets volunteers format descriptions naturally, and the public portal renders that formatting for guests who often read on mobile.

## What Changes

- Replace plain-text `<textarea>` description fields on the Resource form and Document form with a rich-text (WYSIWYG) editor.
- Store description content as HTML (or a portable format such as Markdown) in Firestore instead of raw strings.
- Render description content safely (sanitized) in the Resource detail, Document detail, and their public-portal counterparts.
- The editor MUST support: bold, italic, unordered list, ordered list, links, and line breaks.
- The editor MUST NOT allow arbitrary HTML injection (XSS prevention via sanitization on render).
- Existing plain-text description values MUST render without corruption after the migration (treat as plain text wrapped in `<p>`).

## Capabilities

### New Capabilities
- `wysiwyg-editor`: Reusable rich-text editor component wrapping a lightweight WYSIWYG library; accepts `value: string` (HTML), `onChange: (html: string) => void`, and an optional `placeholder`. Used on all description fields.

### Modified Capabilities
- `resource-management`: Description field on create/edit form now uses the WYSIWYG editor; resource detail view renders HTML safely.
- `document-library`: Description field on create/edit form now uses the WYSIWYG editor; document detail view renders HTML safely.
- `public-portal`: Public resource and document detail views render description HTML safely.

## Impact

- **New dependency**: A lightweight WYSIWYG library (e.g., `tiptap` or `react-quill-new`) added to `package.json`.
- **Firestore**: No schema migration required — `description` remains a string field; values written going forward will contain HTML.
- **Rendering**: All places that display `description` must switch from `{resource.description.en}` plain text to sanitized `dangerouslySetInnerHTML` (using `DOMPurify`) or a read-only editor renderer.
- **Files affected**: `ResourceForm.tsx`, `ResourceDetail.tsx` (or inline card), `DocumentForm.tsx`, `DocumentDetail.tsx`, `PublicHome.tsx`, public resource/document detail views.
- **Security**: `DOMPurify.sanitize()` MUST be applied before any `dangerouslySetInnerHTML` usage.
