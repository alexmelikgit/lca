'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import ArmenianDivider from '@/components/layout/ArmenianDivider';
import SectionTag from '@/components/ui/SectionTag';
import { EASE, VIEWPORT } from '@/lib/animations';
import type { PlotFieldConfig, PlotMapSectionContent } from '@/types/content';

// Dynamic import prevents Leaflet/SVG code from running server-side
const PlotFieldStatic = dynamic(
  () => import('@/components/plots/PlotFieldStatic'),
  {
    ssr: false,
    loading: () => (
      <div style={{
        width: '100%',
        aspectRatio: '3 / 2',
        borderRadius: '14px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(196,154,60,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span style={{
          fontFamily: 'var(--font-lato)',
          fontWeight: 300,
          fontSize: '0.85rem',
          color: 'rgba(255,255,255,0.28)',
          letterSpacing: '0.08em',
        }}>
          Loading field…
        </span>
      </div>
    ),
  },
);

interface Props {
  content: PlotMapSectionContent;
  fieldConfig: PlotFieldConfig;
}

export default function PlotField({ content, fieldConfig }: Props) {
  return (
    <>
      <ArmenianDivider variant="gold" />

      <section id="plot-map" style={{ background: 'var(--green-deep)', padding: '96px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ textAlign: 'center', marginBottom: '48px' }}
          >
            <SectionTag
              variant="gold"
              style={{ marginBottom: '20px', justifyContent: 'center' }}
            >
              {content.tag}
            </SectionTag>

            <h2 style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 300,
              fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
              lineHeight: 1.25,
              color: 'white',
              margin: '0 0 14px',
            }}>
              {content.heading}
            </h2>

            <p style={{
              fontFamily: 'var(--font-lato)',
              fontWeight: 300,
              fontSize: '1rem',
              lineHeight: 1.85,
              color: 'rgba(255,255,255,0.52)',
              margin: '0 auto',
              maxWidth: '480px',
            }}>
              {content.subtitle}
            </p>
          </motion.div>

          {/* Field renderer */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.75, ease: EASE, delay: 0.15 }}
          >
            <PlotFieldStatic
              fieldConfig={fieldConfig}
              reserveCtaText={content.reserveCtaText}
              reserveCtaHref={content.reserveCtaHref}
            />
          </motion.div>

        </div>
      </section>
    </>
  );
}
