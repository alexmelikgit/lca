'use client';

import { motion } from 'framer-motion';
import ArmenianDivider from '@/components/layout/ArmenianDivider';
import SectionTag from '@/components/ui/SectionTag';
import { EASE, VIEWPORT, slideLeftVariants } from '@/lib/animations';
import type { TrustContent } from '@/types/content';

interface Props {
  content: TrustContent;
}

export default function Trust({ content }: Props) {
  return (
    <>
      <ArmenianDivider variant="ink" />

      <section id="trust" style={{ background: 'var(--cream2)', padding: '96px 24px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ marginBottom: '56px' }}
          >
            <SectionTag variant="gold" style={{ marginBottom: '20px' }}>
              {content.tag}
            </SectionTag>
            <h2 style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 300,
              fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
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

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {content.points.map((point, i) => (
              <motion.div
                key={point.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT}
                variants={slideLeftVariants}
              >
                <div style={{
                  display: 'flex',
                  gap: '24px',
                  alignItems: 'flex-start',
                  padding: '28px 0',
                  borderBottom: i < content.points.length - 1 ? '1px solid rgba(196,154,60,0.15)' : 'none',
                }}>
                  <div style={{
                    flexShrink: 0,
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(196,154,60,0.1)',
                    border: '1px solid rgba(196,154,60,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-playfair)',
                    fontWeight: 400,
                    fontSize: '0.9rem',
                    color: 'var(--gold)',
                    marginTop: '2px',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontFamily: 'var(--font-playfair)',
                      fontWeight: 400,
                      fontSize: '1.1rem',
                      lineHeight: 1.35,
                      color: 'var(--ink)',
                      margin: '0 0 8px',
                    }}>
                      {point.title}
                    </h3>
                    <p style={{
                      fontFamily: 'var(--font-lato)',
                      fontWeight: 300,
                      fontSize: '0.95rem',
                      lineHeight: 1.8,
                      color: 'var(--ink2)',
                      margin: 0,
                    }}>
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
