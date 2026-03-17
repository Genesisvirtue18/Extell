export const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products' },
  { label: 'Solutions', path: '/solutions' },
  { label: 'Support', path: '/support' },
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
    quote:
      'Good Quality products and amazing prices. Very well trained staff and customer service is well appreciated. Keep up the great work',
    author: 'shijit nair'
  },
  {
    quote: 'Quality products at affordable price highly recommended.',
    author: 'Nidish Ram'
  },
  {
    quote: 'Affordable, cost friendly and quality products that brings much of customer satisfaction.',
    author: 'mayan prabhu'
  }
];

export const publicReviewSnapshots = [
  {
    platform: 'Justdial',
    rating: 4.7,
    totalRatings: 9,
    label: 'ExTell Systems, HMT Colony, Ernakulam',
    note: '100% authenticated and trusted ratings (as listed on Justdial).',
    url: 'https://www.justdial.com/jdmart/Ernakulam/ExTell-Systems-HMT-Colony/0484PX484-X484-221214162013-A6L7_BZDET/catalogue'
  },
  {
    platform: 'Google Reviews',
    rating: null,
    totalRatings: null,
    label: 'ExTell Systems Pvt Ltd (ExTell)',
    note: 'View latest public reviews directly on Google.',
    url: 'https://www.google.com/search?sca_esv=cb0b2358a0071c17&sxsrf=ANbL-n5Naq6SNJuW2wtlbF3v-EURhzzwGA:1772524650129&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOegHiz8b2a8wVJvfAi05XjpOJPGLXPHdRgNuWNvmptB-9YA2OuB_F2I1i-f0r0GU6JluMNWioZbq6neOceG4UX2AM54KZTCHRkLozZmr7A2e4WPfXg%3D%3D&q=ExTell+Systems+Pvt+Ltd+%28ExTell%29+Reviews&sa=X&ved=2ahUKEwijoYHxoIOTAxUVUGcHHRePBdcQ0bkNegQILxAH&biw=1280&bih=551&dpr=1.5'
  }
];

export const solutionShowcaseItems = [
  'Modular UPS solutions with hot-swappable architecture and N+1/N+N redundancy.',
  'Industrial UPS deployments for harsh environments with long-runtime backup options.',
  'Enterprise-grade structured cabling (SCS) covering EF, ER, TR/TE, and horizontal links.',
  'Solar solution stacks for residential, commercial, and industrial on-grid/off-grid projects.'
];

export const solutionIndustries = [
  'Telecom',
  'Data Centers',
  'Banking & Finance',
  'Healthcare',
  'Government',
  'Manufacturing',
  'Oil & Gas',
  'Utilities'
];

export const partnerLogos = ['NexGrid', 'OptiCore', 'VoltAxis', 'InfraPulse', 'Datatrail'];
