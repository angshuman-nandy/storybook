# Handoff: Pixel Story — Android App

## Overview

**Pixel Story** is a native Android app that serves as a gallery for interactive
pixel-art stories (the seed content is love stories, but the platform is
story-agnostic). The aesthetic is a premium **dark, cinematic** experience —
warm amber glows, deep night-sky backgrounds, pixel-art accents — meant to feel
like a handcrafted "gift box" that frames each story.

Stories are **streamed directly from a backend server** and launched in a
full-screen WebView — no local download, no offline storage. The app is a thin,
beautiful frame around live content.

Three surfaces ship in v1:

1. **Splash Screen** — shown while the manifest loads
2. **Gallery Screen** — browsable, swipeable story cards
3. **Story Player** — full-screen WebView pointed at the story's live URL

A single **app icon** (Glowing Lantern, pixel art) ships across launcher,
notifications, and adaptive-icon contexts.

---

## About the Design Files

The files inside `design/` are **design references created in HTML/React** —
prototypes showing intended look and behavior, *not* production code to ship.

**Your task:** recreate these designs in the target codebase's environment.
For Pixel Story this means a native Android app — recommended stack:

- **Kotlin + Jetpack Compose** (Material 3 baseline, themed dark)
- **Coil** for thumbnail image loading
- **OkHttp / Ktor** for manifest fetch
- **WebView** hosted in a `ComposeView` for the Story Player (loads story URL directly)

No download pipeline, no WorkManager, no local storage of story payloads.

---

## Fidelity

**High-fidelity (hi-fi).** The mockups use final colors, typography, pixel-art
artwork, button states, and motion intent from the original brief. Recreate
**pixel-perfectly** — this design is intentionally specific (sharp corners, no
elevation shadows, pixel fonts) and looks wrong when softened.

---

## Final App Icon — Glowing Lantern

The chosen icon (see `design/Pixel Story Design.html` → "✨ Final Icon" section).

### Concept
A pixel-art lantern with a warm amber flame inside, against the deep night
background `#0b0b16`, with a soft radial amber glow behind it. Reads as
"intimate storytelling around firelight" — story-agnostic, premium, handmade.

### Visual spec
- **Background:** solid `#0b0b16` (full bleed; adaptive-icon background layer)
- **Frame (lantern body):** cream `#fdf0d5` pixels
- **Flame core:** amber `#f4a261` with a `#ffb4a2` peach inner tongue and a
  `#fdf0d5` cream-white hot tip
- **Glow:** radial gradient `rgba(244, 162, 97, 0.45) → 0` centered on the
  flame, ~55% radius
- **Pixel grid:** the lantern is built on a 100×170 pixel canvas, scaled up
  cleanly with `image-rendering: pixelated`
- **No anti-aliasing, no rounded corners on internal pixels**

### Required output sizes (deliver as PNG, no compression artifacts)

| Asset | Size | Notes |
|---|---|---|
| `ic_launcher_foreground.png` | 432×432 (108×108dp @ xxxhdpi) | Lantern only, transparent bg, 33% safe zone margin |
| `ic_launcher_background.png` | 432×432 | Solid `#0b0b16` |
| `ic_launcher.png` | 192×192 (legacy) | Composited with adaptive mask |
| Play Store master | 512×512 | Composited final |
| Notification icon | 96×96 | Lantern silhouette only, white tinted by system |

Use **Android Studio Image Asset Studio** to generate density buckets from the
432×432 foreground. The artwork in `design/pixel-story-icon-final.jsx` (function
`LanternArt`) is the source of truth — re-render at the required size with the
`scale` prop and export.

---

## Design Tokens

Drop these into `ui/theme/Color.kt` (or your token system):

```kotlin
object PixelStoryColors {
  val Deep    = Color(0xFF0B0B16) // page background, deepest void
  val Night   = Color(0xFF16213E) // card backgrounds, surfaces
  val Surface = Color(0xFF1E1E2E) // elevated cards, modals
  val Amber   = Color(0xFFF4A261) // primary accent — CTAs, active, glows
  val Coral   = Color(0xFFE76F51) // hearts, highlights, download progress
  val Peach   = Color(0xFFFFB4A2) // secondary text, soft labels
  val Cream   = Color(0xFFFDF0D5) // primary body text, titles
  val Muted   = Color(0x66FDF0D5) // secondary / disabled text (40% cream)
}
```

