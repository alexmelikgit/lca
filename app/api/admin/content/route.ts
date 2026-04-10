import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { requireSession } from '@/lib/session';
import { LOCALES } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import { getCachedUrl, setCachedUrl, getBlobStoreUrl } from '@/lib/blob-url-cache';

const ALLOWED_FILES = ['nav', 'local', 'diaspora'];
const LOCALE_FREE_FILES = ['how-it-works', 'farmer', 'plots', 'faq-local', 'faq-diaspora', 'settings', 'activity-log'];

export async function GET(req: NextRequest) {
  try {
    await requireSession();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const file = req.nextUrl.searchParams.get('file');
  const locale = req.nextUrl.searchParams.get('locale') as Locale | null;

  if (!file) {
    return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
  }

  let filePath: string;

  if (ALLOWED_FILES.includes(file)) {
    if (!locale || !LOCALES.includes(locale)) {
      return NextResponse.json({ error: 'Invalid or missing locale' }, { status: 400 });
    }
    filePath = join(process.cwd(), 'content', locale, `${file}.json`);
  } else if (LOCALE_FREE_FILES.includes(file)) {
    filePath = join(process.cwd(), 'content', `${file}.json`);
  } else {
    return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
  }

  const blobKey = ALLOWED_FILES.includes(file)
    ? `content/${locale}/${file}.json`
    : `content/${file}.json`;

  try {
    const { readFile } = await import('fs/promises');

    // Load filesystem default (always present in git)
    const fsRaw = await readFile(filePath, 'utf-8').catch(() => null);
    const fsData = fsRaw ? JSON.parse(fsRaw) : {};

    // Load Blob override (admin edits) via direct URL — no list()
    let blobData: Record<string, unknown> = {};
    try {
      const url = getCachedUrl(blobKey) ?? `${getBlobStoreUrl()}/${blobKey}`;
      const res = await fetch(url, { next: { revalidate: 60 } });
      if (res.ok) {
        if (!getCachedUrl(blobKey)) setCachedUrl(blobKey, url);
        blobData = await res.json();
      }
    } catch {
      // no blob or env error — use filesystem only
    }

    return NextResponse.json({ ...fsData, ...blobData });
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
