'use client';

/**
 * SectionTag — small uppercase label used at the top of each section.
 * Renders a colored dot + label text in Lato 700 uppercase with wide tracking.
 * Optional gold accent line precedes the dot on desktop.
 */

interface SectionTagProps {
  /** The label text (will be rendered uppercase via CSS) */
  children: React.ReactNode;
  /** Dot/text color — defaults to green */
  variant?: 'green' | 'gold' | 'cream';
  className?: string;
}

export default function SectionTag({
  children,
  variant = 'green',
  className = '',
}: SectionTagProps) {
  const colors: Record<string, { dot: string; text: string; line: string }> = {
    green: {
      dot: 'var(--green)',
      text: 'var(--green-deep)',
      line: 'var(--green-light)',
    },
    gold: {
      dot: 'var(--gold)',
      text: 'var(--gold)',
      line: 'var(--gold-light)',
    },
    cream: {
      dot: 'var(--green-light)',
      text: 'rgba(251,248,242,0.8)',
      line: 'rgba(168,212,160,0.4)',
    },
  };

  const c = colors[variant];

  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      style={{ fontFamily: 'Lato, sans-serif' }}
    >
      {/* Short accent line */}
      <span
        style={{
          display: 'block',
          width: '24px',
          height: '1px',
          background: c.line,
          flexShrink: 0,
        }}
      />
      {/* Dot */}
      <span
        style={{
          display: 'block',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: c.dot,
          flexShrink: 0,
        }}
      />
      {/* Label */}
      <span
        className="text-label"
        style={{ color: c.text, letterSpacing: '0.18em' }}
      >
        {children}
      </span>
    </div>
  );
}