### Typography (Google Fonts — bundle via `androidx.compose.ui.text.googlefonts`)

| Token | Family | Size | Letter-spacing | Used for |
|---|---|---|---|---|
| `displayPixel` | Press Start 2P | 14–16sp | 0.08em | Screen titles |
| `titlePixel` | Press Start 2P | 12–14sp | 0.04em | Story title on card |
| `buttonPixel` | Press Start 2P | 9–10sp | 0.06em | Button labels (caps feel) |
| `bodyTerminal` | VT323 | 18–20sp | normal | Body, taglines, captions |
| `monoStat` | VT323 | 22sp | normal | Download percentage |

Both fonts are on Google Fonts. Use `GoogleFont.Provider` + Compose's
`Font(googleFont = …)`.

### Shape & Elevation

- **Cards:** `RoundedCornerShape(0.dp)` — sharp corners are mandatory
- **Buttons:** sharp corners, `1.dp` amber border at `30%` opacity (when outlined)
- **No `Modifier.shadow()` anywhere** — use color layering and the gradient
  overlay technique instead
- **Card → next card peek:** 16dp visible on right edge of horizontal pager

### Spacing scale

`4 · 8 · 12 · 16 · 24 · 32 · 48` — stick to multiples of 4dp.

---

## Screens

### 1) Splash Screen

**Purpose:** shown for `manifest.json` fetch + initial story-metadata cache warm.

**Layout:**
- Full-screen `Deep` (`#0b0b16`) background
- Center column, items vertically centered, gap 30dp:
  1. Animated **coral pixel heart** (`#e76f51`) — 8×7 grid scaled 11×
     - Animation: scale 1.0 → 1.2 → 1.0 over 900ms, ease-in-out, infinite
     - Soft `drop-shadow(0 0 16px #e76f51)` glow
  2. App name: `pixel stories` (lowercase)
     - Press Start 2P, 13sp, `Cream`, letter-spacing 0.08em
  3. Three loading dots
     - 6dp squares, `Amber`, 10dp gap
     - Animation: opacity 0.18 → 1 → 0.18 over 1.2s, ease-in-out
     - Each dot delayed by 400ms relative to the previous

> ⚠️ The heart appears on the splash and the player loading state — it is not
> the app icon. The lantern is the icon. The heart is the "loading heartbeat".

**Transitions:**
- Manifest loaded → fade out 400ms → Gallery
- Manifest failed → replace dots with VT323 18sp cream "couldn't connect. tap
  to retry." — any tap retries

---

### 2) Gallery Screen (Home)

**Purpose:** browse, download, and launch stories.

**Layout:**

```
┌─────────────────────────────┐
│  status bar (light icons)   │
├─────────────────────────────┤
│  ┌───────────────────────┐  │
│  │                       │  │
│  │   THUMBNAIL (bleed)   │  │
│  │                       │  │
│  │   ┌──────────────┐    │  │
│  │   │ ● Title      │    │  │  ← bottom of card
│  │   │ tagline      │    │  │
│  │   │ [  ACTION  ] │    │  │
│  │   └──────────────┘    │  │
│  └───────────────────────┘  │
│       ○ ● ○ ○  ← pagination │
└─────────────────────────────┘
```

**Card:**
- Width: `screen width - 32dp` (16dp horizontal margins)
- Height: ~83% of available content area
- Background: `Coil` async-loaded thumbnail, `crossfade(true)`
- Overlay gradient: `transparent` → `rgba(11, 11, 22, 0.97)`
  - Stops: 0% transparent, 42% transparent, 82% 0.88α, 100% 0.97α
  - Applied as `Brush.verticalGradient` on top of the image
- **Sharp corners.** No clip-to-rounded.

**"NEW" badge** (top-right, 12dp inset from corner):
- Background `Amber`, text `Deep`
- Press Start 2P, 7sp, letter-spacing 0.06em, padding 4dp/7dp
- Only show if `story.publishedAt > now - 7 days`

**Card text (over gradient, 16dp inset from card edges, bottom-aligned):**
- Accent dot: 4×4dp square in story's accent color (`Coral` for the seed
  story), left of the title
