'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: '▤' },
  { label: 'Navigation', href: '/admin/navigation', icon: '≡' },
  { label: 'Local Page', href: '/admin/local', icon: '◉' },
  { label: 'Diaspora Page', href: '/admin/diaspora', icon: '◎' },
  { label: 'Farmer Profile', href: '/admin/farmer', icon: '◌' },
  { label: 'Available Plots', href: '/admin/plots', icon: '▦' },
  { label: 'FAQ', href: '/admin/faq', icon: '?' },
  { label: 'Settings', href: '/admin/settings', icon: '⚙' },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  return (
    <aside
      style={{
        width: '240px',
        minHeight: '100vh',
        background: '#111210',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 40,
      }}
    >
      {/* Logo */}
      <div style={{
        padding: '24px 20px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 400, fontSize: '0.95rem', color: 'white', lineHeight: 1.3 }}>
          Own a Piece of{' '}
          <span style={{ color: '#C49A3C', fontStyle: 'italic' }}>Armenia</span>
        </div>
        <div style={{ marginTop: '4px', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
          Admin Panel
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 20px',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontFamily: 'Lato, sans-serif',
                fontWeight: active ? 700 : 400,
                color: active ? 'white' : 'rgba(255,255,255,0.5)',
                background: active ? 'rgba(196,154,60,0.1)' : 'transparent',
                borderLeft: active ? '2px solid #C49A3C' : '2px solid transparent',
                transition: 'color 0.15s ease, background 0.15s ease',
              }}
            >
              <span style={{ fontSize: '0.8rem', opacity: 0.7, width: '16px', textAlign: 'center' }}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 0',
            fontSize: '0.8rem',
            fontFamily: 'Lato, sans-serif',
            color: 'rgba(255,255,255,0.35)',
            textAlign: 'left',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
        >
          ↪ Sign out
        </button>
        <div style={{ marginTop: '10px', fontSize: '0.65rem', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.06em' }}>
          Own a Piece of Armenia · Admin
        </div>
      </div>
    </aside>
  );
}
