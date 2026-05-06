import { join } from 'path';
import { readFile } from 'fs/promises';
import { r2GetText } from '@/lib/r2';
import type { NavContent, HowItWorksContent, LocalContent, DiasporaContent, PlotFieldConfig, SiteSettings } from '@/types/content';
import type { Locale } from '@/lib/i18n';
import plotFieldConfigJson from '@/data/plot-field.json';

const CONTENT_DIR = join(process.cwd(), 'content');

async function readJson<T>(locale: Locale, file: string): Promise<T> {
  const fsPath = join(CONTENT_DIR, locale, `${file}.json`);
  const key = `content/${locale}/${file}.json`;

  const fsData = JSON.parse(await readFile(fsPath, 'utf-8')) as T;

  try {
    const text = await r2GetText(key);
    if (text) {
      const r2Data = JSON.parse(text) as T;
      // Filesystem provides defaults for new fields; R2 overrides the rest
      return { ...fsData, ...r2Data };
    }
  } catch {
    // R2 error — use filesystem only
  }

  return fsData;
}

export async function getNavContent(locale: Locale): Promise<NavContent> {
  return readJson<NavContent>(locale, 'nav');
}

export async function getHowItWorksContent(): Promise<HowItWorksContent> {
  const fsPath = join(CONTENT_DIR, 'how-it-works.json');
  const fsData = JSON.parse(await readFile(fsPath, 'utf-8')) as HowItWorksContent;
  try {
    const text = await r2GetText('content/how-it-works.json');
    if (text) return { ...fsData, ...JSON.parse(text) };
  } catch { /* fallthrough */ }
  return fsData;
}

export async function getLocalContent(locale: Locale): Promise<LocalContent> {
  return readJson<LocalContent>(locale, 'local');
}

export async function getDiasporaContent(locale: Locale): Promise<DiasporaContent> {
  return readJson<DiasporaContent>(locale, 'diaspora');
}

export function getPlotFieldConfig(): PlotFieldConfig {
  // Phase 1: static import bundled at build time (not yet admin-editable).
  // Phase 2: switch to r2GetText when admin editing is added.
  return plotFieldConfigJson as unknown as PlotFieldConfig;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const fsPath = join(CONTENT_DIR, 'settings.json');
  const fsData = JSON.parse(await readFile(fsPath, 'utf-8')) as SiteSettings;
  try {
    const text = await r2GetText('content/settings.json');
    if (text) return { ...fsData, ...JSON.parse(text) };
  } catch {
    // R2 error — use filesystem only
  }
  return fsData;
}
