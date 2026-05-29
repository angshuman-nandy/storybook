// pixel-story-screens.jsx — Pixel Story app screen mockups

const PSColors = {
  deep:    '#0b0b16',
  night:   '#16213e',
  surface: '#1e1e2e',
  amber:   '#f4a261',
  coral:   '#e76f51',
  peach:   '#ffb4a2',
  cream:   '#fdf0d5',
  muted:   'rgba(253,240,213,0.4)',
};

// ── Pixel Heart (8×7 grid) ────────────────────────────────────
function PixelHeart({ px = 8, color = PSColors.coral, glow = false }) {
  const grid = [
    [0,1,1,0,0,1,1,0],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,0,0],
    [0,0,0,1,1,0,0,0],
  ];
  const w = 8 * px, h = 7 * px;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}
      style={{ imageRendering: 'pixelated', filter: glow ? `drop-shadow(0 0 ${px * 1.5}px ${color})` : 'none' }}>
      {grid.flatMap((row, y) => row.map((c, x) =>
        c ? <rect key={`${x}-${y}`} x={x*px} y={y*px} width={px} height={px} fill={color} /> : null
      ))}
    </svg>
  );
}

// ── Night Sky Pixel Art ───────────────────────────────────────
// Fills its containing block (parent must be position:relative)
function NightSkyArt({ overlay = true }) {
  const VW = 361, VH = 654;

  const stars = [
    [43,18],[82,35],[125,12],[168,28],[210,8],[252,40],[295,22],[338,15],[355,45],
    [20,55],[65,68],[108,48],[152,72],[198,58],[242,75],[285,52],[320,70],
    [14,90],[70,108],[130,92],[180,115],[235,98],[280,120],[330,88],[352,110],
    [45,140],[95,155],[145,135],[195,150],[245,138],[295,162],[342,145],
  ];

  // buildings: x, w, h (from bottom)
  const buildings = [
    { x: 0,   w: 52,  h: 90  },
    { x: 48,  w: 36,  h: 125 },
    { x: 80,  w: 54,  h: 78  },
    { x: 130, w: 44,  h: 148 },
    { x: 170, w: 32,  h: 95  },
    { x: 198, w: 58,  h: 168 },
    { x: 252, w: 40,  h: 112 },
    { x: 288, w: 48,  h: 88  },
    { x: 332, w: 32,  h: 130 },
  ];

  // amber windows — confirmed within buildings above
  const windows = [
    [204,500],[214,500],[224,500],[204,516],[214,516],[204,532],
    [134,516],[144,516],[134,530],[144,530],
    [52,540],[62,540],[52,554],
    [336,534],[346,534],[336,548],
    [254,548],[264,548],
  ];

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      preserveAspectRatio="xMidYMid slice"
      style={{ display: 'block', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    >
      <defs>
        <linearGradient id="nsGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0b0b16" />
          <stop offset="55%"  stopColor="#16213e" />
          <stop offset="100%" stopColor="#0b0b16" />
        </linearGradient>
        <linearGradient id="nsOverlay" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(11,11,22,0)"    />
          <stop offset="42%"  stopColor="rgba(11,11,22,0)"    />
          <stop offset="82%"  stopColor="rgba(11,11,22,0.88)" />
          <stop offset="100%" stopColor="rgba(11,11,22,0.97)" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width={VW} height={VH} fill="url(#nsGrad)" />

      {/* Stars */}
      {stars.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width={2} height={2} fill="#fdf0d5" opacity={0.65} />
      ))}

      {/* Crescent moon */}
      <rect x={290} y={36} width={20} height={18} fill="#fdf0d5" opacity={0.9} />
      <rect x={294} y={34} width={18} height={18} fill="#16213e" />

      {/* Buildings */}
      {buildings.map((b, i) => (
        <rect key={i} x={b.x} y={VH - b.h} width={b.w} height={b.h} fill="#0c0c1a" />
      ))}

      {/* Amber windows */}
      {windows.map(([wx, wy], i) => (
        <rect key={i} x={wx} y={wy} width={5} height={5} fill="#f4a261" opacity={0.9} />
      ))}

      {/* Gradient overlay for card text legibility */}
      {overlay && <rect width={VW} height={VH} fill="url(#nsOverlay)" />}
    </svg>
  );
}

