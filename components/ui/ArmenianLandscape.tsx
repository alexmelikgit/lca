'use client';

/**
 * ArmenianLandscape — self-contained SVG illustration depicting the
 * Armenian agricultural landscape: Mount Ararat in the distance,
 * perspective crop field rows, tree clusters, foreground plants,
 * a plot boundary with gold corner markers, and an Armenian ornament
 * diamond band across the top. All paths are inline — no external assets.
 */

interface ArmenianLandscapeProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export default function ArmenianLandscape({
  className = '',
  width = '100%',
  height = '100%',
}: ArmenianLandscapeProps) {
  return (
    <svg
      viewBox="0 0 720 520"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={width}
      height={height}
      aria-label="Armenian agricultural landscape with Mount Ararat and crop fields"
      role="img"
    >
      <defs>
        {/* Sky gradient */}
        <linearGradient id="alSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B8CEDC" />
          <stop offset="60%" stopColor="#D8E8E0" />
          <stop offset="100%" stopColor="#E8EFE4" />
        </linearGradient>

        {/* Far mountain gradient */}
        <linearGradient id="alMtFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8EA8B8" />
          <stop offset="100%" stopColor="#A8C0B0" />
        </linearGradient>

        {/* Mid hills gradient */}
        <linearGradient id="alHills" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5E8E50" />
          <stop offset="100%" stopColor="#4A7840" />
        </linearGradient>

        {/* Field strip gradients — alternating */}
        <linearGradient id="alFieldA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6BA85A" />
          <stop offset="100%" stopColor="#5A9448" />
        </linearGradient>
        <linearGradient id="alFieldB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4E8040" />
          <stop offset="100%" stopColor="#3D6E32" />
        </linearGradient>

        {/* Foreground soil */}
        <linearGradient id="alSoil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9A7850" />
          <stop offset="100%" stopColor="#7A5C38" />
        </linearGradient>

        {/* Tree crown gradient */}
        <radialGradient id="alTreeCrown" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#5EA84A" />
          <stop offset="100%" stopColor="#3A7030" />
        </radialGradient>

        {/* Plot boundary glow */}
        <filter id="alGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Soft vignette overlay */}
        <radialGradient id="alVignette" cx="50%" cy="50%" r="70%">
          <stop offset="60%" stopColor="transparent" />
          <stop offset="100%" stopColor="rgba(45,90,39,0.15)" />
        </radialGradient>
      </defs>

      {/* ── Layer 1: Sky ───────────────────────────────── */}
      <rect width="720" height="520" fill="url(#alSky)" />

      {/* Soft horizon haze */}
      <ellipse cx="360" cy="295" rx="380" ry="60" fill="rgba(220,235,220,0.45)" />

      {/* ── Layer 2: Distant Mountains (Ararat) ─────────── */}
      {/* Big Ararat — left/center peak */}
      <path
        d="M 50,310 L 100,280 L 150,295 L 200,260 L 250,230 L 290,200 L 330,215 L 360,295 L 50,295 Z"
        fill="url(#alMtFar)"
        opacity="0.55"
      />
      {/* Ararat snow cap */}
      <path
        d="M 290,200 L 310,218 L 305,225 L 290,215 L 272,225 L 268,218 Z"
        fill="white"
        opacity="0.82"
      />
      {/* Small Ararat — right of big */}
      <path
        d="M 310,295 L 340,265 L 365,250 L 390,255 L 420,275 L 450,295 Z"
        fill="url(#alMtFar)"
        opacity="0.48"
      />
      {/* Small peak snow */}
      <path
        d="M 365,250 L 375,262 L 365,258 L 355,262 Z"
        fill="white"
        opacity="0.75"
      />
      {/* Eastern ridge */}
      <path
        d="M 420,295 L 470,268 L 520,278 L 570,262 L 620,278 L 670,265 L 720,275 L 720,295 Z"
        fill="url(#alMtFar)"
        opacity="0.38"
      />

      {/* ── Layer 3: Middle Ground Hills ─────────────────── */}
      <path
        d="M 0,305 Q 80,278 160,290 Q 240,302 310,285 Q 370,272 430,285 Q 500,298 580,280 Q 650,265 720,278 L 720,315 L 0,315 Z"
        fill="url(#alHills)"
        opacity="0.85"
      />

      {/* ── Layer 4: Field Rows (perspective from VP 360,300) ── */}
      {/* Horizon baseline */}
      <rect x="0" y="300" width="720" height="8" fill="#6BA85A" opacity="0.6" />

      {/* Field strips: alternating, converging from VP (360,300) to bottom */}
      {/* Strip A — y 300→328, narrow at top */}
      <polygon
        points="360,300 360,300 322,328 398,328"
        fill="url(#alFieldA)"
      />
      {/* Strip B */}
      <polygon
        points="322,328 398,328 278,362 442,362"
        fill="url(#alFieldB)"
      />
      {/* Strip C */}
      <polygon
        points="278,362 442,362 218,402 502,402"
        fill="url(#alFieldA)"
      />
      {/* Strip D */}
      <polygon
        points="218,402 502,402 148,448 572,448"
        fill="url(#alFieldB)"
      />
      {/* Strip E */}
      <polygon
        points="148,448 572,448 60,502 660,502"
        fill="url(#alFieldA)"
      />
      {/* Strip F — bottom full width */}
      <polygon
        points="60,502 660,502 0,520 720,520"
        fill="url(#alFieldB)"
      />

      {/* Perspective radial lines (subtle crop row markers) */}
      {[
        [360, 300, 0, 520],
        [360, 300, 160, 520],
        [360, 300, 280, 520],
        [360, 300, 440, 520],
        [360, 300, 560, 520],
        [360, 300, 720, 520],
      ].map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="rgba(45,90,39,0.18)"
          strokeWidth="0.8"
        />
      ))}

      {/* Horizontal row texture lines */}
      {[336, 350, 365, 383, 405, 432, 466, 508].map((y, i) => {
        const d = y - 300;
        const halfW = d * 1.42;
        const x1 = Math.max(0, 360 - halfW);
        const x2 = Math.min(720, 360 + halfW);
        return (
          <line
            key={i}
            x1={x1} y1={y} x2={x2} y2={y}
            stroke="rgba(30,70,22,0.12)"
            strokeWidth="0.7"
          />
        );
      })}

      {/* ── Layer 5: Tree Clusters ───────────────────────── */}
      {/* Left cluster */}
      {/* Tree L1 */}
      <rect x="62" y="332" width="6" height="24" fill="#6B4A28" />
      <ellipse cx="65" cy="316" rx="22" ry="26" fill="url(#alTreeCrown)" opacity="0.92" />
      <ellipse cx="65" cy="316" rx="22" ry="26" fill="rgba(90,160,72,0.3)" />
      {/* Tree L2 */}
      <rect x="102" y="328" width="5" height="22" fill="#6B4A28" />
      <ellipse cx="105" cy="313" rx="20" ry="23" fill="url(#alTreeCrown)" opacity="0.88" />
      {/* Tree L3 — slightly behind */}
      <rect x="82" y="335" width="4" height="18" fill="#5A3E22" opacity="0.7" />
      <ellipse cx="84" cy="322" rx="17" ry="19" fill="#4A8040" opacity="0.65" />
      {/* Tree L4 — foreground left */}
      <rect x="32" y="342" width="7" height="28" fill="#6B4A28" />
      <ellipse cx="35" cy="322" rx="24" ry="28" fill="url(#alTreeCrown)" opacity="0.95" />

      {/* Right cluster */}
      {/* Tree R1 */}
      <rect x="615" y="330" width="6" height="26" fill="#6B4A28" />
      <ellipse cx="618" cy="313" rx="23" ry="27" fill="url(#alTreeCrown)" opacity="0.92" />
      {/* Tree R2 */}
      <rect x="652" y="334" width="5" height="22" fill="#6B4A28" />
      <ellipse cx="655" cy="319" rx="19" ry="22" fill="url(#alTreeCrown)" opacity="0.88" />
      {/* Tree R3 — behind */}
      <rect x="635" y="338" width="4" height="18" fill="#5A3E22" opacity="0.7" />
      <ellipse cx="637" cy="325" rx="16" ry="18" fill="#4A8040" opacity="0.65" />
      {/* Tree R4 — foreground right */}
      <rect x="680" y="340" width="7" height="30" fill="#6B4A28" />
      <ellipse cx="683" cy="318" rx="25" ry="30" fill="url(#alTreeCrown)" opacity="0.95" />

      {/* ── Layer 6: Foreground Crop Plants ──────────────── */}
      {/* Soil strip */}
      <rect x="0" y="468" width="720" height="52" fill="url(#alSoil)" opacity="0.7" />

      {/* Tomato plants — center and left-center */}
      {[120, 200, 290, 390, 480, 570].map((x, i) => (
        <g key={i} transform={`translate(${x}, 460)`}>
          {/* Stem */}
          <line x1="0" y1="0" x2="0" y2="52" stroke="#5A7832" strokeWidth="2.5" />
          {/* Side branches */}
          <line x1="0" y1="18" x2="-16" y2="10" stroke="#5A7832" strokeWidth="1.8" />
          <line x1="0" y1="18" x2="16" y2="10" stroke="#5A7832" strokeWidth="1.8" />
          <line x1="0" y1="32" x2="-18" y2="24" stroke="#5A7832" strokeWidth="1.8" />
          <line x1="0" y1="32" x2="18" y2="24" stroke="#5A7832" strokeWidth="1.8" />
          {/* Leaves */}
          <ellipse cx="-16" cy="10" rx="10" ry="6" fill="#4A8030" transform="rotate(-20,-16,10)" />
          <ellipse cx="16" cy="10" rx="10" ry="6" fill="#4A8030" transform="rotate(20,16,10)" />
          <ellipse cx="-18" cy="24" rx="11" ry="6" fill="#3E7028" transform="rotate(-25,-18,24)" />
          <ellipse cx="18" cy="24" rx="11" ry="6" fill="#3E7028" transform="rotate(25,18,24)" />
          {/* Tomato fruits */}
          {i % 2 === 0 && (
            <>
              <circle cx="-14" cy="22" r="6" fill="#D44028" />
              <circle cx="14" cy="22" r="5.5" fill="#C03820" />
              <circle cx="0" cy="40" r="6.5" fill="#E04A30" />
              {/* Calyx */}
              <path d="M -14,16 L -12,20 L -16,20 Z" fill="#3E7028" />
              <path d="M 14,17 L 16,21 L 12,21 Z" fill="#3E7028" />
            </>
          )}
          {i % 2 !== 0 && (
            <>
              <circle cx="12" cy="20" r="5" fill="#C83820" />
              <circle cx="-12" cy="30" r="6" fill="#D44028" />
            </>
          )}
        </g>
      ))}

      {/* ── Layer 7: Plot Boundary ───────────────────────── */}
      {/* Gold dashed plot rectangle */}
      <rect
        x="195"
        y="310"
        width="330"
        height="155"
        fill="rgba(196,154,60,0.06)"
        stroke="#C49A3C"
        strokeWidth="1.8"
        strokeDasharray="8 5"
        filter="url(#alGlow)"
      />
      {/* Corner marker dots */}
      {[
        [195, 310], [525, 310],
        [195, 465], [525, 465],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="5" fill="#C49A3C" />
          <circle cx={cx} cy={cy} r="8" fill="none" stroke="#C49A3C" strokeWidth="1" opacity="0.5" />
        </g>
      ))}
      {/* Plot label */}
      <rect x="324" y="302" width="72" height="16" rx="8" fill="#C49A3C" />
      <text
        x="360"
        y="313.5"
        textAnchor="middle"
        fill="white"
        fontSize="7.5"
        fontFamily="Lato, sans-serif"
        fontWeight="700"
        letterSpacing="0.1em"
      >
        PLOT 7
      </text>

      {/* ── Layer 8: Armenian Ornament Diamond Band ──────── */}
      {/* Background band */}
      <rect x="0" y="0" width="720" height="28" fill="rgba(45,90,39,0.82)" />

      {/* Central medallion */}
      <g transform="translate(360, 14)">
        <circle r="9" fill="none" stroke="#C49A3C" strokeWidth="1.2" />
        {/* 8-pointed star */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * Math.PI) / 4;
          const x1 = Math.cos(angle) * 5;
          const y1 = Math.sin(angle) * 5;
          const x2 = Math.cos(angle) * 9;
          const y2 = Math.sin(angle) * 9;
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#C49A3C"
              strokeWidth="1"
            />
          );
        })}
        <circle r="3.5" fill="#C49A3C" />
      </g>

      {/* Diamond ornaments — left side */}
      {[60, 120, 180, 240, 300].map((x) => (
        <g key={x} transform={`translate(${x}, 14)`}>
          <polygon points="0,-5 4,0 0,5 -4,0" fill="#C49A3C" opacity="0.8" />
        </g>
      ))}
      {/* Diamond ornaments — right side */}
      {[420, 480, 540, 600, 660].map((x) => (
        <g key={x} transform={`translate(${x}, 14)`}>
          <polygon points="0,-5 4,0 0,5 -4,0" fill="#C49A3C" opacity="0.8" />
        </g>
      ))}

      {/* Vine lines left and right of medallion */}
      {/* Left vine */}
      <path
        d="M 350,14 Q 330,10 310,14 Q 290,18 270,14 Q 250,10 230,14"
        fill="none"
        stroke="#C49A3C"
        strokeWidth="1"
        opacity="0.7"
      />
      <path
        d="M 230,14 Q 210,10 190,14 Q 170,18 150,14 Q 130,10 100,14"
        fill="none"
        stroke="#C49A3C"
        strokeWidth="1"
        opacity="0.55"
      />
      <line x1="100" y1="14" x2="0" y2="14" stroke="#C49A3C" strokeWidth="0.8" opacity="0.4" />

      {/* Right vine */}
      <path
        d="M 370,14 Q 390,10 410,14 Q 430,18 450,14 Q 470,10 490,14"
        fill="none"
        stroke="#C49A3C"
        strokeWidth="1"
        opacity="0.7"
      />
      <path
        d="M 490,14 Q 510,10 530,14 Q 550,18 570,14 Q 590,10 620,14"
        fill="none"
        stroke="#C49A3C"
        strokeWidth="1"
        opacity="0.55"
      />
      <line x1="620" y1="14" x2="720" y2="14" stroke="#C49A3C" strokeWidth="0.8" opacity="0.4" />

      {/* ── Vignette overlay ───────────────────────────────── */}
      <rect width="720" height="520" fill="url(#alVignette)" />
    </svg>
  );
}
