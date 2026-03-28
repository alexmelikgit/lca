import AdminCard from '@/components/admin/AdminCard';
import Link from 'next/link';

const QUICK_LINKS = [
  { label: 'Navigation', href: '/admin/navigation', desc: 'Logo, nav links, CTA buttons' },
  { label: 'Local Page', href: '/admin/local', desc: 'Hero, Problem, FAQ and more' },
  { label: 'Diaspora Page', href: '/admin/diaspora', desc: 'Hero, Testimonials, How it works' },
  { label: 'Farmer Profile', href: '/admin/farmer', desc: 'Name, photo, quote, region' },
  { label: 'Available Plots', href: '/admin/plots', desc: 'Manage plot availability' },
  { label: 'Settings', href: '/admin/settings', desc: 'Pilot status, social links' },
];

export default function AdminDashboard() {
  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#1A1A14' }}>Dashboard</h1>
        <p style={{ margin: '6px 0 0', fontSize: '0.875rem', color: '#9B9B82' }}>
          Welcome back. Jump into any section to edit content.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {QUICK_LINKS.map((item) => (
          <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
            <AdminCard
              style={{
                cursor: 'pointer',
                transition: 'box-shadow 0.2s ease, transform 0.15s ease',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1A1A14', marginBottom: '4px' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#9B9B82' }}>{item.desc}</div>
              <div style={{ marginTop: '14px', fontSize: '0.75rem', color: '#C49A3C', fontWeight: 700 }}>
                Edit →
              </div>
            </AdminCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
