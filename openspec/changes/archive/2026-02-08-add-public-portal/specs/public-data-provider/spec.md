## public-data-provider

### Data Loading

- MUST load `resources` and `documents` collections from Firestore without requiring authentication
- MUST use `onSnapshot` for real-time updates
- MUST handle permission errors gracefully with user-facing error messages
- MUST NOT load guests, feedback, notes, or volunteers collections

### Context Pattern

- MUST follow the project's context pattern: separate context definition, provider, and hook files
- Hook file (`usePublicData.ts`) MUST be separate from provider (`PublicDataProvider.tsx`) for react-refresh compliance
