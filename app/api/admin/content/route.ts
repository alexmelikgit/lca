import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { requireSession } from '@/lib/session';

const ALLOWED_FILES = ['nav', 'how-it-works', 'local', 'diaspora', 'farmer', 'plots', 'faq-local', 'faq-diaspora', 'settings', 'activity-log'];

export async function GET(req: NextRequest) {
  try {
    await requireSession();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const file = req.nextUrl.searchParams.get('file');

  if (!file || !ALLOWED_FILES.includes(file)) {
    return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
  }

  try {
    const path = join(process.cwd(), 'content', `${file}.json`);
    const raw = await readFile(path, 'utf-8');
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
