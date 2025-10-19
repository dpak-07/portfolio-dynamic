// src/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

console.log("🔥 Initializing Firebase...");
console.log("🔑 API Key exists:", !!import.meta.env.VITE_FIREBASE_API_KEY);
console.log("🌐 Project ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

console.log("🔥 Firebase config:", firebaseConfig);

// Initialize Firebase only if it hasn't been initialized
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
console.log("🔥 Firebase app initialized:", app.name);

// Initialize Firestore
export const db = getFirestore(app);
console.log("🔥 Firestore db initialized:", db ? "✅" : "❌");

export default app;