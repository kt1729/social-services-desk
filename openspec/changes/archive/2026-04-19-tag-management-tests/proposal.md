## Why

The `tag-management` change shipped `TagsPage`, `TagMultiselect`, updated data providers, and public portal tag filtering with no automated test coverage. Without tests, regressions in these components go undetected during future changes.

## What Changes

- New test file for `TagMultiselect` — rendering, selection, deselection, pill removal, search filter, empty/loading states, orphan ID handling
- New test file for `TagsPage` — list rendering, add/rename/delete flows, empty state, duplicate-label guard, in-use confirmation
- Updated `PublicHome` tests — tag filter pill rendering, OR filter logic, category+tag AND combination
- Updated `PublicDataProvider` tests — confirms `tags` is exposed in context value

## Capabilities

### New Capabilities

- `tag-multiselect-tests`: Test suite for the `TagMultiselect` shared component
- `tags-page-tests`: Test suite for the `TagsPage` admin feature
- `public-home-tag-filter-tests`: Tests for tag filter behaviour in `PublicHome`

### Modified Capabilities

*(none — no spec-level requirement changes, only new test coverage)*

## Impact

- New files: `src/shared/components/__tests__/TagMultiselect.test.tsx`, `src/features/tags/__tests__/TagsPage.test.tsx`
- Modified files: `src/features/public/__tests__/PublicHome.test.tsx`, `src/features/public/__tests__/PublicDataProvider.test.tsx`
- No production code changes
- No new npm dependencies (vitest + RTL + userEvent already installed)
