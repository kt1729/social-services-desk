## Tasks

### Group 1: Fix SearchBar debounced navigation

- [x] In `src/features/search/SearchBar.tsx`, add `useLocation` import from `react-router-dom`
- [x] Add a `userTypingRef` to guard the debounced navigate — only fire when the user is actively typing, not on route-change re-renders
- [x] Add a `useEffect` that clears `query` state when `location.pathname` changes away from `/search`
- [x] Update existing SearchBar tests to verify the fix (added new test, all 7 pass)
- [x] Run `npm run build` to verify no TypeScript errors
- [x] Run `npm test` to verify no regressions (160/160 pass)
