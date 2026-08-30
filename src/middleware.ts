import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Next.js App router static assets bypass
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/courses' ||
    pathname === '/donate'
  ) {
    return NextResponse.next();
  }

  // Header inspection & safe passthrough
  const response = NextResponse.next();
  response.headers.set('x-globeskill-path', pathname);
  return response;
}

export const config = {
  matcher: [
    '/student/:path*',
    '/trainer/:path*',
    '/admin/:path*',
    '/donor/:path*',
    '/onboarding',
  ],
};
