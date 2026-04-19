## 1. Dependencies

- [x] 1.1 Install `@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `dompurify`, `@types/dompurify`

## 2. Core Components

- [x] 2.1 Create `src/shared/components/RichTextEditor.tsx` — Tiptap editor with toolbar (bold, italic, bullet list, ordered list, link, clear formatting), Tailwind styled, no external CSS
- [x] 2.2 Create `src/shared/components/RichTextDisplay.tsx` — renders sanitized HTML via `DOMPurify.sanitize` + `dangerouslySetInnerHTML`, accepts `html: string` and optional `className`

## 3. Resource Form

- [x] 3.1 Replace description `<textarea>` fields in `ResourceForm.tsx` with `RichTextEditor` for all language tabs (en, es, zh, ht)

## 4. Resource Display

- [x] 4.1 Replace plain-text description rendering in resource card/detail view with `RichTextDisplay`

## 5. Document Form

- [x] 5.1 Replace description `<textarea>` fields in `DocumentForm.tsx` with `RichTextEditor` for all language tabs

## 6. Document Display

- [x] 6.1 Replace plain-text description rendering in document card/detail view with `RichTextDisplay`

## 7. Public Portal

- [x] 7.1 Replace plain-text description rendering in public resource detail view with `RichTextDisplay`
- [x] 7.2 Replace plain-text description rendering in public document detail view with `RichTextDisplay`
- [x] 7.3 Replace any description snippets in `PublicHome.tsx` resource/document cards with `RichTextDisplay`

## 8. Tests

- [x] 8.1 Create `RichTextDisplay.test.tsx` — sanitization, HTML rendering, plain-text fallback, className prop
- [x] 8.2 Create `RichTextEditor.test.tsx` — renders without crash, placeholder shown, toolbar buttons present, value sync on prop change
- [x] 8.3 Update `ResourceCard.test.tsx` — verify HTML tags are stripped from description excerpt
- [x] 8.4 Update `DocumentCard.test.tsx` — verify HTML tags are stripped from description excerpt
