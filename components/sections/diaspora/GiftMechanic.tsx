'use client';

import { motion } from 'framer-motion';
import ArmenianDivider from '@/components/layout/ArmenianDivider';
import SectionTag from '@/components/ui/SectionTag';
import { EASE, VIEWPORT } from '@/lib/animations';
import type { GiftMechanicContent } from '@/types/content';

interface Props {
  content: GiftMechanicContent;
}

function GiftCardMockup() {
  return (
    <div style={{
      width: '100%',
      maxWidth: '360px',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 24px 64px rgba(139,37,53,0.18), 0 4px 16px rgba(139,37,53,0.1)',
    }}>
      <div style={{
        background: 'var(--pomegranate)',
        padding: '28px 28px 24px',
      }}>
        <div style={{
          fontFamily: 'var(--font-lato)',
          fontWeight: 700,
          fontSize: '0.65rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.6)',
          marginBottom: '12px',
        }}>
          Hyeland Gift Plot
        </div>
        <div style={{
          fontFamily: 'var(--font-playfair)',
          fontWeight: 300,
          fontSize: '1.6rem',
          lineHeight: 1.2,
          color: 'white',
        }}>
          Plot #12 — Armavir
        </div>
        <div style={{
          fontFamily: 'var(--font-lato)',
          fontWeight: 300,
          fontSize: '0.85rem',
          color: 'rgba(255,255,255,0.65)',
          marginTop: '6px',
        }}>
          Tomatoes · Herbs
        </div>
      </div>

      <div style={{
        background: 'var(--cream)',
        padding: '20px 28px 24px',
        borderTop: '1px solid rgba(139,37,53,0.12)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px',
        }}>
          <div style={{
            fontFamily: 'var(--font-lato)',
            fontWeight: 700,
            fontSize: '0.65rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--ink3)',
          }}>
            Gifted by
          </div>
          <div style={{ flex: 1, height: '1px', background: 'var(--pomegranate-light)', opacity: 0.4 }} />
        </div>
        <div style={{
          fontFamily: 'var(--font-playfair)',
          fontWeight: 400,
          fontSize: '1.1rem',
          color: 'var(--ink)',
          marginBottom: '4px',
        }}>
          Armen Hakobyan
        </div>
        <div style={{
          fontFamily: 'var(--font-lato)',
          fontWeight: 300,
          fontSize: '0.82rem',
          color: 'var(--ink3)',
          marginBottom: '20px',
        }}>
          To his mother, Ani — for the land she loves
        </div>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'var(--pomegranate-pale)',
          border: '1px solid rgba(139,37,53,0.2)',
          borderRadius: '100px',
          padding: '5px 14px',
          fontFamily: 'var(--font-lato)',
          fontWeight: 700,
          fontSize: '0.68rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--pomegranate)',
        }}>
          <span style={{ fontSize: '0.75rem' }}>✦</span>
          Season 2025
        </div>
      </div>
    </div>
  );
}

export default function GiftMechanic({ content }: Props) {
  return (
    <>
      <ArmenianDivider variant="ink" />

      <section id="gift" style={{ background: 'var(--soil-pale)', padding: '96px 24px' }}>
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
              margin: '0 0 36px',
            }}>
              {content.intro}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '40px' }}>
              {content.features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.1 + i * 0.07 }}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}
                >
                  <div style={{
                    flexShrink: 0,
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--pomegranate)',
                    opacity: 0.7,
                    marginTop: '8px',
                  }} />
                  <span style={{
                    fontFamily: 'var(--font-lato)',
                    fontWeight: 300,
                    fontSize: '0.975rem',
                    lineHeight: 1.7,
                    color: 'var(--ink2)',
                  }}>
                    {feature}
                  </span>
                </motion.div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a
                href={content.ctaHref}
                className="btn-pomegranate"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: 'var(--font-lato)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'white',
                  background: 'var(--pomegranate)',
                  padding: '14px 32px',
                  borderRadius: '100px',
                  textDecoration: 'none',
                  alignSelf: 'flex-start',
                  boxShadow: '0 4px 20px rgba(139,37,53,0.22)',
                }}
              >
                {content.ctaLabel}
                <span style={{ fontSize: '1rem' }}>→</span>
              </a>
              <p style={{
                fontFamily: 'var(--font-lato)',
                fontWeight: 300,
                fontSize: '0.82rem',
                color: 'var(--ink3)',
                margin: 0,
              }}>
                {content.note}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <GiftCardMockup />
          </motion.div>
        </div>
      </section>
    </>
  );
}
