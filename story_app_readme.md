# Storybook Stories

A collection of scroll-driven pixel art interactive stories, each deployable as a standalone web app to HuggingFace Spaces and playable inside an Android app via WebView.

Stories are driven by a shared engine that handles rendering, scroll wiring, and portrait display. Each story is a self-contained Vite/React app — they share the engine's conventions but are independently buildable and deployable.

---

## Repo Structure

```
storybook_stories/
  stories/
    loveletter/         ← first story (working reference implementation)
    _template/          ← copy this to start a new story
  manifest.json         ← Android app fetches this to list all stories
  deploy.sh             ← builds all stories in one pass
  README.md
```

### Inside each story (`stories/loveletter/src/`)

```
engine/
  StoryPlayer.jsx       ← React shell: scroll wiring, canvas, overlays
  renderer.js           ← portrait fill, scene dispatch, camera crop
  utils.js              ← drawSprite, tween, pick, easing, color helpers

story/
  index.js              ← story config: scenes array, title, accent, finaleText
  characters.js         ← pixel sprite definitions for all characters
  backgrounds.js        ← procedural background draw functions per scene
  scenes/
    leavingHome.js      ← one file per scene
    ...                 ← each exports render(ctx, p, t, cfg)

config.js               ← localStorage config (message, heartColor, etc.)
ConfigPage.jsx          ← /config route for customizing the story
global.css
App.jsx
main.jsx
```

---

## How to Add a New Story

1. **Copy the template**
   ```bash
   cp -r stories/_template stories/your-story-name
   cd stories/your-story-name && npm install
   ```

2. **Set story identity** — edit `src/story/index.js`
   ```js
   export const storyConfig = {
     id: 'your-story-name',
     title: 'Your Story Title',
     tagline: 'One line shown on the gallery card',
     accent: '#ff6b9d',       // glow / highlight color
     finaleText: 'The End',   // big glowing text at final scene
     scenes: [ ... ],
   }
   ```

3. **Define characters** — edit `src/story/characters.js`
   Write sprite grids as row-string arrays with a palette map. See `loveletter/characters.js` for reference.

4. **Write backgrounds** — edit `src/story/backgrounds.js`
   Each scene gets a draw function `(ctx, p, t, cfg) => { ... }` that paints the environment on the 480×270 logical canvas.

5. **Write scene files** — one file per scene in `src/story/scenes/`
   Each exports a single `render(ctx, p, t, cfg)` function. Scene index in the array determines order.

6. **Preview locally**
   ```bash
   npm run dev
   ```

7. **Build for production**
   ```bash
   npm run build
   # outputs to dist/
   ```

8. **Deploy to HuggingFace**
   - Upload `dist/` contents to `stories/your-story-name/` on your HF Space
   - Upload a `thumbnail.png` (recommended: 400×225px) to `stories/your-story-name/thumbnail.png`

9. **Register the story** — add an entry to `manifest.json` at the repo root:
   ```json
   {
     "id": "your-story-name",
     "title": "Your Story Title",
     "tagline": "One line shown on the gallery card",
     "accent": "#ff6b9d",
     "url": "https://huggingface.co/spaces/your-username/your-story-name",
     "thumbnail": "https://huggingface.co/spaces/your-username/your-story-name/resolve/main/thumbnail.png"
   }
   ```

10. **Upload the updated `manifest.json`** to the HF Space root — the Android app will pick it up on next launch.

---

## Building All Stories at Once

```bash
./deploy.sh
```

Builds every story in `stories/` and skips any folder prefixed with `_` (including `_template`). After the build completes, upload the outputs to HF manually or via the HF CLI:

```bash
huggingface-cli upload your-username/your-space-name dist/ stories/your-story-name/
```

---

## How the Android App Picks Up New Stories

The Android app fetches `manifest.json` on every launch. No app update is required to add a new story — just:

1. Upload the story's built files to HF
2. Add the story entry to `manifest.json`
3. Upload the updated `manifest.json` to HF

The next time the app launches, the new story appears in the gallery.

---

## Engine Quick Reference

| Concept | Detail |
|---|---|
| Logical canvas | 480×270 px — all scene coordinates use this space |
| Ground level | y ≈ 168–176 (sky above, ground below) |
| Sprites | Row-string arrays, 1 char = 1px, rendered via `drawSprite()` |
| Scene scroll | Each scene has a scroll spacer (default 300vh); progress `p` goes 0→1 as user scrolls through it |
| Portrait display | Scene fills phone height; width is center-cropped using `cropCenterX` per scene |
| Desktop display | Letterboxed with configurable `sky` and `ground` bleed colors |

### Sprite format

```js
// characters.js
export const myChar = {
  palette: { R: '#e07060', B: '#3a2a5a', '.': null },
  rows: [
    '..RRR..',
    '.BRRB..',
    '..RRR..',
  ],
  w: 7,
  h: 3,
}
```

### Scene config shape

```js
// story/index.js — one entry per scene
{
  id: 'leavingHome',
  render: leavingHomeRender,   // imported from scenes/leavingHome.js
  scrollHeight: 300,           // vh — controls scroll pacing
  cropCenterX: 240,            // px or (p) => number — portrait camera
  sky: '#0b0b16',              // desktop bleed colors
  ground: '#161a26',
  night: true,                 // scatter stars in sky bleed on desktop
  text: 'Once, in a quiet town…',
  textCue: { a: 0.1, b: 0.35 },  // fade in at p=0.1, fade out at p=0.35
}
```

### Utility functions (engine/utils.js)

| Function | Signature | Purpose |
|---|---|---|
| `drawSprite` | `(ctx, sprite, x, y, scale)` | Render a row-string sprite at logical coords |
| `lerp` | `(a, b, t)` | Linear interpolate |
| `tween` | `(p, a, b, from, to)` | Map progress range `[a,b]` → value `[from,to]` |
| `pick` | `(arr, seed)` | Deterministic pick from array |
| `easeInOut` | `(t)` | Smooth step |
| `hexToRgb` | `(hex)` | Color conversion |

---

## manifest.json Format

```json
{
  "version": 1,
  "stories": [
    {
      "id": "loveletter",
      "title": "Love Letter",
      "tagline": "A quiet walk, a letter, a heartbeat.",
      "accent": "#ff6b9d",
      "url": "https://huggingface.co/spaces/username/loveletter",
      "thumbnail": "https://huggingface.co/spaces/username/loveletter/resolve/main/thumbnail.png"
    }
  ]
}
```
