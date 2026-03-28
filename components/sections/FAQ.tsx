'use client';

/**
 * FAQ — accordion section with questions and toggled answers.
 * Cream background. Click to toggle each item open/closed.
 * Animates section in on scroll; individual answers toggle via state.
 */

import { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import ArmenianDivider from '@/components/layout/ArmenianDivider';
import SectionTag from '@/components/ui/SectionTag';
import type { FaqContent } from '@/types/content';

interface Props {
  content: FaqContent;
}

export default function FAQ({ content }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <>
      <ArmenianDivider variant="ink" />

      <section
        id="faq"
        ref={ref}
        style={{ background: 'var(--cream)', padding: '96px 24px' }}
      >
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: '56px' }}
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
                margin: 0,
              }}
            >
              {content.heading}
            </h2>
          </motion.div>

          {/* Accordion items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          >
            {content.items.map((item, i) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  style={{
                    borderBottom: '1px solid rgba(26,26,20,0.1)',
                  }}
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    aria-expanded={isOpen}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '16px',
                      padding: '24px 0',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Playfair Display, Georgia, serif',
                        fontWeight: 400,
                        fontSize: '1.05rem',
                        lineHeight: 1.4,
                        color: isOpen ? 'var(--green-deep)' : 'var(--ink)',
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {item.question}
                    </span>
                    <span
                      style={{
                        flexShrink: 0,
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: isOpen ? 'var(--green-pale)' : 'rgba(26,26,20,0.06)',
                        border: isOpen ? '1px solid var(--green-light)' : '1px solid rgba(26,26,20,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        lineHeight: 1,
                        color: isOpen ? 'var(--green)' : 'var(--ink2)',
                        transition: 'background 0.2s ease, transform 0.25s ease, color 0.2s ease, border-color 0.2s ease',
                        transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                        userSelect: 'none',
                      }}
                    >
                      +
                    </span>
                  </button>

                  <div
                    style={{
                      overflow: 'hidden',
                      maxHeight: isOpen ? '400px' : '0',
                      transition: 'max-height 0.35s ease',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: 'Lato, sans-serif',
                        fontWeight: 300,
                        fontSize: '0.975rem',
                        lineHeight: 1.85,
                        color: 'var(--ink2)',
                        margin: '0 0 24px',
                        paddingRight: '44px',
                      }}
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </>
  );
}
