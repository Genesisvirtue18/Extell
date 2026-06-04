import Link from 'next/link';
import SiteLayoutWrapper from './layout-wrapper';

export const metadata = {
  title: '404 | Page Not Found | Extell Systems',
  description: 'The page you are looking for does not exist or has been moved.',
};

export default function NotFound() {
  return (
    <SiteLayoutWrapper>
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col items-center justify-center px-6 py-24 text-center">
        <p className="text-base font-semibold uppercase tracking-[0.3em] text-red-600">404 error</p>
        <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">Page not found</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          The page you tried to reach does not exist, may have been removed, or has been redirected.
          Please check the URL or go back to the home page.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Go to homepage
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            Contact support
          </Link>
        </div>
      </section>
    </SiteLayoutWrapper>
  );
}
