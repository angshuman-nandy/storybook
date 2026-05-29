# Pixel Stories

Scroll-driven pixel art interactive stories, playable in a browser and inside a native Android gallery app.

Each story is a standalone **React + Vite** web app that renders pixel art animations driven by the user's scroll position. Stories are hosted on HuggingFace Spaces and streamed into the Android app via WebView — no downloads, no app updates needed to ship new content.

---

## Repo Structure

```
storybook/
  android/               ← Expo React Native gallery app
  stories/
    loveletter/          ← first story (reference implementation)
    _template/           ← copy this to start a new story
  manifest.json          ← fetched by the Android app on every launch
  deploy.sh              ← builds all stories in one pass
```

---

## Stories (Web)

Stories live in `stories/`. Each is an independent Vite/React app that shares a common engine convention but is built and deployed separately.

### Inside a story (`stories/<name>/src/`)

```
engine/
  StoryPlayer.jsx    ← React shell: scroll wiring, canvas, overlays
  renderer.js        ← portrait fill, scene dispatch, camera crop
  utils.js           ← drawSprite, tween, pick, easing, color helpers

story/
  index.js           ← scenes array, title, accent, finaleText
  characters.js      ← pixel sprite definitions
  backgrounds.js     ← procedural background draw functions
  scenes/
    leavingHome.js   ← one file per scene; exports render(ctx, p, t, cfg)

config.js            ← localStorage config (message, heartColor, …)
ConfigPage.jsx       ← /config route for reader customisation
App.jsx
```

### Engine quick reference

| Concept | Detail |
|---|---|
| Logical canvas | 480 × 270 px — all scene coordinates use this space |
| Ground level | y ≈ 168–176 |
| Sprites | Row-string arrays, 1 char = 1 px, rendered via `drawSprite()` |
| Scene scroll | Default 300 vh per scene; progress `p` runs 0 → 1 as user scrolls through |
| Portrait display | Fills phone height; width is center-cropped via `cropCenterX` per scene |
| Desktop display | Letterboxed with configurable `sky` / `ground` bleed colors |

#### Sprite format

```js
export const myChar = {
  palette: { R: '#e07060', B: '#3a2a5a', '.': null },
  rows: ['..RRR..', '.BRRB..', '..RRR..'],
  w: 7, h: 3,
}
```

#### Scene config shape

```js
{
  id: 'leavingHome',
  render: leavingHomeRender,
  scrollHeight: 300,             // vh
  cropCenterX: 240,              // px or (p) => number
  sky: '#0b0b16',
  ground: '#161a26',
  night: true,
  text: 'Once, in a quiet town…',
  textCue: { a: 0.1, b: 0.35 }, // fade in/out at these progress values
}
```

#### Utility functions (`engine/utils.js`)

| Function | Signature | Purpose |
|---|---|---|
| `drawSprite` | `(ctx, sprite, x, y, scale)` | Render a row-string sprite |
| `lerp` | `(a, b, t)` | Linear interpolate |
| `tween` | `(p, a, b, from, to)` | Map progress range → value range |
| `pick` | `(arr, seed)` | Deterministic pick from array |
| `easeInOut` | `(t)` | Smooth step |
| `hexToRgb` | `(hex)` | Color conversion |

---

### Adding a new story

1. **Copy the template**
   ```bash
   cp -r stories/_template stories/your-story-name
   cd stories/your-story-name && npm install
   ```

2. **Set identity** — edit `src/story/index.js`
   ```js
   export const storyConfig = {
     id: 'your-story-name',
     title: 'Your Story Title',
     tagline: 'One line shown on the gallery card',
     accent: '#ff6b9d',
     finaleText: 'The End',
     scenes: [ … ],
   }
   ```

3. **Define characters** — `src/story/characters.js` (see `loveletter` for reference)

4. **Write backgrounds** — `src/story/backgrounds.js`, one `(ctx, p, t, cfg) => {}` per scene

5. **Write scenes** — one file per scene in `src/story/scenes/`, each exporting `render(ctx, p, t, cfg)`

6. **Run locally**
   ```bash
   npm run dev
   ```

7. **Build**
   ```bash
   npm run build   # outputs to dist/
   ```

8. **Deploy to HuggingFace** — upload `dist/` to `stories/your-story-name/` on your HF Space, plus a `thumbnail.png` (recommended 400 × 225 px)

9. **Register** — add an entry to `manifest.json` at the repo root:
   ```json
   {
     "id": "your-story-name",
     "title": "Your Story Title",
     "tagline": "One line shown on the gallery card",
     "accent": "#ff6b9d",
     "url": "https://huggingface.co/spaces/username/your-story-name",
     "thumbnail": "https://huggingface.co/spaces/username/your-story-name/resolve/main/thumbnail.png",
     "added": "2025-05-29"
   }
   ```

10. **Upload `manifest.json`** to the HF Space root — the Android app picks it up on next launch.

### Building all stories at once

```bash
./deploy.sh
```

Builds every story in `stories/`, skipping folders prefixed with `_`. Then upload via the HF CLI:

```bash
huggingface-cli upload username/space-name dist/ stories/your-story-name/
```

---

## Android App

The `android/` directory is an **Expo React Native** app (TypeScript). It serves as a cinematic gallery: on launch it fetches `manifest.json`, shows a swipeable card gallery, and plays the selected story in a full-screen WebView.

### Stack

| Concern | Choice |
|---|---|
| Framework | Expo (React Native) |
| Language | TypeScript |
| Story rendering | WebView (streams from HF, caches via HTTP) |
| Distribution | EAS Build (APK / Play Store) |

### Screens

| Screen | Description |
|---|---|
| Splash | Animated pixel heart while manifest loads; tap-to-retry on failure |
| Gallery | Horizontal swipe, one cinematic card at a time; `▶ PLAY` opens the story |
| Story Player | Full-screen WebView, immersive nav bar, back gesture returns to gallery |

### Prerequisites

```bash
cd android
npm install
```

Requires the [Expo Go](https://expo.dev/go) app or an EAS build for device testing.

### Run locally

```bash
cd android
npx expo start
```

### Build APK (EAS)

```bash
cd android
eas build --platform android --profile preview
```

### manifest.json format

```json
{
  "version": 1,
  "stories": [
    {
      "id": "loveletter",
      "title": "I Love You",
      "tagline": "He drove across town, just for her.",
      "accent": "#f4a261",
      "url": "https://huggingface.co/spaces/username/space/resolve/main/stories/loveletter/index.html",
      "thumbnail": "https://huggingface.co/spaces/username/space/resolve/main/stories/loveletter/thumbnail.png",
      "added": "2025-05-29"
    }
  ]
}
```

The app caches the last-known manifest in local storage, so it works offline after the first launch.

---

## Design

Dark, cinematic aesthetic — deep night-sky backgrounds, warm amber glows, pixel-art accents. Typography uses **Press Start 2P** (titles/buttons) and **VT323** (body/taglines).

| Token | Value | Use |
|---|---|---|
| `--deep` | `#0b0b16` | Page background |
| `--night` | `#16213e` | Card backgrounds |
| `--amber` | `#f4a261` | CTAs, active states, glows |
| `--coral` | `#e76f51` | Hearts, highlights |
| `--cream` | `#fdf0d5` | Primary text |

---

## License

MIT
