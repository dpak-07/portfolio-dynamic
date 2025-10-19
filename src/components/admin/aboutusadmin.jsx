import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, Save, RotateCcw, Download, Upload,
  ChevronDown, ChevronUp, Plus, X, ArrowUp, ArrowDown,
  GraduationCap, Brain, Laptop, Cloud, Trophy, Compass
} from "lucide-react";

const STORAGE_DRAFT_KEY = "about_config_draft";
const STORAGE_SAVED_KEY = "about_config_saved";
const ADMIN_CODE = "69";

// CRT Screen effect styles
const CRTStyles = () => (
  <style>{`
    @keyframes flicker { 
      0%, 100% { opacity: 0.95; } 
      50% { opacity: 1; } 
    }
    @keyframes scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100%); }
    }
    @keyframes textGlow {
      0%, 100% { text-shadow: 0 0 10px rgba(0,229,255,0.8), 0 0 20px rgba(0,229,255,0.4); }
      50% { text-shadow: 0 0 15px rgba(0,229,255,1), 0 0 30px rgba(0,229,255,0.6); }
    }
    .crt-screen {
      position: relative;
      background: radial-gradient(ellipse at center, #0d1f2d 0%, #050a0f 100%);
      animation: flicker 0.15s infinite;
    }
    .crt-screen::before {
      content: '';
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        0deg,
        rgba(0, 255, 255, 0.03) 0px,
        transparent 1px,
        transparent 2px,
        rgba(0, 255, 255, 0.03) 3px
      );
      pointer-events: none;
      z-index: 50;
    }
    .crt-screen::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to bottom,
        transparent 50%,
        rgba(0, 255, 255, 0.02) 50%
      );
      background-size: 100% 4px;
      pointer-events: none;
      z-index: 51;
      animation: scanline 8s linear infinite;
    }
    .crt-glow {
      box-shadow: 
        inset 0 0 100px rgba(0,229,255,0.1),
        inset 0 0 50px rgba(0,229,255,0.05),
        0 0 50px rgba(0,229,255,0.2);
    }
    .crt-text {
      color: #00e5ff;
      text-shadow: 0 0 10px rgba(0,229,255,0.8), 0 0 20px rgba(0,229,255,0.4);
      font-family: 'Courier New', monospace;
    }
    .crt-button {
      background: linear-gradient(135deg, rgba(0,229,255,0.2), rgba(0,229,255,0.1));
      border: 2px solid rgba(0,229,255,0.4);
      box-shadow: 0 0 20px rgba(0,229,255,0.3), inset 0 0 10px rgba(0,229,255,0.1);
      transition: all 0.3s ease;
    }
    .crt-button:hover {
      background: linear-gradient(135deg, rgba(0,229,255,0.3), rgba(0,229,255,0.2));
      border-color: rgba(0,229,255,0.6);
      box-shadow: 0 0 30px rgba(0,229,255,0.5), inset 0 0 15px rgba(0,229,255,0.2);
      transform: translateY(-2px);
    }
    .crt-button:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
    .crt-input {
      background: rgba(0,0,0,0.6);
      border: 2px solid rgba(0,229,255,0.3);
      color: #00e5ff;
      box-shadow: inset 0 0 20px rgba(0,229,255,0.1);
    }
    .crt-input:focus {
      outline: none;
      border-color: rgba(0,229,255,0.6);
      box-shadow: 0 0 20px rgba(0,229,255,0.3), inset 0 0 20px rgba(0,229,255,0.2);
    }
    .crt-panel {
      background: linear-gradient(135deg, rgba(0,20,30,0.95), rgba(0,10,20,0.98));
      border: 2px solid rgba(0,229,255,0.3);
      box-shadow: 0 0 30px rgba(0,229,255,0.2), inset 0 0 30px rgba(0,0,0,0.5);
    }
    .crt-header {
      animation: textGlow 2s infinite;
    }
    .terminal-cursor::after {
      content: '▋';
      animation: blink 1s step-end infinite;
    }
    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }
    .hide-scrollbar::-webkit-scrollbar { width: 8px; }
    .hide-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); }
    .hide-scrollbar::-webkit-scrollbar-thumb { 
      background: rgba(0,229,255,0.3); 
      border-radius: 4px;
    }
    .hide-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,229,255,0.5); }
  `}</style>
);

