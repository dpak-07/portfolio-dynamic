import { useEffect, useState } from "react";

export function useLightweightMotion() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }

    const queries = [window.matchMedia("(prefers-reduced-motion: reduce)")];

    const updatePreference = () => {
      const saveData = Boolean(navigator.connection?.saveData);
      setEnabled(saveData || queries.some((query) => query.matches));
    };

    updatePreference();
    queries.forEach((query) => query.addEventListener?.("change", updatePreference));

    return () => {
      queries.forEach((query) => query.removeEventListener?.("change", updatePreference));
    };
  }, []);

  return enabled;
}
