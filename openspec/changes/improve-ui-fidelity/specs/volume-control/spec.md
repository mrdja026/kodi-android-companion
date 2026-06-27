## ADDED Requirements

### Requirement: Volume Screen Visual Design
The Volume screen SHALL render the title "Volume Control" above a single `Card`. The card SHALL contain, in vertical order: a horizontal slider track bound to the volume value, the current volume as a large numeric display in the accent colour, the caption "Volume Level" below the number, and a row with a `−` step-down button (on `surfaceMuted`) and a `+` step-up button (on `accent`). The screen SHALL use no hardcoded hex colours.

#### Scenario: Layout order in the card
- **WHEN** the Volume screen mounts
- **THEN** the children of the card appear in the order: slider, large number, "Volume Level" caption, then the `[−][+]` button row

#### Scenario: Cyan accent on plus button and number
- **WHEN** the Volume screen renders
- **THEN** the `+` button background is `theme.accent`, the numeric volume display text colour is `theme.accent`, and the `−` button background is `theme.surfaceMuted`

#### Scenario: Slider drives volume hook
- **WHEN** the user drags the slider thumb to a new position
- **THEN** `useVolume().set(level)` is invoked with the new value and the displayed number updates immediately
