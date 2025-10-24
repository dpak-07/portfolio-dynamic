// src/utils/firebaseHelpers.ts
import { getDocumentData, setDocumentData, updateDocumentData } from "@/utils/firestoreService";

// Example helper: fetch section visibility config
export async function getSectionsConfig() {
  return await getDocumentData("sections", "visibility");
}

// Example helper: toggle visibility
export async function toggleSection(name: string, value: boolean) {
  await updateDocumentData("sections", "visibility", { [name]: value });
}

// Example helper: save admin credentials (careful!)
export async function saveAdminCredentials(user: string, password: string, secret: number) {
  await setDocumentData("admin", "credentials", { user, password, secret });
}
