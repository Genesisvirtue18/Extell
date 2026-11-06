import { NextRequest, NextResponse } from 'next/server';

// Keep parameterised-page canonicals aligned with the site's canonical URL.
const CANONICAL_ORIGIN = 'https://extellsystems.com';

// Pages that take query params for filtering/pagination - canonical = clean path
const PARAMETERISED_PATHS = ['/products', '/category'];

function createSecurityHeaders(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const cspHeader = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDevelopment ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com https://www.google-analytics.com`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://extell-backend.onrender.com https://api.calculator.genesisvirtue.se https://api.emailjs.com https://api.cloudinary.com https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com",
    "frame-src 'self' https://www.googletagmanager.com https://www.google.com",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://api.emailjs.com",
  ].join('; ');
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);
  return { cspHeader, requestHeaders };
}

function applySecurityHeaders(response: NextResponse, cspHeader: string) {
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const { cspHeader, requestHeaders } = createSecurityHeaders(request);

  // Inject Link: <canonical> HTTP header for parameterised listing pages.
  // Resolves "Duplicate without user-selected canonical" for URLs like:
  // /products?category=ups-systems&page=2
  const isParameterised =
    PARAMETERISED_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`)) &&
    searchParams.size > 0;

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  applySecurityHeaders(response, cspHeader);

  if (isParameterised) {
    const canonical = `${CANONICAL_ORIGIN}${pathname}`;
    response.headers.set('Link', `<${canonical}>; rel="canonical"`);
  }

  // Trailing-slash normalisation - redirect /contact/ -> /contact
  if (pathname !== '/' && pathname.endsWith('/')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(0, -1);
    return applySecurityHeaders(NextResponse.redirect(url, { status: 301 }), cspHeader);
  }

  return response;
}

export const config = {
  matcher: [
    // Match all routes except Next.js internals and static files
    '/((?!_next/static|_next/image|favicon|assets|api/).*)',
  ],
};
