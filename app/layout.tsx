import type { Metadata } from 'next';
import { playfair, lato } from '@/lib/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hyeland',
  description: 'Own a piece of the Highland.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hy" className={`${playfair.variable} ${lato.variable}`}>
      <body>{children}</body>
    </html>
  );
}