const iconMap = {
  graduation: GraduationCap,
  brain: Brain,
  laptop: Laptop,
  cloud: Cloud,
  trophy: Trophy,
  compass: Compass,
};

// Diff helpers
function computeChanges(oldConfig = {}, newConfig = {}) {
  const changes = [];
  function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
  
  // Basic config
  if ((oldConfig.image?.url || "") !== (newConfig.image?.url || "")) changes.push("image.url");
  if ((oldConfig.initialMode || "") !== (newConfig.initialMode || "")) changes.push("initialMode");
  if ((oldConfig.resumeTarget || "") !== (newConfig.resumeTarget || "")) changes.push("resumeTarget");
  
  // Bio
  if ((oldConfig.bio?.short || "") !== (newConfig.bio?.short || "")) changes.push("bio.short");
  if (!same(oldConfig.bio?.badges || [], newConfig.bio?.badges || [])) changes.push("bio.badges");
  if ((oldConfig.bio?.expanded?.recent || "") !== (newConfig.bio?.expanded?.recent || "")) changes.push("bio.expanded.recent");
  if ((oldConfig.bio?.expanded?.values || "") !== (newConfig.bio?.expanded?.values || "")) changes.push("bio.expanded.values");
  
  // Arrays
  if (!same(oldConfig.cards || [], newConfig.cards || [])) changes.push("cards");
  if (!same(oldConfig.counters || [], newConfig.counters || [])) changes.push("counters");
  if (!same(oldConfig.holoSections || [], newConfig.holoSections || [])) changes.push("holoSections");
  
  return [...new Set(changes)];
}

