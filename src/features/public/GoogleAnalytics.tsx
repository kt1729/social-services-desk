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
  useEffect(() => {
    // React sets innerHTML on script nodes which browsers do not execute.
    // Imperatively creating and appending script elements is required for execution.
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', measurementId, { send_page_view: false });

    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
}

function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    // gtag is defined synchronously in Scripts' useEffect, so it's always available here.
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
