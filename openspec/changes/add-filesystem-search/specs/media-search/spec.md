## ADDED Requirements

### Requirement: Filesystem Search Mode
The system SHALL provide a Files mode on the Search screen, separate from the Library mode, that searches Kodi's filesystem for files whose label matches the query.

#### Scenario: Switch to Files mode
- **WHEN** the user taps the "Files" segment in the segmented control
- **THEN** the search input placeholder SHALL change to "Search files on Kodi…"
- **THEN** any existing Library results SHALL remain visible until the user starts a new search

#### Scenario: Filesystem search
- **WHEN** the user types a query in Files mode
- **THEN** after 300ms debounce, the system SHALL send `POST /api/tvshows {"type":"TV_SEARCH_ALL","query":"<query>"}`
- **THEN** results SHALL be displayed in a collapsible "Files" section

### Requirement: File and Directory Display
The system SHALL display filesystem entries with a type-appropriate icon and label.

#### Scenario: File item display
- **WHEN** the result has `filetype: "file"`
- **THEN** it SHALL display a 📄 icon and the entry's `label`

#### Scenario: Directory item display
- **WHEN** the result has `filetype: "directory"`
- **THEN** it SHALL display a 📁 icon and the entry's `label`

#### Scenario: Browse directory contents
- **WHEN** the user taps a directory item
- **THEN** the system SHALL call `POST /api/files/directory {"directory":"<path>","media":"video"}`
- **THEN** the results SHALL be replaced with the directory's contents
- **THEN** a back button SHALL be visible to return to the previous level

#### Scenario: Directory back navigation
- **WHEN** the user taps the back button while browsing a directory
- **THEN** the system SHALL return to the previous directory level (or the search results if at the top level)

### Requirement: Play File from Filesystem
The system SHALL play a file from the filesystem and navigate to the Now Playing screen.

#### Scenario: Play a file
- **WHEN** the user taps a file item (filetype: "file")
- **THEN** the system SHALL send `POST /api/player {"type":"PLAY","file":"<file_path>"}`
- **THEN** on success, the system SHALL navigate to the Playback tab (route `/playback`)
- **WHEN** the request fails
- **THEN** an error message SHALL be displayed

### Requirement: Collapsible Results in Files Mode
The system SHALL allow the user to collapse and expand the Files section.

#### Scenario: Collapse/expand files section
- **WHEN** the user taps the "Files" section header
- **THEN** the section SHALL toggle between collapsed and expanded states
- **WHEN** the Search screen regains focus
- **THEN** the Files section SHALL reset to collapsed and the directory path SHALL reset to root
