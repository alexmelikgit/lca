'use client';

/**
 * Convenience — highlights the zero-effort aspects of the service.
 * Cream2 background. Centered header with 2×2 grid of benefit cards below.
 * Animates in on scroll via Framer Motion.
 */

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import ArmenianDivider from '@/components/layout/ArmenianDivider';
import SectionTag from '@/components/ui/SectionTag';
import type { ConvenienceContent } from '@/types/content';

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
  }),
};

const ITEM_ICONS = ['◎', '◉', '◈', '✦'];

interface Props {
  content: ConvenienceContent;
}

export default function Convenience({ content }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <>
      <ArmenianDivider variant="ink" />

      <section
        id="convenience"
        ref={ref}
        style={{ background: 'var(--cream2)', padding: '96px 24px' }}
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

          {/* 2×2 Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '24px',
            }}
          >
            {content.items.map((item, i) => (
              <motion.div
                key={item.id}
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
                    border: '1px solid rgba(26,26,20,0.07)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0',
                    boxShadow: '0 2px 12px rgba(26,26,20,0.04)',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.transform = 'translateY(-4px)';
                    el.style.boxShadow = '0 12px 32px rgba(26,26,20,0.08)';
                    el.style.background = 'white';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.transform = 'translateY(0)';
                    el.style.boxShadow = '0 2px 12px rgba(26,26,20,0.04)';
                    el.style.background = 'var(--cream)';
                  }}
                >
                  {/* Icon circle */}
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
                      fontSize: '1.1rem',
                      color: 'var(--green)',
                      marginBottom: '24px',
                      flexShrink: 0,
                    }}
                  >
                    {ITEM_ICONS[i % ITEM_ICONS.length]}
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: 'Playfair Display, Georgia, serif',
                      fontWeight: 400,
                      fontSize: '1.15rem',
                      lineHeight: 1.35,
                      color: 'var(--ink)',
                      margin: '0 0 12px',
                    }}
                  >
                    {item.title}
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
                    {item.description}
                  </p>

                  {/* Bottom accent */}
                  <div
                    style={{
                      marginTop: 'auto',
                      paddingTop: '24px',
                    }}
                  >
                    <div
                      style={{
                        width: '28px',
                        height: '2px',
                        background: 'var(--green-mid)',
                        borderRadius: '2px',
                        opacity: 0.4,
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
