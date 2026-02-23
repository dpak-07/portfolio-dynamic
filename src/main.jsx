import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import SEO from "./components/SEO.jsx";

// Import the logUniqueUser function
import { logUniqueUser } from "./utils/analytics";

async function clearBrowserStateOnEveryLoad() {
  try {
    localStorage.clear();
  } catch {
    // ignore storage access failures
  }

  try {
    sessionStorage.clear();
  } catch {
    // ignore storage access failures
  }

  try {
    if ("caches" in window) {
      const cacheKeys = await caches.keys();
      await Promise.all(cacheKeys.map((key) => caches.delete(key)));
    }
  } catch {
    // ignore cache API failures
  }

  try {
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    }
  } catch {
    // ignore service worker failures
  }
}

void clearBrowserStateOnEveryLoad();

// Create a simple wrapper to log user visits once
function RootApp() {
  useEffect(() => {
    logUniqueUser(); // Logs one unique visitor per day
  }, []);

  return (
    <>
      <SEO />
      <App />
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <RootApp />
    </ErrorBoundary>
  </StrictMode>
);
