'use client';

/**
 * Trust — transparent section about the pre-pilot status.
 * Cream2 background. Centered layout, max-width 720px.
 * Stacked trust points with a numbered indicator. Animates in on scroll.
 */

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import ArmenianDivider from '@/components/layout/ArmenianDivider';
import SectionTag from '@/components/ui/SectionTag';
import type { TrustContent } from '@/types/content';

const pointVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
  }),
};

interface Props {
  content: TrustContent;
}

export default function Trust({ content }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <>
      <ArmenianDivider variant="ink" />

      <section
        id="trust"
        ref={ref}
        style={{ background: 'var(--cream2)', padding: '96px 24px' }}
      >
        <div
          style={{
            maxWidth: '720px',
            margin: '0 auto',
          }}
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: '56px' }}
          >
            <SectionTag variant="gold" style={{ marginBottom: '20px' }}>
              {content.tag}
            </SectionTag>

            <h2
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontWeight: 300,
                fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
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

          {/* Trust points */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0',
            }}
          >
            {content.points.map((point, i) => (
              <motion.div
                key={point.id}
                custom={i}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                variants={pointVariants}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '24px',
                    alignItems: 'flex-start',
                    padding: '28px 0',
                    borderBottom: i < content.points.length - 1 ? '1px solid rgba(196,154,60,0.15)' : 'none',
                  }}
                >
                  {/* Number */}
                  <div
                    style={{
                      flexShrink: 0,
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(196,154,60,0.1)',
                      border: '1px solid rgba(196,154,60,0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'Playfair Display, Georgia, serif',
                      fontWeight: 400,
                      fontSize: '0.9rem',
                      color: 'var(--gold)',
                      marginTop: '2px',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontFamily: 'Playfair Display, Georgia, serif',
                        fontWeight: 400,
                        fontSize: '1.1rem',
                        lineHeight: 1.35,
                        color: 'var(--ink)',
                        margin: '0 0 8px',
                      }}
                    >
                      {point.title}
                    </h3>

                    <p
                      style={{
                        fontFamily: 'Lato, sans-serif',
                        fontWeight: 300,
                        fontSize: '0.95rem',
                        lineHeight: 1.8,
                        color: 'var(--ink2)',
                        margin: 0,
                      }}
                    >
                      {point.description}
                    </p>
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
