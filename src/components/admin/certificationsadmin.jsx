"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, Save, RotateCcw, Download, Upload,
  Plus, X, ArrowUp, ArrowDown, Link as LinkIcon, FileText, Type, KeyRound,
  Loader, AlertCircle, CheckCircle, Wifi, WifiOff, FileBadge, Building2,
  CalendarDays, BookOpen, Briefcase, Award, Image as ImageIcon, ExternalLink
} from "lucide-react";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { uploadImage } from "@/utils/supabaseStorage";

/* ================================
   STORAGE & ADMIN SETTINGS
================================== */
const STORAGE_DRAFT_KEY = "certificates_config_draft";
const STORAGE_SAVED_KEY = "certificates_config_saved";
const FIRESTORE_CERTIFICATES_DOC = "certifications/data";
const FIRESTORE_ADMIN_DOC = "admin/credentials";
const SYNC_DEBOUNCE = 500;

/* ================================
   CRT STYLES
================================== */
const CRTStyles = () => (
  <style>{`
    @keyframes flicker { 0%, 100% { opacity: 0.95; } 50% { opacity: 1; } }
    @keyframes scanline { 0% { transform: translateY(-100%);} 100% { transform: translateY(100%);} }
    @keyframes textGlow {
      0%,100%{text-shadow:0 0 10px rgba(0,229,255,0.8),0 0 20px rgba(0,229,255,0.4);}
      50%{text-shadow:0 0 15px rgba(0,229,255,1),0 0 30px rgba(0,229,255,0.6);}
    }
    .crt-screen{position:relative;background:radial-gradient(ellipse at center,#0d1f2d 0%,#050a0f 100%);animation:flicker .15s infinite;}
    .crt-screen::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,255,255,.03) 0px,transparent 1px,transparent 2px,rgba(0,255,255,.03) 3px);pointer-events:none;z-index:50;}
    .crt-screen::after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,transparent 50%,rgba(0,255,255,.02) 50%);background-size:100% 4px;pointer-events:none;z-index:51;animation:scanline 8s linear infinite;}
    .crt-glow{box-shadow:inset 0 0 100px rgba(0,229,255,.1),inset 0 0 50px rgba(0,229,255,.05),0 0 50px rgba(0,229,255,.2);}
    .crt-text{color:#00e5ff;text-shadow:0 0 10px rgba(0,229,255,.8),0 0 20px rgba(0,229,255,.4);font-family:'Courier New',monospace;}
    .crt-button{background:linear-gradient(135deg,rgba(0,229,255,.2),rgba(0,229,255,.1));border:2px solid rgba(0,229,255,.4);box-shadow:0 0 20px rgba(0,229,255,.3),inset 0 0 10px rgba(0,229,255,.1);transition:all .3s;}
    .crt-button:hover{background:linear-gradient(135deg,rgba(0,229,255,.3),rgba(0,229,255,.2));border-color:rgba(0,229,255,.6);box-shadow:0 0 30px rgba(0,229,255,.5),inset 0 0 15px rgba(0,229,255,.2);transform:translateY(-2px);}
    .crt-button:disabled{opacity:.3;cursor:not-allowed;}
    .crt-input{background:rgba(0,0,0,.6);border:2px solid rgba(0,229,255,.3);color:#00e5ff;box-shadow:inset 0 0 20px rgba(0,229,255,.1);}
    .crt-input:focus{outline:none;border-color:rgba(0,229,255,.6);box-shadow:0 0 20px rgba(0,229,255,.3),inset 0 0 20px rgba(0,229,255,.2);}
    .crt-panel{background:linear-gradient(135deg,rgba(0,20,30,.95),rgba(0,10,20,.98));border:2px solid rgba(0,229,255,.3);box-shadow:0 0 30px rgba(0,229,255,.2),inset 0 0 30px rgba(0,0,0,.5);}
    .crt-header{animation:textGlow 2s infinite;}
    .terminal-cursor::after{content:'▋';animation:blink 1s step-end infinite;}
    @keyframes blink{0%,50%{opacity:1;}51%,100%{opacity:0;}}
    .hide-scrollbar::-webkit-scrollbar{width:8px;}
    .hide-scrollbar::-webkit-scrollbar-track{background:rgba(0,0,0,.3);}
    .hide-scrollbar::-webkit-scrollbar-thumb{background:rgba(0,229,255,.3);border-radius:4px;}
    .hide-scrollbar::-webkit-scrollbar-thumb:hover{background:rgba(0,229,255,.5);}
    .status-success{color:#4ade80;text-shadow:0 0 10px rgba(74,222,128,0.6);}
    .status-error{color:#f87171;text-shadow:0 0 10px rgba(248,113,113,0.6);}
    .status-info{color:#60a5fa;text-shadow:0 0 10px rgba(96,165,250,0.6);}
    .image-preview{max-height:200px;object-fit:contain;border:2px solid rgba(0,229,255,.3);border-radius:8px;}
    .image-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;}
    .image-item{position:relative;border:2px solid rgba(0,229,255,.2);border-radius:6px;overflow:hidden;}
    .image-item img{width:100%;height:120px;object-fit:cover;}
    .image-actions{position:absolute;top:5px;right:5px;display:flex;gap:2px;}
  `}</style>
);

