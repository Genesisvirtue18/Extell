import SiteLayoutWrapper from '@/app/layout-wrapper';
import SolutionsPage from '@/pages/SolutionsPage';
import { canonicalUrl } from '@/lib/siteUrl';
import {
  buildServiceSchema,
  buildBreadcrumbSchema,
  buildFAQSchema,
  buildItemListSchema,
  ORG_ID,
  WEBSITE_ID,
} from '@/lib/schemas';

export const metadata = {
  title: 'UPS, Fiber & Data Center Solutions | ExTell Systems',
  description:
    'Explore ExTell Systems solutions for modular UPS, industrial power, enterprise structured cabling, solar infrastructure, and data center power management.',
  alternates: {
    canonical: canonicalUrl('/solutions'),
  },
  openGraph: {
    title: 'Power & ICT Infrastructure Solutions | ExTell Systems',
    description:
      'Modular UPS, industrial power, structured cabling, and data center infrastructure solutions from ExTell Systems.',
    url: canonicalUrl('/solutions'),
    siteName: 'ExTell Systems',
    type: 'website',
  },
};

const url = canonicalUrl('/solutions');

// AEO: BreadcrumbList
const breadcrumbSchema = buildBreadcrumbSchema([
  { name: 'Home', url: canonicalUrl('/') },
  { name: 'Solutions', url },
]);

// GEO: Service schemas for each primary solution area
const modularUPSService = buildServiceSchema({
  name: 'Modular UPS Systems',
  description:
    'Scalable modular uninterruptible power supply systems for data centers and enterprise environments. Supports hot-swap modules, N+1 redundancy, and 10–800 kVA configurations.',
  url: canonicalUrl('/solutions#modular-ups'),
  serviceType: 'PowerInfrastructureService',
});

const industrialUPSService = buildServiceSchema({
  name: 'Industrial UPS & Power Conditioning',
  description:
    'Heavy-duty UPS systems for industrial, manufacturing, and utility environments. Designed for extreme temperatures, high-humidity operation, and 24/7 critical loads.',
  url: canonicalUrl('/solutions#industrial-ups'),
  serviceType: 'PowerInfrastructureService',
});

const structuredCablingService = buildServiceSchema({
  name: 'Enterprise Structured Cabling & Fiber Networks',
  description:
    'End-to-end structured cabling design and installation including fiber optic backbone, copper horizontal cabling, patch panels, cabinets, and active networking equipment.',
  url: canonicalUrl('/solutions#structured-cabling'),
  serviceType: 'ICTInfrastructureService',
});

const solarService = buildServiceSchema({
  name: 'Solar Power & Hybrid Energy Infrastructure',
  description:
    'Solar-hybrid power systems integrating UPS, battery storage, and solar panels for off-grid and grid-tie applications in telecom, government, and industrial facilities.',
  url: canonicalUrl('/solutions#solar'),
  serviceType: 'RenewableEnergyService',
});

// GEO: ItemList of all solutions (machine-readable menu for AI)
const solutionsItemList = buildItemListSchema('ExTell Solutions', url, [
  { name: 'Modular UPS Systems', url: canonicalUrl('/solutions#modular-ups') },
  { name: 'Industrial UPS & Power Conditioning', url: canonicalUrl('/solutions#industrial-ups') },
  { name: 'Enterprise Structured Cabling', url: canonicalUrl('/solutions#structured-cabling') },
  { name: 'Solar Power Infrastructure', url: canonicalUrl('/solutions#solar') },
]);

// GEO: WebPage entity
const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${url}#webpage`,
  url,
  name: 'UPS, Fiber & Data Center Solutions | ExTell Systems',
  description:
    'Modular UPS, industrial power, structured cabling, and data center infrastructure solutions.',
  isPartOf: { '@id': WEBSITE_ID },
  about: { '@id': ORG_ID },
  breadcrumb: breadcrumbSchema,
};

// AEO: FAQs for solution-level People Also Ask
const solutionsFAQSchema = buildFAQSchema([
  {
    q: 'What UPS solutions does ExTell Systems offer?',
    a: 'ExTell Systems offers modular UPS (10–800 kVA), online double-conversion UPS, industrial UPS, and solar-hybrid power systems for data centers, telecom, banking, and manufacturing environments.',
  },
  {
    q: 'Does ExTell Systems provide structured cabling design and installation?',
    a: 'Yes. ExTell Systems delivers end-to-end structured cabling solutions including fiber optic backbone, copper Cat6A/Cat7 horizontal cabling, patch panels, data cabinets, and active networking equipment.',
  },
  {
    q: 'Can ExTell Systems design a complete data center power solution?',
    a: 'Yes. ExTell Systems provides full data center power design including UPS selection, PDU placement, battery cabinet sizing, cabling, and monitoring system integration.',
  },
  {
    q: 'What is the difference between modular UPS and traditional UPS?',
    a: 'Modular UPS systems allow individual power modules to be added, removed, or replaced while the system remains online (hot-swap). This delivers N+1 redundancy, easier maintenance, and right-sized capacity growth compared to traditional monolithic UPS.',
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
      {/* GEO: Service entities per solution */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(modularUPSService) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(industrialUPSService) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredCablingService) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(solarService) }}
      />
      {/* GEO: Solutions ItemList — site taxonomy for AI */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(solutionsItemList) }}
      />
      {/* AEO: Solutions FAQPage — People Also Ask for solution queries */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(solutionsFAQSchema) }}
      />
      <SolutionsPage />
    </SiteLayoutWrapper>
  );
}
