// src/hooks/useToggle.ts
import { useState } from "react";

/**
 * Simple boolean toggle hook
 */
export function useToggle(initial = false) {
  const [state, setState] = useState(initial);
  const toggle = () => setState((s) => !s);
  return [state, toggle, setState] as const;
}
    