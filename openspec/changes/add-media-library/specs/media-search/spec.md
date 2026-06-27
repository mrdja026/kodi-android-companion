## ADDED Requirements

### Requirement: Free-Text Search Input
The system SHALL provide a text input on the Search screen that accepts free-text queries. The input SHALL debounce queries by 300ms before sending API requests.

#### Scenario: User types a search query
- **WHEN** the user types "star" in the search input
- **THEN** after 300ms of no further input, a search SHALL be dispatched to both `POST /api/movies` (type: SEARCH) and `POST /api/tvshows` (type: TV_SEARCH) with the query "star"
- **WHEN** the user continues typing to "star wars"
- **THEN** the 300ms timer SHALL reset and only fire after typing stops

### Requirement: Parallel Search Across Movies and TV Shows
The system SHALL execute movie and TV show searches in parallel and display results grouped by media type.

#### Scenario: Results grouped by type
- **WHEN** the search for "breaking" returns both movies and TV shows
- **THEN** the results SHALL be displayed in two labeled sections: "Movies" and "TV Shows"
- **THEN** each result SHALL show the item's title, year, and thumbnail (when available)

#### Scenario: Only movies matched
- **WHEN** the search matches movies but no TV shows
- **THEN** the "Movies" section SHALL be populated and the "TV Shows" section SHALL show a "No TV shows found" empty state (or be hidden entirely)

### Requirement: Search Result Navigation
The system SHALL allow the user to navigate from a search result to the corresponding detail screen.

#### Scenario: Tapping a movie result
- **WHEN** the user taps a movie result
- **THEN** the system SHALL navigate to the movie detail screen at `/movie/[movieid]` with the movie metadata available

#### Scenario: Tapping a TV show result
- **WHEN** the user taps a TV show result
- **THEN** the system SHALL navigate to the TV show detail screen at `/tvshow/[tvshowid]` with the TV show metadata available

### Requirement: Loading and Error States
The system SHALL show appropriate loading and error feedback during search.

#### Scenario: Loading indicator
- **WHEN** a search request is in-flight
- **THEN** a loading indicator SHALL be visible (e.g. ActivityIndicator) replacing or overlaying the results area

#### Scenario: Search error
- **WHEN** the proxy returns an error for one or both search requests
- **THEN** the system SHALL display an error message inline below the search bar and SHALL still show results from the successful request (if any)
