'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import ArmenianDivider from '@/components/layout/ArmenianDivider';
import type { HowItWorksContent } from '@/types/content';

const ICONS = [
  // Choose your plot & crop — seedling
  <svg key="1" width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M24 40V24" />
    <path d="M24 24C24 24 16 20 16 12C16 12 20 8 24 8C28 8 32 12 32 12C32 20 24 24 24 24Z" />
    <path d="M24 30C24 30 18 27 15 22" />
  </svg>,
  // A real farmer tends it — person with plant
  <svg key="2" width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="24" cy="12" r="5" />
    <path d="M14 40V30C14 26 18 24 24 24C30 24 34 26 34 30V40" />
    <path d="M24 34V28" />
    <path d="M20 31C20 31 22 29 24 28C26 29 28 31 28 31" />
  </svg>,
  // Weekly small deliveries — delivery box
  <svg key="3" width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="10" y="20" width="28" height="20" rx="2" />
    <path d="M10 20L16 10H32L38 20" />
    <path d="M24 10V20" />
    <path d="M17 30H31" />
  </svg>,
  // Reinvest & grow — upward plant
  <svg key="4" width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M24 40V20" />
    <path d="M24 20C24 20 18 16 18 10C18 10 21 8 24 8C27 8 30 10 30 10C30 16 24 20 24 20Z" />
    <path d="M24 28C24 28 30 25 33 20" />
    <path d="M16 38H32" />
  </svg>,
];

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
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
        style={{ background: '#fff', padding: '96px 24px' }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* Centered header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ textAlign: 'center', marginBottom: '64px' }}
          >
            <p
              style={{
                fontFamily: 'Lato, sans-serif',
                fontWeight: 400,
                fontSize: '0.78rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--green)',
                margin: '0 0 20px',
              }}
            >
              — {content.tag.toUpperCase()} —
            </p>
            <h2
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontWeight: 300,
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                lineHeight: 1.2,
                color: 'var(--ink)',
                margin: 0,
              }}
            >
              {content.heading}
            </h2>
          </motion.div>

          {/* 4-column card row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '20px',
            }}
            className="how-it-works-grid"
          >
            {content.steps.map((step, i) => (
              <motion.div
                key={step.id}
                custom={i}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                variants={cardVariants}
                style={{
                  background: '#fff',
                  border: '1px solid rgba(26,26,20,0.1)',
                  borderRadius: '12px',
                  padding: '32px 28px 36px',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                  transition: 'box-shadow 0.25s ease',
                }}
                whileHover={{ boxShadow: '0 6px 24px rgba(61,122,53,0.1)' }}
              >
                {/* Number badge */}
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '1.5px solid rgba(26,26,20,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'Lato, sans-serif',
                    fontWeight: 400,
                    fontSize: '0.8rem',
                    color: 'var(--ink2)',
                    letterSpacing: '0.05em',
                    marginBottom: '32px',
                    flexShrink: 0,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>

                {/* Icon */}
                <div
                  style={{
                    color: 'var(--green)',
                    marginBottom: '28px',
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'flex-start',
                  }}
                >
                  {ICONS[i]}
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: 'Playfair Display, Georgia, serif',
                    fontWeight: 500,
                    fontSize: '1.05rem',
                    lineHeight: 1.35,
                    color: 'var(--ink)',
                    margin: '0 0 12px',
                  }}
                >
                  {step.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontFamily: 'Lato, sans-serif',
                    fontWeight: 300,
                    fontSize: '0.9rem',
                    lineHeight: 1.8,
                    color: 'var(--ink2)',
                    margin: 0,
                  }}
                >
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .how-it-works-grid {
              grid-template-columns: 1fr 1fr !important;
            }
          }
          @media (max-width: 480px) {
            .how-it-works-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>
    </>
  );
}
