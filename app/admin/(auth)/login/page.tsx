'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

/** Login page — full-screen dark green, centered card, gold CTA. */
export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.ok) {
      router.push('/admin');
    } else {
      setError('Incorrect username or password.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1A2E18',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background ornament */}
      <svg
        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0.04, pointerEvents: 'none' }}
        viewBox="0 0 400 400" width="600" height="600"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="200" cy="200" r="180" fill="none" stroke="#C49A3C" strokeWidth="1" />
        <circle cx="200" cy="200" r="140" fill="none" stroke="#C49A3C" strokeWidth="0.8" />
        <circle cx="200" cy="200" r="100" fill="none" stroke="#C49A3C" strokeWidth="0.8" />
        {Array.from({ length: 16 }).map((_, i) => {
          const a = (i * Math.PI * 2) / 16;
          return (
            <line key={i}
              x1={200 + Math.cos(a) * 60} y1={200 + Math.sin(a) * 60}
              x2={200 + Math.cos(a) * 190} y2={200 + Math.sin(a) * 190}
              stroke="#C49A3C" strokeWidth="0.5"
            />
          );
        })}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI * 2) / 8;
          const x = 200 + Math.cos(a) * 170;
          const y = 200 + Math.sin(a) * 170;
          return <polygon key={i} points={`${x},${y - 8} ${x + 6},${y} ${x},${y + 8} ${x - 6},${y}`} fill="#C49A3C" />;
        })}
      </svg>

      {/* Card */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '48px 44px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ fontFamily: 'Playfair Display, Georgia, serif', fontWeight: 400, fontSize: '1.1rem', color: '#1A1A14' }}>
            Hye<span style={{ color: '#3D7A35', fontStyle: 'italic' }}>land</span>
          </div>
          <div style={{ marginTop: '8px', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9B9B82' }}>
            Admin Panel
          </div>
          <div style={{ margin: '20px auto 0', width: '40px', height: '1px', background: '#E8E4DC' }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6B58', marginBottom: '6px' }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              autoComplete="username"
              style={{
                width: '100%',
                padding: '11px 14px',
                fontSize: '0.9rem',
                border: '1px solid #D8D4C8',
                borderRadius: '8px',
                outline: 'none',
                fontFamily: 'Lato, sans-serif',
                color: '#1A1A14',
                transition: 'border-color 0.15s',
              }}
              onFocus={(e) => { e.target.style.borderColor = '#C49A3C'; e.target.style.boxShadow = '0 0 0 3px rgba(196,154,60,0.12)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#D8D4C8'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6B58', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{
                width: '100%',
                padding: '11px 14px',
                fontSize: '0.9rem',
                border: '1px solid #D8D4C8',
                borderRadius: '8px',
                outline: 'none',
                fontFamily: 'Lato, sans-serif',
                color: '#1A1A14',
                transition: 'border-color 0.15s',
              }}
              onFocus={(e) => { e.target.style.borderColor = '#C49A3C'; e.target.style.boxShadow = '0 0 0 3px rgba(196,154,60,0.12)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#D8D4C8'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {error && (
            <div style={{ padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '8px', fontSize: '0.82rem', color: '#DC2626' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px',
              padding: '13px',
              background: loading ? '#A07830' : '#C49A3C',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              fontFamily: 'Lato, sans-serif',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {loading && (
              <span style={{
                width: '14px', height: '14px',
                border: '2px solid rgba(255,255,255,0.4)',
                borderTopColor: 'white',
                borderRadius: '50%',
                display: 'inline-block',
                animation: 'spin 0.7s linear infinite',
              }} />
            )}
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
