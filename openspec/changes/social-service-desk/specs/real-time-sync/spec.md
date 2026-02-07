## ADDED Requirements

### Requirement: Real-time Firestore listeners on all collections

The system SHALL establish Firestore `onSnapshot()` listeners on the `resources`, `guests`, `documents`, `feedback`, and `notes` collections when the application loads. All connected volunteer desks SHALL see data changes within 1-2 seconds.

#### Scenario: Resource created on one desk appears on another

- **WHEN** Volunteer A creates a new resource on Desk 1
- **THEN** Volunteer B on Desk 2 sees the new resource appear in their resource list without refreshing

#### Scenario: Guest note added on one desk appears on another

- **WHEN** Volunteer A adds a quick note to a guest profile
- **THEN** all other connected desks see the updated note on that guest's profile in real-time

### Requirement: Targeted collection listeners

The system SHALL use per-collection listeners (not global document listeners) to minimize Firestore read costs. Each collection SHALL have its own `onSnapshot()` subscription.

#### Scenario: Listeners scoped to collections

- **WHEN** the application initializes after authentication
- **THEN** the system establishes separate `onSnapshot()` listeners for resources, guests, documents, feedback, and notes collections

### Requirement: Listener lifecycle management

The system SHALL set up listeners on authentication and tear them down on logout. Listeners SHALL be managed in React context providers to prevent memory leaks.

#### Scenario: Listeners established on login

- **WHEN** a volunteer successfully authenticates
- **THEN** the system establishes all Firestore listeners

#### Scenario: Listeners cleaned up on logout

- **WHEN** a volunteer logs out
- **THEN** the system unsubscribes from all Firestore listeners

### Requirement: Connection status indicator

The system SHALL display a connection status indicator in the footer showing whether the app is connected to Firestore.

#### Scenario: Connected status displayed

- **WHEN** the app has an active Firestore connection
- **THEN** the footer displays "Connected" with a green indicator

#### Scenario: Disconnected status displayed

- **WHEN** the Firestore connection is lost
- **THEN** the footer displays a disconnected indicator to alert the volunteer
