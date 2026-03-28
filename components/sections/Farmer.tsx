'use client';

/**
 * Farmer — introduces the farmer who tends each plot.
 * Soil-pale background. Two-column layout: left has tag + heading + bio text,
 * right has a styled card with photo placeholder and pull quote.
 * Animates in on scroll via Framer Motion.
 */

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import ArmenianDivider from '@/components/layout/ArmenianDivider';
import SectionTag from '@/components/ui/SectionTag';
import type { FarmerContent } from '@/types/content';

interface Props {
  content: FarmerContent;
}

export default function Farmer({ content }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <>
      <ArmenianDivider variant="ink" />

      <section
        id="farmer"
        ref={ref}
        style={{ background: 'var(--soil-pale)', padding: '96px 24px' }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
            gap: '48px 80px',
            alignItems: 'center',
          }}
        >
          {/* ── Left column: text ─────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
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
                margin: '0 0 24px',
              }}
            >
              {content.name}
            </h2>

            {/* Meta row */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
                marginBottom: '28px',
              }}
            >
              {[content.region, content.experience].map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: 'Lato, sans-serif',
                    fontWeight: 400,
                    fontSize: '0.8rem',
                    letterSpacing: '0.06em',
                    color: 'var(--soil)',
                    background: 'rgba(139,94,60,0.1)',
                    border: '1px solid rgba(139,94,60,0.18)',
                    padding: '4px 12px',
                    borderRadius: '100px',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

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
              {content.bio}
            </p>

            {/* Accent line */}
            <div
              style={{
                marginTop: '36px',
                width: '40px',
                height: '2px',
                background: 'var(--soil)',
                borderRadius: '2px',
                opacity: 0.3,
              }}
            />
          </motion.div>

          {/* ── Right column: farmer card ─────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          >
            <div
              style={{
                background: 'var(--cream)',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid rgba(139,94,60,0.1)',
                boxShadow: '0 8px 40px rgba(26,26,20,0.08)',
              }}
            >
              {/* Photo placeholder */}
              <div
                style={{
                  height: '240px',
                  background: `linear-gradient(135deg, var(--green-pale) 0%, var(--soil-pale) 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Decorative field illustration suggestion */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: 0.35,
                  }}
                >
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: 'var(--soil)',
                    }}
                  />
                  <div
                    style={{
                      width: '80px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'var(--soil)',
                      opacity: 0.5,
                    }}
                  />
                </div>

                {/* Region label overlay */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '20px',
                    fontFamily: 'Lato, sans-serif',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--soil)',
                    background: 'rgba(255,255,255,0.85)',
                    padding: '4px 12px',
                    borderRadius: '100px',
                  }}
                >
                  {content.region}
                </div>
              </div>

              {/* Quote section */}
              <div style={{ padding: '32px 36px 36px' }}>
                {/* Opening quote mark */}
                <div
                  style={{
                    fontFamily: 'Playfair Display, Georgia, serif',
                    fontSize: '3.5rem',
                    lineHeight: 0.8,
                    color: 'var(--gold)',
                    opacity: 0.45,
                    marginBottom: '12px',
                    userSelect: 'none',
                  }}
                >
                  &ldquo;
                </div>

                <blockquote
                  style={{
                    fontFamily: 'Playfair Display, Georgia, serif',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    fontSize: '1.15rem',
                    lineHeight: 1.65,
                    color: 'var(--ink)',
                    margin: '0 0 20px',
                  }}
                >
                  {content.quote}
                </blockquote>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '1px',
                      background: 'var(--soil)',
                      opacity: 0.35,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'Lato, sans-serif',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--soil)',
                      opacity: 0.7,
                    }}
                  >
                    {content.name}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
