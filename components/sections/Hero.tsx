'use client';

import { motion } from 'framer-motion';
import ArmenianLandscape from '@/components/ui/ArmenianLandscape';
import DashboardCard from '@/components/ui/DashboardCard';
import SectionTag from '@/components/ui/SectionTag';
import { EASE } from '@/lib/animations';
import type { HeroContent } from '@/types/content';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay },
  }),
};

const DEMO_CARD = {
  plotName: 'Plot 7 — Armavir',
  status: 'Growing 🌱',
  crops: ['Tomatoes', 'Cucumbers'],
  stats: { plotSize: '2 m²', seasonWeek: 'Week 14', estimatedYield: '~4 kg', harvestDate: 'Aug 12' },
  progress: { label: 'Flowering', percentage: 62 },
  nextDelivery: { day: 'Thursday', description: '~1.5 kg tomatoes' },
};

interface Props {
  content: HeroContent;
}

export default function Hero({ content }: Props) {
  return (
    <section style={{ background: 'var(--cream)', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '64px' }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        width: '100%',
        padding: '60px 24px 80px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
        gap: '48px 64px',
        alignItems: 'center',
      }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp} style={{ marginBottom: '28px' }}>
            <SectionTag variant="green">{content.tag}</SectionTag>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            custom={0.1}
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 300,
              fontSize: 'clamp(2.6rem, 4.5vw, 4.2rem)',
              lineHeight: 1.15,
              color: 'var(--ink)',
              margin: '0 0 28px',
            }}
          >
            {content.h1Line1}<br />
            {content.h1Line2}<br />
            <em style={{ color: 'var(--green)', fontStyle: 'italic' }}>{content.h1Italic}</em>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            custom={0.22}
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-lato)',
              fontWeight: 300,
              fontSize: '1.05rem',
              lineHeight: 1.85,
              color: 'var(--ink2)',
              margin: '0 0 36px',
              maxWidth: '460px',
            }}
          >
            {content.subtitle}
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.34}
            variants={fadeUp}
            style={{ display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap', marginBottom: '48px' }}
          >
            <a
              href={content.primaryCtaHref}
              className="btn-primary"
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
                boxShadow: '0 4px 20px rgba(45,90,39,0.25)',
              }}
            >
              {content.primaryCtaLabel}
              <span style={{ fontSize: '1rem' }}>→</span>
            </a>

            <a
              href={content.secondaryCtaHref}
              className="btn-ghost"
              style={{
                fontFamily: 'var(--font-lato)',
                fontWeight: 400,
                fontSize: '0.9rem',
                color: 'var(--ink2)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--ink3)',
                paddingBottom: '2px',
                letterSpacing: '0.02em',
              }}
            >
              {content.secondaryCtaLabel}
            </a>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.46}
            variants={fadeUp}
            style={{ display: 'flex', borderTop: '1px solid rgba(168,212,160,0.35)', paddingTop: '24px' }}
          >
            {content.stats.map((stat, i) => (
              <div
                key={stat.label}
                style={{
                  flex: 1,
                  paddingRight: i < content.stats.length - 1 ? '24px' : '0',
                  marginRight: i < content.stats.length - 1 ? '24px' : '0',
                  borderRight: i < content.stats.length - 1 ? '1px solid rgba(168,212,160,0.35)' : 'none',
                }}
              >
                <div style={{
                  fontFamily: 'var(--font-playfair)',
                  fontWeight: 400,
                  fontSize: '1.35rem',
                  color: 'var(--green-deep)',
                  lineHeight: 1,
                  marginBottom: '4px',
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontFamily: 'var(--font-lato)',
                  fontWeight: 700,
                  fontSize: '0.65rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--ink3)',
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right column */}
        <motion.div
          initial={{ opacity: 0, x: 48 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          style={{ position: 'relative' }}
        >
          <div style={{
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            background: 'radial-gradient(ellipse at 40% 60%, var(--green-pale), var(--cream))',
            boxShadow: '0 24px 80px rgba(45,90,39,0.14), 0 4px 16px rgba(45,90,39,0.08)',
            aspectRatio: '4/3',
          }}>
            <ArmenianLandscape width="100%" height="100%" style={{ display: 'block' }} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: -2.5 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.55 }}
            style={{ position: 'absolute', bottom: '-20px', right: '-16px', zIndex: 10 }}
          >
            <DashboardCard
              {...DEMO_CARD}
              style={{ boxShadow: '0 20px 60px rgba(26,26,20,0.18), 0 4px 16px rgba(26,26,20,0.1)' } as React.CSSProperties}
            />
          </motion.div>

          <div style={{ position: 'absolute', top: '-12px', left: '24px', display: 'flex', gap: '6px' }}>
            {[12, 8, 5].map((size, i) => (
              <div key={i} style={{
                width: size,
                height: size,
                borderRadius: '50%',
                background: 'var(--gold)',
                opacity: 0.6 - i * 0.12,
              }} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
