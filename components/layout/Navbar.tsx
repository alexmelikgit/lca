'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { NavContent } from '@/types/content';

interface NavbarProps {
  content: NavContent;
  page?: 'local' | 'diaspora';
}

export default function Navbar({ content, page = 'local' }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = page === 'diaspora' ? content.diasporaLinks : content.localLinks;
  const ctaText = page === 'diaspora' ? content.diasporaCta : content.localCta;
  const switchHref = page === 'diaspora' ? '/' : '/diaspora';
  const switchText = page === 'diaspora' ? content.localLinkText : content.diasporaLinkText;

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      background: scrolled ? 'rgba(251,248,242,0.88)' : 'rgba(251,248,242,0.72)',
      borderBottom: '1px solid rgba(168,212,160,0.25)',
      boxShadow: scrolled ? '0 2px 20px rgba(45,90,39,0.08)' : 'none',
      transition: 'box-shadow 0.3s ease, background 0.3s ease',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px',
      }}>
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <span style={{
            fontFamily: 'var(--font-playfair)',
            fontWeight: 400,
            fontSize: '1rem',
            color: 'var(--ink)',
            letterSpacing: '0.01em',
          }}>
            {content.logoMain}
            <span style={{ color: 'var(--green)', fontStyle: 'italic' }}>{content.logoHighlight}</span>
          </span>
        </Link>

        <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {links.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className="nav-link"
              style={{
                fontFamily: 'var(--font-lato)',
                fontWeight: 400,
                fontSize: '0.875rem',
                color: 'var(--ink2)',
                textDecoration: 'none',
                letterSpacing: '0.02em',
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
          <Link
            href={switchHref}
            style={{
              fontFamily: 'var(--font-lato)',
              fontWeight: 400,
              fontSize: '0.8rem',
              color: 'var(--ink3)',
              textDecoration: 'none',
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
            }}
          >
            {switchText} →
          </Link>

          <a
            href="#join"
            className="btn-nav"
            style={{
              fontFamily: 'var(--font-lato)',
              fontWeight: 700,
              fontSize: '0.78rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'white',
              background: 'var(--green-deep)',
              padding: '9px 20px',
              borderRadius: '100px',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              display: 'inline-block',
            }}
          >
            {ctaText}
          </a>
        </div>
      </div>
    </header>
  );
}
