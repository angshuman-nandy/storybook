  ---
  # Design Brief: Pixel Story Android App
  
  ## Overview
  
  A native Android app that serves as a gallery for interactive pixel art love stories.
  The aesthetic should feel like a premium dark, cinematic experience — warm amber glows,
  deep night-sky backgrounds, pixel-art accents — consistent with the stories it hosts.
  Think "beautiful gift box" energy: handcrafted, intimate, not generic.

  The app has three surfaces to design:
  1. **Splash Screen** — app open / manifest loading
  2. **Gallery Screen** — browsable story cards (home)
  3. **Story Player** — full-screen WebView wrapper (minimal chrome)

  ---
  
  ## Design Tokens

  ### Color Palette
  --deep:      #0b0b16   page background, deepest void
  --night:     #16213e   card backgrounds, surfaces
  --surface:   #1e1e2e   elevated cards, modals
  --amber:     #f4a261   primary accent — CTAs, active states, glows
  --coral:     #e76f51   hearts, highlights, download progress
  --peach:     #ffb4a2   secondary text, soft labels
  --cream:     #fdf0d5   primary body text, titles
  --muted:     rgba(253,240,213,0.4)  secondary / disabled text

  ### Typography
  | Usage | Font | Size | Notes |
  |---|---|---|---|
  | Screen titles | Press Start 2P | 14–16sp | Letter-spacing 0.08em |
  | Story title on card | Press Start 2P | 12–14sp | |
  | Story tagline | VT323 | 20sp | Softer, readable |
  | Button labels | Press Start 2P | 9–10sp | All caps feel |
  | Body / captions | VT323 | 18sp | |
  | Download percentage | VT323 | 22sp | Monospaced feel |

  Both fonts available via Google Fonts. Match the pixel story web app exactly.

  ### Shape & Elevation
  - Cards: sharp corners (0dp radius) — pixel art aesthetic, no rounded corners
  - Buttons: sharp corners, 1dp border in amber at 30% opacity
  - No material elevation shadows — use color layering instead

  ### Iconography
  - Pixel-art style icons preferred (8×8 or 16×16 grid origin, scaled up)
  - Play icon: simple right-pointing triangle, 2px stroke in cream
  - Download icon: downward arrow with tray
  - Back icon: left-pointing chevron, 2px stroke

  ---

  ## Screen 1 — Splash Screen

  **Purpose:** Shown while the app boots and fetches the story manifest.

  **Layout:**
  - Full-screen `#0b0b16` background
  - Center: animated pixel heart `♥` in coral (#e76f51)
    - Heartbeat animation: scale 1.0 → 1.2 → 1.0, 900ms loop, ease-in-out
  - Below heart: app name in Press Start 2P, cream, ~14sp
    - Suggested name: "pixel stories" (all lowercase, intimate feel)
  - Below name: a soft loading indicator — three dots fading in sequence, amber
  - No progress bar, no percentage — keep it calm and romantic

  **Transition:**
  - Fade out (400ms) → Gallery Screen once manifest loads
  - If manifest fails: replace dots with a small error message in VT323,
    cream, "couldn't connect. tap to retry." — tap anywhere retries

  ---

  ## Screen 2 — Gallery Screen (Home)

  **Purpose:** Browse and download available pixel stories.

  **Layout:**

  ┌─────────────────────────────┐
  │  status bar (visible)       │
  ├─────────────────────────────┤
  │                             │
  │  ┌───────────────────────┐  │
  │  │                       │  │
  │  │    THUMBNAIL IMAGE    │  │
  │  │    (full bleed bg)    │  │
  │  │                       │  │
  │  │  dark gradient        │  │
  │  │  overlay (bottom 50%) │  │
  │  │                       │  │
  │  │  ● Story Title        │  │
  │  │  tagline text here    │  │
  │  │                       │  │
  │  │  [  DOWNLOAD  ]       │  │
  │  └───────────────────────┘  │
  │                             │
  │  ○ ● ○  (page indicator)    │
  │                             │
  └─────────────────────────────┘

  **Card design (full-bleed, edge to edge):**
  - Card fills ~85% of screen height, full width with 16dp horizontal margin
  - Thumbnail image as background (Coil async load, crossfade)
  - Gradient overlay: transparent → `rgba(11,11,22,0.92)` from 40% to bottom
  - Top-right corner: small "NEW" pixel badge in amber if story added < 7 days ago

  **Card text (over gradient):**
  - Story title: Press Start 2P, 14sp, cream, bottom-aligned above tagline
  - Tagline: VT323, 20sp, peach (#ffb4a2), 1 line max
  - Accent dot: 4×4px square in the story's accent color, left of title

  **Action button (bottom of card):**

  Three states:

  | State | Label | Style |
  |---|---|---|
  | Not downloaded | `▼  DOWNLOAD` | Amber border, amber text, transparent bg |
  | Downloading | `↓  47%` | Coral border, progress fill left→right, cream text |
  | Downloaded | `▶  PLAY` | Solid amber bg, deep text |

  Button: sharp corners, full width within card (minus 24dp padding each side),
  48dp tall, Press Start 2P 9sp label.

  Download progress: the button background fills from left to right in coral
  as percentage increases. Text shows percentage centered.

  **Pagination:**
  - Horizontal scroll (one card visible at a time, peek 16dp of next card)
  - Page indicator: row of 4×4px squares, active = amber, inactive = cream 20%
  - Centered below cards, 12dp gap from card bottom

  **Empty / loading state:**
  - Cards show as skeleton: `#1e1e2e` rectangle with subtle shimmer animation
  - Shimmer: linear gradient sweeping left to right, `#2a2a3e` highlight

  ---

  ## Screen 3 — Story Player

  **Purpose:** Hosts the story web app in a full-screen WebView.

  **Layout:**
  - Status bar: visible, dark icons on dark background (set to light status bar
    icons — white/cream on `#0b0b16`)
  - Navigation bar: hidden (immersive, swipe-up to reveal temporarily)
  - WebView: fills remaining screen below status bar, edge to edge

  **Loading state (while WebView loads):**
  - Same `#0b0b16` background
  - Centered beating heart `♥` in coral — same as splash
  - Fades out once WebView's `onPageFinished` fires

  **Navigation:**
  - Android system back button / gesture → dismiss player, return to gallery
  - No visible back button in UI — the story is immersive, back is the only exit
  - On return to gallery: card should still show "Play" state (already downloaded)

  **Error state:**
  - If WebView fails to load the local file, show:
    - Center: `!` in pixel style, coral
    - Below: "story couldn't load" in VT323, cream
    - Below: "tap to retry" in VT323, amber — taps reload WebView

  ---

  ## Interactions & Motion

  ### Card swipe
  - Horizontal snap scroll, one card at a time
  - Adjacent card peeks 16dp on right
  - During swipe: card scales slightly (0.96 → 1.0 on focus) for depth feel

  ### Button press
  - Download/Play button: scale 0.96 on press, 120ms spring back

  ### Screen transitions
  - Gallery → Player: shared element if possible (thumbnail expands to full screen),
    otherwise: fade in over 300ms
  - Player → Gallery: slide down dismiss (like a bottom sheet closing)

  ### Download progress animation
  - Button fill sweeps left→right smoothly as bytes download
  - On completion: brief amber flash (200ms), then transitions to Play state

  ---

  ## App Chrome

  ### Status bar
  - Background: `#0b0b16` (matches app background)
  - Icons: light (cream/white)
  - Applied across all screens

  ### Navigation bar (Gallery screen only)
  - Background: `#0b0b16`
  - Icons: light
  - Hidden in Story Player

  ### App icon
  - Dark `#0b0b16` background
  - Centered pixel heart `♥` in coral (#e76f51), 8×8 pixel grid style
  - Small amber glow behind heart

  ---

  ## What NOT to do

  - No white backgrounds, no light mode
  - No rounded corners on cards or buttons
  - No material design elevation shadows
  - No generic sans-serif fonts — use Press Start 2P / VT323 exclusively
  - No animations faster than 120ms or slower than 400ms
  - No more than 2 accent colors visible at once on any screen

  ---

  ## Reference

  The hosted pixel story (loveletter) at its visual peak is the tone benchmark.
  The app should feel like the frame that holds that story — dark, intimate,
  crafted. The gallery is the gift box; the story is the gift.

  ---