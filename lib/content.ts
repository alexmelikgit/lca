import { readFile } from 'fs/promises';
import { join } from 'path';
import type { NavContent, HowItWorksContent, LocalContent, DiasporaContent } from '@/types/content';
import type { Locale } from '@/lib/i18n';

const CONTENT_DIR = join(process.cwd(), 'content');

async function readJson<T>(locale: Locale, file: string): Promise<T> {
  const raw = await readFile(join(CONTENT_DIR, locale, `${file}.json`), 'utf-8');
  return JSON.parse(raw) as T;
}

export async function getNavContent(locale: Locale): Promise<NavContent> {
  return readJson<NavContent>(locale, 'nav');
}

export async function getHowItWorksContent(): Promise<HowItWorksContent> {
  // How-it-works is not locale-specific yet
  const raw = await readFile(join(CONTENT_DIR, 'how-it-works.json'), 'utf-8');
  return JSON.parse(raw) as HowItWorksContent;
}

export async function getLocalContent(locale: Locale): Promise<LocalContent> {
  return readJson<LocalContent>(locale, 'local');
}

export async function getDiasporaContent(locale: Locale): Promise<DiasporaContent> {
  return readJson<DiasporaContent>(locale, 'diaspora');
}
