## ADDED Requirements

### Requirement: Volume Control Integrated in Now Playing
The system SHALL provide volume controls (slider, number display, step buttons) on the Now Playing screen, positioned below the playback control buttons inside the same Card.

#### Scenario: Volume slider on Now Playing
- **WHEN** the user views the Now Playing screen
- **THEN** a draggable volume slider SHALL be visible below the playback status text

#### Scenario: Volume number display
- **WHEN** the user views the Now Playing screen
- **THEN** the current volume level (0–100) SHALL be displayed as a large number below the slider

#### Scenario: Volume step buttons
- **WHEN** the user views the Now Playing screen
- **THEN** − and + buttons SHALL be visible below the volume number for 10-step adjustments

#### Scenario: Volume value fetched on focus
- **WHEN** the Now Playing screen gains focus
- **THEN** the current volume SHALL be fetched from the proxy

### Requirement: Volume Tab Removed
The system SHALL NOT display a standalone Volume tab in the bottom tab bar.

#### Scenario: Tab bar without Volume
- **WHEN** the user views the bottom tab bar
- **THEN** there SHALL be four tabs: Search, Browse, Now Playing, Settings (in that order)
- **THEN** there SHALL be no Volume tab

#### Scenario: Index route redirect
- **WHEN** the app navigates to the root route `/`
- **THEN** the system SHALL redirect to the Playback tab
