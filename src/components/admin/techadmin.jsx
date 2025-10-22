"use client"
import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, Save, RotateCcw, Download, Upload, Plus, X,
  ArrowUp, ArrowDown, Palette, AlertCircle, CheckCircle, Loader, Wifi, WifiOff
} from "lucide-react";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";

const STORAGE_DRAFT_KEY = "techstack_config_draft";
const FIRESTORE_ADMIN_DOC = "admin/credentials";
const FIRESTORE_TECHSTACK_DOC = "techStack/categories";

const CRTStyles = () => (
  <style>{`
    @keyframes flicker {0%,100%{opacity:.95;}50%{opacity:1;}}
    @keyframes scanline {0%{transform:translateY(-100%);}100%{transform:translateY(100%);}}
    .crt-screen{position:relative;background:radial-gradient(ellipse at center,#0d1f2d 0%,#050a0f 100%);animation:flicker .15s infinite;overflow:hidden;}
    .crt-screen::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,255,255,.03)0px,transparent 1px,transparent 2px,rgba(0,255,255,.03)3px);pointer-events:none;z-index:50;}
    .crt-screen::after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,transparent 50%,rgba(0,255,255,.02)50%);background-size:100% 4px;pointer-events:none;z-index:51;animation:scanline 8s linear infinite;}
    .crt-glow{box-shadow:inset 0 0 100px rgba(0,229,255,.1),inset 0 0 50px rgba(0,229,255,.05),0 0 50px rgba(0,229,255,.2);}
    .crt-text{color:#00e5ff;text-shadow:0 0 10px rgba(0,229,255,.8),0 0 20px rgba(0,229,255,.4);font-family:'Courier New',monospace;}
    .crt-button{background:linear-gradient(135deg,rgba(0,229,255,.2),rgba(0,229,255,.1));border:2px solid rgba(0,229,255,.4);box-shadow:0 0 20px rgba(0,229,255,.3),inset 0 0 10px rgba(0,229,255,.1);transition:all .3s ease;cursor:pointer;user-select:none;}
    .crt-button:hover:not(:disabled){background:linear-gradient(135deg,rgba(0,229,255,.3),rgba(0,229,255,.2));border-color:rgba(0,229,255,.6);box-shadow:0 0 30px rgba(0,229,255,.5),inset 0 0 15px rgba(0,229,255,.2);transform:translateY(-2px);}
    .crt-button:active:not(:disabled){transform:translateY(0);}
    .crt-button:disabled{opacity:.35;cursor:not-allowed;}
    .crt-input{background:rgba(0,0,0,.6);border:2px solid rgba(0,229,255,.3);color:#00e5ff;box-shadow:inset 0 0 20px rgba(0,229,255,.1);transition:all .2s ease;}
    .crt-input:focus{outline:none;border-color:rgba(0,229,255,.6);box-shadow:0 0 20px rgba(0,229,255,.3),inset 0 0 20px rgba(0,229,255,.2);}
    .crt-input:-webkit-autofill{-webkit-box-shadow: inset 0 0 20px rgba(0,229,255,.1);-webkit-text-fill-color:#00e5ff;}
    .crt-input:-webkit-autofill:focus{-webkit-box-shadow: 0 0 20px rgba(0,229,255,.3), inset 0 0 20px rgba(0,229,255,.2);-webkit-text-fill-color:#00e5ff;}
    .crt-panel{background:linear-gradient(135deg,rgba(0,20,30,.95),rgba(0,10,20,.98));border:2px solid rgba(0,229,255,.3);box-shadow:0 0 30px rgba(0,229,255,.2),inset 0 0 30px rgba(0,0,0,.5);will-change:auto;}
    .hide-scrollbar{scrollbar-width:thin;scrollbar-color:rgba(0,229,255,.3) transparent;}
    .hide-scrollbar::-webkit-scrollbar{width:8px;height:8px;}
    .hide-scrollbar::-webkit-scrollbar-track{background:transparent;}
    .hide-scrollbar::-webkit-scrollbar-thumb{background:rgba(0,229,255,.3);border-radius:4px;border:2px solid transparent;background-clip:content-box;}
    .hide-scrollbar::-webkit-scrollbar-thumb:hover{background:rgba(0,229,255,.5);background-clip:content-box;}
    .status-success{color:#4ade80;text-shadow:0 0 10px rgba(74,222,128,.6);}
    .status-error{color:#f87171;text-shadow:0 0 10px rgba(248,113,113,.6);}
    .status-info{color:#60a5fa;text-shadow:0 0 10px rgba(96,165,250,.6);}
    * { -webkit-user-select: none; -moz-user-select: none; user-select: none; }
    input, textarea { -webkit-user-select: text; -moz-user-select: text; user-select: text; }
  `}</style>
);

