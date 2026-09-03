// import SiteLayoutWrapper from '@/app/layout-wrapper';
// import PartnerDetailPage from '@/pages/PartnerDetailPage';
// import { canonicalUrl } from '@/lib/siteUrl';

// export async function generateMetadata({ params }) {
//   const resolvedParams = await params;
//   const slug = resolvedParams?.slug || 'partner';

//   return {
//     title: `${slug} | Partner Details | ExTell Systems`,
//     description: 'Partner detail page for ExTell Systems channel partners.',
//     alternates: {
//       canonical: canonicalUrl(`/partner/${slug}`)
//     }
//   };
// }

// export default async function Page({ params }) {
//   const resolvedParams = await params;

//   return (
//     <SiteLayoutWrapper>
//       <PartnerDetailPage partnerSlug={resolvedParams?.slug || ''} />
//     </SiteLayoutWrapper>
//   );
// }
