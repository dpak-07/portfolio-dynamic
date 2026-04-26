import { StrictMode, useEffect } from "react";
import App from "@/App.jsx";
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import SEO from "@/components/SEO.jsx";
import { logUniqueUser } from "@/utils/analytics";

function RootApp({ ssrRendered = false }) {
  useEffect(() => {
    logUniqueUser();
  }, []);

  return (
    <>
      <SEO />
      <App ssrRendered={ssrRendered} />
    </>
  );
}

export default function ClientApp({ ssrRendered = false }) {
  return (
    <StrictMode>
      <ErrorBoundary>
        <RootApp ssrRendered={ssrRendered} />
      </ErrorBoundary>
    </StrictMode>
  );
}
