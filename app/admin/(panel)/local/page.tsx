'use client';

/**
 * Local Page editor — tabbed admin for all sections of local.json.
 * Tabs: Hero | Problem | Health | Convenience | Progress | Farmer |
 *       Seasonal | Trust | FAQ | About | CTA
 * All content loaded and saved as a single local.json file.
 */

import { useState, useEffect, useCallback } from 'react';
import type { LocalContent } from '@/types/content';
import type { Locale } from '@/lib/i18n';
import AdminCard from '@/components/admin/AdminCard';
import AdminInput from '@/components/admin/AdminInput';
import AdminSaveButton from '@/components/admin/AdminSaveButton';

const TABS = [
  { id: 'hero', label: 'Hero' },
  { id: 'problem', label: 'Problem' },
  { id: 'howItWorks', label: 'How It Works' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'health', label: 'Health' },
  { id: 'convenience', label: 'Convenience' },
  { id: 'progress', label: 'Progress' },
  { id: 'farmer', label: 'Farmer' },
  { id: 'seasonal', label: 'Seasonal' },
  { id: 'trust', label: 'Trust' },
  { id: 'faq', label: 'FAQ' },
  { id: 'about', label: 'About' },
  { id: 'cta', label: 'CTA' },
] as const;

type TabId = (typeof TABS)[number]['id'];

/* ── Shared textarea style matching AdminInput ──────────────── */
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

function TextareaField({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  rows?: number;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={labelStyle}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        style={textareaStyle}
        onFocus={(e) => { e.target.style.borderColor = '#C49A3C'; e.target.style.boxShadow = '0 0 0 3px rgba(196,154,60,0.12)'; }}
        onBlur={(e) => { e.target.style.borderColor = '#D8D4C8'; e.target.style.boxShadow = 'none'; }}
      />
    </div>
  );
}

