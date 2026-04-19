## Why

The print preview components (`PrintResourceCard`, `PrintDocumentCard`) were written before the WYSIWYG description editor and branches feature were added. They render the description as plain text, which exposes raw HTML tags. They also omit branch locations entirely. This makes printed cards misleading and unusable for resources with multiple locations.

## What Changes

- `PrintResourceCard`: render description via sanitized HTML (not raw text); add a Locations section listing each branch with its label, address, phone, and hours
- `PrintDocumentCard`: render description via sanitized HTML (not raw text)
- Both components use DOMPurify-sanitized `dangerouslySetInnerHTML` for descriptions, consistent with `RichTextDisplay` used elsewhere

## Capabilities

### New Capabilities

### Modified Capabilities
- `print-system`: Print cards now render rich-text descriptions correctly and include resource branches

## Impact

- **`src/features/print/PrintResourceCard.tsx`**: description uses sanitized HTML; new branches section
- **`src/features/print/PrintDocumentCard.tsx`**: description uses sanitized HTML
- **No new dependencies** — DOMPurify is already installed
