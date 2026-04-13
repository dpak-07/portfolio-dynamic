import { db } from "../firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

const dataCache = new Map();
const requestCache = new Map();

export function getFirestoreCacheKey(collectionName, docId) {
  return docId ? `doc:${collectionName}/${docId}` : `collection:${collectionName}`;
}

export function readFirestoreCache(collectionName, docId) {
  return dataCache.get(getFirestoreCacheKey(collectionName, docId));
}

export function writeFirestoreCache(collectionName, docId, value) {
  dataCache.set(getFirestoreCacheKey(collectionName, docId), value);
  return value;
}

async function loadFirestoreEntry(collectionName, docId) {
  if (docId) {
    const snapshot = await getDoc(doc(db, collectionName, docId));
    if (!snapshot.exists()) {
      return null;
    }

    return { id: snapshot.id, ...snapshot.data() };
  }

  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function fetchFirestoreEntry(collectionName, docId, options = {}) {
  const { force = false } = options;

  if (!collectionName) {
    return null;
  }

  const cacheKey = getFirestoreCacheKey(collectionName, docId);

  if (!force && dataCache.has(cacheKey)) {
    return dataCache.get(cacheKey);
  }

  if (!force && requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey);
  }

  const request = loadFirestoreEntry(collectionName, docId)
    .then((result) => writeFirestoreCache(collectionName, docId, result))
    .finally(() => {
      requestCache.delete(cacheKey);
    });

  requestCache.set(cacheKey, request);
  return request;
}

export async function preloadFirestoreEntries(entries = []) {
  const pending = entries
    .filter((entry) => entry?.collectionName)
    .map((entry) => fetchFirestoreEntry(entry.collectionName, entry.docId));

  return Promise.allSettled(pending);
}
