import SiteLayoutWrapper from './layout-wrapper';
import HomeHero from '@/components/sections/HomeHero';
import CategoryGridSection from '@/components/sections/CategoryGridSection';
import CategoryProductsSection from '@/components/sections/CategoryProductsSection';
import FeaturedProductsSection from '@/components/sections/FeaturedProductsSection';
import SolutionsShowcaseSection from '@/components/sections/SolutionsShowcaseSection';
import HomeFAQSection from '@/components/sections/HomeFAQSection';
import { canonicalUrl } from '@/lib/siteUrl';
import { buildFAQSchema, buildSpeakableSchema, ORG_ID, WEBSITE_ID, toJsonLd } from '@/lib/schemas';

export const metadata = {
  title: 'ExTell Systems | UPS, Power Backup & ICT Infrastructure',
  description:
    'ExTell Systems provides UPS systems, fiber cables, data center solutions, and ICT infrastructure for enterprise customers across 20+ countries. Get a quote today.',
  alternates: {
    canonical: canonicalUrl('/'),
  },
  openGraph: {
    title: 'ExTell Systems | UPS, Power Backup & ICT Infrastructure',
    description:
      'Enterprise UPS systems, fiber cables, data center solutions, and ICT infrastructure for customers across 20+ countries.',
    url: canonicalUrl('/'),
    siteName: 'ExTell Systems',
    type: 'website',
    images: [{ url: '/assets/homebg.jpg', width: 1200, height: 630, alt: 'ExTell Systems — Enterprise Power & ICT Infrastructure' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ExTell Systems | UPS, Power Backup & ICT Infrastructure',
    description:
      'Enterprise UPS systems, fiber cables, data center solutions, and ICT infrastructure for customers across 20+ countries.',
    images: ['/assets/homebg.jpg'],
  },
};

// AEO: Site-level FAQ — answers the most common questions buyers ask about the company.
// Targets People Also Ask boxes and voice-search direct answers.
const homeFAQSchema = buildFAQSchema([
  {
    q: 'What products does ExTell Systems sell?',
    a: 'ExTell Systems sells UPS systems, fiber optic cables, data center power solutions, networking products, power distribution units, and structured cabling systems for enterprise customers.',
  },
  {
    q: 'Where is ExTell Systems located?',
    a: 'ExTell Systems has offices in India (Ernakulam, Kerala), UAE (Sharjah), Bahrain, and the United States. The company distributes products in 20+ countries.',
  },
  {
    q: 'How do I get a quote from ExTell Systems?',
    a: 'You can request a quote by visiting extellsystems.com/contact, using the quote form on any product page, or emailing sales@extellsystems.com. The team typically responds within 2 business hours.',
  },
  {
    q: 'Does ExTell Systems provide UPS systems for data centers?',
    a: 'Yes, ExTell Systems provides modular UPS, industrial UPS, and online double-conversion UPS systems designed for data centers, telecom networks, banking infrastructure, and industrial environments.',
  },
  {
    q: 'What industries does ExTell Systems serve?',
    a: 'ExTell Systems serves telecom operators, data centers, banking and finance, healthcare, government, manufacturing, oil and gas, and utilities sectors.',
  },
  {
    q: 'Does ExTell Systems offer warranty registration?',
    a: 'Yes. Product warranty registration is available at extellsystems.com/warranty. For warranty support, contact support@extellsystems.com.',
  },
  {
    q: 'How do I become an ExTell Systems distributor or partner?',
    a: 'To enroll as an ExTell partner or distributor, email sales@extellsystems.com. ExTell has active partners in over 20 countries with product training and warranty programs available.',
  },
]);

// AEO: Speakable — marks the hero headline and description for voice assistants.
const speakableSchema = buildSpeakableSchema(canonicalUrl('/'), [
  '.home-hero h1',
  '.home-hero p',
]);

// GEO: WebPage entity — connects this URL to the website and organization entities.
const homePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${canonicalUrl('/')}#webpage`,
  url: canonicalUrl('/'),
  name: 'ExTell Systems | UPS, Power Backup & ICT Infrastructure',
  description:
    'Enterprise UPS systems, fiber cables, data center solutions, and ICT infrastructure from ExTell Systems.',
  isPartOf: { '@id': WEBSITE_ID },
  about: { '@id': ORG_ID },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: canonicalUrl('/') }],
  },
  speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.home-hero h1', '.home-hero p'] },
};

export default function HomePage() {
  return (
    <SiteLayoutWrapper>
      {/* AEO: FAQ schema for People Also Ask + voice search */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFAQSchema) }}
      />
      {/* GEO: WebPage + Speakable for AI crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }}
      />
      <HomeHero />
      <CategoryGridSection />
      <CategoryProductsSection />
      <FeaturedProductsSection />
      <SolutionsShowcaseSection />
      <HomeFAQSection />
    </SiteLayoutWrapper>
  );
}
