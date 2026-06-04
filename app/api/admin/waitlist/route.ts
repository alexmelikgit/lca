import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/session';
import { r2GetText, r2Put } from '@/lib/r2';
import type { Signup, SignupStatus } from '@/app/api/join/route';

const KEY = 'waitlist/signups.json';

type Action = 'delete' | 'approve' | 'decline';

interface Body {
  action: Action;
  emails: string[];
}

async function loadSignups(): Promise<Signup[]> {
  const text = await r2GetText(KEY);
  if (!text) return [];
  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? (parsed as Signup[]) : [];
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireSession();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }

  if (!body || !Array.isArray(body.emails) || body.emails.length === 0) {
    return NextResponse.json({ error: 'No emails selected' }, { status: 400 });
  }
  if (!['delete', 'approve', 'decline'].includes(body.action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  const targetEmails = new Set(body.emails.map((e) => e.toLowerCase()));
  const signups = await loadSignups();
  let affected = 0;
  let next: Signup[];

  if (body.action === 'delete') {
    next = signups.filter((s) => {
      const match = targetEmails.has(s.email.toLowerCase());
      if (match) affected += 1;
      return !match;
    });
  } else {
    const newStatus: SignupStatus = body.action === 'approve' ? 'approved' : 'declined';
    next = signups.map((s) => {
      if (targetEmails.has(s.email.toLowerCase())) {
        affected += 1;
        return { ...s, status: newStatus };
      }
      return s;
    });
  }

  await r2Put(KEY, JSON.stringify(next, null, 2), 'application/json');

  return NextResponse.json({ ok: true, action: body.action, affected });
}
