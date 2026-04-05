'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { switchLocale } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

interface LocaleSwitcherProps {
  currentLocale: Locale;
}

export default function LocaleSwitcher({ currentLocale }: LocaleSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  function handleSwitch(newLocale: Locale) {
    if (newLocale === currentLocale) return;
    router.push(switchLocale(pathname, newLocale));
  }

  const activeStyle: React.CSSProperties = {
    fontWeight: 700,
    color: 'var(--ink)',
    borderBottom: '1.5px solid var(--green)',
  };

  const inactiveStyle: React.CSSProperties = {
    fontWeight: 400,
    color: 'var(--ink3)',
    borderBottom: '1.5px solid transparent',
    cursor: 'pointer',
  };

  const baseStyle: React.CSSProperties = {
    fontFamily: 'var(--font-lato)',
    fontSize: '0.78rem',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    background: 'none',
    border: 'none',
    padding: '2px 0',
    lineHeight: 1,
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {(['hy', 'en'] as Locale[]).map((locale, i) => (
        <React.Fragment key={locale}>
          {i > 0 && (
            <span style={{ color: 'var(--ink3)', fontSize: '0.7rem' }}>/</span>
          )}
          <button
            onClick={() => handleSwitch(locale)}
            style={{
              ...baseStyle,
              ...(locale === currentLocale ? activeStyle : inactiveStyle),
            }}
          >
            {locale.toUpperCase()}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}
