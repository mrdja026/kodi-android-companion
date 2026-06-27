## 1. Search screen (`src/app/search.tsx`)
- [ ] 1.1 Import `ScrollView` from `react-native`
- [ ] 1.2 Add `useState(true)` for `moviesCollapsed` and `tvShowsCollapsed`
- [ ] 1.3 Use `useFocusEffect` to reset both states to `true` when screen gains focus
- [ ] 1.4 Replace outer `<View style={styles.content}>` with `<ScrollView contentContainerStyle={styles.content}>`
- [ ] 1.5 Make section titles pressable, add chevron indicator (▶ collapsed / ▼ expanded)
- [ ] 1.6 Conditionally render the FlatList based on collapsed state
- [ ] 1.7 Add `Pressable` import if missing

## 2. Browse screen (`src/app/browse.tsx`)
- [ ] 2.1 Import `ScrollView` from `react-native`
- [ ] 2.2 Add `useState(true)` for `moviesCollapsed` and `tvShowsCollapsed`
- [ ] 2.3 Use `useFocusEffect` to reset both states to `true` when screen gains focus
- [ ] 2.4 Replace outer `<View style={styles.content}>` with `<ScrollView contentContainerStyle={styles.content}>`
- [ ] 2.5 Make section titles pressable, add chevron indicator (▶ collapsed / ▼ expanded)
- [ ] 2.6 Conditionally render the FlatList based on collapsed state
- [ ] 2.7 Remove count badge from section titles: `"Movies (N)"` → `"Movies"`, `"TV Shows (N)"` → `"TV Shows"`
- [ ] 2.8 Add `Pressable` import if missing

## 3. Validation
- [ ] 3.1 Run `openspec validate add-collapsible-sections --strict` and resolve any issues
- [ ] 3.2 TypeScript compile check: `npx tsc --noEmit` (or equivalent)
