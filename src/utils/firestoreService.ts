// src/utils/firestoreService.ts
import { db } from "@/firebase/firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

// 🔹 Get all docs in a collection
export async function getCollectionData(collectionName: string) {
  const snap = await getDocs(collection(db, collectionName));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// 🔹 Get a single document
export async function getDocumentData(collectionName: string, docId: string) {
  const snap = await getDoc(doc(db, collectionName, docId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// 🔹 Create or overwrite document
export async function setDocumentData(collectionName: string, docId: string, data: any) {
  await setDoc(doc(db, collectionName, docId), data);
}

// 🔹 Update document (merge)
export async function updateDocumentData(collectionName: string, docId: string, data: any) {
  await updateDoc(doc(db, collectionName, docId), data);
}

// 🔹 Delete document
export async function deleteDocumentData(collectionName: string, docId: string) {
  await deleteDoc(doc(db, collectionName, docId));
}

// 🔹 Query with condition
export async function queryCollection(collectionName: string, field: string, operator: any, value: any) {
  const q = query(collection(db, collectionName), where(field, operator, value));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// 🔹 Real-time listener
export function subscribeToCollection(collectionName: string, callback: (docs: any[]) => void) {
  const colRef = collection(db, collectionName);
  return onSnapshot(colRef, (snap) => {
    const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(docs);
  });
}