/* ================================
   DEFAULT CONFIG (Certificates)
================================== */
const defaultConfig = {
  categories: [
    {
      id: "courses",
      label: "Courses & Certifications",
      icon: "BookOpen",
      items: [
        {
          title: "Full Stack Web Development",
          issuer: "CSC - HDFC Skill Development Center, Kolathur",
          date: "August 2024",
          desc: "Comprehensive full-stack development training covering C, C++, Java, and modern web technologies with extensive hands-on project experience.",
          images: [
            "https://1drv.ms/i/c/b09eaa48933f939d/IQRGgAevQWTFRYFvedm-6vbwAYnNsa33tQ97EeWP_vxKcHA?width=1280&height=1688",
            "https://1drv.ms/i/c/b09eaa48933f939d/IQR9OaGbqet_RpoYh_79hOezASPRg8Ppe-GePTouPkbu3ls?width=1280&height=1741"
          ],
        },
        {
          title: "UI/UX Design Master Class",
          issuer: "Noviteck Solutions - 30 Days Program",
          date: "2025",
          desc: "Intensive 30-day master class covering Figma, WordPress, and modern UI/UX design principles with practical project work.",
          images: [
            "https://1drv.ms/i/c/b09eaa48933f939d/IQSgppdIjSXRTKu8Gtpfi1QGAbjStQvkDOMKHQZ4LnEMnj8?width=5334&height=3734",
          ],
        },
      ],
    },
    {
      id: "internships",
      label: "Internships",
      icon: "Briefcase",
      items: [
        {
          title: "Backend Developer Intern",
          issuer: "Zidio",
          date: "2025",
          desc: "Developed MERN stack projects with comprehensive admin functionalities and advanced Excel data analysis features.",
          images: [
            "https://1drv.ms/i/c/b09eaa48933f939d/IQSrrPWFnBZMTaXajIVoz0wsAZuJXak0WAiwAg56s2ZTuN0?width=2481&height=3508",
            "https://1drv.ms/i/c/b09eaa48933f939d/IQSPVRkbz02hSaTsGFV643TcAQJkCco2V_l74vYwghi-p-8?width=2481&height=3508",
          ],
        },
        {
          title: "Web Development Intern",
          issuer: "CodeSoft",
          date: "2024",
          desc: "Completed multiple web development projects including interactive calculator, responsive landing pages, and portfolio websites.",
          images: [
            "https://1drv.ms/i/c/b09eaa48933f939d/IQQnEoTPZQKRSpLDlTdc8LV6AYuguGiKNlN1FSgcRYjmTKE?width=800&height=562",
          ],
        },
      ],
    },
    {
      id: "participations",
      label: "Hackathons & Events",
      icon: "Award",
      items: [
        {
          title: "VECT Hackelite 2025 - Selected Round 1",
          issuer: "Velammal Engineering College",
          date: "2025",
          desc: "24-hour intensive hackathon participant with team. Developed Study Spark - an AI-powered learning platform.",
          images: [
            "https://1drv.ms/i/c/b09eaa48933f939d/IQSooI1C9sztT5gT7xDdI1hHAT9sQRNrePV9X72K7SL_Ntg?width=960&height=1280",
          ],
        },
        {
          title: "Smart India Hackathon 2025",
          issuer: "National Level - Team Lead",
          date: "2025",
          desc: "Leading team '404 Found US' for CredsOne project - blockchain-based credential system for secure academic certificate management.",
          images: [],
        },
      ],
    },
  ],
  lastUpdated: new Date().toISOString().slice(0, 19).replace("T", " "),
  updatedBy: "kavshick",
};

/* ================================
   DIFF UTILS
================================== */
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function computeChanges(prev = {}, next = {}) {
  const diff = [];
  if (!same(prev.categories || [], next.categories || [])) diff.push("categories");
  return diff;
}

function prettyValue(v) {
  if (v == null || v === "") return "—";
  if (Array.isArray(v)) return `${v.length} items`;
  if (typeof v === "object") return JSON.stringify(v, null, 0);
  return String(v);
}

