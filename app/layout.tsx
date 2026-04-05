import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hyeland',
  description: 'Own a piece of the Highland.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
