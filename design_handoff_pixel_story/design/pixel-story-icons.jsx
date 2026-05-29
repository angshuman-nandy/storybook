// pixel-story-icons.jsx — 5 App Icon Directions for Pixel Story

function IconBase({ children }) {
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

// Reusable pixel heart inside icons
function PIHeart({ px = 8, color = '#e76f51', glow = false }) {
  const grid = [
    [0,1,1,0,0,1,1,0],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,0,0],
    [0,0,0,1,1,0,0,0],
  ];
  return (
    <svg width={8*px} height={7*px} viewBox={`0 0 ${8*px} ${7*px}`}
      style={{ imageRendering: 'pixelated', filter: glow ? `drop-shadow(0 0 ${px * 1.6}px ${color})` : 'none' }}>
      {grid.flatMap((row, y) => row.map((c, x) =>
        c ? <rect key={`${x}-${y}`} x={x*px} y={y*px} width={px} height={px} fill={color} /> : null
      ))}
    </svg>
  );
}

// ── Icon A: Classic Glow ──────────────────────────────────────
// Coral pixel heart, amber halo — from the brief itself
function IconA() {
  return (
    <IconBase>
      <div style={{
        position: 'absolute', width: 150, height: 130, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(244,162,97,0.45) 0%, rgba(244,162,97,0) 68%)',
      }} />
      <PIHeart px={16} glow />
    </IconBase>
  );
}

// ── Icon B: Heart & Stars ─────────────────────────────────────
// Amber pixel stars orbit a glowing heart — dreamy, romantic
function IconB() {
  const starPts = [
    { x: 28,  y: 40, s: 6 }, { x: 158, y: 38, s: 6 },
    { x: 14,  y: 98, s: 5 }, { x: 174, y: 96, s: 5 },
    { x: 44,  y: 150,s: 5 }, { x: 148, y: 152,s: 5 },
    { x: 86,  y: 22, s: 4 }, { x: 18,  y: 148,s: 3 },
    { x: 176, y: 148,s: 3 }, { x: 62,  y: 16, s: 3 },
    { x: 126, y: 16, s: 3 }, { x: 20,  y: 66, s: 2 },
    { x: 170, y: 66, s: 2 }, { x: 58,  y: 166,s: 2 },
    { x: 132, y: 168,s: 2 },
  ];
  return (
    <IconBase>
      <svg width={200} height={200}
        style={{ position: 'absolute', inset: 0, imageRendering: 'pixelated' }}>
        {starPts.map((s, i) => (
          <rect key={i} x={s.x} y={s.y} width={s.s} height={s.s}
            fill="#f4a261" opacity={0.78} />
        ))}
      </svg>
      <PIHeart px={14} glow />
    </IconBase>
  );
}

// ── Icon C: Love Letter ───────────────────────────────────────
// Pixel envelope, open flap, coral wax-seal heart — references the story format
function IconC() {
  const miniHeart = [
    [0,1,0,1,0],
    [1,1,1,1,1],
    [1,1,1,1,1],
    [0,1,1,1,0],
    [0,0,1,0,0],
  ];
  return (
    <IconBase>
      <svg width={136} height={104} viewBox="0 0 136 104" style={{ imageRendering: 'pixelated' }}>
        {/* Envelope body */}
        <rect width={136} height={104} fill="#1e1e2e" />
        {/* Borders */}
        <rect x={0}   y={0}  width={2}   height={104} fill="#fdf0d5" opacity={0.5} />
        <rect x={134} y={0}  width={2}   height={104} fill="#fdf0d5" opacity={0.5} />
        <rect x={0}   y={102} width={136} height={2} fill="#fdf0d5" opacity={0.5} />
        {/* V-fold diagonal lines from top corners → centre */}
        {[...Array(32)].map((_, i) => {
          const lx = i * 2, rx = 134 - i * 2, y = i * 2;
          return (
            <React.Fragment key={i}>
              <rect x={lx} y={y} width={2} height={2} fill="#fdf0d5" opacity={0.5} />
              <rect x={rx} y={y} width={2} height={2} fill="#fdf0d5" opacity={0.5} />
            </React.Fragment>
          );
        })}
        {/* Coral wax-seal heart (5×5 mini) */}
        {miniHeart.map((row, ry) => row.map((c, rx) =>
          c ? <rect key={`${rx}-${ry}`}
                x={50 + rx * 7} y={60 + ry * 7}
                width={7} height={7} fill="#e76f51" /> : null
        ))}
        {/* Glow behind seal */}
      </svg>
    </IconBase>
  );
}

// ── Icon D: Twin Hearts ───────────────────────────────────────
// Coral + amber pixel hearts — two souls, one story
function IconD() {
  const hGrid = [
    [0,1,1,0,0,1,1,0],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,0,0],
    [0,0,0,1,1,0,0,0],
  ];
  const SmHeart = ({ px, color }) => (
    <svg width={8*px} height={7*px} viewBox={`0 0 ${8*px} ${7*px}`}
      style={{ imageRendering: 'pixelated', filter: `drop-shadow(0 0 6px ${color})` }}>
      {hGrid.flatMap((row, y) => row.map((c, x) =>
        c ? <rect key={`${x}-${y}`} x={x*px} y={y*px} width={px} height={px} fill={color} /> : null
      ))}
    </svg>
  );
  return (
    <IconBase>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <SmHeart px={10} color="#e76f51" />
        <SmHeart px={10} color="#f4a261" />
      </div>
    </IconBase>
  );
}

// ── Icon E: Crown Heart ───────────────────────────────────────
// Amber pixel crown atop the coral heart — premium, handcrafted feel
function IconE() {
  const crownGrid = [
    [1,0,0,0,0,1,1,0,0,0,0,1],
    [1,1,0,0,1,1,1,1,0,0,1,1],
    [1,1,0,1,1,0,0,1,1,0,1,1],
    [1,1,1,1,0,0,0,0,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1],
  ];
  const cp = 7; // crown pixel size
  return (
    <IconBase>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
        <svg width={12*cp} height={6*cp} viewBox={`0 0 ${12*cp} ${6*cp}`}
          style={{ imageRendering: 'pixelated', filter: 'drop-shadow(0 0 5px #f4a261)' }}>
          {crownGrid.flatMap((row, y) => row.map((c, x) =>
            c ? <rect key={`${x}-${y}`} x={x*cp} y={y*cp} width={cp} height={cp} fill="#f4a261" /> : null
          ))}
        </svg>
        <PIHeart px={13} glow />
      </div>
    </IconBase>
  );
}

Object.assign(window, { IconA, IconB, IconC, IconD, IconE });
