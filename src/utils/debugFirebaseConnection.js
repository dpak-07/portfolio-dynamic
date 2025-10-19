import { db } from "@/firebase";
import { getDoc, getDocs, doc, collection } from "firebase/firestore";

/**
 * ✅ Firestore Deep Debug Utility
 * 
 * Checks:
 *  - Firestore connection
 *  - Read permissions
 *  - Existence of key documents
 *  - Logs contents of each collection
 */
export async function debugFirebaseConnection() {
  console.log("🧩 [Firebase Debug] Checking Firestore connection...");

  const pathsToCheck = [
    { col: "homepage", docId: "main" },
    { col: "aboutpage", docId: "main" },
    { col: "sections", docId: "visibility" },
    { col: "admin", docId: "credentials" },
    { col: "footer", docId: "details" },
    { col: "techStack", docId: "categories" },
    { col: "config", docId: "portfolio" },
  ];

  try {
    // ✅ Check Firestore reachability with one lightweight call
    const testCollection = collection(db, "homepage");
    await getDocs(testCollection);
    console.log("✅ [Firebase Debug] Firestore reachable.");

    // 🔍 Iterate through key docs and log what exists
    for (const { col, docId } of pathsToCheck) {
      const ref = doc(db, col, docId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        console.log(`✅ [${col}/${docId}] Found document with ${Object.keys(snap.data()).length} fields.`);
        console.log("📄 Data:", snap.data());
      } else {
        console.warn(`⚠️ [${col}/${docId}] Document not found in Firestore.`);
      }
    }

    // 📚 Optionally: list all collections in Firestore
    console.log("🧩 [Firebase Debug] Listing all top-level collections...");
    const listRef = [
      "homepage",
      "aboutpage",
      "sections",
      "admin",
      "footer",
      "techStack",
      "config",
    ];
    for (const cName of listRef) {
      try {
        const colRef = collection(db, cName);
        const snapshot = await getDocs(colRef);
        if (!snapshot.empty) {
          const docIds = snapshot.docs.map((d) => d.id);
          console.log(`📚 Collection '${cName}' contains:`, docIds);
        } else {
          console.warn(`⚠️ Collection '${cName}' is empty.`);
        }
      } catch (e) {
        console.error(`❌ Error reading collection '${cName}':`, e.message);
      }
    }

    console.log("✅ [Firebase Debug] Firestore deep check completed successfully.");
  } catch (err) {
    console.error("❌ [Firebase Debug] Firestore connection failed:", err.message);
    console.error(err);
  }
}
