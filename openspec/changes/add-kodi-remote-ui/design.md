## Context

Build a Kodi remote control Android app using Expo SDK 54. The app communicates with a desktop REST proxy (port 5149) that translates HTTP calls to Kodi JSON-RPC 2.0. No authentication on proxy; Kodi basic auth (kodi:1233) is handled server-side.

## Goals / Non-Goals

- Goals:
  - Replace boilerplate with volume control, player control, and settings screens
  - Persistent proxy address configuration via key-value storage
  - Custom gesture-based volume slider (no third-party slider library)
  - Robust error handling with 5s timeout
  - Dark, minimal Kodi-like theme
  - Development APK via `npx expo run:android --variant release`

- Non-Goals:
  - iOS support (Android only)
  - Authentication UI (proxy has none)
  - Server discovery / mDNS
  - Now playing metadata display
  - Playlist management

## Decisions

### Decision 1: expo-sqlite/kv-store for persistent settings
- **What**: Use `expo-sqlite/kv-store` instead of `@react-native-async-storage/async-storage`
- **Why**: Already bundled with Expo SDK 54 (no extra install), provides sync API (`getItemSync`/`setItemSync`) for simpler settings hydration, same async API surface as AsyncStorage
- **Alternatives considered**: AsyncStorage (needs install, async-only), MMKV (needs native module install)

### Decision 2: Native slider for volume
- **What**: Use `@react-native-community/slider` for the volume slider
- **Why**: Smoother touch response on Android vs custom gesture implementation; battle-tested component; handles edge cases (rapid drags, multi-touch) better than custom PanGesture approach
- **Alternatives considered**: Custom gesture slider (janky on Android, complex debounce), built-in Slider (deprecated in RN 0.81)

### Decision 3: Single `SettingsContext` for proxy config
- **What**: React Context providing `proxyUrl` (derived from stored `ip` + `port`), `setProxyIp()`, `setProxyPort()`, `testConnection()`, and loading/saving to kv-store
- **Why**: Simple, no extra deps; only cross-cutting concern is proxy URL; avoids prop drilling to screens
- **Alternatives considered**: Zustand (extra dep for minimal cross-screen state), Redux (overkill)

### Decision 4: Inline timeout via AbortController
- **What**: Wrap `fetch` with `AbortController` and `setTimeout` for 5-second timeout
- **Why**: Built-in, no dependencies; clean cancellation
- **Alternatives considered**: axios with timeout config (extra dep, larger bundle)

### Decision 5: 2 tabs + settings gear
- **What**: NativeTabs with two triggers (Volume, Player) + a settings gear icon in the tab bar area that navigates to a settings screen
- **Why**: User preference; keeps main controls always accessible; settings accessed less frequently

## Risks / Trade-offs

- expo-sqlite/kv-store persistence on Android: need to verify kv-store survives app restarts (should, SQLite-backed)
- Gesture slider on Android: PanGesture + reanimated works well but needs `react-native-gesture-handler` root wrapper (already in _layout.tsx)
- 5s timeout: network requests on slow WiFi may always fail; could be made configurable later

## Open Questions

- Should the settings screen be a stack push or a modal presentation? (Modal feels more natural for settings overlay)
- Tab bar gear icon: use a custom icon or SF Symbol/Material icon?
