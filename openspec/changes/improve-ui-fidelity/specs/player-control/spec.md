## ADDED Requirements

### Requirement: Playback Screen Visual Design
The Playback screen SHALL render the title "Playback Controls" above a single `Card`. The card SHALL contain a centered row of three circular icon buttons in the order Play, Pause, Stop, followed beneath by a status caption showing one of "Stopped", "Playing", or "Paused". Each circular button SHALL be drawn on `theme.surfaceMuted` with the icon in `theme.text`; the in-flight button SHALL show a pressed/loading affordance.

#### Scenario: Three circular buttons in a row
- **WHEN** the Playback screen mounts
- **THEN** the card renders exactly three circular buttons in the order Play, Pause, Stop, each of equal size (44–56 dp diameter)

#### Scenario: Status caption reflects last action
- **WHEN** the user taps Play and the `playerPlay` API call resolves successfully
- **THEN** the status caption updates to "Playing"

#### Scenario: Initial status is Stopped
- **WHEN** the Playback screen first mounts
- **THEN** the status caption reads "Stopped"

### Requirement: Playback Route Rename
The screen previously routed as `/player` SHALL be served from `/playback`. The Expo Router file SHALL live at `src/app/playback.tsx`. The corresponding tab trigger SHALL have `name="playback"` and the tab label SHALL read "Playback".

#### Scenario: Old route is gone
- **WHEN** the app is built
- **THEN** there is no `src/app/player.tsx` file and no `Tabs.Screen name="player"` registration

#### Scenario: New route is active
- **WHEN** the user taps the Playback tab
- **THEN** the router navigates to `/playback` and the Playback screen renders