// Default configuration matching your seed.js structure
const defaultConfig = {
  techStackData: [
    { title: "Languages", color: "from-purple-400 to-pink-500", tech: ["C", "Python", "Java", "JavaScript", "Dart", "HTML", "CSS", "TypeScript"] },
    { title: "Frontend", color: "from-blue-500 to-cyan-400", tech: ["React", "Next.js", "Tailwind CSS", "Flutter", "Bootstrap", "Vite"] },
    { title: "Backend", color: "from-green-500 to-emerald-400", tech: ["Node.js", "Express", "Flask", "FastAPI", "Spring Boot"] },
    { title: "Databases", color: "from-orange-400 to-amber-500", tech: ["MongoDB", "MySQL", "SQLite", "PostgreSQL", "Firebase"] },
    { title: "Cloud & DevOps", color: "from-yellow-400 to-lime-400", tech: ["AWS", "Google Cloud", "Docker", "Kubernetes", "Vercel"] },
    { title: "AI & ML", color: "from-red-400 to-pink-400", tech: ["TensorFlow", "PyTorch", "OpenCV", "Keras", "NumPy", "Pandas"] },
    { title: "Mobile", color: "from-teal-400 to-green-400", tech: ["React Native", "Flutter", "Android", "iOS", "Expo"] },
    { title: "Tools", color: "from-indigo-400 to-blue-400", tech: ["Git", "GitHub", "VS Code", "Postman", "Linux", "Figma"] },
  ],
  lastUpdated: new Date().toISOString(),
  updatedBy: "deepak",
};

// Updated normalization function to work with techStackData
function normalizeTechStackData(data) {
  if (!data) return defaultConfig;
  
  console.log("Normalizing data:", data);
  
  // Handle the actual structure from your seed.js
  if (data.techStackData && Array.isArray(data.techStackData)) {
    // This is your actual structure - techStackData array
    return {
      ...data,
      techStackData: data.techStackData.map(cat => ({
        title: cat.title || "Untitled Category",
        color: cat.color || "from-cyan-400 to-blue-400",
        tech: Array.isArray(cat.tech) ? cat.tech : []
      }))
    };
  } else if (Array.isArray(data)) {
    // If data is directly an array (fallback)
    return { techStackData: data };
  } else if (data.categories && Array.isArray(data.categories)) {
    // If someone accidentally uses categories instead of techStackData
    return { techStackData: data.categories };
  } else {
    // Fallback to default config
    return defaultConfig;
  }
}

