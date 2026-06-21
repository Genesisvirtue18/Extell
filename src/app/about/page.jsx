import SiteLayoutWrapper from '@/app/layout-wrapper';
import AboutPage from '@/pages/AboutPage';
import { canonicalUrl } from '@/lib/siteUrl';
import {
  organizationSchema,
  buildBreadcrumbSchema,
  buildFAQSchema,
  ORG_ID,
  WEBSITE_ID,
} from '@/lib/schemas';

export const metadata = {
  title: 'About ExTell Systems | UPS & ICT Infrastructure Company',
  description:
    'ExTell Systems is an enterprise technology company providing UPS systems, fiber optic cables, structured cabling, and ICT infrastructure to 20+ countries. Learn about our story, mission, and capabilities.',
  alternates: {
    canonical: canonicalUrl('/about'),
  },
  openGraph: {
    title: 'About ExTell Systems | Enterprise Power & ICT Infrastructure',
    description:
      'Learn about ExTell Systems — enterprise UPS, fiber, and ICT infrastructure solutions provider operating across 20+ countries.',
    url: canonicalUrl('/about'),
    siteName: 'ExTell Systems',
    type: 'website',
    images: [{ url: '/assets/homebg.jpg', width: 1200, height: 630, alt: 'About ExTell Systems' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About ExTell Systems | Enterprise Power & ICT Infrastructure',
    description:
      'Learn about ExTell Systems — enterprise UPS, fiber, and ICT infrastructure solutions provider across 20+ countries.',
    images: ['/assets/homebg.jpg'],
  },
};

const url = canonicalUrl('/about');

// AEO: BreadcrumbList
const breadcrumbSchema = buildBreadcrumbSchema([
  { name: 'Home', url: canonicalUrl('/') },
  { name: 'About', url },
]);

// GEO: AboutPage entity linked to the Organization
const aboutPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  '@id': `${url}#webpage`,
  url,
  name: 'About ExTell Systems',
  description:
    'ExTell Systems is a global enterprise technology company providing UPS systems, fiber optic cables, data center infrastructure, and ICT networking solutions.',
  isPartOf: { '@id': WEBSITE_ID },
  about: { '@id': ORG_ID },
  breadcrumb: breadcrumbSchema,
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1', '.about-hero', '.about-intro'],
  },
};

// AEO: Company-focused FAQs — People Also Ask for brand searches
const aboutFAQSchema = buildFAQSchema([
  {
    q: 'What does ExTell Systems do?',
    a: 'ExTell Systems designs, supplies, and supports enterprise-grade UPS systems, fiber optic cables, structured cabling, data center PDUs, and ICT networking infrastructure for customers across 20+ countries.',
  },
  {
    q: 'Where is ExTell Systems headquartered?',
    a: 'ExTell Systems is headquartered in Ernakulam, Kerala, India with additional offices in Sharjah (UAE), Bahrain, and the United States.',
  },
  {
    q: 'How many countries does ExTell Systems operate in?',
    a: 'ExTell Systems distributes products and delivers solutions in more than 20 countries, primarily across South Asia, the Middle East, and North America.',
  },
  {
    q: 'What certifications does ExTell Systems hold?',
    a: 'ExTell Systems holds industry certifications relevant to power electronics and ICT infrastructure. Details are available on the Certifications page at extellsystems.com/certifications.',
  },
  {
    q: 'Is ExTell Systems an ISO-certified company?',
    a: 'For the latest certification and compliance details, please visit extellsystems.com/certifications or contact sales@extellsystems.com.',
  },
]);

export default function Page() {
  return (
    <SiteLayoutWrapper>
      {/* GEO: AboutPage entity — links page to Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      {/* GEO: Organization entity (full) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {/* AEO: BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* AEO: Company FAQPage — People Also Ask for brand queries */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutFAQSchema) }}
      />
      <AboutPage />
    </SiteLayoutWrapper>
  );
}
