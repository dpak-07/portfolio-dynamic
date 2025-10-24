// src/hooks/useAuth.ts
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "@/firebase";

/**
 * Monitors Firebase Auth user in real-time
 */
export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const unsub = onAuthStateChanged(auth, (u) => {
  //     setUser(u);
  //     setLoading(false);
  //   });
  //   return () => unsub();
  // }, []);

  return { user, loading };
}
