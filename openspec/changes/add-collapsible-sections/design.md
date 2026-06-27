## Context
Search screen (`src/app/search.tsx`) and Browse screen (`src/app/browse.tsx`) both render two flat sections (Movies + TV Shows) inside `<FlatList scrollEnabled={false}>` without a parent `ScrollView`. Results overflow the viewport with no scroll affordance, and neither section can be collapsed.

## Goals / Non-Goals
- Goals:
  - Overflow content is scrollable on both screens
  - Each section (Movies/TV Shows) can be independently collapsed/expanded by tapping the header
  - Instant toggle — no animation, no new dependency
  - Sections default to collapsed and reset on screen focus
  - Only files changed: `src/app/search.tsx`, `src/app/browse.tsx`
- Non-Goals:
  - No connectivity or API changes
  - No shared component extracted (two screens don't justify it yet)
  - No animation or gesture support for collapse

## Decisions
- Decision: Use local `useState<boolean>` per section, reset via `useFocusEffect`.
  - Why: Two independent boolean states per screen is the simplest approach. `useFocusEffect` is already imported in both files and is the idiomatic expo-router pattern for focus-based resets.
  - Alternatives: Shared context — overkill; ref-based state — less idiomatic for reactive UI.
- Decision: Unicode chevron indicator (`▶` / `▼`) in section header.
  - Why: Universally understood affordance, zero icon-font or asset dependency, consistent with platform patterns.
- Decision: Replace inner `<View style={styles.content}>` with `<ScrollView>` (keeping `contentContainerStyle`).
  - Why: Content is static (not virtualized), well under 200 items per section, so `ScrollView` is simpler and correct here. FlatLists with `scrollEnabled={false}` are just for rendering convenience and can remain as-is inside the ScrollView.

## Risks / Trade-offs
- Nested `ScrollView` + `FlatList` with `scrollEnabled={false}` is safe: the FlatList does not intercept scroll events, so the parent ScrollView owns the gesture.
- `useFocusEffect` cleanups must clear the timer ref (already handled) and should not cause extra re-renders.

## Open Questions
- None.
