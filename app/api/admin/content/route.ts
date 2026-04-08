import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { readBlobOrFs } from '@/lib/blob-content';
import { requireSession } from '@/lib/session';
import { LOCALES } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

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

  let blobKey: string;
  if (ALLOWED_FILES.includes(file)) {
    blobKey = `content/${locale}/${file}.json`;
  } else {
    blobKey = `content/${file}.json`;
  }

  try {
    const { readFile } = await import('fs/promises');
    const { list } = await import('@vercel/blob');

    // Load filesystem default (always present in git)
    const fsRaw = await readFile(filePath, 'utf-8').catch(() => null);
    const fsData = fsRaw ? JSON.parse(fsRaw) : {};

    // Load Blob override (admin edits), if it exists
    let blobData: Record<string, unknown> = {};
    try {
      const { blobs } = await list({ prefix: blobKey, limit: 1 });
      const match = blobs.find((b) => b.pathname === blobKey);
      if (match) {
        const res = await fetch(match.url, { cache: 'no-store' });
        blobData = await res.json();
      }
    } catch {
      // no blob — use filesystem only
    }

    // Merge: filesystem provides defaults for new fields; blob overrides the rest
    const merged = { ...fsData, ...blobData };
    return NextResponse.json(merged);
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
