import { getNavContent, getDiasporaContent, getPlotFieldConfig } from '@/lib/content';
import type { Locale } from '@/lib/i18n';
import { LOCALES } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import DiasporaHero from '@/components/sections/diaspora/DiasporaHero';
import DiasporaProblem from '@/components/sections/diaspora/DiasporaProblem';
import HowItWorks from '@/components/sections/HowItWorks';
import HarvestOptions from '@/components/sections/diaspora/HarvestOptions';
import DashboardShowcase from '@/components/sections/DashboardShowcase';
import DiasporaOwnership from '@/components/sections/diaspora/DiasporaOwnership';
import GiftMechanic from '@/components/sections/diaspora/GiftMechanic';
import Progress from '@/components/sections/Progress';
import Farmer from '@/components/sections/Farmer';
import Seasonal from '@/components/sections/Seasonal';
import Trust from '@/components/sections/Trust';
import PhaseTwo from '@/components/sections/diaspora/PhaseTwo';
import FAQ from '@/components/sections/FAQ';
import About from '@/components/sections/About';
import CTAFooter from '@/components/sections/CTAFooter';
import PlotField from '@/components/plots/PlotField';

export const revalidate = 60;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function DiasporaPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  if (!LOCALES.includes(locale)) {
    notFound();
  }

  const fieldConfig = getPlotFieldConfig();
  const [nav, diaspora] = await Promise.all([
    getNavContent(locale),
    getDiasporaContent(locale),
  ]);

  const v = diaspora.sectionVisibility;

  return (
    <>
      <Navbar content={nav} page="diaspora" locale={locale} />
      <main>
        {v.hero !== false && <DiasporaHero content={diaspora.hero} />}
        {v.problem !== false && <DiasporaProblem content={diaspora.problem} />}
        {v.howItWorks !== false && <HowItWorks content={diaspora.howItWorks} />}
        {v.harvestOptions !== false && <HarvestOptions content={diaspora.harvestOptions} />}
        {v.dashboardShowcase !== false && <DashboardShowcase content={diaspora.dashboardShowcase} />}
        {v.ownership !== false && <DiasporaOwnership content={diaspora.ownership} />}
        {v.giftMechanic !== false && <GiftMechanic content={diaspora.giftMechanic} />}
        {v.progress !== false && <Progress content={diaspora.progress} />}
        {v.plotMap !== false && diaspora.plotMap && <PlotField content={diaspora.plotMap} fieldConfig={fieldConfig} />}
        {v.farmer !== false && <Farmer content={diaspora.farmer} />}
        {v.seasonal !== false && <Seasonal content={diaspora.seasonal} />}
        {v.trust !== false && <Trust content={diaspora.trust} />}
        {v.phaseTwo !== false && <PhaseTwo content={diaspora.phaseTwo} />}
        {v.faq !== false && <FAQ content={diaspora.faq} />}
        {v.about !== false && <About content={diaspora.about} />}
        {v.ctaFooter !== false && <CTAFooter content={diaspora.ctaFooter} variant="pomegranate" />}
      </main>
    </>
  );
}
