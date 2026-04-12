## Overview

The SearchBar's debounced `useEffect` navigates to `/search?q=...` whenever `query` is non-empty. Since SearchBar is always mounted (in Header), navigating away from `/search` causes `navigate` to get a new reference, re-triggering the effect and bouncing the user back to search.

## Approach

Guard the debounced navigation with a `useLocation` check. Only navigate to `/search` if the user is currently on the search page. When the user navigates away (clicks a search result), the effect sees the new pathname and skips the navigation.

Additionally, clear the query input when the user navigates away from `/search` so the search bar resets.

## Files Changed

| File                                | Action | Description                                                     |
| ----------------------------------- | ------ | --------------------------------------------------------------- |
| `src/features/search/SearchBar.tsx` | MODIFY | Add pathname guard to useEffect, clear query on navigation away |

## Risks

None — the fix is additive (a guard condition) and doesn't change the core search behavior.
