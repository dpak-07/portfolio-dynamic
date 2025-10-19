// seed.js
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import dotenv from "dotenv";
dotenv.config();

// ✅ Your profile data
const profileData = {
  name: "Deepak",
  roles: "Full-Stack Developer • Cloud Engineer • AI Enthusiast",
  typewriterLines: [
    "Deploying apps on AWS EC2 & S3 ☁️",
    "Automating tasks with Linux scripts 🐧",
    "Building scalable full-stack apps with React & Node ⚙️",
  ],
  resumeDriveLink:
    "https://drive.google.com/file/d/1BzHbJLKXz0xJFrsd9ZgJkAB0aR9d8nW_/view?usp=sharing",
  socials: {
    github: "https://github.com/dpak-07",
    linkedin: "https://www.linkedin.com/in/deepak-saminathan/",
    email: "mailto:deepakofficial0103@gmail.com",
    instagram: "https://www.instagram.com/deepak.codes/",
    twitter: "",
    website: "https://deepak-portfolio.vercel.app",
  },
};

// ✅ Firebase setup
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Seed Firestore with your data
async function seedData() {
  try {
    console.log("🚀 Seeding Firestore with profile data...");

    // You can use any collection and document name you like.
    // For example: "portfolio" collection → "profile" document
    await setDoc(doc(db, "portfolio", "profile"), profileData);

    console.log("✅ Data successfully added to Firestore!");
  } catch (error) {
    console.error("❌ Error seeding Firestore:", error);
  }
}

seedData();
