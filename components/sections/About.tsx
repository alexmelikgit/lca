'use client';

/**
 * About — introduces the founder and explains why this service exists.
 * Green-pale background. Two-column layout: left has styled author card
 * (photo placeholder + name + role), right has 3 paragraphs + trust line.
 * Animates in on scroll via Framer Motion.
 */

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import ArmenianDivider from '@/components/layout/ArmenianDivider';
import SectionTag from '@/components/ui/SectionTag';
import type { AboutContent } from '@/types/content';

interface Props {
  content: AboutContent;
}

export default function About({ content }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <>
      <ArmenianDivider variant="ink" />

      <section
        id="about"
        ref={ref}
        style={{ background: 'var(--green-pale)', padding: '96px 24px' }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '48px 80px',
            alignItems: 'start',
          }}
        >
          {/* Left column: author card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionTag variant="green" style={{ marginBottom: '32px' }}>
              {content.tag}
            </SectionTag>

            <div
              style={{
                background: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid rgba(90,155,80,0.15)',
                boxShadow: '0 8px 40px rgba(45,90,39,0.08)',
              }}
            >
              {/* Photo placeholder */}
              <div
                style={{
                  height: '200px',
                  background: `linear-gradient(135deg, var(--green-pale) 0%, var(--cream) 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: 0.3,
                  }}
                >
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: 'var(--green)',
                    }}
                  />
                  <div
                    style={{
                      width: '72px',
                      height: '24px',
                      borderRadius: '6px',
                      background: 'var(--green)',
                      opacity: 0.5,
                    }}
                  />
                </div>

                {/* Role badge overlay */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '14px',
                    left: '18px',
                    fontFamily: 'Lato, sans-serif',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--green-deep)',
                    background: 'rgba(255,255,255,0.9)',
                    padding: '4px 12px',
                    borderRadius: '100px',
                  }}
                >
                  {content.role}
                </div>
              </div>

              {/* Name + role */}
              <div style={{ padding: '24px 28px 28px' }}>
                <div
                  style={{
                    fontFamily: 'Playfair Display, Georgia, serif',
                    fontWeight: 400,
                    fontSize: '1.2rem',
                    color: 'var(--ink)',
                    marginBottom: '4px',
                  }}
                >
                  {content.name}
                </div>
                <div
                  style={{
                    fontFamily: 'Lato, sans-serif',
                    fontWeight: 400,
                    fontSize: '0.8rem',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'var(--green)',
                  }}
                >
                  {content.role}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right column: text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
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
              {content.paragraph1}
            </p>

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
              {content.paragraph2}
            </p>

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
              {content.paragraph3}
            </p>

            {/* Trust line */}
            <div
              style={{
                marginTop: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '1px',
                  background: 'var(--green-mid)',
                  opacity: 0.5,
                }}
              />
              <span
                style={{
                  fontFamily: 'Lato, sans-serif',
                  fontWeight: 400,
                  fontSize: '0.82rem',
                  letterSpacing: '0.04em',
                  color: 'var(--green)',
                  opacity: 0.8,
                }}
              >
                {content.trustText}
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
