import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { requireSession } from '@/lib/session';
import { LOCALES } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

const ALLOWED_FILES = ['nav', 'local'];
const LOCALE_FREE_FILES = ['how-it-works', 'diaspora', 'farmer', 'plots', 'faq-local', 'faq-diaspora', 'settings', 'activity-log'];

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

  try {
    const raw = await readFile(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
