import { join } from 'path';
import { readBlobOrFs } from '@/lib/blob-content';
import type { NavContent, HowItWorksContent, LocalContent, DiasporaContent, PlotFieldConfig } from '@/types/content';
import type { Locale } from '@/lib/i18n';

const CONTENT_DIR = join(process.cwd(), 'content');
const DATA_DIR = join(process.cwd(), 'data');

async function readJson<T>(locale: Locale, file: string): Promise<T> {
  const raw = await readBlobOrFs(
    `content/${locale}/${file}.json`,
    join(CONTENT_DIR, locale, `${file}.json`),
  );
  return JSON.parse(raw) as T;
}

export async function getNavContent(locale: Locale): Promise<NavContent> {
  return readJson<NavContent>(locale, 'nav');
}

export async function getHowItWorksContent(): Promise<HowItWorksContent> {
  const raw = await readBlobOrFs(
    'content/how-it-works.json',
    join(CONTENT_DIR, 'how-it-works.json'),
  );
  return JSON.parse(raw) as HowItWorksContent;
}

export async function getLocalContent(locale: Locale): Promise<LocalContent> {
  return readJson<LocalContent>(locale, 'local');
}

export async function getDiasporaContent(locale: Locale): Promise<DiasporaContent> {
  return readJson<DiasporaContent>(locale, 'diaspora');
}

export async function getPlotFieldConfig(): Promise<PlotFieldConfig> {
  const raw = await readBlobOrFs(
    'data/plot-field.json',
    join(DATA_DIR, 'plot-field.json'),
  );
  return JSON.parse(raw) as PlotFieldConfig;
}
