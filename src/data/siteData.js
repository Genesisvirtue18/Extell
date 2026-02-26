export const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products' },
  { label: 'Solutions', path: '/solutions' },
  { label: 'Support', path: '/support' },
  { label: 'Case Studies', path: '/case-studies' },
  { label: 'Certifications', path: '/certifications' },
  { label: 'Downloads', path: '/downloads' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' }
];

export const megaMenu = [
  {
    title: 'Product Segments',
    items: ['Fiber Cables', 'Fiber Accessories', 'UPS Systems', 'Data Center Solutions', 'Networking Products', 'Power Electronics']
  },
  {
    title: 'Service Tracks',
    items: ['Design Consultation', 'On-site Deployment', 'Preventive Maintenance', 'Lifecycle Support']
  },
  {
    title: 'Industries',
    items: ['Telecom Operators', 'Data Centers', 'Utilities', 'Government Infrastructure']
  }
];

export const categories = [
  { name: 'Fiber Cables', slug: 'fiber-cables' },
  { name: 'Fiber Accessories', slug: 'fiber-accessories' },
  { name: 'UPS Systems', slug: 'ups-systems' },
  { name: 'Data Center Solutions', slug: 'data-center-solutions' },
  { name: 'Networking Products', slug: 'networking-products' },
  { name: 'Power Electronics', slug: 'power-electronics' }
];

export const products = [
  {
    id: 'fc-001',
    category: 'fiber-cables',
    name: 'Armored Fiber Backbone Cable',
    short: 'Long-haul armored cable for metro and industrial routing.',
    specs: {
      Core: '96F',
      Standard: 'ITU-T G.652D',
      Temp: '-40 to +70 C'
    }
  },
  {
    id: 'ups-010',
    category: 'ups-systems',
    name: 'Modular Online UPS 60kVA',
    short: 'Scalable online double-conversion UPS for mission-critical loads.',
    specs: {
      Topology: 'Online Double Conversion',
      Capacity: '60kVA',
      Efficiency: 'Up to 96%'
    }
  },
  {
    id: 'e001gir31',
    category: 'ups-systems',
    name: 'Galaxy Internal Rack Mount 1 To 3KVA, Online UPS',
    short: 'ExTell Galaxy online UPS with internal batteries and expandable backup time.',
    specs: {
      SKU: 'E001GIR31',
      Capacity: '3000VA / 3000W',
      Topology: 'Online Double Conversion',
      Mounting: 'Rack-Tower compatible'
    }
  },
  {
    id: 'dc-021',
    category: 'data-center-solutions',
    name: 'Smart PDU Rack Series',
    short: 'Intelligent power distribution with branch-level monitoring.',
    specs: {
      Input: '3-Phase 415V',
      Outlets: '42',
      Monitoring: 'Per-outlet metering'
    }
  },
  {
    id: 'net-014',
    category: 'networking-products',
    name: 'Industrial Layer-3 Switch',
    short: 'Ruggedized managed switch for campus and edge operations.',
    specs: {
      Ports: '24x GE + 4x SFP+',
      Protocols: 'OSPF, VRRP, STP',
      Protection: 'IP30'
    }
  }
];

export const testimonials = [
  {
    quote: 'Extell delivered a resilient and standards-compliant backbone for our national rollout.',
    author: 'Program Director, Regional Telecom Group'
  },
  {
    quote: 'Their UPS and power architecture reduced downtime risk across our core facility.',
    author: 'Operations Lead, Financial Data Center'
  }
];

export const partnerLogos = ['NexGrid', 'OptiCore', 'VoltAxis', 'InfraPulse', 'Datatrail'];
