'use client';

import { motion } from 'framer-motion';
import ArmenianDivider from '@/components/layout/ArmenianDivider';
import SectionTag from '@/components/ui/SectionTag';
import { EASE, VIEWPORT } from '@/lib/animations';
import type { FarmerContent } from '@/types/content';

interface Props {
  content: FarmerContent;
}

export default function Farmer({ content }: Props) {
  return (
    <>
      <ArmenianDivider variant="ink" />

      <section id="farmer" style={{ background: 'var(--soil-pale)', padding: '96px 24px' }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
          gap: '48px 80px',
          alignItems: 'center',
        }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.65, ease: EASE }}
          >
            <SectionTag variant="green" style={{ marginBottom: '24px' }}>
              {content.tag}
            </SectionTag>
            <h2 style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 300,
              fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
              lineHeight: 1.25,
              color: 'var(--ink)',
              margin: '0 0 24px',
            }}>
              {content.name}
            </h2>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '28px' }}>
              {[content.region, content.experience].map((tag) => (
                <span key={tag} style={{
                  fontFamily: 'var(--font-lato)',
                  fontWeight: 400,
                  fontSize: '0.8rem',
                  letterSpacing: '0.06em',
                  color: 'var(--soil)',
                  background: 'rgba(139,94,60,0.1)',
                  border: '1px solid rgba(139,94,60,0.18)',
                  padding: '4px 12px',
                  borderRadius: '100px',
                }}>
                  {tag}
                </span>
              ))}
            </div>
            <p style={{
              fontFamily: 'var(--font-lato)',
              fontWeight: 300,
              fontSize: '1.05rem',
              lineHeight: 1.85,
              color: 'var(--ink2)',
              margin: 0,
            }}>
              {content.bio}
            </p>
            <div style={{ marginTop: '36px', width: '40px', height: '2px', background: 'var(--soil)', borderRadius: '2px', opacity: 0.3 }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
          >
            <div style={{
              background: 'var(--cream)',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid rgba(139,94,60,0.1)',
              boxShadow: '0 8px 40px rgba(26,26,20,0.08)',
            }}>
              <div style={{
                height: '240px',
                background: 'linear-gradient(135deg, var(--green-pale) 0%, var(--soil-pale) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: 0.35 }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--soil)' }} />
                  <div style={{ width: '80px', height: '32px', borderRadius: '8px', background: 'var(--soil)', opacity: 0.5 }} />
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '20px',
                  fontFamily: 'var(--font-lato)',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--soil)',
                  background: 'rgba(255,255,255,0.85)',
                  padding: '4px 12px',
                  borderRadius: '100px',
                }}>
                  {content.region}
                </div>
              </div>

              <div style={{ padding: '32px 36px 36px' }}>
                <div style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '3.5rem',
                  lineHeight: 0.8,
                  color: 'var(--gold)',
                  opacity: 0.45,
                  marginBottom: '12px',
                  userSelect: 'none',
                }}>
                  &ldquo;
                </div>
                <blockquote style={{
                  fontFamily: 'var(--font-playfair)',
                  fontWeight: 300,
                  fontStyle: 'italic',
                  fontSize: '1.15rem',
                  lineHeight: 1.65,
                  color: 'var(--ink)',
                  margin: '0 0 20px',
                }}>
                  {content.quote}
                </blockquote>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '28px', height: '1px', background: 'var(--soil)', opacity: 0.35 }} />
                  <span style={{
                    fontFamily: 'var(--font-lato)',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--soil)',
                    opacity: 0.7,
                  }}>
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
