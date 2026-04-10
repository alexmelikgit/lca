import { join } from 'path';
import { readFile } from 'fs/promises';
import { getCachedUrl, setCachedUrl, getBlobStoreUrl } from '@/lib/blob-url-cache';
import type { NavContent, HowItWorksContent, LocalContent, DiasporaContent, PlotFieldConfig } from '@/types/content';
import type { Locale } from '@/lib/i18n';
import plotFieldConfigJson from '@/data/plot-field.json';

const CONTENT_DIR = join(process.cwd(), 'content');

async function readJson<T>(locale: Locale, file: string): Promise<T> {
  const fsPath = join(CONTENT_DIR, locale, `${file}.json`);
  const blobKey = `content/${locale}/${file}.json`;

  const fsData = JSON.parse(await readFile(fsPath, 'utf-8')) as T;

  try {
    const url = getCachedUrl(blobKey) ?? `${getBlobStoreUrl()}/${blobKey}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`blob ${res.status}`);
    if (!getCachedUrl(blobKey)) setCachedUrl(blobKey, url);
    const blobData = await res.json() as T;
    return { ...fsData, ...blobData };
  } catch {
    // 404 = no blob override yet, or network error — use filesystem only
  }

  return fsData;
}

export async function getNavContent(locale: Locale): Promise<NavContent> {
  return readJson<NavContent>(locale, 'nav');
}

export async function getHowItWorksContent(): Promise<HowItWorksContent> {
  const fsPath = join(CONTENT_DIR, 'how-it-works.json');
  const blobKey = 'content/how-it-works.json';
  const fsData = JSON.parse(await readFile(fsPath, 'utf-8')) as HowItWorksContent;
  try {
    const url = getCachedUrl(blobKey) ?? `${getBlobStoreUrl()}/${blobKey}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`blob ${res.status}`);
    if (!getCachedUrl(blobKey)) setCachedUrl(blobKey, url);
    return { ...fsData, ...await res.json() };
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
  // Phase 2: switch to readBlobOrFs when admin editing is added.
  return plotFieldConfigJson as unknown as PlotFieldConfig;
}
