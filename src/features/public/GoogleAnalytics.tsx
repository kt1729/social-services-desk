import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

function Scripts() {
  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <script
        dangerouslySetInnerHTML={{
          // Static content only — measurementId comes from a build-time env var,
          // never from user input, so there is no XSS risk here.
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', { send_page_view: false });
          `,
        }}
      />
    </>
  );
}

function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', 'page_view', {
      page_path: location.pathname + location.search,
      page_location: window.location.href,
    });
  }, [location]);

  return null;
}

/**
 * Mounts GA4 tracking for the public portal.
 * Renders nothing when VITE_GA_MEASUREMENT_ID is not set.
 * Must be rendered inside a react-router context.
 */
export default function GoogleAnalytics() {
  if (!measurementId) return null;

  return (
    <>
      <Scripts />
      <PageViewTracker />
    </>
  );
}
