import { AdminAuthProvider } from '@/admin/hooks/useAdminAuth';
import { categories as siteCategories } from '@/data/siteData';
import '@/tailwind.css';
import '@/styles.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const siteUrl = 'https://extellsystems.com';
  
export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'ExTell Systems | UPS, Power Backup & ICT Infrastructure',
    template: '%s | ExTell Systems',
  },
  description:
    'ExTell Systems provides UPS, power backup, structured cabling, and ICT infrastructure solutions for enterprise customers.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ExTell Systems | UPS, Power Backup & ICT Infrastructure',
    description:
      'ExTell Systems provides UPS, power backup, structured cabling, and ICT infrastructure solutions for enterprise customers.',
    url: siteUrl,
    siteName: 'ExTell Systems',
    type: 'website',
    images: [
      {
        url: '/favicon.png',
        width: 512,
        height: 512,
        alt: 'ExTell Systems',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ExTell Systems | UPS, Power Backup & ICT Infrastructure',
    description:
      'ExTell Systems provides UPS, power backup, structured cabling, and ICT infrastructure solutions for enterprise customers.',
    images: ['/favicon.png'],
  },
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }) {
  const navigationLinks = [
    { name: 'Home', url: `${siteUrl}/` },
    { name: 'Products', url: `${siteUrl}/products` },
    { name: 'Solutions', url: `${siteUrl}/solutions` },
    { name: 'Support', url: `${siteUrl}/support` },
    { name: 'About', url: `${siteUrl}/about` },
    { name: 'Contact', url: `${siteUrl}/contact` },
  ];

  const categoryLinks = siteCategories.map((category, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: category.name,
    item: `${siteUrl}/products?category=${encodeURIComponent(category.slug)}`,
  }));

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'ExTell Systems',
        url: siteUrl,
        logo: `${siteUrl}/favicon.png`,
        sameAs: ['https://www.linkedin.com/company/extellsystems/'],
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'sales',
            telephone: '+1 365 889 5555',
            url: `${siteUrl}/contact`,
          },
        ],
      },
      {
        '@type': 'WebSite',
        url: siteUrl,
        name: 'ExTell Systems',
        description:
          'UPS, power backup, structured cabling, and ICT infrastructure solutions for enterprise customers.',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/products?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'ItemList',
        name: 'Primary Navigation',
        itemListElement: navigationLinks.map((link, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: link.name,
          item: link.url,
        })),
      },
      {
        '@type': 'ItemList',
        name: 'Product Categories',
        itemListElement: categoryLinks,
      },
    ],
  };

  return (
    <html lang="en">
      <body className="bg-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        {children}
      </body>
    </html>
  );
}
