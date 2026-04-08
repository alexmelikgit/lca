import { NextResponse } from 'next/server';

// TODO: Connect to a real storage / email service (Resend, Loops, Airtable, etc.)
// For now: logs the submission and returns success so the UI flow works end-to-end.

export async function POST(req: Request) {
  try {
    const { email } = await req.json() as { email?: string };

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    console.log('[join] New reservation:', email, new Date().toISOString());

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
