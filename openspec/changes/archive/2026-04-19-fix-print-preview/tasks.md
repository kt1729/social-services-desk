## 1. Print Headers

- [x] 1.1 Add `locations` key to `PrintHeaderTranslation` interface and all four language entries in `src/shared/lib/printHeaders.ts` ("Locations:" / "Ubicaciones:" / "地点：" / "Kote yo:")

## 2. PrintResourceCard

- [x] 2.1 Replace plain-text description `<p>` with DOMPurify-sanitized `dangerouslySetInnerHTML` for the description field
- [x] 2.2 Add a Locations section guarded by `resource.branches?.length > 0`: heading using `headers.locations`, then each branch rendered with label, address, phone, and `formatOperatingHours` hours

## 3. PrintDocumentCard

- [x] 3.1 Replace plain-text description `<p>` with DOMPurify-sanitized `dangerouslySetInnerHTML` for the description field

## 4. Tests

- [x] 4.1 Add test: `PrintResourceCard` strips HTML from description (no raw tags visible)
- [x] 4.2 Add test: `PrintResourceCard` renders branch label and address when branches are present
- [x] 4.3 Add test: `PrintResourceCard` does not render Locations section when branches is empty/undefined
- [x] 4.4 Add test: `PrintDocumentCard` strips HTML from description (no raw tags visible)