/* ================================
   MAIN COMPONENT
================================== */
export default function CertificatesAdminPanel() {
  const [draft, setDraft] = useState(null);
  const [activeTab, setActiveTab] = useState("categories");
  const [status, setStatus] = useState("🔌 Connecting to Firebase...");
  const [statusType, setStatusType] = useState("info");
  const [previewMode, setPreviewMode] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [imageInput, setImageInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Save confirmation modal
  const [changesPopupOpen, setChangesPopupOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState([]);
  const [secretInput, setSecretInput] = useState("");
  const [adminCode, setAdminCode] = useState(null);

  // Image management
  const committedRef = useRef(null);
  const draftChangeTimeoutRef = useRef(null);
  const prevDraftRef = useRef(null);

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Not set";

    try {
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        });
      }

      if (typeof timestamp === "string") {
        const date = new Date(timestamp.replace(" ", "T"));
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        });
      }

      return "Invalid date";
    } catch (err) {
      return String(timestamp);
    }
  };

  // Block Google auto-save
  useEffect(() => {
    const preventAutoSave = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        setStatus("⚠ Use SAVE button instead of Ctrl+S");
        setStatusType("info");
        setTimeout(() => {
          setStatus("✓ Ready to save");
          setStatusType("success");
        }, 2000);
        return false;
      }
    };

    window.addEventListener('keydown', preventAutoSave);

    const disableAutofill = () => {
      const inputs = document.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('autocorrect', 'off');
        input.setAttribute('autocapitalize', 'off');
        input.setAttribute('spellcheck', 'false');
      });
    };

    disableAutofill();
    const interval = setInterval(disableAutofill, 1000);

    return () => {
      window.removeEventListener('keydown', preventAutoSave);
      clearInterval(interval);
    };
  }, []);

  // Load data from Firebase
  const loadFromFirebase = useCallback(async () => {
    try {
      // Fetch admin code
      const adminDocRef = doc(db, FIRESTORE_ADMIN_DOC);
      const adminSnap = await getDoc(adminDocRef);

      if (adminSnap.exists()) {
        const adminData = adminSnap.data();
        setAdminCode(String(adminData.secretCode));
        setStatus("✓ Admin credentials loaded");
        setStatusType("success");
      } else {
        throw new Error("Admin credentials not found");
      }

      // Load certificates data from Firestore
      const certsDocRef = doc(db, FIRESTORE_CERTIFICATES_DOC);
      const certsSnap = await getDoc(certsDocRef);

      let initialDraft = null;

      if (certsSnap.exists()) {
        initialDraft = certsSnap.data();
        setStatus("✓ Certificates loaded from Firestore");
      } else {
        const saved = localStorage.getItem(STORAGE_SAVED_KEY);
        const session = sessionStorage.getItem(STORAGE_DRAFT_KEY);

        if (session) {
          initialDraft = JSON.parse(session);
          setStatus("✓ Draft loaded from session");
        } else if (saved) {
          initialDraft = JSON.parse(saved);
          setStatus("✓ Config loaded from cache");
        } else {
          initialDraft = defaultConfig;
          setStatus("✓ Using default config");
        }
      }

      setDraft(initialDraft);
      committedRef.current = initialDraft;
      prevDraftRef.current = JSON.stringify(initialDraft);
      setStatusType("success");

    } catch (error) {
      console.error("Init error:", error);
      setStatus("⚠ Using offline mode");
      setStatusType("error");
      setDraft(defaultConfig);
      committedRef.current = defaultConfig;
      prevDraftRef.current = JSON.stringify(defaultConfig);
      setAdminCode("69");
    }
  }, []);

  // Initialize from Firebase
  useEffect(() => {
    loadFromFirebase();

    const handleOnline = () => {
      setIsOnline(true);
      if (!draft) {
        loadFromFirebase();
      }
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearTimeout(draftChangeTimeoutRef.current);
    };
  }, [loadFromFirebase]);

  // Debounced draft save
  useEffect(() => {
    if (!draft) return;

    if (draftChangeTimeoutRef.current) {
      clearTimeout(draftChangeTimeoutRef.current);
    }

    const draftString = JSON.stringify(draft);
    if (draftString === prevDraftRef.current) {
      return;
    }

    prevDraftRef.current = draftString;
    setHasChanges(true);

    draftChangeTimeoutRef.current = setTimeout(() => {
      sessionStorage.setItem(STORAGE_DRAFT_KEY, draftString);
    }, SYNC_DEBOUNCE);
  }, [draft]);

  // Firebase save function
  const saveToFirebase = useCallback(async (config) => {
    if (!isOnline) {
      setStatus("✗ No internet connection");
      setStatusType("error");
      return false;
    }

    setIsSyncing(true);
    try {
      const enrichedConfig = {
        ...config,
        lastUpdated: new Date().toISOString(),
        updatedBy: "kavshick",
        updatedAt: Timestamp.now(),
      };

      await setDoc(
        doc(db, FIRESTORE_CERTIFICATES_DOC),
        enrichedConfig,
        { merge: true }
      );

      setStatus("✓ SAVED TO FIREBASE");
      setStatusType("success");
      setHasChanges(false);
      return true;
    } catch (error) {
      console.error("Firebase save error:", error);
      setStatus("✗ Firebase save failed");
      setStatusType("error");
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline]);

  // Refresh data from Firebase
  const refreshFromFirebase = async () => {
    setStatus("🔄 Refreshing from Firebase...");
    setStatusType("info");
    await loadFromFirebase();
  };

  /* ---------------- Helpers ---------------- */
  const update = (path, value) => {
    const parts = path.split(".");
    const copy = JSON.parse(JSON.stringify(draft));
    let cur = copy;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!cur[parts[i]]) cur[parts[i]] = {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = value;
    setDraft(copy);
    setStatus("Draft updated");
    setStatusType("info");
  };

  // Category management
  const addCategory = () => {
    const newCategory = {
      id: `category_${Date.now()}`,
      label: "New Category",
      icon: "BookOpen",
      items: []
    };
    update("categories", [...(draft.categories || []), newCategory]);
  };

  const removeCategory = (index) => {
    const categories = [...(draft.categories || [])];
    categories.splice(index, 1);
    update("categories", categories);
  };

  const updateCategory = (index, field, value) => {
    const categories = [...(draft.categories || [])];
    categories[index][field] = value;
    update("categories", categories);
  };

  const moveCategory = (index, direction) => {
    const categories = [...(draft.categories || [])];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= categories.length) return;
    [categories[index], categories[newIndex]] = [categories[newIndex], categories[index]];
    update("categories", categories);
  };

  // Certificate item management
  const addCertificate = (categoryIndex) => {
    const categories = [...(draft.categories || [])];
    const newCertificate = {
      title: "New Certificate",
      issuer: "Issuer Name",
      date: new Date().getFullYear().toString(),
      desc: "Certificate description",
      images: []
    };
    categories[categoryIndex].items.push(newCertificate);
    update("categories", categories);
  };

  const removeCertificate = (categoryIndex, certIndex) => {
    const categories = [...(draft.categories || [])];
    categories[categoryIndex].items.splice(certIndex, 1);
    update("categories", categories);
  };

  const updateCertificate = (categoryIndex, certIndex, field, value) => {
    const categories = [...(draft.categories || [])];
    categories[categoryIndex].items[certIndex][field] = value;
    update("categories", categories);
  };

  const moveCertificate = (categoryIndex, certIndex, direction) => {
    const categories = [...(draft.categories || [])];
    const items = categories[categoryIndex].items;
    const newIndex = certIndex + direction;
    if (newIndex < 0 || newIndex >= items.length) return;
    [items[certIndex], items[newIndex]] = [items[newIndex], items[certIndex]];
    update("categories", categories);
  };

  // Image management
  const handleImageUpload = async (e, catIndex, certIndex) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setStatus("✗ Please select an image file");
      setStatusType("error");
      return;
    }

    try {
      setStatus("📤 Uploading image to Supabase...");
      setStatusType("info");
      setIsUploading(true);

      // Upload to Supabase
      const imageUrl = await uploadImage(file, 'certifications');

      // Add image to certificate
      addImage(catIndex, certIndex, imageUrl);

      setStatus("✓ Image uploaded successfully");
      setStatusType("success");
    } catch (error) {
      console.error("Image upload error:", error);
      setStatus(`✗ Upload failed: ${error.message}`);
      setStatusType("error");
    } finally {
      setIsUploading(false);
    }
  };

  const addImage = (catIndex, certIndex, url) => {
    if (!url.trim()) return;
    const categories = [...(draft.categories || [])];
    categories[catIndex].items[certIndex].images.push(url.trim());
    update("categories", categories);
    setImageInput("");
  };

  const removeImage = (categoryIndex, certIndex, imageIndex) => {
    const categories = [...(draft.categories || [])];
    categories[categoryIndex].items[certIndex].images.splice(imageIndex, 1);
    update("categories", categories);
  };

  const moveImage = (categoryIndex, certIndex, imageIndex, direction) => {
    const categories = [...(draft.categories || [])];
    const images = categories[categoryIndex].items[certIndex].images;
    const newIndex = imageIndex + direction;
    if (newIndex < 0 || newIndex >= images.length) return;
    [images[imageIndex], images[newIndex]] = [images[newIndex], images[imageIndex]];
    update("categories", categories);
  };

  /* ---------------- Save flows ---------------- */
  const initiateSave = () => {
    const prev = committedRef.current || defaultConfig;
    const diffs = computeChanges(prev, draft);
    if (diffs.length === 0) {
      setStatus("No changes detected");
      setStatusType("info");
      return;
    }
    setPendingChanges(diffs);
    setSecretInput("");
    setChangesPopupOpen(true);
  };

  const confirmSaveWithCode = async () => {
    if (String(secretInput).trim() !== String(adminCode)) {
      setStatus("✗ ACCESS DENIED");
      setStatusType("error");
      setTimeout(() => setSecretInput(""), 2000);
      return;
    }

    try {
      localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(draft));
      sessionStorage.removeItem(STORAGE_DRAFT_KEY);
      committedRef.current = JSON.parse(JSON.stringify(draft));

      const success = await saveToFirebase(draft);

      if (success) {
        setChangesPopupOpen(false);
        setSecretInput("");
      }
    } catch {
      setStatus("Save failed");
      setStatusType("error");
    }
  };

  const quickSave = async () => {
    try {
      localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(draft));
      sessionStorage.removeItem(STORAGE_DRAFT_KEY);
      committedRef.current = JSON.parse(JSON.stringify(draft));

      if (isOnline) {
        await saveToFirebase(draft);
      } else {
        setStatus("✓ Saved locally (offline)");
        setStatusType("info");
      }
    } catch {
      setStatus("Save failed");
      setStatusType("error");
    }
  };

  const resetDefaults = () => {
    if (window.confirm("Reset to default configuration?")) {
      setDraft(defaultConfig);
      setStatus("Reset to default");
      setStatusType("info");
      setHasChanges(false);
    }
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "certificates_config.json";
    a.click();
    URL.revokeObjectURL(url);
    setStatus("Exported configuration");
    setStatusType("success");
  };

  const importJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const imported = JSON.parse(evt.target.result);
        const merged = {
          ...defaultConfig,
          ...imported,
          categories: imported.categories || defaultConfig.categories,
        };
        setDraft(merged);
        setStatus("Imported successfully");
        setStatusType("success");
      } catch {
        setStatus("Import failed: Invalid JSON");
        setStatusType("error");
      }
    };
    reader.readAsText(file);
  };

  if (!draft) {
    return (
      <div className="w-screen h-screen crt-screen crt-glow flex items-center justify-center">
        <CRTStyles />
        <div className="crt-panel p-8 rounded-lg flex flex-col items-center gap-4">
          <Loader className="animate-spin" size={32} />
          <p className="crt-text text-lg">Initializing Certificates Admin...</p>
          <p className="crt-text opacity-60 text-sm">{status}</p>
        </div>
      </div>
    );
  }

  /* ================================
     UI
  ================================== */
  return (
    <div className="w-screen h-screen overflow-hidden crt-screen crt-glow">
      <CRTStyles />
      <div className="w-full h-full flex flex-col p-4 gap-4">
        {/* Top Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="crt-panel rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold crt-text crt-header">
                CERTIFICATES.ADMIN TERMINAL
              </h1>
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <>
                    <Wifi size={16} className="text-green-400" />
                    <span className="text-xs text-green-400">ONLINE</span>
                  </>
                ) : (
                  <>
                    <WifiOff size={16} className="text-red-400" />
                    <span className="text-xs text-red-400">OFFLINE</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`text-sm crt-text status-${statusType} flex items-center gap-2`}>
                {isSyncing ? (
                  <>
                    <Loader size={14} className="animate-spin" />
                    Syncing...
                  </>
                ) : statusType === "success" ? (
                  <>
                    <CheckCircle size={14} />
                    {status}
                  </>
                ) : statusType === "error" ? (
                  <>
                    <AlertCircle size={14} />
                    {status}
                  </>
                ) : (
                  <>
                    <Loader size={14} />
                    {status}
                  </>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPreviewMode(!previewMode)}
                className="crt-button px-4 py-2 rounded flex items-center gap-2 crt-text"
              >
                <Eye size={16} />
                {previewMode ? "EDIT" : "PREVIEW"}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={refreshFromFirebase}
                className="crt-button px-4 py-2 rounded flex items-center gap-2 crt-text"
                title="Refresh from Firebase"
              >
                <RotateCcw size={16} />
                REFRESH
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Left Nav */}
          {!previewMode && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-64 crt-panel rounded-lg p-4 flex flex-col gap-4"
            >
              <div>
                <h3 className="text-sm crt-text mb-3 opacity-60">NAVIGATION</h3>
                <div className="space-y-2">
                  {[
                    { id: "categories", label: "CATEGORIES" },
                    { id: "advanced", label: "ADVANCED" },
                  ].map((t) => (
                    <motion.button
                      key={t.id}
                      whileHover={{ x: 5 }}
                      onClick={() => setActiveTab(t.id)}
                      className={`w-full text-left px-3 py-2 rounded transition-all ${activeTab === t.id
                          ? "crt-button crt-text"
                          : "text-cyan-400/60 hover:text-cyan-400"
                        }`}
                    >
                      {t.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="flex-1" />

              <div>
                <h3 className="text-sm crt-text mb-3 opacity-60">ACTIONS</h3>
                <div className="space-y-2">
                  <button
                    onClick={initiateSave}
                    disabled={!hasChanges}
                    className="w-full crt-button px-3 py-2 rounded crt-text flex items-center gap-2"
                  >
                    <Save size={16} /> SAVE (CONFIRM)
                  </button>
                  <button
                    onClick={quickSave}
                    disabled={!hasChanges}
                    className="w-full crt-button px-3 py-2 rounded crt-text flex items-center gap-2"
                  >
                    <Save size={16} /> QUICK SAVE
                  </button>
                  <button
                    onClick={resetDefaults}
                    className="w-full crt-button px-3 py-2 rounded crt-text flex items-center gap-2"
                  >
                    <RotateCcw size={16} /> RESET
                  </button>
                  <button
                    onClick={exportJson}
                    className="w-full crt-button px-3 py-2 rounded crt-text flex items-center gap-2"
                  >
                    <Download size={16} /> EXPORT
                  </button>
                  <label className="w-full crt-button px-3 py-2 rounded crt-text flex items-center gap-2 cursor-pointer">
                    <Upload size={16} /> IMPORT
                    <input type="file" accept=".json" onChange={importJson} className="hidden" />
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {/* Editor / Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 crt-panel rounded-lg p-6 overflow-hidden"
          >
            {!previewMode ? (
              <div className="h-full overflow-y-auto hide-scrollbar">
                <AnimatePresence mode="wait">
                  {/* CATEGORIES TAB */}
                  {activeTab === "categories" && (
                    <motion.div
                      key="categories"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl crt-text">CERTIFICATE CATEGORIES</h2>
                        <button
                          onClick={addCategory}
                          className="crt-button px-4 py-2 rounded crt-text inline-flex items-center gap-2"
                        >
                          <Plus size={16} /> ADD CATEGORY
                        </button>
                      </div>

                      <div className="space-y-4">
                        {(draft.categories || []).map((category, catIndex) => (
                          <div key={catIndex} className="crt-panel p-4 rounded-lg">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="flex-1 grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-sm crt-text mb-2 opacity-60">
                                    Category Label
                                  </label>
                                  <input
                                    className="w-full crt-input px-3 py-2 rounded"
                                    value={category.label}
                                    onChange={(e) => updateCategory(catIndex, "label", e.target.value)}
                                    placeholder="Category Label"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm crt-text mb-2 opacity-60">
                                    Icon Name
                                  </label>
                                  <input
                                    className="w-full crt-input px-3 py-2 rounded"
                                    value={category.icon}
                                    onChange={(e) => updateCategory(catIndex, "icon", e.target.value)}
                                    placeholder="BookOpen, Briefcase, Award"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => moveCategory(catIndex, -1)}
                                  className="crt-button p-2 rounded"
                                  disabled={catIndex === 0}
                                >
                                  <ArrowUp size={16} />
                                </button>
                                <button
                                  onClick={() => moveCategory(catIndex, 1)}
                                  className="crt-button p-2 rounded"
                                  disabled={catIndex === (draft.categories?.length || 1) - 1}
                                >
                                  <ArrowDown size={16} />
                                </button>
                                <button
                                  onClick={() => removeCategory(catIndex)}
                                  className="crt-button p-2 rounded text-red-400"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            </div>

                            {/* Certificates in this category */}
                            <div className="mt-4">
                              <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg crt-text">Certificates</h3>
                                <button
                                  onClick={() => addCertificate(catIndex)}
                                  className="crt-button px-3 py-1 rounded crt-text inline-flex items-center gap-2 text-sm"
                                >
                                  <Plus size={14} /> ADD CERTIFICATE
                                </button>
                              </div>

                              <div className="space-y-3">
                                {category.items.map((cert, certIndex) => (
                                  <div key={certIndex} className="crt-panel p-3 rounded border border-cyan-400/20">
                                    <div className="flex items-center gap-2 mb-3">
                                      <input
                                        className="flex-1 crt-input px-3 py-2 rounded text-lg"
                                        value={cert.title}
                                        onChange={(e) => updateCertificate(catIndex, certIndex, "title", e.target.value)}
                                        placeholder="Certificate Title"
                                      />
                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={() => moveCertificate(catIndex, certIndex, -1)}
                                          className="crt-button p-1 rounded"
                                          disabled={certIndex === 0}
                                        >
                                          <ArrowUp size={14} />
                                        </button>
                                        <button
                                          onClick={() => moveCertificate(catIndex, certIndex, 1)}
                                          className="crt-button p-1 rounded"
                                          disabled={certIndex === category.items.length - 1}
                                        >
                                          <ArrowDown size={14} />
                                        </button>
                                        <button
                                          onClick={() => removeCertificate(catIndex, certIndex)}
                                          className="crt-button p-1 rounded text-red-400"
                                        >
                                          <X size={14} />
                                        </button>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                      <div>
                                        <label className="block text-xs crt-text mb-1 opacity-60">Issuer</label>
                                        <input
                                          className="w-full crt-input px-2 py-1 rounded text-sm"
                                          value={cert.issuer}
                                          onChange={(e) => updateCertificate(catIndex, certIndex, "issuer", e.target.value)}
                                          placeholder="Issuing Organization"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs crt-text mb-1 opacity-60">Date</label>
                                        <input
                                          className="w-full crt-input px-2 py-1 rounded text-sm"
                                          value={cert.date}
                                          onChange={(e) => updateCertificate(catIndex, certIndex, "date", e.target.value)}
                                          placeholder="2024"
                                        />
                                      </div>
                                    </div>

                                    <div className="mb-3">
                                      <label className="block text-xs crt-text mb-1 opacity-60">Description</label>
                                      <textarea
                                        className="w-full crt-input px-2 py-1 rounded text-sm h-20"
                                        value={cert.desc}
                                        onChange={(e) => updateCertificate(catIndex, certIndex, "desc", e.target.value)}
                                        placeholder="Certificate description..."
                                      />
                                    </div>

                                    {/* Image Management */}
                                    <div>
                                      <label className="block text-xs crt-text mb-2 opacity-60">Certificate Images</label>

                                      {/* Add Image Input */}
                                      <div className="space-y-2 mb-3">
                                        <div className="flex gap-2">
                                          <input
                                            type="text"
                                            value={imageInput}
                                            onChange={(e) => setImageInput(e.target.value)}
                                            placeholder="Paste image URL or upload below"
                                            className="flex-1 crt-input px-2 py-1 rounded text-sm"
                                          />
                                          <button
                                            onClick={() => {
                                              if (imageInput.trim()) {
                                                addImage(catIndex, certIndex, imageInput);
                                                setImageInput("");
                                              }
                                            }}
                                            className="crt-button px-3 py-1 rounded text-sm"
                                            disabled={!imageInput.trim()}
                                          >
                                            Add URL
                                          </button>
                                        </div>
                                        <div className="flex gap-2">
                                          <label className="flex-1 crt-button px-3 py-1 rounded text-sm text-center cursor-pointer">
                                            <Upload size={14} className="inline mr-2" />
                                            {isUploading ? 'Uploading...' : 'Upload Image'}
                                            <input
                                              type="file"
                                              accept="image/*"
                                              onChange={(e) => handleImageUpload(e, catIndex, certIndex)}
                                              className="hidden"
                                              disabled={isUploading}
                                            />
                                          </label>
                                        </div>
                                      </div>

                                      {/* Image Grid */}
                                      {cert.images && cert.images.length > 0 && (
                                        <div className="image-grid">
                                          {cert.images.map((img, imgIndex) => (
                                            <div key={imgIndex} className="image-item">
                                              <img
                                                src={img}
                                                alt={`Certificate ${imgIndex + 1}`}
                                                onError={(e) => {
                                                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='120' viewBox='0 0 150 120'%3E%3Crect width='150' height='120' fill='%23333'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2300e5ff' font-family='monospace' font-size='12'%3EImage%3C/text%3E%3C/svg%3E";
                                                }}
                                              />
                                              <div className="image-actions">
                                                <button
                                                  onClick={() => moveImage(catIndex, certIndex, imgIndex, -1)}
                                                  className="crt-button p-1 rounded text-xs"
                                                  disabled={imgIndex === 0}
                                                >
                                                  <ArrowUp size={10} />
                                                </button>
                                                <button
                                                  onClick={() => moveImage(catIndex, certIndex, imgIndex, 1)}
                                                  className="crt-button p-1 rounded text-xs"
                                                  disabled={imgIndex === cert.images.length - 1}
                                                >
                                                  <ArrowDown size={10} />
                                                </button>
                                                <button
                                                  onClick={() => removeImage(catIndex, certIndex, imgIndex)}
                                                  className="crt-button p-1 rounded text-xs text-red-400"
                                                >
                                                  <X size={10} />
                                                </button>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* ADVANCED TAB */}
                  {activeTab === "advanced" && (
                    <motion.div
                      key="advanced"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h2 className="text-xl crt-text mb-4">ADVANCED (RAW JSON)</h2>
                      <textarea
                        className="w-full crt-input px-4 py-2 rounded font-mono text-xs h-96"
                        value={JSON.stringify(draft, null, 2)}
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            setDraft(parsed);
                            setStatus("JSON updated");
                          } catch {
                            setStatus("Invalid JSON");
                          }
                        }}
                      />

                      {/* Metadata Section */}
                      <div className="mt-6 pt-4 border-t border-cyan-700/40">
                        <h3 className="text-lg crt-text mb-3">Metadata</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <label className="block text-sm crt-text mb-2 opacity-60">Updated By</label>
                            <input
                              value={draft.updatedBy || ""}
                              onChange={(e) => update("updatedBy", e.target.value)}
                              className="crt-input w-full px-3 py-2"
                              placeholder="Updated by"
                            />
                          </div>
                          <div>
                            <label className="block text-sm crt-text mb-2 opacity-60">Last Updated</label>
                            <input
                              value={draft.lastUpdated || ""}
                              onChange={(e) => update("lastUpdated", e.target.value)}
                              className="crt-input w-full px-3 py-2"
                              placeholder="Last updated date"
                            />
                          </div>
                          <div>
                            <label className="block text-sm crt-text mb-2 opacity-60">Updated At (Auto)</label>
                            <div className="crt-input bg-gray-800/50 cursor-not-allowed opacity-70 px-3 py-2">
                              {draft.updatedAt ? formatTimestamp(draft.updatedAt) : "Not set"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              // PREVIEW MODE
              <div className="h-full overflow-auto hide-scrollbar">
                <div className="crt-text">
                  <h2 className="text-2xl mb-6">CERTIFICATES PREVIEW</h2>

                  {draft.categories?.map((category, catIndex) => (
                    <div key={catIndex} className="crt-panel p-5 rounded mb-6">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        {category.icon === "BookOpen" && <BookOpen className="w-5 h-5 text-cyan-400" />}
                        {category.icon === "Briefcase" && <Briefcase className="w-5 h-5 text-purple-400" />}
                        {category.icon === "Award" && <Award className="w-5 h-5 text-amber-400" />}
                        {category.label}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {category.items.map((cert, certIndex) => (
                          <div key={certIndex} className="crt-panel p-4 rounded border border-white/20">
                            <h4 className="text-lg font-semibold mb-2">{cert.title}</h4>
                            <div className="flex items-center gap-2 mb-1 text-gray-300 text-sm">
                              <Building2 className="w-4 h-4" />
                              {cert.issuer}
                            </div>
                            <div className="flex items-center gap-2 mb-3 text-gray-400 text-xs">
                              <CalendarDays className="w-4 h-4" />
                              {cert.date}
                            </div>
                            <p className="text-gray-300 text-sm mb-3">{cert.desc}</p>

                            {cert.images && cert.images.length > 0 && (
                              <div className="mt-3">
                                <div className="text-xs crt-text opacity-60 mb-2">
                                  Images: {cert.images.length}
                                </div>
                                <div className="image-grid">
                                  {cert.images.slice(0, 2).map((img, imgIndex) => (
                                    <div key={imgIndex} className="image-item">
                                      <img
                                        src={img}
                                        alt={`Preview ${imgIndex + 1}`}
                                        className="w-full h-20 object-cover"
                                      />
                                    </div>
                                  ))}
                                  {cert.images.length > 2 && (
                                    <div className="image-item flex items-center justify-center bg-gray-800">
                                      <span className="text-xs">+{cert.images.length - 2} more</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Metadata Preview */}
                  <div className="crt-panel p-4 rounded mt-4">
                    <div className="text-lg mb-2">Metadata</div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-cyan-400">Updated By:</span>
                        <p>{draft.updatedBy || "Not set"}</p>
                      </div>
                      <div>
                        <span className="text-cyan-400">Last Updated:</span>
                        <p>{draft.lastUpdated || "Not set"}</p>
                      </div>
                      <div>
                        <span className="text-cyan-400">Updated At:</span>
                        <p>{draft.updatedAt ? formatTimestamp(draft.updatedAt) : "Not set"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* SAVE CONFIRM MODAL */}
      <AnimatePresence>
        {changesPopupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="crt-panel rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl crt-text crt-header mb-2">CONFIRM SAVE</h3>
                  <p className="text-sm crt-text opacity-60">
                    {isOnline
                      ? "Enter admin code to save to Firestore & local storage."
                      : "🔌 Offline: Will save locally only. Firestore sync when online."}
                  </p>
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto mb-4 space-y-3 hide-scrollbar">
                {pendingChanges.length === 0 ? (
                  <div className="text-sm crt-text opacity-60 text-center py-4">
                    No changes detected
                  </div>
                ) : (
                  pendingChanges.map((path) => {
                    const oldVal = prettyValue(committedRef.current?.[path]);
                    const newVal = prettyValue(draft?.[path]);
                    return (
                      <div key={path} className="crt-panel p-3 rounded">
                        <div className="text-xs crt-text opacity-60 mb-1">{path}</div>
                        <div className="text-sm crt-text">
                          <span className="opacity-60">Old:</span>{" "}
                          <span className="opacity-80">{oldVal}</span>
                        </div>
                        <div className="text-sm crt-text mt-1">
                          <span className="opacity-60">New:</span>{" "}
                          <span className="text-cyan-300">{newVal}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="flex items-center gap-3 mb-4">
                <input
                  type="password"
                  value={secretInput}
                  onChange={(e) => setSecretInput(e.target.value)}
                  placeholder="Enter admin code..."
                  className="w-full crt-input px-4 py-2 rounded"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") confirmSaveWithCode();
                  }}
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setChangesPopupOpen(false);
                    setPendingChanges([]);
                    setSecretInput("");
                  }}
                  className="crt-button px-4 py-2 rounded crt-text"
                >
                  CANCEL
                </button>
                <button
                  onClick={confirmSaveWithCode}
                  disabled={isSyncing}
                  className="crt-button px-4 py-2 rounded crt-text bg-cyan-500/20 border-cyan-400"
                >
                  {isSyncing ? "SAVING..." : "CONFIRM & SAVE"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}   