import { useCallback, useEffect, useRef, useState } from "react";
import { fetchFirestoreEntry, readFirestoreCache } from "@/utils/firestoreCache";

interface UseFirestoreDataOptions {
  refetchInterval?: number;
}

interface UseFirestoreDataReturn<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useFirestoreData<T = any>(
  collectionName: string | null,
  docId?: string,
  options?: UseFirestoreDataOptions
): UseFirestoreDataReturn<T> {
  const [data, setData] = useState<T | null>(() => {
    if (!collectionName) return null;
    return (readFirestoreCache(collectionName, docId) ?? null) as T | null;
  });
  const [loading, setLoading] = useState<boolean>(() => {
    if (!collectionName) return false;
    return readFirestoreCache(collectionName, docId) === undefined;
  });
  const [error, setError] = useState<string | null>(null);

  const { refetchInterval } = options || {};
  const mountedRef = useRef(true);

  const fetchData = useCallback(
    async (force = false) => {
      if (!collectionName) {
        setError(null);
        setLoading(false);
        return;
      }

      try {
        setError(null);

        const cached = !force ? readFirestoreCache(collectionName, docId) : undefined;
        if (cached !== undefined) {
          if (mountedRef.current) {
            setData(cached as T | null);
            setLoading(false);
          }
          return;
        }

        setLoading(true);
        const result = await fetchFirestoreEntry(collectionName, docId, { force });

        if (docId && !result) {
          const message = `Document not found: ${collectionName}/${docId}`;
          if (mountedRef.current) {
            setData(null);
            setError(message);
          }
          return;
        }

        if (mountedRef.current) {
          setData((result ?? null) as T | null);
        }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : String(err ?? "Unknown error");
        const message = `Failed to load ${collectionName}/${docId || "collection"}: ${errorMessage}`;
        console.error("Firestore Error:", message);
        if (mountedRef.current) setError(message);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    },
    [collectionName, docId]
  );

  useEffect(() => {
    mountedRef.current = true;
    void fetchData();

    let interval: ReturnType<typeof setInterval> | null = null;
    if (refetchInterval && refetchInterval > 0) {
      interval = setInterval(() => {
        void fetchData(true);
      }, refetchInterval);
    }

    return () => {
      mountedRef.current = false;
      if (interval) clearInterval(interval);
    };
  }, [collectionName, docId, refetchInterval, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: async () => {
      await fetchData(true);
    },
  };
}
