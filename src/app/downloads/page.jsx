import SiteLayoutWrapper from '@/app/layout-wrapper';
import DownloadsPage from '@/pages/DownloadsPage';

export const metadata = {
  title: 'Downloads | ExTell Systems',
  description:
    'Access product datasheets, brochures, and technical downloads from ExTell Systems.',
};

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <DownloadsPage />
    </SiteLayoutWrapper>
  );
}
