'use client';

import { motion } from 'framer-motion';
import ArmenianDivider from '@/components/layout/ArmenianDivider';
import SectionTag from '@/components/ui/SectionTag';
import { EASE, VIEWPORT, staggerVariants } from '@/lib/animations';
import type { HarvestOptionsContent } from '@/types/content';

interface Props {
  content: HarvestOptionsContent;
}

export default function HarvestOptions({ content }: Props) {
  return (
    <>
      <ArmenianDivider variant="gold" />

      <section id="harvest-options" style={{ background: 'var(--green-deep)', padding: '96px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

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
              maxWidth: '520px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              {content.intro}
            </p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
            gap: '20px',
          }}>
            {content.options.map((option, i) => (
              <motion.div
                key={option.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT}
                variants={staggerVariants}
              >
                <div
                  className="milestone-card"
                  style={{
                    borderRadius: '16px',
                    padding: '36px 28px 40px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{
                    fontFamily: 'var(--font-lato)',
                    fontSize: '1.5rem',
                    color: 'var(--gold)',
                    marginBottom: '20px',
                    lineHeight: 1,
                  }}>
                    {option.icon}
                  </div>

                  <h3 style={{
                    fontFamily: 'var(--font-playfair)',
                    fontWeight: 400,
                    fontSize: '1.2rem',
                    lineHeight: 1.3,
                    color: 'white',
                    margin: '0 0 14px',
                  }}>
                    {option.title}
                  </h3>

                  <div style={{ width: '24px', height: '1px', background: 'rgba(196,154,60,0.4)', marginBottom: '16px' }} />

                  <p style={{
                    fontFamily: 'var(--font-lato)',
                    fontWeight: 300,
                    fontSize: '0.9rem',
                    lineHeight: 1.8,
                    color: 'rgba(255,255,255,0.65)',
                    margin: 0,
                  }}>
                    {option.description}
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
