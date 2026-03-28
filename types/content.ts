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
  diasporaCta: string;
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
}

export interface CtaFooterContent {
  tag: string;
  heading: string;
  subtitle: string;
  buttonLabel: string;
  buttonHref: string;
  note: string;
}

export interface LocalContent {
  hero: HeroContent;
  problem: ProblemContent;
  health: HealthContent;
  convenience: ConvenienceContent;
  progress: ProgressContent;
  farmer: FarmerContent;
  seasonal: SeasonalContent;
  trust: TrustContent;
  faq: FaqContent;
  about: AboutContent;
  ctaFooter: CtaFooterContent;
}
