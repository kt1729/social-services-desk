## Why

Clicking a search result navigates to the detail page but it instantly redirects back to `/search`. The SearchBar lives in the Header (always mounted), and its debounced `useEffect` re-fires when `navigate` reference changes on route transition, sending the user back to the search page after 300ms.

## What Changes

- Fix SearchBar's `useEffect` to only trigger search navigation when the user is on the `/search` route or when the input value actually changes via user interaction, not on route transitions
- Clear the search query when the user navigates away from the search page

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `search`: Fix debounced navigation to not re-trigger on route changes away from search

## Impact

- `src/features/search/SearchBar.tsx` — fix useEffect dependency/guard logic
