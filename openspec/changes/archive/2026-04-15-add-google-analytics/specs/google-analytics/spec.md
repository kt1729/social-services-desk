## ADDED Requirements

### Requirement: GA4 script loading

The system SHALL inject the GA4 `gtag.js` CDN script and inline initialisation config when `VITE_GA_MEASUREMENT_ID` is set at build time.
The system SHALL NOT load any analytics script when `VITE_GA_MEASUREMENT_ID` is absent or empty.
The GA4 script tag MUST use the `async` attribute so it does not block page rendering.
The measurement ID MUST be sourced exclusively from the `VITE_GA_MEASUREMENT_ID` build-time environment variable.

#### Scenario: Analytics loads when ID is configured

- **WHEN** the app is built with `VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX`
- **THEN** the GA4 `gtag.js` script is present in the DOM on public portal pages

#### Scenario: Analytics is absent when ID is not configured

- **WHEN** the app is built without `VITE_GA_MEASUREMENT_ID` set
- **THEN** no `gtag.js` script tag is added to the DOM
- **AND** no network request to `googletagmanager.com` is made

### Requirement: Page-view tracking on SPA navigation

The system SHALL fire a GA4 `page_view` event each time the URL changes within the public portal.
The `page_view` event MUST include the current `page_path` and `page_location`.
The system SHALL track page views for `/public`, `/public/resources/:id`, and `/public/documents/:id`.

#### Scenario: Initial page load tracked

- **WHEN** a guest lands on any public portal route for the first time
- **THEN** a `page_view` event is sent to GA4 for that route

#### Scenario: Client-side navigation tracked

- **WHEN** a guest navigates from the public home to a resource detail page
- **THEN** a `page_view` event is sent for the new route without a full page reload

#### Scenario: Navigation outside public portal not tracked

- **WHEN** a volunteer navigates to an authenticated route (e.g., `/dashboard`)
- **THEN** no GA4 `page_view` event is fired by the public-portal analytics component

### Requirement: Analytics scoped to public portal only

The GA4 tracking component MUST be mounted exclusively within the public portal layout.
The GA4 tracking component MUST NOT be mounted in the authenticated volunteer app layout.

#### Scenario: Analytics component absent in authenticated layout

- **WHEN** a volunteer is logged in and views the resource management dashboard
- **THEN** the `<GoogleAnalytics>` component is not mounted in the DOM

#### Scenario: Analytics component present in public layout

- **WHEN** a guest views any public portal page
- **THEN** the `<GoogleAnalytics>` component is mounted inside the public layout tree
