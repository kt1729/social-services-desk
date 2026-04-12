# public-data-provider Specification

## Purpose

TBD - created by archiving change add-public-portal. Update Purpose after archive.

## Requirements

### Requirement: Public data loading

The system MUST load `resources` and `documents` collections from Firestore without requiring authentication.
The system MUST use `onSnapshot` for real-time updates.
The system MUST handle permission errors gracefully with user-facing error messages.
The system MUST NOT load guests, feedback, notes, or volunteers collections.

### Requirement: Context pattern separation

The system MUST follow the project's context pattern with separate context definition, provider, and hook files.
The hook file (`usePublicData.ts`) MUST be separate from the provider (`PublicDataProvider.tsx`) for react-refresh compliance.
