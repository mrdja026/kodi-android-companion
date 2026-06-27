## ADDED Requirements

### Requirement: Collapsible Search Result Sections
The system SHALL group search results into collapsible sections by media type. Each section header SHALL be pressable to toggle visibility of its items. Sections SHALL default to collapsed when the Search screen gains focus. A chevron indicator SHALL display the collapsed (▶) or expanded (▼) state.

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
- **WHEN** the user navigates away from the Search screen and returns
- **THEN** both sections SHALL be collapsed again

#### Scenario: Scrollable overflow
- **WHEN** search results exceed the available viewport height
- **THEN** the content area SHALL be scrollable
