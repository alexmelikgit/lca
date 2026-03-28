import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth';

/** Server-side session check. Returns null if unauthenticated. */
export function getSession() {
  return getServerSession(authOptions);
}

/** Throws if not authenticated — use in API routes. */
export async function requireSession() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  return session;
}
