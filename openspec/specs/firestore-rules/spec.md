# firestore-rules Specification

## Purpose

TBD - created by archiving change add-public-portal. Update Purpose after archive.

## Requirements

### Requirement: Public read access for resources and documents

The system MUST allow unauthenticated read access for `resources` and `documents` collections (`allow read: if true`).
Write access on both collections MUST remain auth-gated (no change).
All other collections (guests, feedback, notes, volunteers) MUST remain fully auth-gated (no change).
