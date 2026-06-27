## 1. API layer (`src/services/api.ts`)
- [ ] 1.1 Add `FileItem` interface (file, filetype, label, size, mimetype, thumbnail, lastmodified)
- [ ] 1.2 Add `FilesResponse` interface (files: FileItem[])
- [ ] 1.3 Add `searchTVShowFiles(baseUrl, query)` function
- [ ] 1.4 Add `listFilesDirectory(baseUrl, directory)` function
- [ ] 1.5 Add `playerPlayFile(baseUrl, filePath)` function

## 2. Search screen (`src/app/search.tsx`)
- [ ] 2.1 Import `searchTVShowFiles`, `listFilesDirectory`, `playerPlayFile`, `FileItem` from api
- [ ] 2.2 Add `mode` state (`'library' | 'files'`) with segmented control UI
- [ ] 2.3 Add `fileResults`, `fileLoading`, `fileError` states for filesystem search
- [ ] 2.4 Add `currentPath`, `directoryHistory` states for directory browsing
- [ ] 2.5 Add `filesCollapsed` state (collapsible, reset on focus)
- [ ] 2.6 Add `renderFileItem` that shows 📄 for files, 📁 for directories, fires `playerPlayFile()` or navigates into directory
- [ ] 2.7 Add directory browsing: `browseDirectory(path)` loads contents via `listFilesDirectory`, updates history
- [ ] 2.8 Add back button when `currentPath` is set (pops history stack)
- [ ] 2.9 Add client-side search filtering when browsing a directory
- [ ] 2.10 Update `useFocusEffect` to also reset `filesCollapsed` and `currentPath`
- [ ] 2.11 Change input placeholder based on mode (`"Search movies & TV shows…"` / `"Search files on Kodi…"`)
- [ ] 2.12 Add segmented control and file-related styles

## 3. Validation
- [ ] 3.1 Run `npx tsc --noEmit` and fix any type errors
- [ ] 3.2 Run `openspec validate add-filesystem-search --strict`
