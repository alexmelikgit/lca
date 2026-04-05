'use client';

import { motion } from 'framer-motion';
import ArmenianDivider from '@/components/layout/ArmenianDivider';
import SectionTag from '@/components/ui/SectionTag';
import { EASE, VIEWPORT } from '@/lib/animations';
import type { CtaFooterContent } from '@/types/content';

interface Props {
  content: CtaFooterContent;
}

export default function CTAFooter({ content }: Props) {
  return (
    <>
      <ArmenianDivider variant="gold" />

      <section id="join" style={{ background: 'var(--green-deep)', padding: '96px 24px 104px' }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ marginBottom: '24px' }}
          >
            <SectionTag variant="gold">{content.tag}</SectionTag>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.65, ease: EASE, delay: 0.1 }}
            style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 300,
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              lineHeight: 1.2,
              color: 'white',
              margin: '0 0 20px',
            }}
          >
            {content.heading}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
            style={{
              fontFamily: 'var(--font-lato)',
              fontWeight: 300,
              fontSize: '1.05rem',
              lineHeight: 1.85,
              color: 'rgba(255,255,255,0.65)',
              margin: '0 0 40px',
            }}
          >
            {content.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
            style={{ marginBottom: '20px' }}
          >
            <a
              href={content.buttonHref}
              className="btn-gold"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'var(--font-lato)',
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--green-deep)',
                background: 'var(--gold)',
                padding: '16px 40px',
                borderRadius: '100px',
                textDecoration: 'none',
                boxShadow: '0 4px 24px rgba(196,154,60,0.3)',
              }}
            >
              {content.buttonLabel}
              <span style={{ fontSize: '1rem' }}>→</span>
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE, delay: 0.45 }}
            style={{
              fontFamily: 'var(--font-lato)',
              fontWeight: 300,
              fontSize: '0.85rem',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.4)',
              margin: 0,
            }}
          >
            {content.note}
          </motion.p>
        </div>
      </section>
    </>
  );
}
