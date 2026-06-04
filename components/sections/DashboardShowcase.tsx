'use client';

import { motion } from 'framer-motion';
import ArmenianDivider from '@/components/layout/ArmenianDivider';
import SectionTag from '@/components/ui/SectionTag';
import DashboardCard from '@/components/ui/DashboardCard';
import { EASE, VIEWPORT } from '@/lib/animations';
import type { DashboardShowcaseContent } from '@/types/content';

const DEMO_CARD = {
  plotName: 'Plot 7 — Kotayk',
  status: 'Growing 🌱',
  crops: ['Tomatoes', 'Cucumbers', 'Herbs'],
  stats: { plotSize: '2 m²', seasonWeek: 'Week 14', estimatedYield: '~4 kg', harvestDate: 'Aug 12' },
  progress: { label: 'Flowering', percentage: 62 },
  nextDelivery: { day: 'Thursday', description: '~1.5 kg tomatoes' },
};

interface Props {
  content: DashboardShowcaseContent;
}

export default function DashboardShowcase({ content }: Props) {
  return (
    <>
      <ArmenianDivider variant="gold" />

      <section id="dashboard" style={{ background: 'var(--green-deep)', padding: '96px 24px' }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
          gap: '48px 80px',
          alignItems: 'center',
        }}>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.65, ease: EASE }}
          >
            <SectionTag variant="gold" style={{ marginBottom: '24px' }}>
              {content.tag}
            </SectionTag>
            <h2 style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 300,
              fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
              lineHeight: 1.25,
              color: 'white',
              margin: '0 0 20px',
            }}>
              {content.heading}
            </h2>
            <p style={{
              fontFamily: 'var(--font-lato)',
              fontWeight: 300,
              fontSize: '1.05rem',
              lineHeight: 1.85,
              color: 'rgba(255,255,255,0.65)',
              margin: '0 0 40px',
            }}>
              {content.intro}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {content.features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.15 + i * 0.08 }}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}
                >
                  <div style={{
                    flexShrink: 0,
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--gold)',
                    marginTop: '8px',
                  }} />
                  <span style={{
                    fontFamily: 'var(--font-lato)',
                    fontWeight: 300,
                    fontSize: '0.975rem',
                    lineHeight: 1.7,
                    color: 'rgba(255,255,255,0.8)',
                  }}>
                    {feature}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.75, ease: EASE, delay: 0.1 }}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                inset: '-32px',
                background: 'radial-gradient(ellipse at center, rgba(196,154,60,0.12) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />
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

    </>
  );
}
