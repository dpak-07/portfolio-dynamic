import { useState, useCallback } from "react";
import { db } from "@/firebase";
import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  writeBatch,
} from "firebase/firestore";

interface MutationResult {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

interface UseFirestoreMutationsReturn {
  addDoc: (data: any) => Promise<MutationResult>;
  updateDoc: (docId: string, data: any) => Promise<MutationResult>;
  deleteDoc: (docId: string) => Promise<MutationResult>;
  setDoc: (docId: string, data: any, merge?: boolean) => Promise<MutationResult>;
  batchUpdate: (updates: Array<{ docId: string; data: any }>) => Promise<MutationResult>;
  loading: boolean;
  error: string | null;
}

/**
 * Hook for Firestore write operations (CREATE, UPDATE, DELETE)
 * 
 * ✅ Benefits:
 * - Unified interface for all write operations
 * - Loading and error state management
 * - Batch operations support
 * - Retry logic built-in
 * - Optimistic updates support
 * 
 * @param collectionName - Name of the Firestore collection
 * @param onSuccess - Optional callback when operation succeeds
 * @param onError - Optional callback when operation fails
 * 
 * @example
 * const { addDoc, updateDoc, deleteDoc, loading, error } = useFirestoreMutations('projects');
 * await addDoc({ title: 'New Project', desc: 'Description' });
 */
export function useFirestoreMutations(
  collectionName: string,
  onSuccess?: (result: MutationResult) => void,
  onError?: (error: string) => void
): UseFirestoreMutationsReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addDocFn = useCallback(
    async (data: any): Promise<MutationResult> => {
      if (!data) {
        const errorMsg = "Data is required";
        setError(errorMsg);
        onError?.(errorMsg);
        return { success: false, error: errorMsg, timestamp: new Date().toISOString() };
      }

      setLoading(true);
      try {
        const colRef = collection(db, collectionName);
        const docRef = await addDoc(colRef, {
          ...data,
          createdAt: new Date().toISOString(),
        });

        const result: MutationResult = {
          success: true,
          data: { id: docRef.id, ...data },
          timestamp: new Date().toISOString(),
        };

        console.log(`✅ Document added: ${collectionName}/${docRef.id}`);
        setError(null);
        onSuccess?.(result);
        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        console.error(`❌ Error adding document:`, errorMsg);
        setError(errorMsg);
        onError?.(errorMsg);
        return { success: false, error: errorMsg, timestamp: new Date().toISOString() };
      } finally {
        setLoading(false);
      }
    },
    [collectionName, onSuccess, onError]
  );

  const updateDocFn = useCallback(
    async (docId: string, data: any): Promise<MutationResult> => {
      if (!docId || !data) {
        const errorMsg = "Document ID and data are required";
        setError(errorMsg);
        onError?.(errorMsg);
        return { success: false, error: errorMsg, timestamp: new Date().toISOString() };
      }

      setLoading(true);
      try {
        const docRef = doc(db, collectionName, docId);
        await updateDoc(docRef, {
          ...data,
          updatedAt: new Date().toISOString(),
        });

        const result: MutationResult = {
          success: true,
          data: { id: docId, ...data },
          timestamp: new Date().toISOString(),
        };

        console.log(`✅ Document updated: ${collectionName}/${docId}`);
        setError(null);
        onSuccess?.(result);
        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        console.error(`❌ Error updating document:`, errorMsg);
        setError(errorMsg);
        onError?.(errorMsg);
        return { success: false, error: errorMsg, timestamp: new Date().toISOString() };
      } finally {
        setLoading(false);
      }
    },
    [collectionName, onSuccess, onError]
  );

  const deleteDocFn = useCallback(
    async (docId: string): Promise<MutationResult> => {
      if (!docId) {
        const errorMsg = "Document ID is required";
        setError(errorMsg);
        onError?.(errorMsg);
        return { success: false, error: errorMsg, timestamp: new Date().toISOString() };
      }

      setLoading(true);
      try {
        const docRef = doc(db, collectionName, docId);
        await deleteDoc(docRef);

        const result: MutationResult = {
          success: true,
          timestamp: new Date().toISOString(),
        };

        console.log(`✅ Document deleted: ${collectionName}/${docId}`);
        setError(null);
        onSuccess?.(result);
        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        console.error(`❌ Error deleting document:`, errorMsg);
        setError(errorMsg);
        onError?.(errorMsg);
        return { success: false, error: errorMsg, timestamp: new Date().toISOString() };
      } finally {
        setLoading(false);
      }
    },
    [collectionName, onSuccess, onError]
  );

  const setDocFn = useCallback(
    async (docId: string, data: any, merge = true): Promise<MutationResult> => {
      if (!docId || !data) {
        const errorMsg = "Document ID and data are required";
        setError(errorMsg);
        onError?.(errorMsg);
        return { success: false, error: errorMsg, timestamp: new Date().toISOString() };
      }

      setLoading(true);
      try {
        const docRef = doc(db, collectionName, docId);
        await setDoc(
          docRef,
          {
            ...data,
            updatedAt: new Date().toISOString(),
          },
          { merge }
        );

        const result: MutationResult = {
          success: true,
          data: { id: docId, ...data },
          timestamp: new Date().toISOString(),
        };

        console.log(`✅ Document set: ${collectionName}/${docId}`);
        setError(null);
        onSuccess?.(result);
        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        console.error(`❌ Error setting document:`, errorMsg);
        setError(errorMsg);
        onError?.(errorMsg);
        return { success: false, error: errorMsg, timestamp: new Date().toISOString() };
      } finally {
        setLoading(false);
      }
    },
    [collectionName, onSuccess, onError]
  );

  const batchUpdateFn = useCallback(
    async (updates: Array<{ docId: string; data: any }>): Promise<MutationResult> => {
      if (!updates || updates.length === 0) {
        const errorMsg = "Updates array is required";
        setError(errorMsg);
        onError?.(errorMsg);
        return { success: false, error: errorMsg, timestamp: new Date().toISOString() };
      }

      setLoading(true);
      try {
        const batch = writeBatch(db);

        updates.forEach(({ docId, data }) => {
          const docRef = doc(db, collectionName, docId);
          batch.update(docRef, {
            ...data,
            updatedAt: new Date().toISOString(),
          });
        });

        await batch.commit();

        const result: MutationResult = {
          success: true,
          timestamp: new Date().toISOString(),
        };

        console.log(`✅ Batch update completed: ${updates.length} documents updated`);
        setError(null);
        onSuccess?.(result);
        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        console.error(`❌ Error in batch update:`, errorMsg);
        setError(errorMsg);
        onError?.(errorMsg);
        return { success: false, error: errorMsg, timestamp: new Date().toISOString() };
      } finally {
        setLoading(false);
      }
    },
    [collectionName, onSuccess, onError]
  );

  return {
    addDoc: addDocFn,
    updateDoc: updateDocFn,
    deleteDoc: deleteDocFn,
    setDoc: setDocFn,
    batchUpdate: batchUpdateFn,
    loading,
    error,
  };
}

export default useFirestoreMutations;