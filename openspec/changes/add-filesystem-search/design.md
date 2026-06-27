## Context
The Kodi proxy wrapper already exposes three relevant endpoints:
- `POST /api/tvshows {"type":"TV_SEARCH_ALL","query":"..."}` — recursive filesystem search under `TVScanDirectory`, returns `{"files": [...]}`
- `POST /api/player {"type":"PLAY","file":"..."}` — plays a file by path via `Player.Open`
- `POST /api/files/directory {"directory":"...", "media":"video"}` — lists directory contents via `Files.GetDirectory`

No backend changes are needed. All work is in the companion app frontend.

## Goals / Non-Goals
- Goals:
  - Add a Files/Library mode toggle to the Search screen
  - Files mode searches the filesystem and displays results in a collapsible section
  - Tapping a file plays it and navigates to Now Playing
  - Tapping a directory browses into it with a back button
  - All existing Library mode behavior is unchanged
- Non-Goals:
  - No backend/proxy changes
  - No changes to the Browse, Now Playing, or Settings screens
  - No file type filtering or sorting

## Decisions
- Decision: Segmented control (two Pressable buttons) at the top of the Search screen.
  - Why: Simple to implement, clear visual affordance, no new dependencies.
  - Alternatives: Radio buttons, dropdown — more complex with no benefit.
- Decision: Directory browsing uses a history stack for back navigation.
  - Why: Supports deep directory traversal without complex state management. Each directory load replaces the results list.
- Decision: When browsing a directory, the search input acts as a client-side filter.
  - Why: Avoids unnecessary API calls. The directory contents are already loaded locally.
- Decision: `playerPlayFile()` is a new dedicated function in `api.ts` rather than modifying the existing `playerPlay()`.
  - Why: Keeps the existing resume/unpause path unchanged and avoids a breaking change.
- Decision: File items use 📄 emoji, directory items use 📁 emoji.
  - Why: Matches the existing 🎬/📺 pattern for media types. No icon dependency.

## Risks / Trade-offs
- `TV_SEARCH_ALL` requires `TVScanDirectory` to be configured in the proxy's `appsettings.json`. If not set, the proxy returns a 502 error. The UI will show this error in the error banner.
- Directory browsing through `/api/files/directory` may return items the user cannot play (e.g., `.nfo` files, artwork). The UI shows everything the API returns; unplayable items will silently fail on tap.
- The client-side filter when browsing directories only works on already-loaded items. It does not re-query the API. This is acceptable for single-directory listings.

## Open Questions
- None.
