import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import SEO from "./components/SEO.jsx";

// ✅ Import the logUniqueUser function
import { logUniqueUser } from "./utils/analytics";

// ✅ Create a simple wrapper to log user visits once
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
