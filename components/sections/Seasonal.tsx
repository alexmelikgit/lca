'use client';

/**
 * Seasonal Calendar — shows what crops arrive each season.
 * Cream background. Header + 4 season columns with crop pills.
 * Each column uses its season color for accents and pill backgrounds.
 * Animates in staggered on scroll via Framer Motion.
 */

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import ArmenianDivider from '@/components/layout/ArmenianDivider';
import SectionTag from '@/components/ui/SectionTag';
import type { SeasonalContent } from '@/types/content';

const columnVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
  }),
};

interface Props {
  content: SeasonalContent;
}

export default function Seasonal({ content }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <>
      <ArmenianDivider variant="ink" />

      <section
        id="seasonal"
        ref={ref}
        style={{ background: 'var(--cream)', padding: '96px 24px' }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: '64px', maxWidth: '560px' }}
          >
            <SectionTag variant="green" style={{ marginBottom: '20px' }}>
              {content.tag}
            </SectionTag>

            <h2
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontWeight: 300,
                fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
                lineHeight: 1.25,
                color: 'var(--ink)',
                margin: '0 0 18px',
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
                color: 'var(--ink2)',
                margin: 0,
              }}
            >
              {content.intro}
            </p>
          </motion.div>

          {/* Season columns */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
              gap: '20px',
            }}
          >
            {content.seasons.map((season, i) => (
              <motion.div
                key={season.id}
                custom={i}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                variants={columnVariants}
              >
                <div
                  style={{
                    borderRadius: '16px',
                    border: `1px solid ${season.color}26`,
                    background: `${season.color}08`,
                    padding: '32px 28px 36px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.transform = 'translateY(-3px)';
                    el.style.boxShadow = `0 10px 28px ${season.color}18`;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.transform = 'translateY(0)';
                    el.style.boxShadow = 'none';
                  }}
                >
                  {/* Season color bar */}
                  <div
                    style={{
                      width: '36px',
                      height: '4px',
                      background: season.color,
                      borderRadius: '2px',
                      opacity: 0.7,
                      marginBottom: '20px',
                    }}
                  />

                  {/* Season name */}
                  <h3
                    style={{
                      fontFamily: 'Playfair Display, Georgia, serif',
                      fontWeight: 400,
                      fontSize: '1.35rem',
                      lineHeight: 1.2,
                      color: 'var(--ink)',
                      margin: '0 0 4px',
                    }}
                  >
                    {season.name}
                  </h3>

                  {/* Months */}
                  <div
                    style={{
                      fontFamily: 'Lato, sans-serif',
                      fontWeight: 400,
                      fontSize: '0.8rem',
                      letterSpacing: '0.06em',
                      color: season.color,
                      marginBottom: '24px',
                      opacity: 0.85,
                    }}
                  >
                    {season.months}
                  </div>

                  {/* Crop pills */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    {season.crops.map((crop) => (
                      <span
                        key={crop}
                        style={{
                          fontFamily: 'Lato, sans-serif',
                          fontWeight: 400,
                          fontSize: '0.8rem',
                          color: season.color,
                          background: `${season.color}14`,
                          border: `1px solid ${season.color}2a`,
                          padding: '4px 10px',
                          borderRadius: '100px',
                          letterSpacing: '0.01em',
                        }}
                      >
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
