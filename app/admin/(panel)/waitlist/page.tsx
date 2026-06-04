import AdminCard from '@/components/admin/AdminCard';
import WaitlistTable from '@/components/admin/WaitlistTable';
import { r2GetText } from '@/lib/r2';
import type { Signup, SignupStatus } from '@/app/api/join/route';

export const dynamic = 'force-dynamic';

async function loadSignups(): Promise<Signup[]> {
  const text = await r2GetText('waitlist/signups.json');
  if (!text) return [];
  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? (parsed as Signup[]) : [];
  } catch {
    return [];
  }
}

function effectiveStatus(s: Signup): SignupStatus {
  return s.status ?? 'pending';
}

export default async function WaitlistPage() {
  const signups = await loadSignups();

  const total = signups.length;
  const pending = signups.filter((s) => effectiveStatus(s) === 'pending').length;
  const approved = signups.filter((s) => effectiveStatus(s) === 'approved').length;
  const declined = signups.filter((s) => effectiveStatus(s) === 'declined').length;
  const hyCount = signups.filter((s) => s.locale === 'hy').length;
  const enCount = signups.filter((s) => s.locale === 'en').length;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#1A1A14' }}>
          Waitlist
        </h1>
        <p style={{ margin: '6px 0 0', fontSize: '0.875rem', color: '#9B9B82' }}>
          Spring 2027 pilot signups. Stored in R2 (<code style={{ fontSize: '0.8rem' }}>waitlist/signups.json</code>).
        </p>
      </div>

      {/* Status stat strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <StatCard label="Total" value={total} color="#1A1A14" />
        <StatCard label="Pending" value={pending} color="#6B6B58" />
        <StatCard label="Approved" value={approved} color="#2D5A27" />
        <StatCard label="Declined" value={declined} color="#8B2535" />
      </div>

      {/* Locale stat strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        <StatCard label="From HY" value={hyCount} color="#2D5A27" />
        <StatCard label="From EN" value={enCount} color="#C49A3C" />
      </div>

      <WaitlistTable signups={signups} />
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <AdminCard>
      <div
        style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#9B9B82',
          marginBottom: '6px',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '1.6rem',
          fontWeight: 700,
          color,
          fontFamily: 'Playfair Display, serif',
        }}
      >
        {value}
      </div>
    </AdminCard>
  );
}