export default function LocalPage() {
  const [locale, setLocale] = useState<Locale>('en');
  const [content, setContent] = useState<LocalContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('hero');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/content?file=local&locale=${locale}`)
      .then((r) => r.json())
      .then((data: LocalContent) => { setContent(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [locale]);

  const handleSave = async () => {
    const res = await fetch('/api/admin/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: 'local', locale, content, section: 'Local Page' }),
    });
    if (!res.ok) throw new Error('Save failed');
  };

  const update = useCallback(<K extends keyof LocalContent>(section: K, value: LocalContent[K]) => {
    setContent((prev) => prev ? { ...prev, [section]: value } : prev);
  }, []);

  if (loading) {
    return <div style={{ color: '#9B9B82', fontSize: '0.9rem', padding: '40px 0' }}>Loading…</div>;
  }
  if (!content) {
    return <div style={{ color: '#DC2626', fontSize: '0.9rem', padding: '40px 0' }}>Failed to load content.</div>;
  }

  return (
    <div>
      {/* Locale selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {(['en', 'hy'] as Locale[]).map((l) => (
          <button
            key={l}
            onClick={() => setLocale(l)}
            style={{
              padding: '6px 16px',
              borderRadius: '6px',
              border: '1px solid',
              borderColor: locale === l ? 'var(--green)' : '#D8D4C8',
              background: locale === l ? 'var(--green)' : 'white',
              color: locale === l ? 'white' : 'var(--ink)',
              fontFamily: 'Lato, sans-serif',
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>
      {/* Page header */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#1A1A14' }}>Local Page</h1>
          <p style={{ margin: '6px 0 0', fontSize: '0.875rem', color: '#9B9B82' }}>
            All sections of the local residents landing page.
          </p>
        </div>
        <AdminSaveButton onClick={handleSave} />
      </div>

      {/* Tab bar */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          padding: '0 0 16px',
          scrollbarWidth: 'none',
          marginBottom: '24px',
          borderBottom: '1px solid #E8E4DC',
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flexShrink: 0,
              padding: '8px 18px',
              background: activeTab === tab.id ? '#C49A3C' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#6B6B58',
              border: activeTab === tab.id ? '1px solid #C49A3C' : '1px solid #D8D4C8',
              borderRadius: '100px',
              fontSize: '0.8rem',
              fontWeight: activeTab === tab.id ? 700 : 400,
              fontFamily: 'Lato, sans-serif',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              transition: 'background 0.15s ease, color 0.15s ease, border-color 0.15s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* ── HERO ─────────────────────────────────────────── */}
        {activeTab === 'hero' && (
          <>
            <AdminCard title="Hero — Text content" subtitle="Tag, headline, subtitle">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <AdminInput
                  label="Tag"
                  value={content.hero.tag}
                  onChange={(e) => update('hero', { ...content.hero, tag: e.target.value })}
                />
                <AdminInput
                  label="H1 Line 1"
                  value={content.hero.h1Line1}
                  onChange={(e) => update('hero', { ...content.hero, h1Line1: e.target.value })}
                />
                <AdminInput
                  label="H1 Line 2"
                  value={content.hero.h1Line2}
                  onChange={(e) => update('hero', { ...content.hero, h1Line2: e.target.value })}
                />
                <AdminInput
                  label="H1 Italic line"
                  value={content.hero.h1Italic}
                  onChange={(e) => update('hero', { ...content.hero, h1Italic: e.target.value })}
                />
                <TextareaField
                  label="Subtitle"
                  value={content.hero.subtitle}
                  onChange={(val) => update('hero', { ...content.hero, subtitle: val })}
                  rows={4}
                />
              </div>
            </AdminCard>

            <AdminCard title="Hero — CTAs">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <AdminInput
                  label="Primary CTA label"
                  value={content.hero.primaryCtaLabel}
                  onChange={(e) => update('hero', { ...content.hero, primaryCtaLabel: e.target.value })}
                />
                <AdminInput
                  label="Primary CTA href"
                  value={content.hero.primaryCtaHref}
                  onChange={(e) => update('hero', { ...content.hero, primaryCtaHref: e.target.value })}
                />
                <AdminInput
                  label="Secondary CTA label"
                  value={content.hero.secondaryCtaLabel}
                  onChange={(e) => update('hero', { ...content.hero, secondaryCtaLabel: e.target.value })}
                />
                <AdminInput
                  label="Secondary CTA href"
                  value={content.hero.secondaryCtaHref}
                  onChange={(e) => update('hero', { ...content.hero, secondaryCtaHref: e.target.value })}
                />
              </div>
            </AdminCard>

            <AdminCard title="Hero — Stats" subtitle="Three trust stats displayed below the CTAs">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {content.hero.stats.map((stat, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px' }}>
                    <AdminInput
                      label={`Stat ${i + 1} value`}
                      value={stat.value}
                      onChange={(e) => {
                        const stats = content.hero.stats.map((s, si) => si === i ? { ...s, value: e.target.value } : s);
                        update('hero', { ...content.hero, stats });
                      }}
                      style={{ flex: 1 }}
                    />
                    <AdminInput
                      label={`Stat ${i + 1} label`}
                      value={stat.label}
                      onChange={(e) => {
                        const stats = content.hero.stats.map((s, si) => si === i ? { ...s, label: e.target.value } : s);
                        update('hero', { ...content.hero, stats });
                      }}
                      style={{ flex: 2 }}
                    />
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
                <AdminInput
                  label="Tag"
                  value={content.problem.tag}
                  onChange={(e) => update('problem', { ...content.problem, tag: e.target.value })}
                />
                <AdminInput
                  label="Heading"
                  value={content.problem.heading}
                  onChange={(e) => update('problem', { ...content.problem, heading: e.target.value })}
                />
              </div>
            </AdminCard>

            {content.problem.cards.map((card, i) => (
              <AdminCard key={card.id} title={`Problem card ${i + 1}`} subtitle={`Vegetable: ${card.vegetable}`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <AdminInput
                    label="Vegetable type"
                    value={card.vegetable}
                    onChange={(e) => {
                      const cards = content.problem.cards.map((c, ci) => ci === i ? { ...c, vegetable: e.target.value } : c);
                      update('problem', { ...content.problem, cards });
                    }}
                    helper='tomato | cucumber | greens'
                  />
                  <AdminInput
                    label="Title"
                    value={card.title}
                    onChange={(e) => {
                      const cards = content.problem.cards.map((c, ci) => ci === i ? { ...c, title: e.target.value } : c);
                      update('problem', { ...content.problem, cards });
                    }}
                  />
                  <TextareaField
                    label="Description"
                    value={card.description}
                    onChange={(val) => {
                      const cards = content.problem.cards.map((c, ci) => ci === i ? { ...c, description: val } : c);
                      update('problem', { ...content.problem, cards });
                    }}
                  />
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
                <AdminInput
                  label="Tag"
                  value={content.howItWorks.tag}
                  onChange={(e) => update('howItWorks', { ...content.howItWorks, tag: e.target.value })}
                />
                <AdminInput
                  label="Heading"
                  value={content.howItWorks.heading}
                  onChange={(e) => update('howItWorks', { ...content.howItWorks, heading: e.target.value })}
                />
                <TextareaField
                  label="Intro"
                  value={content.howItWorks.intro}
                  onChange={(val) => update('howItWorks', { ...content.howItWorks, intro: val })}
                />
              </div>
            </AdminCard>

            {content.howItWorks.steps.map((step, i) => (
              <AdminCard key={step.id} title={`Step ${i + 1} — ${step.title}`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <AdminInput
                    label="Title"
                    value={step.title}
                    onChange={(e) => {
                      const steps = content.howItWorks.steps.map((s, si) => si === i ? { ...s, title: e.target.value } : s);
                      update('howItWorks', { ...content.howItWorks, steps });
                    }}
                  />
                  <TextareaField
                    label="Description"
                    value={step.description}
                    onChange={(val) => {
                      const steps = content.howItWorks.steps.map((s, si) => si === i ? { ...s, description: val } : s);
                      update('howItWorks', { ...content.howItWorks, steps });
                    }}
                  />
                </div>
              </AdminCard>
            ))}
          </>
        )}

        {/* ── DASHBOARD ────────────────────────────────────── */}
        {activeTab === 'dashboard' && (
          <AdminCard title="Dashboard — Showcase section" subtitle="Dark green section between How It Works and Health">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <AdminInput
                label="Tag"
                value={content.dashboardShowcase.tag}
                onChange={(e) => update('dashboardShowcase', { ...content.dashboardShowcase, tag: e.target.value })}
              />
              <AdminInput
                label="Heading"
                value={content.dashboardShowcase.heading}
                onChange={(e) => update('dashboardShowcase', { ...content.dashboardShowcase, heading: e.target.value })}
              />
              <TextareaField
                label="Intro"
                value={content.dashboardShowcase.intro}
                onChange={(val) => update('dashboardShowcase', { ...content.dashboardShowcase, intro: val })}
                rows={3}
              />
              <TextareaField
                label="Features (one per line)"
                value={content.dashboardShowcase.features.join('\n')}
                onChange={(val) => update('dashboardShowcase', { ...content.dashboardShowcase, features: val.split('\n') })}
                rows={content.dashboardShowcase.features.length + 1}
              />
            </div>
          </AdminCard>
        )}

        {/* ── HEALTH ───────────────────────────────────────── */}
        {activeTab === 'health' && (
          <>
            <AdminCard title="Health — Header">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <AdminInput
                  label="Tag"
                  value={content.health.tag}
                  onChange={(e) => update('health', { ...content.health, tag: e.target.value })}
                />
                <AdminInput
                  label="Heading"
                  value={content.health.heading}
                  onChange={(e) => update('health', { ...content.health, heading: e.target.value })}
                />
                <TextareaField
                  label="Intro"
                  value={content.health.intro}
                  onChange={(val) => update('health', { ...content.health, intro: val })}
                />
              </div>
            </AdminCard>

            {content.health.items.map((item, i) => (
              <AdminCard key={item.id} title={`Health item ${i + 1} — ${item.title}`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <AdminInput
                    label="Icon"
                    value={item.icon}
                    onChange={(e) => {
                      const items = content.health.items.map((it, ii) => ii === i ? { ...it, icon: e.target.value } : it);
                      update('health', { ...content.health, items });
                    }}
                    helper='Unicode symbol, e.g. ✦ ◎ ◈ ◉'
                  />
                  <AdminInput
                    label="Title"
                    value={item.title}
                    onChange={(e) => {
                      const items = content.health.items.map((it, ii) => ii === i ? { ...it, title: e.target.value } : it);
                      update('health', { ...content.health, items });
                    }}
                  />
                  <TextareaField
                    label="Description"
                    value={item.description}
                    onChange={(val) => {
                      const items = content.health.items.map((it, ii) => ii === i ? { ...it, description: val } : it);
                      update('health', { ...content.health, items });
                    }}
                  />
                </div>
              </AdminCard>
            ))}
          </>
        )}

        {/* ── CONVENIENCE ──────────────────────────────────── */}
        {activeTab === 'convenience' && (
          <>
            <AdminCard title="Convenience — Header">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <AdminInput
                  label="Tag"
                  value={content.convenience.tag}
                  onChange={(e) => update('convenience', { ...content.convenience, tag: e.target.value })}
                />
                <AdminInput
                  label="Heading"
                  value={content.convenience.heading}
                  onChange={(e) => update('convenience', { ...content.convenience, heading: e.target.value })}
                />
                <TextareaField
                  label="Intro"
                  value={content.convenience.intro}
                  onChange={(val) => update('convenience', { ...content.convenience, intro: val })}
                />
              </div>
            </AdminCard>

            {content.convenience.items.map((item, i) => (
              <AdminCard key={item.id} title={`Convenience item ${i + 1} — ${item.title}`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <AdminInput
                    label="Title"
                    value={item.title}
                    onChange={(e) => {
                      const items = content.convenience.items.map((it, ii) => ii === i ? { ...it, title: e.target.value } : it);
                      update('convenience', { ...content.convenience, items });
                    }}
                  />
                  <TextareaField
                    label="Description"
                    value={item.description}
                    onChange={(val) => {
                      const items = content.convenience.items.map((it, ii) => ii === i ? { ...it, description: val } : it);
                      update('convenience', { ...content.convenience, items });
                    }}
                  />
                </div>
              </AdminCard>
            ))}
          </>
        )}

        {/* ── PROGRESS ─────────────────────────────────────── */}
        {activeTab === 'progress' && (
          <>
            <AdminCard title="Progress — Header">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <AdminInput
                  label="Tag"
                  value={content.progress.tag}
                  onChange={(e) => update('progress', { ...content.progress, tag: e.target.value })}
                />
                <AdminInput
                  label="Heading"
                  value={content.progress.heading}
                  onChange={(e) => update('progress', { ...content.progress, heading: e.target.value })}
                />
                <TextareaField
                  label="Intro"
                  value={content.progress.intro}
                  onChange={(val) => update('progress', { ...content.progress, intro: val })}
                />
              </div>
            </AdminCard>

            {content.progress.milestones.map((milestone, i) => (
              <AdminCard key={milestone.id} title={`Milestone — ${milestone.year}`} subtitle={milestone.label}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <AdminInput
                    label="Year"
                    value={milestone.year}
                    onChange={(e) => {
                      const milestones = content.progress.milestones.map((m, mi) => mi === i ? { ...m, year: e.target.value } : m);
                      update('progress', { ...content.progress, milestones });
                    }}
                  />
                  <AdminInput
                    label="Plot size"
                    value={milestone.size}
                    onChange={(e) => {
                      const milestones = content.progress.milestones.map((m, mi) => mi === i ? { ...m, size: e.target.value } : m);
                      update('progress', { ...content.progress, milestones });
                    }}
                  />
                  <AdminInput
                    label="Label"
                    value={milestone.label}
                    onChange={(e) => {
                      const milestones = content.progress.milestones.map((m, mi) => mi === i ? { ...m, label: e.target.value } : m);
                      update('progress', { ...content.progress, milestones });
                    }}
                  />
                  <TextareaField
                    label="Features (one per line)"
                    value={milestone.features.join('\n')}
                    onChange={(val) => {
                      const features = val.split('\n');
                      const milestones = content.progress.milestones.map((m, mi) => mi === i ? { ...m, features } : m);
                      update('progress', { ...content.progress, milestones });
                    }}
                    rows={milestone.features.length + 1}
                  />
                </div>
              </AdminCard>
            ))}
          </>
        )}

        {/* ── FARMER ───────────────────────────────────────── */}
        {activeTab === 'farmer' && (
          <AdminCard title="Farmer — Profile">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <AdminInput
                label="Tag"
                value={content.farmer.tag}
                onChange={(e) => update('farmer', { ...content.farmer, tag: e.target.value })}
              />
              <AdminInput
                label="Name"
                value={content.farmer.name}
                onChange={(e) => update('farmer', { ...content.farmer, name: e.target.value })}
              />
              <AdminInput
                label="Region"
                value={content.farmer.region}
                onChange={(e) => update('farmer', { ...content.farmer, region: e.target.value })}
              />
              <AdminInput
                label="Experience"
                value={content.farmer.experience}
                onChange={(e) => update('farmer', { ...content.farmer, experience: e.target.value })}
              />
              <TextareaField
                label="Quote"
                value={content.farmer.quote}
                onChange={(val) => update('farmer', { ...content.farmer, quote: val })}
                rows={2}
              />
              <TextareaField
                label="Bio"
                value={content.farmer.bio}
                onChange={(val) => update('farmer', { ...content.farmer, bio: val })}
                rows={5}
              />
            </div>
          </AdminCard>
        )}

        {/* ── SEASONAL ─────────────────────────────────────── */}
        {activeTab === 'seasonal' && (
          <>
            <AdminCard title="Seasonal — Header">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <AdminInput
                  label="Tag"
                  value={content.seasonal.tag}
                  onChange={(e) => update('seasonal', { ...content.seasonal, tag: e.target.value })}
                />
                <AdminInput
                  label="Heading"
                  value={content.seasonal.heading}
                  onChange={(e) => update('seasonal', { ...content.seasonal, heading: e.target.value })}
                />
                <TextareaField
                  label="Intro"
                  value={content.seasonal.intro}
                  onChange={(val) => update('seasonal', { ...content.seasonal, intro: val })}
                />
              </div>
            </AdminCard>

            {content.seasonal.seasons.map((season, i) => (
              <AdminCard key={season.id} title={`Season — ${season.name}`} subtitle={season.months}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <AdminInput
                    label="Season name"
                    value={season.name}
                    onChange={(e) => {
                      const seasons = content.seasonal.seasons.map((s, si) => si === i ? { ...s, name: e.target.value } : s);
                      update('seasonal', { ...content.seasonal, seasons });
                    }}
                  />
                  <AdminInput
                    label="Months"
                    value={season.months}
                    onChange={(e) => {
                      const seasons = content.seasonal.seasons.map((s, si) => si === i ? { ...s, months: e.target.value } : s);
                      update('seasonal', { ...content.seasonal, seasons });
                    }}
                    helper='e.g. Mar – May'
                  />
                  <AdminInput
                    label="Accent color"
                    value={season.color}
                    onChange={(e) => {
                      const seasons = content.seasonal.seasons.map((s, si) => si === i ? { ...s, color: e.target.value } : s);
                      update('seasonal', { ...content.seasonal, seasons });
                    }}
                    helper='Hex color code, e.g. #5A9B50'
                  />
                  <TextareaField
                    label="Crops (one per line)"
                    value={season.crops.join('\n')}
                    onChange={(val) => {
                      const crops = val.split('\n');
                      const seasons = content.seasonal.seasons.map((s, si) => si === i ? { ...s, crops } : s);
                      update('seasonal', { ...content.seasonal, seasons });
                    }}
                    rows={season.crops.length + 1}
                  />
                </div>
              </AdminCard>
            ))}
          </>
        )}

        {/* ── TRUST ────────────────────────────────────────── */}
        {activeTab === 'trust' && (
          <>
            <AdminCard title="Trust — Header">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <AdminInput
                  label="Tag"
                  value={content.trust.tag}
                  onChange={(e) => update('trust', { ...content.trust, tag: e.target.value })}
                />
                <AdminInput
                  label="Heading"
                  value={content.trust.heading}
                  onChange={(e) => update('trust', { ...content.trust, heading: e.target.value })}
                />
                <TextareaField
                  label="Intro"
                  value={content.trust.intro}
                  onChange={(val) => update('trust', { ...content.trust, intro: val })}
                />
              </div>
            </AdminCard>

            {content.trust.points.map((point, i) => (
              <AdminCard key={point.id} title={`Trust point ${i + 1} — ${point.title}`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <AdminInput
                    label="Title"
                    value={point.title}
                    onChange={(e) => {
                      const points = content.trust.points.map((p, pi) => pi === i ? { ...p, title: e.target.value } : p);
                      update('trust', { ...content.trust, points });
                    }}
                  />
                  <TextareaField
                    label="Description"
                    value={point.description}
                    onChange={(val) => {
                      const points = content.trust.points.map((p, pi) => pi === i ? { ...p, description: val } : p);
                      update('trust', { ...content.trust, points });
                    }}
                  />
                </div>
              </AdminCard>
            ))}
          </>
        )}

        {/* ── FAQ ──────────────────────────────────────────── */}
        {activeTab === 'faq' && (
          <>
            <AdminCard title="FAQ — Header">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <AdminInput
                  label="Tag"
                  value={content.faq.tag}
                  onChange={(e) => update('faq', { ...content.faq, tag: e.target.value })}
                />
                <AdminInput
                  label="Heading"
                  value={content.faq.heading}
                  onChange={(e) => update('faq', { ...content.faq, heading: e.target.value })}
                />
              </div>
            </AdminCard>

            {content.faq.items.map((item, i) => (
              <AdminCard key={item.id} title={`FAQ item ${i + 1}`} subtitle={item.question}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <AdminInput
                    label="Question"
                    value={item.question}
                    onChange={(e) => {
                      const items = content.faq.items.map((it, ii) => ii === i ? { ...it, question: e.target.value } : it);
                      update('faq', { ...content.faq, items });
                    }}
                  />
                  <TextareaField
                    label="Answer"
                    value={item.answer}
                    onChange={(val) => {
                      const items = content.faq.items.map((it, ii) => ii === i ? { ...it, answer: val } : it);
                      update('faq', { ...content.faq, items });
                    }}
                    rows={3}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => {
                        const items = content.faq.items.filter((_, ii) => ii !== i);
                        update('faq', { ...content.faq, items });
                      }}
                      style={{
                        padding: '6px 16px',
                        background: 'transparent',
                        color: '#DC2626',
                        border: '1px solid #FCA5A5',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontFamily: 'Lato, sans-serif',
                        cursor: 'pointer',
                      }}
                    >
                      Remove item
                    </button>
                  </div>
                </div>
              </AdminCard>
            ))}

            {/* Add new FAQ item */}
            <button
              onClick={() => {
                const newItem = { id: `f${Date.now()}`, question: '', answer: '' };
                update('faq', { ...content.faq, items: [...content.faq.items, newItem] });
              }}
              style={{
                padding: '10px 24px',
                background: 'transparent',
                color: '#C49A3C',
                border: '1px dashed #C49A3C',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontFamily: 'Lato, sans-serif',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              + Add FAQ item
            </button>
          </>
        )}

        {/* ── ABOUT ────────────────────────────────────────── */}
        {activeTab === 'about' && (
          <AdminCard title="About — Founder">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <AdminInput
                label="Tag"
                value={content.about.tag}
                onChange={(e) => update('about', { ...content.about, tag: e.target.value })}
              />
              <AdminInput
                label="Name"
                value={content.about.name}
                onChange={(e) => update('about', { ...content.about, name: e.target.value })}
              />
              <AdminInput
                label="Role"
                value={content.about.role}
                onChange={(e) => update('about', { ...content.about, role: e.target.value })}
              />
              <TextareaField
                label="Paragraph 1"
                value={content.about.paragraph1}
                onChange={(val) => update('about', { ...content.about, paragraph1: val })}
                rows={4}
              />
              <TextareaField
                label="Paragraph 2"
                value={content.about.paragraph2}
                onChange={(val) => update('about', { ...content.about, paragraph2: val })}
                rows={4}
              />
              <TextareaField
                label="Paragraph 3"
                value={content.about.paragraph3}
                onChange={(val) => update('about', { ...content.about, paragraph3: val })}
                rows={4}
              />
              <AdminInput
                label="Trust text"
                value={content.about.trustText}
                onChange={(e) => update('about', { ...content.about, trustText: e.target.value })}
                helper='Short meta line shown below the paragraphs'
              />
            </div>
          </AdminCard>
        )}

        {/* ── CTA FOOTER ───────────────────────────────────── */}
        {activeTab === 'cta' && (
          <AdminCard title="CTA Footer — Final call to action">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <AdminInput
                label="Tag"
                value={content.ctaFooter.tag}
                onChange={(e) => update('ctaFooter', { ...content.ctaFooter, tag: e.target.value })}
              />
              <AdminInput
                label="Heading"
                value={content.ctaFooter.heading}
                onChange={(e) => update('ctaFooter', { ...content.ctaFooter, heading: e.target.value })}
              />
              <TextareaField
                label="Subtitle"
                value={content.ctaFooter.subtitle}
                onChange={(val) => update('ctaFooter', { ...content.ctaFooter, subtitle: val })}
                rows={3}
              />
              <AdminInput
                label="Button label"
                value={content.ctaFooter.buttonLabel}
                onChange={(e) => update('ctaFooter', { ...content.ctaFooter, buttonLabel: e.target.value })}
              />
              <AdminInput
                label="Button href"
                value={content.ctaFooter.buttonHref}
                onChange={(e) => update('ctaFooter', { ...content.ctaFooter, buttonHref: e.target.value })}
              />
              <AdminInput
                label="Small note"
                value={content.ctaFooter.note}
                onChange={(e) => update('ctaFooter', { ...content.ctaFooter, note: e.target.value })}
                helper='Displayed below the button in muted text'
              />
            </div>
          </AdminCard>
        )}

      </div>

      {/* Sticky save footer */}
      <div
        style={{
          position: 'sticky',
          bottom: 0,
          background: 'linear-gradient(transparent, #F5F4F0 40%)',
          padding: '20px 0 28px',
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '16px',
        }}
      >
        <AdminSaveButton onClick={handleSave} />
      </div>
    </div>
  );
}
