## 1. Project Setup & Infrastructure

- [x] 1.1 Initialize new Vite + React + TypeScript project (replace existing CRA codebase)
- [x] 1.2 Install dependencies: firebase, react-router-dom, tailwindcss, @headlessui/react, qrcode.react
- [x] 1.3 Configure Tailwind CSS with purge settings and custom theme
- [x] 1.4 Set up project directory structure: app/, features/, shared/
- [x] 1.5 Create Firebase config file (src/shared/lib/firebase.ts) with placeholder env variables
- [x] 1.6 Add Google Fonts import for Noto Sans SC (Chinese character support)
- [x] 1.7 Create GitHub repository and push initial project scaffold
- [x] 1.8 Set up Firebase project (Firestore, Storage, Auth, Hosting) and add config keys

## 2. Shared Types & Constants

- [x] 2.1 Define TypeScript types for Resource, Guest, Document, Feedback, Note, Volunteer (src/shared/types/)
- [x] 2.2 Create language constants: supported languages, language codes, language labels
- [x] 2.3 Create category constants with static translations (10 categories × 4 languages)
- [x] 2.4 Create print header translations constant (PRINT_HEADERS) for all 4 languages
- [x] 2.5 Define TranslationStatus type and helper functions (complete/partial/missing)

## 3. Firebase Authentication

- [x] 3.1 Create AuthContext provider with Firebase Auth state listener (onAuthStateChanged)
- [x] 3.2 Create useAuth hook exposing user, loading, login, logout functions
- [x] 3.3 Build Login page component (email + password form)
- [x] 3.4 Create ProtectedRoute wrapper component that redirects unauthenticated users to /login
- [x] 3.5 Add volunteer profile Firestore read on auth (fetch role from volunteers/{uid})
- [x] 3.6 Implement logout button in header

## 4. App Shell & Routing

- [x] 4.1 Create main App component with React Router v6 routes
- [x] 4.2 Build header component: app title, global search bar, + New button, logout
- [x] 4.3 Build sidebar component: view toggles (All/Recent), category filter list, translation status link
- [x] 4.4 Build footer component: connection status indicator
- [x] 4.5 Create main layout component combining header, sidebar, content area, footer
- [x] 4.6 Set up routes: /login, /, /resources/:id, /guests, /guests/:id, /documents, /documents/:id, /notes, /translation

## 5. Shared UI Components

- [x] 5.1 Create reusable Modal component (Headless UI Dialog)
- [x] 5.2 Create reusable form components: TextInput, TextArea, Select, TagInput, FileUpload
- [x] 5.3 Create ConfirmDialog component for delete confirmations
- [x] 5.4 Create Card component with consistent styling
- [x] 5.5 Create Tab component for content tabs (Resources | Guests | Documents | Notes)
- [x] 5.6 Create TranslationTabs component (language tabs for edit forms: EN | ES | ZH | HT)
- [x] 5.7 Create CategoryBadge component with category icon and translated label
- [x] 5.8 Create LanguageSelector component for print language selection

## 6. Real-Time Sync & Data Layer

- [x] 6.1 Create ResourcesContext with Firestore onSnapshot listener for resources collection
- [x] 6.2 Create GuestsContext with Firestore onSnapshot listener for guests collection
- [x] 6.3 Create DocumentsContext with Firestore onSnapshot listener for documents collection
- [x] 6.4 Create FeedbackContext with Firestore onSnapshot listener for feedback collection
- [x] 6.5 Create NotesContext with Firestore onSnapshot listener for notes collection
- [x] 6.6 Create VolunteersContext for volunteer name resolution
- [x] 6.7 Implement listener lifecycle: subscribe on auth, unsubscribe on logout
- [x] 6.8 Implement connection status detection and expose via footer indicator

## 7. Resource Management

- [x] 7.1 Build ResourceCard component: name, category icon, address, phone, hours, description, feedback counts, linked docs
- [x] 7.2 Build ResourceList component with category sidebar filtering
- [x] 7.3 Build ResourceDetail page with full info, notes section, and linked documents
- [x] 7.4 Build ResourceForm component (create/edit modal) with translation tabs for name, description
- [x] 7.5 Implement resource create (addDoc to resources collection)
- [x] 7.6 Implement resource update (updateDoc with updatedAt timestamp)
- [x] 7.7 Implement resource delete (admin-only, deleteDoc with confirmation)
- [x] 7.8 Implement tag input on resource form (string array field)
- [x] 7.9 Build feedback buttons (thumbs up/down) with comment input on downvote
- [x] 7.10 Implement feedback submission (addDoc to feedback, update feedbackSummary on resource)
- [x] 7.11 Build "Attach Document" picker on resource card (search documents, add to linkedDocuments)
- [x] 7.12 Implement translationStatus auto-calculation when saving resource translations

