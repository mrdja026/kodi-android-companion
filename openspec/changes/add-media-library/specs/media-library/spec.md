## ADDED Requirements

### Requirement: Movie Detail and Play
The system SHALL display metadata for a single movie and provide a Play action.

#### Scenario: Movie detail display
- **WHEN** the user navigates to `/movie/[id]`
- **THEN** the screen SHALL show the movie title, year, genre, runtime, thumbnail, and a "Play" button in a Card layout

#### Scenario: Play movie
- **WHEN** the user taps "Play" on a movie detail screen
- **THEN** the system SHALL send `POST /api/movies` with `{type:"PLAY_MOVIE", movieId: <id>}`
- **THEN** Kodi SHALL begin playback of that movie
- **WHEN** the proxy returns an error (502: Kodi Unreachable or Kodi Error)
- **THEN** the system SHALL display the error message inline

### Requirement: TV Show Seasons List
The system SHALL display the seasons of a TV show and allow navigation to a specific season's episodes.

#### Scenario: Seasons displayed
- **WHEN** the user navigates to `/tvshow/[id]`
- **THEN** the system SHALL call `POST /api/tvshows` with `{type:"TV_SEASONS", tvshowId: <id>}`
- **THEN** the seasons SHALL be displayed as a list, each showing the season number and thumbnail

#### Scenario: Navigate to season
- **WHEN** the user taps a season
- **THEN** the system SHALL navigate to `/tvshow/[id]/season/[num]`

### Requirement: Season Episodes List and Play
The system SHALL display episodes for a given TV show season and provide a Play action per episode.

#### Scenario: Episodes displayed
- **WHEN** the user navigates to `/tvshow/[id]/season/[num]`
- **THEN** the system SHALL call `POST /api/tvshows` with `{type:"TV_EPISODES", tvshowId: <id>, season: <num>}`
- **THEN** the episodes SHALL be displayed as a list, each showing title, episode number, runtime, and thumbnail

#### Scenario: Play episode
- **WHEN** the user taps "Play" on an episode row
- **THEN** the system SHALL send `POST /api/tvshows` with `{type:"TV_PLAY_EPISODE", episodeId: <id>}`
- **THEN** Kodi SHALL begin playback of that episode
- **WHEN** the proxy returns an error
- **THEN** the system SHALL display the error message inline

### Requirement: Browse Recently Added Media
The system SHALL provide a Browse tab showing recently added movies and episodes as an entry point to the library.

#### Scenario: Recently added displayed
- **WHEN** the user navigates to the Browse tab
- **THEN** the system SHALL call `POST /api/movies` with `{type:"RECENT", limit: 10}` and `POST /api/tvshows` with `{type:"TV_RECENT", limit: 10}` in parallel
- **THEN** results SHALL be displayed in two sections: "Recently Added Movies" and "Recently Added Episodes"
- **WHEN** the user taps a recently added movie
- **THEN** the system SHALL navigate to `/movie/[id]`
- **WHEN** the user taps a recently added episode
- **THEN** the system SHALL navigate to `/tvshow/[tvshowid]/season/[season]` for that episode

### Requirement: Library Scan
The system SHALL provide a way to trigger a Kodi library scan from the Settings screen.

#### Scenario: Scan library button
- **WHEN** the user taps "Scan Library" on the Settings screen
- **THEN** the system SHALL send `POST /api/movies` with `{type:"SCAN"}`
- **THEN** Kodi SHALL begin scanning its video library in the background
- **WHEN** the scan completes or errors
- **THEN** the system SHALL show a brief success or error indicator (e.g. banner or toast)
