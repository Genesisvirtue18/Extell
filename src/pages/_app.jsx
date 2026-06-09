import Head from 'next/head';
import '@/tailwind.css';
import '@/styles.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
