'use client';

import { motion } from 'framer-motion';
import SectionTag from '@/components/ui/SectionTag';
import { EASE } from '@/lib/animations';
import type { HeroContent } from '@/types/content';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE, delay },
  }),
};

interface Props {
  content: HeroContent;
}

export default function Hero({ content }: Props) {
  const bodyLines = content.subtitle.split('\n');

  return (
    <section style={{ background: 'var(--cream)', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '64px' }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        width: '100%',
        padding: '72px 40px 96px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
        gap: '48px 72px',
        alignItems: 'center',
      }}>

        {/* ── Left column ── */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp} style={{ marginBottom: '20px' }}>
            <SectionTag variant="green">{content.tag}</SectionTag>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            custom={0.1}
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 400,
              fontSize: 'clamp(1.9rem, 3.2vw, 2.4rem)',
              lineHeight: 1.22,
              color: 'var(--ink)',
              margin: '0 0 10px',
              maxWidth: '320px',
            }}
          >
            {content.h1Line1}<br />
            {content.h1Line2}
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            custom={0.18}
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 300,
              fontStyle: 'italic',
              fontSize: '1.05rem',
              color: 'var(--green)',
              margin: '0 0 28px',
            }}
          >
            {content.h1Italic}
          </motion.p>

          <motion.p
            initial="hidden"
            animate="visible"
            custom={0.26}
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-lato)',
              fontWeight: 300,
              fontSize: '0.9rem',
              lineHeight: 1.85,
              color: 'var(--ink2)',
              margin: '0 0 36px',
              maxWidth: '300px',
            }}
          >
            {bodyLines.map((line, i) => (
              <span key={i}>{line}{i < bodyLines.length - 1 && <br />}</span>
            ))}
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.34}
            variants={fadeUp}
            style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', marginBottom: '48px' }}
          >
            <a
              href={content.primaryCtaHref}
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-lato)',
                fontWeight: 600,
                fontSize: '0.72rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'white',
                background: 'var(--green-deep)',
                padding: '12px 26px',
                borderRadius: '100px',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {content.primaryCtaLabel}
            </a>

            <a
              href={content.secondaryCtaHref}
              style={{
                fontFamily: 'var(--font-lato)',
                fontWeight: 400,
                fontSize: '0.88rem',
                color: 'var(--green)',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              }}
            >
              {content.secondaryCtaLabel}
            </a>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.44}
            variants={fadeUp}
            style={{ display: 'flex', borderTop: '1px solid rgba(0,0,0,0.07)', paddingTop: '24px' }}
          >
            {content.stats.map((stat, i) => (
              <div
                key={stat.label}
                style={{
                  flex: 1,
                  paddingRight: i < content.stats.length - 1 ? '20px' : '0',
                  paddingLeft: i > 0 ? '20px' : '0',
                  borderLeft: i > 0 ? '1px solid rgba(0,0,0,0.08)' : 'none',
                }}
              >
                <span style={{
                  display: 'block',
                  fontFamily: 'var(--font-playfair)',
                  fontWeight: 400,
                  fontSize: '1.15rem',
                  color: 'var(--green-deep)',
                  marginBottom: '2px',
                }}>
                  {stat.value}
                </span>
                <span style={{
                  fontFamily: 'var(--font-lato)',
                  fontWeight: 400,
                  fontSize: '0.58rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--ink3)',
                }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Right column ── */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
          style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', minHeight: '560px' }}
        >
          {/* BG1: soft landscape SVG */}
          <svg
            viewBox="0 0 500 420"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            aria-hidden="true"
          >
            <rect width="500" height="420" fill="#EEF4E8" />
            {/* Far mountains */}
            <polygon points="0,240 80,185 160,210 240,168 320,205 400,172 500,192 500,275 0,275" fill="#C8D8BC" opacity="0.55" />
            {/* Near mountains */}
            <polygon points="0,258 60,222 130,242 210,206 290,235 380,212 500,228 500,305 0,305" fill="#B4C8A4" opacity="0.65" />
            {/* Field ground */}
            <rect x="0" y="292" width="500" height="128" fill="#C4DCAA" opacity="0.75" />
            {/* Field row lines */}
            <g stroke="#A0C080" strokeWidth="0.9" opacity="0.55">
              <line x1="0" y1="308" x2="500" y2="308" />
              <line x1="0" y1="322" x2="500" y2="322" />
              <line x1="0" y1="336" x2="500" y2="336" />
              <line x1="0" y1="350" x2="500" y2="350" />
              <line x1="0" y1="364" x2="500" y2="364" />
              <line x1="0" y1="378" x2="500" y2="378" />
              <line x1="0" y1="392" x2="500" y2="392" />
              <line x1="0" y1="406" x2="500" y2="406" />
            </g>
            {/* Trees left */}
            <ellipse cx="55" cy="278" rx="22" ry="30" fill="#6B9E5A" opacity="0.65" />
            <ellipse cx="72" cy="284" rx="16" ry="22" fill="#5A8A4A" opacity="0.55" />
            {/* Trees right */}
            <ellipse cx="445" cy="275" rx="20" ry="26" fill="#6B9E5A" opacity="0.6" />
            {/* Sun glow */}
            <circle cx="420" cy="65" r="50" fill="#FFF8E8" opacity="0.5" />
            <circle cx="420" cy="65" r="28" fill="#F5E8C0" opacity="0.4" />
            {/* Vignette */}
            <defs>
              <radialGradient id="heroVg" cx="50%" cy="50%" r="75%">
                <stop offset="30%" stopColor="transparent" />
                <stop offset="100%" stopColor="#E8F0E0" stopOpacity="0.55" />
              </radialGradient>
            </defs>
            <rect width="500" height="420" fill="url(#heroVg)" />
            {/* Horizon line */}
            <line x1="0" y1="292" x2="500" y2="292" stroke="#B0C898" strokeWidth="0.8" opacity="0.5" />
          </svg>

          {/* Floating dashboard card */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              width: '300px',
              background: 'white',
              borderRadius: '14px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.13)',
              overflow: 'hidden',
              fontFamily: 'var(--font-lato), sans-serif',
              transform: 'rotate(-1deg)',
            }}>
              {/* Card header */}
              <div style={{ background: '#2D5A27', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '4px' }}>Your plot</div>
                  <div style={{ color: 'white', fontSize: '15px', fontWeight: 600 }}>Plot 7 — Armavir</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '20px', padding: '4px 11px', color: '#A8D4A0', fontSize: '12px', whiteSpace: 'nowrap' }}>Growing 🌱</div>
              </div>
              {/* Growth stage */}
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #F0EBE0' }}>
                <div style={{ color: '#9B9B82', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '7px' }}>Growth stage</div>
                <div style={{ background: '#E8F5E4', borderRadius: '4px', height: '6px', marginBottom: '5px' }}>
                  <div style={{ background: '#3D7A35', width: '62%', height: '100%', borderRadius: '4px' }} />
                </div>
                <div style={{ color: '#3D7A35', fontSize: '11px', fontWeight: 600 }}>Flowering · 62%</div>
              </div>
              {/* Crops + size */}
              <div style={{ padding: '12px 20px', borderBottom: '1px solid #F0EBE0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <div style={{ color: '#9B9B82', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '3px' }}>Crops</div>
                  <div style={{ fontSize: '12px', color: '#1A1A14', fontWeight: 500 }}>Tomatoes · Herbs</div>
                </div>
                <div>
                  <div style={{ color: '#9B9B82', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '3px' }}>Plot size</div>
                  <div style={{ fontSize: '12px', color: '#1A1A14', fontWeight: 500 }}>2 m²</div>
                </div>
              </div>
              {/* Next delivery */}
              <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '34px', height: '34px', background: '#FBF3DC', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', flexShrink: 0 }}>📦</div>
                <div>
                  <div style={{ color: '#9B9B82', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Next delivery</div>
                  <div style={{ color: '#1A1A14', fontSize: '12px', fontWeight: 500 }}>Thursday · ~1.5 kg</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
