# Change: Add Kodi Remote Control UI

## Why
Replace the Expo boilerplate starter with a functional Kodi remote control app that communicates with a local REST proxy. The app provides volume control, media playback control, and persistent connection settings.

## What Changes
- Replace existing boilerplate screens (Home/Explore) with Volume Control and Player Control tabs
- Add a Settings screen accessible from the tab bar as a modal/stack
- Create a typed API client for the Kodi REST proxy (`POST /api/volume`, `POST /api/player`, `POST /api/system/shutdown`, `POST /api/system/reboot`)
- Implement custom gesture-based volume slider using react-native-gesture-handler + reanimated
- Add persistent settings storage via `expo-sqlite/kv-store` (proxy IP/port)
- Implement 5-second request timeout and graceful error handling
- Keep dark theme, remove web-specific components

## Impact
- Affected specs: `connection-settings`, `volume-control`, `player-control`, `api-client` (all new)
- Affected code:
  - `src/app/_layout.tsx` — refactor tabs
  - `src/app/index.tsx` — replace with volume screen
  - `src/app/explore.tsx` — remove
  - `src/components/app-tabs.tsx` — update tab definitions
  - New files: `src/app/player.tsx`, `src/app/settings.tsx`, `src/services/api.ts`, `src/context/SettingsContext.tsx`, `src/hooks/use-api.ts`, `src/hooks/use-volume.ts`, `src/components/VolumeSlider.tsx`, `src/components/PlayerButton.tsx`
- Removes web-specific components: `web-badge.tsx`, `animated-icon.web.tsx`, `app-tabs.web.tsx`
