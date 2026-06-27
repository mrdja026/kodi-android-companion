## ADDED Requirements

### Requirement: Now Playing Screen Title
The system SHALL display the unified playback screen with the title "Now Playing".

#### Scenario: Title displayed
- **WHEN** the user navigates to the Playback tab
- **THEN** the screen SHALL display the title "Now Playing"

### Requirement: Post-Play Navigation to Now Playing
The system SHALL navigate to the Now Playing screen after a successful play action from any detail screen.

#### Scenario: Movie play navigates to Now Playing
- **WHEN** the user taps Play on a movie detail screen and the play request succeeds
- **THEN** the system SHALL navigate to the Playback tab (route `/playback`)

#### Scenario: Episode play navigates to Now Playing
- **WHEN** the user taps Play on a season episode and the play request succeeds
- **THEN** the system SHALL navigate to the Playback tab (route `/playback`)
