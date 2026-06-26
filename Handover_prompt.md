# Kodi Remote Control — Expo Android App

Build a React Native (Expo) Android app that controls Kodi media center through an existing REST proxy on the local network.

## Backend API (proxy)

The proxy translates REST calls into Kodi JSON-RPC 2.0. It runs on a desktop PC on the same network as the Android device.

**Proxy URL format:** `http://<PC_IP>:5149`

- The Android app MUST let the user enter the PC's IP address in a settings screen (port fixed at 5149, can also be editable).
- No authentication on the proxy itself. Kodi Basic auth (`kodi:1233`) is configured server-side in `appsettings.json` and is transparent to the app.

### Kodi Backend (for reference)

| Setting  | Value           |
| -------- | --------------- |
| Host     | `192.168.0.100` |
| Port     | `8080`          |
| Username | `kodi`          |
| Password | `1233`          |

### Endpoints

#### POST /api/volume

Polymorphic JSON body with `type` discriminator.

**GET** current volume:

```json
{ "type": "GET" }
```

Response: raw integer (0-100).

**SET** volume to absolute value (validated 0-100):

```json
{ "type": "SET", "level": 50 }
```

Response: new volume integer.

**UP** volume by delta (validated 1-100):

```json
{ "type": "UP", "level": 10 }
```

Response: new volume integer.

**DOWN** volume by delta (validated 1-100):

```json
{ "type": "DOWN", "level": 10 }
```

Response: new volume integer.

#### POST /api/player

Auto-detects the first active `playerid` via `Player.GetActivePlayers`. Returns 502 if no player is active.

**PLAY** (resume):

```json
{ "type": "PLAY" }
```

Forwards to `Player.PlayPause` with `play: true`.

**PAUSE**:

```json
{ "type": "PAUSE" }
```

Forwards to `Player.PlayPause` with `play: false`.

**STOP**:

```json
{ "type": "STOP" }
```

Forwards to `Player.Stop`.

#### POST /api/system/shutdown

```json
{ "confirm": true }
```

#### POST /api/system/reboot

```json
{ "confirm": true }
```

### Error Responses

All endpoints return standard error shapes:

| Status | Meaning                                    |
| ------ | ------------------------------------------ |
| 400    | Validation error (bad request body)        |
| 502    | Kodi unreachable or Kodi returned an error |

400 validation error shape:

```json
[{ "propertyName": "Level", "message": "Volume must be between 0 and 100." }]
```

502 error shape:

```json
{
  "title": "Kodi Unreachable",
  "detail": "Could not connect. Ensure Kodi is running...",
  "statusCode": 502
}
```

## App Requirements

### Platform

- Android only (Expo managed workflow or bare, your choice)

### Screens

#### 1. Connection Settings (shown on first launch, accessible from menu)

- Text input for proxy IP address
- Text input for proxy port (default `5149`)
- "Test Connection" button → calls `POST /api/volume {"type":"GET"}` and shows success/failure
- "Save & Connect" button
- Store settings persistently (AsyncStorage or similar)

#### 2. Volume Control

- Current volume display (large number, 0-100)
- Slider to set volume (draggable, debounced)
- - / - buttons for incremental adjustment (default step: 5)
- Volume read on screen focus and after each change

#### 3. Player Control

- Three buttons: **Play**, **Pause**, **Stop**
- Disabled state when no player active (catch 502 and show message)
- Loading indicator during request

### UI/UX

- Minimal, functional design
- Dark theme (Kodi-like)
- Large touch targets (easy to use on phone)
- Clean layout, no unnecessary chrome
- Bottom tab navigation or simple stacked navigation

### Technical Notes

- Use `fetch` or Axios for HTTP calls
- All endpoints return JSON — parse and display errors gracefully
- Timeout: 5 seconds per request (Kodi service timeout)
- Handle network errors: show user-friendly "Cannot reach proxy" message
- Proxy address configurable in-app, not hardcoded

## Deliverables

- Complete Expo project source code
- `npm install && npx expo start` should work out of the box
- APK build file ready to transfer via usb to android working via lan
- README with build and usage instructions
