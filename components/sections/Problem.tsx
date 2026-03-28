'use client';

/**
 * Problem — section that surfaces three core pain points Armenian city-dwellers
 * face with their produce. Soil-pale background, three cards each with a
 * vegetable illustration, a bold problem statement, and a supporting sentence.
 * Cards animate in staggered on scroll via Framer Motion.
 */

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import ArmenianDivider from '@/components/layout/ArmenianDivider';
import SectionTag from '@/components/ui/SectionTag';
import VegetableIllustration from '@/components/ui/VegetableIllustration';
import type { ProblemContent } from '@/types/content';
import type { VegetableType } from '@/components/ui/VegetableIllustration';

const cardVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 },
  }),
};

interface Props {
  content: ProblemContent;
}

export default function Problem({ content }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <>
      <ArmenianDivider variant="green" />

      <section
        id="problem"
        ref={ref}
        style={{ background: 'var(--soil-pale)', padding: '96px 24px' }}
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
                margin: '0',
              }}
            >
              {content.heading}
            </h2>
          </motion.div>

          {/* Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '28px',
            }}
          >
            {content.cards.map((card, i) => (
              <motion.div
                key={card.id}
                custom={i}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                variants={cardVariants}
              >
                <div
                  style={{
                    background: 'var(--cream)',
                    borderRadius: '16px',
                    padding: '36px 32px 40px',
                    border: '1px solid rgba(139,94,60,0.1)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0',
                    boxShadow: '0 2px 16px rgba(26,26,20,0.04)',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.transform = 'translateY(-4px)';
                    el.style.boxShadow = '0 12px 32px rgba(26,26,20,0.09)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.transform = 'translateY(0)';
                    el.style.boxShadow = '0 2px 16px rgba(26,26,20,0.04)';
                  }}
                >
                  {/* Illustration */}
                  <div style={{ marginBottom: '28px' }}>
                    <VegetableIllustration type={card.vegetable as VegetableType} size={72} />
                  </div>

                  {/* Problem number */}
                  <div
                    style={{
                      fontFamily: 'Playfair Display, Georgia, serif',
                      fontWeight: 300,
                      fontSize: '3rem',
                      lineHeight: 1,
                      color: 'var(--soil)',
                      opacity: 0.15,
                      marginBottom: '12px',
                      userSelect: 'none',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: 'Playfair Display, Georgia, serif',
                      fontWeight: 400,
                      fontSize: '1.2rem',
                      lineHeight: 1.35,
                      color: 'var(--ink)',
                      margin: '0 0 14px',
                    }}
                  >
                    {card.title}
                  </h3>

                  {/* Body */}
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
                    {card.description}
                  </p>

                  {/* Bottom accent line */}
                  <div
                    style={{
                      marginTop: 'auto',
                      paddingTop: '28px',
                      borderTop: '1px solid rgba(139,94,60,0.1)',
                      marginBottom: '-4px',
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '2px',
                        background: 'var(--soil)',
                        borderRadius: '2px',
                        opacity: 0.35,
                      }}
                    />
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
