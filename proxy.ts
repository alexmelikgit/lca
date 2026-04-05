import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { LOCALES, DEFAULT_LOCALE_LOCAL, DEFAULT_LOCALE_DIASPORA } from '@/lib/i18n';

export default withAuth(
  function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Skip internal Next.js paths, API routes, and admin routes (auth-guarded separately)
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/admin') ||
      pathname.includes('.')
    ) {
      return NextResponse.next();
    }

    // Already has a valid locale prefix — let through
    const firstSegment = pathname.split('/')[1];
    if (LOCALES.includes(firstSegment as (typeof LOCALES)[number])) {
      return NextResponse.next();
    }

    // /diaspora → /en/diaspora
    if (pathname === '/diaspora') {
      return NextResponse.redirect(
        new URL(`/${DEFAULT_LOCALE_DIASPORA}/diaspora`, req.url)
      );
    }

    // / → /hy
    if (pathname === '/') {
      return NextResponse.redirect(
        new URL(`/${DEFAULT_LOCALE_LOCAL}`, req.url)
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Require auth only for /admin routes
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return !!token;
        }
        return true;
      },
    },
    pages: {
      signIn: '/admin/login',
    },
  }
);

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
