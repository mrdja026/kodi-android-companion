## Context
The app has five tabs (Volume, Playback, Search, Browse, Settings). Starting playback from a movie/episode detail does not navigate to controls. Volume is on a separate tab. The user wants a unified "Now Playing" screen that combines playback controls and volume control, with the Volume tab removed.

## Goals / Non-Goals
- Goals:
  - Auto-navigate to Playback tab after starting playback from any detail screen
  - Merge volume controls (slider, number, ±) into the Playback screen below the Play/Pause/Stop buttons
  - Remove the Volume tab from the tab bar
  - Keep the index route alive (Expo Router requirement) as a silent redirect
  - All controls inside a single Card
- Non-Goals:
  - No new API endpoints or proxy changes
  - No polling for current playback state (status stays optimistic/local)
  - No animation for the volume slider integration

## Decisions
- Decision: Use `router.replace('/playback')` from detail screens after successful play.
  - Why: `replace` avoids stacking a tab navigation on the push history. The user pressed Play, the natural next action is on the Playback tab.
  - Alternatives: `router.navigate` — would keep the detail screen in history, which is unnecessary after playback starts.
- Decision: Keep the local `useVolume()` hook unchanged and reuse its returned values in `playback.tsx`.
  - Why: Zero refactoring risk — the hook is self-contained, already handles optimistic updates and error states. Just import and call it in the Playback screen.
- Decision: Remove `'index'` from the `TabKey` type, `TAB_META`, `TabIcon`, and `<Tabs.Screen>` in `app-tabs.tsx`. Set `<Tabs initialRouteName="playback">`.
  - Why: This cleanly removes the Volume tab from the bottom bar. The `index.tsx` file stays as a file so Expo Router's file-based routing doesn't break.
- Decision: `index.tsx` becomes a redirect screen: on mount, it calls `router.replace('/playback')`.
  - Why: The simplest approach. If anyone lands on `/` (e.g., deep link), they end up at the Playback screen.
- Decision: Status display remains `"Stopped"` on initial focus (no state sharing from the play action).
  - Why: The user chose "Keep current behavior". The Playback screen starts in a neutral state.

## Risks / Trade-offs
- Removing the Volume tab means the `SpeakerIcon` import in `app-tabs.tsx` must also be removed to avoid lint errors.
- The volume slider in `index.tsx` uses the Responder system (not gesture-handler/reanimated). Moving it to `playback.tsx` means duplicating the TouchSlider JSX. Consider extracting a shared VolumeSlider component if complexity grows, but for now a simple copy is fine.
- `router.replace('/playback')` from inside a stack-pushed screen (`movie/[id]`, `[num].tsx`) may behave differently than from a tab screen. Test on device.

## Open Questions
- None.
