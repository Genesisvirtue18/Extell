import SiteLayoutWrapper from '@/app/layout-wrapper';
import SupportPage from '@/pages/SupportPage';
import { canonicalUrl } from '@/lib/siteUrl';
import {
  buildFAQSchema,
  buildBreadcrumbSchema,
  buildServiceSchema,
  ORG_ID,
  WEBSITE_ID,
} from '@/lib/schemas';

export const metadata = {
  title: 'Support Center — Warranty, Downloads & FAQs | ExTell Systems',
  description:
    'Get product support, FAQs, warranty registration, software downloads, and UPS calculator tools from ExTell Systems. 24/7 technical support for enterprise infrastructure.',
  alternates: {
    canonical: canonicalUrl('/support'),
  },
  openGraph: {
    title: 'Support Center | ExTell Systems',
    description:
      'Warranty registration, downloads, FAQs, and UPS runtime calculator — ExTell Systems enterprise support.',
    url: canonicalUrl('/support'),
    siteName: 'ExTell Systems',
    type: 'website',
  },
};

const url = canonicalUrl('/support');

// AEO: BreadcrumbList
const breadcrumbSchema = buildBreadcrumbSchema([
  { name: 'Home', url: canonicalUrl('/') },
  { name: 'Support', url },
]);

// GEO: TechSupport Service entity
const techSupportServiceSchema = buildServiceSchema({
  name: 'ExTell Systems Technical Support',
  description:
    'Enterprise technical support for UPS systems, fiber optic cables, structured cabling, and ICT infrastructure products. Includes warranty registration, software downloads, RMA handling, and 24/7 emergency support.',
  url,
  serviceType: 'TechnicalSupport',
});

// GEO: WebPage entity
const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${url}#webpage`,
  url,
  name: 'Support Center | ExTell Systems',
  description:
    'Product support, warranty, downloads, and tools for ExTell Systems enterprise infrastructure products.',
  isPartOf: { '@id': WEBSITE_ID },
  about: { '@id': ORG_ID },
  breadcrumb: breadcrumbSchema,
};

// AEO: Support FAQs — the actual questions customers ask support teams
const supportFAQSchema = buildFAQSchema([
  {
    q: 'How do I register my ExTell Systems product for warranty?',
    a: 'Visit extellsystems.com/warranty to complete online warranty registration. You will need your product model number, serial number, and purchase date. You can also email support@extellsystems.com with these details.',
  },
  {
    q: 'What is the warranty period for ExTell Systems UPS products?',
    a: 'Warranty periods vary by product line. Most UPS systems carry a 1–2 year manufacturer warranty. Extended service plans are available. Contact support@extellsystems.com for product-specific warranty details.',
  },
  {
    q: 'Where can I download firmware or software for ExTell Systems products?',
    a: 'Firmware updates, monitoring software, datasheets, and installation guides are available at extellsystems.com/downloads. Log in or register to access the full download library.',
  },
  {
    q: 'How do I calculate how long my UPS will run on battery?',
    a: 'Use the ExTell Systems UPS Runtime Calculator at extellsystems.com/ups-calculator. Enter your connected load in watts and your UPS model to estimate backup runtime.',
  },
  {
    q: 'How do I contact ExTell Systems technical support?',
    a: 'For technical support, email support@extellsystems.com or use the contact form at extellsystems.com/contact. Critical infrastructure customers may have access to 24/7 phone support — check your service agreement.',
  },
  {
    q: 'Does ExTell Systems provide on-site installation and commissioning?',
    a: 'Yes. ExTell Systems provides on-site installation, commissioning, and annual maintenance services for UPS systems and infrastructure products. Contact sales@extellsystems.com to arrange a site visit.',
  },
]);

export default function Page() {
  return (
    <SiteLayoutWrapper>
      {/* GEO: WebPage entity */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      {/* AEO: BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* GEO: TechSupportService entity */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techSupportServiceSchema) }}
      />
      {/* AEO: Support FAQPage — targets People Also Ask for "ExTell warranty", "UPS support", etc */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(supportFAQSchema) }}
      />
      <SupportPage />
    </SiteLayoutWrapper>
  );
}
