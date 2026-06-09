import SiteLayoutWrapper from '@/app/layout-wrapper';
import ContactPage from '@/pages/ContactPage';

export const metadata = {
  title: 'Contact Sales & Engineering | ExTell Systems',
  description:
    'Contact ExTell Systems for UPS, power backup, structured cabling, and ICT infrastructure inquiries.',
};

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <ContactPage />
    </SiteLayoutWrapper>
  );
}
