## 1. Theme tokens & mode
- [x] 1.1 Extend `src/constants/theme.ts` Colors with `accent` (`#22d3ee`), `accentOn` (`#0b1115`), `accentMuted`, `surface`, `surfaceMuted`, `border`, `danger` for both `light` and `dark` palettes
- [x] 1.2 Add `ThemeContext` at `src/context/ThemeContext.tsx` with `mode: 'light' | 'dark' | 'system'`, `effective: 'light' | 'dark'`, `setMode(mode)`, persisted under `themeMode` via `expo-sqlite/kv-store`
- [x] 1.3 Update `src/hooks/use-theme.ts` to derive palette from `ThemeContext.effective` (falling back to `useColorScheme()` when `mode === 'system'`)
- [x] 1.4 Wrap the app with `ThemeProvider` inside `src/app/_layout.tsx` (above `ThemeProvider` from `@react-navigation/native`); switch the navigation theme to `LightTheme` / `DarkTheme` based on effective mode

## 2. App shell
- [x] 2.1 Update `app.json`: set `expo.name` to `"Kodi Companion"`; change `userInterfaceStyle` from `"dark"` to `"automatic"`
- [x] 2.2 Create `src/components/app-header.tsx` rendering the title "Kodi Companion" (left) and a sun/moon icon button (right) that toggles between light and dark via `ThemeContext.setMode`. Uses safe-area top inset.
- [x] 2.3 Create `src/components/card.tsx` — a themed surface with `borderRadius: 16`, `padding: 24`, `maxWidth: 360`, centered horizontally, on `theme.surface`
- [x] 2.4 Replace `src/components/app-tabs.tsx` with a custom tab bar: switch the layout to `expo-router` `Tabs` and provide a `tabBar` render prop that draws three equal-width cells (Volume / Playback / Settings) with cyan label + icon and `surfaceMuted` block highlight on the active cell. Inactive cells use `textSecondary`.
- [x] 2.5 Mount `<AppHeader />` once at the top of `src/app/_layout.tsx` so it persists across tabs

## 3. Route + screen refactors
- [x] 3.1 Rename `src/app/player.tsx` to `src/app/playback.tsx`; update `app-tabs.tsx` trigger `name` from `player` to `playback`; verify `typedRoutes` regenerates without `/player` references
- [x] 3.2 Refactor `src/app/index.tsx` (Volume): wrap controls in `<Card>`, title "Volume Control" above the card, swap green `#1a6b3c` for `theme.accent`, big cyan number, "Volume Level" caption, `−` button on `theme.surfaceMuted` and `+` button on `theme.accent`; remove the manual safe-area padding now that `AppHeader` is the top chrome
- [x] 3.3 Refactor `src/app/playback.tsx` (Playback): wrap controls in `<Card>`, title "Playback Controls" above the card, render three circular buttons (44–56 px) using a new `src/components/circular-button.tsx` with Play/Pause/Stop SF symbols, render a status caption below ("Stopped" / "Playing" / "Paused") tracked via local optimistic state after a successful API call
- [x] 3.4 Refactor `src/app/settings.tsx`: title "Proxy Settings" above the card, inputs Proxy Host + Port only, primary cyan **Connect** button performs the live test, status pill underneath showing `Not Connected` / `Testing…` / `Connected` (failure reverts to `Not Connected` with detail line), grey **Save & Continue** button persists settings. Remove the old `Test Connection` / `Save & Connect` pair and the inline preview URL.

## 4. Cleanup & docs
- [x] 4.1 Remove hardcoded `#1a6b3c`, `#6b1a1a`, `#2a2a2a`, `#1a1a1a`, `#333`, `#666` colours from all screens — replace with theme tokens
- [x] 4.2 Update `openspec/project.md`: remove "Dark theme forced (userInterfaceStyle: \"dark\")" from "Important Constraints"; add a note that NativeTabs are replaced by a custom JS tab bar
- [ ] 4.3 Smoke test on an Android device: header renders, theme toggle works and persists across restarts, tab navigation works, volume / playback / settings flows still hit the proxy successfully  *(deferred — manual on-device step, run `npm run android` to verify)*

## 5. Validation
- [x] 5.1 Run `openspec validate improve-ui-fidelity --strict` and resolve any issues
