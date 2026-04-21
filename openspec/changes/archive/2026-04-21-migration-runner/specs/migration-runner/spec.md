## ADDED Requirements

### Requirement: Migration runner tracks applied migrations in Firestore

The runner SHALL read the `_migrations` Firestore collection before executing any migration, and SHALL skip any migration whose `id` already has a document in that collection.

#### Scenario: First run applies all pending migrations

- **WHEN** the `_migrations` collection is empty and migrations `001`, `002` exist
- **THEN** the runner applies both migrations and writes documents `_migrations/001` and `_migrations/002`

#### Scenario: Re-run skips already-applied migrations

- **WHEN** `_migrations/001` exists and only migration `001` is registered
- **THEN** the runner logs that `001` is already applied and exits with no writes

#### Scenario: Partial run applies only pending migrations

- **WHEN** `_migrations/001` exists and migrations `001`, `002` are registered
- **THEN** the runner skips `001` and applies `002` only

### Requirement: Each migration is a numbered file with a standard export

Each migration file SHALL export `{ id, name, run }` where `id` is a 3-digit zero-padded string matching the filename prefix, `name` is a human-readable label, and `run` is an async function accepting the Firestore admin instance.

#### Scenario: Migration file structure

- **WHEN** a developer adds `scripts/migrations/002-my-change.ts`
- **THEN** the file exports `id: '002'`, a `name` string, and a `run(db)` async function

### Requirement: Runner logs progress and results

The runner SHALL log each migration's status (skipped / applied / failed) and print a final summary of how many were applied.

#### Scenario: Successful run output

- **WHEN** the runner applies two migrations successfully
- **THEN** output includes "Applied: 002-my-change" and "Done. 2 migration(s) applied."

#### Scenario: Failed migration stops the run

- **WHEN** a migration's `run()` throws an error
- **THEN** the runner logs the error, exits with code 1, and does NOT write the migration's tracking document
