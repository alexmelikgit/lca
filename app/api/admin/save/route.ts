import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { put } from '@vercel/blob';
import { revalidatePath, revalidateTag } from 'next/cache';
import { requireSession } from '@/lib/session';
import { LOCALES } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import type { ActivityLogEntry } from '@/types/content';
import { setCachedUrl } from '@/lib/blob-url-cache';

const ALLOWED_FILES = ['nav', 'local', 'diaspora'];
const LOCALE_FREE_FILES = ['how-it-works', 'farmer', 'plots', 'faq-local', 'faq-diaspora', 'settings'];

/** Pages to revalidate per file+locale combo */
function getRevalidatePaths(file: string, locale?: Locale): string[] {
  if (file === 'local') return locale ? [`/${locale}`] : ['/hy', '/en'];
  if (file === 'nav') return ['/hy', '/en', '/hy/diaspora', '/en/diaspora'];
  if (file === 'diaspora') return ['/hy/diaspora', '/en/diaspora'];
  if (file === 'farmer') return ['/hy', '/en', '/hy/diaspora', '/en/diaspora'];
  if (file === 'how-it-works') return ['/hy', '/en'];
  return [];
}

export async function POST(req: NextRequest) {
  try {
    await requireSession();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json() as { file: string; locale?: Locale; content: unknown; section?: string };
  const { file, locale, content, section } = body;

  if (!file) {
    return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
  }
  if (!content || typeof content !== 'object') {
    return NextResponse.json({ error: 'Invalid content' }, { status: 400 });
  }

  let blobKey: string;

  if (ALLOWED_FILES.includes(file)) {
    if (!locale || !LOCALES.includes(locale)) {
      return NextResponse.json({ error: 'Invalid or missing locale' }, { status: 400 });
    }
    blobKey = `content/${locale}/${file}.json`;
  } else if (LOCALE_FREE_FILES.includes(file)) {
    blobKey = `content/${file}.json`;
  } else {
    return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
  }

  const savedBlob = await put(blobKey, JSON.stringify(content, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  });
  setCachedUrl(blobKey, savedBlob.url);

  // Append to activity log
  try {
    const logPath = join(process.cwd(), 'content', 'activity-log.json');
    const raw = await readFile(logPath, 'utf-8');
    const log: ActivityLogEntry[] = JSON.parse(raw);
    log.unshift({
      timestamp: new Date().toISOString(),
      section: section ?? file,
      user: 'Admin',
    });
    await put('content/activity-log.json', JSON.stringify(log.slice(0, 50), null, 2), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
    });
  } catch {
    // Non-fatal
  }

  // Bust all landing content caches in one call
  revalidateTag('content', {});

  // Revalidate the full route cache for affected pages
  const paths = getRevalidatePaths(file, locale);
  paths.forEach((p) => revalidatePath(p, 'page'));

  return NextResponse.json({ success: true, revalidated: paths });
}
