# Pixel Stories — Android App Project Brief

## What This Is

A native Android app that serves as a gallery for interactive pixel art love stories.
The user opens the app, sees available stories fetched from a Hugging Face CDN,
taps one, and watches it unfold as a full-screen scroll-driven animation inside a WebView.
New stories can be deployed by the author without any app update.

---

## Design Handoff

**⚠️ A visual design handoff from Claude Design is incoming.**
Before implementing any UI, wait for that handoff. It will specify exact colors, typography,
card layouts, button states, animation specs, and component shapes for all three screens.
Treat the handoff as the source of truth for everything visual. The tokens and descriptions
below are architecture-level context — the handoff overrides all visual specifics.

The three screens being designed:
1. **Splash screen** — app open / manifest loading
2. **Gallery screen** — swipeable cinematic story cards
3. **Story player** — full-screen WebView wrapper

---

## Architecture Decisions (already finalised)

### Story Rendering — WebView streaming
Stories are web apps (HTML + JS, built with Vite + React) hosted on Hugging Face Spaces.
The Android app loads each story as a URL inside a full-screen WebView.

**Why not download to device:**
- Vite outputs hashed filenames → WebView caches them forever after first load
- Effectively offline after one open, with zero download UI complexity
- Stories auto-update when author pushes to HF (no re-download needed)
- Simpler Android code — no zip extraction, no storage management

### Gallery Data — JSON manifest on HF
The app fetches a single `manifest.json` from the CDN on launch.
If the fetch fails, it falls back to the last-cached manifest (stored in SharedPreferences).

### Distribution — Public (Play Store eventually)
Build for public release. Architecture should not assume a single user.

---

## Tech Stack

| Concern | Choice |
|---|---|
| Language | Kotlin |
| UI | Jetpack Compose |
| HTTP | Retrofit + OkHttp |
| Image loading | Coil (async, crossfade) |
| Story rendering | Android WebView |
| State | Kotlin Coroutines + StateFlow |
| Manifest caching | SharedPreferences (raw JSON string) |
| Min SDK | API 26 (Android 8.0) |

---

## CDN Structure (Hugging Face Spaces — static)

```
/                              ← HF Space root
  manifest.json
  stories/
    loveletter/
      index.html               ← Vite build entry
      assets/
        index-[hash].js
        index-[hash].css
      thumbnail.png            ← static preview image (≈400×600px)
    story-two/
      ...
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
      "thumbnail": "https://huggingface.co/spaces/<user>/<space>/resolve/main/stories/loveletter/thumbnail.png",
      "url": "https://huggingface.co/spaces/<user>/<space>/resolve/main/stories/loveletter/index.html",
      "accent": "#f4a261",
      "added": "2025-05-29"
    }
  ]
}
```

**Deploying a new story:**
1. Build the story web app (`npm run build`)
2. Upload `dist/` contents to `stories/<id>/` on the HF Space
3. Add entry to `manifest.json`
4. App picks it up on next launch

---

## Screens

### 1. Splash Screen
- Shown while app boots and fetches manifest
- Animated pixel heart, app name, subtle loading indicator
- On fetch failure: tap-to-retry message
- Transitions to Gallery once manifest loads

### 2. Gallery Screen (Home)
- Horizontal swipe, one story card visible at a time (peek next card)
- Each card: thumbnail as full-bleed background, gradient overlay, title, tagline, accent dot, action button
- **Action button has one state only: `▶ PLAY`** (no download — streaming approach)
- Page indicator dots below cards
- On tap Play → opens Story Player

### 3. Story Player
- Status bar visible (dark icons)
- Navigation bar hidden (immersive, swipe-up to reveal transiently)
- WebView fills screen below status bar
- Beating heart loading state until `onPageFinished`
- Back press / gesture → return to Gallery
- Error state: retry button if WebView fails

---

## Key Android Implementation Details

### Permissions
```xml
<uses-permission android:name="android.permission.INTERNET" />
```
No storage permission needed.

### WebView configuration
```kotlin
webView.settings.apply {
    javaScriptEnabled = true
    domStorageEnabled = true        // GSAP ScrollTrigger needs this
    cacheMode = WebSettings.LOAD_DEFAULT   // use HTTP cache normally
    mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
}
// Enable hardware acceleration (pixel art canvas needs it)
webView.setLayerType(View.LAYER_TYPE_HARDWARE, null)
```

### Immersive navigation bar
```kotlin
WindowCompat.setDecorFitsSystemWindows(window, false)
WindowInsetsControllerCompat(window, window.decorView).apply {
    hide(WindowInsetsCompat.Type.navigationBars())
    systemBarsBehavior =
        WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
}
```

### Manifest caching fallback
```kotlin
// On success:
prefs.edit().putString("manifest_cache", rawJson).apply()

// On failure:
val fallback = prefs.getString("manifest_cache", null)
```

### WebView cache strategy
Stories load from HF URLs. The WebView's disk cache handles everything.
No explicit cache management needed. If you want to ensure offline reliability,
set a custom cache size in `Application.onCreate()`:
```kotlin
WebStorage.getInstance().setQuota("https://huggingface.co", Long.MAX_VALUE)
```

---

## Project Structure

```
app/
  src/main/
    AndroidManifest.xml
    java/com/<pkg>/
      MainActivity.kt           — single Activity, NavHost
      ui/
        SplashScreen.kt
        HomeScreen.kt           — gallery composable
        StoryCard.kt            — individual card composable
        StoryPlayerActivity.kt  — WebView activity
      data/
        ManifestRepository.kt   — fetch + SharedPrefs cache
      model/
        Story.kt                — data class
        Manifest.kt
      theme/
        Theme.kt                — dark theme, color tokens
        Type.kt                 — Press Start 2P + VT323
    res/
      font/
        press_start_2p.ttf
        vt323.ttf
      values/
        themes.xml
```

---

## Typography Note

The app uses the same fonts as the pixel stories:
- **Press Start 2P** — titles, labels, buttons
- **VT323** — taglines, body text, captions

Both available via Google Fonts. Bundle them as assets (`res/font/`) rather than
loading from network — avoids flash of unstyled text and works offline.

---

## Implementation Phases

### Phase 1 — Skeleton
- Project setup, dependencies, dark theme
- MainActivity with NavHost
- Hardcoded single story card (no network yet)
- WebView opens a hardcoded URL

### Phase 2 — Gallery
- Manifest fetch + SharedPrefs fallback
- HorizontalPager with real story cards
- Coil thumbnail loading
- Navigation to Story Player

### Phase 3 — Story Player
- Full WebView with immersive nav bar
- Loading state + error state
- Back navigation

### Phase 4 — Polish
- Splash screen with animation
- Transitions between screens
- Edge cases (no internet on first launch, empty manifest)

---

## Story Web App Context

The stories this app plays are built with:
- React + Vite (bundled, hash-fingerprinted assets)
- GSAP ScrollTrigger for scroll-driven animation
- HTML5 Canvas for pixel art rendering
- `base: './'` in vite.config.js (relative asset paths)

The WebView must have `domStorageEnabled = true` — GSAP's ScrollTrigger
uses localStorage internally. Without it, stories will not animate.

---

## Related Files in This Project

```
loveletter/
  design_handoff/            ← original HTML prototype (reference)
  loveletter-app/            ← the "loveletter" story (React/Vite)
    src/
      engine/                ← reusable story engine
      story/                 ← loveletter story content
  claude_design_handoff.md   ← design brief sent to Claude Design
  ANDROID_PROJECT_BRIEF.md   ← this file
```

The `loveletter-app/` is the first story. Study it to understand
how stories are structured before building the WebView integration.
