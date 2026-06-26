## ADDED Requirements

### Requirement: Current Volume Display
The system SHALL display the current Kodi volume as a large number (0-100) on the volume control screen.

#### Scenario: Volume read on screen focus
- **WHEN** the volume screen gains focus
- **THEN** the current volume SHALL be fetched from the proxy via `POST /api/volume {"type":"GET"}`

#### Scenario: Volume read after change
- **WHEN** a volume change operation (SET, UP, DOWN) completes
- **THEN** the display SHALL update with the new volume value returned in the response

### Requirement: Custom Gesture-Based Volume Slider
The system SHALL provide a draggable volume slider implemented with `react-native-gesture-handler` and `react-native-reanimated`.

#### Scenario: Slider drag sets volume
- **WHEN** the user drags the slider thumb
- **THEN** the volume display SHALL update immediately (optimistic UI)
- **THEN** a debounced `POST /api/volume {"type":"SET","level":<value>}` SHALL be sent

#### Scenario: Slider range
- **WHEN** the user drags the slider to the far left
- **THEN** the volume SHALL be set to 0
- **WHEN** the user drags the slider to the far right
- **THEN** the volume SHALL be set to 100

### Requirement: Incremental Volume Buttons
The system SHALL provide - and + buttons for incremental volume adjustment.

#### Scenario: Volume up button
- **WHEN** the user taps the + button
- **THEN** the volume SHALL increase by 5 (step)
- **WHEN** the current volume is 100
- **THEN** tapping + SHALL have no effect

#### Scenario: Volume down button
- **WHEN** the user taps the - button
- **THEN** the volume SHALL decrease by 5 (step)
- **WHEN** the current volume is 0
- **THEN** tapping - SHALL have no effect
