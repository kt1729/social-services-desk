# firebase-auth Specification

## Purpose

TBD - created by archiving change social-service-desk. Update Purpose after archive.

## Requirements

### Requirement: Volunteer email/password authentication

The system SHALL authenticate volunteers using Firebase Authentication with email/password provider. Only authenticated volunteers SHALL access the application.

#### Scenario: Successful login

- **WHEN** a volunteer enters valid email and password on the login screen
- **THEN** the system authenticates via Firebase Auth and redirects to the main dashboard

#### Scenario: Failed login

- **WHEN** a volunteer enters invalid credentials
- **THEN** the system displays an error message and remains on the login screen

#### Scenario: Unauthenticated access attempt

- **WHEN** an unauthenticated user navigates to any protected route
- **THEN** the system redirects to the login screen

### Requirement: Volunteer logout

The system SHALL provide a logout button in the header that signs the volunteer out of Firebase Auth and redirects to the login screen.

#### Scenario: Successful logout

- **WHEN** a volunteer clicks the logout button
- **THEN** the system signs out via Firebase Auth and redirects to the login screen

### Requirement: Role-based access control

The system SHALL support two roles: `volunteer` and `admin`. Role information SHALL be stored in the `volunteers` Firestore collection. Admin role SHALL be required for destructive operations (deleting resources, documents).

#### Scenario: Admin deletes a resource

- **WHEN** an authenticated volunteer with role `admin` deletes a resource
- **THEN** the system allows the deletion and removes the resource from Firestore

#### Scenario: Non-admin attempts to delete a resource

- **WHEN** an authenticated volunteer with role `volunteer` attempts to delete a resource
- **THEN** the system prevents the deletion and the delete action is not visible in the UI

### Requirement: Volunteer profile stored in Firestore

The system SHALL store volunteer profile data in the `volunteers/{uid}` document with fields: `name`, `email`, `role`, and `createdAt`.

#### Scenario: Volunteer profile exists after first admin setup

- **WHEN** an admin creates a volunteer account
- **THEN** a corresponding document is created in `volunteers/{uid}` with the volunteer's name, email, role, and creation timestamp

### Requirement: Protected route wrapper

The system SHALL provide a `ProtectedRoute` component that checks Firebase Auth state and renders children only when authenticated.

#### Scenario: Authenticated user accesses protected route

- **WHEN** an authenticated volunteer navigates to a protected route
- **THEN** the route renders its content normally

#### Scenario: Auth state loading

- **WHEN** Firebase Auth state is still being determined
- **THEN** the system displays a loading indicator instead of redirecting
