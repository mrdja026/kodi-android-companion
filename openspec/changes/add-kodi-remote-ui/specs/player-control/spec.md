## ADDED Requirements

### Requirement: Playback Control Buttons
The system SHALL provide three playback control buttons: Play, Pause, and Stop.

#### Scenario: Play button
- **WHEN** the user taps the Play button
- **THEN** it SHALL send `POST /api/player {"type":"PLAY"}`

#### Scenario: Pause button
- **WHEN** the user taps the Pause button
- **THEN** it SHALL send `POST /api/player {"type":"PAUSE"}`

#### Scenario: Stop button
- **WHEN** the user taps the Stop button
- **THEN** it SHALL send `POST /api/player {"type":"STOP"}`

### Requirement: Disabled State When No Player Active
The system SHALL detect when no Kodi player is active and disable playback controls.

#### Scenario: 502 response disables controls
- **WHEN** a player action request returns 502 (no active player)
- **THEN** the button that was pressed SHALL return to its normal state
- **THEN** a message SHALL be displayed indicating no active player

### Requirement: Loading Indicator
The system SHALL show a loading indicator during player action requests.

#### Scenario: Loading state during request
- **WHEN** the user taps a playback control button
- **THEN** a loading indicator SHALL appear on the pressed button
- **WHEN** the request completes (success or error)
- **THEN** the loading indicator SHALL be removed
