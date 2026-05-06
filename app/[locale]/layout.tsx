import type { ReactNode } from 'react';
import Script from 'next/script';
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
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!LOCALES.includes(locale as Locale)) {
    notFound();
  }

  return (
    <html lang={locale} className={`${playfair.variable} ${lato.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        <Script
          defer
          src="https://analytics.hyeland.am/script.js"
          data-website-id="215137b2-60cf-4019-a65e-09b9d7698df8"
        />
      </body>
    </html>
  );
}
