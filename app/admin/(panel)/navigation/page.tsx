'use client';

/**
 * Navigation editor — edit nav.json: logo text, CTA button labels,
 * and per-page link lists with drag-to-reorder via @dnd-kit.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { NavContent, NavLink } from '@/types/content';
import type { Locale } from '@/lib/i18n';
import AdminCard from '@/components/admin/AdminCard';
import AdminInput from '@/components/admin/AdminInput';
import AdminSaveButton from '@/components/admin/AdminSaveButton';

/* ─── Sortable link row ──────────────────────────────────────── */

interface SortableLinkRowProps {
  item: NavLink;
  onUpdate: (id: string, field: 'label' | 'href', value: string) => void;
  onDelete: (id: string) => void;
}

function SortableLinkRow({ item, onUpdate, onDelete }: SortableLinkRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 0',
        borderBottom: '1px solid #F0EDE6',
      }}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'grab',
          color: '#C8C4B8',
          padding: '4px 6px',
          fontSize: '1rem',
          lineHeight: 1,
          flexShrink: 0,
          touchAction: 'none',
        }}
        title="Drag to reorder"
      >
        ⠿
      </button>

      {/* Label */}
      <input
        value={item.label}
        onChange={(e) => onUpdate(item.id, 'label', e.target.value)}
        placeholder="Label"
        style={{
          flex: '0 0 160px',
          padding: '7px 10px',
          fontSize: '0.85rem',
          border: '1px solid #D8D4C8',
          borderRadius: '6px',
          fontFamily: 'Lato, sans-serif',
          color: '#1A1A14',
          outline: 'none',
        }}
        onFocus={(e) => { e.target.style.borderColor = '#C49A3C'; }}
        onBlur={(e) => { e.target.style.borderColor = '#D8D4C8'; }}
      />

      {/* Href */}
      <input
        value={item.href}
        onChange={(e) => onUpdate(item.id, 'href', e.target.value)}
        placeholder="#anchor or /path"
        style={{
          flex: 1,
          padding: '7px 10px',
          fontSize: '0.85rem',
          border: '1px solid #D8D4C8',
          borderRadius: '6px',
          fontFamily: 'Lato, sans-serif',
          color: '#1A1A14',
          outline: 'none',
        }}
        onFocus={(e) => { e.target.style.borderColor = '#C49A3C'; }}
        onBlur={(e) => { e.target.style.borderColor = '#D8D4C8'; }}
      />

      {/* Delete */}
      <button
        onClick={() => onDelete(item.id)}
        title="Remove link"
        style={{
          background: 'none',
          border: '1px solid #E8E4DC',
          borderRadius: '6px',
          color: '#9B9B82',
          cursor: 'pointer',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          flexShrink: 0,
          transition: 'color 0.15s, border-color 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#DC2626'; e.currentTarget.style.borderColor = '#FCA5A5'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#9B9B82'; e.currentTarget.style.borderColor = '#E8E4DC'; }}
      >
        ×
      </button>
    </div>
  );
}

/* ─── Sortable link list (one page's set of links) ───────────── */

interface LinkListEditorProps {
  links: NavLink[];
  onChange: (links: NavLink[]) => void;
}

