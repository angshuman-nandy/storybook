// pixel-story-icons-v2.jsx — 5 More Icon Directions (No Hearts · Story Themes)

function IconBaseV2({ children }) {
  return (
    <div style={{
      width: 200, height: 200,
      background: '#0b0b16',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {children}
    </div>
  );
}

// ── Icon F: Crescent Moon ─────────────────────────────────────
// The signature image of the app, alone. Cream pixel crescent floating
// in a starfield, with a soft peach halo.
function IconF() {
  // 14 cols × 14 rows. '1' = lit moon pixel
  const moon = [
    '......1111....',
    '....11111111..',
    '...11111......',
    '..11111.......',
    '.11111........',
    '.11111........',
    '11111.........',
    '11111.........',
    '.11111........',
    '.11111........',
    '..11111.......',
    '...11111......',
    '....11111111..',
    '......1111....',
  ];
  const px = 9;
  const stars = [
    {x:160, y:24, s:5}, {x:32,  y:38, s:4},
    {x:170, y:90, s:4}, {x:24,  y:148,s:5},
    {x:152, y:158,s:4}, {x:178, y:140,s:3},
    {x:42,  y:18, s:3}, {x:14,  y:90, s:3},
    {x:166, y:60, s:2}, {x:20,  y:120,s:2},
  ];

  return (
    <IconBaseV2>
      <svg width={200} height={200} style={{ position: 'absolute', inset: 0, imageRendering: 'pixelated' }}>
        {stars.map((s, i) => (
          <rect key={i} x={s.x} y={s.y} width={s.s} height={s.s} fill="#f4a261" opacity={0.8} />
        ))}
      </svg>
      <div style={{
        position: 'absolute', width: 170, height: 150, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,180,162,0.25) 0%, rgba(255,180,162,0) 65%)',
      }}/>
      <svg width={14*px} height={14*px} viewBox={`0 0 ${14*px} ${14*px}`}
        style={{ imageRendering: 'pixelated', filter: 'drop-shadow(0 0 12px #ffb4a2)' }}>
        {moon.flatMap((row, y) => [...row].map((c, x) =>
          c === '1' ? <rect key={`${x}-${y}`} x={x*px} y={y*px} width={px} height={px} fill="#fdf0d5" /> : null
        ))}
      </svg>
    </IconBaseV2>
  );
}

// ── Icon G: CRT Television ────────────────────────────────────
// A chunky pixel CRT showing a tiny pixel scene — "stories you watch".
function IconG() {
  return (
    <IconBaseV2>
      <svg width={170} height={160} viewBox="0 0 170 160" style={{ imageRendering: 'pixelated' }}>
        {/* Antenna */}
        <rect x={60}  y={4}  width={4}  height={24} fill="#fdf0d5" />
        <rect x={106} y={4}  width={4}  height={24} fill="#fdf0d5" />
        <rect x={60}  y={28} width={50} height={4}  fill="#fdf0d5" />
        {/* TV body — chunky border */}
        <rect x={6}   y={32} width={158} height={100} fill="#fdf0d5" />
        <rect x={14}  y={40} width={142} height={84}  fill="#0b0b16" />
        {/* Inner screen frame */}
        <rect x={22}  y={48} width={126} height={68}  fill="#16213e" />
        {/* Mini night sky inside screen */}
        {[[40,60],[68,54],[100,62],[130,56],[58,84],[110,88],[140,98]].map(([x,y],i) => (
          <rect key={i} x={x} y={y} width={3} height={3} fill="#fdf0d5" opacity={0.85} />
        ))}
        {/* Mini crescent moon */}
        <rect x={86} y={70} width={16} height={14} fill="#fdf0d5" />
        <rect x={90} y={68} width={14} height={14} fill="#16213e" />
        {/* Scanline / glow tint */}
        <rect x={22} y={48} width={126} height={68} fill="#f4a261" opacity={0.08} />
        {/* Knobs */}
        <rect x={32}  y={138} width={14} height={14} fill="#f4a261" />
        <rect x={124} y={138} width={14} height={14} fill="#f4a261" />
        {/* Speaker grill */}
        <rect x={56}  y={140} width={4}  height={10} fill="#1e1e2e" />
        <rect x={64}  y={140} width={4}  height={10} fill="#1e1e2e" />
        <rect x={72}  y={140} width={4}  height={10} fill="#1e1e2e" />
        <rect x={80}  y={140} width={4}  height={10} fill="#1e1e2e" />
        <rect x={88}  y={140} width={4}  height={10} fill="#1e1e2e" />
        <rect x={96}  y={140} width={4}  height={10} fill="#1e1e2e" />
        <rect x={104} y={140} width={4}  height={10} fill="#1e1e2e" />
        <rect x={112} y={140} width={4}  height={10} fill="#1e1e2e" />
      </svg>
    </IconBaseV2>
  );
}

