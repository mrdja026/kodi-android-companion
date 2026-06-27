# Project Context

## Purpose
Kodi Remote Control — An Android app (Expo SDK 54) that controls Kodi media center through a local REST proxy.

## Tech Stack
- TypeScript, React 19, React Native 0.81
- Expo SDK 54 with Expo Router v6 (file-based routing)
- Custom JS bottom tab bar (expo-router `Tabs` + `tabBar` render prop)
- react-native-gesture-handler + react-native-reanimated (custom gesture slider)
- expo-sqlite/kv-store for persistent settings (proxy config, theme mode)
- View-composed icons (zero icon-font dependency)

## Project Conventions

### Code Style
- No comments in source code unless absolutely necessary
- Use functional components with hooks
- Shared components in src/components/, screens in src/app/
- Theme via useTheme() hook and Colors constants

### Architecture Patterns
- React Context for cross-cutting settings (proxy URL)
- Custom hooks for screen-specific state (use-volume, use-api)
- Typed fetch wrapper in src/services/api.ts
- All API calls go through the typed wrapper with 5s timeout

### Testing Strategy
- Manual testing via development APK

### Git Workflow
- Standard main branch development

## Domain Context
- Proxy runs on desktop PC at http://<IP>:5149
- Proxy translates REST to Kodi JSON-RPC 2.0
- No auth on proxy; Kodi basic auth (kodi:1233) is server-side
- All endpoints POST with JSON body and type discriminator

## Important Constraints
- Android only
- Theme is user-controlled (light | dark | system); default `system`, persisted via `expo-sqlite/kv-store` under `themeMode`
- 5-second request timeout
- No hardcoded proxy addresses
- No hardcoded hex colours in screen files — use tokens from `Colors` in `src/constants/theme.ts`

## External Dependencies
- Kodi REST proxy (port 5149, local network)
- Kodi (port 8080, kodi:1233 auth - handled by proxy)
