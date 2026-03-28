'use client';

/**
 * Progress — dark green section showing the 3-year milestone journey.
 * Green-deep background with light text and gold accents.
 * Three milestone columns with connecting lines. Animates in on scroll.
 */

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import ArmenianDivider from '@/components/layout/ArmenianDivider';
import SectionTag from '@/components/ui/SectionTag';
import type { ProgressContent } from '@/types/content';

const milestoneVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: i * 0.15 },
  }),
};

interface Props {
  content: ProgressContent;
}

export default function Progress({ content }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <>
      <ArmenianDivider variant="gold" />

      <section
        id="progress"
        ref={ref}
        style={{ background: 'var(--green-deep)', padding: '96px 24px' }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

          {/* Header — centered */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ textAlign: 'center', marginBottom: '72px', maxWidth: '600px', margin: '0 auto 72px' }}
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
                color: 'rgba(255,255,255,0.65)',
                margin: 0,
              }}
            >
              {content.intro}
            </p>
          </motion.div>

          {/* Milestones grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '2px',
              position: 'relative',
            }}
          >
            {content.milestones.map((milestone, i) => (
              <motion.div
                key={milestone.id}
                custom={i}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                variants={milestoneVariants}
              >
                <div
                  style={{
                    padding: '40px 36px 44px',
                    borderRadius: '16px',
                    border: '1px solid rgba(196,154,60,0.2)',
                    background: 'rgba(255,255,255,0.04)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0',
                    transition: 'background 0.25s ease, border-color 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.background = 'rgba(255,255,255,0.07)';
                    el.style.borderColor = 'rgba(196,154,60,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.background = 'rgba(255,255,255,0.04)';
                    el.style.borderColor = 'rgba(196,154,60,0.2)';
                  }}
                >
                  {/* Year badge */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '28px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Lato, sans-serif',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: 'var(--gold)',
                        background: 'rgba(196,154,60,0.12)',
                        border: '1px solid rgba(196,154,60,0.25)',
                        padding: '4px 12px',
                        borderRadius: '100px',
                      }}
                    >
                      {milestone.year}
                    </span>
                  </div>

                  {/* Plot size — large gold number */}
                  <div
                    style={{
                      fontFamily: 'Playfair Display, Georgia, serif',
                      fontWeight: 300,
                      fontSize: '3.2rem',
                      lineHeight: 1,
                      color: 'var(--gold)',
                      marginBottom: '8px',
                    }}
                  >
                    {milestone.size}
                  </div>

                  {/* Label */}
                  <div
                    style={{
                      fontFamily: 'Lato, sans-serif',
                      fontWeight: 400,
                      fontSize: '1rem',
                      color: 'white',
                      marginBottom: '28px',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {milestone.label}
                  </div>

                  {/* Divider */}
                  <div
                    style={{
                      width: '32px',
                      height: '1px',
                      background: 'rgba(196,154,60,0.35)',
                      marginBottom: '24px',
                    }}
                  />

                  {/* Features list */}
                  <ul
                    style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    {milestone.features.map((feature, fi) => (
                      <li
                        key={fi}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          fontFamily: 'Lato, sans-serif',
                          fontWeight: 300,
                          fontSize: '0.9rem',
                          lineHeight: 1.5,
                          color: 'rgba(255,255,255,0.7)',
                        }}
                      >
                        <span
                          style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            background: 'var(--gold)',
                            opacity: 0.6,
                            flexShrink: 0,
                            marginTop: '6px',
                          }}
                        />
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
