import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hyeland',
  description: 'Own a piece of the Highland.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
