import { NextRequest, NextResponse } from 'next/server';

const CANONICAL_ORIGIN = 'https://extellsystems.com';

// Pages that take query params for filtering/pagination — canonical = clean path
const PARAMETERISED_PATHS = ['/products', '/category'];

export function middleware(request: NextRequest) {
  const { pathname, searchParams, origin } = request.nextUrl;

  // 1. www → non-www redirect (fixes "Duplicate without user-selected canonical"
  //    when Google crawls both www.extellsystems.com and extellsystems.com)
  const host = request.headers.get('host') || '';
  if (host.startsWith('www.')) {
    const url = request.nextUrl.clone();
    url.host = host.replace(/^www\./, '');
    return NextResponse.redirect(url, { status: 301 });
  }

  const response = NextResponse.next();

  // 2. Inject Link: <canonical> HTTP header for parameterised listing pages.
  //    This tells Google the canonical URL even before it reads the HTML,
  //    which resolves "Duplicate without user-selected canonical" for pages like:
  //    /products?category=ups-systems&page=2
  const isParameterised =
    PARAMETERISED_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`)) &&
    searchParams.size > 0;

  if (isParameterised) {
    const canonical = `${CANONICAL_ORIGIN}${pathname}`;
    response.headers.set('Link', `<${canonical}>; rel="canonical"`);
  }

  // 3. Trailing-slash normalisation — redirect /contact/ → /contact
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
