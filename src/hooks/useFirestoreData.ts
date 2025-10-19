// src/hooks/useFirestoreData.ts
import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, onSnapshot, doc } from "firebase/firestore";

export function useFirestoreData(collectionName: string, docId?: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log(`🔥 useFirestoreData called: ${collectionName}/${docId || 'collection'}`);
  console.log(`📡 Firebase db instance:`, db ? "✅ Available" : "❌ Not available");

  useEffect(() => {
    console.log(`🔄 Starting Firestore listener for: ${collectionName}/${docId || 'collection'}`);
    
    if (!collectionName) {
      console.error("❌ Collection name is required");
      setError("Collection name is required");
      setLoading(false);
      return;
    }

    let unsub: () => void;

    try {
      if (docId) {
        console.log(`📄 Setting up document listener for: ${collectionName}/${docId}`);
        const docRef = doc(db, collectionName, docId);
        console.log(`📄 Document reference:`, docRef);
        
        unsub = onSnapshot(
          docRef,
          (snap) => {
            console.log(`📄 Document snapshot received:`, snap.exists());
            if (snap.exists()) {
              const docData = { id: snap.id, ...snap.data() };
              console.log(`📄 Document data:`, docData);
              setData(docData);
            } else {
              console.warn(`📄 Document does not exist: ${collectionName}/${docId}`);
              setData(null);
            }
            setLoading(false);
            setError(null);
          },
          (err) => {
            console.error(`❌ Firestore error (${collectionName}/${docId}):`, err);
            setError(`Failed to load ${collectionName}/${docId}: ${err.message}`);
            setLoading(false);
          }
        );
      } else {
        console.log(`📚 Setting up collection listener for: ${collectionName}`);
        const colRef = collection(db, collectionName);
        console.log(`📚 Collection reference:`, colRef);
        
        unsub = onSnapshot(
          colRef,
          (snap) => {
            console.log(`📚 Collection snapshot received: ${snap.docs.length} documents`);
            const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            console.log(`📚 Collection data:`, docs);
            setData(docs);
            setLoading(false);
            setError(null);
          },
          (err) => {
            console.error(`❌ Firestore error (${collectionName}):`, err);
            setError(`Failed to load ${collectionName}: ${err.message}`);
            setLoading(false);
          }
        );
      }
    } catch (err) {
      console.error('❌ Firestore setup error:', err);
      setError(`Failed to setup Firestore connection: ${err}`);
      setLoading(false);
    }

    return () => {
      console.log(`🧹 Cleaning up Firestore listener for: ${collectionName}/${docId || 'collection'}`);
      if (unsub) unsub();
    };
  }, [collectionName, docId]);

  console.log(`📊 Hook state - loading: ${loading}, error: ${error}, data:`, data);

  return { data, loading, error };
}