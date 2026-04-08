import { getNavContent, getLocalContent, getPlotFieldConfig } from '@/lib/content';
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
import PlotField from '@/components/plots/PlotField';

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

  const fieldConfig = getPlotFieldConfig();
  const [nav, local] = await Promise.all([
    getNavContent(locale),
    getLocalContent(locale),
  ]);

  return (
    <>
      <Navbar content={nav} page="local" locale={locale} />
      <main>
        {local.sectionVisibility?.hero !== false && <Hero content={local.hero} />}
        {local.sectionVisibility?.problem !== false && <Problem content={local.problem} />}
        {local.sectionVisibility?.howItWorks !== false && <HowItWorks content={local.howItWorks} />}
        {local.sectionVisibility?.dashboardShowcase !== false && <DashboardShowcase content={local.dashboardShowcase} />}
        {local.sectionVisibility?.health !== false && <Health content={local.health} />}
        {local.sectionVisibility?.convenience !== false && <Convenience content={local.convenience} />}
        {local.sectionVisibility?.progress !== false && <Progress content={local.progress} />}
        {local.sectionVisibility?.plotMap !== false && local.plotMap && <PlotField content={local.plotMap} fieldConfig={fieldConfig} />}
        {local.sectionVisibility?.farmer !== false && <Farmer content={local.farmer} />}
        {local.sectionVisibility?.seasonal !== false && <Seasonal content={local.seasonal} />}
        {local.sectionVisibility?.trust !== false && <Trust content={local.trust} />}
        {local.sectionVisibility?.faq !== false && <FAQ content={local.faq} />}
        {local.sectionVisibility?.about !== false && <About content={local.about} />}
        {local.sectionVisibility?.ctaFooter !== false && <CTAFooter content={local.ctaFooter} />}
      </main>
    </>
  );
}
