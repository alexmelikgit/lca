import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import Sidebar from '@/components/admin/Sidebar';

/** Admin shell layout — sidebar + scrollable content area. */
export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F4F0', fontFamily: 'Lato, sans-serif' }}>
      <Sidebar />

      {/* Main content — offset by sidebar width */}
      <div style={{ marginLeft: '240px', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Top bar */}
        <header style={{
          height: '56px',
          background: 'white',
          borderBottom: '1px solid #E8E4DC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 28px',
          gap: '20px',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '0.8rem', color: '#6B6B58', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            View site ↗
          </a>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '32px 28px', maxWidth: '1100px', width: '100%' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
