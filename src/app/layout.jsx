import { Montserrat } from 'next/font/google';
import { categories as siteCategories } from '@/data/siteData';
import NavigationProgress from '@/components/ui/NavigationProgress';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
});
import { CANONICAL_SITE_URL, canonicalUrl } from '@/lib/siteUrl';
import { organizationSchema, websiteSchema, ORG_ID, WEBSITE_ID, toJsonLd } from '@/lib/schemas';
import '@/tailwind.css';
import '@/styles.css';

export const metadata = {
  metadataBase: new URL(CANONICAL_SITE_URL),
  title: {
    default: 'ExTell Systems | UPS, Power Backup & ICT Infrastructure',
    template: '%s | ExTell Systems',
  },
  description:
    'ExTell Systems provides UPS systems, power backup, fiber cables, structured cabling, and ICT infrastructure solutions for enterprise customers across 20+ countries.',
  alternates: {
    canonical: CANONICAL_SITE_URL,
  },
  openGraph: {
    title: 'ExTell Systems | UPS, Power Backup & ICT Infrastructure',
    description:
      'ExTell Systems provides UPS systems, power backup, fiber cables, structured cabling, and ICT infrastructure solutions for enterprise customers across 20+ countries.',
    url: CANONICAL_SITE_URL,
    siteName: 'ExTell Systems',
    type: 'website',
    images: [
      {
        url: '/assets/homebg.jpg',
        width: 1200,
        height: 630,
        alt: 'ExTell Systems — Enterprise Power & ICT Infrastructure',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ExTell Systems | UPS, Power Backup & ICT Infrastructure',
    description:
      'ExTell Systems provides UPS systems, power backup, fiber cables, and ICT infrastructure solutions for enterprise customers.',
    images: ['/assets/homebg.jpg'],
  },
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }) {
  // Full @graph for the whole site — loaded on every page.
  // Individual pages add their own page-specific schemas on top of this.
  const globalGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      // ── Organization (GEO: primary company entity) ─────────────────────────
      organizationSchema,

      // ── WebSite with SiteLinksSearchBox ───────────────────────────────────
      websiteSchema,

      // ── ItemList: primary navigation (GEO: site structure for AI) ─────────
      {
        '@type': 'ItemList',
        '@id': `${CANONICAL_SITE_URL}/#nav`,
        name: 'Primary Navigation',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: canonicalUrl('/') },
          { '@type': 'ListItem', position: 2, name: 'Products', item: canonicalUrl('/products') },
          { '@type': 'ListItem', position: 3, name: 'Solutions', item: canonicalUrl('/solutions') },
          { '@type': 'ListItem', position: 4, name: 'Support', item: canonicalUrl('/support') },
          { '@type': 'ListItem', position: 5, name: 'About', item: canonicalUrl('/about') },
          { '@type': 'ListItem', position: 6, name: 'Contact', item: canonicalUrl('/contact') },
        ],
      },

      // ── ItemList: product categories (GEO: catalog taxonomy) ──────────────
      {
        '@type': 'ItemList',
        '@id': `${CANONICAL_SITE_URL}/#categories`,
        name: 'Product Categories',
        itemListElement: siteCategories.map((category, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: category.name,
          item: canonicalUrl(`/category/${category.slug}`),
        })),
      },
    ],
  };

  return (
    <html lang="en" className={montserrat.variable}>
      <head>
        <meta
          name="google-site-verification"
          content="tzkyAKPdqgw2xbtXozmRdJV8ERMVKXmDelEcBMEbOIA"
        />
        {/* Google Tag Manager - head snippet */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function (w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-K7XBFBZ');`,
          }}
        />
      </head>

      <body className={`${montserrat.variable} font-sans bg-white`}>
        {/* Google Tag Manager (noscript) - body snippet */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K7XBFBZ"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <NavigationProgress />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalGraph) }}
        />
        {children}
      </body>
    </html>
  );
}