// ── Icon H: Window onto Night ────────────────────────────────
// A pixel window pane looking out onto a moonlit sky.
function IconH() {
  return (
    <IconBaseV2>
      <svg width={150} height={150} viewBox="0 0 150 150" style={{ imageRendering: 'pixelated' }}>
        {/* Sky behind window */}
        <defs>
          <linearGradient id="wndSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#16213e" />
            <stop offset="100%" stopColor="#0c1428" />
          </linearGradient>
        </defs>
        <rect width={150} height={150} fill="url(#wndSky)" />
        {/* Stars (inside the panes) */}
        {[[20,22,3],[55,15,2],[120,28,3],[30,48,2],[95,52,3],[130,90,3],
          [16,102,2],[50,124,3],[112,134,2],[40,80,2],[85,108,2]].map(([x,y,s],i) => (
          <rect key={i} x={x} y={y} width={s} height={s} fill="#fdf0d5" opacity={0.85} />
        ))}
        {/* Crescent moon (upper right pane) */}
        <rect x={100} y={32} width={22} height={20} fill="#fdf0d5" opacity={0.95} />
        <rect x={106} y={30} width={20} height={20} fill="#16213e" />
        {/* Amber window glow in lower panes */}
        <rect x={8}  y={80} width={64} height={62} fill="#f4a261" opacity={0.05} />
        <rect x={78} y={80} width={64} height={62} fill="#f4a261" opacity={0.05} />
        {/* Window frame — outer */}
        <rect x={0}   y={0}   width={150} height={8}  fill="#fdf0d5" />
        <rect x={0}   y={142} width={150} height={8}  fill="#fdf0d5" />
        <rect x={0}   y={0}   width={8}   height={150} fill="#fdf0d5" />
        <rect x={142} y={0}   width={8}   height={150} fill="#fdf0d5" />
        {/* Cross mullions */}
        <rect x={71} y={0} width={8} height={150} fill="#fdf0d5" />
        <rect x={0}  y={71} width={150} height={8} fill="#fdf0d5" />
        {/* Sill — slightly thicker at bottom */}
        <rect x={0}  y={136} width={150} height={14} fill="#fdf0d5" />
      </svg>
    </IconBaseV2>
  );
}

// ── Icon I: Glowing Lantern ───────────────────────────────────
// Warm amber glow inside a pixel lantern — intimate, handcrafted storytelling.
function IconI() {
  return (
    <IconBaseV2>
      {/* Amber halo behind lantern */}
      <div style={{
        position: 'absolute', width: 200, height: 200,
        background: 'radial-gradient(ellipse at center, rgba(244,162,97,0.35) 0%, rgba(244,162,97,0) 55%)',
      }}/>
      <svg width={100} height={170} viewBox="0 0 100 170" style={{ imageRendering: 'pixelated' }}>
        {/* Handle — U shape */}
        <rect x={42} y={0}  width={16} height={4} fill="#fdf0d5" />
        <rect x={36} y={4}  width={6}  height={4} fill="#fdf0d5" />
        <rect x={58} y={4}  width={6}  height={4} fill="#fdf0d5" />
        <rect x={32} y={8}  width={4}  height={4} fill="#fdf0d5" />
        <rect x={64} y={8}  width={4}  height={4} fill="#fdf0d5" />
        <rect x={32} y={12} width={4}  height={10} fill="#fdf0d5" />
        <rect x={64} y={12} width={4}  height={10} fill="#fdf0d5" />
        {/* Top cap */}
        <rect x={18} y={22} width={64} height={6}  fill="#fdf0d5" />
        <rect x={12} y={28} width={76} height={8}  fill="#fdf0d5" />
        {/* Frame uprights */}
        <rect x={12} y={36} width={6}  height={102} fill="#fdf0d5" />
        <rect x={82} y={36} width={6}  height={102} fill="#fdf0d5" />
        {/* Frame top & bottom of glass */}
        <rect x={18} y={36} width={64} height={4} fill="#fdf0d5" />
        <rect x={18} y={134} width={64} height={4} fill="#fdf0d5" />
        {/* Glass interior */}
        <rect x={18} y={40} width={64} height={94} fill="#1e1e2e" />
        {/* Amber flame body */}
        <rect x={36} y={80} width={28} height={42} fill="#f4a261" />
        <rect x={40} y={72} width={20} height={10} fill="#ffb4a2" />
        <rect x={44} y={66} width={12} height={8}  fill="#fdf0d5" />
        {/* Inner glow */}
        <rect x={28} y={88} width={44} height={28} fill="#f4a261" opacity={0.4} />
        {/* Vertical glass strut (decorative) */}
        <rect x={48} y={40} width={4} height={94} fill="#fdf0d5" opacity={0.18} />
        {/* Bottom cap */}
        <rect x={12} y={138} width={76} height={8} fill="#fdf0d5" />
        <rect x={18} y={146} width={64} height={6} fill="#fdf0d5" />
        {/* Feet */}
        <rect x={24} y={152} width={14} height={12} fill="#fdf0d5" />
        <rect x={62} y={152} width={14} height={12} fill="#fdf0d5" />
      </svg>
    </IconBaseV2>
  );
}

