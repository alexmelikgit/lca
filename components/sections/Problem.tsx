'use client';

import { motion } from 'framer-motion';
import ArmenianDivider from '@/components/layout/ArmenianDivider';
import SectionTag from '@/components/ui/SectionTag';
import VegetableIllustration from '@/components/ui/VegetableIllustration';
import { EASE, VIEWPORT, staggerVariants } from '@/lib/animations';
import type { ProblemContent } from '@/types/content';
import type { VegetableType } from '@/components/ui/VegetableIllustration';

interface Props {
  content: ProblemContent;
}

export default function Problem({ content }: Props) {
  return (
    <>
      <ArmenianDivider variant="green" />

      <section id="problem" style={{ background: 'var(--soil-pale)', padding: '96px 24px' }}>
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
              margin: '0',
            }}>
              {content.heading}
            </h2>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '28px',
          }}>
            {content.cards.map((card, i) => (
              <motion.div
                key={card.id}
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
                    border: '1px solid rgba(139,94,60,0.1)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ marginBottom: '28px' }}>
                    <VegetableIllustration type={card.vegetable as VegetableType} size={72} />
                  </div>

                  <div style={{
                    fontFamily: 'var(--font-playfair)',
                    fontWeight: 300,
                    fontSize: '3rem',
                    lineHeight: 1,
                    color: 'var(--soil)',
                    opacity: 0.15,
                    marginBottom: '12px',
                    userSelect: 'none',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  <h3 style={{
                    fontFamily: 'var(--font-playfair)',
                    fontWeight: 400,
                    fontSize: '1.2rem',
                    lineHeight: 1.35,
                    color: 'var(--ink)',
                    margin: '0 0 14px',
                  }}>
                    {card.title}
                  </h3>

                  <p style={{
                    fontFamily: 'var(--font-lato)',
                    fontWeight: 300,
                    fontSize: '0.95rem',
                    lineHeight: 1.8,
                    color: 'var(--ink2)',
                    margin: 0,
                  }}>
                    {card.description}
                  </p>

                  <div style={{ marginTop: 'auto', paddingTop: '28px', borderTop: '1px solid rgba(139,94,60,0.1)', marginBottom: '-4px' }}>
                    <div style={{ width: '32px', height: '2px', background: 'var(--soil)', borderRadius: '2px', opacity: 0.35 }} />
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
