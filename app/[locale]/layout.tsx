import type { ReactNode } from 'react';
import type { Locale } from '@/lib/i18n';
import { LOCALES } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import { playfair, lato } from '@/lib/fonts';
import '@/app/globals.css';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  if (!LOCALES.includes(locale)) {
    notFound();
  }

  return (
    <html lang={locale} className={`${playfair.variable} ${lato.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
