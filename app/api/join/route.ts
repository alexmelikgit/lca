import { NextResponse } from 'next/server';
import { r2GetText, r2Put } from '@/lib/r2';

const SIGNUPS_KEY = 'waitlist/signups.json';
// Simple permissive email regex — RFC-compliant is overkill for a waitlist gate.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface Signup {
  email: string;
  timestamp: string;
  locale?: 'hy' | 'en';
  source?: string;
}

function localeFromReferer(referer: string | null): 'hy' | 'en' | undefined {
  if (!referer) return undefined;
  try {
    const path = new URL(referer).pathname;
    if (path.startsWith('/hy')) return 'hy';
    if (path.startsWith('/en')) return 'en';
  } catch {
    /* fallthrough */
  }
  return undefined;
}

export async function POST(req: Request) {
  try {
    const { email } = (await req.json()) as { email?: string };

    if (!email || !EMAIL_RE.test(email.trim())) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const entry: Signup = {
      email: email.trim().toLowerCase(),
      timestamp: new Date().toISOString(),
      locale: localeFromReferer(req.headers.get('referer')),
      source: 'landing',
    };

    // Read existing signups from R2 (NoSuchKey → empty list).
    // Race note: concurrent POSTs may overwrite each other. Acceptable for low-traffic
    // waitlist; revisit with ETag-conditional PUTs if signup rate grows.
    let signups: Signup[] = [];
    const existing = await r2GetText(SIGNUPS_KEY);
    if (existing) {
      try {
        const parsed = JSON.parse(existing);
        if (Array.isArray(parsed)) signups = parsed as Signup[];
      } catch (err) {
        console.error('[join] Could not parse existing signups.json, starting fresh', err);
      }
    }

    // Dedupe by email — overwrite older entry if same email signs up again.
    signups = signups.filter((s) => s.email !== entry.email);
    signups.push(entry);

    await r2Put(SIGNUPS_KEY, JSON.stringify(signups, null, 2), 'application/json');

    console.log('[join] Signup stored:', entry.email, entry.locale ?? '?');
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[join] Error:', err);
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
