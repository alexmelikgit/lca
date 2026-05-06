/** Shared TypeScript interfaces for all /content/*.json files. */

export interface NavLink {
  id: string;
  label: string;
  href: string;
}

export interface NavContent {
  logoMain: string;
  logoHighlight: string;
  localCta: string;
  localCtaHref: string;
  diasporaCta: string;
  diasporaCtaHref: string;
  diasporaLinkText: string;
  localLinkText: string;
  localLinks: NavLink[];
  diasporaLinks: NavLink[];
}

export interface ActivityLogEntry {
  timestamp: string; // ISO 8601
  section: string;
  user: string;
}

export interface HowItWorksStep {
  id: string;
  title: string;
  description: string;
}

export interface HowItWorksContent {
  tag: string;
  heading: string;
  intro: string;
  steps: HowItWorksStep[];
}

/* ─── Local page ─────────────────────────────────────────────── */

export interface HeroStat {
  value: string;
  label: string;
}

export interface HeroContent {
  tag: string;
  h1Line1: string;
  h1Line2: string;
  h1Italic: string;
  subtitle: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  stats: HeroStat[];
}

export interface ProblemCard {
  id: string;
  vegetable: string;
  title: string;
  description: string;
}

export interface ProblemContent {
  tag: string;
  heading: string;
  cards: ProblemCard[];
}

export interface HealthItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface HealthContent {
  tag: string;
  heading: string;
  intro: string;
  items: HealthItem[];
}

export interface ConvenienceItem {
  id: string;
  title: string;
  description: string;
}

export interface ConvenienceContent {
  tag: string;
  heading: string;
  intro: string;
  items: ConvenienceItem[];
}

export interface ProgressMilestone {
  id: string;
  year: string;
  size: string;
  label: string;
  features: string[];
}

export interface ProgressContent {
  tag: string;
  heading: string;
  intro: string;
  milestones: ProgressMilestone[];
}

export interface FarmerContent {
  tag: string;
  name: string;
  region: string;
  experience: string;
  quote: string;
  bio: string;
  image?: string;
  imagePosition?: string;
}

export interface Season {
  id: string;
  name: string;
  months: string;
  color: string;
  crops: string[];
}

export interface SeasonalContent {
  tag: string;
  heading: string;
  intro: string;
  seasons: Season[];
}

export interface TrustPoint {
  id: string;
  title: string;
  description: string;
}

export interface TrustContent {
  tag: string;
  heading: string;
  intro: string;
  points: TrustPoint[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqContent {
  tag: string;
  heading: string;
  items: FaqItem[];
}

export interface AboutContent {
  tag: string;
  name: string;
  role: string;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
  trustText: string;
  image?: string;
  imagePosition?: string;
}

export interface CtaFooterContent {
  tag: string;
  heading: string;
  subtitle: string;
  buttonLabel: string;
  buttonHref: string;
  note: string;
}

export interface DashboardShowcaseContent {
  tag: string;
  heading: string;
  intro: string;
  features: string[];
}

/* ─── Plot field ─────────────────────────────────────────────── */

export type PlotStatusValue = 'available' | 'sold' | 'reserved';

export interface DiscountTier {
  minPlots: number;
  percent: number;
}

export interface PlotOverride {
  status?: PlotStatusValue;
  priceOverrideUSD?: number;
  shortDescription?: string;
}

export interface PlotFieldConfig {
  fieldCorners: Array<{ lat: number; lng: number }>;
  /** Bounding box of the satellite image — derived from fieldCorners + padding when image is generated */
  imageBounds: { minLat: number; maxLat: number; minLng: number; maxLng: number };
  imagePath: string;
  imageWidth: number;
  imageHeight: number;
  plotSizeM2: number;
  defaultStatus: PlotStatusValue;
  defaultPriceUSD: number;
  currency: string;
  discountTiers?: DiscountTier[];
  plotOverrides: Record<string, PlotOverride>;
}

export interface PlotMapSectionContent {
  tag: string;
  heading: string;
  subtitle: string;
  reserveCtaText: string;
  reserveCtaHref: string;
}

export interface SectionVisibility {
  hero: boolean;
  problem: boolean;
  howItWorks: boolean;
  dashboardShowcase: boolean;
  health: boolean;
  convenience: boolean;
  progress: boolean;
  plotMap: boolean;
  farmer: boolean;
  seasonal: boolean;
  trust: boolean;
  faq: boolean;
  about: boolean;
  ctaFooter: boolean;
}

export interface LocalContent {
  sectionVisibility: SectionVisibility;
  hero: HeroContent;
  problem: ProblemContent;
  howItWorks: HowItWorksContent;
  dashboardShowcase: DashboardShowcaseContent;
  health: HealthContent;
  convenience: ConvenienceContent;
  progress: ProgressContent;
  plotMap?: PlotMapSectionContent;
  farmer: FarmerContent;
  seasonal: SeasonalContent;
  trust: TrustContent;
  faq: FaqContent;
  about: AboutContent;
  ctaFooter: CtaFooterContent;
}

/* ─── Diaspora page ──────────────────────────────────────────── */

export interface HarvestOption {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface HarvestOptionsContent {
  tag: string;
  heading: string;
  intro: string;
  options: HarvestOption[];
}

export interface OwnershipItem {
  id: string;
  title: string;
  description: string;
}

export interface DiasporaOwnershipContent {
  tag: string;
  heading: string;
  intro: string;
  items: OwnershipItem[];
}

export interface GiftMechanicContent {
  tag: string;
  heading: string;
  intro: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  note: string;
}

export interface PhaseTwoContent {
  tag: string;
  heading: string;
  body: string;
  note: string;
}

export interface DiasporaSectionVisibility {
  hero: boolean;
  problem: boolean;
  howItWorks: boolean;
  harvestOptions: boolean;
  dashboardShowcase: boolean;
  ownership: boolean;
  giftMechanic: boolean;
  progress: boolean;
  plotMap: boolean;
  farmer: boolean;
  seasonal: boolean;
  trust: boolean;
  phaseTwo: boolean;
  faq: boolean;
  about: boolean;
  ctaFooter: boolean;
}

export interface DiasporaContent {
  sectionVisibility: DiasporaSectionVisibility;
  hero: HeroContent;
  problem: ProblemContent;
  howItWorks: HowItWorksContent;
  harvestOptions: HarvestOptionsContent;
  dashboardShowcase: DashboardShowcaseContent;
  ownership: DiasporaOwnershipContent;
  giftMechanic: GiftMechanicContent;
  progress: ProgressContent;
  plotMap?: PlotMapSectionContent;
  farmer: FarmerContent;
  seasonal: SeasonalContent;
  trust: TrustContent;
  phaseTwo: PhaseTwoContent;
  faq: FaqContent;
  about: AboutContent;
  ctaFooter: CtaFooterContent;
}

/* ─── Site settings (locale-free, R2-overridable) ───────────── */

export interface SiteSettings {
  diasporaEnabled: boolean;
}
