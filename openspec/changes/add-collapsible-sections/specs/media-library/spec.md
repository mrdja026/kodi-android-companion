## ADDED Requirements

### Requirement: Collapsible Browse Sections
The system SHALL group browse results into collapsible sections by media type. Each section header SHALL be pressable to toggle visibility of its items. Sections SHALL default to collapsed when the Browse screen gains focus. A chevron indicator SHALL display the collapsed (▶) or expanded (▼) state. Section titles SHALL NOT include a count badge.

#### Scenario: Collapse a section
- **WHEN** the Movies section is expanded and the user taps the "Movies" header
- **THEN** the section SHALL collapse, hiding all movie results
- **THEN** the chevron SHALL change from ▼ to ▶

#### Scenario: Expand a section
- **WHEN** the TV Shows section is collapsed and the user taps the "TV Shows" header
- **THEN** the section SHALL expand, revealing all TV show results
- **THEN** the chevron SHALL change from ▶ to ▼

#### Scenario: Independent section toggling
- **WHEN** Movies is collapsed and TV Shows is expanded
- **THEN** expanding Movies SHALL NOT affect the TV Shows section state

#### Scenario: State reset on focus
- **WHEN** the user navigates away from the Browse screen and returns
- **THEN** both sections SHALL be collapsed again

#### Scenario: Scrollable overflow
- **WHEN** browse results exceed the available viewport height
- **THEN** the content area SHALL be scrollable

#### Scenario: No count badge
- **WHEN** the Browse screen displays sections
- **THEN** the section titles SHALL be "Movies" and "TV Shows" without count badges
