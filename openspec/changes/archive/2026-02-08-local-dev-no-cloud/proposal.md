## Why

New contributors should be able to run the UI locally without configuring Firebase or Supabase. A local/dev mode with mock data lowers the barrier to entry and speeds up UI development.

## What Changes

- Add a local development mode that uses in-memory mock data instead of Firebase/Supabase.
- Make startup succeed without cloud env variables when local mode is enabled.
- Document how to run in local mode.

## Capabilities

### New Capabilities

- `local-dev-mode`: Run the app without cloud dependencies using mock data.

### Modified Capabilities

- (none)

## Impact

- App bootstrapping and data providers
- Auth and storage services (mocked)
- Documentation and environment variables
