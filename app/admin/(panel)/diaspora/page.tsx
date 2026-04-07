'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { DiasporaContent, DiasporaSectionVisibility } from '@/types/content';
import type { Locale } from '@/lib/i18n';
import AdminCard from '@/components/admin/AdminCard';
import AdminInput from '@/components/admin/AdminInput';
import AdminSaveButton from '@/components/admin/AdminSaveButton';
import ImageUpload from '@/components/admin/ImageUpload';
import ImagePositionPicker from '@/components/admin/ImagePositionPicker';

const TABS = [
  { id: 'hero', label: 'Hero' },
  { id: 'problem', label: 'Problem' },
  { id: 'howItWorks', label: 'How It Works' },
  { id: 'harvestOptions', label: 'Harvest Options' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'ownership', label: 'Ownership' },
  { id: 'gift', label: 'Gift' },
  { id: 'phaseTwo', label: 'Phase Two' },
  { id: 'progress', label: 'Progress' },
  { id: 'farmer', label: 'Farmer' },
  { id: 'seasonal', label: 'Seasonal' },
  { id: 'trust', label: 'Trust' },
  { id: 'faq', label: 'FAQ' },
  { id: 'about', label: 'About' },
  { id: 'cta', label: 'CTA' },
] as const;

type TabId = (typeof TABS)[number]['id'];

const TAB_VIS: Record<TabId, keyof DiasporaSectionVisibility> = {
  hero: 'hero',
  problem: 'problem',
  howItWorks: 'howItWorks',
  harvestOptions: 'harvestOptions',
  dashboard: 'dashboardShowcase',
  ownership: 'ownership',
  gift: 'giftMechanic',
  phaseTwo: 'phaseTwo',
  progress: 'progress',
  farmer: 'farmer',
  seasonal: 'seasonal',
  trust: 'trust',
  faq: 'faq',
  about: 'about',
  cta: 'ctaFooter',
};

const textareaStyle: React.CSSProperties = {
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
  background: 'white',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: '#6B6B58',
  marginBottom: '6px',
  fontFamily: 'Lato, sans-serif',
};

const addBtnStyle: React.CSSProperties = {
  padding: '10px 24px',
  background: 'transparent',
  color: '#8B2535',
  border: '1px dashed #8B2535',
  borderRadius: '8px',
  fontSize: '0.85rem',
  fontFamily: 'Lato, sans-serif',
  cursor: 'pointer',
  width: '100%',
};

const removeBtnStyle: React.CSSProperties = {
  padding: '6px 16px',
  background: 'transparent',
  color: '#DC2626',
  border: '1px solid #FCA5A5',
  borderRadius: '6px',
  fontSize: '0.78rem',
  fontFamily: 'Lato, sans-serif',
  cursor: 'pointer',
};

