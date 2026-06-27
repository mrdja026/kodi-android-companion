## ADDED Requirements

### Requirement: App Header
The app SHALL render a persistent top header bar above every screen with the title "Kodi Companion" on the left and a theme-toggle icon button on the right. The header SHALL respect the safe-area top inset and use the active theme's `surface` background.

#### Scenario: Header visible on every tab
- **WHEN** the user navigates to the Volume, Playback, or Settings tab
- **THEN** the header bar is rendered with the title "Kodi Companion" and the theme-toggle icon button without re-mounting between tabs

#### Scenario: Theme toggle flips effective theme
- **WHEN** the effective theme is dark and the user taps the theme-toggle icon
- **THEN** the effective theme becomes light, the icon swaps (e.g. moon → sun), and the change is persisted

### Requirement: Custom Bottom Tab Bar
The app SHALL render a custom JavaScript bottom tab bar (not the native `unstable-native-tabs` primitive) with exactly three equal-width cells in the order Volume, Playback, Settings. The active cell SHALL display its label and icon in the accent colour and SHALL be drawn on top of the `surfaceMuted` block. Inactive cells SHALL use the `textSecondary` colour.

#### Scenario: Active cell styling
- **WHEN** the Playback tab is the active route
- **THEN** the Playback cell renders its icon and label in accent colour with a `surfaceMuted` background block, while Volume and Settings cells render in `textSecondary` with no background block

#### Scenario: Tab navigation
- **WHEN** the user taps the Settings cell
- **THEN** the router navigates to the Settings screen and the Settings cell becomes the active cell

### Requirement: Theme Mode Selection
The app SHALL support three theme modes — `light`, `dark`, and `system` — exposed through a `ThemeContext`. The selected mode SHALL be persisted via `expo-sqlite/kv-store` under the key `themeMode`. When the mode is `system`, the effective palette SHALL follow `useColorScheme()`. On first launch the mode SHALL default to `system`.

#### Scenario: Persistence across restarts
- **WHEN** the user toggles the theme to dark and relaunches the app
- **THEN** the app starts in dark mode without flashing the opposite palette

#### Scenario: System mode follows OS
- **WHEN** the mode is `system` and the OS theme changes from dark to light
- **THEN** the app's effective palette updates to light without an app restart

### Requirement: Accent and Surface Tokens
The theme SHALL define `accent` (`#22d3ee` in dark, suitable cyan variant in light), `accentOn` (high-contrast foreground for use on `accent`), `accentMuted` (for inactive/disabled accent), `surface` (elevated card background), `surfaceMuted` (active-tab block, secondary surfaces), `border`, and `danger` tokens, in addition to the existing `text`, `textSecondary`, `background`, `backgroundElement`, and `backgroundSelected` tokens. Hardcoded screen colours (green `#1a6b3c`, red `#6b1a1a`, greys `#2a2a2a`, `#1a1a1a`, `#333`, `#666`) SHALL be removed from screen code in favour of these tokens.

#### Scenario: Volume buttons use tokens
- **WHEN** the Volume screen renders the step buttons
- **THEN** the `+` button background is `theme.accent` and the `−` button background is `theme.surfaceMuted`, with no hardcoded hex values in the screen file

### Requirement: Card Layout Component
The app SHALL expose a shared `Card` component used by all three screens. The card SHALL be centered horizontally, have a maximum width suitable for mobile portrait (≤ 360 dp), use `theme.surface` as background, `borderRadius: 16`, and consistent inner padding.

#### Scenario: Card consistency
- **WHEN** the Volume, Playback, or Settings screen mounts
- **THEN** the primary controls of that screen are wrapped in a single `Card` instance with the shared visual parameters
