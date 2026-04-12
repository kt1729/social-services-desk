# local-dev-mode Specification

## Purpose

TBD - created by archiving change local-dev-no-cloud. Update Purpose after archive.

## Requirements

### Requirement: Local dev mode flag

The system MUST support a local development mode activated by `VITE_LOCAL_MODE=true`.

#### Scenario: Local mode enabled

- **WHEN** the app starts with `VITE_LOCAL_MODE=true`
- **THEN** it does not require Firebase or Supabase env variables to boot

### Requirement: Mock data providers

The system MUST provide mock resources, documents, and guests when local mode is enabled.

#### Scenario: Local mode data

- **WHEN** local mode is enabled
- **THEN** resources, documents, and guests views render using in-memory mock data

### Requirement: Mock auth state

The system MUST provide a mock authenticated volunteer state in local mode.

#### Scenario: Local mode auth

- **WHEN** local mode is enabled
- **THEN** protected routes render without requiring real authentication
