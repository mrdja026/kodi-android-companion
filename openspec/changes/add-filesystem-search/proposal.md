# Change: Add filesystem file search mode to Search screen

## Why
The app can search Kodi's video library (movies and TV shows by title) but cannot search the filesystem for files by filename. A `TV_SEARCH_ALL` endpoint exists in the proxy that recursively searches the TV scan directory for matching files, and the `PLAY` endpoint already supports playing a file by path. The Search screen needs a "Files" mode to surface this capability.

## What Changes
- Add a segmented control (Library / Files) to the Search screen
- In Files mode, the search input calls `POST /api/tvshows {"type":"TV_SEARCH_ALL","query":"..."}` to find filesystem entries whose label matches the query
- Results are shown in a collapsible "Files" section with per-item icons
- Tapping a file result plays it via `POST /api/player {"type":"PLAY","file":"..."}` and redirects to the Now Playing screen
- Tapping a directory result calls `POST /api/files/directory` to browse its contents with back navigation
- New types and API functions in `src/services/api.ts`

## Impact
- Affected specs: `media-search`
- Affected code: `src/app/search.tsx`, `src/services/api.ts`
