'use client';

import { motion } from 'framer-motion';
import ArmenianDivider from '@/components/layout/ArmenianDivider';
import SectionTag from '@/components/ui/SectionTag';
import { EASE, VIEWPORT, staggerVariants } from '@/lib/animations';
import type { ProgressContent } from '@/types/content';

interface Props {
  content: ProgressContent;
}

export default function Progress({ content }: Props) {
  return (
    <>
      <ArmenianDivider variant="gold" />

      <section id="progress" style={{ background: 'var(--green-deep)', padding: '96px 24px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ textAlign: 'center', marginBottom: '64px' }}
          >
            <SectionTag variant="gold" style={{ marginBottom: '20px', justifyContent: 'center' }}>
              {content.tag}
            </SectionTag>
            <h2 style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 300,
              fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
              lineHeight: 1.25,
              color: 'white',
              margin: '0 0 16px',
            }}>
              {content.heading}
            </h2>
            <p style={{
              fontFamily: 'var(--font-lato)',
              fontWeight: 300,
              fontSize: '1rem',
              lineHeight: 1.85,
              color: 'rgba(255,255,255,0.55)',
              margin: 0,
              maxWidth: '480px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              {content.intro}
            </p>
          </motion.div>

          {/* Timeline connector + cards */}
          <div style={{ position: 'relative' }}>

            {/* Connecting line (desktop) */}
            <div style={{
              position: 'absolute',
              top: '32px',
              left: 'calc(16.66% + 12px)',
              right: 'calc(16.66% + 12px)',
              height: '1px',
              background: 'rgba(196,154,60,0.25)',
              zIndex: 0,
            }} className="progress-line" />

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
              position: 'relative',
              zIndex: 1,
            }} className="progress-grid">
              {content.milestones.map((milestone, i) => (
                <motion.div
                  key={milestone.id}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={VIEWPORT}
                  variants={staggerVariants}
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  {/* Step indicator */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      border: '1px solid rgba(196,154,60,0.4)',
                      background: i === content.milestones.length - 1
                        ? '#48662b'
                        : 'var(--green-deep)',
                      position: 'relative',
                      zIndex: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      gap: '2px',
                      textAlign: 'center',
                      padding: '6px',
                      boxSizing: 'border-box',
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-lato)',
                        fontWeight: 700,
                        fontSize: '0.55rem',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--gold)',
                        opacity: 0.8,
                        lineHeight: 1,
                      }}>
                        {milestone.year}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-lato)',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        color: 'var(--gold)',
                        lineHeight: 1,
                        whiteSpace: 'nowrap',
                      }}>
                        {milestone.size}
                      </span>
                    </div>
                  </div>

                  {/* Card */}
                  <div style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(196,154,60,0.15)',
                    borderRadius: '14px',
                    padding: '28px 24px 32px',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'background 0.25s ease, border-color 0.25s ease',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.07)';
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(196,154,60,0.3)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)';
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(196,154,60,0.15)';
                  }}
                  >
                    {/* Label */}
                    <div style={{
                      fontFamily: 'var(--font-lato)',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: 'white',
                      marginBottom: '20px',
                      opacity: 0.75,
                    }}>
                      {milestone.label}
                    </div>

                    {/* Divider */}
                    <div style={{ width: '24px', height: '1px', background: 'rgba(196,154,60,0.3)', marginBottom: '18px' }} />

                    {/* Features */}
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {milestone.features.map((feature, fi) => (
                        <li key={fi} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          fontFamily: 'var(--font-lato)',
                          fontWeight: 300,
                          fontSize: '0.875rem',
                          lineHeight: 1.5,
                          color: 'rgba(255,255,255,0.65)',
                        }}>
                          <span style={{
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            background: 'var(--gold)',
                            opacity: 0.5,
                            flexShrink: 0,
                            marginTop: '7px',
                          }} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 640px) {
          .progress-grid {
            grid-template-columns: 1fr !important;
          }
          .progress-line {
            display: none !important;
          }
        }
      `}</style>

    </>
  );
}
