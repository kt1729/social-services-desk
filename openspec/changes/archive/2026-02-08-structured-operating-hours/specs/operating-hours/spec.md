## ADDED Requirements

### Requirement: Structured operating hours data model

The system SHALL store operating hours as an array of 7 `DaySchedule` objects on the `Resource` type, replacing the `openDays` and `openHours` string fields.

Each `DaySchedule` SHALL contain:

- `day`: one of `'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'`
- `open`: a time string in `"HH:mm"` 24-hour format, or `null` if closed
- `close`: a time string in `"HH:mm"` 24-hour format, or `null` if closed

The `operatingHours` field SHALL always contain exactly 7 entries, one per day of the week, ordered Monday through Sunday.

#### Scenario: Resource with varying daily hours

- **WHEN** a resource has Mon–Sat open 08:00–22:00 and Sun open 08:00–20:00
- **THEN** `operatingHours` contains 7 entries with Mon–Sat having `open: "08:00", close: "22:00"` and Sun having `open: "08:00", close: "20:00"`

#### Scenario: Resource with a closed day

- **WHEN** a resource is closed on Sunday
- **THEN** the Sun entry has `open: null, close: null`

#### Scenario: Default state for new resource

- **WHEN** a new resource is created without setting hours
- **THEN** all 7 `DaySchedule` entries SHALL have `open: null, close: null`

### Requirement: Operating hours input component

The system SHALL provide an `OperatingHoursInput` component that displays one row per day of the week, each containing:

- The day label (Mon, Tue, Wed, Thu, Fri, Sat, Sun)
- A toggle to mark the day as open or closed
- When open: two time picker inputs for open and close times
- A "Copy to all" button that copies the current day's hours to all other days

#### Scenario: Volunteer sets hours for Monday

- **WHEN** a volunteer toggles Monday to open and sets open time to 08:00 and close time to 22:00
- **THEN** the Monday entry updates to `{ day: 'mon', open: "08:00", close: "22:00" }`

#### Scenario: Volunteer marks Sunday as closed

- **WHEN** a volunteer toggles Sunday to closed
- **THEN** the Sunday entry updates to `{ day: 'sun', open: null, close: null }` and the time pickers are hidden

#### Scenario: Volunteer uses copy to all

- **WHEN** a volunteer sets Monday to 09:00–17:00 and clicks "Copy to all"
- **THEN** all 7 days update to `open: "09:00", close: "17:00"`

### Requirement: Operating hours display formatting

The system SHALL format `operatingHours` for display by grouping consecutive days with identical open/close times into ranges.

Times SHALL be displayed in 12-hour format with AM/PM (e.g., "8:00 AM – 10:00 PM").

#### Scenario: All days same hours

- **WHEN** all 7 days have `open: "08:00", close: "22:00"`
- **THEN** the formatted output is "Every day: 8:00 AM – 10:00 PM"

#### Scenario: Weekdays and weekend differ

- **WHEN** Mon–Fri have `open: "09:00", close: "17:00"` and Sat–Sun have `open: "10:00", close: "14:00"`
- **THEN** the formatted output is "Mon–Fri: 9:00 AM – 5:00 PM" and "Sat–Sun: 10:00 AM – 2:00 PM"

#### Scenario: One day is closed

- **WHEN** Mon–Sat have `open: "08:00", close: "20:00"` and Sun is closed
- **THEN** the formatted output includes "Mon–Sat: 8:00 AM – 8:00 PM" and "Sun: Closed"

#### Scenario: No hours set

- **WHEN** all 7 days have `open: null, close: null`
- **THEN** no hours are displayed (empty/hidden)

### Requirement: Operating hours in resource form

The `ResourceForm` component SHALL use `OperatingHoursInput` instead of the two text fields for open days and open hours. The component SHALL appear in the English language tab section of the form.

#### Scenario: Creating a resource with operating hours

- **WHEN** a volunteer fills in the resource form including operating hours and submits
- **THEN** the resource is saved to Firestore with the `operatingHours` array

#### Scenario: Editing a resource with existing operating hours

- **WHEN** a volunteer opens the edit form for a resource that has `operatingHours`
- **THEN** the `OperatingHoursInput` is pre-populated with the existing schedule

### Requirement: Operating hours in resource display

The `ResourceCard`, `ResourceDetail`, and `PrintResourceCard` components SHALL display the formatted operating hours using the grouping formatter.

#### Scenario: Resource card shows grouped hours

- **WHEN** a resource has operating hours set
- **THEN** the resource card displays the formatted grouped schedule next to a clock icon

#### Scenario: Resource detail shows grouped hours

- **WHEN** viewing a resource detail page for a resource with operating hours
- **THEN** the detail page displays the formatted grouped schedule

#### Scenario: Print card shows grouped hours

- **WHEN** printing a resource card
- **THEN** the print layout displays the formatted grouped schedule
