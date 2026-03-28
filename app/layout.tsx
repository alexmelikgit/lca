import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Own a Piece of Armenia',
  description: 'You know exactly what you\'re eating. You watched it grow.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hy">
      <body>{children}</body>
    </html>
  );
}