- **Story title:** Press Start 2P, 11sp, `Cream`, lineHeight 1.7, letter-spacing
  0.04em — wraps to 2 lines max
- 6dp gap
- **Tagline:** VT323, 19sp, `Peach`, padding-left 12dp (visually indented
  past the dot)
- 14dp gap before button

**Action button (full card-width minus 0dp side padding inside the inset, 44dp tall):**

A single primary state — the app streams from the server, so there's no
download step to expose in the UI.

| Label | Styles |
|---|---|
| `▶  PLAY` | bg `Amber` solid, text `Deep`, no border, Press Start 2P 9sp, letter-spacing 0.06em |

- Tap: scale 0.96 on press, spring back over 120ms
- Tap commits navigation to the Story Player route immediately — any network
  wait happens **inside the player's loading state**, not on the gallery card.

**Pagination row** (centered, 14dp gap below card):
- 4 dots (or however many stories), 4×4dp squares, 8dp gap
- Active = `Amber`, inactive = `Cream` at 20% opacity (`0x33FDF0D5`)

**Horizontal pager:**
- Snap to card, one card visible
- 16dp peek of next card on right
- During swipe: active card scales 0.96 → 1.0 (depth feel), inactive 1.0 → 0.96

**Skeleton / loading state per card:**
- Card body fills with `Surface` (`#1e1e2e`)
- Shimmer: linear gradient sweeping left → right, highlight `#2a2a3e`, 1.4s loop

---

### 3) Story Player

**Purpose:** host the story's live URL (served by your backend) in a
full-screen WebView. No download, no local files — a direct stream.

**Layout:**
- Status bar: visible, **light** icons (white/cream over `#0b0b16`)
- Navigation bar: **hidden** (immersive sticky mode); swipe-up reveals temporarily
- WebView: fills everything below status bar, edge to edge, no chrome
- WebView config: JS enabled, DOM storage on, cache mode `LOAD_DEFAULT`, mixed
  content `MIXED_CONTENT_NEVER_ALLOW`, user-agent suffixed with
  ` PixelStory/<version>`

**Loading state (until `onPageFinished` fires for the main frame):**
- Solid `Deep` background covers the WebView
- Centered coral pixel heart at scale 16×, same heartbeat animation as splash,
  with `drop-shadow(0 0 24px #e76f51)`
- If the page takes longer than 8s, swap the heart for a small VT323 line:
  "still loading… (tap to retry)"

**Active state:** WebView is the entire surface. No app-drawn UI on top.

**Error state (if WebView fails):**
- Centered column on `Deep`:
  - Big coral `!` in pixel style (build from rects, 8px size)
  - VT323 19sp `Cream`: "story couldn't load"
  - VT323 16sp `Amber`: "tap to retry" — taps reload the WebView source

**Navigation:**
- System back / gesture → dismiss player → return to gallery
- No in-app back button
- Returning to gallery: no state change on the card — it stays as a tappable
  `▶  PLAY`. Each launch is a fresh stream.

---

## Motion Spec

| Motion | Duration | Easing | Notes |
|---|---|---|---|
| Heart heartbeat | 900ms loop | ease-in-out | scale 1.0 ↔ 1.2 |
| Splash dots fade | 1.2s loop | ease-in-out | 400ms stagger between dots |
| Button press | 120ms | spring (low stiffness) | scale 0.96 → 1.0 |
| Card focus on swipe | follow gesture | — | scale 0.96 ↔ 1.0 |
| Gallery → Player | 300ms | ease-out | shared-element thumbnail expand, else fade |
| Player → Gallery | 300ms | ease-in | slide-down dismiss (bottom-sheet style) |
| Splash → Gallery fade | 400ms | ease-in-out | crossfade |

**Hard limit:** no animation < 120ms or > 400ms (except the 1.2s breathing
loops, which are passive, not transitional).

---

## State Management

