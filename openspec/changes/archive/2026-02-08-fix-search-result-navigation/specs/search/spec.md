## search

### Debounced Navigation

- The SearchBar MUST only trigger debounced navigation to `/search?q=...` when the user is currently on the `/search` route
- Navigating away from `/search` (e.g., clicking a search result) MUST NOT re-trigger the search navigation
- The search input SHOULD clear when the user navigates away from the `/search` route
