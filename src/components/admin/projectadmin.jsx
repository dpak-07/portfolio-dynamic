import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, Save, Download, Upload,
  Plus, X, ArrowUp, ArrowDown, Image as ImageIcon, Github, Globe, FolderPlus, Trash
} from "lucide-react";

const CRTStyles = () => (
  <style>{`
    @keyframes flicker { 0%,100%{opacity:.95} 50%{opacity:1} }
    @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100%)} }
    .crt-screen { background: radial-gradient(ellipse at center,#0d1f2d 0%,#050a0f 100%); position:relative; animation:flicker .15s infinite; }
    .crt-screen::before { content:''; position:absolute; inset:0;
      background:repeating-linear-gradient(0deg,rgba(0,255,255,.03)0,transparent 2px,transparent 3px,rgba(0,255,255,.03)4px);
      z-index:20; pointer-events:none; }
    .crt-screen::after { content:''; position:absolute; inset:0; background:linear-gradient(to bottom,transparent 50%,rgba(0,255,255,.03)50%);
      background-size:100% 4px; animation:scanline 8s linear infinite; z-index:25; pointer-events:none;}
    .crt-panel { background:rgba(0,10,20,.95); border:2px solid rgba(0,229,255,.3); box-shadow:0 0 30px rgba(0,229,255,.15),inset 0 0 30px rgba(0,0,0,.5); border-radius:12px; }
    .crt-text { color:#00e5ff; text-shadow:0 0 10px rgba(0,229,255,.8),0 0 20px rgba(0,229,255,.4); font-family:'Courier New',monospace; }
    .crt-button { border:2px solid rgba(0,229,255,.4); background:rgba(0,229,255,.15); transition:.3s; color:#00e5ff; border-radius:8px; }
    .crt-button:hover { background:rgba(0,229,255,.25); box-shadow:0 0 20px rgba(0,229,255,.4); transform:translateY(-2px);}
    .crt-input { background:rgba(0,0,0,.6); border:2px solid rgba(0,229,255,.3); color:#00e5ff; width:100%; padding:.5rem; border-radius:6px;}
    .crt-input:focus { outline:none; border-color:rgba(0,229,255,.6); box-shadow:0 0 20px rgba(0,229,255,.3);}
    .hide-scrollbar::-webkit-scrollbar {width:6px;}
    .hide-scrollbar::-webkit-scrollbar-thumb {background:rgba(0,229,255,.3);border-radius:3px;}
  `}</style>
);

const STORAGE_KEY = "projects_admin_config";
const ADMIN_CODE = "69";

