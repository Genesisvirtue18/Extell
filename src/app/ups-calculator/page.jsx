import SiteLayoutWrapper from '@/app/layout-wrapper';
import UpsCalculatorPage from '@/pages/UpsCalculatorPage';
import { canonicalUrl } from '@/lib/siteUrl';
import {
  buildHowToSchema,
  buildBreadcrumbSchema,
  buildFAQSchema,
  ORG_ID,
  WEBSITE_ID,
} from '@/lib/schemas';

export const metadata = {
  title: 'UPS Runtime Calculator — Estimate Battery Backup | ExTell Systems',
  description:
    'Use the ExTell Systems UPS runtime calculator to estimate how long your UPS will power connected equipment during a power outage. Enter load in watts and battery size to calculate runtime.',
  keywords: [
    'UPS runtime calculator',
    'battery backup calculator',
    'UPS battery life calculator',
    'how long will UPS last',
    'UPS load calculator',
    'power backup runtime',
  ],
  alternates: {
    canonical: canonicalUrl('/ups-calculator'),
  },
  openGraph: {
    title: 'UPS Runtime Calculator | ExTell Systems',
    description:
      'Calculate UPS battery runtime based on connected load. Free tool from ExTell Systems.',
    url: canonicalUrl('/ups-calculator'),
    siteName: 'ExTell Systems',
    type: 'website',
  },
};

const url = canonicalUrl('/ups-calculator');

// AEO: BreadcrumbList
const breadcrumbSchema = buildBreadcrumbSchema([
  { name: 'Home', url: canonicalUrl('/') },
  { name: 'Support', url: canonicalUrl('/support') },
  { name: 'UPS Runtime Calculator', url },
]);

// AEO + GEO: HowTo schema — targets "how to calculate UPS runtime" featured snippets
const howToSchema = buildHowToSchema({
  name: 'How to Calculate UPS Battery Runtime',
  description:
    'Estimate how long your UPS will power your equipment during a power outage using the ExTell Systems UPS runtime calculator.',
  url,
  steps: [
    {
      name: 'Enter the total connected load',
      text: 'Add up the power consumption (in watts) of all devices you want the UPS to power. Check device labels or datasheets for wattage. Enter the total load in the Load (W) field.',
    },
    {
      name: 'Select or enter your UPS capacity',
      text: 'Choose your UPS model from the dropdown or manually enter the UPS capacity in VA (volt-amperes) and the battery capacity in Ah (ampere-hours).',
    },
    {
      name: 'Set the power factor',
      text: 'Enter the power factor of your load (typically 0.8 for most office equipment). For pure resistive loads like heaters or incandescent lights, use 1.0.',
    },
    {
      name: 'Calculate runtime',
      text: 'Click the Calculate button. The tool will display the estimated battery runtime in minutes and hours based on your inputs.',
    },
    {
      name: 'Compare configurations',
      text: 'Adjust the load or battery capacity to compare different UPS configurations and find the right UPS size for your requirements.',
    },
  ],
});

// GEO: SoftwareApplication entity for the calculator tool
const calculatorAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  '@id': `${url}#app`,
  name: 'UPS Runtime Calculator',
  url,
  description:
    'An online tool to calculate UPS battery backup runtime based on connected load, UPS capacity, and battery size.',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any (web-based)',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  provider: { '@id': ORG_ID },
};

// GEO: WebPage entity
const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${url}#webpage`,
  url,
  name: 'UPS Runtime Calculator | ExTell Systems',
  description:
    'Free online UPS battery runtime calculator. Estimate backup time for your UPS based on load and battery capacity.',
  isPartOf: { '@id': WEBSITE_ID },
  breadcrumb: breadcrumbSchema,
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1', '.calculator-intro'],
  },
};

// AEO: FAQs for UPS calculator — covers high-volume "how long will UPS last" queries
const calculatorFAQSchema = buildFAQSchema([
  {
    q: 'How do I calculate how long a UPS will last?',
    a: 'UPS runtime = (Battery Capacity in Ah × Battery Voltage × Power Factor × Efficiency) ÷ Load in Watts. Use the ExTell Systems UPS Runtime Calculator at extellsystems.com/ups-calculator for a quick automated estimate.',
  },
  {
    q: 'How long will a 1kVA UPS run with a 500W load?',
    a: 'A 1 kVA UPS (typically 700–800W usable) with standard 7Ah batteries will run approximately 5–10 minutes at 500W load. Adding external battery packs can extend this to 30+ minutes.',
  },
  {
    q: 'What is the formula for UPS battery runtime?',
    a: 'Approximate UPS runtime (hours) = (Battery Ah × Voltage × 0.8 efficiency) ÷ Load in Watts. For example: (100Ah × 48V × 0.8) ÷ 500W = 7.68 hours.',
  },
  {
    q: 'How many watts can a 1000VA UPS handle?',
    a: 'A 1000 VA UPS with a 0.8 power factor can handle up to 800 watts of connected load. Exceeding this rating will cause the UPS to alarm or shut down.',
  },
  {
    q: 'Can I connect a generator to a UPS?',
    a: 'Yes, many ExTell Systems UPS models support generator compatibility mode. This adjusts the input voltage/frequency tolerance to accept the variable output typical of diesel generators. Check your UPS model specifications or contact support@extellsystems.com.',
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
      {/* AEO + GEO: HowTo — targets "how to calculate UPS runtime" featured snippet */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      {/* GEO: SoftwareApplication entity for the calculator */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorAppSchema) }}
      />
      {/* AEO: FAQ rich result — high-volume UPS battery questions */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorFAQSchema) }}
      />
      <UpsCalculatorPage />
    </SiteLayoutWrapper>
  );
}
