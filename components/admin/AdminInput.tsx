'use client';

/** Labeled text input for admin forms. */

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helper?: string;
  error?: string;
}

export default function AdminInput({ label, helper, error, id, className = '', ...props }: AdminInputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label
        htmlFor={inputId}
        style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B6B58' }}
      >
        {label}
      </label>
      <input
        id={inputId}
        style={{
          width: '100%',
          padding: '9px 12px',
          fontSize: '0.9rem',
          color: '#1A1A14',
          background: 'white',
          border: `1px solid ${error ? '#DC2626' : '#D8D4C8'}`,
          borderRadius: '8px',
          outline: 'none',
          fontFamily: 'Lato, sans-serif',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        }}
        onFocus={(e) => { e.target.style.borderColor = '#C49A3C'; e.target.style.boxShadow = '0 0 0 3px rgba(196,154,60,0.12)'; }}
        onBlur={(e) => { e.target.style.borderColor = error ? '#DC2626' : '#D8D4C8'; e.target.style.boxShadow = 'none'; }}
        {...props}
      />
      {helper && !error && <span style={{ fontSize: '0.75rem', color: '#9B9B82' }}>{helper}</span>}
      {error && <span style={{ fontSize: '0.75rem', color: '#DC2626' }}>{error}</span>}
    </div>
  );
}
