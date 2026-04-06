'use client';

import { motion } from 'framer-motion';
import ArmenianDivider from '@/components/layout/ArmenianDivider';
import { EASE, VIEWPORT } from '@/lib/animations';
import type { PhaseTwoContent } from '@/types/content';

interface Props {
  content: PhaseTwoContent;
}

export default function PhaseTwo({ content }: Props) {
  return (
    <>
      <ArmenianDivider variant="ink" />

      <section id="phase-two" style={{ background: 'var(--cream2)', padding: '72px 24px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div style={{
              border: '1px dashed rgba(26,26,20,0.2)',
              borderRadius: '16px',
              padding: '40px 40px 44px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(26,26,20,0.05)',
                border: '1px solid rgba(26,26,20,0.1)',
                borderRadius: '100px',
                padding: '4px 14px',
                alignSelf: 'flex-start',
              }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--ink3)' }} />
                <span style={{
                  fontFamily: 'var(--font-lato)',
                  fontWeight: 700,
                  fontSize: '0.65rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--ink3)',
                }}>
                  {content.tag}
                </span>
              </div>

              <h2 style={{
                fontFamily: 'var(--font-playfair)',
                fontWeight: 300,
                fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
                lineHeight: 1.3,
                color: 'var(--ink2)',
                margin: 0,
              }}>
                {content.heading}
              </h2>

              <p style={{
                fontFamily: 'var(--font-lato)',
                fontWeight: 300,
                fontSize: '0.975rem',
                lineHeight: 1.85,
                color: 'var(--ink3)',
                margin: 0,
              }}>
                {content.body}
              </p>

              <div style={{
                paddingTop: '4px',
                fontFamily: 'var(--font-lato)',
                fontWeight: 700,
                fontSize: '0.7rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--ink3)',
                opacity: 0.6,
              }}>
                {content.note}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
