## ADDED Requirements

### Requirement: Typed HTTP Client
The system SHALL provide a typed fetch wrapper for communicating with the Kodi REST proxy.

#### Scenario: Request with timeout
- **WHEN** a request is made to the proxy
- **THEN** a 5-second timeout SHALL be enforced via `AbortController`
- **WHEN** the timeout is exceeded
- **THEN** the request SHALL be aborted and an error SHALL be returned

#### Scenario: Network error handling
- **WHEN** a network error occurs or the proxy is unreachable
- **THEN** a user-friendly error message SHALL be shown

### Requirement: Volume API Integration
The system SHALL call `POST /api/volume` with the proper polymorphic request body.

#### Scenario: GET current volume
- **WHEN** the app requests the current volume
- **THEN** it SHALL send `{"type":"GET"}` to `POST /api/volume`
- **THEN** the response (integer 0-100) SHALL be parsed and returned

#### Scenario: SET volume to absolute value
- **WHEN** the user sets volume to a specific level
- **THEN** it SHALL send `{"type":"SET","level":<value>}` to `POST /api/volume`

#### Scenario: UP volume by delta
- **WHEN** the user presses volume up
- **THEN** it SHALL send `{"type":"UP","level":<step>}` to `POST /api/volume`

#### Scenario: DOWN volume by delta
- **WHEN** the user presses volume down
- **THEN** it SHALL send `{"type":"DOWN","level":<step>}` to `POST /api/volume`

### Requirement: Player API Integration
The system SHALL call `POST /api/player` with the proper action types.

#### Scenario: PLAY action
- **WHEN** the user taps Play
- **THEN** it SHALL send `{"type":"PLAY"}` to `POST /api/player`

#### Scenario: PAUSE action
- **WHEN** the user taps Pause
- **THEN** it SHALL send `{"type":"PAUSE"}` to `POST /api/player`

#### Scenario: STOP action
- **WHEN** the user taps Stop
- **THEN** it SHALL send `{"type":"STOP"}` to `POST /api/player`

#### Scenario: No active player
- **WHEN** no player is active and an action is requested
- **THEN** the client SHALL handle a 502 response gracefully
