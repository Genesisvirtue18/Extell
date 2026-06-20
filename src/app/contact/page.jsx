import SiteLayoutWrapper from '@/app/layout-wrapper';
import ContactPage from '@/pages/ContactPage';
import { canonicalUrl } from '@/lib/siteUrl';

export const metadata = {
  title: 'Contact Sales & Engineering | ExTell Systems',
  description:
    'Contact ExTell Systems for UPS, power backup, structured cabling, and ICT infrastructure inquiries.',
  alternates: {
    canonical: canonicalUrl('/contact'),
  },
};

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <ContactPage />
    </SiteLayoutWrapper>
  );
}
