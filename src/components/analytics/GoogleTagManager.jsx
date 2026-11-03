'use client';

import { useEffect } from 'react';

const GTM_ID = 'GTM-K7XBFBZ';

export default function GoogleTagManager({ nonce }) {
  useEffect(() => {
    if (window.__extellGtmLoaded) return;
    window.__extellGtmLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
    if (nonce) script.nonce = nonce;
    document.head.appendChild(script);
  }, [nonce]);

  return null;
}
