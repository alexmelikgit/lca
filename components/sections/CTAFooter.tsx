'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ArmenianDivider from '@/components/layout/ArmenianDivider';
import SectionTag from '@/components/ui/SectionTag';
import { EASE, VIEWPORT } from '@/lib/animations';
import type { CtaFooterContent } from '@/types/content';

interface Props {
  content: CtaFooterContent;
  variant?: 'gold' | 'pomegranate';
}

export default function CTAFooter({ content, variant = 'gold' }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const goldColor = variant === 'pomegranate' ? 'var(--pomegranate)' : 'var(--gold)';
  const goldShadow = variant === 'pomegranate'
    ? '0 4px 24px rgba(139,37,53,0.3)'
    : '0 4px 24px rgba(196,154,60,0.3)';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.ok) {
        setStatus('done');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <>
      <ArmenianDivider variant="gold" />

      <section id="join" style={{ background: 'var(--green-deep)', padding: '96px 24px 104px' }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ marginBottom: '24px' }}
          >
            <SectionTag variant="gold">{content.tag}</SectionTag>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.65, ease: EASE, delay: 0.1 }}
            style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 300,
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              lineHeight: 1.2,
              color: 'white',
              margin: '0 0 20px',
            }}
          >
            {content.heading}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
            style={{
              fontFamily: 'var(--font-lato)',
              fontWeight: 300,
              fontSize: '1.05rem',
              lineHeight: 1.85,
              color: 'rgba(255,255,255,0.65)',
              margin: '0 0 40px',
            }}
          >
            {content.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
            style={{ width: '100%', marginBottom: '20px' }}
          >
            {status === 'done' ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                padding: '32px 24px',
                background: 'rgba(255,255,255,0.07)',
                borderRadius: '16px',
                border: '1px solid rgba(196,154,60,0.3)',
              }}>
                <div style={{ fontSize: '2rem' }}>✓</div>
                <p style={{
                  fontFamily: 'var(--font-playfair)',
                  fontWeight: 400,
                  fontSize: '1.2rem',
                  color: goldColor,
                  margin: 0,
                }}>
                  {content.successHeading ?? "You're on the list."}
                </p>
                <p style={{
                  fontFamily: 'var(--font-lato)',
                  fontWeight: 300,
                  fontSize: '0.9rem',
                  color: 'rgba(255,255,255,0.55)',
                  margin: 0,
                }}>
                  {content.successBody ?? "We'll reach out before the season starts."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%' }}>
                <div style={{ display: 'flex', width: '100%', maxWidth: '440px', gap: '0' }}>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={content.emailPlaceholder ?? 'your@email.com'}
                    style={{
                      flex: 1,
                      fontFamily: 'var(--font-lato)',
                      fontSize: '0.95rem',
                      fontWeight: 300,
                      color: 'var(--ink)',
                      background: 'white',
                      border: 'none',
                      borderRadius: '100px 0 0 100px',
                      padding: '15px 24px',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    style={{
                      fontFamily: 'var(--font-lato)',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--green-deep)',
                      background: goldColor,
                      border: 'none',
                      borderRadius: '0 100px 100px 0',
                      padding: '15px 28px',
                      cursor: status === 'loading' ? 'wait' : 'pointer',
                      whiteSpace: 'nowrap',
                      boxShadow: goldShadow,
                      opacity: status === 'loading' ? 0.7 : 1,
                    }}
                  >
                    {status === 'loading' ? '...' : content.buttonLabel}
                  </button>
                </div>
                {status === 'error' && (
                  <p style={{ fontFamily: 'var(--font-lato)', fontSize: '0.85rem', color: 'rgba(255,120,120,0.9)', margin: 0 }}>
                    {content.errorText ?? 'Something went wrong. Please try again.'}
                  </p>
                )}
              </form>
            )}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE, delay: 0.45 }}
            style={{
              fontFamily: 'var(--font-lato)',
              fontWeight: 300,
              fontSize: '0.85rem',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.4)',
              margin: 0,
            }}
          >
            {content.note}
          </motion.p>
        </div>
      </section>
    </>
  );
}
