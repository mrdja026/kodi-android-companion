## 1. OpenSpec
- [ ] 1.1 Run `openspec validate add-now-playing-screen --strict`

## 2. Playback screen (`src/app/playback.tsx`)
- [ ] 2.1 Import `useVolume` from `@/hooks/use-volume`
- [ ] 2.2 Import `Pressable`, `ActivityIndicator` from `react-native` (for volume step buttons, if not already imported)
- [ ] 2.3 Add `const volumeCtrl = useVolume()` inside the component
- [ ] 2.4 Add `useFocusEffect` call to `volumeCtrl.refresh()` so volume loads on focus (merged with existing error-reset effect)
- [ ] 2.5 Change title from `"Playback Controls"` to `"Now Playing"`
- [ ] 2.6 Add volume slider JSX below the status text (inside Card): slider track, fill, thumb using the Responder system (copied from `index.tsx`)
- [ ] 2.7 Add volume number display below the slider
- [ ] 2.8 Add step buttons (− / +) row below the volume number
- [ ] 2.9 Add error display for volume errors (reuse existing error banner or add a second one)

## 3. Movie detail (`src/app/movie/[id].tsx`)
- [ ] 3.1 After successful `playMovie()` in `handlePlay`, call `router.replace('/playback')`

## 4. Season episodes (`src/app/tvshow/[id]/season/[num].tsx`)
- [ ] 4.1 Import `useRouter` from `expo-router`
- [ ] 4.2 After successful `playEpisode()` in `handlePlay`, call `router.replace('/playback')`

## 5. Tab bar (`src/components/app-tabs.tsx`)
- [ ] 5.1 Remove `'index'` from `TabKey` type
- [ ] 5.2 Remove `index` entry from `TAB_META`
- [ ] 5.3 Remove `'index'` case from `TabIcon` and remove `SpeakerIcon` import
- [ ] 5.4 Remove `<Tabs.Screen name="index">` from `AppTabs` component
- [ ] 5.5 Add `initialRouteName="playback"` to `<Tabs>` props

## 6. Volume screen redirect (`src/app/index.tsx`)
- [ ] 6.1 Replace the entire file content with a redirect screen that calls `router.replace('/playback')` on mount
- [ ] 6.2 Clean up unused imports

## 7. Validation
- [ ] 7.1 Run `npx tsc --noEmit` and fix any type errors
