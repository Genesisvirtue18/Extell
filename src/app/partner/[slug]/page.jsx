import SiteLayoutWrapper from '@/app/layout-wrapper';
import PartnerDetailPage from '@/pages/PartnerDetailPage';
import { canonicalUrl } from '@/lib/siteUrl';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || 'partner';
  const partnerName = slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return {
    title: { absolute: `${partnerName.slice(0, 35).trimEnd()} | ExTell Systems` },
    description: 'Partner detail page for ExTell Systems channel partners.',
    alternates: {
      canonical: canonicalUrl(`/partner/${slug}`)
    }
  };
}

export default async function Page({ params }) {
  const resolvedParams = await params;

  return (
    <SiteLayoutWrapper>
      <PartnerDetailPage partnerSlug={resolvedParams?.slug || ''} />
    </SiteLayoutWrapper>
  );
}
