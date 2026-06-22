export const CANONICAL_SITE_URL = 'https://www.extellsystems.com';

export const canonicalUrl = (pathname = '/') => {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return new URL(path, CANONICAL_SITE_URL).toString();
};