// ── Icon J: Open Book ─────────────────────────────────────────
// An open book — left page with constellation, right page with crescent moon.
// The most literal "stories" reference.
function IconJ() {
  return (
    <IconBaseV2>
      <svg width={170} height={130} viewBox="0 0 170 130" style={{ imageRendering: 'pixelated' }}>
        {/* Page shadow underneath */}
        <rect x={6}   y={120} width={158} height={4} fill="#000" opacity={0.5} />
        <rect x={2}   y={124} width={166} height={3} fill="#000" opacity={0.3} />
        {/* Left page */}
        <rect x={0}   y={4}  width={82}  height={120} fill="#fdf0d5" />
        {/* Right page */}
        <rect x={88}  y={4}  width={82}  height={120} fill="#fdf0d5" />
        {/* Spine shadow */}
        <rect x={82}  y={4}  width={6}   height={120} fill="#1e1e2e" />
        {/* Page edge highlights */}
        <rect x={0}   y={0}  width={82}  height={4}   fill="#ffb4a2" opacity={0.6} />
        <rect x={88}  y={0}  width={82}  height={4}   fill="#ffb4a2" opacity={0.6} />
        {/* Constellation on left page (stars + connecting line) */}
        {[[18,28,3],[34,40,3],[26,58,3],[52,52,3],[44,72,3],[64,80,3]].map(([x,y,s],i) => (
          <rect key={i} x={x} y={y} width={s} height={s} fill="#e76f51" />
        ))}
        {/* Constellation connecting lines */}
        <rect x={19}  y={30} width={16} height={1} fill="#e76f51" opacity={0.5} />
        <rect x={26}  y={31} width={1}  height={28} fill="#e76f51" opacity={0.5} />
        <rect x={26}  y={58} width={28} height={1} fill="#e76f51" opacity={0.5} />
        <rect x={44}  y={53} width={1}  height={20} fill="#e76f51" opacity={0.5} />
        <rect x={44}  y={72} width={20} height={1} fill="#e76f51" opacity={0.5} />
        {/* Subtitle dashes (text) on left page bottom */}
        <rect x={12}  y={96}  width={30} height={2} fill="#1e1e2e" opacity={0.35} />
        <rect x={12}  y={104} width={42} height={2} fill="#1e1e2e" opacity={0.35} />
        {/* Crescent moon on right page */}
        <rect x={115} y={30}  width={28} height={28} fill="#f4a261" />
        <rect x={123} y={26}  width={26} height={28} fill="#fdf0d5" />
        {/* Right page text dashes */}
        <rect x={100} y={78}  width={48} height={2} fill="#1e1e2e" opacity={0.35} />
        <rect x={100} y={86}  width={56} height={2} fill="#1e1e2e" opacity={0.35} />
        <rect x={100} y={94}  width={40} height={2} fill="#1e1e2e" opacity={0.35} />
        <rect x={100} y={102} width={52} height={2} fill="#1e1e2e" opacity={0.35} />
      </svg>
    </IconBaseV2>
  );
}

Object.assign(window, { IconF, IconG, IconH, IconI, IconJ });
