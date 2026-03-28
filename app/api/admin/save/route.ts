import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { revalidatePath } from 'next/cache';
import { requireSession } from '@/lib/session';
import type { ActivityLogEntry } from '@/types/content';

const ALLOWED_FILES = ['nav', 'how-it-works', 'local', 'diaspora', 'farmer', 'plots', 'faq-local', 'faq-diaspora', 'settings'];

/** Map file → which pages to revalidate after saving */
const REVALIDATE_MAP: Record<string, string[]> = {
  nav: ['/', '/diaspora'],
  'how-it-works': ['/'],
  local: ['/'],
  diaspora: ['/diaspora'],
  farmer: ['/', '/diaspora'],
  plots: ['/', '/diaspora'],
  'faq-local': ['/'],
  'faq-diaspora': ['/diaspora'],
  settings: ['/', '/diaspora'],
};

export async function POST(req: NextRequest) {
  try {
    await requireSession();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json() as { file: string; content: unknown; section?: string };
  const { file, content, section } = body;

  if (!file || !ALLOWED_FILES.includes(file)) {
    return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
  }
  if (!content || typeof content !== 'object') {
    return NextResponse.json({ error: 'Invalid content' }, { status: 400 });
  }

  const path = join(process.cwd(), 'content', `${file}.json`);
  await writeFile(path, JSON.stringify(content, null, 2), 'utf-8');

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
    await writeFile(logPath, JSON.stringify(log.slice(0, 50), null, 2), 'utf-8');
  } catch {
    // Non-fatal — continue even if log write fails
  }

  // Revalidate affected pages
  const paths = REVALIDATE_MAP[file] ?? [];
  paths.forEach((p) => revalidatePath(p));

  return NextResponse.json({ success: true, revalidated: paths });
}
