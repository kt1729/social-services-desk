## Why

Users are created directly in Firebase Authentication with no corresponding `volunteers` Firestore document. Because `isAdmin` is derived from `volunteers/{uid}.role`, nobody can be promoted to admin from within the app — an admin must manually create documents in the Firebase Console. A volunteer management page gives admins a UI to see who has access, create volunteer records for existing Auth users, and change roles without leaving the app.

## What Changes

- Add a **Volunteers** page (`/volunteers`) accessible only to admins.
- The page lists all documents in the `volunteers` Firestore collection with name, email, and role.
- Admins can **add a volunteer** — providing name, email, and role — which creates the `volunteers/{uid}` document. Because Firebase Auth user creation requires the Admin SDK (not available client-side), the form creates only the Firestore document using the UID the admin pastes in (copied from Firebase Console → Authentication). A helper note explains where to find the UID.
- Admins can **change a volunteer's role** inline (toggle between `volunteer` and `admin`).
- Admins can **delete a volunteer record** (removes the Firestore doc; does NOT delete the Firebase Auth user).
- A link to the Volunteers page is added to the Sidebar under Settings.

## Capabilities

### New Capabilities
- `volunteer-management`: Admin-only page listing volunteers with add, role-change, and delete actions.

### Modified Capabilities
- `firebase-auth`: Firestore `volunteers` collection now has a documented creation flow from the UI (admin pastes UID + fills name/email/role).

## Impact

- **New page**: `src/features/volunteers/VolunteersPage.tsx`
- **Routing**: new `/volunteers` route in `App.tsx`, guarded to admins
- **Sidebar**: new "Volunteers" link under Settings section
- **Firestore rules**: no change needed — write on `volunteers` is already admin-only
- **No new dependencies**
