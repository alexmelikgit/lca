'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import AdminCard from './AdminCard';

interface DiasporaToggleProps {
  initialEnabled: boolean;
}

export default function DiasporaToggle({ initialEnabled }: DiasporaToggleProps) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(initialEnabled);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function toggle() {
    if (saving) return;
    const next = !enabled;
    setError(null);
    setSaving(true);
    setEnabled(next); // optimistic

    try {
      const res = await fetch('/api/admin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: 'settings',
          content: { diasporaEnabled: next },
          section: 'site-settings',
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Save failed (${res.status})`);
      }

      startTransition(() => router.refresh());
    } catch (e) {
      setEnabled(!next); // rollback
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminCard style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1A1A14', marginBottom: '4px' }}>
            Diaspora page
          </div>
          <div style={{ fontSize: '0.8rem', color: '#9B9B82' }}>
            Routing + navbar link toggle for both locales (en, hy)
          </div>
          {error && (
            <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#B23A3A' }}>
              {error}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={toggle}
          disabled={saving}
          aria-pressed={enabled}
          style={{
            position: 'relative',
            width: '56px',
            height: '30px',
            borderRadius: '999px',
            border: 'none',
            cursor: saving ? 'wait' : 'pointer',
            background: enabled ? '#2D5A27' : '#C7C2B5',
            transition: 'background 0.2s ease',
            opacity: saving ? 0.7 : 1,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: '3px',
              left: enabled ? '29px' : '3px',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              transition: 'left 0.2s ease',
            }}
          />
        </button>
      </div>
    </AdminCard>
  );
}
