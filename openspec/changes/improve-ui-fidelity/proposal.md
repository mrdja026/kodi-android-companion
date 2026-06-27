# Change: Improve UI fidelity to match reference mocks (rename to "Kodi Companion")

## Why
The current UI uses native bottom tabs, a green accent, and no top chrome — visually unrelated to the agreed reference mocks in `docs/reference_images/` (volume.png, playback.png, settings.png). Bringing the app close to those mocks gives Kodi Companion a coherent identity, a working theme toggle, and a clearer interaction model on every screen.

## What Changes
- **App header**: new top bar across every screen with the title "Kodi Companion" on the left and a theme-toggle icon on the right.
- **Bottom tabs**: **BREAKING** swap from `expo-router/unstable-native-tabs` (`NativeTabs`) to `expo-router` `Tabs` with a custom JS `tabBar`. Tab order becomes Volume · Playback · Settings; the active tab gets a cyan label/icon and a lighter background block.
- **Route rename**: **BREAKING** `src/app/player.tsx` → `src/app/playback.tsx`. Tab label "Player" becomes "Playback".
- **Theme system**: real light + dark theme. Remove `userInterfaceStyle: "dark"` from `app.json`, introduce a `ThemeMode` context (`light` | `dark` | `system`) persisted via `expo-sqlite/kv-store`, and surface it from `useTheme()`. The header toggle flips between light and dark.
- **Accent color**: project accent moves from green `#1a6b3c` to cyan `#22d3ee` (with on-cyan text `#0b0f12` and a muted cyan for inactive states). Adds cyan + surface tokens to `Colors` in `src/constants/theme.ts`.
- **Card layout**: a shared `Card` surface used by all three screens — centered, capped width on mobile, rounded, on the elevated surface token.
- **Volume screen**: card containing slider → big cyan number → "Volume Level" caption → `−` (grey) and `+` (cyan) step buttons. Uses the existing `useVolume` hook unchanged.
- **Playback screen**: card with three circular icon buttons (Play / Pause / Stop) and a status caption beneath ("Stopped" / "Playing" / "Paused"). Existing API calls unchanged; adds local optimistic status state.
- **Settings screen**: redesign — Proxy Host + Port inputs, cyan **Connect** button that performs the live test, **Not Connected / Testing… / Connected** status pill, grey **Save & Continue** button. No Protocol/Path field; existing `proxyIp`/`proxyPort` model is unchanged.
- **app.json**: `expo.name` → `Kodi Companion`. `slug` (`kodi-remote`) and Android `package` (`com.kodi.remote`) are intentionally untouched to avoid breaking the dev APK install and any EAS linkage.
- **Project conventions**: update `openspec/project.md` — drop "Dark theme forced" from "Important Constraints" since theme is now user-controlled.
- Help (?) FAB is **out of scope**.

## Impact
- Affected specs:
  - `app-shell` (new capability — header, custom tabs, theme system, card pattern, accent token)
  - `volume-control` (visual-design requirement added)
  - `player-control` (visual-design requirement added; route renamed to `playback`)
  - `connection-settings` (visual-design requirement added; button labels and status pill)
- Affected code:
  - `app.json` (`name`, `userInterfaceStyle`)
  - `src/constants/theme.ts` (cyan + surface tokens, light/dark parity)
  - `src/app/_layout.tsx` (ThemeMode provider, `Tabs` with custom `tabBar`, `AppHeader`)
  - `src/components/app-tabs.tsx` (replace with `CustomTabBar`)
  - `src/components/app-header.tsx` (new)
  - `src/components/card.tsx` (new)
  - `src/components/circular-button.tsx` (new)
  - `src/context/ThemeContext.tsx` (new — persisted `ThemeMode`)
  - `src/hooks/use-theme.ts` (consume ThemeContext instead of system colour scheme only)
  - `src/app/index.tsx` (volume screen redesign)
  - `src/app/player.tsx` → renamed `src/app/playback.tsx` (circular buttons + status caption)
  - `src/app/settings.tsx` (Connect / status pill / Save & Continue)
  - `openspec/project.md` (constraint update)
- Coexists with the pending `add-kodi-remote-ui` change by using `ADDED` requirements only against the screen capabilities; no `MODIFIED` deltas are written against requirements that have not yet been archived to `openspec/specs/`.
