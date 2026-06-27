# Change: Add Media Library Browse & Free-Text Search

## Why
The app currently only controls playback of whatever is already playing on Kodi — there is no way to find, browse, or select media to play. Users need a "free search" that finds movies and TV shows by title, then lets them drill into TV show seasons/episodes and play any item directly.

## What Changes
- **Search screen**: new tab with a text input that queries the proxy's `POST /api/movies` (type: SEARCH) and `POST /api/tvshows` (type: TV_SEARCH) endpoints, returning matching movies and TV shows grouped by type
- **Movie detail**: tappable movie result navigates to a detail screen showing metadata + a Play button that calls `POST /api/movies` (type: PLAY_MOVIE)
- **TV show drilldown**: tappable TV show result navigates to a seasons list (calls `POST /api/tvshows` type: TV_SEASONS). Tapping a season navigates to an episodes list (calls `POST /api/tvshows` type: TV_EPISODES). Each episode has a Play button calling `POST /api/tvshows` (type: TV_PLAY_EPISODE)
- **Library browsing** (supplementary): a Browse tab showing recently added movies (`POST /api/movies` type: RECENT) and recently added episodes (`POST /api/tvshows` type: TV_RECENT) as another entry point
- **Library scan**: add a "Scan Library" button in the Settings screen or a dedicated action that calls `POST /api/movies` (type: SCAN)
- **API layer**: extend `src/services/api.ts` with typed functions for search, list, seasons, episodes, play-movie, play-episode, scan

## Impact
- Affected specs: `media-search`, `media-library` (both new capabilities)
- Affected code:
  - `src/services/api.ts` — new types + functions for all media endpoints
  - `src/app/search.tsx` — new search tab screen
  - `src/app/movie/[id].tsx` — new movie detail dynamic route
  - `src/app/tvshow/[id].tsx` — new TV show seasons screen
  - `src/app/tvshow/[id]/season/[num].tsx` — new season episodes screen
  - `src/app/browse.tsx` — new browse tab screen (recently added)
  - `src/app/settings.tsx` — add Scan Library button
  - `src/components/app-tabs.tsx` — add Search + Browse tabs (reorder to 5 tabs or nest)
  - `src/components/icons.tsx` — new SearchIcon, MovieIcon, TVIcon
  - `openspec/project.md` — add media-library constraints
