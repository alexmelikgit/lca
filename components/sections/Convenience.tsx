'use client';

import { motion } from 'framer-motion';
import ArmenianDivider from '@/components/layout/ArmenianDivider';
import SectionTag from '@/components/ui/SectionTag';
import { EASE, VIEWPORT, staggerVariants } from '@/lib/animations';
import type { ConvenienceContent } from '@/types/content';

const ITEM_ICONS = ['◎', '◉', '◈', '✦'];

interface Props {
  content: ConvenienceContent;
}

export default function Convenience({ content }: Props) {
  return (
    <>
      <ArmenianDivider variant="ink" />

      <section id="convenience" style={{ background: 'var(--cream2)', padding: '96px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ marginBottom: '64px', maxWidth: '560px' }}
          >
            <SectionTag variant="green" style={{ marginBottom: '20px' }}>
              {content.tag}
            </SectionTag>
            <h2 style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 300,
              fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
              lineHeight: 1.25,
              color: 'var(--ink)',
              margin: '0 0 18px',
            }}>
              {content.heading}
            </h2>
            <p style={{
              fontFamily: 'var(--font-lato)',
              fontWeight: 300,
              fontSize: '1.05rem',
              lineHeight: 1.85,
              color: 'var(--ink2)',
              margin: 0,
            }}>
              {content.intro}
            </p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '24px',
          }}>
            {content.items.map((item, i) => (
              <motion.div
                key={item.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT}
                variants={staggerVariants}
              >
                <div
                  className="card-lift"
                  style={{
                    background: 'var(--cream)',
                    borderRadius: '16px',
                    padding: '36px 32px 40px',
                    border: '1px solid rgba(26,26,20,0.07)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{
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
                  }}>
                    {ITEM_ICONS[i % ITEM_ICONS.length]}
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-playfair)',
                    fontWeight: 400,
                    fontSize: '1.15rem',
                    lineHeight: 1.35,
                    color: 'var(--ink)',
                    margin: '0 0 12px',
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-lato)',
                    fontWeight: 300,
                    fontSize: '0.95rem',
                    lineHeight: 1.8,
                    color: 'var(--ink2)',
                    margin: 0,
                  }}>
                    {item.description}
                  </p>
                  <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
                    <div style={{ width: '28px', height: '2px', background: 'var(--green-mid)', borderRadius: '2px', opacity: 0.4 }} />
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
