import SiteLayoutWrapper from '@/app/layout-wrapper';
import ContactPage from '@/pages/ContactPage';
import { canonicalUrl } from '@/lib/siteUrl';
import {
  localBusinessSchemas,
  buildBreadcrumbSchema,
  buildFAQSchema,
  ORG_ID,
  WEBSITE_ID,
} from '@/lib/schemas';

export const metadata = {
  title: 'Contact Sales & Engineering | ExTell Systems',
  description:
    'Contact ExTell Systems for UPS systems, fiber cables, structured cabling, and ICT infrastructure inquiries. Offices in India, UAE, Bahrain, and the United States.',
  keywords: [
    'contact ExTell Systems',
    'UPS sales India',
    'ICT infrastructure UAE',
    'power backup Bahrain',
    'enterprise networking sales',
  ],
  alternates: {
    canonical: canonicalUrl('/contact'),
  },
  openGraph: {
    title: 'Contact ExTell Systems | Sales & Technical Inquiries',
    description:
      'Reach our sales and engineering teams in India, UAE, Bahrain, and the US for enterprise UPS and ICT infrastructure solutions.',
    url: canonicalUrl('/contact'),
    siteName: 'ExTell Systems',
    type: 'website',
  },
};

const url = canonicalUrl('/contact');

// AEO: BreadcrumbList
const breadcrumbSchema = buildBreadcrumbSchema([
  { name: 'Home', url: canonicalUrl('/') },
  { name: 'Contact', url },
]);

// GEO: ContactPage entity
const contactPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  '@id': `${url}#webpage`,
  url,
  name: 'Contact ExTell Systems — Sales & Engineering',
  description:
    'Get in touch with ExTell Systems for product quotes, technical support, and partnership inquiries.',
  isPartOf: { '@id': WEBSITE_ID },
  about: { '@id': ORG_ID },
  breadcrumb: breadcrumbSchema,
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1', '.contact-intro'],
  },
};

// AEO: Contact FAQs — People Also Ask for contact/location searches
const contactFAQSchema = buildFAQSchema([
  {
    q: 'How do I contact ExTell Systems?',
    a: 'You can contact ExTell Systems via email at sales@extellsystems.com, through the contact form at extellsystems.com/contact, or by phone at the numbers listed on the contact page.',
  },
  {
    q: 'Where is the ExTell Systems office in India?',
    a: 'ExTell Systems India is located in Ernakulam, Kerala. Email: sales@extellsystems.com.',
  },
  {
    q: 'Does ExTell Systems have an office in the UAE?',
    a: 'Yes, ExTell Systems has an office in Sharjah, UAE serving the Middle East and Gulf region.',
  },
  {
    q: 'What is the ExTell Systems Bahrain contact?',
    a: 'ExTell Systems Bahrain handles GCC region inquiries. Use the contact form at extellsystems.com/contact or email sales@extellsystems.com.',
  },
  {
    q: 'How quickly does ExTell Systems respond to sales inquiries?',
    a: 'ExTell Systems typically responds to sales and quote inquiries within 2 business hours during business days.',
  },
]);

export default function Page() {
  return (
    <SiteLayoutWrapper>
      {/* GEO: ContactPage entity */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      {/* AEO: BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* GEO: LocalBusiness entities for India / UAE / Bahrain */}
      {localBusinessSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {/* AEO: Contact FAQPage — People Also Ask for location/contact searches */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactFAQSchema) }}
      />
      <ContactPage />
    </SiteLayoutWrapper>
  );
}
