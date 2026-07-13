import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      event: "page_view",
      page_title: document.title,
      page_location: window.location.href,
      page_path: location.pathname,
    });
  }, [location]);

  return null;
};

export default GoogleAnalytics;