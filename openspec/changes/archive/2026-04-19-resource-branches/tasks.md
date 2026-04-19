## 1. Types

- [x] 1.1 Add `Branch` interface to `src/shared/types/index.ts` with fields: `id: string`, `label: string`, `address?: string`, `phone?: string`, `email?: string`, `operatingHours?: OperatingHours`
- [x] 1.2 Add `branches?: Branch[]` to the `Resource` interface

## 2. Resource Form

- [x] 2.1 Add branch management UI to `ResourceForm.tsx` in the English-only contact section: list of branch cards, each with label (required), address, phone, email, and operating hours inputs; "+ Add Branch" button; "Remove" button per branch
- [x] 2.2 Save `branches` array to Firestore on create and update

## 3. Resource Card

- [x] 3.1 Show "N locations" badge on `ResourceCard.tsx` when `branches.length > 0`

## 4. Resource Detail

- [x] 4.1 Add "Locations" section to `ResourceDetail.tsx` below the main contact block, listing each branch with label, address, phone (tel: link), email (mailto: link), and hours; hide section when no branches

## 5. Public Portal

- [x] 5.1 Add "Locations" section to `PublicResourceDetail.tsx` mirroring the volunteer detail, with phone as `tel:` and email as `mailto:` links; hide section when no branches

## 6. Mock Data & Tests

- [x] 6.1 Add `branches: []` to mock resource in `src/shared/lib/mockData.ts`
- [x] 6.2 Update `ResourceCard.test.tsx` — add tests for "N locations" badge shown/hidden
