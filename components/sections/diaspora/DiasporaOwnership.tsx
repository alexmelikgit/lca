'use client';

import { motion } from 'framer-motion';
import ArmenianDivider from '@/components/layout/ArmenianDivider';
import SectionTag from '@/components/ui/SectionTag';
import { EASE, VIEWPORT, staggerVariants } from '@/lib/animations';
import type { DiasporaOwnershipContent } from '@/types/content';

interface Props {
  content: DiasporaOwnershipContent;
}

export default function DiasporaOwnership({ content }: Props) {
  return (
    <>
      <ArmenianDivider variant="ink" />

      <section id="ownership" style={{ background: 'var(--green-pale)', padding: '96px 24px' }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
          gap: '48px 80px',
          alignItems: 'start',
        }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <SectionTag variant="pomegranate" style={{ marginBottom: '24px' }}>
              {content.tag}
            </SectionTag>
            <h2 style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 300,
              fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
              lineHeight: 1.25,
              color: 'var(--ink)',
              margin: '0 0 20px',
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
              maxWidth: '380px',
            }}>
              {content.intro}
            </p>
            <div style={{ marginTop: '40px', width: '48px', height: '3px', background: 'var(--pomegranate)', borderRadius: '2px', opacity: 0.4 }} />
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {content.items.map((item, i) => (
              <motion.div
                key={item.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT}
                variants={staggerVariants}
              >
                <div
                  className="card-lift"
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '28px 24px 32px',
                    border: '1px solid rgba(139,37,53,0.1)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'var(--pomegranate-pale)',
                    border: '1px solid var(--pomegranate-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-playfair)',
                    fontWeight: 400,
                    fontSize: '0.85rem',
                    color: 'var(--pomegranate)',
                    marginBottom: '18px',
                    flexShrink: 0,
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-playfair)',
                    fontWeight: 400,
                    fontSize: '1.05rem',
                    lineHeight: 1.35,
                    color: 'var(--ink)',
                    margin: '0 0 10px',
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-lato)',
                    fontWeight: 300,
                    fontSize: '0.9rem',
                    lineHeight: 1.75,
                    color: 'var(--ink2)',
                    margin: 0,
                  }}>
                    {item.description}
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