function LinkListEditor({ links, onChange }: LinkListEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = links.findIndex((l) => l.id === active.id);
      const newIndex = links.findIndex((l) => l.id === over.id);
      onChange(arrayMove(links, oldIndex, newIndex));
    }
  };

  const updateLink = (id: string, field: 'label' | 'href', value: string) => {
    onChange(links.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  };

  const deleteLink = (id: string) => {
    onChange(links.filter((l) => l.id !== id));
  };

  const addLink = () => {
    onChange([...links, { id: `link-${Date.now()}`, label: 'New link', href: '#' }]);
  };

  return (
    <div>
      {/* Column headers */}
      {links.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', paddingLeft: '38px', marginBottom: '4px' }}>
          <div style={{ flex: '0 0 160px', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9B9B82' }}>Label</div>
          <div style={{ flex: 1, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9B9B82' }}>Href / anchor</div>
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          {links.map((link) => (
            <SortableLinkRow key={link.id} item={link} onUpdate={updateLink} onDelete={deleteLink} />
          ))}
        </SortableContext>
      </DndContext>

      {links.length === 0 && (
        <div style={{ padding: '20px 0', textAlign: 'center', fontSize: '0.85rem', color: '#9B9B82' }}>
          No links yet. Add one below.
        </div>
      )}

      <button
        onClick={addLink}
        style={{
          marginTop: '12px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 16px',
          background: 'transparent',
          border: '1px dashed #C8C4B8',
          borderRadius: '8px',
          fontSize: '0.8rem',
          fontFamily: 'Lato, sans-serif',
          color: '#6B6B58',
          cursor: 'pointer',
          transition: 'border-color 0.15s, color 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#C49A3C'; e.currentTarget.style.color = '#C49A3C'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#C8C4B8'; e.currentTarget.style.color = '#6B6B58'; }}
      >
        + Add link
      </button>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────── */

export default function NavigationPage() {
  const [content, setContent] = useState<NavContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    fetch(`/api/admin/content?file=nav&locale=${locale}`)
      .then((r) => r.json())
      .then((data: NavContent) => { setContent(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [locale]);

  const set = useCallback(<K extends keyof NavContent>(key: K, value: NavContent[K]) => {
    setContent((prev) => prev ? { ...prev, [key]: value } : prev);
  }, []);

  const handleSave = async () => {
    const res = await fetch('/api/admin/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: 'nav', locale, content, section: 'Navigation' }),
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
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#1A1A14' }}>Navigation</h1>
          <p style={{ margin: '6px 0 0', fontSize: '0.875rem', color: '#9B9B82' }}>
            Logo, CTA buttons, and nav links for both pages.
          </p>
        </div>
        <AdminSaveButton onClick={handleSave} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Logo */}
        <AdminCard title="Logo" subtitle="Displayed in the top-left of every page">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <AdminInput
              label="Main text"
              value={content.logoMain}
              onChange={(e) => set('logoMain', e.target.value)}
              helper='e.g. "Hye"'
            />
            <AdminInput
              label="Highlighted text (italic green)"
              value={content.logoHighlight}
              onChange={(e) => set('logoHighlight', e.target.value)}
              helper='e.g. "Armenia"'
            />
          </div>
        </AdminCard>

        {/* CTA buttons */}
        <AdminCard title="CTA Buttons" subtitle="The primary action button shown in the navbar">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <AdminInput
              label="Local page button"
              value={content.localCta}
              onChange={(e) => set('localCta', e.target.value)}
              helper='Shown on the local residents page'
            />
            <AdminInput
              label="Diaspora page button"
              value={content.diasporaCta}
              onChange={(e) => set('diasporaCta', e.target.value)}
              helper='Shown on the diaspora page'
            />
            <AdminInput
              label="Local button link"
              value={content.localCtaHref}
              onChange={(e) => set('localCtaHref', e.target.value)}
              helper='#anchor, /path, or full URL'
            />
            <AdminInput
              label="Diaspora button link"
              value={content.diasporaCtaHref}
              onChange={(e) => set('diasporaCtaHref', e.target.value)}
              helper='#anchor, /path, or full URL'
            />
          </div>
        </AdminCard>

        {/* Cross-page switch links */}
        <AdminCard title="Switch links" subtitle='The "For the diaspora →" and reverse links'>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <AdminInput
              label="Diaspora link text"
              value={content.diasporaLinkText}
              onChange={(e) => set('diasporaLinkText', e.target.value)}
              helper='Shown on local page, links to diaspora page'
            />
            <AdminInput
              label="Local link text"
              value={content.localLinkText}
              onChange={(e) => set('localLinkText', e.target.value)}
              helper='Shown on diaspora page, links to local page'
            />
          </div>
        </AdminCard>

        {/* Local page nav links */}
        <AdminCard
          title="Local residents page — nav links"
          subtitle="Drag to reorder. These are the anchor links in the navbar."
        >
          <LinkListEditor
            links={content.localLinks}
            onChange={(links) => set('localLinks', links)}
          />
        </AdminCard>

        {/* Diaspora page nav links */}
        <AdminCard
          title="Diaspora page — nav links"
          subtitle="Drag to reorder."
        >
          <LinkListEditor
            links={content.diasporaLinks}
            onChange={(links) => set('diasporaLinks', links)}
          />
        </AdminCard>

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