export default function TechStackAdmin() {
  const [draft, setDraft] = useState(null);
  const [status, setStatus] = useState("🔌 Connecting to Firebase...");
  const [statusType, setStatusType] = useState("info");
  const [activeTab, setActiveTab] = useState("CATEGORIES");
  const [previewMode, setPreviewMode] = useState(false);
  const [changesPopupOpen, setChangesPopupOpen] = useState(false);
  const [secretInput, setSecretInput] = useState("");
  const [adminCode, setAdminCode] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Refs for debouncing and cleanup
  const committedRef = useRef(null);
  const draftChangeTimeoutRef = useRef(null);
  const prevDraftRef = useRef(null);

  // Load data from Firebase
  const loadFromFirebase = useCallback(async () => {
    try {
      setStatus("🔄 Loading admin credentials...");
      setStatusType("info");

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

      // Load tech stack data from Firestore
      setStatus("🔄 Loading tech stack data...");
      const techStackDocRef = doc(db, FIRESTORE_TECHSTACK_DOC);
      const techStackSnap = await getDoc(techStackDocRef);
      
      let initialDraft = null;
      
      if (techStackSnap.exists()) {
        // Use data from Firestore with normalization
        const firestoreData = techStackSnap.data();
        console.log("Raw Firestore data:", firestoreData);
        initialDraft = normalizeTechStackData(firestoreData);
        setStatus("✓ Config loaded from Firestore");
      } else {
        // Fallback to session storage or default
        const session = sessionStorage.getItem(STORAGE_DRAFT_KEY);
        
        if (session) {
          try {
            const sessionData = JSON.parse(session);
            initialDraft = normalizeTechStackData(sessionData);
            setStatus("✓ Draft loaded from session");
          } catch (e) {
            console.error("Error parsing session data:", e);
            initialDraft = defaultConfig;
            setStatus("✓ Using default config (session parse error)");
          }
        } else {
          initialDraft = defaultConfig;
          setStatus("✓ Using default config");
        }
      }
      
      console.log("Normalized draft:", initialDraft);
      setDraft(initialDraft);
      committedRef.current = JSON.parse(JSON.stringify(initialDraft));
      prevDraftRef.current = JSON.stringify(initialDraft);
      setStatusType("success");

    } catch (error) {
      console.error("Init error:", error);
      setStatus("⚠ Using offline mode");
      setStatusType("error");
      
      // Fallback to session storage or default
      const session = sessionStorage.getItem(STORAGE_DRAFT_KEY);
      let fallbackDraft = defaultConfig;
      
      if (session) {
        try {
          const sessionData = JSON.parse(session);
          fallbackDraft = normalizeTechStackData(sessionData);
        } catch (e) {
          console.error("Error parsing session fallback:", e);
        }
      }
      
      setDraft(fallbackDraft);
      committedRef.current = JSON.parse(JSON.stringify(fallbackDraft));
      prevDraftRef.current = JSON.stringify(fallbackDraft);
      setAdminCode("69");
    }
  }, []);

  // Save to Firebase - UPDATED to use techStackData structure
  const saveToFirebase = useCallback(async (config) => {
    if (!isOnline) {
      setStatus("✗ No internet connection");
      setStatusType("error");
      return false;
    }

    setIsSyncing(true);
    try {
      // Ensure we save in the correct structure with techStackData
      const enrichedConfig = {
        techStackData: config.techStackData || [],
        lastUpdated: new Date().toISOString(),
        updatedBy: "deepak",
        updatedAt: Timestamp.now(),
      };

      await setDoc(
        doc(db, FIRESTORE_TECHSTACK_DOC),
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

  // Initialize from Firebase
  useEffect(() => {
    loadFromFirebase();

    const handleOnline = () => {
      setIsOnline(true);
      setStatus("✓ Back online");
      setStatusType("success");
    };
    const handleOffline = () => {
      setIsOnline(false);
      setStatus("⚠ Offline mode");
      setStatusType("error");
    };
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearTimeout(draftChangeTimeoutRef.current);
    };
  }, [loadFromFirebase]);

  // Debounced draft tracking
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
    sessionStorage.setItem(STORAGE_DRAFT_KEY, draftString);
  }, [draft]);

  // Block Google auto-save
  useEffect(() => {
    const preventAutoSave = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setStatus("⚠ Use SAVE button instead of Ctrl+S");
        setStatusType("info");
        setTimeout(() => {
          setStatus("✓ Ready to save");
          setStatusType("success");
        }, 2000);
        initiateSaveConfirmation();
        return false;
      }
    }

    window.addEventListener('keydown', preventAutoSave);
    
    const disableAutofill = () => {
      const inputs = document.querySelectorAll('input');
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
  }, [draft]);

  // Save confirmation flow
  const initiateSaveConfirmation = () => {
    if (!draft || !draft.techStackData) {
      setStatus("No valid data to save");
      setStatusType("error");
      return;
    }

    const prev = committedRef.current || defaultConfig;
    const changed = computeChanges(prev, draft);
    if (changed.length === 0) {
      setStatus("No changes detected");
      setStatusType("info");
      return;
    }
    setChangesPopupOpen(true);
    setSecretInput("");
  };

  const confirmSaveWithCode = async () => {
    if (!draft) return;
    
    if (secretInput.trim() !== String(adminCode)) {
      setStatus("✗ ACCESS DENIED");
      setStatusType("error");
      return;
    }
    
    try {
      // Save to Firebase
      const success = await saveToFirebase(draft);
      
      if (success) {
        sessionStorage.removeItem(STORAGE_DRAFT_KEY);
        committedRef.current = JSON.parse(JSON.stringify(draft));
        setChangesPopupOpen(false);
        setStatus("✓ SAVED SUCCESSFULLY");
        setStatusType("success");
      }
    } catch {
      setStatus("Save failed");
      setStatusType("error");
    }
  };

  // Diff helper function - UPDATED for techStackData
  function computeChanges(oldConfig = {}, newConfig = {}) {
    const changes = [];
    function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
    
    if (!same(oldConfig.techStackData || [], newConfig.techStackData || [])) changes.push("techStackData");
    
    return [...new Set(changes)];
  }

  const refreshFromFirebase = async () => {
    setStatus("🔄 Refreshing from Firebase...");
    setStatusType("info");
    await loadFromFirebase();
  };

  const resetToDefault = () => {
    if (window.confirm("Reset all changes to default?")) {
      setDraft(defaultConfig);
      setStatus("Reset to default");
      setStatusType("info");
      setHasChanges(false);
    }
  };

  const exportJson = () => {
    if (!draft) return;
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "techstack_config.json";
    a.click();
    URL.revokeObjectURL(url);
    setStatus("Exported configuration");
    setStatusType("success");
  };

  const importJson = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const imported = JSON.parse(evt.target.result);
        const normalized = normalizeTechStackData(imported);
        setDraft(normalized);
        setStatus("Imported successfully");
        setStatusType("success");
        setHasChanges(true);
      } catch (err) {
        setStatus("Import failed: Invalid JSON");
        setStatusType("error");
      }
    };
    reader.readAsText(file);
  };

  // Safe sidebar tabs generation - UPDATED for techStackData
  const sidebarTabs = React.useMemo(() => {
    if (!draft || !draft.techStackData || !Array.isArray(draft.techStackData)) {
      return ["CATEGORIES"];
    }
    return ["CATEGORIES", ...draft.techStackData.map((c, i) => `CAT:${i}`)];
  }, [draft?.techStackData]);

  // All category operations - UPDATED for techStackData
  const moveCategory = useCallback((idx, dir) => {
    setDraft(prevDraft => {
      if (!prevDraft || !prevDraft.techStackData) return prevDraft;
      const copy = JSON.parse(JSON.stringify(prevDraft));
      const arr = copy.techStackData;
      const newIndex = idx + dir;
      if (newIndex < 0 || newIndex >= arr.length) return prevDraft;
      [arr[idx], arr[newIndex]] = [arr[newIndex], arr[idx]];
      return copy;
    });
  }, []);

  const moveTech = useCallback((catIdx, tIdx, dir) => {
    setDraft(prevDraft => {
      if (!prevDraft || !prevDraft.techStackData || !prevDraft.techStackData[catIdx]) return prevDraft;
      const copy = JSON.parse(JSON.stringify(prevDraft));
      const arr = copy.techStackData[catIdx].tech;
      if (!Array.isArray(arr)) return prevDraft;
      const newIndex = tIdx + dir;
      if (newIndex < 0 || newIndex >= arr.length) return prevDraft;
      [arr[tIdx], arr[newIndex]] = [arr[newIndex], arr[tIdx]];
      return copy;
    });
  }, []);

  const addCategory = useCallback(() => {
    setDraft(prevDraft => {
      if (!prevDraft) return prevDraft;
      const copy = JSON.parse(JSON.stringify(prevDraft));
      if (!copy.techStackData) {
        copy.techStackData = [];
      }
      copy.techStackData.push({ title: "New Category", color: "from-cyan-400 to-blue-400", tech: [] });
      return copy;
    });
  }, []);

  const removeCategory = useCallback((idx) => {
    setDraft(prevDraft => {
      if (!prevDraft || !prevDraft.techStackData) return prevDraft;
      const copy = JSON.parse(JSON.stringify(prevDraft));
      copy.techStackData.splice(idx, 1);
      return copy;
    });
  }, []);

  const updateCategoryTitle = useCallback((idx, title) => {
    setDraft(prevDraft => {
      if (!prevDraft || !prevDraft.techStackData || !prevDraft.techStackData[idx]) return prevDraft;
      const copy = JSON.parse(JSON.stringify(prevDraft));
      copy.techStackData[idx].title = title;
      return copy;
    });
  }, []);

  const updateCategoryColor = useCallback((idx, color) => {
    setDraft(prevDraft => {
      if (!prevDraft || !prevDraft.techStackData || !prevDraft.techStackData[idx]) return prevDraft;
      const copy = JSON.parse(JSON.stringify(prevDraft));
      copy.techStackData[idx].color = color;
      return copy;
    });
  }, []);

  const updateTech = useCallback((catIdx, tIdx, value) => {
    setDraft(prevDraft => {
      if (!prevDraft || !prevDraft.techStackData || !prevDraft.techStackData[catIdx]) return prevDraft;
      const copy = JSON.parse(JSON.stringify(prevDraft));
      if (!copy.techStackData[catIdx].tech) {
        copy.techStackData[catIdx].tech = [];
      }
      copy.techStackData[catIdx].tech[tIdx] = value;
      return copy;
    });
  }, []);

  const removeTech = useCallback((catIdx, tIdx) => {
    setDraft(prevDraft => {
      if (!prevDraft || !prevDraft.techStackData || !prevDraft.techStackData[catIdx]) return prevDraft;
      const copy = JSON.parse(JSON.stringify(prevDraft));
      if (Array.isArray(copy.techStackData[catIdx].tech)) {
        copy.techStackData[catIdx].tech.splice(tIdx, 1);
      }
      return copy;
    });
  }, []);

  const addTech = useCallback((catIdx, tech) => {
    setDraft(prevDraft => {
      if (!prevDraft || !prevDraft.techStackData || !prevDraft.techStackData[catIdx]) return prevDraft;
      const copy = JSON.parse(JSON.stringify(prevDraft));
      if (!copy.techStackData[catIdx].tech) {
        copy.techStackData[catIdx].tech = [];
      }
      copy.techStackData[catIdx].tech.push(tech.trim());
      return copy;
    });
  }, []);

  if (!draft) {
    return (
      <div className="w-screen h-screen crt-screen crt-glow flex items-center justify-center">
        <CRTStyles />
        <div className="crt-panel p-8 rounded-lg flex flex-col items-center gap-4">
          <Loader className="animate-spin" size={32} />
          <p className="crt-text text-lg">Initializing TechStack Admin...</p>
          <p className="crt-text opacity-60 text-sm">{status}</p>
        </div>
      </div>
    );
  }

  // Safe access to categories - UPDATED for techStackData
  const categories = draft.techStackData || [];
  const activeCatIndex = activeTab.startsWith("CAT:") ? parseInt(activeTab.split(":")[1]) : null;
  const activeCat = Number.isInteger(activeCatIndex) && categories[activeCatIndex] ? categories[activeCatIndex] : null;

  return (
    <div className="w-screen h-screen overflow-hidden crt-screen crt-glow">
      <CRTStyles />
      
      <div className="w-full h-full flex flex-col p-4 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="crt-panel rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold crt-text">
                TECH STACK ADMIN TERMINAL
              </h1>
              <div className="text-xs crt-text opacity-60">v2.0.1</div>
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
          {!previewMode ? (
            <>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-64 crt-panel rounded-lg p-4 flex flex-col gap-4"
              >
                <div>
                  <h3 className="text-sm crt-text mb-3 opacity-60">NAVIGATION</h3>
                  <div className="space-y-2">
                    {sidebarTabs.map((tabKey, i) => {
                      const isActive = activeTab === tabKey;
                      const label =
                        tabKey === "CATEGORIES"
                          ? "CATEGORIES"
                          : categories[parseInt(tabKey.split(":")[1], 10)]?.title || tabKey;
                      return (
                        <motion.button
                          key={i}
                          whileHover={{ x: 5 }}
                          onClick={() => setActiveTab(tabKey)}
                          className={`w-full text-left px-3 py-2 rounded transition-all ${
                            isActive ? "crt-button crt-text" : "text-cyan-400/60 hover:text-cyan-400"
                          }`}
                        >
                          {label.toUpperCase()}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex-1" />

                <div>
                  <h3 className="text-sm crt-text mb-3 opacity-60">ACTIONS</h3>
                  <div className="space-y-2">
                    <button 
                      onClick={initiateSaveConfirmation} 
                      disabled={!hasChanges}
                      className="w-full crt-button px-3 py-2 rounded crt-text flex items-center gap-2"
                    >
                      <Save size={16} /> SAVE (CONFIRM)
                    </button>
                    <button onClick={exportJson} className="w-full crt-button px-3 py-2 rounded crt-text flex items-center gap-2">
                      <Download size={16} /> EXPORT
                    </button>
                    <button onClick={resetToDefault} className="w-full crt-button px-3 py-2 rounded crt-text flex items-center gap-2">
                      <RotateCcw size={16} /> RESET
                    </button>
                    <label className="w-full crt-button px-3 py-2 rounded crt-text flex items-center gap-2 cursor-pointer">
                      <Upload size={16} /> IMPORT
                      <input type="file" accept=".json" onChange={importJson} className="hidden" />
                    </label>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 crt-panel rounded-lg p-6 overflow-hidden"
              >
                <div className="h-full overflow-y-auto hide-scrollbar">
                  <AnimatePresence mode="wait">
                    {activeTab === "CATEGORIES" && (
                      <motion.div
                        key="categories"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl crt-text">CATEGORIES</h2>
                          <button
                            onClick={addCategory}
                            className="crt-button px-4 py-2 rounded crt-text flex items-center gap-2"
                          >
                            <Plus size={16} /> ADD CATEGORY
                          </button>
                        </div>

                        <div className="space-y-4">
                          {categories.length === 0 ? (
                            <div className="crt-panel p-4 rounded text-center">
                              <p className="crt-text opacity-60">No categories found. Add your first category!</p>
                            </div>
                          ) : (
                            categories.map((cat, idx) => (
                              <div key={`cat-${idx}`} className="crt-panel p-4 rounded">
                                <div className="flex items-center gap-3 mb-3">
                                  <Palette className="text-cyan-400 flex-shrink-0" size={18} />
                                  <input
                                    type="text"
                                    value={cat.title || ""}
                                    onChange={(e) => updateCategoryTitle(idx, e.target.value)}
                                    className="crt-input px-3 py-1 rounded text-sm flex-1"
                                    placeholder="Category Title"
                                    autoComplete="off"
                                  />
                                  <input
                                    type="text"
                                    value={cat.color || ""}
                                    onChange={(e) => updateCategoryColor(idx, e.target.value)}
                                    className="crt-input px-3 py-1 rounded text-sm w-56"
                                    placeholder="Tailwind Gradient"
                                    autoComplete="off"
                                  />
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => moveCategory(idx, -1)}
                                      disabled={idx === 0}
                                      className="crt-button p-2 rounded"
                                    >
                                      <ArrowUp size={14} />
                                    </button>
                                    <button
                                      onClick={() => moveCategory(idx, 1)}
                                      disabled={idx === categories.length - 1}
                                      className="crt-button p-2 rounded"
                                    >
                                      <ArrowDown size={14} />
                                    </button>
                                    <button
                                      onClick={() => removeCategory(idx)}
                                      className="crt-button p-2 rounded text-red-400"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => setActiveTab(`CAT:${idx}`)} 
                                  className="crt-button px-3 py-1 rounded crt-text text-xs"
                                >
                                  EDIT TECH →
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}

                    {activeCat && (
                      <motion.div
                        key={`category-${activeCatIndex}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl crt-text">EDIT: {activeCat.title}</h2>
                          <button 
                            onClick={() => setActiveTab("CATEGORIES")} 
                            className="crt-button px-3 py-2 rounded crt-text"
                          >
                            ← BACK TO CATEGORIES
                          </button>
                        </div>

                        <div className="space-y-2">
                          {(!activeCat.tech || activeCat.tech.length === 0) ? (
                            <div className="crt-panel p-3 rounded text-center">
                              <p className="crt-text opacity-60">No technologies in this category. Add some below!</p>
                            </div>
                          ) : (
                            activeCat.tech.map((tech, tIdx) => (
                              <div key={`tech-${tIdx}`} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={tech || ""}
                                  onChange={(e) => updateTech(activeCatIndex, tIdx, e.target.value)}
                                  className="crt-input px-3 py-1 rounded text-sm flex-1"
                                  placeholder="Technology name"
                                  autoComplete="off"
                                />
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => moveTech(activeCatIndex, tIdx, -1)}
                                    disabled={tIdx === 0}
                                    className="crt-button p-2 rounded"
                                  >
                                    <ArrowUp size={12} />
                                  </button>
                                  <button
                                    onClick={() => moveTech(activeCatIndex, tIdx, 1)}
                                    disabled={tIdx === (activeCat.tech?.length || 0) - 1}
                                    className="crt-button p-2 rounded"
                                  >
                                    <ArrowDown size={12} />
                                  </button>
                                  <button
                                    onClick={() => removeTech(activeCatIndex, tIdx)}
                                    className="crt-button p-2 rounded text-red-400"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                          <div className="flex gap-2 mt-3">
                            <input
                              id={`new-tech-${activeCatIndex}`}
                              type="text"
                              className="crt-input flex-1 px-3 py-2 rounded text-sm"
                              placeholder="Add new technology"
                              autoComplete="off"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.target.value.trim()) {
                                  addTech(activeCatIndex, e.target.value);
                                  e.target.value = '';
                                }
                              }}
                            />
                            <button
                              onClick={() => {
                                const input = document.getElementById(`new-tech-${activeCatIndex}`);
                                if (input && input.value.trim()) {
                                  addTech(activeCatIndex, input.value);
                                  input.value = '';
                                }
                              }}
                              className="crt-button px-4 py-2 rounded crt-text flex items-center gap-2 flex-shrink-0"
                            >
                              <Plus size={14} /> ADD
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 crt-panel rounded-lg p-6 overflow-auto hide-scrollbar"
            >
              <div className="crt-text">
                <h2 className="text-2xl mb-4">PREVIEW MODE — TECH STACK</h2>
                <div className="space-y-6">
                  {categories.length === 0 ? (
                    <div className="crt-panel p-4 rounded text-center">
                      <p className="crt-text opacity-60">No categories configured</p>
                    </div>
                  ) : (
                    categories.map((cat, idx) => (
                      <div key={`preview-${idx}`} className="crt-panel p-4 rounded">
                        <h3 className="text-lg mb-2">{cat.title || "Untitled Category"}</h3>
                        <p className="text-xs text-cyan-300 mb-2">Gradient: {cat.color || "Not set"}</p>
                        <div className="flex flex-wrap gap-2">
                          {(!cat.tech || cat.tech.length === 0) ? (
                            <span className="px-3 py-1 bg-cyan-500/20 rounded text-xs opacity-60">No technologies</span>
                          ) : (
                            cat.tech.map((t, i) => (
                              <span key={`${idx}-${i}`} className="px-3 py-1 bg-cyan-500/20 rounded text-xs">
                                {t}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Changes confirmation modal */}
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
                  <h3 className="text-xl crt-text mb-2">CONFIRM SAVE TO FIREBASE</h3>
                  <p className="text-sm crt-text opacity-60">
                    {isOnline
                      ? "Enter admin code to save your tech stack changes to Firebase."
                      : "🔌 Offline: Cannot save to Firebase without internet connection."}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm crt-text opacity-80 mb-2">
                  You're about to save changes to the tech stack configuration.
                </p>
                <div className="crt-panel p-3 rounded">
                  <div className="text-xs crt-text opacity-60 mb-1">Changes include:</div>
                  <div className="text-sm crt-text">
                    • {categories.length} categories with {categories.reduce((acc, cat) => acc + (cat.tech?.length || 0), 0)} total technologies
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1">
                  <input
                    type="password"
                    value={secretInput}
                    onChange={(e) => setSecretInput(e.target.value)}
                    placeholder="Enter admin code..."
                    className="w-full crt-input px-4 py-2 rounded"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') confirmSaveWithCode();
                    }}
                    autoComplete="off"
                    disabled={!isOnline}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setChangesPopupOpen(false);
                    setSecretInput("");
                  }}
                  className="crt-button px-4 py-2 rounded crt-text"
                >
                  CANCEL
                </button>
                <button
                  onClick={confirmSaveWithCode}
                  disabled={isSyncing || !isOnline}
                  className="crt-button px-4 py-2 rounded crt-text bg-cyan-500/20 border-cyan-400 flex items-center gap-2"
                >
                  {isSyncing ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      SAVING...
                    </>
                  ) : (
                    "CONFIRM & SAVE"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}