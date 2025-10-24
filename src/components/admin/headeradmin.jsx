"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, Save, RotateCcw, Download, Upload,
  Plus, X, ArrowUp, ArrowDown, Link as LinkIcon, FileText, Type, KeyRound,
  Loader, AlertCircle, CheckCircle, Wifi, WifiOff
} from "lucide-react";
import { Typewriter } from "react-simple-typewriter";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";

/* ================================
   STORAGE & ADMIN SETTINGS
================================== */
const STORAGE_DRAFT_KEY = "header_config_draft";
const STORAGE_SAVED_KEY = "header_config_saved";
const FIRESTORE_HEADER_DOC = "portfolio/profile";
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
  `}</style>
);

/* ================================
   DEFAULT CONFIG (Header)
================================== */
const defaultConfig = {
  name: "Deepak",
  roles: "Full-Stack Developer • Cloud Engineer • AI Enthusiast",
  typewriterLines: [
    "Deploying apps on AWS EC2 & S3 ☁️",
    "Automating tasks with Linux scripts 🐧",
    "Building scalable full-stack apps with React & Node ⚙️",
  ],
  resumeDriveLink: "https://drive.google.com/file/d/1BazHbJLKXz0xJFrsd9ZgJkAB0aR9d8nW_/view?usp=sharing",
  socials: {
    github: "https://github.com/dpak-07",
    linkedin: "https://www.linkedin.com/in/deepak-saminathan/",
    email: "mailto:deepakofficial0103@gmail.com",
    instagram: "https://www.instagram.com/deepak.codes/",
    twitter: "",
    website: "https://deepak-portfolio.vercel.app",
  },
  lastUpdated: new Date().toISOString().slice(0, 19).replace("T", " "),
  updatedBy: "kavshick",
};

/* ================================
   DIFF UTILS
================================== */
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function computeChanges(prev = {}, next = {}) {
  const diff = [];
  if ((prev.name || "") !== (next.name || "")) diff.push("name");
  if ((prev.roles || "") !== (next.roles || "")) diff.push("roles");
  if (!same(prev.typewriterLines || [], next.typewriterLines || [])) diff.push("typewriterLines");
  if ((prev.resumeDriveLink || "") !== (next.resumeDriveLink || "")) diff.push("resumeDriveLink");
  if (!same(prev.socials || {}, next.socials || {})) diff.push("socials");
  return diff;
}

function prettyValue(v) {
  if (v == null || v === "") return "—";
  if (Array.isArray(v)) return v.join(" • ");
  if (typeof v === "object") return JSON.stringify(v, null, 0);
  return String(v);
}

/* ================================
   MAIN COMPONENT
================================== */
export default function HeaderAdminCRT() {
  const [draft, setDraft] = useState(null);
  const [status, setStatus] = useState("🔌 Connecting to Firebase...");
  const [statusType, setStatusType] = useState("info");
  const [activeTab, setActiveTab] = useState("basic");
  const [previewMode, setPreviewMode] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Save confirmation modal
  const [changesPopupOpen, setChangesPopupOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState([]);
  const [secretInput, setSecretInput] = useState("");
  const [adminCode, setAdminCode] = useState(null);

  const committedRef = useRef(null);
  const draftChangeTimeoutRef = useRef(null);
  const prevDraftRef = useRef(null);

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Not set";
    
    try {
      // Handle Firestore Timestamp
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
      
      // Handle ISO string
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

  // Load data from Firebase using getDoc (one-time fetch)
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

      // Load header data from Firestore
      const headerDocRef = doc(db, FIRESTORE_HEADER_DOC);
      const headerSnap = await getDoc(headerDocRef);
      
      let initialDraft = null;
      
      if (headerSnap.exists()) {
        // Use data from Firestore
        initialDraft = headerSnap.data();
        setStatus("✓ Config loaded from Firestore");
      } else {
        // Fallback to localStorage or default
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

  // Initialize from Firebase (one-time load)
  useEffect(() => {
    loadFromFirebase();

    const handleOnline = () => {
      setIsOnline(true);
      // Optionally reload data when coming back online
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

    // Debounce session storage write
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
        doc(db, FIRESTORE_HEADER_DOC),
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

  // typewriter helpers
  const addLine = () => {
    update("typewriterLines", [...(draft.typewriterLines || []), "New line ✨"]);
  };
  const removeLine = (idx) => {
    const lines = [...(draft.typewriterLines || [])];
    lines.splice(idx, 1);
    update("typewriterLines", lines);
  };
  const moveLine = (idx, dir) => {
    const lines = [...(draft.typewriterLines || [])];
    const ni = idx + dir;
    if (ni < 0 || ni >= lines.length) return;
    [lines[idx], lines[ni]] = [lines[ni], lines[idx]];
    update("typewriterLines", lines);
  };

  // socials helpers (object shape: { platform: url })
  const addSocial = () => {
    const key = `new_${Object.keys(draft.socials || {}).length + 1}`;
    const obj = { ...(draft.socials || {}) };
    obj[key] = "";
    update("socials", obj);
  };
  const removeSocial = (platform) => {
    const obj = { ...(draft.socials || {}) };
    delete obj[platform];
    update("socials", obj);
  };
  const renameSocialKey = (oldKey, newKey) => {
    if (!newKey || oldKey === newKey) return;
    const obj = { ...(draft.socials || {}) };
    if (obj[newKey] !== undefined) {
      setStatus("Key already exists");
      return;
    }
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
    update("socials", obj);
  };
  const updateSocialUrl = (key, url) => {
    const obj = { ...(draft.socials || {}) };
    obj[key] = url;
    update("socials", obj);
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
    a.download = "header_config.json";
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
        // Basic schema safety
        const merged = {
          ...defaultConfig,
          ...imported,
          socials: { ...(defaultConfig.socials || {}), ...(imported.socials || {}) },
          typewriterLines: imported.typewriterLines || defaultConfig.typewriterLines,
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
          <p className="crt-text text-lg">Initializing Header Admin...</p>
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
                HEADER.ADMIN TERMINAL
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
                    { id: "basic", label: "BASIC" },
                    { id: "typewriter", label: "TYPEWRITER" },
                    { id: "links", label: "LINKS" },
                    { id: "advanced", label: "ADVANCED" },
                  ].map((t) => (
                    <motion.button
                      key={t.id}
                      whileHover={{ x: 5 }}
                      onClick={() => setActiveTab(t.id)}
                      className={`w-full text-left px-3 py-2 rounded transition-all ${
                        activeTab === t.id
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
                  {/* BASIC TAB */}
                  {activeTab === "basic" && (
                    <motion.div
                      key="basic"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h2 className="text-xl crt-text mb-4">BASIC CONFIGURATION</h2>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm crt-text mb-2 opacity-60">
                            <span className="inline-flex items-center gap-2"><FileText size={14}/> NAME</span>
                          </label>
                          <input
                            className="w-full crt-input px-4 py-2 rounded"
                            value={draft.name || ""}
                            onChange={(e) => update("name", e.target.value)}
                            placeholder="Deepak"
                          />
                        </div>

                        <div>
                          <label className="block text-sm crt-text mb-2 opacity-60">
                            <span className="inline-flex items-center gap-2"><Type size={14}/> ROLES</span>
                          </label>
                          <input
                            className="w-full crt-input px-4 py-2 rounded"
                            value={draft.roles || ""}
                            onChange={(e) => update("roles", e.target.value)}
                            placeholder="Full-Stack • Cloud • AI"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm crt-text mb-2 opacity-60">
                          <span className="inline-flex items-center gap-2"><LinkIcon size={14}/> RESUME DRIVE LINK</span>
                        </label>
                        <input
                          className="w-full crt-input px-4 py-2 rounded"
                          value={draft.resumeDriveLink || ""}
                          onChange={(e) => update("resumeDriveLink", e.target.value)}
                          placeholder="https://drive.google.com/file/d/..."
                        />
                      </div>

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

                  {/* TYPEWRITER TAB */}
                  {activeTab === "typewriter" && (
                    <motion.div
                      key="typewriter"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h2 className="text-xl crt-text mb-4">TYPEWRITER LINES</h2>

                      <div className="space-y-3">
                        {(draft.typewriterLines || []).map((line, idx) => (
                          <div key={idx} className="crt-panel p-3 rounded flex items-center gap-2">
                            <input
                              className="flex-1 crt-input px-3 py-2 rounded"
                              value={line}
                              onChange={(e) => {
                                const lines = [...draft.typewriterLines];
                                lines[idx] = e.target.value;
                                update("typewriterLines", lines);
                              }}
                            />
                            <button
                              onClick={() => moveLine(idx, -1)}
                              className="crt-button p-2 rounded"
                              disabled={idx === 0}
                              title="Move up"
                            >
                              <ArrowUp size={16} />
                            </button>
                            <button
                              onClick={() => moveLine(idx, +1)}
                              className="crt-button p-2 rounded"
                              disabled={idx === (draft.typewriterLines?.length || 1) - 1}
                              title="Move down"
                            >
                              <ArrowDown size={16} />
                            </button>
                            <button
                              onClick={() => removeLine(idx)}
                              className="crt-button p-2 rounded text-red-400"
                              title="Remove"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button onClick={addLine} className="crt-button px-4 py-2 rounded crt-text inline-flex items-center gap-2">
                        <Plus size={16}/> ADD LINE
                      </button>

                      <div className="mt-6 crt-panel p-4 rounded">
                        <div className="text-sm crt-text opacity-80 mb-2">Preview</div>
                        <div className="crt-text text-lg">
                          <Typewriter
                            words={draft.typewriterLines || []}
                            loop={0}
                            cursor
                            cursorStyle="|"
                            typeSpeed={50}
                            deleteSpeed={30}
                            delaySpeed={1600}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* LINKS TAB */}
                  {activeTab === "links" && (
                    <motion.div
                      key="links"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h2 className="text-xl crt-text mb-4">SOCIAL / CONTACT LINKS</h2>

                      <div className="space-y-3">
                        {Object.entries(draft.socials || {}).map(([platform, url]) => (
                          <div key={platform} className="crt-panel p-3 rounded">
                            <div className="grid grid-cols-3 gap-3 items-center">
                              {/* Platform key (editable) */}
                              <div className="col-span-1">
                                <label className="block text-xs crt-text mb-1 opacity-60">PLATFORM KEY</label>
                                <div className="flex items-center gap-2">
                                  <KeyRound size={14} className="text-cyan-300" />
                                  <input
                                    className="w-full crt-input px-3 py-2 rounded"
                                    defaultValue={platform}
                                    onBlur={(e) => {
                                      const newKey = e.target.value.trim();
                                      if (!newKey || newKey === platform) return;
                                      renameSocialKey(platform, newKey);
                                    }}
                                  />
                                </div>
                              </div>
                              {/* URL */}
                              <div className="col-span-2">
                                <label className="block text-xs crt-text mb-1 opacity-60">URL</label>
                                <input
                                  className="w-full crt-input px-3 py-2 rounded"
                                  value={url || ""}
                                  onChange={(e) => updateSocialUrl(platform, e.target.value)}
                                  placeholder="https://..."
                                />
                              </div>
                            </div>

                            <div className="mt-3 flex justify-end">
                              <button
                                onClick={() => removeSocial(platform)}
                                className="crt-button px-3 py-2 rounded text-red-400"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button onClick={addSocial} className="crt-button px-4 py-2 rounded crt-text inline-flex items-center gap-2">
                        <Plus size={16}/> ADD LINK
                      </button>

                      <div className="crt-text text-xs opacity-70 mt-3">
                        Tip: Common keys — <code>github</code>, <code>linkedin</code>, <code>email</code>, <code>instagram</code>, <code>twitter</code>, <code>website</code>
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              // PREVIEW
              <div className="h-full overflow-auto hide-scrollbar">
                <div className="crt-text">
                  <h2 className="text-2xl mb-6">PREVIEW MODE</h2>

                  <div className="crt-panel p-5 rounded space-y-2 mb-6">
                    <div className="text-xl">Hi, I'm {draft.name || "—"}</div>
                    <div className="text-base opacity-80">{draft.roles || "—"}</div>
                    <div className="mt-2 text-lg">
                      <Typewriter
                        words={draft.typewriterLines || []}
                        loop={0}
                        cursor
                        cursorStyle="|"
                        typeSpeed={50}
                        deleteSpeed={30}
                        delaySpeed={1600}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="crt-panel p-4 rounded">
                      <div className="text-lg mb-2">Resume</div>
                      <div className="text-sm opacity-80 break-all">
                        {draft.resumeDriveLink || "—"}
                      </div>
                    </div>

                    <div className="crt-panel p-4 rounded">
                      <div className="text-lg mb-2">Links</div>
                      <div className="space-y-1 text-sm opacity-80 break-all">
                        {Object.entries(draft.socials || {}).map(([k, v]) => (
                          <div key={k}>
                            <span className="text-cyan-300">{k}:</span> {v || "—"}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

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