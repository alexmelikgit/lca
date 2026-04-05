import { readFile } from 'fs/promises';
import { join } from 'path';
import type { NavContent, LocalContent } from '@/types/content';

const CONTENT_DIR = join(process.cwd(), 'content');

async function readJson<T>(file: string): Promise<T> {
  const raw = await readFile(join(CONTENT_DIR, `${file}.json`), 'utf-8');
  return JSON.parse(raw) as T;
}

export async function getNavContent(): Promise<NavContent> {
  return readJson<NavContent>('nav');
}

export async function getLocalContent(): Promise<LocalContent> {
  return readJson<LocalContent>('local');
}
