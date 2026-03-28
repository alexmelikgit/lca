/** White admin card with optional title and subtitle. */

interface AdminCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function AdminCard({ title, subtitle, children, className = '', style }: AdminCardProps) {
  return (
    <div
      className={className}
      style={{
        background: 'white',
        borderRadius: '12px',
        border: '1px solid #E8E4DC',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        overflow: 'hidden',
        ...style,
      }}
    >
      {(title || subtitle) && (
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F0EDE6' }}>
          {title && (
            <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#1A1A14', fontFamily: 'Lato, sans-serif' }}>
              {title}
            </h2>
          )}
          {subtitle && (
            <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#9B9B82', fontFamily: 'Lato, sans-serif' }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  );
}
