# Change: Add collapsible sections and scrolling to search & browse results

## Why
Search and browse results overflow the screen with no way to scroll, and the fixed two-section layout (Movies / TV Shows) cannot be collapsed, wasting vertical space when only one category is of interest.

## What Changes
- Wrap search and browse result areas in a `ScrollView` so content is scrollable when it overflows
- Make Movies and TV Shows sections collapsible via a pressable section header with chevron indicator
- Sections start collapsed by default; collapsed state resets when the screen regains focus
- Switch browse section titles from `"Movies (N)"` / `"TV Shows (N)"` to bare titles `"Movies"` / `"TV Shows"` for consistency with search

## Impact
- Affected specs: `media-search`, `media-library`
- Affected code: `src/app/search.tsx`, `src/app/browse.tsx`
