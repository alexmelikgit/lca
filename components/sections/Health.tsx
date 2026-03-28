'use client';

/**
 * Health — highlights the health and quality benefits of plot-grown food.
 * Green-pale background. Two-column layout: left has tag + heading + intro,
 * right has a 2×2 grid of benefit cards. Animates in on scroll.
 */

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import ArmenianDivider from '@/components/layout/ArmenianDivider';
import SectionTag from '@/components/ui/SectionTag';
import type { HealthContent } from '@/types/content';

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
  }),
};

interface Props {
  content: HealthContent;
}

export default function Health({ content }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <>
      <ArmenianDivider variant="ink" />

      <section
        id="health"
        ref={ref}
        style={{ background: 'var(--green-pale)', padding: '96px 24px' }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
            gap: '48px 80px',
            alignItems: 'start',
          }}
        >
          {/* ── Left column: header ───────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionTag variant="green" style={{ marginBottom: '24px' }}>
              {content.tag}
            </SectionTag>

            <h2
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontWeight: 300,
                fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
                lineHeight: 1.25,
                color: 'var(--ink)',
                margin: '0 0 20px',
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
                maxWidth: '380px',
              }}
            >
              {content.intro}
            </p>

            {/* Decorative element */}
            <div
              style={{
                marginTop: '40px',
                width: '48px',
                height: '3px',
                background: 'var(--green-mid)',
                borderRadius: '2px',
                opacity: 0.5,
              }}
            />
          </motion.div>

          {/* ── Right column: 2×2 grid ─────────────────────── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '20px',
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
                    background: 'white',
                    borderRadius: '16px',
                    padding: '28px 24px 32px',
                    border: '1px solid rgba(90,155,80,0.12)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0',
                    boxShadow: '0 2px 12px rgba(61,122,53,0.06)',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.transform = 'translateY(-3px)';
                    el.style.boxShadow = '0 10px 28px rgba(61,122,53,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.transform = 'translateY(0)';
                    el.style.boxShadow = '0 2px 12px rgba(61,122,53,0.06)';
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'var(--green-pale)',
                      border: '1px solid var(--green-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem',
                      color: 'var(--green)',
                      marginBottom: '18px',
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: 'Playfair Display, Georgia, serif',
                      fontWeight: 400,
                      fontSize: '1.05rem',
                      lineHeight: 1.35,
                      color: 'var(--ink)',
                      margin: '0 0 10px',
                    }}
                  >
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontFamily: 'Lato, sans-serif',
                      fontWeight: 300,
                      fontSize: '0.9rem',
                      lineHeight: 1.75,
                      color: 'var(--ink2)',
                      margin: 0,
                    }}
                  >
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
