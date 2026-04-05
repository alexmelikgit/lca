'use client';

import { motion } from 'framer-motion';
import ArmenianDivider from '@/components/layout/ArmenianDivider';
import SectionTag from '@/components/ui/SectionTag';
import { EASE, VIEWPORT, staggerVariants } from '@/lib/animations';
import type { ProgressContent } from '@/types/content';

interface Props {
  content: ProgressContent;
}

export default function Progress({ content }: Props) {
  return (
    <>
      <ArmenianDivider variant="gold" />

      <section id="progress" style={{ background: 'var(--green-deep)', padding: '96px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ textAlign: 'center', marginBottom: '72px', maxWidth: '600px', margin: '0 auto 72px' }}
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
              margin: '0 0 18px',
            }}>
              {content.heading}
            </h2>
            <p style={{
              fontFamily: 'var(--font-lato)',
              fontWeight: 300,
              fontSize: '1.05rem',
              lineHeight: 1.85,
              color: 'rgba(255,255,255,0.65)',
              margin: 0,
            }}>
              {content.intro}
            </p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '2px',
            position: 'relative',
          }}>
            {content.milestones.map((milestone, i) => (
              <motion.div
                key={milestone.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT}
                variants={staggerVariants}
              >
                <div
                  className="milestone-card"
                  style={{
                    padding: '40px 36px 44px',
                    borderRadius: '16px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
                    <span style={{
                      fontFamily: 'var(--font-lato)',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'var(--gold)',
                      background: 'rgba(196,154,60,0.12)',
                      border: '1px solid rgba(196,154,60,0.25)',
                      padding: '4px 12px',
                      borderRadius: '100px',
                    }}>
                      {milestone.year}
                    </span>
                  </div>

                  <div style={{
                    fontFamily: 'var(--font-playfair)',
                    fontWeight: 300,
                    fontSize: '3.2rem',
                    lineHeight: 1,
                    color: 'var(--gold)',
                    marginBottom: '8px',
                  }}>
                    {milestone.size}
                  </div>

                  <div style={{
                    fontFamily: 'var(--font-lato)',
                    fontWeight: 400,
                    fontSize: '1rem',
                    color: 'white',
                    marginBottom: '28px',
                    letterSpacing: '0.02em',
                  }}>
                    {milestone.label}
                  </div>

                  <div style={{ width: '32px', height: '1px', background: 'rgba(196,154,60,0.35)', marginBottom: '24px' }} />

                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {milestone.features.map((feature, fi) => (
                      <li key={fi} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        fontFamily: 'var(--font-lato)',
                        fontWeight: 300,
                        fontSize: '0.9rem',
                        lineHeight: 1.5,
                        color: 'rgba(255,255,255,0.7)',
                      }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--gold)', opacity: 0.6, flexShrink: 0, marginTop: '6px' }} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ArmenianDivider variant="gold" />
    </>
  );
}
