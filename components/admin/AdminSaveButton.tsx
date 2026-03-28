'use client';

import { useState, useEffect } from 'react';

interface AdminSaveButtonProps {
  onClick: () => Promise<void>;
  disabled?: boolean;
  label?: string;
}

/** Save button with loading spinner and a 2-second "Saved ✓" confirmation. */
export default function AdminSaveButton({ onClick, disabled, label = 'Save changes' }: AdminSaveButtonProps) {
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    if (state === 'saved' || state === 'error') {
      const t = setTimeout(() => setState('idle'), 2500);
      return () => clearTimeout(t);
    }
  }, [state]);

  const handleClick = async () => {
    setState('saving');
    try {
      await onClick();
      setState('saved');
    } catch {
      setState('error');
    }
  };

  const labels = { idle: label, saving: 'Saving…', saved: 'Saved ✓', error: 'Error — try again' };
  const colors = { idle: '#C49A3C', saving: '#A07830', saved: '#2D5A27', error: '#DC2626' };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || state === 'saving'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 24px',
        background: colors[state],
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '0.85rem',
        fontWeight: 700,
        fontFamily: 'Lato, sans-serif',
        letterSpacing: '0.04em',
        cursor: disabled || state === 'saving' ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'background 0.2s ease, transform 0.1s ease',
        userSelect: 'none',
      }}
    >
      {state === 'saving' && (
        <span style={{
          width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.4)',
          borderTopColor: 'white', borderRadius: '50%',
          display: 'inline-block',
          animation: 'spin 0.7s linear infinite',
        }} />
      )}
      {labels[state]}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}
