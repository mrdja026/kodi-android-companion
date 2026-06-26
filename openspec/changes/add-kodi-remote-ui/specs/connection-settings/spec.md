## ADDED Requirements

### Requirement: Proxy IP and Port Configuration
The system SHALL allow the user to configure the Kodi proxy IP address and port via a settings screen.

#### Scenario: Default port pre-filled
- **WHEN** the user opens the settings screen for the first time
- **THEN** the port input SHALL be pre-filled with `5149`

#### Scenario: IP address input
- **WHEN** the user taps the IP address field
- **THEN** a text input accepting IPv4 format SHALL be shown
- **WHEN** the user enters a valid IP address
- **THEN** it SHALL be accepted

### Requirement: Persistent Settings Storage
The system SHALL persist the proxy IP address and port using `expo-sqlite/kv-store` across app restarts.

#### Scenario: Settings persist after restart
- **WHEN** the user configures proxy settings and restarts the app
- **THEN** the previously saved IP and port SHALL be restored

### Requirement: Connection Testing
The system SHALL provide a "Test Connection" button that calls `POST /api/volume {"type":"GET"}` to verify proxy reachability.

#### Scenario: Successful connection test
- **WHEN** the user taps "Test Connection" and the proxy responds
- **THEN** a success indicator SHALL be shown (not an alert dialog)

#### Scenario: Failed connection test
- **WHEN** the user taps "Test Connection" and the request fails or times out
- **THEN** an error message SHALL be shown inline (not an alert dialog)