// ── Splash Screen ──────────────────────────────────────────────
function SplashScreen() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: PSColors.deep,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 30,
    }}>
      <div style={{ animation: 'heartbeat 900ms ease-in-out infinite' }}>
        <PixelHeart px={11} glow />
      </div>
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 13, color: PSColors.cream,
        letterSpacing: '0.08em', textAlign: 'center', lineHeight: 1.8,
      }}>
        pixel stories
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        {[0, 0.4, 0.8].map((delay, i) => (
          <div key={i} style={{
            width: 6, height: 6, background: PSColors.amber,
            animation: `dotFade 1.2s ${delay}s ease-in-out infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

// ── Gallery Screen ─────────────────────────────────────────────
// Stream-only: a single primary action button (PLAY) — no download flow.
function GalleryScreen() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: PSColors.deep,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      paddingTop: 10, boxSizing: 'border-box',
    }}>
      {/* Card */}
      <div style={{
        width: 'calc(100% - 32px)', height: '83%',
        position: 'relative', overflow: 'hidden',
        background: PSColors.night, flexShrink: 0,
      }}>
        <NightSkyArt overlay={true} />

        {/* NEW badge */}
        <div style={{
          position: 'absolute', top: 12, right: 12,
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 7, letterSpacing: '0.06em',
          background: PSColors.amber, color: PSColors.deep,
          padding: '4px 7px',
        }}>NEW</div>

        {/* Bottom overlay content */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 16px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 4, height: 4, background: PSColors.coral, flexShrink: 0 }} />
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 11, color: PSColors.cream,
              lineHeight: 1.7, letterSpacing: '0.04em',
            }}>
              a letter to<br />the moon
            </div>
          </div>
          <div style={{
            fontFamily: "'VT323', monospace",
            fontSize: 19, color: PSColors.peach,
            marginBottom: 14, paddingLeft: 12,
          }}>
            a pixel love story
          </div>

          {/* Primary action — single PLAY state */}
          <div style={{
            width: '100%', height: 44,
            background: PSColors.amber,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 9, color: PSColors.deep,
            letterSpacing: '0.06em', cursor: 'pointer',
            boxSizing: 'border-box',
          }}>
            ▶  PLAY
          </div>
        </div>
      </div>

      {/* Pagination dots */}
      <div style={{ display: 'flex', gap: 8, marginTop: 14, alignItems: 'center' }}>
        {[false, true, false, false].map((active, i) => (
          <div key={i} style={{
            width: 4, height: 4,
            background: active ? PSColors.amber : 'rgba(253,240,213,0.2)',
          }} />
        ))}
      </div>
    </div>
  );
}

// ── Story Player ───────────────────────────────────────────────
function StoryPlayerScreen({ mode = 'loading' }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: PSColors.deep,
      position: 'relative', overflow: 'hidden',
    }}>
      <NightSkyArt overlay={mode === 'active'} />

      {mode === 'loading' ? (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ animation: 'heartbeat 900ms ease-in-out infinite' }}>
            <PixelHeart px={16} glow />
          </div>
        </div>
      ) : (
        <>
          {/* Dialogue box */}
          <div style={{
            position: 'absolute', top: 36, left: 16, right: 16,
            background: 'rgba(22,33,62,0.94)',
            padding: '12px 16px',
            borderLeft: `2px solid ${PSColors.amber}`,
          }}>
            <div style={{
              fontFamily: "'VT323', monospace", fontSize: 13,
              color: PSColors.peach, letterSpacing: '0.1em', marginBottom: 4,
            }}>LUNA</div>
            <div style={{
              fontFamily: "'VT323', monospace", fontSize: 19,
              color: PSColors.cream, lineHeight: 1.5,
            }}>
              Do you ever wonder if the moon watches over us... or if we watch over it?
            </div>
          </div>

          {/* Characters */}
          <svg width="100%" height="170" viewBox="0 0 393 170"
            style={{ position: 'absolute', bottom: 28 }}>
            {/* Character A — left (peach) */}
            <g transform="translate(70,12)">
              <rect x={-8} y={0}  width={16} height={14} fill={PSColors.peach} />
              <rect x={-6} y={16} width={12} height={20} fill={PSColors.peach} />
              <rect x={-6} y={37} width={5}  height={16} fill={PSColors.peach} />
              <rect x={2}  y={37} width={5}  height={16} fill={PSColors.peach} />
              <rect x={6}  y={18} width={16} height={4}  fill={PSColors.peach} />
              <rect x={-20} y={18} width={14} height={4} fill={PSColors.peach} />
            </g>
            {/* Sparkles */}
            <rect x={192} y={60} width={4} height={4} fill={PSColors.amber} opacity={0.9} />
            <rect x={185} y={75} width={3} height={3} fill={PSColors.amber} opacity={0.6} />
            <rect x={200} y={48} width={2} height={2} fill={PSColors.coral} opacity={0.8} />
            <rect x={196} y={80} width={2} height={2} fill={PSColors.amber} opacity={0.5} />
            <rect x={182} y={58} width={2} height={2} fill={PSColors.coral} opacity={0.5} />
            {/* Character B — right (coral), mirrored */}
            <g transform="translate(322,12) scale(-1,1)">
              <rect x={-8} y={0}  width={16} height={14} fill={PSColors.coral} />
              <rect x={-6} y={16} width={12} height={20} fill={PSColors.coral} />
              <rect x={-6} y={37} width={5}  height={16} fill={PSColors.coral} />
              <rect x={2}  y={37} width={5}  height={16} fill={PSColors.coral} />
              <rect x={6}  y={18} width={16} height={4}  fill={PSColors.coral} />
              <rect x={-20} y={18} width={14} height={4} fill={PSColors.coral} />
            </g>
          </svg>

          {/* Tap hint */}
          <div style={{
            position: 'absolute', bottom: 10, left: 0, right: 0,
            display: 'flex', justifyContent: 'center',
          }}>
            <div style={{
              fontFamily: "'VT323', monospace", fontSize: 14,
              color: PSColors.muted, letterSpacing: '0.05em',
            }}>TAP TO CONTINUE</div>
          </div>
        </>
      )}
    </div>
  );
}

Object.assign(window, {
  PSColors, PixelHeart, NightSkyArt,
  SplashScreen, GalleryScreen, StoryPlayerScreen,
});
