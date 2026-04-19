## Context

The project uses Vitest + React Testing Library + `@testing-library/user-event`. Tests live in `__tests__/` folders next to the feature they cover. The existing test suite establishes clear patterns: mock hooks with `vi.mock`, render with `MemoryRouter` for routed components, reset shared mock state in `beforeEach`, and keep assertions focused.

The new components introduced by `tag-management` are:
- `TagMultiselect` — a controlled component with no routing dependency, takes `tags`, `value`, `onChange` props
- `TagsPage` — reads from `useData()` (needs `tags`, `resources`, `documents`) and writes to Firestore
- `PublicHome` — reads from `usePublicData()` which now includes `tags`
- `PublicDataProvider` — now exposes `tags` in local mode

## Goals / Non-Goals

**Goals:**
- Full behaviour coverage for `TagMultiselect` (the most reusable new component)
- Smoke + key-flow coverage for `TagsPage` (mocked Firestore writes)
- Extend existing `PublicHome` tests to cover tag filter behaviour
- Extend `PublicDataProvider` test to assert `tags` is in context

**Non-Goals:**
- Integration tests against real Firestore
- Visual/snapshot tests
- Testing the `slugify` utility in isolation

## Decisions

### 1. Mock Firestore writes in TagsPage tests

`TagsPage` calls `addDoc`, `updateDoc`, `deleteDoc` directly. Mock the entire `firebase/firestore` module with `vi.mock` and assert the mock was called with the right args — same pattern used elsewhere in the project.

### 2. TagMultiselect tested without router

The component has no routing dependency; render it bare (no `MemoryRouter`). Pass a `tags` array prop directly — no need to mock `useData`.

### 3. Extend PublicHome tests in the existing file

The existing `PublicHome.test.tsx` already mocks `usePublicData`. Add `tags: []` to `mockPublicData` and add new `describe` blocks for tag filter cases rather than creating a separate file.

### 4. PublicDataProvider: assert tags field exists in context

The existing consumer component only renders `resources` and `documents`. Add a `tags` span to the consumer and assert it's present in local mode.

## Risks / Trade-offs

- `TagsPage` delete flow calls `getDocs` (removed — now uses in-memory count) — no Firestore mock needed for delete
- Inline rename uses keyboard events (`Enter`/`Escape`) — `userEvent` handles these correctly
