## ADDED Requirements

### Requirement: Settings Screen Visual Design
The Settings screen SHALL render the title "Proxy Settings" above a single `Card`. The card SHALL contain, in vertical order: a "Proxy Host" labelled text input bound to the persisted IP, a "Port" labelled text input bound to the persisted port, a primary cyan **Connect** button that performs a live connection test, a status pill that displays exactly one of "Not Connected", "Testing…", or "Connected", and a secondary grey **Save & Continue** button that persists the inputs. The screen SHALL NOT render a Protocol/Path input.

#### Scenario: Connect button is the primary cyan action
- **WHEN** the Settings screen renders
- **THEN** the **Connect** button background is `theme.accent` and its label colour is `theme.accentOn`

#### Scenario: Status pill reflects test result
- **WHEN** the user taps **Connect** and the live test succeeds
- **THEN** the status pill reads "Connected" and uses `theme.accent` as its background

#### Scenario: Failure surfaces detail
- **WHEN** the user taps **Connect** and the live test fails
- **THEN** the status pill reverts to "Not Connected" on `theme.danger` and a sub-line shows the failure detail returned by the API client

#### Scenario: Save & Continue persists the inputs
- **WHEN** the user edits the Host or Port and taps **Save & Continue**
- **THEN** the new values are written to persistent storage and used by `proxyUrl` for subsequent API calls

#### Scenario: No Protocol/Path field
- **WHEN** the Settings screen renders
- **THEN** there is no third text input for protocol or path; only Proxy Host and Port are editable
