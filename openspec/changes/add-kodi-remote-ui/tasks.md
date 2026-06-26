## 1. Foundation
- [x] 1.1 Scaffold directory structure and delete boilerplate files
- [x] 1.2 Update `app.json` for Kodi remote app (name, package, splash theme)
- [x] 1.3 Create `src/context/SettingsContext.tsx` with kv-store persistence
- [x] 1.4 Create `src/services/api.ts` with typed fetch wrapper and 5s timeout
- [x] 1.5 Define TypeScript types for all API request/response shapes

## 2. Settings Screen
- [x] 2.1 Create `src/app/settings.tsx` with IP input, port input (default 5149)
- [x] 2.2 Add "Test Connection" button calling `POST /api/volume {"type":"GET"}`
- [x] 2.3 Show success/failure feedback (inline message, not alert)
- [x] 2.4 Wire persistence: load on mount, save on change

## 3. Volume Control
- [x] 3.1 Create `src/hooks/use-volume.ts` — read volume on focus, debounced set
- [x] 3.2 Create `src/components/VolumeSlider.tsx` — custom gesture slider (replaced with native slider)
- [x] 3.3 Build `src/app/index.tsx` — large volume display, native slider, +/- buttons (step 5)
- [x] 3.4 Handle errors: show "Cannot reach proxy" on network failure
- [x] 3.5 Replaced custom gesture slider with @react-native-community/slider for smoother UX
- [x] 3.6 Redesigned step buttons as rectangular with icons instead of circular pills

## 4. Player Control
- [x] 4.1 Create player action helpers in api.ts (play, pause, stop)
- [x] 4.2 Build `src/app/player.tsx` — Play, Pause, Stop buttons
- [x] 4.3 Disable buttons and show message when 502 (no active player)
- [x] 4.4 Add loading indicator during requests

## 5. Navigation & Polish
- [x] 5.1 Refactor `src/app/_layout.tsx` — 3 NativeTabs (index, player, settings)
- [x] 5.2 Update `src/components/app-tabs.tsx` — Volume, Player, Settings tab triggers
- [x] 5.3 Delete unused assets and components
- [x] 5.4 Set splash screen to dark Kodi theme color
- [ ] 5.5 Build APK: `npx expo run:android --variant release`