function VisibilityBanner({ visible, onToggle }: { visible: boolean; onToggle: () => void }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      borderRadius: '10px',
      background: visible ? 'rgba(61,122,53,0.06)' : 'rgba(139,94,60,0.06)',
      border: `1px solid ${visible ? 'rgba(61,122,53,0.2)' : 'rgba(139,94,60,0.2)'}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: visible ? '#3D7A35' : '#9B9B82',
          display: 'inline-block', flexShrink: 0,
        }} />
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: visible ? '#3D7A35' : '#8B5E3C', fontFamily: 'Lato, sans-serif' }}>
            {visible ? 'Section is visible' : 'Section is hidden'}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#9B9B82', fontFamily: 'Lato, sans-serif' }}>
            {visible ? 'Showing on the live page' : 'Not shown on the live page'}
          </div>
        </div>
      </div>
      <button
        onClick={onToggle}
        style={{
          padding: '6px 16px',
          borderRadius: '6px',
          border: '1px solid',
          borderColor: visible ? '#DC2626' : '#3D7A35',
          background: 'white',
          color: visible ? '#DC2626' : '#3D7A35',
          fontSize: '0.72rem',
          fontWeight: 700,
          fontFamily: 'Lato, sans-serif',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        {visible ? 'Hide section' : 'Show section'}
      </button>
    </div>
  );
}

function TextareaField({
  label, value, onChange, rows = 3,
}: {
  label: string; value: string; onChange: (val: string) => void; rows?: number;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={labelStyle}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        style={textareaStyle}
        onFocus={(e) => { e.target.style.borderColor = '#8B2535'; e.target.style.boxShadow = '0 0 0 3px rgba(139,37,53,0.1)'; }}
        onBlur={(e) => { e.target.style.borderColor = '#D8D4C8'; e.target.style.boxShadow = 'none'; }}
      />
    </div>
  );
}

const EMOJI_PRESETS = [
  '🌾','🌿','🍅','🥕','🫙','📦','✈️','🎁','🏔️','🌱',
  '🍇','🌻','🥦','🍋','🫐','🍓','🧅','🌽','🥒','🧄',
  '🍎','🥝','🍊','🫒','🌰','🫚','🧺','🚜','🌍','💌',
];

function EmojiPicker({ value, onChange }: { value: string; onChange: (emoji: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={ref}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          style={{
            width: '40px', height: '40px', borderRadius: '8px',
            border: '1px solid #D8D4C8', background: 'white',
            fontSize: '1.2rem', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          {value || '🌾'}
        </button>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="or type"
          style={{
            width: '80px', padding: '8px 10px', fontSize: '0.875rem',
            fontFamily: 'Lato, sans-serif', border: '1px solid #D8D4C8',
            borderRadius: '8px', outline: 'none',
          }}
        />
      </div>
      {open && (
        <div style={{
          position: 'absolute', top: '48px', left: 0, zIndex: 50,
          background: 'white', border: '1px solid #E8E4DC',
          borderRadius: '12px', padding: '12px',
          boxShadow: '0 8px 32px rgba(26,26,20,0.12)',
          display: 'grid', gridTemplateColumns: 'repeat(10, 32px)',
          gap: '4px',
        }}>
          {EMOJI_PRESETS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => { onChange(emoji); setOpen(false); }}
              style={{
                width: '32px', height: '32px', fontSize: '1.1rem',
                background: value === emoji ? 'rgba(139,37,53,0.08)' : 'transparent',
                border: value === emoji ? '1px solid rgba(139,37,53,0.3)' : '1px solid transparent',
                borderRadius: '6px', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DiasporaPage() {
  const [locale, setLocale] = useState<Locale>('en');
  const [content, setContent] = useState<DiasporaContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('hero');
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/content?file=diaspora&locale=${locale}`)
      .then((r) => r.json())
      .then((data: DiasporaContent) => { setContent(data); setLoading(false); setIsDirty(false); })
      .catch(() => setLoading(false));
  }, [locale]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { if (isDirty) e.preventDefault(); };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  const handleSave = async () => {
    const res = await fetch('/api/admin/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: 'diaspora', locale, content, section: 'Diaspora Page' }),
    });
    if (!res.ok) throw new Error('Save failed');
    setIsDirty(false);
  };

  const update = useCallback(<K extends keyof DiasporaContent>(section: K, value: DiasporaContent[K]) => {
    setContent((prev) => prev ? { ...prev, [section]: value } : prev);
    setIsDirty(true);
  }, []);

  const toggleVisibility = useCallback((key: keyof DiasporaSectionVisibility) => {
    setContent((prev) => prev ? {
      ...prev,
      sectionVisibility: { ...prev.sectionVisibility, [key]: !prev.sectionVisibility[key] },
    } : prev);
    setIsDirty(true);
  }, []);

  if (loading) return <div style={{ color: '#9B9B82', fontSize: '0.9rem', padding: '40px 0' }}>Loading…</div>;
  if (!content) return <div style={{ color: '#DC2626', fontSize: '0.9rem', padding: '40px 0' }}>Failed to load content.</div>;

  return (
    <div>
      {/* Locale selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {(['en', 'hy'] as Locale[]).map((l) => (
          <button
            key={l}
            onClick={() => setLocale(l)}
            style={{
              padding: '6px 16px', borderRadius: '6px', border: '1px solid',
              borderColor: locale === l ? '#8B2535' : '#D8D4C8',
              background: locale === l ? '#8B2535' : 'white',
              color: locale === l ? 'white' : '#1A1A14',
              fontFamily: 'Lato, sans-serif', fontWeight: 700, fontSize: '0.75rem',
              letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
            }}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Page header */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#1A1A14' }}>Diaspora Page</h1>
          <p style={{ margin: '6px 0 0', fontSize: '0.875rem', color: '#9B9B82' }}>
            All sections of the diaspora landing page.
          </p>
        </div>
        <AdminSaveButton onClick={handleSave} />
      </div>

      {/* Unsaved changes banner */}
      {isDirty && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 16px', marginBottom: '16px', borderRadius: '8px',
          background: 'rgba(196,154,60,0.1)', border: '1px solid rgba(196,154,60,0.3)',
        }}>
          <span style={{ fontSize: '0.8rem', color: '#8B6914', fontFamily: 'Lato, sans-serif' }}>
            ⚠ You have unsaved changes
          </span>
          <AdminSaveButton onClick={handleSave} />
        </div>
      )}

      {/* Tab bar */}
      <div style={{
        display: 'flex', gap: '6px', overflowX: 'auto', padding: '0 0 16px',
        scrollbarWidth: 'none', marginBottom: '24px', borderBottom: '1px solid #E8E4DC',
      }}>
        {TABS.map((tab) => {
          const visKey = TAB_VIS[tab.id];
          const isVisible = content.sectionVisibility[visKey];
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flexShrink: 0, padding: '8px 18px',
                background: activeTab === tab.id ? '#8B2535' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#6B6B58',
                border: activeTab === tab.id ? '1px solid #8B2535' : '1px solid #D8D4C8',
                borderRadius: '100px', fontSize: '0.8rem',
                fontWeight: activeTab === tab.id ? 700 : 400,
                fontFamily: 'Lato, sans-serif', letterSpacing: '0.04em',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px',
                transition: 'background 0.15s ease, color 0.15s ease, border-color 0.15s ease',
              }}
            >
              {tab.label}
              <span style={{
                width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
                background: isVisible
                  ? (activeTab === tab.id ? 'rgba(255,255,255,0.75)' : '#3D7A35')
                  : (activeTab === tab.id ? 'rgba(255,255,255,0.4)' : '#C4B89A'),
              }} />
            </button>
          );
        })}
      </div>

      {/* Visibility toggle */}
      <div style={{ marginBottom: '20px' }}>
        <VisibilityBanner
          visible={content.sectionVisibility[TAB_VIS[activeTab]]}
          onToggle={() => toggleVisibility(TAB_VIS[activeTab])}
        />
      </div>

      {/* Tab content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* ── HERO ─────────────────────────────────────────── */}
        {activeTab === 'hero' && (
          <>
            <AdminCard title="Hero — Text content" subtitle="Tag, headline, subtitle">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <AdminInput label="Tag" value={content.hero.tag}
                  onChange={(e) => update('hero', { ...content.hero, tag: e.target.value })} />
                <AdminInput label="H1 Line 1" value={content.hero.h1Line1}
                  onChange={(e) => update('hero', { ...content.hero, h1Line1: e.target.value })} />
                <AdminInput label="H1 Line 2" value={content.hero.h1Line2}
                  onChange={(e) => update('hero', { ...content.hero, h1Line2: e.target.value })} />
                <AdminInput label="H1 Italic line" value={content.hero.h1Italic}
                  onChange={(e) => update('hero', { ...content.hero, h1Italic: e.target.value })} />
                <TextareaField label="Subtitle" value={content.hero.subtitle} rows={4}
                  onChange={(val) => update('hero', { ...content.hero, subtitle: val })} />
              </div>
            </AdminCard>
            <AdminCard title="Hero — CTAs">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <AdminInput label="Primary CTA label" value={content.hero.primaryCtaLabel}
                  onChange={(e) => update('hero', { ...content.hero, primaryCtaLabel: e.target.value })} />
                <AdminInput label="Primary CTA href" value={content.hero.primaryCtaHref}
                  onChange={(e) => update('hero', { ...content.hero, primaryCtaHref: e.target.value })} />
                <AdminInput label="Secondary CTA label" value={content.hero.secondaryCtaLabel}
                  onChange={(e) => update('hero', { ...content.hero, secondaryCtaLabel: e.target.value })} />
                <AdminInput label="Secondary CTA href" value={content.hero.secondaryCtaHref}
                  onChange={(e) => update('hero', { ...content.hero, secondaryCtaHref: e.target.value })} />
              </div>
            </AdminCard>
            <AdminCard title="Hero — Stats">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {content.hero.stats.map((stat, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px' }}>
                    <AdminInput label={`Stat ${i + 1} value`} value={stat.value} style={{ flex: 1 }}
                      onChange={(e) => {
                        const stats = content.hero.stats.map((s, si) => si === i ? { ...s, value: e.target.value } : s);
                        update('hero', { ...content.hero, stats });
                      }} />
                    <AdminInput label={`Stat ${i + 1} label`} value={stat.label} style={{ flex: 2 }}
                      onChange={(e) => {
                        const stats = content.hero.stats.map((s, si) => si === i ? { ...s, label: e.target.value } : s);
                        update('hero', { ...content.hero, stats });
                      }} />
                  </div>
                ))}
              </div>
            </AdminCard>
          </>
        )}

        {/* ── PROBLEM ──────────────────────────────────────── */}
        {activeTab === 'problem' && (
          <>
            <AdminCard title="Problem — Header">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <AdminInput label="Tag" value={content.problem.tag}
                  onChange={(e) => update('problem', { ...content.problem, tag: e.target.value })} />
                <AdminInput label="Heading" value={content.problem.heading}
                  onChange={(e) => update('problem', { ...content.problem, heading: e.target.value })} />
              </div>
            </AdminCard>
            {content.problem.cards.map((card, i) => (
              <AdminCard key={card.id} title={`Problem card ${i + 1}`} subtitle={`Vegetable: ${card.vegetable}`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <AdminInput label="Vegetable type" value={card.vegetable} helper="tomato | cucumber | greens"
                    onChange={(e) => {
                      const cards = content.problem.cards.map((c, ci) => ci === i ? { ...c, vegetable: e.target.value } : c);
                      update('problem', { ...content.problem, cards });
                    }} />
                  <AdminInput label="Title" value={card.title}
                    onChange={(e) => {
                      const cards = content.problem.cards.map((c, ci) => ci === i ? { ...c, title: e.target.value } : c);
                      update('problem', { ...content.problem, cards });
                    }} />
                  <TextareaField label="Description" value={card.description}
                    onChange={(val) => {
                      const cards = content.problem.cards.map((c, ci) => ci === i ? { ...c, description: val } : c);
                      update('problem', { ...content.problem, cards });
                    }} />
                </div>
              </AdminCard>
            ))}
          </>
        )}

        {/* ── HOW IT WORKS ─────────────────────────────────── */}
        {activeTab === 'howItWorks' && (
          <>
            <AdminCard title="How It Works — Header">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <AdminInput label="Tag" value={content.howItWorks.tag}
                  onChange={(e) => update('howItWorks', { ...content.howItWorks, tag: e.target.value })} />
                <AdminInput label="Heading" value={content.howItWorks.heading}
                  onChange={(e) => update('howItWorks', { ...content.howItWorks, heading: e.target.value })} />
                <TextareaField label="Intro" value={content.howItWorks.intro}
                  onChange={(val) => update('howItWorks', { ...content.howItWorks, intro: val })} />
              </div>
            </AdminCard>
            {content.howItWorks.steps.map((step, i) => (
              <AdminCard key={step.id} title={`Step ${i + 1} — ${step.title}`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <AdminInput label="Title" value={step.title}
                    onChange={(e) => {
                      const steps = content.howItWorks.steps.map((s, si) => si === i ? { ...s, title: e.target.value } : s);
                      update('howItWorks', { ...content.howItWorks, steps });
                    }} />
                  <TextareaField label="Description" value={step.description}
                    onChange={(val) => {
                      const steps = content.howItWorks.steps.map((s, si) => si === i ? { ...s, description: val } : s);
                      update('howItWorks', { ...content.howItWorks, steps });
                    }} />
                </div>
              </AdminCard>
            ))}
          </>
        )}

        {/* ── DASHBOARD ────────────────────────────────────── */}
        {activeTab === 'dashboard' && (
          <AdminCard title="Dashboard — Showcase section">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <AdminInput label="Tag" value={content.dashboardShowcase.tag}
                onChange={(e) => update('dashboardShowcase', { ...content.dashboardShowcase, tag: e.target.value })} />
              <AdminInput label="Heading" value={content.dashboardShowcase.heading}
                onChange={(e) => update('dashboardShowcase', { ...content.dashboardShowcase, heading: e.target.value })} />
              <TextareaField label="Intro" value={content.dashboardShowcase.intro} rows={3}
                onChange={(val) => update('dashboardShowcase', { ...content.dashboardShowcase, intro: val })} />
              <TextareaField
                label="Features (one per line)"
                value={content.dashboardShowcase.features.join('\n')}
                rows={content.dashboardShowcase.features.length + 1}
                onChange={(val) => update('dashboardShowcase', { ...content.dashboardShowcase, features: val.split('\n') })}
              />
            </div>
          </AdminCard>
        )}

      </div>
    </div>
  );
}