export default function ProjectsAdminCRT() {
  const [projects, setProjects] = useState(null);
  const [activeCat, setActiveCat] = useState("");
  const [status, setStatus] = useState("System Ready");
  const [previewMode, setPreviewMode] = useState(false);
  const [changesPopupOpen, setChangesPopupOpen] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [selectedProject, setSelectedProject] = useState(null); // <-- NEW

  const committedRef = useRef(null);

  const defaultData = {
    "Cloud / Backend": [],
    "Full-Stack": [],
    "Frontend": [],
    "Data / ML": []
  };

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    let parsed = defaultData;
    if (saved) {
      try {
        parsed = JSON.parse(saved);
      } catch {}
    }
    setProjects(parsed);
    const firstCat = Object.keys(parsed)[0];
    setActiveCat(firstCat);
    committedRef.current = JSON.parse(JSON.stringify(parsed));
  }, []);

  const updateProject = (idx, key, value) => {
    const copy = { ...projects };
    copy[activeCat][idx][key] = value;
    setProjects(copy);
  };

  const addProject = () => {
    const copy = { ...projects };
    copy[activeCat].push({
      title: "New Project",
      desc: "",
      long: "",
      tech: [],
      img: "",
      url: "",
      live: ""
    });
    setProjects(copy);
  };

  const removeProject = (idx) => {
    const copy = { ...projects };
    copy[activeCat].splice(idx, 1);
    setProjects(copy);
  };

  const moveProject = (idx, dir) => {
    const copy = { ...projects };
    const arr = copy[activeCat];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= arr.length) return;
    [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
    setProjects(copy);
  };

  const handleImageUpload = (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => updateProject(idx, "img", ev.target.result);
    reader.readAsDataURL(file);
  };

  const addCategory = () => {
    const name = newCatName.trim();
    if (!name || projects[name]) {
      setStatus("⚠ Invalid or existing category name");
      return;
    }
    const copy = { ...projects, [name]: [] };
    setProjects(copy);
    setActiveCat(name);
    setNewCatName("");
    setStatus(`Added category "${name}"`);
  };

  const deleteCategory = (cat) => {
    if (window.confirm(`Delete category "${cat}"?`)) {
      const copy = { ...projects };
      delete copy[cat];
      const keys = Object.keys(copy);
      setProjects(copy);
      setActiveCat(keys[0] || "");
      setStatus(`Deleted ${cat}`);
    }
  };

  const saveWithCode = () => {
    if (adminCode.trim() !== ADMIN_CODE) {
      setStatus("ACCESS DENIED");
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    committedRef.current = JSON.parse(JSON.stringify(projects));
    setStatus("✓ Saved successfully");
    setChangesPopupOpen(false);
    setAdminCode("");
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(projects, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "projects_config.json";
    a.click();
    URL.revokeObjectURL(a.href);
    setStatus("Exported JSON");
  };

  const importJson = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        setProjects(parsed);
        setStatus("Imported successfully");
      } catch {
        setStatus("Invalid JSON");
      }
    };
    reader.readAsText(file);
  };

  if (!projects) return <div className="crt-text p-8">Loading Admin...</div>;

  return (
    <div className="w-screen h-screen crt-screen overflow-hidden">
      <CRTStyles />
      <div className="flex flex-col h-full p-4 gap-4">
        {/* HEADER */}
        <div className="crt-panel p-4 flex items-center justify-between">
          <h1 className="crt-text text-2xl">PROJECTS ADMIN TERMINAL</h1>
          <div className="flex items-center gap-3">
            <span className="crt-text text-sm">{status}</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setPreviewMode(!previewMode)}
              className="crt-button px-4 py-2 rounded text-sm"
            >
              <Eye size={16} /> {previewMode ? "EDIT" : "PREVIEW"}
            </motion.button>
          </div>
        </div>

        <div className="flex flex-1 gap-4 overflow-hidden">
          {/* SIDEBAR */}
          <div className="w-72 crt-panel p-4 flex flex-col justify-between">
            <div>
              <h3 className="crt-text text-sm mb-3 opacity-70">CATEGORIES</h3>
              <div className="space-y-2">
                {Object.keys(projects).map((cat) => (
                  <div key={cat} className="flex items-center justify-between">
                    <button
                      onClick={() => setActiveCat(cat)}
                      className={`w-full text-left crt-button px-3 py-2 rounded ${
                        activeCat === cat ? "bg-cyan-600/30" : ""
                      }`}
                    >
                      {cat}
                    </button>
                    <button
                      onClick={() => deleteCategory(cat)}
                      className="text-red-400 ml-2"
                      title="Delete category"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <input
                  className="crt-input text-sm mb-2"
                  placeholder="New category name"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                />
                <button
                  onClick={addCategory}
                  className="crt-button w-full px-3 py-2 rounded flex items-center gap-2 justify-center"
                >
                  <FolderPlus size={16} /> Add Category
                </button>
              </div>
            </div>

            <div>
              <h3 className="crt-text text-sm mb-3 opacity-70">ACTIONS</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setChangesPopupOpen(true)}
                  className="crt-button w-full px-3 py-2 rounded flex items-center gap-2"
                >
                  <Save size={16} /> SAVE
                </button>
                <button
                  onClick={exportJson}
                  className="crt-button w-full px-3 py-2 rounded flex items-center gap-2"
                >
                  <Download size={16} /> EXPORT
                </button>
                <label className="crt-button w-full px-3 py-2 rounded flex items-center gap-2 cursor-pointer justify-center">
                  <Upload size={16} /> IMPORT
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={importJson}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 crt-panel p-6 overflow-y-auto hide-scrollbar">
            {!previewMode ? (
              // --- EDIT MODE ---
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="crt-text text-xl">{activeCat}</h2>
                  <button
                    onClick={addProject}
                    className="crt-button px-4 py-2 rounded flex items-center gap-2"
                  >
                    <Plus size={16} /> Add Project
                  </button>
                </div>

                <div className="space-y-6">
                  {(projects[activeCat] || []).map((p, idx) => (
                    <motion.div
                      key={idx}
                      className="crt-panel p-4 rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="crt-text text-lg">{p.title}</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => moveProject(idx, -1)}
                            disabled={idx === 0}
                            className="crt-button p-2 rounded"
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button
                            onClick={() => moveProject(idx, 1)}
                            disabled={idx === projects[activeCat].length - 1}
                            className="crt-button p-2 rounded"
                          >
                            <ArrowDown size={16} />
                          </button>
                          <button
                            onClick={() => removeProject(idx)}
                            className="crt-button p-2 rounded text-red-400"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <input
                          className="crt-input"
                          value={p.title}
                          onChange={(e) => updateProject(idx, "title", e.target.value)}
                          placeholder="Title"
                        />
                        <input
                          className="crt-input"
                          value={p.desc}
                          onChange={(e) => updateProject(idx, "desc", e.target.value)}
                          placeholder="Short description"
                        />
                      </div>

                      <textarea
                        className="crt-input h-24 mb-3"
                        value={p.long}
                        onChange={(e) => updateProject(idx, "long", e.target.value)}
                        placeholder="Long description"
                      />

                      {/* IMAGE */}
                      <div className="mb-3">
                        <label className="crt-text text-sm opacity-70">Image</label>
                        <div className="flex gap-3 mt-2 items-center">
                          <input
                            type="text"
                            className="crt-input flex-1"
                            value={p.img}
                            onChange={(e) => updateProject(idx, "img", e.target.value)}
                            placeholder="Image URL"
                          />
                          <label className="crt-button px-3 py-2 rounded flex items-center gap-2 cursor-pointer">
                            <ImageIcon size={16} /> Upload
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, idx)}
                            />
                          </label>
                        </div>
                        {p.img && (
                          <motion.img
                            src={p.img}
                            alt="Preview"
                            whileHover={{ scale: 1.05 }}
                            className="mt-3 rounded-lg border border-cyan-400/30 max-h-48"
                          />
                        )}
                      </div>

                      {/* TECH */}
                      <div className="mb-3">
                        <label className="crt-text text-sm opacity-70">Tech Stack</label>
                        <input
                          type="text"
                          className="crt-input mt-2"
                          value={p.tech.join(", ")}
                          onChange={(e) =>
                            updateProject(
                              idx,
                              "tech",
                              e.target.value.split(",").map((t) => t.trim())
                            )
                          }
                          placeholder="Comma-separated (e.g., React, Node.js, AWS)"
                        />
                      </div>

                      {/* LINKS */}
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          className="crt-input"
                          value={p.url}
                          onChange={(e) => updateProject(idx, "url", e.target.value)}
                          placeholder="GitHub Repo URL"
                        />
                        <input
                          className="crt-input"
                          value={p.live}
                          onChange={(e) => updateProject(idx, "live", e.target.value)}
                          placeholder="Live Demo URL"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              // --- PREVIEW MODE ---
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {(projects[activeCat] || []).map((p, i) => (
                  <motion.div
                    key={i}
                    onClick={() => setSelectedProject(p)}
                    className="crt-panel p-4 rounded-lg hover:shadow-cyan-400/30 transition-all cursor-pointer"
                    whileHover={{ scale: 1.03 }}
                  >
                    {p.img && (
                      <img
                        src={p.img}
                        alt={p.title}
                        className="w-full h-40 object-cover rounded mb-3"
                      />
                    )}
                    <h3 className="text-lg font-bold text-cyan-300">{p.title}</h3>
                    <p className="text-sm opacity-80 mt-1">{p.desc}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(p.tech || []).map((t, ti) => (
                        <span
                          key={ti}
                          className="px-2 py-1 bg-cyan-400/10 border border-cyan-300/30 text-xs rounded"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* 🔷 PROJECT DETAILS MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="crt-panel max-w-2xl w-full p-6 overflow-y-auto hide-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="crt-text text-2xl">{selectedProject.title}</h2>
                <button
                  className="crt-button px-3 py-1 rounded"
                  onClick={() => setSelectedProject(null)}
                >
                  <X size={18} />
                </button>
              </div>
              {selectedProject.img && (
                <img
                  src={selectedProject.img}
                  alt={selectedProject.title}
                  className="w-full rounded-lg mb-4 border border-cyan-400/30"
                />
              )}
              <p className="text-cyan-200 mb-3">{selectedProject.desc}</p>
              <p className="text-cyan-100 mb-4 text-sm leading-relaxed">
                {selectedProject.long}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {(selectedProject.tech || []).map((t, ti) => (
                  <span
                    key={ti}
                    className="px-2 py-1 bg-cyan-400/10 border border-cyan-300/30 text-xs rounded"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex gap-4 mt-4">
                {selectedProject.url && (
                  <a
                    href={selectedProject.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 crt-button px-3 py-2"
                  >
                    <Github size={16} /> GitHub
                  </a>
                )}
                {selectedProject.live && (
                  <a
                    href={selectedProject.live}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 crt-button px-3 py-2 text-green-400"
                  >
                    <Globe size={16} /> Live
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SAVE CONFIRMATION */}
      <AnimatePresence>
        {changesPopupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="crt-panel p-6 rounded max-w-md w-full"
            >
              <h3 className="crt-text text-xl mb-3">Enter Admin Code to Save</h3>
              <input
                type="password"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                className="crt-input mb-4"
                placeholder="Admin Code"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setChangesPopupOpen(false)}
                  className="crt-button px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={saveWithCode}
                  className="crt-button px-4 py-2 rounded bg-cyan-500/20"
                >
                  Confirm & Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