## 8. Guest Profiles

- [x] 8.1 Build GuestCard component: name, preferred language, needs, visit count, last visit, recent notes
- [x] 8.2 Build GuestList component
- [x] 8.3 Build GuestDetail page with visit log timeline, notes, and documents given
- [x] 8.4 Build GuestForm component (create/edit modal) with first name, last initial, preferred language, needs multi-select
- [x] 8.5 Implement guest create (addDoc to guests collection)
- [x] 8.6 Implement guest update (updateDoc)
- [x] 8.7 Build LogVisitForm component: purpose, notes, resource referral picker, document picker
- [x] 8.8 Implement visit log append (update guest's visitLog array)
- [x] 8.9 Build quick notes section on guest detail (add note, display chronologically)

## 9. Document Library

- [x] 9.1 Build DocumentCard component: type icon, title, category, language availability flags, linked resources
- [x] 9.2 Build DocumentList component with type and category filter dropdowns
- [x] 9.3 Build DocumentDetail page with preview, print, edit actions
- [x] 9.4 Build AddDocumentForm with type selector (PDF/Link/Internal/Image), fields, language file uploads
- [x] 9.5 Implement file upload to Firebase Storage at documents/{docId}/{lang}/filename
- [x] 9.6 Implement document create (upload files + addDoc to documents collection)
- [x] 9.7 Implement document update (updateDoc, handle new file uploads)
- [x] 9.8 Implement document delete (admin-only, delete Firestore doc + Storage files)
- [x] 9.9 Build document preview: inline PDF viewer, image display, link open in new tab, internal content render
- [x] 9.10 Implement per-language file upload UI (upload Spanish PDF, Mandarin PDF, etc.)
- [x] 9.11 Build resource linking on document form (search and select resources, update both sides)
- [x] 9.12 Implement 10MB file size validation before upload
- [x] 9.13 Implement translationStatus auto-calculation for documents

## 10. Notes System

- [x] 10.1 Build NoteItem component: text, volunteer name, timestamp
- [x] 10.2 Build AddNoteForm component (text input + submit)
- [x] 10.3 Implement note create (addDoc to notes collection with parentType/parentId)
- [x] 10.4 Build notes section for resource detail, guest detail, and document detail pages
- [x] 10.5 Build Notes tab page showing all notes grouped by parent type with parent entity context
- [x] 10.6 Resolve volunteer names from volunteers collection for note attribution

## 11. Global Search

- [x] 11.1 Build SearchBar component in header with debounced input
- [x] 11.2 Implement client-side search utility: case-insensitive partial match across multilingual fields
- [x] 11.3 Build SearchResults component with grouped sections (Resources, Documents, Guests)
- [x] 11.4 Wire search to filter resources by name (all langs), description (all langs), category, tags, address
- [x] 11.5 Wire search to filter documents by title (all langs), description (all langs), category, tags
- [x] 11.6 Wire search to filter guests by firstName, lastInitial, needs, quickNotes text

## 12. Multi-Language & Translation Dashboard

- [x] 12.1 Build TranslationDashboard page: table of resources + documents with per-language status icons
- [x] 12.2 Implement overall translation percentage calculation per language
- [x] 12.3 Build filter toggle: "Missing translations only"
- [x] 12.4 Add translation status sidebar summary widget (link to dashboard)

## 13. Print System

- [x] 13.1 Create base print CSS: @media print rules to hide UI chrome (header, sidebar, footer, buttons)
- [x] 13.2 Build PrintResourceCard component: translated header, name, category, address, phone, website, hours, description, blank notes lines, date
- [x] 13.3 Build PrintDocumentCard component: translated header, title, category, URL, QR code (for links), blank notes lines, date
- [x] 13.4 Build PrintGuestSummary component: name, language, needs, recent visits, documents given
- [x] 13.5 Integrate qrcode.react for QR code generation on link-type document print cards
- [x] 13.6 Build LanguageSelectorModal: shown before printing, defaults to guest's preferred language when available
- [x] 13.7 Apply Noto Sans SC font to print cards with data-lang="zh"
- [x] 13.8 Add print buttons to resource cards, document cards, and guest profiles

## 14. Firebase Security Rules & Deployment

- [x] 14.1 Write Firestore security rules: auth-gated reads/writes, admin-only deletes for resources/documents
- [x] 14.2 Write Storage security rules: auth-gated, 10MB max file size
- [x] 14.3 Deploy Firestore and Storage security rules
- [x] 14.4 Create firebase.json with hosting config and SPA rewrites
- [x] 14.5 Set up GitHub Actions workflow: build on push to main, deploy to Firebase Hosting
- [x] 14.6 Create first admin volunteer account via Firebase Console
- [x] 14.7 Deploy application to Firebase Hosting and verify end-to-end
