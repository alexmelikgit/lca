'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Signup, SignupStatus } from '@/app/api/join/route';

interface Props {
  signups: Signup[];
}

type Action = 'delete' | 'approve' | 'decline';

function formatTimestamp(iso?: string): string {
  if (!iso) return '—';
  return iso.slice(0, 19).replace('T', ' ') + ' UTC';
}

function effectiveStatus(s: Signup): SignupStatus {
  return s.status ?? 'pending';
}

export default function WaitlistTable({ signups }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState<Action | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  const sorted = useMemo(
    () =>
      [...signups].sort((a, b) =>
        (b.timestamp ?? '').localeCompare(a.timestamp ?? ''),
      ),
    [signups],
  );

  const allEmails = useMemo(() => sorted.map((s) => s.email), [sorted]);
  const allSelected = selected.size > 0 && selected.size === allEmails.length;
  const someSelected = selected.size > 0;

  function toggleOne(email: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(email)) next.delete(email);
      else next.add(email);
      return next;
    });
  }

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(allEmails));
  }

  function emailsToDownload(): string[] {
    return someSelected ? [...selected] : allEmails;
  }

  async function runAction(action: Action) {
    setError(null);
    if (action === 'delete' && !confirming) {
      setConfirming(true);
      return;
    }
    setBusy(action);
    try {
      const res = await fetch('/api/admin/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, emails: [...selected] }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      setSelected(new Set());
      setConfirming(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setBusy(null);
    }
  }

  function downloadCsv() {
    const targets = emailsToDownload();
    const targetSet = new Set(targets);
    const rows = sorted.filter((s) => targetSet.has(s.email));
    const csv = [
      'email,timestamp,locale,source,status',
      ...rows.map(
        (s) =>
          `${s.email},${s.timestamp ?? ''},${s.locale ?? ''},${s.source ?? ''},${effectiveStatus(s)}`,
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hyeland-waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      {/* Action bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          padding: '12px 16px',
          background: someSelected ? '#FBF3DC' : '#F5F4F0',
          border: '1px solid #E8E4DC',
          borderRadius: '8px',
          marginBottom: '12px',
          minHeight: '52px',
        }}
      >
        <div style={{ fontSize: '0.82rem', color: '#1A1A14', fontWeight: 600, marginRight: 'auto' }}>
          {someSelected
            ? `${selected.size} of ${sorted.length} selected`
            : sorted.length > 0
              ? 'Select rows to act on, or download all'
              : 'No signups yet'}
        </div>

        <ActionButton
          label="↓ Download"
          onClick={downloadCsv}
          disabled={sorted.length === 0}
          variant="ghost"
          subLabel={someSelected ? `(${selected.size})` : '(all)'}
        />
        <ActionButton
          label="✓ Approve"
          onClick={() => runAction('approve')}
          disabled={!someSelected || busy !== null}
          loading={busy === 'approve'}
          variant="green"
        />
        <ActionButton
          label="✕ Decline"
          onClick={() => runAction('decline')}
          disabled={!someSelected || busy !== null}
          loading={busy === 'decline'}
          variant="amber"
        />
        <ActionButton
          label={confirming ? '? Confirm delete' : '🗑 Delete'}
          onClick={() => runAction('delete')}
          disabled={!someSelected || busy !== null}
          loading={busy === 'delete'}
          variant="red"
        />
        {confirming && (
          <button
            type="button"
            onClick={() => setConfirming(false)}
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              background: 'none',
              border: 'none',
              color: '#6B6B58',
              cursor: 'pointer',
              padding: '8px 4px',
            }}
          >
            Cancel
          </button>
        )}
      </div>

      {error && (
        <div
          style={{
            marginBottom: '12px',
            padding: '10px 14px',
            background: '#FBE5E5',
            border: '1px solid #E8A4A4',
            color: '#8B2535',
            borderRadius: '6px',
            fontSize: '0.85rem',
          }}
        >
          {error}
        </div>
      )}

      {/* Table */}
      {sorted.length === 0 ? (
        <div
          style={{
            padding: '40px 0',
            textAlign: 'center',
            color: '#9B9B82',
            fontSize: '0.9rem',
            background: 'white',
            borderRadius: '8px',
            border: '1px solid #E8E4DC',
          }}
        >
          No signups yet.
        </div>
      ) : (
        <div
          style={{
            background: 'white',
            borderRadius: '8px',
            border: '1px solid #E8E4DC',
            overflowX: 'auto',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', background: '#F8F7F2' }}>
                <th style={{ ...thStyle, width: '40px', paddingLeft: '16px' }}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="Select all"
                    style={checkboxStyle}
                  />
                </th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Locale</th>
                <th style={thStyle}>Submitted</th>
                <th style={thStyle}>Source</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((s, i) => {
                const isChecked = selected.has(s.email);
                return (
                  <tr
                    key={`${s.email}-${i}`}
                    style={{
                      borderTop: '1px solid #F0EDE6',
                      background: isChecked ? '#FBF3DC' : 'transparent',
                    }}
                  >
                    <td style={{ ...tdStyle, paddingLeft: '16px' }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleOne(s.email)}
                        aria-label={`Select ${s.email}`}
                        style={checkboxStyle}
                      />
                    </td>
                    <td style={tdStyle}>
                      <a
                        href={`mailto:${s.email}`}
                        style={{ color: '#1A1A14', textDecoration: 'none', fontWeight: 600 }}
                      >
                        {s.email}
                      </a>
                    </td>
                    <td style={tdStyle}>
                      <StatusBadge status={effectiveStatus(s)} />
                    </td>
                    <td style={tdStyle}>
                      <LocaleBadge locale={s.locale} />
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        color: '#6B6B58',
                        fontFamily: 'ui-monospace, monospace',
                        fontSize: '0.82rem',
                      }}
                    >
                      {formatTimestamp(s.timestamp)}
                    </td>
                    <td style={{ ...tdStyle, color: '#9B9B82', paddingRight: '16px' }}>
                      {s.source ?? '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: SignupStatus }) {
  const map: Record<SignupStatus, { color: string; bg: string; label: string }> = {
    pending: { color: '#6B6B58', bg: '#F0EDE6', label: 'pending' },
    approved: { color: '#2D5A27', bg: '#E8F5E4', label: 'approved' },
    declined: { color: '#8B2535', bg: '#FBE5E5', label: 'declined' },
  };
  const { color, bg, label } = map[status];
  return <Badge color={color} bg={bg}>{label}</Badge>;
}

function LocaleBadge({ locale }: { locale?: string }) {
  if (locale === 'hy') return <Badge color="#2D5A27" bg="#E8F5E4">hy</Badge>;
  if (locale === 'en') return <Badge color="#C49A3C" bg="#FBF3DC">en</Badge>;
  return <Badge color="#9B9B82" bg="#F0EDE6">?</Badge>;
}

function Badge({ color, bg, children }: { color: string; bg: string; children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color,
        background: bg,
        borderRadius: '4px',
      }}
    >
      {children}
    </span>
  );
}

interface ActionButtonProps {
  label: string;
  subLabel?: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant: 'green' | 'amber' | 'red' | 'ghost';
}

function ActionButton({ label, subLabel, onClick, disabled, loading, variant }: ActionButtonProps) {
  const variants: Record<ActionButtonProps['variant'], { bg: string; color: string; border: string }> = {
    green: { bg: '#2D5A27', color: 'white', border: '#2D5A27' },
    amber: { bg: '#C49A3C', color: 'white', border: '#C49A3C' },
    red: { bg: '#8B2535', color: 'white', border: '#8B2535' },
    ghost: { bg: 'white', color: '#1A1A14', border: '#D8D4C8' },
  };
  const v = variants[variant];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 14px',
        fontSize: '0.78rem',
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color: v.color,
        background: v.bg,
        border: `1px solid ${v.border}`,
        borderRadius: '6px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        whiteSpace: 'nowrap',
      }}
    >
      {loading ? '…' : label}
      {subLabel && <span style={{ opacity: 0.7, fontWeight: 400 }}>{subLabel}</span>}
    </button>
  );
}

const thStyle: React.CSSProperties = {
  padding: '12px 12px 12px 0',
  fontSize: '0.72rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#9B9B82',
  borderBottom: '1px solid #E8E4DC',
};

const tdStyle: React.CSSProperties = {
  padding: '12px 12px 12px 0',
  color: '#1A1A14',
};

const checkboxStyle: React.CSSProperties = {
  width: '16px',
  height: '16px',
  cursor: 'pointer',
  accentColor: '#2D5A27',
};
