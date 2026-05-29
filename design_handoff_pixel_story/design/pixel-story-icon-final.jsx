// pixel-story-icon-final.jsx — FINAL ICON: Glowing Lantern, in multiple contexts

// ── Lantern artwork at any size ───────────────────────────────
// scale=1 → ~100×170 (svg viewport). Pass scale to render larger.
function LanternArt({ scale = 1, withHalo = true }) {
  const W = 100, H = 170;
  return (
    <div style={{ position: 'relative', width: W * scale, height: H * scale, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {withHalo && (
        <div style={{
          position: 'absolute', inset: '-30%',
          background: 'radial-gradient(ellipse at center, rgba(244,162,97,0.45) 0%, rgba(244,162,97,0) 55%)',
          pointerEvents: 'none',
        }}/>
      )}
      <svg width={W * scale} height={H * scale} viewBox={`0 0 ${W} ${H}`} style={{ imageRendering: 'pixelated', position: 'relative' }}>
        {/* Handle */}
        <rect x={42} y={0}  width={16} height={4}  fill="#fdf0d5" />
        <rect x={36} y={4}  width={6}  height={4}  fill="#fdf0d5" />
        <rect x={58} y={4}  width={6}  height={4}  fill="#fdf0d5" />
        <rect x={32} y={8}  width={4}  height={4}  fill="#fdf0d5" />
        <rect x={64} y={8}  width={4}  height={4}  fill="#fdf0d5" />
        <rect x={32} y={12} width={4}  height={10} fill="#fdf0d5" />
        <rect x={64} y={12} width={4}  height={10} fill="#fdf0d5" />
        {/* Top cap */}
        <rect x={18} y={22} width={64} height={6}  fill="#fdf0d5" />
        <rect x={12} y={28} width={76} height={8}  fill="#fdf0d5" />
        {/* Frame uprights */}
        <rect x={12} y={36} width={6}  height={102} fill="#fdf0d5" />
        <rect x={82} y={36} width={6}  height={102} fill="#fdf0d5" />
        {/* Glass top & bottom */}
        <rect x={18} y={36}  width={64} height={4} fill="#fdf0d5" />
        <rect x={18} y={134} width={64} height={4} fill="#fdf0d5" />
        {/* Glass interior */}
        <rect x={18} y={40} width={64} height={94} fill="#1e1e2e" />
        {/* Flame */}
        <rect x={36} y={80} width={28} height={42} fill="#f4a261" />
        <rect x={40} y={72} width={20} height={10} fill="#ffb4a2" />
        <rect x={44} y={66} width={12} height={8}  fill="#fdf0d5" />
        {/* Inner glow */}
        <rect x={28} y={88} width={44} height={28} fill="#f4a261" opacity={0.4} />
        {/* Decorative strut */}
        <rect x={48} y={40} width={4} height={94} fill="#fdf0d5" opacity={0.18} />
        {/* Bottom cap */}
        <rect x={12} y={138} width={76} height={8} fill="#fdf0d5" />
        <rect x={18} y={146} width={64} height={6} fill="#fdf0d5" />
        {/* Feet */}
        <rect x={24} y={152} width={14} height={12} fill="#fdf0d5" />
        <rect x={62} y={152} width={14} height={12} fill="#fdf0d5" />
      </svg>
    </div>
  );
}

// ── Final Icon: 512×512 hero ──────────────────────────────────
function FinalIconHero() {
  return (
    <div style={{
      width: 512, height: 512,
      background: '#0b0b16',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      <LanternArt scale={2.4} withHalo />
    </div>
  );
}

// ── Final Icon: rounded mask preview (Android adaptive) ───────
function FinalIconAdaptive() {
  return (
    <div style={{
      width: 280, height: 280, borderRadius: 62, overflow: 'hidden',
      background: '#0b0b16',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
    }}>
      <LanternArt scale={1.3} withHalo />
    </div>
  );
}

// ── Final Icon: small (launcher) ──────────────────────────────
function FinalIconSmall() {
  return (
    <div style={{
      width: 96, height: 96, borderRadius: 22, overflow: 'hidden',
      background: '#0b0b16',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
    }}>
      <LanternArt scale={0.46} withHalo />
    </div>
  );
}

// ── Final Icon: in context — on a Pixel home-screen wallpaper ─
function FinalIconOnHome() {
  // Mini home-screen mock
  return (
    <div style={{
      width: 320, height: 460,
      background: 'linear-gradient(180deg, #1a1530 0%, #0a0a18 100%)',
      borderRadius: 28,
      padding: 16, boxSizing: 'border-box',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative stars */}
      <svg width={320} height={460} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {[[42,38,2],[120,22,2],[200,50,3],[280,30,2],[60,80,2],
          [240,90,2],[180,140,2],[40,160,3],[280,170,2],[160,200,2],
          [70,250,2],[270,260,2],[140,310,2]].map(([x,y,s], i) => (
          <rect key={i} x={x} y={y} width={s} height={s} fill="#fdf0d5" opacity={0.55} />
        ))}
      </svg>

      {/* Clock — generic */}
      <div style={{
        textAlign: 'center', marginTop: 28,
        fontFamily: "'VT323', monospace", fontSize: 64, color: '#fdf0d5',
        letterSpacing: '0.02em', lineHeight: 1,
      }}>9:30</div>
      <div style={{
        textAlign: 'center', marginTop: 2,
        fontFamily: "'VT323', monospace", fontSize: 16, color: 'rgba(253,240,213,0.6)',
        letterSpacing: '0.1em',
      }}>FRI · MAY 29</div>

      {/* Icon grid (4 icons, ours is bottom-left of 2nd row) */}
      <div style={{
        position: 'absolute', bottom: 60, left: 0, right: 0,
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 8, padding: '0 16px',
      }}>
        {/* Row of decoy icons */}
        {[
          { bg: '#3478f6', dot: '#fff' },
          { bg: '#34c759', dot: '#fff' },
          { bg: '#ff9500', dot: '#fff' },
          { bg: '#af52de', dot: '#fff' },
        ].map((d, i) => (
          <div key={i} style={{
            width: 56, height: 56, borderRadius: 14,
            background: d.bg, opacity: 0.6,
          }}/>
        ))}
        {/* Our icon — full opacity, prominent */}
        <div style={{
          width: 56, height: 56, borderRadius: 14, overflow: 'hidden',
          background: '#0b0b16',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
          boxShadow: '0 6px 18px rgba(244,162,97,0.35)',
        }}>
          <LanternArt scale={0.28} withHalo />
        </div>
        {/* More decoys */}
        {[
          { bg: '#ff3b30' },
          { bg: '#5ac8fa' },
          { bg: '#ffcc00' },
        ].map((d, i) => (
          <div key={i} style={{
            width: 56, height: 56, borderRadius: 14,
            background: d.bg, opacity: 0.6,
          }}/>
        ))}
      </div>

      {/* Label under our icon */}
      <div style={{
        position: 'absolute', bottom: 38, left: 16,
        width: 56, textAlign: 'center',
        fontFamily: "'VT323', monospace", fontSize: 13, color: '#fdf0d5',
      }}>pixel stories</div>
    </div>
  );
}

Object.assign(window, { LanternArt, FinalIconHero, FinalIconAdaptive, FinalIconSmall, FinalIconOnHome });
