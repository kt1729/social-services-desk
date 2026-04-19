## Purpose

Admin-only volunteer management page. Allows admins to view, add, change roles for, and delete volunteer records in the Firestore `volunteers` collection. Volunteer records are the source of truth for role-based access in the app.

## Requirements

### Requirement: Volunteer list
The system SHALL provide an admin-only `/volunteers` page that displays all documents in the `volunteers` Firestore collection. Each row SHALL show the volunteer's name, email, and current role. Non-admin users who navigate to `/volunteers` SHALL be redirected to `/`.

#### Scenario: Admin views volunteer list
- **WHEN** an admin navigates to `/volunteers`
- **THEN** the page displays a list of all volunteer records with name, email, and role

#### Scenario: Non-admin is redirected
- **WHEN** a non-admin user navigates to `/volunteers`
- **THEN** they are redirected to `/`

#### Scenario: Empty state
- **WHEN** the `volunteers` collection has no documents
- **THEN** the page displays an empty-state message prompting the admin to add the first volunteer

### Requirement: Add volunteer record
The system SHALL allow admins to create a new `volunteers` Firestore document by providing a name, email, role, and Firebase Auth UID. The document SHALL be created at `volunteers/{uid}`. The form SHALL display a helper note explaining how to find a UID in the Firebase Console. If a document already exists at that UID the system SHALL display an error.

#### Scenario: Admin adds a volunteer
- **WHEN** an admin fills in name, email, role, and UID and submits the form
- **THEN** the system creates a document at `volunteers/{uid}` with the provided fields and a `createdAt` timestamp, and the new volunteer appears in the list

#### Scenario: Duplicate UID rejected
- **WHEN** an admin submits a UID that already has a `volunteers` document
- **THEN** the system displays an error "A volunteer with this UID already exists" and does not overwrite the existing document

#### Scenario: Missing required fields
- **WHEN** an admin submits the form with name, email, or UID left blank
- **THEN** the form is marked invalid and not submitted

### Requirement: Change volunteer role
The system SHALL allow admins to change any volunteer's role between `volunteer` and `admin` via an inline select on the volunteer list. The change SHALL be saved to Firestore immediately on selection without a separate save action.

#### Scenario: Admin promotes a volunteer to admin
- **WHEN** an admin changes a volunteer's role select from "Volunteer" to "Admin"
- **THEN** the system updates `volunteers/{uid}.role` to `"admin"` in Firestore immediately

#### Scenario: Admin demotes an admin to volunteer
- **WHEN** an admin changes a volunteer's role select from "Admin" to "Volunteer"
- **THEN** the system updates `volunteers/{uid}.role` to `"volunteer"` in Firestore immediately

### Requirement: Delete volunteer record
The system SHALL allow admins to delete a volunteer's Firestore document. Deletion SHALL remove only the Firestore document; the Firebase Auth account is unaffected. A confirmation dialog SHALL be shown before deletion.

#### Scenario: Admin deletes a volunteer record
- **WHEN** an admin clicks delete on a volunteer and confirms
- **THEN** the system removes the `volunteers/{uid}` document from Firestore and the volunteer no longer appears in the list

#### Scenario: Admin cancels deletion
- **WHEN** an admin clicks delete but then cancels the confirmation dialog
- **THEN** no document is deleted and the volunteer remains in the list
