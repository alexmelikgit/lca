import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { requireSession } from '@/lib/session';
import { LOCALES } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import { r2GetText } from '@/lib/r2';

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

  const key = ALLOWED_FILES.includes(file)
    ? `content/${locale}/${file}.json`
    : `content/${file}.json`;

  try {
    const { readFile } = await import('fs/promises');

    // Load filesystem default (always present in git)
    const fsRaw = await readFile(filePath, 'utf-8').catch(() => null);
    const fsData = fsRaw ? JSON.parse(fsRaw) : {};

    // Load R2 override (admin edits), if it exists
    let r2Data: Record<string, unknown> = {};
    try {
      const text = await r2GetText(key);
      if (text) r2Data = JSON.parse(text);
    } catch {
      // no R2 object — use filesystem only
    }

    return NextResponse.json({ ...fsData, ...r2Data });
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
