'use client';

/**
 * VegetableIllustration — inline SVG illustrations for five vegetables
 * used across Problem, Health, and other sections. Each illustration is a
 * stylized, flat-design graphic in the platform's green/gold palette.
 * All paths are inline — no external image files.
 */

export type VegetableType = 'tomato' | 'cucumber' | 'carrot' | 'greens' | 'potato';

interface VegetableIllustrationProps {
  type: VegetableType;
  size?: number;
  className?: string;
}

/* ─── Individual SVG drawings ────────────────────────────────── */

function Tomato({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      {/* Main body */}
      <circle cx="40" cy="46" r="26" fill="var(--green-mid)" opacity="0.15" />
      <circle cx="40" cy="46" r="22" fill="#D44028" />
      <circle cx="40" cy="46" r="22" fill="url(#tomatoShine)" />
      {/* Shine */}
      <defs>
        <radialGradient id="tomatoShine" cx="38%" cy="35%" r="55%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      {/* Rib lines */}
      <path d="M 40,24 Q 32,46 40,68" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" fill="none" />
      <path d="M 40,24 Q 48,46 40,68" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" fill="none" />
      {/* Calyx / leaves */}
      <path d="M 33,25 Q 36,18 40,20 Q 44,18 47,25" fill="var(--green-deep)" />
      <path d="M 36,22 Q 30,14 34,12 Q 38,10 38,20" fill="var(--green)" />
      <path d="M 44,22 Q 50,14 46,12 Q 42,10 42,20" fill="var(--green)" />
      {/* Stem */}
      <line x1="40" y1="20" x2="40" y2="13" stroke="var(--green-deep)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function Cucumber({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="cucShine" cx="35%" cy="30%" r="60%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      {/* Shadow */}
      <ellipse cx="42" cy="68" rx="16" ry="5" fill="var(--green-deep)" opacity="0.1" />
      {/* Body — rotated slightly */}
      <g transform="rotate(-20, 40, 40)">
        <rect x="24" y="15" width="26" height="52" rx="13" fill="var(--green)" />
        <rect x="24" y="15" width="26" height="52" rx="13" fill="url(#cucShine)" />
        {/* Stripe texture */}
        {[0, 8, 16, 24, 32].map((y) => (
          <line
            key={y}
            x1="24" y1={22 + y} x2="50" y2={22 + y}
            stroke="var(--green-deep)"
            strokeWidth="0.8"
            opacity="0.2"
          />
        ))}
        {/* Bumps */}
        {[[30, 25], [44, 32], [28, 40], [46, 48], [32, 55]].map(([bx, by], i) => (
          <circle key={i} cx={bx} cy={by} r="2.5" fill="var(--green-mid)" opacity="0.6" />
        ))}
        {/* Tip */}
        <ellipse cx="37" cy="15" rx="7" ry="4" fill="var(--green-mid)" />
        {/* Flower end */}
        <ellipse cx="37" cy="67" rx="6" ry="3" fill="var(--gold)" opacity="0.6" />
      </g>
      {/* Vine tendril */}
      <path d="M 55,20 Q 65,15 62,8 Q 59,3 55,8" fill="none" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function Carrot({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="carrotGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#E8701A" />
          <stop offset="50%" stopColor="#F08030" />
          <stop offset="100%" stopColor="#D05A10" />
        </linearGradient>
      </defs>
      {/* Shadow */}
      <ellipse cx="40" cy="73" rx="12" ry="4" fill="var(--green-deep)" opacity="0.1" />
      {/* Body */}
      <path
        d="M 30,18 Q 28,50 38,72 Q 40,75 42,72 Q 52,50 50,18 Z"
        fill="url(#carrotGrad)"
      />
      {/* Ring texture */}
      {[28, 36, 44, 52, 60].map((y) => (
        <path
          key={y}
          d={`M ${32 + (y - 28) * 0.3},${y} Q 40,${y - 2} ${48 - (y - 28) * 0.3},${y}`}
          fill="none"
          stroke="rgba(0,0,0,0.12)"
          strokeWidth="1"
        />
      ))}
      {/* Greens / tops */}
      <path d="M 40,18 Q 30,8 24,4 Q 28,8 34,14" fill="var(--green)" />
      <path d="M 40,18 Q 40,6 36,2 Q 38,8 40,14" fill="var(--green-deep)" />
      <path d="M 40,18 Q 50,8 56,4 Q 52,8 46,14" fill="var(--green)" />
      <path d="M 40,18 Q 44,4 48,2 Q 44,8 40,14" fill="var(--green-mid)" />
    </svg>
  );
}

function Greens({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      {/* Bundle of greens / herbs */}
      {/* Back leaves */}
      <path d="M 40,65 Q 20,50 18,30 Q 16,15 28,12 Q 36,10 40,25 Q 44,10 52,12 Q 64,15 62,30 Q 60,50 40,65 Z"
        fill="var(--green-pale)" stroke="var(--green-mid)" strokeWidth="0.5" />
      {/* Mid leaves */}
      <path d="M 40,65 Q 22,48 22,34 Q 22,20 32,18 Q 38,16 40,30 Q 42,16 48,18 Q 58,20 58,34 Q 58,48 40,65 Z"
        fill="var(--green-light)" />
      {/* Front leaf */}
      <path d="M 40,65 Q 28,50 30,36 Q 32,24 40,22 Q 48,24 50,36 Q 52,50 40,65 Z"
        fill="var(--green)" />
      {/* Center vein */}
      <path d="M 40,65 Q 40,45 40,22" fill="none" stroke="var(--green-deep)" strokeWidth="1" opacity="0.4" />
      {/* Side veins */}
      <path d="M 40,40 Q 34,35 30,36" fill="none" stroke="var(--green-deep)" strokeWidth="0.7" opacity="0.3" />
      <path d="M 40,40 Q 46,35 50,36" fill="none" stroke="var(--green-deep)" strokeWidth="0.7" opacity="0.3" />
      {/* Tie / binding at bottom */}
      <rect x="35" y="62" width="10" height="6" rx="3" fill="var(--gold)" opacity="0.6" />
    </svg>
  );
}

function Potato({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="potatoGrad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#D4A84B" />
          <stop offset="100%" stopColor="#A07830" />
        </radialGradient>
      </defs>
      {/* Shadow */}
      <ellipse cx="40" cy="68" rx="20" ry="6" fill="var(--green-deep)" opacity="0.1" />
      {/* Body — organic lumpy shape */}
      <path
        d="M 18,44 Q 14,34 20,26 Q 26,18 36,16 Q 46,14 54,20 Q 64,26 64,38 Q 66,52 56,60 Q 46,68 34,64 Q 20,60 18,44 Z"
        fill="url(#potatoGrad)"
      />
      {/* Surface texture dots */}
      {[[32, 28], [50, 32], [40, 48], [26, 42], [54, 50], [44, 26]].map(([px, py], i) => (
        <circle key={i} cx={px} cy={py} r="2.5" fill="rgba(100,60,20,0.2)" />
      ))}
      {/* Sprout eyes */}
      <circle cx="36" cy="24" r="3" fill="var(--green)" />
      <path d="M 36,21 Q 32,16 34,12" fill="none" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 36,21 Q 40,16 38,12" fill="none" stroke="var(--green-mid)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Public component ───────────────────────────────────────── */

const illustrations: Record<VegetableType, (size: number) => JSX.Element> = {
  tomato: (s) => <Tomato size={s} />,
  cucumber: (s) => <Cucumber size={s} />,
  carrot: (s) => <Carrot size={s} />,
  greens: (s) => <Greens size={s} />,
  potato: (s) => <Potato size={s} />,
};

export default function VegetableIllustration({
  type,
  size = 80,
  className = '',
}: VegetableIllustrationProps) {
  return (
    <div className={className} style={{ display: 'inline-flex' }}>
      {illustrations[type](size)}
    </div>
  );
}
