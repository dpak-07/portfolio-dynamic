import { StrictMode, useEffect } from "react";
import App from "@/App.jsx";
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import SEO from "@/components/SEO.jsx";
import { logUniqueUser } from "@/utils/analytics";

function RootApp() {
  useEffect(() => {
    logUniqueUser();
  }, []);

  return (
    <>
      <SEO />
      <App />
    </>
  );
}

export default function ClientApp() {
  return (
    <StrictMode>
      <ErrorBoundary>
        <RootApp />
      </ErrorBoundary>
    </StrictMode>
  );
}
