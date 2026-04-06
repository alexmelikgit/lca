'use client';

/**
 * ArmenianDivider — decorative SVG ornament used between every major section.
 * Central 8-pointed star medallion flanked by vine-wave lines with diamond
 * accents. Color adapts via the `variant` prop: green on light backgrounds,
 * gold on dark backgrounds.
 */

interface ArmenianDividerProps {
  variant?: 'green' | 'gold' | 'ink';
  className?: string;
}

export default function ArmenianDivider({
  variant = 'green',
  className = '',
}: ArmenianDividerProps) {
  const color = variant === 'gold' ? 'var(--gold)' : variant === 'ink' ? 'var(--ink2)' : 'var(--green-mid)';
  const opacity = variant === 'gold' ? 0.75 : variant === 'ink' ? 0.35 : 0.55;

  return (
    <div
      className={className}
      style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 480 32"
        width="480"
        height="32"
        xmlns="http://www.w3.org/2000/svg"
        style={{ maxWidth: '100%', opacity }}
      >
        {/* Left line to edge */}
        <line x1="0" y1="16" x2="155" y2="16" stroke={color} strokeWidth="0.75" />

        {/* Left diamonds */}
        {[30, 65, 100, 135].map((x) => (
          <polygon
            key={x}
            points={`${x},16 ${x + 5},11 ${x + 10},16 ${x + 5},21`}
            fill={color}
            opacity="0.7"
          />
        ))}

        {/* Left wave vine */}
        <path
          d="M 155,16 Q 165,10 175,16 Q 185,22 195,16 Q 205,10 215,16"
          fill="none"
          stroke={color}
          strokeWidth="1"
        />

        {/* Central medallion */}
        <g transform="translate(240, 16)">
          {/* Outer ring */}
          <circle r="13" fill="none" stroke={color} strokeWidth="1" />
          {/* Inner circle fill */}
          <circle r="4" fill={color} />
          {/* 8-pointed star rays */}
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * Math.PI) / 4;
            return (
              <line
                key={i}
                x1={Math.cos(a) * 4.5}
                y1={Math.sin(a) * 4.5}
                x2={Math.cos(a) * 12}
                y2={Math.sin(a) * 12}
                stroke={color}
                strokeWidth="1.2"
              />
            );
          })}
          {/* Cardinal tick marks */}
          {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4].map((a, i) => (
            <line
              key={i}
              x1={Math.cos(a) * 13}
              y1={Math.sin(a) * 13}
              x2={Math.cos(a) * 15}
              y2={Math.sin(a) * 15}
              stroke={color}
              strokeWidth="1"
            />
          ))}
        </g>

        {/* Right wave vine */}
        <path
          d="M 265,16 Q 275,10 285,16 Q 295,22 305,16 Q 315,10 325,16"
          fill="none"
          stroke={color}
          strokeWidth="1"
        />

        {/* Right diamonds */}
        {[335, 370, 405, 440].map((x) => (
          <polygon
            key={x}
            points={`${x},16 ${x + 5},11 ${x + 10},16 ${x + 5},21`}
            fill={color}
            opacity="0.7"
          />
        ))}

        {/* Right line to edge */}
        <line x1="325" y1="16" x2="480" y2="16" stroke={color} strokeWidth="0.75" />
      </svg>
    </div>
  );
}
