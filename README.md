# Kodi Companion

Android remote control app for Kodi media center. Communicates with a local REST proxy ([kodi-minmal-api-wrapper](https://github.com/anomalyco/kodi-minmal-api-wrapper)) on port 5149.

Built with Expo SDK 54, file-based routing (Expo Router), `expo-sqlite/kv-store` for persistent settings, and React Context for state management.

## Setup

```bash
pnpm install
npx expo run:android --variant release
```

Configure the proxy IP and port in Settings — these persist across app restarts.

## Features

### Tabs
- **Now Playing** — Play/Pause/Stop transport controls, seek forward/backward 30s, volume slider with ± step buttons, current volume display
- **Search** — Two modes: **Library** (search movies/TV shows by title) and **Files** (search and browse Kodi filesystem directories with play-by-path)
- **Browse** — Browse full movie and TV show libraries; tap to view details
- **Settings** — Proxy IP/port configuration with Test Connection, System commands (Shutdown, Reboot)

### Navigation
- **Movie / TV show details** — View metadata, tap Play to start playback and auto-navigate to Now Playing
- **Season / Episode browser** — Browse seasons, tap an episode to play with auto-navigate

### Theme
- Light / Dark / System theme toggle
- Persisted across restarts

## Tech Stack

- Expo SDK 54
- Expo Router (file-based routing)
- `expo-sqlite/kv-store` for config persistence
- React Context for settings and theme state
- Custom tab bar with 4 tabs
