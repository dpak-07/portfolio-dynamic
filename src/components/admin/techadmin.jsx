import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, Save, RotateCcw, Download, Upload, Plus, X,
  ArrowUp, ArrowDown, Palette, AlertCircle, CheckCircle, Loader, Wifi, WifiOff
} from "lucide-react";
import { doc, setDoc, getDoc, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";

const STORAGE_DRAFT_KEY = "techstack_config_draft";
const STORAGE_SAVED_KEY = "techstack_config_saved";
const FIRESTORE_ADMIN_DOC = "admin/credentials";
const FIRESTORE_TECHSTACK_DOC = "techStack/categories";
const SYNC_DEBOUNCE = 500; // ms

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

const defaultConfig = {
  categories: [
    { title: "Languages", color: "from-purple-400 to-pink-500", tech: ["C", "Python", "Java", "JavaScript", "Dart", "HTML", "CSS", "TypeScript"] },
    { title: "Frontend", color: "from-blue-500 to-cyan-400", tech: ["React", "Next.js", "Tailwind CSS", "Flutter", "Bootstrap", "Vite"] },
    { title: "Backend", color: "from-green-500 to-emerald-400", tech: ["Node.js", "Express", "Flask", "FastAPI", "Spring Boot"] },
    { title: "Databases", color: "from-orange-400 to-amber-500", tech: ["MongoDB", "MySQL", "SQLite", "PostgreSQL", "Firebase"] },
    { title: "Cloud & DevOps", color: "from-yellow-400 to-lime-400", tech: ["AWS", "Google Cloud", "Docker", "Kubernetes", "Vercel"] },
    { title: "AI & ML", color: "from-red-400 to-pink-400", tech: ["TensorFlow", "PyTorch", "OpenCV", "Keras", "NumPy", "Pandas"] },
    { title: "Mobile", color: "from-teal-400 to-green-400", tech: ["React Native", "Flutter", "Android", "iOS", "Expo"] },
    { title: "Tools", color: "from-indigo-400 to-blue-400", tech: ["Git", "GitHub", "VS Code", "Postman", "Linux", "Figma"] },
  ],
};

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
  const unsubscribeRef = useRef(null);
  const syncTimeoutRef = useRef(null);
  const draftChangeTimeoutRef = useRef(null);
  const prevDraftRef = useRef(null);

  // Block Google auto-save
  useEffect(() => {
    const preventAutoSave = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        setStatus("⚠ Use SAVE button instead of Ctrl+S");
        setStatusType("info");
        setTimeout(() => {
          if (draft) {
            setStatus("✓ Ready to save");
            setStatusType("success");
          }
        }, 2000);
        return false;
      }
    };

    window.addEventListener('keydown', preventAutoSave);
    
    // Disable browser autofill
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

  // Initialize data from Firebase
  useEffect(() => {
    const initializeData = async () => {
      try {
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

        const saved = localStorage.getItem(STORAGE_SAVED_KEY);
        const session = sessionStorage.getItem(STORAGE_DRAFT_KEY);
        
        let initialDraft = null;
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
        
        setDraft(initialDraft);
        prevDraftRef.current = JSON.stringify(initialDraft);

        const techStackDocRef = doc(db, FIRESTORE_TECHSTACK_DOC);
        unsubscribeRef.current = onSnapshot(
          techStackDocRef,
          (snapshot) => {
            if (snapshot.exists()) {
              console.log("📡 Real-time update received from Firestore");
            }
          },
          (error) => {
            console.error("Firebase listener error:", error);
          }
        );

        setStatusType("success");
      } catch (error) {
        console.error("Init error:", error);
        setStatus("⚠ Using offline mode");
        setStatusType("error");
        setDraft(defaultConfig);
        prevDraftRef.current = JSON.stringify(defaultConfig);
        setAdminCode("69");
      }
    };

    initializeData();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      unsubscribeRef.current?.();
      clearTimeout(syncTimeoutRef.current);
      clearTimeout(draftChangeTimeoutRef.current);
    };
  }, []);

  // Debounced draft save to session storage (no lag)
  useEffect(() => {
    if (!draft) return;

    // Clear previous timeout
    if (draftChangeTimeoutRef.current) {
      clearTimeout(draftChangeTimeoutRef.current);
    }

    // Check if draft actually changed
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

  const sidebarTabs = useMemo(() => {
    if (!draft) return ["CATEGORIES"];
    return ["CATEGORIES", ...draft.categories.map((c, i) => `CAT:${i}`)];
  }, [draft?.categories?.length]);

  const moveCategory = useCallback((idx, dir) => {
    setDraft(prevDraft => {
      if (!prevDraft) return prevDraft;
      const copy = structuredClone(prevDraft);
      const arr = copy.categories;
      const newIndex = idx + dir;
      if (newIndex < 0 || newIndex >= arr.length) return prevDraft;
      [arr[idx], arr[newIndex]] = [arr[newIndex], arr[idx]];
      return copy;
    });
  }, []);

  const moveTech = useCallback((catIdx, tIdx, dir) => {
    setDraft(prevDraft => {
      if (!prevDraft) return prevDraft;
      const copy = structuredClone(prevDraft);
      const arr = copy.categories[catIdx].tech;
      const newIndex = tIdx + dir;
      if (newIndex < 0 || newIndex >= arr.length) return prevDraft;
      [arr[tIdx], arr[newIndex]] = [arr[newIndex], arr[tIdx]];
      return copy;
    });
  }, []);

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
        techStackData: config.categories,
        lastUpdated: new Date().toISOString(),
        updatedBy: "kavshick",
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

  const confirmSave = useCallback(async () => {
    if (!draft) return;
    
    if (String(secretInput).trim() !== String(adminCode)) {
      setStatus("✗ ACCESS DENIED - Wrong code");
      setStatusType("error");
      setTimeout(() => setSecretInput(""), 2000);
      return;
    }

    localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(draft));
    sessionStorage.removeItem(STORAGE_DRAFT_KEY);

    const success = await saveToFirebase(draft);
    
    if (success) {
      setChangesPopupOpen(false);
      setSecretInput("");
    }
  }, [draft, adminCode, saveToFirebase]);

  const quickSave = useCallback(async () => {
    if (!draft) return;
    
    localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(draft));
    sessionStorage.removeItem(STORAGE_DRAFT_KEY);

    if (isOnline) {
      await saveToFirebase(draft);
    } else {
      setStatus("✓ Saved locally (offline)");
      setStatusType("info");
    }
  }, [draft, isOnline, saveToFirebase]);

  const resetDefault = useCallback(() => {
    if (window.confirm("Reset to default config?")) {
      setDraft(defaultConfig);
      prevDraftRef.current = JSON.stringify(defaultConfig);
      setActiveTab("CATEGORIES");
      setStatus("Reset done");
      setStatusType("info");
      setHasChanges(false);
    }
  }, []);

  const exportJson = useCallback(() => {
    if (!draft) return;
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `techstack_config_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus("✓ Exported config");
    setStatusType("success");
  }, [draft]);

  const importJson = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (parsed.categories && Array.isArray(parsed.categories)) {
          setDraft(parsed);
          prevDraftRef.current = JSON.stringify(parsed);
          setActiveTab("CATEGORIES");
          setStatus("✓ Imported successfully");
          setStatusType("success");
        } else {
          throw new Error("Invalid format");
        }
      } catch {
        setStatus("✗ Invalid JSON format");
        setStatusType("error");
      }
    };
    reader.readAsText(file);
  }, []);

  const addCategory = useCallback(() => {
    setDraft(prevDraft => {
      if (!prevDraft) return prevDraft;
      const copy = structuredClone(prevDraft);
      copy.categories.push({ title: "New Category", color: "from-cyan-400 to-blue-400", tech: [] });
      return copy;
    });
  }, []);

  const removeCategory = useCallback((idx) => {
    setDraft(prevDraft => {
      if (!prevDraft) return prevDraft;
      const copy = structuredClone(prevDraft);
      copy.categories.splice(idx, 1);
      return copy;
    });
  }, []);

  const updateCategoryTitle = useCallback((idx, title) => {
    setDraft(prevDraft => {
      if (!prevDraft) return prevDraft;
      const copy = structuredClone(prevDraft);
      copy.categories[idx].title = title;
      return copy;
    });
  }, []);

  const updateCategoryColor = useCallback((idx, color) => {
    setDraft(prevDraft => {
      if (!prevDraft) return prevDraft;
      const copy = structuredClone(prevDraft);
      copy.categories[idx].color = color;
      return copy;
    });
  }, []);

  const updateTech = useCallback((catIdx, tIdx, value) => {
    setDraft(prevDraft => {
      if (!prevDraft) return prevDraft;
      const copy = structuredClone(prevDraft);
      copy.categories[catIdx].tech[tIdx] = value;
      return copy;
    });
  }, []);

  const removeTech = useCallback((catIdx, tIdx) => {
    setDraft(prevDraft => {
      if (!prevDraft) return prevDraft;
      const copy = structuredClone(prevDraft);
      copy.categories[catIdx].tech.splice(tIdx, 1);
      return copy;
    });
  }, []);

  const addTech = useCallback((catIdx, tech) => {
    setDraft(prevDraft => {
      if (!prevDraft) return prevDraft;
      const copy = structuredClone(prevDraft);
      copy.categories[catIdx].tech.push(tech.trim());
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

  const activeCatIndex = activeTab.startsWith("CAT:") ? parseInt(activeTab.split(":")[1]) : null;
  const activeCat = Number.isInteger(activeCatIndex) ? draft.categories[activeCatIndex] : null;

  return (
    <div className="w-screen h-screen crt-screen crt-glow flex flex-col">
      <CRTStyles />

      {/* HEADER */}
      <motion.div className="crt-panel p-4 m-4 rounded-lg flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold crt-text">TECH STACK ADMIN TERMINAL</h1>
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
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="crt-button px-4 py-2 rounded crt-text flex items-center gap-2"
          >
            <Eye size={16} /> {previewMode ? "EDIT" : "PREVIEW"}
          </button>
        </div>
      </motion.div>

      {/* BODY */}
      <div className="flex flex-1 gap-4 p-4 overflow-hidden">
        {/* SIDEBAR */}
        <motion.div className="w-72 crt-panel rounded-lg p-4 flex flex-col justify-between h-full overflow-hidden">
          <div className="flex flex-col overflow-hidden flex-1">
            <h3 className="text-sm crt-text opacity-60 mb-3">NAVIGATION</h3>
            <div className="flex-1 overflow-y-auto hide-scrollbar pr-1 mb-4">
              {sidebarTabs.map((tabKey, i) => {
                const isActive = activeTab === tabKey;
                const label =
                  tabKey === "CATEGORIES"
                    ? "CATEGORIES"
                    : draft.categories[parseInt(tabKey.split(":")[1], 10)]?.title || tabKey;
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

          <div className="border-t border-cyan-700/40 pt-4 shrink-0">
            <h3 className="text-sm crt-text opacity-60 mb-3">ACTIONS</h3>
            <div className="space-y-2">
              <button
                onClick={() => setChangesPopupOpen(true)}
                disabled={!hasChanges}
                className="w-full crt-button px-3 py-2 rounded crt-text flex items-center gap-2"
              >
                <Save size={16} /> SAVE
              </button>
              <button
                onClick={quickSave}
                disabled={!hasChanges}
                className="w-full crt-button px-3 py-2 rounded crt-text flex items-center gap-2"
              >
                <Save size={16} /> QUICK SAVE
              </button>
              <button
                onClick={resetDefault}
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

        {/* MAIN PANEL */}
        <div className="flex-1 crt-panel rounded-lg p-6 overflow-y-auto hide-scrollbar">
          {!previewMode ? (
            activeTab === "CATEGORIES" ? (
              <div>
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
                  {draft.categories.map((cat, idx) => (
                    <div key={`cat-${idx}`} className="crt-panel p-4 rounded">
                      <div className="flex items-center gap-3 mb-3">
                        <Palette className="text-cyan-400 flex-shrink-0" size={18} />
                        <input
                          type="text"
                          value={cat.title}
                          onChange={(e) => updateCategoryTitle(idx, e.target.value)}
                          className="crt-input px-3 py-1 rounded text-sm flex-1"
                          autoComplete="off"
                        />
                        <input
                          type="text"
                          value={cat.color}
                          onChange={(e) => updateCategoryColor(idx, e.target.value)}
                          className="crt-input px-3 py-1 rounded text-sm w-56"
                          autoComplete="off"
                        />
                        <button
                          onClick={() => moveCategory(idx, -1)}
                          disabled={idx === 0}
                          className="crt-button p-2 rounded flex-shrink-0"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          onClick={() => moveCategory(idx, 1)}
                          disabled={idx === draft.categories.length - 1}
                          className="crt-button p-2 rounded flex-shrink-0"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button onClick={() => removeCategory(idx)} className="crt-button p-2 rounded text-red-400 flex-shrink-0">
                          <X size={14} />
                        </button>
                      </div>
                      <button onClick={() => setActiveTab(`CAT:${idx}`)} className="crt-button px-3 py-1 rounded crt-text text-xs">
                        EDIT TECH →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeCat ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl crt-text">EDIT: {activeCat.title}</h2>
                  <button onClick={() => setActiveTab("CATEGORIES")} className="crt-button px-3 py-2 rounded crt-text">
                    ← BACK
                  </button>
                </div>
                <div className="space-y-2">
                  {activeCat.tech.map((tech, tIdx) => (
                    <div key={`tech-${tIdx}`} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tech}
                        onChange={(e) => updateTech(activeCatIndex, tIdx, e.target.value)}
                        className="crt-input px-3 py-1 rounded text-sm flex-1"
                        autoComplete="off"
                      />
                      <button
                        onClick={() => moveTech(activeCatIndex, tIdx, -1)}
                        disabled={tIdx === 0}
                        className="crt-button p-2 rounded flex-shrink-0"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        onClick={() => moveTech(activeCatIndex, tIdx, 1)}
                        disabled={tIdx === activeCat.tech.length - 1}
                        className="crt-button p-2 rounded flex-shrink-0"
                      >
                        <ArrowDown size={12} />
                      </button>
                      <button
                        onClick={() => removeTech(activeCatIndex, tIdx)}
                        className="crt-button p-2 rounded text-red-400 flex-shrink-0"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-3">
                    <input
                      id={`new-tech-${activeCatIndex}`}
                      type="text"
                      className="crt-input flex-1 px-3 py-2 rounded text-sm"
                      placeholder="Add new tech"
                      autoComplete="off"
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById(`new-tech-${activeCatIndex}`);
                        if (input && input.value.trim()) {
                          addTech(activeCatIndex, input.value);
                          input.value = "";
                        }
                      }}
                      className="crt-button px-4 py-2 rounded crt-text flex items-center gap-2 flex-shrink-0"
                    >
                      <Plus size={14} /> ADD
                    </button>
                  </div>
                </div>
              </div>
            ) : null
          ) : (
            <div>
              <h2 className="text-2xl crt-text mb-4">PREVIEW MODE — FULL STACK</h2>
              <div className="space-y-6">
                {draft.categories.map((cat, idx) => (
                  <div key={`preview-${idx}`} className="crt-panel p-4 rounded">
                    <h3 className="crt-text text-lg mb-2">{cat.title}</h3>
                    <p className="text-xs text-cyan-300 mb-2">{cat.color}</p>
                    <div className="flex flex-wrap gap-2">
                      {cat.tech.map((t, i) => (
                        <span key={`${idx}-${i}`} className="px-3 py-1 bg-cyan-500/20 rounded text-xs">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SAVE CONFIRM MODAL */}
      <AnimatePresence>
        {changesPopupOpen && (
          <motion.div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="crt-panel p-6 rounded-lg max-w-md w-full space-y-4"
            >
              <h3 className="text-xl crt-text">CONFIRM SAVE</h3>
              <p className="text-sm crt-text opacity-60">
                {isOnline
                  ? "Enter admin code to save to Firestore & local storage."
                  : "🔌 Offline: Will save locally only. Firestore sync when online."}
              </p>
              <input
                type="password"
                value={secretInput}
                onChange={(e) => setSecretInput(e.target.value)}
                className="crt-input w-full px-4 py-2 rounded"
                placeholder="Enter admin code..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmSave();
                }}
                autoComplete="off"
                spellCheck="false"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setChangesPopupOpen(false)}
                  className="crt-button px-4 py-2 rounded crt-text"
                >
                  CANCEL
                </button>
                <button
                  onClick={confirmSave}
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