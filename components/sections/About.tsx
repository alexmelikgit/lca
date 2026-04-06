'use client';

import { motion } from 'framer-motion';
import ArmenianDivider from '@/components/layout/ArmenianDivider';
import SectionTag from '@/components/ui/SectionTag';
import { EASE, VIEWPORT } from '@/lib/animations';
import type { AboutContent } from '@/types/content';

interface Props {
  content: AboutContent;
}

export default function About({ content }: Props) {
  return (
    <>
      <ArmenianDivider variant="ink" />

      <section id="about" style={{ background: 'var(--green-pale)', padding: '96px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <SectionTag variant="green" style={{ marginBottom: '32px' }}>
              {content.tag}
            </SectionTag>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '48px 80px',
            alignItems: 'start',
          }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.65, ease: EASE }}
          >
            <div style={{
              background: 'white',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid rgba(90,155,80,0.15)',
              boxShadow: '0 8px 40px rgba(45,90,39,0.08)',
            }}>
              <div style={{
                aspectRatio: '1 / 1',
                background: 'linear-gradient(135deg, var(--green-pale) 0%, var(--cream) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {content.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={content.image}
                    alt={content.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: 0.3 }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--green)' }} />
                    <div style={{ width: '72px', height: '24px', borderRadius: '6px', background: 'var(--green)', opacity: 0.5 }} />
                  </div>
                )}
                <div style={{
                  position: 'absolute',
                  bottom: '14px',
                  left: '18px',
                  fontFamily: 'var(--font-lato)',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--green-deep)',
                  background: 'rgba(255,255,255,0.9)',
                  padding: '4px 12px',
                  borderRadius: '100px',
                }}>
                  {content.role}
                </div>
              </div>
              <div style={{ padding: '24px 28px 28px' }}>
                <div style={{
                  fontFamily: 'var(--font-playfair)',
                  fontWeight: 400,
                  fontSize: '1.2rem',
                  color: 'var(--ink)',
                  marginBottom: '4px',
                }}>
                  {content.name}
                </div>
                <div style={{
                  fontFamily: 'var(--font-lato)',
                  fontWeight: 400,
                  fontSize: '0.8rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--green)',
                }}>
                  {content.role}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.65, ease: EASE, delay: 0.15 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            {[content.paragraph1, content.paragraph2, content.paragraph3].map((para, i) => (
              <p key={i} style={{
                fontFamily: 'var(--font-lato)',
                fontWeight: 300,
                fontSize: '1.05rem',
                lineHeight: 1.85,
                color: 'var(--ink2)',
                margin: 0,
              }}>
                {para}
              </p>
            ))}
            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '28px', height: '1px', background: 'var(--green-mid)', opacity: 0.5 }} />
              <span style={{
                fontFamily: 'var(--font-lato)',
                fontWeight: 400,
                fontSize: '0.82rem',
                letterSpacing: '0.04em',
                color: 'var(--green)',
                opacity: 0.8,
              }}>
                {content.trustText}
              </span>
            </div>
          </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
