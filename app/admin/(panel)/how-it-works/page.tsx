'use client';

/**
 * How It Works editor — edit how-it-works.json:
 * section tag, heading, intro text, and the four step cards.
 */

import { useState, useEffect, useCallback } from 'react';
import type { HowItWorksContent } from '@/types/content';
import AdminCard from '@/components/admin/AdminCard';
import AdminInput from '@/components/admin/AdminInput';
import AdminSaveButton from '@/components/admin/AdminSaveButton';

const STEP_LABELS = ['First step', 'Second step', 'Third step', 'Fourth step'];

export default function HowItWorksPage() {
  const [content, setContent] = useState<HowItWorksContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/content?file=how-it-works')
      .then((r) => r.json())
      .then((data: HowItWorksContent) => { setContent(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const set = useCallback(<K extends keyof HowItWorksContent>(key: K, value: HowItWorksContent[K]) => {
    setContent((prev) => prev ? { ...prev, [key]: value } : prev);
  }, []);

  const updateStep = useCallback((index: number, field: 'title' | 'description', value: string) => {
    setContent((prev) => {
      if (!prev) return prev;
      const steps = prev.steps.map((s, i) => i === index ? { ...s, [field]: value } : s);
      return { ...prev, steps };
    });
  }, []);

  const handleSave = async () => {
    const res = await fetch('/api/admin/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: 'how-it-works', content, section: 'How It Works' }),
    });
    if (!res.ok) throw new Error('Save failed');
  };

  if (loading) {
    return <div style={{ color: '#9B9B82', fontSize: '0.9rem', padding: '40px 0' }}>Loading…</div>;
  }

  if (!content) {
    return <div style={{ color: '#DC2626', fontSize: '0.9rem', padding: '40px 0' }}>Failed to load content.</div>;
  }

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#1A1A14' }}>How It Works</h1>
          <p style={{ margin: '6px 0 0', fontSize: '0.875rem', color: '#9B9B82' }}>
            Section tag, heading, intro text, and the four steps.
          </p>
        </div>
        <AdminSaveButton onClick={handleSave} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Section intro */}
        <AdminCard title="Section header" subtitle="Displayed above the four steps">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <AdminInput
              label="Tag label"
              value={content.tag}
              onChange={(e) => set('tag', e.target.value)}
              helper='Small uppercase label, e.g. "How it works"'
            />
            <AdminInput
              label="Heading"
              value={content.heading}
              onChange={(e) => set('heading', e.target.value)}
              helper='Main H2, e.g. "From plot to plate — in four steps."'
            />
            <AdminInput
              label="Intro text"
              value={content.intro}
              onChange={(e) => set('intro', e.target.value)}
              helper="Short supporting paragraph below the heading"
            />
          </div>
        </AdminCard>

        {/* Steps */}
        {content.steps.map((step, i) => (
          <AdminCard
            key={step.id}
            title={`Step ${i + 1} — ${STEP_LABELS[i]}`}
            subtitle={`Card ${i + 1} in the grid`}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <AdminInput
                label="Title"
                value={step.title}
                onChange={(e) => updateStep(i, 'title', e.target.value)}
                helper='Short action phrase, e.g. "Choose your plot"'
              />
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#6B6B58',
                    marginBottom: '6px',
                    fontFamily: 'Lato, sans-serif',
                  }}
                >
                  Description
                </label>
                <textarea
                  value={step.description}
                  onChange={(e) => updateStep(i, 'description', e.target.value)}
                  rows={3}
                  placeholder="One or two sentences explaining this step…"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '0.875rem',
                    fontFamily: 'Lato, sans-serif',
                    fontWeight: 300,
                    color: '#1A1A14',
                    border: '1px solid #D8D4C8',
                    borderRadius: '8px',
                    lineHeight: 1.6,
                    resize: 'vertical',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#C49A3C'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#D8D4C8'; }}
                />
              </div>
            </div>
          </AdminCard>
        ))}

      </div>

      {/* Sticky save footer */}
      <div style={{
        position: 'sticky',
        bottom: 0,
        background: 'linear-gradient(transparent, #F5F4F0 40%)',
        padding: '20px 0 28px',
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '16px',
      }}>
        <AdminSaveButton onClick={handleSave} />
      </div>
    </div>
  );
}
