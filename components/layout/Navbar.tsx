'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { NavContent } from '@/types/content';
import type { Locale } from '@/lib/i18n';
import LocaleSwitcher from '@/components/ui/LocaleSwitcher';

interface NavbarProps {
  content: NavContent;
  page?: 'local' | 'diaspora';
  locale: Locale;
  diasporaEnabled?: boolean;
}

export default function Navbar({ content, page = 'local', locale, diasporaEnabled = true }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const links = page === 'diaspora' ? content.diasporaLinks : content.localLinks;
  const ctaText = page === 'diaspora' ? content.diasporaCta : content.localCta;
  const ctaHref = (page === 'diaspora' ? content.diasporaCtaHref : content.localCtaHref) || '#join';
  const switchHref = page === 'diaspora' ? `/${locale}` : `/${locale}/diaspora`;
  const switchText = page === 'diaspora' ? content.localLinkText : content.diasporaLinkText;

  return (
    <>
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        background: scrolled || open ? 'rgba(251,248,242,0.97)' : 'rgba(251,248,242,0.72)',
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
          {/* Logo */}
          <Link href={`/${locale}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
            <img src="/images/hyeland-logo.svg" alt="Hyeland" style={{ height: '56px', width: 'auto', display: 'block' }} />
          </Link>

          {/* Desktop nav */}
          <nav className="desktop-nav" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            {links.map((link) => (
              <a key={link.id} href={link.href} className="nav-link" style={{
                fontFamily: 'var(--font-lato)',
                fontWeight: 400,
                fontSize: '0.875rem',
                color: 'var(--ink2)',
                textDecoration: 'none',
                letterSpacing: '0.02em',
              }}>
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop right */}
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
            <LocaleSwitcher currentLocale={locale} />
            {diasporaEnabled && (
              <Link href={switchHref} style={{
                fontFamily: 'var(--font-lato)',
                fontWeight: 400,
                fontSize: '0.8rem',
                color: 'var(--ink3)',
                textDecoration: 'none',
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
              }}>
                {switchText} →
              </Link>
            )}
            <a href={ctaHref} className="btn-nav" style={{
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
            }}>
              {ctaText}
            </a>
          </div>

          {/* Mobile right — locale + switch link + hamburger */}
          <div className="mobile-right" style={{
            display: 'none',
            alignItems: 'center',
            gap: '16px',
            flexShrink: 0,
          }}>
            <LocaleSwitcher currentLocale={locale} />
            {diasporaEnabled && (
              <Link href={switchHref} style={{
                fontFamily: 'var(--font-lato)',
                fontWeight: 400,
                fontSize: '0.75rem',
                color: 'var(--ink3)',
                textDecoration: 'none',
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
              }}>
                {switchText} →
              </Link>
            )}
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                marginRight: '-8px',
                flexShrink: 0,
                zIndex: 110,
              }}
            >
              <div style={{ width: '22px', height: '16px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <span style={{
                  display: 'block',
                  height: '1.5px',
                  background: 'var(--ink)',
                  borderRadius: '2px',
                  transformOrigin: 'center',
                  transition: 'transform 0.3s ease, opacity 0.3s ease',
                  transform: open ? 'translateY(7.25px) rotate(45deg)' : 'none',
                }} />
                <span style={{
                  display: 'block',
                  height: '1.5px',
                  background: 'var(--ink)',
                  borderRadius: '2px',
                  transition: 'opacity 0.2s ease',
                  opacity: open ? 0 : 1,
                }} />
                <span style={{
                  display: 'block',
                  height: '1.5px',
                  background: 'var(--ink)',
                  borderRadius: '2px',
                  transformOrigin: 'center',
                  transition: 'transform 0.3s ease, opacity 0.3s ease',
                  transform: open ? 'translateY(-7.25px) rotate(-45deg)' : 'none',
                }} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99,
              background: 'var(--cream)',
              display: 'flex',
              flexDirection: 'column',
              paddingTop: '64px',
            }}
          >
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '40px 32px 60px',
              gap: '0',
            }}>
              {/* Nav links */}
              {links.map((link, i) => (
                <motion.a
                  key={link.id}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: 0.05 + i * 0.06 }}
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    fontWeight: 300,
                    fontSize: 'clamp(2rem, 8vw, 2.8rem)',
                    lineHeight: 1.2,
                    color: 'var(--ink)',
                    textDecoration: 'none',
                    display: 'block',
                    padding: '14px 0',
                    borderBottom: '1px solid rgba(26,26,20,0.07)',
                  }}
                >
                  {link.label}
                </motion.a>
              ))}

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: 0.05 + links.length * 0.06 }}
                style={{ marginTop: '40px' }}
              >
                <a
                  href={ctaHref}
                  onClick={() => setOpen(false)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: 'var(--font-lato)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'white',
                    background: 'var(--green-deep)',
                    padding: '14px 32px',
                    borderRadius: '100px',
                    textDecoration: 'none',
                  }}
                >
                  {ctaText} →
                </a>
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-right { display: flex !important; }
        }
      `}</style>
    </>
  );
}
