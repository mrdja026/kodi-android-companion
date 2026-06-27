# Change: Add Now Playing screen with integrated volume controls

## Why
After pressing Play on a movie or episode detail screen, the user stays on the detail page with no automatic navigation to playback controls. Volume adjustment requires switching to a separate tab. This splits a single "now playing" workflow across two screens.

## What Changes
- **Playback screen** (`playback.tsx`): rename title to "Now Playing"; integrate the volume slider, number display, and step buttons below the existing Play/Pause/Stop controls, all inside a single Card
- **Movie detail** (`movie/[id].tsx`): after successful `playMovie()`, navigate to the Playback tab
- **Season episodes** (`[num].tsx`): after successful `playEpisode()`, navigate to the Playback tab
- **Tab bar** (`app-tabs.tsx`): remove the Volume tab (`index`) from tab definitions; set `initialRouteName="playback"`
- **Volume screen** (`index.tsx`): repurpose as a redirect to `/playback` (preserves the Expo Router index route)

## Impact
- Affected specs: `player-control`, `volume-control`
- Affected code: `src/app/playback.tsx`, `src/app/movie/[id].tsx`, `src/app/tvshow/[id]/season/[num].tsx`, `src/components/app-tabs.tsx`, `src/app/index.tsx`
