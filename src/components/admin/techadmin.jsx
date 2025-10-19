import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, Save, RotateCcw, Download, Upload, Plus, X,
  ArrowUp, ArrowDown, Palette
} from "lucide-react";

const STORAGE_DRAFT_KEY = "techstack_config_draft";
const STORAGE_SAVED_KEY = "techstack_config_saved";
const ADMIN_CODE = "69";

const CRTStyles = () => (
  <style>{`
    @keyframes flicker {0%,100%{opacity:.95;}50%{opacity:1;}}
    @keyframes scanline {0%{transform:translateY(-100%);}100%{transform:translateY(100%);}}
    .crt-screen{position:relative;background:radial-gradient(ellipse at center,#0d1f2d 0%,#050a0f 100%);animation:flicker .15s infinite;}
    .crt-screen::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,255,255,.03)0px,transparent 1px,transparent 2px,rgba(0,255,255,.03)3px);pointer-events:none;z-index:50;}
    .crt-screen::after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,transparent 50%,rgba(0,255,255,.02)50%);background-size:100% 4px;pointer-events:none;z-index:51;animation:scanline 8s linear infinite;}
    .crt-glow{box-shadow:inset 0 0 100px rgba(0,229,255,.1),inset 0 0 50px rgba(0,229,255,.05),0 0 50px rgba(0,229,255,.2);}
    .crt-text{color:#00e5ff;text-shadow:0 0 10px rgba(0,229,255,.8),0 0 20px rgba(0,229,255,.4);font-family:'Courier New',monospace;}
    .crt-button{background:linear-gradient(135deg,rgba(0,229,255,.2),rgba(0,229,255,.1));border:2px solid rgba(0,229,255,.4);box-shadow:0 0 20px rgba(0,229,255,.3),inset 0 0 10px rgba(0,229,255,.1);transition:all .3s ease;}
    .crt-button:hover{background:linear-gradient(135deg,rgba(0,229,255,.3),rgba(0,229,255,.2));border-color:rgba(0,229,255,.6);box-shadow:0 0 30px rgba(0,229,255,.5),inset 0 0 15px rgba(0,229,255,.2);transform:translateY(-2px);}
    .crt-button:disabled{opacity:.35;cursor:not-allowed;}
    .crt-input{background:rgba(0,0,0,.6);border:2px solid rgba(0,229,255,.3);color:#00e5ff;box-shadow:inset 0 0 20px rgba(0,229,255,.1);}
    .crt-input:focus{outline:none;border-color:rgba(0,229,255,.6);box-shadow:0 0 20px rgba(0,229,255,.3),inset 0 0 20px rgba(0,229,255,.2);}
    .crt-panel{background:linear-gradient(135deg,rgba(0,20,30,.95),rgba(0,10,20,.98));border:2px solid rgba(0,229,255,.3);box-shadow:0 0 30px rgba(0,229,255,.2),inset 0 0 30px rgba(0,0,0,.5);}
    .hide-scrollbar::-webkit-scrollbar{width:8px;}
    .hide-scrollbar::-webkit-scrollbar-thumb{background:rgba(0,229,255,.3);border-radius:4px;}
    .hide-scrollbar::-webkit-scrollbar-thumb:hover{background:rgba(0,229,255,.5);}
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
  const [status, setStatus] = useState("System Ready");
  const [activeTab, setActiveTab] = useState("CATEGORIES");
  const [previewMode, setPreviewMode] = useState(false);
  const [changesPopupOpen, setChangesPopupOpen] = useState(false);
  const [secretInput, setSecretInput] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_SAVED_KEY);
    const session = sessionStorage.getItem(STORAGE_DRAFT_KEY);
    if (session) return setDraft(JSON.parse(session));
    if (saved) return setDraft(JSON.parse(saved));
    setDraft(defaultConfig);
  }, []);

  useEffect(() => {
    if (draft) sessionStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(draft));
  }, [draft]);

  const sidebarTabs = useMemo(() => {
    if (!draft) return ["CATEGORIES"];
    return ["CATEGORIES", ...draft.categories.map((c, i) => `CAT:${i}`)];
  }, [draft]);

  const moveCategory = (idx, dir) => {
    const copy = structuredClone(draft);
    const arr = copy.categories;
    const newIndex = idx + dir;
    if (newIndex < 0 || newIndex >= arr.length) return;
    [arr[idx], arr[newIndex]] = [arr[newIndex], arr[idx]];
    setDraft(copy);
  };

  const moveTech = (catIdx, tIdx, dir) => {
    const copy = structuredClone(draft);
    const arr = copy.categories[catIdx].tech;
    const newIndex = tIdx + dir;
    if (newIndex < 0 || newIndex >= arr.length) return;
    [arr[tIdx], arr[newIndex]] = [arr[newIndex], arr[tIdx]];
    setDraft(copy);
  };

  const confirmSave = () => {
    if (secretInput.trim() !== ADMIN_CODE) return setStatus("✗ ACCESS DENIED");
    localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(draft));
    sessionStorage.removeItem(STORAGE_DRAFT_KEY);
    setChangesPopupOpen(false);
    setStatus("✓ SAVED SUCCESSFULLY");
  };

  const quickSave = () => {
    localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(draft));
    sessionStorage.removeItem(STORAGE_DRAFT_KEY);
    setStatus("✓ QUICK SAVED");
  };

  const resetDefault = () => {
    if (window.confirm("Reset to default config?")) {
      setDraft(defaultConfig);
      setActiveTab("CATEGORIES");
      setStatus("Reset done");
    }
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "techstack_config.json";
    a.click();
    URL.revokeObjectURL(url);
    setStatus("Exported config");
  };

  const importJson = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        setDraft(parsed);
        setActiveTab("CATEGORIES");
        setStatus("Imported successfully");
      } catch {
        setStatus("Invalid JSON");
      }
    };
    reader.readAsText(file);
  };

  const addCategory = () => {
    const copy = structuredClone(draft);
    copy.categories.push({ title: "New Category", color: "from-cyan-400 to-blue-400", tech: [] });
    setDraft(copy);
  };

  const removeCategory = (idx) => {
    const copy = structuredClone(draft);
    copy.categories.splice(idx, 1);
    setDraft(copy);
  };

  if (!draft) return null;
  const activeCatIndex = activeTab.startsWith("CAT:") ? parseInt(activeTab.split(":")[1]) : null;
  const activeCat = Number.isInteger(activeCatIndex) ? draft.categories[activeCatIndex] : null;

  return (
    <div className="w-screen h-screen crt-screen crt-glow flex flex-col">
      <CRTStyles />

      {/* HEADER */}
      <motion.div className="crt-panel p-4 m-4 rounded-lg flex justify-between items-center shrink-0">
        <h1 className="text-2xl font-bold crt-text">TECH STACK ADMIN TERMINAL</h1>
        <div className="flex items-center gap-3">
          <div className="text-sm crt-text">{status}</div>
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
              <button onClick={() => setChangesPopupOpen(true)} className="w-full crt-button px-3 py-2 rounded crt-text flex items-center gap-2"><Save size={16}/> SAVE</button>
              <button onClick={quickSave} className="w-full crt-button px-3 py-2 rounded crt-text flex items-center gap-2"><Save size={16}/> QUICK SAVE</button>
              <button onClick={resetDefault} className="w-full crt-button px-3 py-2 rounded crt-text flex items-center gap-2"><RotateCcw size={16}/> RESET</button>
              <button onClick={exportJson} className="w-full crt-button px-3 py-2 rounded crt-text flex items-center gap-2"><Download size={16}/> EXPORT</button>
              <label className="w-full crt-button px-3 py-2 rounded crt-text flex items-center gap-2 cursor-pointer">
                <Upload size={16}/> IMPORT
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
                  <button onClick={addCategory} className="crt-button px-4 py-2 rounded crt-text flex items-center gap-2">
                    <Plus size={16}/> ADD CATEGORY
                  </button>
                </div>
                <div className="space-y-4">
                  {draft.categories.map((cat, idx) => (
                    <div key={idx} className="crt-panel p-4 rounded">
                      <div className="flex items-center gap-3 mb-3">
                        <Palette className="text-cyan-400" size={18}/>
                        <input
                          type="text"
                          value={cat.title}
                          onChange={(e) => {
                            const c = structuredClone(draft);
                            c.categories[idx].title = e.target.value;
                            setDraft(c);
                          }}
                          className="crt-input px-3 py-1 rounded text-sm flex-1"
                        />
                        <input
                          type="text"
                          value={cat.color}
                          onChange={(e) => {
                            const c = structuredClone(draft);
                            c.categories[idx].color = e.target.value;
                            setDraft(c);
                          }}
                          className="crt-input px-3 py-1 rounded text-sm w-56"
                        />
                        <button onClick={() => moveCategory(idx, -1)} disabled={idx===0} className="crt-button p-2 rounded"><ArrowUp size={14}/></button>
                        <button onClick={() => moveCategory(idx, 1)} disabled={idx===draft.categories.length-1} className="crt-button p-2 rounded"><ArrowDown size={14}/></button>
                        <button onClick={() => removeCategory(idx)} className="crt-button p-2 rounded text-red-400"><X size={14}/></button>
                      </div>
                      <button onClick={()=>setActiveTab(`CAT:${idx}`)} className="crt-button px-3 py-1 rounded crt-text text-xs">EDIT TECH →</button>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeCat ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl crt-text">EDIT: {activeCat.title}</h2>
                  <button onClick={()=>setActiveTab("CATEGORIES")} className="crt-button px-3 py-2 rounded crt-text">← BACK</button>
                </div>
                <div className="space-y-2">
                  {activeCat.tech.map((tech, tIdx)=>(
                    <div key={tIdx} className="flex items-center gap-2">
                      <input type="text" value={tech} onChange={(e)=>{
                        const c=structuredClone(draft);c.categories[activeCatIndex].tech[tIdx]=e.target.value;setDraft(c);
                      }} className="crt-input px-3 py-1 rounded text-sm flex-1"/>
                      <button onClick={()=>moveTech(activeCatIndex, tIdx, -1)} disabled={tIdx===0} className="crt-button p-2 rounded"><ArrowUp size={12}/></button>
                      <button onClick={()=>moveTech(activeCatIndex, tIdx, 1)} disabled={tIdx===activeCat.tech.length-1} className="crt-button p-2 rounded"><ArrowDown size={12}/></button>
                      <button onClick={()=>{const c=structuredClone(draft);c.categories[activeCatIndex].tech.splice(tIdx,1);setDraft(c);}} className="crt-button p-2 rounded text-red-400"><X size={12}/></button>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-3">
                    <input id={`new-tech-${activeCatIndex}`} type="text" className="crt-input flex-1 px-3 py-2 rounded text-sm" placeholder="Add new tech"/>
                    <button onClick={()=>{
                      const i=document.getElementById(`new-tech-${activeCatIndex}`);
                      if(i && i.value.trim()){const c=structuredClone(draft);c.categories[activeCatIndex].tech.push(i.value.trim());setDraft(c);i.value="";}
                    }} className="crt-button px-4 py-2 rounded crt-text flex items-center gap-2"><Plus size={14}/> ADD</button>
                  </div>
                </div>
              </div>
            ) : null
          ) : (
            <div>
              <h2 className="text-2xl crt-text mb-4">PREVIEW MODE — FULL STACK</h2>
              <div className="space-y-6">
                {draft.categories.map((cat, idx)=>( 
                  <div key={idx} className="crt-panel p-4 rounded">
                    <h3 className="crt-text text-lg mb-2">{cat.title}</h3>
                    <p className="text-xs text-cyan-300 mb-2">{cat.color}</p>
                    <div className="flex flex-wrap gap-2">
                      {cat.tech.map((t,i)=>(<span key={i} className="px-3 py-1 bg-cyan-500/20 rounded text-xs">{t}</span>))}
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
            <motion.div className="crt-panel p-6 rounded-lg max-w-md w-full space-y-4">
              <h3 className="text-xl crt-text">CONFIRM SAVE</h3>
              <p className="text-sm crt-text opacity-60">Enter admin code to confirm.</p>
              <input
                type="password"
                value={secretInput}
                onChange={(e)=>setSecretInput(e.target.value)}
                className="crt-input w-full px-4 py-2 rounded"
                placeholder="Enter admin code..."
                onKeyDown={(e)=>{if(e.key==="Enter")confirmSave();}}
              />
              <div className="flex justify-end gap-3">
                <button onClick={()=>setChangesPopupOpen(false)} className="crt-button px-4 py-2 rounded crt-text">CANCEL</button>
                <button onClick={confirmSave} className="crt-button px-4 py-2 rounded crt-text bg-cyan-500/20 border-cyan-400">CONFIRM & SAVE</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