function getValueByPath(obj = {}, path = "") {
  if (!path) return undefined;
  const parts = path.split(".");
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

function prettyValue(v) {
  if (v == null || v === "") return "—";
  if (Array.isArray(v)) return v.join(" · ");
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

export default function CRTAdminPanel() {
  const [draft, setDraft] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [status, setStatus] = useState("System Ready");
  const [previewMode, setPreviewMode] = useState(false);
  
  // Save confirmation states
  const [changesPopupOpen, setChangesPopupOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState([]);
  const [secretInput, setSecretInput] = useState("");
  
  // Committed snapshot (last confirmed save)
  const committedRef = useRef(null);

  const defaultConfig = {
    image: { 
      url: "https://1drv.ms/i/c/ac01abdcf0387f53/IQTDfhsFAQDOQ5Zeh9Df4-vAbMANaw6yEm8EdW4q4NpN4w?width=1280&height=1280", 
      iframeFallbackUrl: null 
    },
    initialMode: "holo",
    cards: [
      { id: "edu", title: "Education", icon: "graduation", short: "B.Tech — AI & Data Science", long: "Velammal Engineering College" },
      { id: "ai", title: "AI & ML", icon: "brain", short: "Computer vision, NLP", long: "Model deployment experience" },
    ],
    counters: [
      { id: "models", label: "ML Models Built", value: 12 },
      { id: "projects", label: "Projects Completed", value: 25 }
    ],
    bio: {
      short: "Pre-final year AI & Data Science student building practical ML systems.",
      badges: ["Production ML", "Full-stack", "MLOps"],
      expanded: {
        strengths: ["End-to-end model lifecycle"],
        recent: "Built civic issue reporting prototype",
        values: "Focus on measurable public impact",
      },
    },
    holoSections: [
      { type: "bio" },
      { type: "interests", content: "Computer Vision, NLP, MLOps" }
    ],
    resumeTarget: "resume",
  };

  useEffect(() => {
    const session = sessionStorage.getItem(STORAGE_DRAFT_KEY);
    if (session) {
      try {
        const parsed = JSON.parse(session);
        setDraft(parsed);
        committedRef.current = JSON.parse(JSON.stringify(parsed));
        return;
      } catch (e) {}
    }
    const saved = localStorage.getItem(STORAGE_SAVED_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setDraft(parsed);
        committedRef.current = JSON.parse(JSON.stringify(parsed));
        return;
      } catch (e) {}
    }
    setDraft(defaultConfig);
    committedRef.current = JSON.parse(JSON.stringify(defaultConfig));
  }, []);

  useEffect(() => {
    if (!draft) return;
    sessionStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(draft));
  }, [draft]);

  // Ctrl/Cmd+S -> open save-confirm popup
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        initiateSaveConfirmation();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [draft]);

  const updateNested = (path, value) => {
    if (!draft) return;
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
  };

  const pushArray = (path, item) => {
    if (!draft) return;
    const parts = path.split('.');
    const copy = JSON.parse(JSON.stringify(draft));
    let cur = copy;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!cur[parts[i]]) cur[parts[i]] = {};
      cur = cur[parts[i]];
    }
    if (!Array.isArray(cur[parts[parts.length - 1]])) {
      cur[parts[parts.length - 1]] = [];
    }
    cur[parts[parts.length - 1]].push(item);
    setDraft(copy);
  };

  const removeArrayAt = (path, idx) => {
    const parts = path.split('.');
    const copy = JSON.parse(JSON.stringify(draft));
    let cur = copy;
    for (let i = 0; i < parts.length - 1; i++) {
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]].splice(idx, 1);
    setDraft(copy);
  };

  const moveArrayItem = (path, idx, direction) => {
    const parts = path.split('.');
    const copy = JSON.parse(JSON.stringify(draft));
    let cur = copy;
    for (let i = 0; i < parts.length - 1; i++) {
      cur = cur[parts[i]];
    }
    const arr = cur[parts[parts.length - 1]];
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= arr.length) return;
    [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
    setDraft(copy);
  };

  // Save confirmation flow
  const initiateSaveConfirmation = () => {
    const prev = committedRef.current || defaultConfig;
    const changed = computeChanges(prev, draft);
    if (changed.length === 0) {
      setStatus("No changes detected");
      return;
    }
    setPendingChanges(changed);
    setSecretInput("");
    setChangesPopupOpen(true);
  };

  const confirmSaveWithCode = () => {
    if (secretInput.trim() !== ADMIN_CODE) {
      setStatus("✗ ACCESS DENIED");
      return;
    }
    
    try {
      localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(draft));
      sessionStorage.removeItem(STORAGE_DRAFT_KEY);
      committedRef.current = JSON.parse(JSON.stringify(draft));
      setChangesPopupOpen(false);
      setStatus("✓ SAVED SUCCESSFULLY");
    } catch {
      setStatus("Save failed");
    }
  };

  const manualSaveDirect = () => {
    try {
      localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(draft));
      sessionStorage.removeItem(STORAGE_DRAFT_KEY);
      committedRef.current = JSON.parse(JSON.stringify(draft));
      setStatus("✓ SAVED SUCCESSFULLY");
    } catch {
      setStatus("Save failed");
    }
  };

  const resetToDefault = () => {
    if (window.confirm("Reset all changes to default?")) {
      setDraft(defaultConfig);
      setStatus("Reset to default");
    }
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "about_config.json";
    a.click();
    URL.revokeObjectURL(url);
    setStatus("Exported configuration");
  };

  const importJson = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const imported = JSON.parse(evt.target.result);
        setDraft(imported);
        setStatus("Imported successfully");
      } catch (err) {
        setStatus("Import failed: Invalid JSON");
      }
    };
    reader.readAsText(file);
  };

  if (!draft) return null;

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
              <h1 className="text-2xl font-bold crt-text crt-header">
                ABOUT.US ADMIN TERMINAL
              </h1>
              <div className="text-xs crt-text opacity-60">v2.0.1</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm crt-text terminal-cursor">{status}</div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPreviewMode(!previewMode)}
                className="crt-button px-4 py-2 rounded flex items-center gap-2 crt-text"
              >
                <Eye size={16} />
                {previewMode ? "EDIT" : "PREVIEW"}
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
                    {["basic", "cards", "counters", "bio", "advanced"].map(tab => (
                      <motion.button
                        key={tab}
                        whileHover={{ x: 5 }}
                        onClick={() => setActiveTab(tab)}
                        className={`w-full text-left px-3 py-2 rounded transition-all ${
                          activeTab === tab 
                            ? "crt-button crt-text" 
                            : "text-cyan-400/60 hover:text-cyan-400"
                        }`}
                      >
                        {tab.toUpperCase()}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="flex-1" />

                <div>
                  <h3 className="text-sm crt-text mb-3 opacity-60">ACTIONS</h3>
                  <div className="space-y-2">
                    <button onClick={initiateSaveConfirmation} className="w-full crt-button px-3 py-2 rounded crt-text flex items-center gap-2">
                      <Save size={16} /> SAVE (CONFIRM)
                    </button>
                    <button onClick={manualSaveDirect} className="w-full crt-button px-3 py-2 rounded crt-text flex items-center gap-2">
                      <Save size={16} /> QUICK SAVE
                    </button>
                    <button onClick={resetToDefault} className="w-full crt-button px-3 py-2 rounded crt-text flex items-center gap-2">
                      <RotateCcw size={16} /> RESET
                    </button>
                    <button onClick={exportJson} className="w-full crt-button px-3 py-2 rounded crt-text flex items-center gap-2">
                      <Download size={16} /> EXPORT
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
                    {/* ... (rest of your editor tabs remain exactly the same) */}
                    {activeTab === "basic" && (
                      <motion.div
                        key="basic"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <h2 className="text-xl crt-text mb-4">BASIC CONFIGURATION</h2>
                        
                        <div>
                          <label className="block text-sm crt-text mb-2 opacity-60">IMAGE URL</label>
                          <input
                            type="text"
                            value={draft.image?.url || ""}
                            onChange={(e) => updateNested('image.url', e.target.value)}
                            className="w-full crt-input px-4 py-2 rounded"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm crt-text mb-2 opacity-60">INITIAL MODE</label>
                            <select
                              value={draft.initialMode || "holo"}
                              onChange={(e) => updateNested('initialMode', e.target.value)}
                              className="w-full crt-input px-4 py-2 rounded"
                            >
                              <option value="holo">Holo</option>
                              <option value="mosaic">Mosaic</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm crt-text mb-2 opacity-60">RESUME TARGET</label>
                            <input
                              type="text"
                              value={draft.resumeTarget || ""}
                              onChange={(e) => updateNested('resumeTarget', e.target.value)}
                              className="w-full crt-input px-4 py-2 rounded"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm crt-text mb-2 opacity-60">SHORT BIO</label>
                          <textarea
                            value={draft.bio?.short || ""}
                            onChange={(e) => updateNested('bio.short', e.target.value)}
                            className="w-full crt-input px-4 py-2 rounded h-24"
                          />
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "cards" && (
                      <motion.div
                        key="cards"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl crt-text">CARDS EDITOR</h2>
                          <button
                            onClick={() => pushArray('cards', { 
                              id: `card_${Date.now()}`, 
                              title: 'New Card', 
                              icon: 'laptop', 
                              short: 'Short description', 
                              long: 'Long description' 
                            })}
                            className="crt-button px-4 py-2 rounded crt-text flex items-center gap-2"
                          >
                            <Plus size={16} /> ADD CARD
                          </button>
                        </div>

                        <div className="space-y-4">
                          {(draft.cards || []).map((card, idx) => {
                            const Icon = iconMap[card.icon] || Laptop;
                            return (
                              <div key={card.id || idx} className="crt-panel p-4 rounded">
                                <div className="flex items-start gap-3 mb-3">
                                  <Icon className="text-cyan-400 mt-1" size={20} />
                                  <div className="flex-1 grid grid-cols-2 gap-3">
                                    <input
                                      type="text"
                                      value={card.title || ""}
                                      onChange={(e) => {
                                        const copy = JSON.parse(JSON.stringify(draft));
                                        copy.cards[idx].title = e.target.value;
                                        setDraft(copy);
                                      }}
                                      className="crt-input px-3 py-1 rounded text-sm"
                                      placeholder="Title"
                                    />
                                    <select
                                      value={card.icon || "laptop"}
                                      onChange={(e) => {
                                        const copy = JSON.parse(JSON.stringify(draft));
                                        copy.cards[idx].icon = e.target.value;
                                        setDraft(copy);
                                      }}
                                      className="crt-input px-3 py-1 rounded text-sm"
                                    >
                                      {Object.keys(iconMap).map(key => (
                                        <option key={key} value={key}>{key}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => moveArrayItem('cards', idx, -1)}
                                      className="crt-button p-2 rounded"
                                      disabled={idx === 0}
                                    >
                                      <ArrowUp size={16} />
                                    </button>
                                    <button
                                      onClick={() => moveArrayItem('cards', idx, 1)}
                                      className="crt-button p-2 rounded"
                                      disabled={idx === draft.cards.length - 1}
                                    >
                                      <ArrowDown size={16} />
                                    </button>
                                    <button
                                      onClick={() => removeArrayAt('cards', idx)}
                                      className="crt-button p-2 rounded text-red-400"
                                    >
                                      <X size={16} />
                                    </button>
                                  </div>
                                </div>
                                <input
                                  type="text"
                                  value={card.short || ""}
                                  onChange={(e) => {
                                    const copy = JSON.parse(JSON.stringify(draft));
                                    copy.cards[idx].short = e.target.value;
                                    setDraft(copy);
                                  }}
                                  className="w-full crt-input px-3 py-1 rounded text-sm mb-2"
                                  placeholder="Short description"
                                />
                                <textarea
                                  value={card.long || ""}
                                  onChange={(e) => {
                                    const copy = JSON.parse(JSON.stringify(draft));
                                    copy.cards[idx].long = e.target.value;
                                    setDraft(copy);
                                  }}
                                  className="w-full crt-input px-3 py-1 rounded text-sm h-20"
                                  placeholder="Long description"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "counters" && (
                      <motion.div
                        key="counters"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl crt-text">COUNTERS EDITOR</h2>
                          <button
                            onClick={() => pushArray('counters', { 
                              id: `counter_${Date.now()}`, 
                              label: 'New Counter', 
                              value: 0 
                            })}
                            className="crt-button px-4 py-2 rounded crt-text flex items-center gap-2"
                          >
                            <Plus size={16} /> ADD COUNTER
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          {(draft.counters || []).map((counter, idx) => (
                            <div key={counter.id || idx} className="crt-panel p-4 rounded flex items-center gap-3">
                              <input
                                type="text"
                                value={counter.label || ""}
                                onChange={(e) => {
                                  const copy = JSON.parse(JSON.stringify(draft));
                                  copy.counters[idx].label = e.target.value;
                                  setDraft(copy);
                                }}
                                className="flex-1 crt-input px-3 py-2 rounded"
                                placeholder="Label"
                              />
                              <input
                                type="number"
                                value={counter.value || 0}
                                onChange={(e) => {
                                  const copy = JSON.parse(JSON.stringify(draft));
                                  copy.counters[idx].value = Number(e.target.value);
                                  setDraft(copy);
                                }}
                                className="w-24 crt-input px-3 py-2 rounded text-center"
                              />
                              <div className="flex gap-1">
                                <button
                                  onClick={() => moveArrayItem('counters', idx, -1)}
                                  className="crt-button p-2 rounded"
                                  disabled={idx === 0}
                                >
                                  <ArrowUp size={16} />
                                </button>
                                <button
                                  onClick={() => moveArrayItem('counters', idx, 1)}
                                  className="crt-button p-2 rounded"
                                  disabled={idx === draft.counters.length - 1}
                                >
                                  <ArrowDown size={16} />
                                </button>
                                <button
                                  onClick={() => removeArrayAt('counters', idx)}
                                  className="crt-button p-2 rounded text-red-400"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "bio" && (
                      <motion.div
                        key="bio"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <h2 className="text-xl crt-text mb-4">BIO CONFIGURATION</h2>
                        
                        <div>
                          <label className="block text-sm crt-text mb-2 opacity-60">BADGES</label>
                          <div className="flex gap-2 mb-3">
                            <input
                              id="badge-input"
                              type="text"
                              className="flex-1 crt-input px-3 py-2 rounded"
                              placeholder="Add badge (press Enter)"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.target.value.trim()) {
                                  pushArray('bio.badges', e.target.value.trim());
                                  e.target.value = '';
                                }
                              }}
                            />
                            <button
                              onClick={() => {
                                const input = document.getElementById('badge-input');
                                if (input && input.value.trim()) {
                                  pushArray('bio.badges', input.value.trim());
                                  input.value = '';
                                }
                              }}
                              className="crt-button px-4 py-2 rounded crt-text"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {(draft.bio?.badges || []).map((badge, idx) => (
                              <div key={idx} className="crt-panel px-3 py-1 rounded flex items-center gap-2">
                                <span className="crt-text text-sm">{badge}</span>
                                <button
                                  onClick={() => removeArrayAt('bio.badges', idx)}
                                  className="text-red-400 text-xs"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm crt-text mb-2 opacity-60">EXPANDED BIO - RECENT</label>
                          <textarea
                            value={draft.bio?.expanded?.recent || ""}
                            onChange={(e) => updateNested('bio.expanded.recent', e.target.value)}
                            className="w-full crt-input px-4 py-2 rounded h-24"
                          />
                        </div>

                        <div>
                          <label className="block text-sm crt-text mb-2 opacity-60">EXPANDED BIO - VALUES</label>
                          <textarea
                            value={draft.bio?.expanded?.values || ""}
                            onChange={(e) => updateNested('bio.expanded.values', e.target.value)}
                            className="w-full crt-input px-4 py-2 rounded h-24"
                          />
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "advanced" && (
                      <motion.div
                        key="advanced"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <h2 className="text-xl crt-text mb-4">ADVANCED SETTINGS</h2>
                        
                        <div>
                          <label className="block text-sm crt-text mb-2 opacity-60">RAW JSON EDITOR</label>
                          <textarea
                            value={JSON.stringify(draft, null, 2)}
                            onChange={(e) => {
                              try {
                                const parsed = JSON.parse(e.target.value);
                                setDraft(parsed);
                                setStatus("JSON updated");
                              } catch (err) {
                                setStatus("Invalid JSON");
                              }
                            }}
                            className="w-full crt-input px-4 py-2 rounded font-mono text-xs h-96"
                          />
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
                <h2 className="text-2xl mb-4">PREVIEW MODE</h2>
                <div className="space-y-4">
                  <div className="crt-panel p-4 rounded">
                    <h3 className="text-lg mb-2">Image URL</h3>
                    <p className="text-sm opacity-80 break-all">{draft.image?.url}</p>
                  </div>
                  
                  <div className="crt-panel p-4 rounded">
                    <h3 className="text-lg mb-2">Bio</h3>
                    <p className="text-sm opacity-80">{draft.bio?.short}</p>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {(draft.bio?.badges || []).map((badge, i) => (
                        <span key={i} className="px-3 py-1 bg-cyan-500/20 rounded text-xs">{badge}</span>
                      ))}
                    </div>
                  </div>

                  <div className="crt-panel p-4 rounded">
                    <h3 className="text-lg mb-2">Cards ({draft.cards?.length || 0})</h3>
                    <div className="space-y-2">
                      {(draft.cards || []).map((card, i) => (
                        <div key={i} className="text-sm opacity-80">
                          {i + 1}. {card.title} - {card.short}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="crt-panel p-4 rounded">
                    <h3 className="text-lg mb-2">Counters ({draft.counters?.length || 0})</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {(draft.counters || []).map((counter, i) => (
                        <div key={i} className="text-sm opacity-80">
                          {counter.label}: <span className="text-cyan-300">{counter.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
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
                  <h3 className="text-xl crt-text crt-header mb-2">CONFIRM CHANGES</h3>
                  <p className="text-sm crt-text opacity-60">
                    These sections have been modified. Enter admin code to save.
                  </p>
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto mb-4 space-y-3 hide-scrollbar">
                {pendingChanges.length === 0 ? (
                  <div className="text-sm crt-text opacity-60 text-center py-4">No changes detected</div>
                ) : (
                  pendingChanges.map(path => {
                    const oldVal = prettyValue(getValueByPath(committedRef.current, path));
                    const newVal = prettyValue(getValueByPath(draft, path));
                    return (
                      <div key={path} className="crt-panel p-3 rounded">
                        <div className="text-xs crt-text opacity-60 mb-1">{path}</div>
                        <div className="text-sm crt-text">
                          <span className="opacity-60">Old:</span> <span className="opacity-80">{oldVal}</span>
                        </div>
                        <div className="text-sm crt-text mt-1">
                          <span className="opacity-60">New:</span> <span className="text-cyan-300">{newVal}</span>
                        </div>
                      </div>
                    );
                  })
                )}
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
                  />
                </div>
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
                  className="crt-button px-4 py-2 rounded crt-text bg-cyan-500/20 border-cyan-400"
                >
                  CONFIRM & SAVE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}