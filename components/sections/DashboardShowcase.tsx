'use client';

/**
 * DashboardShowcase — dark green section that highlights the dashboard feature.
 * Two-column layout: left has tag + heading + intro + feature list;
 * right displays a large DashboardCard mockup.
 * Animates in on scroll via Framer Motion.
 */

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import ArmenianDivider from '@/components/layout/ArmenianDivider';
import SectionTag from '@/components/ui/SectionTag';
import DashboardCard from '@/components/ui/DashboardCard';
import type { DashboardShowcaseContent } from '@/types/content';

const DEMO_CARD = {
  plotName: 'Plot 7 — Armavir',
  status: 'Growing 🌱',
  crops: ['Tomatoes', 'Cucumbers', 'Herbs'],
  stats: {
    plotSize: '2 m²',
    seasonWeek: 'Week 14',
    estimatedYield: '~4 kg',
    harvestDate: 'Aug 12',
  },
  progress: {
    label: 'Flowering',
    percentage: 62,
  },
  nextDelivery: {
    day: 'Thursday',
    description: '~1.5 kg tomatoes',
  },
};

interface Props {
  content: DashboardShowcaseContent;
}

export default function DashboardShowcase({ content }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <>
      <ArmenianDivider variant="gold" />

      <section
        id="dashboard"
        ref={ref}
        style={{ background: 'var(--green-deep)', padding: '96px 24px' }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
            gap: '48px 80px',
            alignItems: 'center',
          }}
        >
          {/* ── Left: text ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionTag variant="gold" style={{ marginBottom: '24px' }}>
              {content.tag}
            </SectionTag>

            <h2
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontWeight: 300,
                fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
                lineHeight: 1.25,
                color: 'white',
                margin: '0 0 20px',
              }}
            >
              {content.heading}
            </h2>

            <p
              style={{
                fontFamily: 'Lato, sans-serif',
                fontWeight: 300,
                fontSize: '1.05rem',
                lineHeight: 1.85,
                color: 'rgba(255,255,255,0.65)',
                margin: '0 0 40px',
              }}
            >
              {content.intro}
            </p>

            {/* Feature list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {content.features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.15 + i * 0.08 }}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}
                >
                  {/* Gold dot */}
                  <div
                    style={{
                      flexShrink: 0,
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'var(--gold)',
                      marginTop: '8px',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'Lato, sans-serif',
                      fontWeight: 300,
                      fontSize: '0.975rem',
                      lineHeight: 1.7,
                      color: 'rgba(255,255,255,0.8)',
                    }}
                  >
                    {feature}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: Dashboard mockup ─────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* Glow behind card */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  inset: '-32px',
                  background: 'radial-gradient(ellipse at center, rgba(196,154,60,0.12) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />
              <DashboardCard
                {...DEMO_CARD}
                style={{
                  width: '300px',
                  boxShadow: '0 32px 80px rgba(0,0,0,0.4), 0 4px 20px rgba(0,0,0,0.2)',
                  transform: 'rotate(1.5deg)',
                } as React.CSSProperties}
              />
            </div>
          </motion.div>
        </div>
      </section>

      <ArmenianDivider variant="gold" />
    </>
  );
}
