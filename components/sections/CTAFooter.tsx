'use client';

/**
 * CTAFooter — final call-to-action section. Dark green-deep background,
 * centered layout, max-width 600px. Gold accents. Preceded by a gold
 * ArmenianDivider. No divider after (it is the last section).
 * Animates in on scroll via Framer Motion.
 */

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import ArmenianDivider from '@/components/layout/ArmenianDivider';
import SectionTag from '@/components/ui/SectionTag';
import type { CtaFooterContent } from '@/types/content';

interface Props {
  content: CtaFooterContent;
}

export default function CTAFooter({ content }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <>
      <ArmenianDivider variant="gold" />

      <section
        id="join"
        ref={ref}
        style={{
          background: 'var(--green-deep)',
          padding: '96px 24px 104px',
        }}
      >
        <div
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0',
          }}
        >
          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: '24px' }}
          >
            <SectionTag variant="gold">
              {content.tag}
            </SectionTag>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontWeight: 300,
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              lineHeight: 1.2,
              color: 'white',
              margin: '0 0 20px',
            }}
          >
            {content.heading}
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            style={{
              fontFamily: 'Lato, sans-serif',
              fontWeight: 300,
              fontSize: '1.05rem',
              lineHeight: 1.85,
              color: 'rgba(255,255,255,0.65)',
              margin: '0 0 40px',
            }}
          >
            {content.subtitle}
          </motion.p>

          {/* Button */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            style={{ marginBottom: '20px' }}
          >
            <a
              href={content.buttonHref}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'Lato, sans-serif',
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
                transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = 'translateY(-2px)';
                el.style.boxShadow = '0 8px 32px rgba(196,154,60,0.42)';
                el.style.background = 'var(--gold-light)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = '0 4px 24px rgba(196,154,60,0.3)';
                el.style.background = 'var(--gold)';
              }}
            >
              {content.buttonLabel}
              <span style={{ fontSize: '1rem' }}>→</span>
            </a>
          </motion.div>

          {/* Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
            style={{
              fontFamily: 'Lato, sans-serif',
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
