import SiteLayoutWrapper from '@/app/layout-wrapper';
import DownloadsPage from '@/pages/DownloadsPage';
import { canonicalUrl } from '@/lib/siteUrl';

export const metadata = {
  title: 'Downloads | ExTell Systems',
  description:
    'Access product datasheets, brochures, and technical downloads from ExTell Systems.',
  alternates: {
    canonical: canonicalUrl('/downloads'),
  },
};

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <DownloadsPage />
    </SiteLayoutWrapper>
  );
}
