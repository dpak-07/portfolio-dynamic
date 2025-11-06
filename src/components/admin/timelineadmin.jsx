"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, Save, RotateCcw, Download, Upload, Plus, X,
  ArrowUp, ArrowDown, Calendar, Clock, MapPin, Award,
  CheckCircle, AlertCircle, Loader, Wifi, WifiOff,
  Trash2, Edit3, Copy, Sparkles, Rocket, GraduationCap,
  Briefcase, Trophy, Zap, Cloud, Lightbulb, Star, Brain,
  Code, Users, Target, TrendingUp, Mail, Link
} from "lucide-react";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";

const STORAGE_DRAFT_KEY = "timeline_config_draft";
const FIRESTORE_ADMIN_DOC = "admin/credentials";
const FIRESTORE_TIMELINE_DOC = "timeline/data";

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
    .crt-textarea{background:rgba(0,0,0,.6);border:2px solid rgba(0,229,255,.3);color:#00e5ff;box-shadow:inset 0 0 20px rgba(0,229,255,.1);transition:all .2s ease;resize:vertical;}
    .crt-textarea:focus{outline:none;border-color:rgba(0,229,255,.6);box-shadow:0 0 20px rgba(0,229,255,.3),inset 0 0 20px rgba(0,229,255,.2);}
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

// Icon mapping for timeline events
const iconMap = {
  Brain, Code, Award, Rocket, Zap, Trophy, Lightbulb, Star,
  GraduationCap, Briefcase, Cloud, Link, Mail, Users, Target, TrendingUp
};

// Default timeline configuration
const defaultConfig = {
  events: [
    {
      year: "2022",
      period: "Started Learning",
      title: "Full-Stack Certification HDHD in (CSC)",
      icon: "Award",
      color: "from-blue-400 to-indigo-500",
      accentColor: "blue",
      description: "Completed comprehensive Full Stack Web Development course at CSC - HDFC Skill Development Center, mastering C, C++, Java, and modern web technologies with extensive hands-on projects.",
      achievements: [
        "Full-stack development certification",
        "Mastered C, C++, Java",
        "Built end-to-end web applications",
      ],
      skills: ["C", "C++", "Java", "Full-Stack Development", "Web Technologies"],
    },
    {
      year: "2023",
      period: "AI & Data Science",
      title: "College - Velammal Engineering",
      icon: "GraduationCap",
      color: "from-orange-400 to-red-500",
      accentColor: "orange",
      description: "Started B.Tech in AI & Data Science at Velammal Engineering College, Chennai. Specializing in Machine Learning, Deep Learning, and Data Mining.",
      achievements: [
        "3rd Year AI & Data Science",
        "Specialized in ML & Deep Learning",
        "Applied AI in real-world projects",
      ],
      skills: ["Machine Learning", "Deep Learning", "Data Mining", "Python", "TensorFlow", "PyTorch"],
    }
  ],
  stats: [
    { label: "Years Active", value: "5", icon: "TrendingUp" },
    { label: "Projects Built", value: "15", icon: "Target" },
    { label: "Team Members Led", value: "6", icon: "Users" },
    { label: "Hackathons", value: "6", icon: "Trophy" },
  ],
  lastUpdated: new Date().toISOString(),
  updatedBy: "admin",
};

// Normalization function for timeline data
function normalizeTimelineData(data) {
  if (!data) return defaultConfig;
  
  console.log("Normalizing timeline data:", data);
  
  // Handle the actual structure
  if (data.events && Array.isArray(data.events)) {
    return {
      events: data.events.map(event => ({
        year: event.year || "2023",
        period: event.period || "Period",
        title: event.title || "Untitled Event",
        icon: event.icon || "Award",
        color: event.color || "from-cyan-400 to-blue-400",
        accentColor: event.accentColor || "cyan",
        description: event.description || "Event description",
        achievements: Array.isArray(event.achievements) ? event.achievements : [],
        skills: Array.isArray(event.skills) ? event.skills : []
      })),
      stats: Array.isArray(data.stats) ? data.stats : defaultConfig.stats,
      lastUpdated: data.lastUpdated || new Date().toISOString(),
      updatedBy: data.updatedBy || "admin"
    };
  } else {
    return defaultConfig;
  }
}

export default function TimelineAdmin() {
  const [draft, setDraft] = useState(null);
  const [status, setStatus] = useState("🔌 Connecting to Firebase...");
  const [statusType, setStatusType] = useState("info");
  const [activeTab, setActiveTab] = useState("EVENTS");
  const [previewMode, setPreviewMode] = useState(false);
  const [changesPopupOpen, setChangesPopupOpen] = useState(false);
  const [secretInput, setSecretInput] = useState("");
  const [adminCode, setAdminCode] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [newAchievement, setNewAchievement] = useState("");
  const [newSkill, setNewSkill] = useState("");
  
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

      // Load timeline data from Firestore
      setStatus("🔄 Loading timeline data...");
      const timelineDocRef = doc(db, FIRESTORE_TIMELINE_DOC);
      const timelineSnap = await getDoc(timelineDocRef);
      
      let initialDraft = null;
      
      if (timelineSnap.exists()) {
        const firestoreData = timelineSnap.data();
        console.log("Raw Firestore timeline data:", firestoreData);
        initialDraft = normalizeTimelineData(firestoreData);
        setStatus("✓ Timeline loaded from Firestore");
      } else {
        const session = sessionStorage.getItem(STORAGE_DRAFT_KEY);
        
        if (session) {
          try {
            const sessionData = JSON.parse(session);
            initialDraft = normalizeTimelineData(sessionData);
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
      
      console.log("Normalized timeline draft:", initialDraft);
      setDraft(initialDraft);
      committedRef.current = JSON.parse(JSON.stringify(initialDraft));
      prevDraftRef.current = JSON.stringify(initialDraft);
      setStatusType("success");

    } catch (error) {
      console.error("Timeline init error:", error);
      setStatus("⚠ Using offline mode");
      setStatusType("error");
      
      const session = sessionStorage.getItem(STORAGE_DRAFT_KEY);
      let fallbackDraft = defaultConfig;
      
      if (session) {
        try {
          const sessionData = JSON.parse(session);
          fallbackDraft = normalizeTimelineData(sessionData);
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

  // Save to Firebase
  const saveToFirebase = useCallback(async (config) => {
    if (!isOnline) {
      setStatus("✗ No internet connection");
      setStatusType("error");
      return false;
    }

    setIsSyncing(true);
    try {
      const enrichedConfig = {
        events: config.events || [],
        stats: config.stats || [],
        lastUpdated: new Date().toISOString(),
        updatedBy: "admin",
        updatedAt: Timestamp.now(),
      };

      await setDoc(
        doc(db, FIRESTORE_TIMELINE_DOC),
        enrichedConfig,
        { merge: true }
      );

      setStatus("✓ TIMELINE SAVED TO FIREBASE");
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
  }, [draft]);

  // Save confirmation flow
  const initiateSaveConfirmation = () => {
    if (!draft || !draft.events) {
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
      const success = await saveToFirebase(draft);
      
      if (success) {
        sessionStorage.removeItem(STORAGE_DRAFT_KEY);
        committedRef.current = JSON.parse(JSON.stringify(draft));
        setChangesPopupOpen(false);
        setStatus("✓ TIMELINE SAVED SUCCESSFULLY");
        setStatusType("success");
      }
    } catch {
      setStatus("Save failed");
      setStatusType("error");
    }
  };

  // Diff helper function
  function computeChanges(oldConfig = {}, newConfig = {}) {
    const changes = [];
    function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
    
    if (!same(oldConfig.events || [], newConfig.events || [])) changes.push("events");
    if (!same(oldConfig.stats || [], newConfig.stats || [])) changes.push("stats");
    
    return [...new Set(changes)];
  }

  const refreshFromFirebase = async () => {
    setStatus("🔄 Refreshing from Firebase...");
    setStatusType("info");
    await loadFromFirebase();
  };

  const resetToDefault = () => {
    if (window.confirm("Reset all timeline changes to default?")) {
      setDraft(defaultConfig);
      setStatus("Reset to default timeline");
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
    a.download = "timeline_config.json";
    a.click();
    URL.revokeObjectURL(url);
    setStatus("Exported timeline configuration");
    setStatusType("success");
  };

  const importJson = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const imported = JSON.parse(evt.target.result);
        const normalized = normalizeTimelineData(imported);
        setDraft(normalized);
        setStatus("Timeline imported successfully");
        setStatusType("success");
        setHasChanges(true);
      } catch (err) {
        setStatus("Import failed: Invalid JSON");
        setStatusType("error");
      }
    };
    reader.readAsText(file);
  };

  // Event operations
  const moveEvent = useCallback((idx, dir) => {
    setDraft(prevDraft => {
      if (!prevDraft || !prevDraft.events) return prevDraft;
      const copy = JSON.parse(JSON.stringify(prevDraft));
      const arr = copy.events;
      const newIndex = idx + dir;
      if (newIndex < 0 || newIndex >= arr.length) return prevDraft;
      [arr[idx], arr[newIndex]] = [arr[newIndex], arr[idx]];
      return copy;
    });
  }, []);

  const addEvent = useCallback(() => {
    setDraft(prevDraft => {
      if (!prevDraft) return prevDraft;
      const copy = JSON.parse(JSON.stringify(prevDraft));
      if (!copy.events) {
        copy.events = [];
      }
      copy.events.push({
        year: "2024",
        period: "New Period",
        title: "New Timeline Event",
        icon: "Award",
        color: "from-cyan-400 to-blue-400",
        accentColor: "cyan",
        description: "Event description goes here...",
        achievements: [],
        skills: []
      });
      return copy;
    });
  }, []);

  const removeEvent = useCallback((idx) => {
    setDraft(prevDraft => {
      if (!prevDraft || !prevDraft.events) return prevDraft;
      const copy = JSON.parse(JSON.stringify(prevDraft));
      copy.events.splice(idx, 1);
      return copy;
    });
  }, []);

  const updateEventField = useCallback((idx, field, value) => {
    setDraft(prevDraft => {
      if (!prevDraft || !prevDraft.events || !prevDraft.events[idx]) return prevDraft;
      const copy = JSON.parse(JSON.stringify(prevDraft));
      copy.events[idx][field] = value;
      return copy;
    });
  }, []);

  const updateStatField = useCallback((idx, field, value) => {
    setDraft(prevDraft => {
      if (!prevDraft || !prevDraft.stats || !prevDraft.stats[idx]) return prevDraft;
      const copy = JSON.parse(JSON.stringify(prevDraft));
      copy.stats[idx][field] = value;
      return copy;
    });
  }, []);

  const addStat = useCallback(() => {
    setDraft(prevDraft => {
      if (!prevDraft) return prevDraft;
      const copy = JSON.parse(JSON.stringify(prevDraft));
      if (!copy.stats) {
        copy.stats = [];
      }
      copy.stats.push({ label: "New Stat", value: "0", icon: "Target" });
      return copy;
    });
  }, []);

  const removeStat = useCallback((idx) => {
    setDraft(prevDraft => {
      if (!prevDraft || !prevDraft.stats) return prevDraft;
      const copy = JSON.parse(JSON.stringify(prevDraft));
      copy.stats.splice(idx, 1);
      return copy;
    });
  }, []);

  const moveStat = useCallback((idx, dir) => {
    setDraft(prevDraft => {
      if (!prevDraft || !prevDraft.stats) return prevDraft;
      const copy = JSON.parse(JSON.stringify(prevDraft));
      const arr = copy.stats;
      const newIndex = idx + dir;
      if (newIndex < 0 || newIndex >= arr.length) return prevDraft;
      [arr[idx], arr[newIndex]] = [arr[newIndex], arr[idx]];
      return copy;
    });
  }, []);

  // Achievement and skill operations
  const addAchievement = useCallback((eventIdx) => {
    if (!newAchievement.trim()) return;
    setDraft(prevDraft => {
      if (!prevDraft || !prevDraft.events || !prevDraft.events[eventIdx]) return prevDraft;
      const copy = JSON.parse(JSON.stringify(prevDraft));
      if (!copy.events[eventIdx].achievements) {
        copy.events[eventIdx].achievements = [];
      }
      copy.events[eventIdx].achievements.push(newAchievement.trim());
      setNewAchievement("");
      return copy;
    });
  }, [newAchievement]);

  const removeAchievement = useCallback((eventIdx, achievementIdx) => {
    setDraft(prevDraft => {
      if (!prevDraft || !prevDraft.events || !prevDraft.events[eventIdx]) return prevDraft;
      const copy = JSON.parse(JSON.stringify(prevDraft));
      if (Array.isArray(copy.events[eventIdx].achievements)) {
        copy.events[eventIdx].achievements.splice(achievementIdx, 1);
      }
      return copy;
    });
  }, []);

  const addSkill = useCallback((eventIdx) => {
    if (!newSkill.trim()) return;
    setDraft(prevDraft => {
      if (!prevDraft || !prevDraft.events || !prevDraft.events[eventIdx]) return prevDraft;
      const copy = JSON.parse(JSON.stringify(prevDraft));
      if (!copy.events[eventIdx].skills) {
        copy.events[eventIdx].skills = [];
      }
      copy.events[eventIdx].skills.push(newSkill.trim());
      setNewSkill("");
      return copy;
    });
  }, [newSkill]);

  const removeSkill = useCallback((eventIdx, skillIdx) => {
    setDraft(prevDraft => {
      if (!prevDraft || !prevDraft.events || !prevDraft.events[eventIdx]) return prevDraft;
      const copy = JSON.parse(JSON.stringify(prevDraft));
      if (Array.isArray(copy.events[eventIdx].skills)) {
        copy.events[eventIdx].skills.splice(skillIdx, 1);
      }
      return copy;
    });
  }, []);

  if (!draft) {
    return (
      <div className="w-screen h-screen crt-screen crt-glow flex items-center justify-center">
        <CRTStyles />
        <div className="crt-panel p-8 rounded-lg flex flex-col items-center gap-4">
          <Loader className="animate-spin" size={32} />
          <p className="crt-text text-lg">Initializing Timeline Admin...</p>
          <p className="crt-text opacity-60 text-sm">{status}</p>
        </div>
      </div>
    );
  }

  const events = draft.events || [];
  const stats = draft.stats || [];
  const activeEventIndex = activeTab.startsWith("EVENT:") ? parseInt(activeTab.split(":")[1]) : null;
  const activeEvent = Number.isInteger(activeEventIndex) && events[activeEventIndex] ? events[activeEventIndex] : null;

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
                TIMELINE ADMIN TERMINAL
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
  className="w-64 crt-panel rounded-lg p-4 flex flex-col"
>
  {/* Navigation Section - Scrollable */}
  <div className="flex-1 overflow-hidden flex flex-col">
    <h3 className="text-sm crt-text mb-3 opacity-60">NAVIGATION</h3>
    <div className="flex-1 overflow-y-auto hide-scrollbar space-y-2">
      {["EVENTS", "STATS"].map(tabKey => (
        <motion.button
          key={tabKey}
          whileHover={{ x: 5 }}
          onClick={() => setActiveTab(tabKey)}
          className={`w-full text-left px-3 py-2 rounded transition-all ${
            activeTab === tabKey ? "crt-button crt-text" : "text-cyan-400/60 hover:text-cyan-400"
          }`}
        >
          {tabKey}
        </motion.button>
      ))}
      {events.map((event, idx) => (
        <motion.button
          key={`event-${idx}`}
          whileHover={{ x: 5 }}
          onClick={() => setActiveTab(`EVENT:${idx}`)}
          className={`w-full text-left px-3 py-2 rounded transition-all ${
            activeTab === `EVENT:${idx}` ? "crt-button crt-text" : "text-cyan-400/60 hover:text-cyan-400"
          }`}
        >
          {event.title || `Event ${idx + 1}`}
        </motion.button>
      ))}
    </div>
  </div>

  {/* Actions Section - Fixed at bottom */}
  <div className="mt-4 pt-4 border-t border-cyan-400/20">
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
                    {activeTab === "EVENTS" && (
                      <motion.div
                        key="events"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl crt-text">TIMELINE EVENTS</h2>
                          <button
                            onClick={addEvent}
                            className="crt-button px-4 py-2 rounded crt-text flex items-center gap-2"
                          >
                            <Plus size={16} /> ADD EVENT
                          </button>
                        </div>

                        <div className="space-y-4">
                          {events.length === 0 ? (
                            <div className="crt-panel p-4 rounded text-center">
                              <p className="crt-text opacity-60">No events found. Add your first timeline event!</p>
                            </div>
                          ) : (
                            events.map((event, idx) => (
                              <div key={`event-${idx}`} className="crt-panel p-4 rounded">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <Calendar className="text-cyan-400" size={18} />
                                    <span className="crt-text font-semibold">{event.year}</span>
                                    <span className="crt-text opacity-60">•</span>
                                    <span className="crt-text">{event.period}</span>
                                  </div>
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => moveEvent(idx, -1)}
                                      disabled={idx === 0}
                                      className="crt-button p-2 rounded"
                                    >
                                      <ArrowUp size={14} />
                                    </button>
                                    <button
                                      onClick={() => moveEvent(idx, 1)}
                                      disabled={idx === events.length - 1}
                                      className="crt-button p-2 rounded"
                                    >
                                      <ArrowDown size={14} />
                                    </button>
                                    <button
                                      onClick={() => removeEvent(idx)}
                                      className="crt-button p-2 rounded text-red-400"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                </div>
                                <h3 className="crt-text text-lg mb-2">{event.title}</h3>
                                <button 
                                  onClick={() => setActiveTab(`EVENT:${idx}`)} 
                                  className="crt-button px-3 py-1 rounded crt-text text-xs"
                                >
                                  EDIT DETAILS →
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "STATS" && (
                      <motion.div
                        key="stats"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl crt-text">STATISTICS</h2>
                          <button
                            onClick={addStat}
                            className="crt-button px-4 py-2 rounded crt-text flex items-center gap-2"
                          >
                            <Plus size={16} /> ADD STAT
                          </button>
                        </div>

                        <div className="space-y-3">
                          {stats.length === 0 ? (
                            <div className="crt-panel p-4 rounded text-center">
                              <p className="crt-text opacity-60">No statistics found. Add your first stat!</p>
                            </div>
                          ) : (
                            stats.map((stat, idx) => (
                              <div key={`stat-${idx}`} className="crt-panel p-3 rounded">
                                <div className="flex items-center gap-3 mb-2">
                                  <Target className="text-cyan-400 flex-shrink-0" size={16} />
                                  <input
                                    type="text"
                                    value={stat.label || ""}
                                    onChange={(e) => updateStatField(idx, "label", e.target.value)}
                                    className="crt-input px-3 py-1 rounded text-sm flex-1"
                                    placeholder="Stat Label"
                                    autoComplete="off"
                                  />
                                  <input
                                    type="text"
                                    value={stat.value || ""}
                                    onChange={(e) => updateStatField(idx, "value", e.target.value)}
                                    className="crt-input px-3 py-1 rounded text-sm w-20"
                                    placeholder="Value"
                                    autoComplete="off"
                                  />
                                  <select
                                    value={stat.icon || "Target"}
                                    onChange={(e) => updateStatField(idx, "icon", e.target.value)}
                                    className="crt-input px-2 py-1 rounded text-sm w-32"
                                  >
                                    {Object.keys(iconMap).map(iconName => (
                                      <option key={iconName} value={iconName}>{iconName}</option>
                                    ))}
                                  </select>
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => moveStat(idx, -1)}
                                      disabled={idx === 0}
                                      className="crt-button p-1 rounded"
                                    >
                                      <ArrowUp size={12} />
                                    </button>
                                    <button
                                      onClick={() => moveStat(idx, 1)}
                                      disabled={idx === stats.length - 1}
                                      className="crt-button p-1 rounded"
                                    >
                                      <ArrowDown size={12} />
                                    </button>
                                    <button
                                      onClick={() => removeStat(idx)}
                                      className="crt-button p-1 rounded text-red-400"
                                    >
                                      <X size={12} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}

                    {activeEvent && (
                      <motion.div
                        key={`event-${activeEventIndex}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl crt-text">EDIT: {activeEvent.title}</h2>
                          <button 
                            onClick={() => setActiveTab("EVENTS")} 
                            className="crt-button px-3 py-2 rounded crt-text"
                          >
                            ← BACK TO EVENTS
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm crt-text mb-2">Year</label>
                            <input
                              type="text"
                              value={activeEvent.year || ""}
                              onChange={(e) => updateEventField(activeEventIndex, "year", e.target.value)}
                              className="w-full crt-input px-3 py-2 rounded"
                              placeholder="2024"
                              autoComplete="off"
                            />
                          </div>
                          <div>
                            <label className="block text-sm crt-text mb-2">Period</label>
                            <input
                              type="text"
                              value={activeEvent.period || ""}
                              onChange={(e) => updateEventField(activeEventIndex, "period", e.target.value)}
                              className="w-full crt-input px-3 py-2 rounded"
                              placeholder="e.g., Started Learning"
                              autoComplete="off"
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm crt-text mb-2">Title</label>
                          <input
                            type="text"
                            value={activeEvent.title || ""}
                            onChange={(e) => updateEventField(activeEventIndex, "title", e.target.value)}
                            className="w-full crt-input px-3 py-2 rounded"
                            placeholder="Event Title"
                            autoComplete="off"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm crt-text mb-2">Icon</label>
                            <select
                              value={activeEvent.icon || "Award"}
                              onChange={(e) => updateEventField(activeEventIndex, "icon", e.target.value)}
                              className="w-full crt-input px-3 py-2 rounded"
                            >
                              {Object.keys(iconMap).map(iconName => (
                                <option key={iconName} value={iconName}>{iconName}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm crt-text mb-2">Color Gradient</label>
                            <input
                              type="text"
                              value={activeEvent.color || ""}
                              onChange={(e) => updateEventField(activeEventIndex, "color", e.target.value)}
                              className="w-full crt-input px-3 py-2 rounded"
                              placeholder="from-blue-400 to-indigo-500"
                              autoComplete="off"
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm crt-text mb-2">Description</label>
                          <textarea
                            value={activeEvent.description || ""}
                            onChange={(e) => updateEventField(activeEventIndex, "description", e.target.value)}
                            className="w-full crt-textarea px-3 py-2 rounded min-h-[100px]"
                            placeholder="Event description..."
                            autoComplete="off"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <label className="block text-sm crt-text">Achievements</label>
                              <span className="text-xs crt-text opacity-60">
                                {activeEvent.achievements?.length || 0} items
                              </span>
                            </div>
                            <div className="space-y-2 mb-3">
                              {(!activeEvent.achievements || activeEvent.achievements.length === 0) ? (
                                <div className="crt-panel p-3 rounded text-center">
                                  <p className="crt-text opacity-60 text-sm">No achievements added</p>
                                </div>
                              ) : (
                                activeEvent.achievements.map((achievement, aIdx) => (
                                  <div key={`achievement-${aIdx}`} className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0"></span>
                                    <input
                                      type="text"
                                      value={achievement}
                                      onChange={(e) => {
                                        const newAchievements = [...activeEvent.achievements];
                                        newAchievements[aIdx] = e.target.value;
                                        updateEventField(activeEventIndex, "achievements", newAchievements);
                                      }}
                                      className="crt-input px-3 py-1 rounded text-sm flex-1"
                                      placeholder="Achievement"
                                      autoComplete="off"
                                    />
                                    <button
                                      onClick={() => removeAchievement(activeEventIndex, aIdx)}
                                      className="crt-button p-1 rounded text-red-400 flex-shrink-0"
                                    >
                                      <X size={12} />
                                    </button>
                                  </div>
                                ))
                              )}
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newAchievement}
                                onChange={(e) => setNewAchievement(e.target.value)}
                                className="crt-input flex-1 px-3 py-2 rounded text-sm"
                                placeholder="Add new achievement"
                                autoComplete="off"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && newAchievement.trim()) {
                                    addAchievement(activeEventIndex);
                                  }
                                }}
                              />
                              <button
                                onClick={() => addAchievement(activeEventIndex)}
                                disabled={!newAchievement.trim()}
                                className="crt-button px-3 py-2 rounded crt-text flex items-center gap-2 flex-shrink-0"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <label className="block text-sm crt-text">Skills & Tools</label>
                              <span className="text-xs crt-text opacity-60">
                                {activeEvent.skills?.length || 0} items
                              </span>
                            </div>
                            <div className="space-y-2 mb-3">
                              {(!activeEvent.skills || activeEvent.skills.length === 0) ? (
                                <div className="crt-panel p-3 rounded text-center">
                                  <p className="crt-text opacity-60 text-sm">No skills added</p>
                                </div>
                              ) : (
                                activeEvent.skills.map((skill, sIdx) => (
                                  <div key={`skill-${sIdx}`} className="flex items-center gap-2">
                                    <span className="text-cyan-400 text-xs">🛠️</span>
                                    <input
                                      type="text"
                                      value={skill}
                                      onChange={(e) => {
                                        const newSkills = [...activeEvent.skills];
                                        newSkills[sIdx] = e.target.value;
                                        updateEventField(activeEventIndex, "skills", newSkills);
                                      }}
                                      className="crt-input px-3 py-1 rounded text-sm flex-1"
                                      placeholder="Skill"
                                      autoComplete="off"
                                    />
                                    <button
                                      onClick={() => removeSkill(activeEventIndex, sIdx)}
                                      className="crt-button p-1 rounded text-red-400 flex-shrink-0"
                                    >
                                      <X size={12} />
                                    </button>
                                  </div>
                                ))
                              )}
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                className="crt-input flex-1 px-3 py-2 rounded text-sm"
                                placeholder="Add new skill"
                                autoComplete="off"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && newSkill.trim()) {
                                    addSkill(activeEventIndex);
                                  }
                                }}
                              />
                              <button
                                onClick={() => addSkill(activeEventIndex)}
                                disabled={!newSkill.trim()}
                                className="crt-button px-3 py-2 rounded crt-text flex items-center gap-2 flex-shrink-0"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
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
                <h2 className="text-2xl mb-6">TIMELINE PREVIEW</h2>
                
                {/* Stats Preview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {stats.map((stat, idx) => {
                    const IconComponent = iconMap[stat.icon];
                    return (
                      <div key={`preview-stat-${idx}`} className="crt-panel p-4 rounded text-center">
                        {IconComponent && (
                          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 mx-auto mb-2">
                            <IconComponent size={20} />
                          </div>
                        )}
                        <div className="text-2xl font-bold text-cyan-400 mb-1">{stat.value}+</div>
                        <div className="text-sm opacity-80">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Events Preview */}
                <div className="space-y-6">
                  {events.length === 0 ? (
                    <div className="crt-panel p-6 rounded text-center">
                      <p className="crt-text opacity-60">No timeline events configured</p>
                    </div>
                  ) : (
                    events.map((event, idx) => {
                      const IconComponent = iconMap[event.icon];
                      return (
                        <div key={`preview-event-${idx}`} className="crt-panel p-6 rounded">
                          <div className="flex items-start gap-4 mb-4">
                            {IconComponent && (
                              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
                                <IconComponent size={24} />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-lg font-bold text-cyan-400">{event.year}</span>
                                <span className="text-cyan-300/60">•</span>
                                <span className="text-sm text-cyan-300/80 uppercase tracking-wide">{event.period}</span>
                              </div>
                              <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                              <p className="text-cyan-300/80 leading-relaxed">{event.description}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-sm font-semibold mb-2 text-cyan-400">Achievements</h4>
                              <ul className="space-y-1">
                                {(!event.achievements || event.achievements.length === 0) ? (
                                  <li className="text-sm text-cyan-300/60">No achievements listed</li>
                                ) : (
                                  event.achievements.map((achievement, aIdx) => (
                                    <li key={`preview-achievement-${aIdx}`} className="text-sm flex items-start gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0"></span>
                                      <span>{achievement}</span>
                                    </li>
                                  ))
                                )}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold mb-2 text-cyan-400">Skills & Tools</h4>
                              <div className="flex flex-wrap gap-2">
                                {(!event.skills || event.skills.length === 0) ? (
                                  <span className="text-sm text-cyan-300/60">No skills listed</span>
                                ) : (
                                  event.skills.map((skill, sIdx) => (
                                    <span key={`preview-skill-${sIdx}`} className="px-2 py-1 bg-cyan-500/20 rounded text-xs">
                                      {skill}
                                    </span>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
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
                  <h3 className="text-xl crt-text mb-2">CONFIRM TIMELINE SAVE</h3>
                  <p className="text-sm crt-text opacity-60">
                    {isOnline
                      ? "Enter admin code to save your timeline changes to Firebase."
                      : "🔌 Offline: Cannot save to Firebase without internet connection."}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm crt-text opacity-80 mb-2">
                  You're about to save changes to the timeline configuration.
                </p>
                <div className="crt-panel p-3 rounded">
                  <div className="text-xs crt-text opacity-60 mb-1">Changes include:</div>
                  <div className="text-sm crt-text">
                    • {events.length} timeline events
                    <br />
                    • {stats.length} statistics
                    <br />
                    • {events.reduce((acc, event) => acc + (event.achievements?.length || 0), 0)} total achievements
                    <br />
                    • {events.reduce((acc, event) => acc + (event.skills?.length || 0), 0)} total skills
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
                    "CONFIRM & SAVE TIMELINE"
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