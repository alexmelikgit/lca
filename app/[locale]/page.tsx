import { getNavContent, getLocalContent } from '@/lib/content';
import type { Locale } from '@/lib/i18n';
import { LOCALES } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/sections/Hero';
import Problem from '@/components/sections/Problem';
import HowItWorks from '@/components/sections/HowItWorks';
import DashboardShowcase from '@/components/sections/DashboardShowcase';
import Health from '@/components/sections/Health';
import Convenience from '@/components/sections/Convenience';
import Progress from '@/components/sections/Progress';
import Farmer from '@/components/sections/Farmer';
import Seasonal from '@/components/sections/Seasonal';
import Trust from '@/components/sections/Trust';
import FAQ from '@/components/sections/FAQ';
import About from '@/components/sections/About';
import CTAFooter from '@/components/sections/CTAFooter';

export const revalidate = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  if (!LOCALES.includes(locale)) {
    notFound();
  }

  const [nav, local] = await Promise.all([
    getNavContent(locale),
    getLocalContent(locale),
  ]);

  return (
    <>
      <Navbar content={nav} page="local" locale={locale} />
      <main>
        <Hero content={local.hero} />
        <Problem content={local.problem} />
        <HowItWorks content={local.howItWorks} />
        <DashboardShowcase content={local.dashboardShowcase} />
        <Health content={local.health} />
        <Convenience content={local.convenience} />
        <Progress content={local.progress} />
        <Farmer content={local.farmer} />
        <Seasonal content={local.seasonal} />
        <Trust content={local.trust} />
        <FAQ content={local.faq} />
        <About content={local.about} />
        <CTAFooter content={local.ctaFooter} />
      </main>
    </>
  );
}