### Repository layer
```kotlin
data class Story(
  val id: String,
  val title: String,
  val tagline: String,
  val thumbnailUrl: String,   // streamed via Coil
  val storyUrl: String,       // live URL passed to the WebView
  val accentColor: Color,
  val publishedAt: Instant,
)

data class GalleryUiState(
  val isLoading: Boolean,
  val manifestError: Throwable? = null,
  val stories: List<Story> = emptyList(),
  val currentIndex: Int = 0,
)

sealed class PlayerUiState {
  data object Loading : PlayerUiState()
  data object Ready : PlayerUiState()           // onPageFinished fired
  data class Failed(val cause: Throwable) : PlayerUiState()
}
```

### Transitions
- App start → `SplashViewModel.loadManifest()` → on success emit
  `GalleryUiState` and navigate
- Tap PLAY on a card → push `StoryPlayerRoute(story.storyUrl)` immediately;
  the player's `Loading` state covers any network wait
- WebView `onPageFinished` (main frame) → `PlayerUiState.Ready` → fade the
  loading overlay
- WebView error / timeout → `PlayerUiState.Failed` → show error state with
  tap-to-retry
- Back gesture → pop player route, WebView is destroyed (fresh stream next time)

### Persistence
- Cache the manifest JSON in memory with a 5-minute TTL so quick back-and-forth
  doesn't re-fetch
- **No** persisted story state — nothing to track without downloads
- No DataStore required for v1

---

## Assets

All assets used in the design are **generated procedurally** in the JSX —
nothing depends on third-party images:

- **Pixel heart** — 8×7 grid drawn in `pixel-story-screens.jsx` (`PixelHeart`)
- **Glowing lantern** — drawn in `pixel-story-icon-final.jsx` (`LanternArt`)
- **Night-sky thumbnail art** — drawn in `pixel-story-screens.jsx`
  (`NightSkyArt`)

The night-sky illustration is a placeholder for the **first story's
thumbnail**. In production, each story carries its own thumbnail via
`Story.thumbnailUrl`. Build a SVG/PNG of `NightSkyArt` at 1080×1920 to ship as
the seed-story thumbnail asset.

**Fonts:** Press Start 2P + VT323 (both free, Google Fonts, Open Font License).

---

## Files in this bundle

| Path | Purpose |
|---|---|
| `README.md` | This file |
| `original_brief.md` | The user's original design brief |
| `design/Pixel Story Design.html` | The full design canvas — open in a browser |
| `design/design-canvas.jsx` | Canvas chrome (pan/zoom, sections, artboards) |
| `design/android-frame.jsx` | Android device frame |
| `design/pixel-story-screens.jsx` | Splash + Gallery + Player React components |
| `design/pixel-story-icon-final.jsx` | **Final lantern icon** at multiple sizes |
| `design/pixel-story-icons.jsx` | Discarded round-1 icon explorations (reference only) |
| `design/pixel-story-icons-v2.jsx` | Discarded round-2 icon explorations (reference only) |

To preview the designs:
```bash
cd design/
python3 -m http.server 8080
# open http://localhost:8080/Pixel Story Design.html
```

---

## What NOT to do

These are non-negotiable from the brief:

- ❌ No white backgrounds, no light-mode option
- ❌ No rounded corners on cards or buttons (sharp corners only)
- ❌ No Material elevation / drop shadows on UI surfaces (the lantern glow is fine — that's artwork)
- ❌ No generic sans-serif fonts (Roboto, Inter, etc.) — Press Start 2P + VT323 only
- ❌ No animations faster than 120ms or slower than 400ms (excl. ambient loops)
- ❌ No more than 2 accent colors visible at once on any screen
- ❌ Don't replace the lantern with any other icon — it's final

---

## Open questions for the dev

These are *not* specified in the design and the dev should confirm with the
product owner before implementing:

1. **Manifest schema:** what does `manifest.json` look like? Define the contract.
   At minimum each entry needs: `id`, `title`, `tagline`, `thumbnailUrl`,
   `storyUrl`, `accentColor`, `publishedAt`.
2. **Story URL format:** is `storyUrl` a stable permalink, or signed/expiring?
   If signed, when does the app fetch a fresh URL — at manifest time, or on tap?
3. **Offline behavior:** without downloads, what does the app do with no
   connectivity? Currently spec'd: splash shows retry, gallery uses cached
   manifest if available, player shows error.
4. **Min SDK / target SDK:** suggest minSdk 26 (8.0), targetSdk 34 (14).
5. **Analytics:** none specified — add later if needed.
