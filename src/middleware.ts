import { NextRequest, NextResponse } from 'next/server';

// Must match the primary domain Vercel is configured to serve (www-prefixed).
const CANONICAL_ORIGIN = 'https://www.extellsystems.com';

// Pages that take query params for filtering/pagination — canonical = clean path
const PARAMETERISED_PATHS = ['/products', '/category'];

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Inject Link: <canonical> HTTP header for parameterised listing pages.
  // Resolves "Duplicate without user-selected canonical" for URLs like:
  // /products?category=ups-systems&page=2
  const isParameterised =
    PARAMETERISED_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`)) &&
    searchParams.size > 0;

  const response = NextResponse.next();

  if (isParameterised) {
    const canonical = `${CANONICAL_ORIGIN}${pathname}`;
    response.headers.set('Link', `<${canonical}>; rel="canonical"`);
  }

  // Trailing-slash normalisation — redirect /contact/ → /contact
  if (pathname !== '/' && pathname.endsWith('/')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(0, -1);
    return NextResponse.redirect(url, { status: 301 });
  }

  return response;
}

export const config = {
  matcher: [
    // Match all routes except Next.js internals and static files
    '/((?!_next/static|_next/image|favicon|assets|api/).*)',
  ],
};
