## 1. Type

- [x] 1.1 Add `email?: string` to the `Resource` interface in `src/shared/types/index.ts`

## 2. Form

- [x] 2.1 Add email input (`type="email"`) to `ResourceForm.tsx` in the English-only contact section, beside website

## 3. Resource Card

- [x] 3.1 Display email as a `mailto:` link (✉️ prefix) in `ResourceCard.tsx` when non-empty, beside website

## 4. Resource Detail

- [x] 4.1 Display email as a `mailto:` link in `ResourceDetail.tsx` contact block beside website

## 5. Public Portal

- [x] 5.1 Display email as a `mailto:` link in `PublicResourceDetail.tsx` contact block beside website

## 6. Print Card

- [x] 6.1 Display email in `PrintResourceCard.tsx` contact block if non-empty

## 7. Tests

- [x] 7.1 Update `ResourceCard.test.tsx` — add tests for email link shown/hidden
- [x] 7.2 Update `mockData.ts` — add `email` field to mock resource
