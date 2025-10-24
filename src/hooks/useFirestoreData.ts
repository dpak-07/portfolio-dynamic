import { useEffect, useState, useCallback, useRef } from "react";
import { db } from "@/firebase";
import { collection, getDoc, getDocs, doc } from "firebase/firestore";

interface UseFirestoreDataOptions {
  /** Optional polling interval in milliseconds */
  refetchInterval?: number;
}

interface UseFirestoreDataReturn<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
export function useFirestoreData<T = any>(
  collectionName: string,
  docId?: string,
  options?: UseFirestoreDataOptions
): UseFirestoreDataReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { refetchInterval } = options || {};
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    if (!collectionName) {
      const msg = "Collection name is required";
      if (import.meta.env.DEV) console.error("❌", msg);
      setError(msg);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (docId) {
        // Fetch single document
        const docRef = doc(db, collectionName, docId);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const docData = { id: snap.id, ...snap.data() } as T;
          if (mountedRef.current) setData(docData);
          if (import.meta.env.DEV) console.log(`done`);
        } else {
          const msg = `Document not found: ${collectionName}/${docId}`;
          if (import.meta.env.DEV) console.warn(`⚠️ ${msg}`);
          if (mountedRef.current) {
            setData(null);
            setError(msg);
          }
        }
      } else {
        // Fetch entire collection
        const colRef = collection(db, collectionName);
        const snap = await getDocs(colRef);
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as T;

        if (mountedRef.current) {
          setData(docs);
          if (import.meta.env.DEV)
            console.log(`✅ Loaded collection: ${collectionName} (${snap.docs.length} docs)`);
        }
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : String(err ?? "Unknown error");
      const msg = `Failed to load ${collectionName}/${docId || "collection"}: ${errorMessage}`;
      console.error("❌ Firestore Error:", msg);
      if (mountedRef.current) setError(msg);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [collectionName, docId]);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();

    // Optional polling
    let interval: NodeJS.Timeout | null = null;
    if (refetchInterval && refetchInterval > 0) {
      interval = setInterval(fetchData, refetchInterval);
    }

    return () => {
      mountedRef.current = false;
      if (interval) clearInterval(interval);
    };
  }, [collectionName, docId, refetchInterval, fetchData]);

  return { data, loading, error, refetch: fetchData };
}
