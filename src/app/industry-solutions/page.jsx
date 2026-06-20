import SiteLayoutWrapper from '@/app/layout-wrapper';
import IndustrySolutionsPage from '@/pages/IndustrySolutionsPage';
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
  title: 'Industry Solutions — Telecom, Banking, Government & Data Centers | ExTell Systems',
  description:
    'Explore industry-specific UPS and ICT infrastructure solutions from ExTell Systems — designed for telecom operators, data centers, banking and finance, government, manufacturing, oil and gas, and utilities.',
  alternates: {
    canonical: canonicalUrl('/industry-solutions'),
  },
  openGraph: {
    title: 'Industry Solutions | ExTell Systems',
    description:
      'Tailored power and ICT infrastructure for telecom, data centers, banking, government, manufacturing, and utilities.',
    url: canonicalUrl('/industry-solutions'),
    siteName: 'ExTell Systems',
    type: 'website',
  },
};

const url = canonicalUrl('/industry-solutions');

// AEO: BreadcrumbList
const breadcrumbSchema = buildBreadcrumbSchema([
  { name: 'Home', url: canonicalUrl('/') },
  { name: 'Industry Solutions', url },
]);

// GEO: Service entities per vertical
const telecomService = buildServiceSchema({
  name: 'Telecom Infrastructure Power Solutions',
  description:
    'UPS systems, rectifiers, battery cabinets, and fiber optic cabling designed for telecom base stations, central offices, and network operations centers. Supports 48V DC and AC systems, outdoor enclosures, and remote monitoring.',
  url: canonicalUrl('/industry-solutions#telecom'),
  serviceType: 'TelecomInfrastructureService',
});

const dataCenterService = buildServiceSchema({
  name: 'Data Center Power & Cooling Infrastructure',
  description:
    'Modular and static UPS systems, PDUs, cable management, and structured cabling for Tier 1–4 data centers. Includes N+1 and 2N redundancy configurations, hot-aisle containment, and DCIM integration.',
  url: canonicalUrl('/industry-solutions#data-centers'),
  serviceType: 'DataCenterInfrastructureService',
});

const bankingService = buildServiceSchema({
  name: 'Banking & Finance Critical Power Solutions',
  description:
    'High-availability UPS and power conditioning systems for banking data centers, ATM networks, trading floors, and core banking infrastructure. Compliant with RBI and SWIFT operational continuity requirements.',
  url: canonicalUrl('/industry-solutions#banking'),
  serviceType: 'FinancialInfrastructureService',
});

const governmentService = buildServiceSchema({
  name: 'Government & Defense Infrastructure',
  description:
    'Ruggedized UPS systems, secure network cabling, and power conditioning for government offices, military facilities, and public safety networks. Meets government procurement and security standards.',
  url: canonicalUrl('/industry-solutions#government'),
  serviceType: 'GovernmentInfrastructureService',
});

const manufacturingService = buildServiceSchema({
  name: 'Industrial & Manufacturing Power Systems',
  description:
    'Industrial-grade UPS systems and power conditioning for factories, process control systems, SCADA networks, and automation equipment. Designed for harsh environments, extended temperature ranges, and high-inrush loads.',
  url: canonicalUrl('/industry-solutions#manufacturing'),
  serviceType: 'IndustrialPowerService',
});

const oilGasService = buildServiceSchema({
  name: 'Oil, Gas & Utilities Power Infrastructure',
  description:
    'Explosion-proof UPS systems, ATEX-rated power equipment, and ruggedized networking for oil refineries, gas pipelines, offshore platforms, and utility control centers.',
  url: canonicalUrl('/industry-solutions#oil-gas'),
  serviceType: 'EnergyInfrastructureService',
});

// GEO: ItemList of all verticals — machine-readable site taxonomy
const industriesItemList = buildItemListSchema('Industries Served', url, [
  { name: 'Telecom & Network Operators', url: canonicalUrl('/industry-solutions#telecom') },
  { name: 'Data Centers', url: canonicalUrl('/industry-solutions#data-centers') },
  { name: 'Banking & Finance', url: canonicalUrl('/industry-solutions#banking') },
  { name: 'Government & Defense', url: canonicalUrl('/industry-solutions#government') },
  { name: 'Manufacturing & Industrial', url: canonicalUrl('/industry-solutions#manufacturing') },
  { name: 'Oil, Gas & Utilities', url: canonicalUrl('/industry-solutions#oil-gas') },
]);

// GEO: WebPage entity
const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${url}#webpage`,
  url,
  name: 'Industry Solutions | ExTell Systems',
  description:
    'Industry-specific UPS and ICT infrastructure solutions for telecom, data centers, banking, government, and manufacturing.',
  isPartOf: { '@id': WEBSITE_ID },
  about: { '@id': ORG_ID },
  breadcrumb: breadcrumbSchema,
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1', '.industries-intro'],
  },
};

// AEO: Industry-focused FAQs — People Also Ask for vertical-specific queries
const industryFAQSchema = buildFAQSchema([
  {
    q: 'What UPS systems does ExTell Systems recommend for telecom base stations?',
    a: 'For telecom base stations, ExTell Systems recommends 48V DC UPS systems with outdoor-rated battery cabinets, remote SNMP monitoring, and wide-temperature operation (-20°C to +55°C). Contact sales@extellsystems.com for site-specific recommendations.',
  },
  {
    q: 'Does ExTell Systems supply UPS for data centers?',
    a: 'Yes. ExTell Systems provides modular UPS systems (10–800 kVA), static UPS, PDUs, cable management, and full structured cabling infrastructure for Tier 1–4 data center deployments.',
  },
  {
    q: 'What power solutions does ExTell Systems offer for banking infrastructure?',
    a: 'ExTell Systems provides high-availability online double-conversion UPS, power conditioning, PDUs, and dual-bus power distribution for banking data centers, trading floors, and ATM networks.',
  },
  {
    q: 'Can ExTell Systems supply UPS for industrial and manufacturing plants?',
    a: 'Yes. ExTell Systems offers industrial-grade UPS systems rated for extended temperature ranges, high humidity, and high-inrush motor loads. These are suitable for SCADA, PLC, and automation systems in manufacturing environments.',
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
      {/* GEO: Service entities per industry vertical */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(telecomService) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dataCenterService) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bankingService) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(governmentService) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(manufacturingService) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(oilGasService) }}
      />
      {/* GEO: Industries ItemList — taxonomy for AI crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(industriesItemList) }}
      />
      {/* AEO: Industry FAQPage — People Also Ask for vertical-specific queries */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(industryFAQSchema) }}
      />
      <IndustrySolutionsPage />
    </SiteLayoutWrapper>
  );
}
