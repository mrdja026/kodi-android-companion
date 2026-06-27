## Context
The agreed reference mocks (`docs/reference_images/volume.png`, `playback.png`, `settings.png`) describe a unified shell: a top app bar, a custom bottom tab bar with a cyan-highlighted active cell, and a centered card per screen. The current app uses `expo-router/unstable-native-tabs` (`NativeTabs`), forces dark mode at the platform level, and uses a green accent — all of which prevent reaching the target fidelity without structural changes. The pending `add-kodi-remote-ui` change introduced the screen capabilities (`volume-control`, `player-control`, `connection-settings`) but did not include visual-design requirements, so we have room to add them additively without `MODIFIED` deltas that would conflict with un-archived specs.

## Goals / Non-Goals
- Goals
  - Visual fidelity to the three reference mocks while staying on Android portrait.
  - Real, persisted light/dark theme; toggle in the header is functional.
  - A single shared shell (header + tabs + card) all screens consume.
  - No regression in proxy behaviour — `useVolume`, `playerPlay/Pause/Stop`, `testConnection` keep their signatures.
- Non-Goals
  - Help/About modal or FAB.
  - Protocol/path field in Settings.
  - Renaming the `kodi-remote` slug or `com.kodi.remote` Android package.
  - Custom animations beyond default press feedback and tab fade.
  - iOS-specific theming (Android-only project).

## Decisions
- **Decision**: Replace `NativeTabs` with `expo-router` `Tabs` using a custom `tabBar` render prop.
  - **Why**: NativeTabs cannot reproduce the cyan-label-plus-block-highlight active style from the mocks without forking the native primitive. `Tabs` with a custom `tabBar` is the documented Expo Router pattern for full-control bottom navigation and keeps file-based routing intact.
  - **Alternatives**: (a) restyle NativeTabs via `indicatorColor` only — rejected, can't draw the active-cell background block. (b) Hand-roll a bottom bar outside the router — rejected, loses deep linking and `typedRoutes`.
- **Decision**: Theme mode is stored as `'light' | 'dark' | 'system'`, with `'effective'` derived via `useColorScheme()` when in `'system'`. Persisted under key `themeMode` in `expo-sqlite/kv-store`. Default on first launch is `'system'`.
  - **Why**: Matches platform expectations and lets the toggle be a true two-state switch (current effective → opposite) without surfacing a three-way picker, which the mock does not show.
  - **Alternatives**: Binary `'light' | 'dark'` only — rejected, prevents respecting OS theme out of the box.
- **Decision**: Cyan accent token is `#22d3ee` (Tailwind cyan-400 family). On-accent text/icons use `#0b1115` for AA contrast. Inactive tab and disabled accent use `accentMuted` (`#155e75`).
  - **Why**: Visually matches the saturation of the mock and reads well on the very dark navy/black background used throughout.
- **Decision**: Add screen-level requirements as `ADDED Requirements` in the existing screen capabilities (`volume-control`, `player-control`, `connection-settings`) rather than `MODIFIED Requirements`.
  - **Why**: Those capabilities are introduced by the pending `add-kodi-remote-ui` change and do not yet live in `openspec/specs/`. `MODIFIED` would need the full archived requirement block, which does not exist; `ADDED` is the documented OpenSpec pattern when the new requirement is orthogonal to behaviour already in flight.
- **Decision**: Rename file `src/app/player.tsx` → `src/app/playback.tsx` and update the `expo-router` `Tabs.Screen` `name`. The capability id stays `player-control` to avoid cross-capability churn in this single proposal.
  - **Why**: The route name lives in the user-visible URL/intent space; the capability id is internal to OpenSpec and is best renamed in a dedicated future change.
- **Decision**: Status caption on the Playback screen is local optimistic state (Stopped / Playing / Paused) updated after a successful API call. No new endpoint is introduced.
  - **Why**: Avoids adding a Kodi `Player.GetActiveItem` poll loop in this UI change; can be added later.
- **Decision**: Settings status pill has three states: `Not Connected` (default and after failure), `Testing…` (in-flight), `Connected` (last test succeeded). Pill colour comes from `theme.accent` for success, `theme.surfaceMuted` for idle, and `theme.danger` for failure with a sub-line of error detail.
  - **Why**: One-glance feedback that matches the mock without a modal.

## Risks / Trade-offs
- **Risk**: Switching from `NativeTabs` to `Tabs` may change Android system insets / status-bar handling. → Mitigation: keep `GestureHandlerRootView` wrapper, render `AppHeader` with `useSafeAreaInsets` top padding, smoke-test on device before sign-off.
- **Risk**: Removing `userInterfaceStyle: "dark"` could cause a flash of light theme on slow startup. → Mitigation: gate the navigation theme on the persisted `mode` value loaded from `kv-store`; show splash screen until the value resolves (uses existing `expo-splash-screen` plugin).
- **Risk**: Existing screen styles use hardcoded greens and greys; missing one in the refactor leaves drift. → Mitigation: Task 4.1 explicitly enumerates the hex codes to remove and a final grep should return zero matches.
- **Risk**: `typedRoutes: true` re-generates types on rename; stale `Href<'/player'>` references would fail typecheck. → Mitigation: no current call sites reference `/player`; verify via grep after rename.

## Migration Plan
1. Theme tokens + `ThemeContext` land first (no UI change yet).
2. `AppHeader` + `Card` + custom tab bar wired in `_layout.tsx`; NativeTabs removed.
3. Volume screen refactor.
4. Playback rename + refactor.
5. Settings refactor + `openspec/project.md` constraint update.
6. Manual Android smoke test.
- **Rollback**: revert the change branch; nothing in the proxy contract is altered.

## Open Questions
- Should the theme toggle expose a three-way picker (Light / Dark / System) in a long-press menu? Currently planned as binary; can be revisited if users ask.
- Status caption on Playback could later be driven by a real `Player.GetActiveItem` poll — left for a follow-up change.
