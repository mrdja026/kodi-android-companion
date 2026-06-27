## 1. API layer
- [ ] 1.1 Add `MediaAction` discriminated union type with SEARCH, TV_SEARCH, TV_LIST, TV_SEASONS, TV_EPISODES, TV_RECENT, TV_PLAY_EPISODE, LIST, RECENT, PLAY_MOVIE, SCAN variants matching the proxy `CommandValue` types
- [ ] 1.2 Add `searchMovies(baseUrl, query)` calling `POST /api/movies` with `{type:"SEARCH", query}`
- [ ] 1.3 Add `searchTVShows(baseUrl, query)` calling `POST /api/tvshows` with `{type:"TV_SEARCH", query}`
- [ ] 1.4 Add `listMovies(baseUrl, start?, end?)` calling `POST /api/movies` with `{type:"LIST"}`
- [ ] 1.5 Add `recentMovies(baseUrl, limit?)` calling `POST /api/movies` with `{type:"RECENT"}`
- [ ] 1.6 Add `listTVShows(baseUrl, start?, end?)` calling `POST /api/tvshows` with `{type:"TV_LIST"}`
- [ ] 1.7 Add `recentEpisodes(baseUrl, limit?)` calling `POST /api/tvshows` with `{type:"TV_RECENT"}`
- [ ] 1.8 Add `getSeasons(baseUrl, tvshowId)` calling `POST /api/tvshows` with `{type:"TV_SEASONS", tvshowId}`
- [ ] 1.9 Add `getEpisodes(baseUrl, tvshowId, season?)` calling `POST /api/tvshows` with `{type:"TV_EPISODES", tvshowId, season}`
- [ ] 1.10 Add `playMovie(baseUrl, movieId)` calling `POST /api/movies` with `{type:"PLAY_MOVIE", movieId}`
- [ ] 1.11 Add `playEpisode(baseUrl, episodeId)` calling `POST /api/tvshows` with `{type:"TV_PLAY_EPISODE", episodeId}`
- [ ] 1.12 Add `scanLibrary(baseUrl, directory?)` calling `POST /api/movies` with `{type:"SCAN"}`

## 2. Search screen
- [ ] 2.1 Create `src/app/search.tsx` — search bar (TextInput) + results area
- [ ] 2.2 On text change (debounced ~300ms), call both `searchMovies` and `searchTVShows` in parallel
- [ ] 2.3 Render results in two sections: "Movies" and "TV Shows", each as a FlatList of tappable cards showing title, year, thumbnail
- [ ] 2.4 Tapping a movie result navigates to `/movie/[id]` with movie data
- [ ] 2.5 Tapping a TV show result navigates to `/tvshow/[id]` with TV show data

## 3. Movie detail screen
- [ ] 3.1 Create `src/app/movie/[id].tsx` — dynamic route receiving movie metadata via router params
- [ ] 3.2 Display movie details (title, year, genre, thumbnail) in a Card layout
- [ ] 3.3 Render a "Play" Pressable that calls `playMovie(baseUrl, movieId)` and shows result/error feedback

## 4. TV show drilldown
- [ ] 4.1 Create `src/app/tvshow/[id].tsx` — receives TV show data, calls `getSeasons(baseUrl, tvshowId)`, renders season list with thumbnails
- [ ] 4.2 Tapping a season navigates to `/tvshow/[id]/season/[num]`
- [ ] 4.3 Create `src/app/tvshow/[id]/season/[num].tsx` — calls `getEpisodes(baseUrl, tvshowId, season)`, renders episode list with title, episode number, runtime, thumbnail
- [ ] 4.4 Each episode row has a "Play" Pressable that calls `playEpisode(baseUrl, episodeId)` and shows result/error feedback

## 5. Browse tab (recently added)
- [ ] 5.1 Create `src/app/browse.tsx` — calls `recentMovies` and `recentEpisodes` on focus
- [ ] 5.2 Render two sections: "Recently Added Movies" and "Recently Added Episodes"
- [ ] 5.3 Tapping a movie navigates to `/movie/[id]`; tapping an episode navigates to its TV show season context

## 6. Tab bar & navigation integration
- [ ] 6.1 Add SearchIcon, MovieIcon, TVIcon to `src/components/icons.tsx`
- [ ] 6.2 Update `src/components/app-tabs.tsx` — add two new tabs: "Search" and "Browse" (reorder or expand to 5 tabs)
- [ ] 6.3 Update `src/app/_layout.tsx` — register new route segments if needed for stack navigation within tabs

## 7. Library scan in Settings
- [ ] 7.1 Add a "Scan Library" Pressable to `src/app/settings.tsx` below the existing controls
- [ ] 7.2 Show loading spinner + success/error feedback after calling `scanLibrary`

## 8. Cleanup & docs
- [ ] 8.1 Update `openspec/project.md` — add media-library conventions (search debounce, parallel API calls, drilldown navigation)
- [ ] 8.2 Run `openspec validate add-media-library --strict` and resolve any issues
