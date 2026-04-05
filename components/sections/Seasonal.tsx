'use client';

import { motion } from 'framer-motion';
import ArmenianDivider from '@/components/layout/ArmenianDivider';
import SectionTag from '@/components/ui/SectionTag';
import { EASE, VIEWPORT, staggerVariants } from '@/lib/animations';
import type { SeasonalContent } from '@/types/content';

interface Props {
  content: SeasonalContent;
}

export default function Seasonal({ content }: Props) {
  return (
    <>
      <ArmenianDivider variant="ink" />

      <section id="seasonal" style={{ background: 'var(--cream)', padding: '96px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ marginBottom: '64px', maxWidth: '560px' }}
          >
            <SectionTag variant="green" style={{ marginBottom: '20px' }}>
              {content.tag}
            </SectionTag>
            <h2 style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 300,
              fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
              lineHeight: 1.25,
              color: 'var(--ink)',
              margin: '0 0 18px',
            }}>
              {content.heading}
            </h2>
            <p style={{
              fontFamily: 'var(--font-lato)',
              fontWeight: 300,
              fontSize: '1.05rem',
              lineHeight: 1.85,
              color: 'var(--ink2)',
              margin: 0,
            }}>
              {content.intro}
            </p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
            gap: '20px',
          }}>
            {content.seasons.map((season, i) => (
              <motion.div
                key={season.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT}
                variants={staggerVariants}
              >
                {/* Seasonal cards use dynamic colors so hover stays in JS */}
                <div
                  className="card-lift-subtle"
                  style={{
                    borderRadius: '16px',
                    border: `1px solid ${season.color}26`,
                    background: `${season.color}08`,
                    padding: '32px 28px 36px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ width: '36px', height: '4px', background: season.color, borderRadius: '2px', opacity: 0.7, marginBottom: '20px' }} />

                  <h3 style={{
                    fontFamily: 'var(--font-playfair)',
                    fontWeight: 400,
                    fontSize: '1.35rem',
                    lineHeight: 1.2,
                    color: 'var(--ink)',
                    margin: '0 0 4px',
                  }}>
                    {season.name}
                  </h3>

                  <div style={{
                    fontFamily: 'var(--font-lato)',
                    fontWeight: 400,
                    fontSize: '0.8rem',
                    letterSpacing: '0.06em',
                    color: season.color,
                    marginBottom: '24px',
                    opacity: 0.85,
                  }}>
                    {season.months}
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {season.crops.map((crop) => (
                      <span key={crop} style={{
                        fontFamily: 'var(--font-lato)',
                        fontWeight: 400,
                        fontSize: '0.8rem',
                        color: season.color,
                        background: `${season.color}14`,
                        border: `1px solid ${season.color}2a`,
                        padding: '4px 10px',
                        borderRadius: '100px',
                        letterSpacing: '0.01em',
                      }}>
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
