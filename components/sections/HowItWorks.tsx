'use client';

/**
 * HowItWorks — four-step grid explaining the service flow.
 * Cream background, 2×2 grid on desktop, single column on mobile.
 * Each step has a large step number, title, and description.
 * Animates in staggered on scroll via Framer Motion.
 */

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import ArmenianDivider from '@/components/layout/ArmenianDivider';
import SectionTag from '@/components/ui/SectionTag';
import type { HowItWorksContent } from '@/types/content';

const STEP_ICONS = ['◎', '◉', '▤', '▦'];

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
  }),
};

interface Props {
  content: HowItWorksContent;
}

export default function HowItWorks({ content }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <>
      <ArmenianDivider variant="ink" />

      <section
        id="how-it-works"
        ref={ref}
        style={{ background: 'var(--cream)', padding: '96px 24px' }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: '72px', maxWidth: '600px' }}
          >
            <SectionTag variant="green" className="mb-5">
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

          {/* Steps grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '2px',
            }}
          >
            {content.steps.map((step, i) => (
              <motion.div
                key={step.id}
                custom={i}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                variants={cardVariants}
              >
                <div
                  style={{
                    padding: '40px 36px 44px',
                    borderRadius: '16px',
                    border: '1px solid rgba(26,26,20,0.07)',
                    background: 'var(--cream)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0,
                    transition: 'background 0.25s ease, box-shadow 0.25s ease',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.background = 'var(--green-pale)';
                    el.style.boxShadow = '0 8px 28px rgba(61,122,53,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.background = 'var(--cream)';
                    el.style.boxShadow = 'none';
                  }}
                >
                  {/* Step number + icon row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '32px',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'Playfair Display, Georgia, serif',
                        fontWeight: 300,
                        fontSize: '3.5rem',
                        lineHeight: 1,
                        color: 'var(--green-light)',
                        userSelect: 'none',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'var(--green-pale)',
                        border: '1px solid var(--green-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        color: 'var(--green)',
                        flexShrink: 0,
                      }}
                    >
                      {STEP_ICONS[i]}
                    </div>
                  </div>

                  {/* Connector line */}
                  <div
                    style={{
                      width: '32px',
                      height: '2px',
                      background: 'var(--green-mid)',
                      borderRadius: '2px',
                      opacity: 0.5,
                      marginBottom: '20px',
                    }}
                  />

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
                    {step.title}
                  </h3>

                  {/* Description */}
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
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
