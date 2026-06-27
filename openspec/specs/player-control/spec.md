# player-control Specification

## Purpose
TBD - created by archiving change add-player-seek. Update Purpose after archive.
## Requirements
### Requirement: Seek forward/backward on Now Playing screen
The system SHALL allow the user to seek forward or backward by 30 seconds during playback.

#### Scenario: Seek forward 30 seconds
- **WHEN** the user taps the ⏩ button on the Now Playing screen
- **THEN** the system sends `SEEK_FORWARD` with `seconds: 30` to the proxy
- **AND** the proxy calls Kodi's `Player.Seek` with `{"seconds": 30}`

#### Scenario: Seek backward 30 seconds
- **WHEN** the user taps the ⏪ button on the Now Playing screen
- **THEN** the system sends `SEEK_BACKWARD` with `seconds: 30` to the proxy
- **AND** the proxy calls Kodi's `Player.Seek` with `{"seconds": -30}`

#### Scenario: No active player
- **WHEN** the user taps ⏩ or ⏪ while no player is active
- **THEN** the proxy returns a 502 error
- **AND** the app displays the error message from the proxy

#### Scenario: Seek button loading state
- **WHEN** the user taps a seek button
- **THEN** the button SHALL show a loading state
- **AND** both seek buttons SHALL be disabled until the request completes or fails

