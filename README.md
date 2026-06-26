# Kodi Companion

Android remote control app for Kodi media center. Communicates with a local REST proxy ([kodi-minmal-api-wrapper](https://github.com/anomalyco/kodi-minmal-api-wrapper)) on port 5149.

Built with Expo SDK 54, file-based routing (Expo Router), `expo-sqlite/kv-store` for persistent settings, and React Context for state management.

## Setup

```bash
pnpm install
npx expo run:android --variant release
```

Configure the proxy IP and port in Settings (gear icon) — these persist across app restarts.

## Tabs

- **Volume** — Slider and +/-5 buttons to control Kodi volume
- **Player** — Play/Pause/Stop controls
- **Settings** (gear icon) — Proxy IP/port config with Test Connection

## Known Issues

- **Volume screen**: On load, the volume label briefly shows `[Object Object]` before the correct value appears. The slider still works after.
- **Text legibility**: Dark theme colors need adjustment — some text is hard to read against the background. No code changes have been made to address this yet.
