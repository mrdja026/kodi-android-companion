## Context
The app needs media discovery — the ability to search the Kodi library by title, see results, and play specific movies or episodes. The existing proxy (`kodi-minmal-api-wrapper`) already exposes all required endpoints (`SEARCH`, `TV_SEARCH`, `PLAY_MOVIE`, `TV_PLAY_EPISODE`, `TV_SEASONS`, `TV_EPISODES`, `RECENT`, `TV_RECENT`, `SCAN`). The app currently only calls volume and player transport endpoints.

## Goals / Non-Goals
- Goals:
  - Free-text search across movies and TV shows with debounced input
  - Drill-down navigation from search results into TV show seasons/episodes
  - Direct "Play" action on movies and episodes
  - Browse recently added media as a secondary entry point
  - Library scan action from Settings
  - All new screens follow existing UI patterns (Card, useTheme, ThemedText, Pressable)
- Non-Goals:
  - Pagination beyond the proxy's default limit (100 items)
  - Offline/media-not-on-server handling beyond proxy error feedback
  - Favorites, ratings, or watch status
  - Multi-server / server discovery
  - Thumbnail image optimization beyond the raw Kodi URL

## Decisions
- **Decision**: Search fires two parallel requests (`searchMovies` + `searchTVShows`) on every keystroke with 300ms debounce.
  - **Why**: Kodi's `VideoLibrary.GetMovies` and `VideoLibrary.GetTVShows` with `contains` filter are fast enough that sequential requests would add unnecessary latency. 300ms debounce matches standard search UX and prevents flooding the proxy on rapid typing.
  - **Alternatives**: Single endpoint that searches both — rejected because the proxy separates movies and TV shows into different routes.
- **Decision**: Drilldown uses Expo Router dynamic route segments: `/movie/[id]`, `/tvshow/[id]`, `/tvshow/[id]/season/[num]`.
  - **Why**: File-based routing gives clear URL hierarchy, deep linking works, and patterns match Expo Router conventions. The data (movie/TV show metadata) is passed via router params rather than re-fetched where possible.
  - **Alternatives**: Flat state with inline expand/collapse — rejected, would not scale to multiple seasons with many episodes.
- **Decision**: Search + Browse are added as two new tabs in the bottom tab bar (total 5 tabs: Volume, Playback, Search, Browse, Settings).
  - **Why**: Direct access from anywhere in the app without back-navigation. The existing 3-tab layout has room for expansion. If 5 tabs feel crowded, a future change could collapse Browse into a sub-tab of Search.
  - **Alternatives**: Stack modal from playback screen — rejected, buries discovery. Replace Playback tab — rejected, transport controls are a primary use case.
- **Decision**: Thumbnails are displayed using the raw `thumbnail` string from the proxy response. No download/prepare-download call.
  - **Why**: Kodi returns `image://` URLs that the proxy passes through. These work when the Kodi HTTP server is accessible. Adding `Files.PrepareDownload` or `Textures.GetTextures` would add complexity for marginal gain on a local-network app.
  - **Alternatives**: Proxy-side thumbnail proxying — rejected, out of scope for this change (would require proxy modification).
- **Decision**: Scan Library is a button in Settings rather than a separate tab or auto-trigger.
  - **Why**: Infrequent action; Settings already has network-configuration affordances. Avoids cluttering the tab bar with a rarely-used action.
  - **Alternatives**: Dedicated tab — rejected, too much screen real estate for an infrequent action. Pull-to-refresh on Browse tab — considered but deferred to a future change.
- **Decision**: API response types for media items are defined as interfaces in `api.ts` (e.g., `MovieItem`, `TVShowItem`, `SeasonItem`, `EpisodeItem`) rather than using `unknown` casts.
  - **Why**: Type safety on the proxy's JSON response; prevents runtime shape mismatches. The proxy returns consistent field names (`title`, `year`, `movieid`, `tvshowid`, `episodeid`, `season`, `episode`, `file`, `thumbnail`, `genre`, `runtime`, `rating`).
  - **Alternatives**: Generic `Record<string, unknown>` — rejected, defeats type checking across screens.

## Risks / Trade-offs
- **Risk**: `image://` thumbnail URLs from Kodi may not render in React Native `Image` component without a custom image loader. → Mitigation: test with Kodi's HTTP image endpoint; if it fails, use the proxy's file endpoint (`POST /api/files/directory`) to resolve or strip the protocol prefix.
- **Risk**: Parallel search requests (movies + TV shows) on slow networks may cause both to time out within the 5s window. → Mitigation: 300ms debounce already reduces request volume; if timeout is an issue, increase `TIMEOUT_MS` or switch to sequential.
- **Risk**: 5 tabs may be too many for the custom tab bar on narrow screens. → Mitigation: shrink tab labels to single-word, reduce icon size, or use a scrollable tab bar. Re-assess after implementation.
- **Risk**: The proxy returns raw Kodi JSON-RPC response structure wrapped in `{"limits":..., "tvshows":[...]}`. The API layer must unwrap the correct result key. → Mitigation: verify response shape against the proxy's `openapi.json` and the `TVShowEndpoints.cs`/`MovieEndpoints.cs` source.

## Migration Plan
1. API layer types + functions (no UI changes yet)
2. Search screen (independent, can be tested with proxy)
3. Movie detail screen
4. TV show drilldown screens
5. Browse tab
6. Tab bar update — wire new screens
7. Scan Library button in Settings
8. Manual smoke test on Android device against a running Kodi instance
- **Rollback**: revert the change branch; all changes are additive (new screens, new API functions) — no existing behavior is modified.

## Open Questions
- How should the "no results" state look? (Empty state with "No movies or TV shows found for "[query]""?)
- Should tapping an episode in Browse or Search navigate to the TV show season screen or play directly? (Navigate is safer; user can always Play from there.)
- Are `image://` Kodi URLs renderable in React Native `<Image>` without server-side changes?
