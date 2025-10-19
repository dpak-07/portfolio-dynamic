"use client"
import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Eye, Save, RotateCcw, Download, Upload, Plus, X, Palette, Calendar, FileDown, FileUp
} from "lucide-react"

const STORAGE_DRAFT_KEY = "resume_config_draft"
const STORAGE_SAVED_KEY = "resume_config_saved"
const ADMIN_CODE = "69"

// 🧠 CRT Theme Styles
const CRTStyles = () => (
  <style>{`
    @keyframes flicker {0%,100%{opacity:0.95}50%{opacity:1}}
    @keyframes scanline {0%{transform:translateY(-100%)}100%{transform:translateY(100%)}}
    .crt-screen {
      background: radial-gradient(circle at center, #0d1f2d 0%, #050a0f 100%);
      animation: flicker 0.2s infinite;
      position: relative;
      color: #00e5ff;
      font-family: "Courier New", monospace;
    }
    .crt-screen::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, transparent 50%, rgba(0,255,255,0.05) 50%);
      background-size: 100% 4px;
      animation: scanline 8s linear infinite;
      pointer-events: none;
    }
    .crt-text { text-shadow: 0 0 10px rgba(0,229,255,0.8), 0 0 20px rgba(0,229,255,0.4); }
    .crt-panel {
      background: linear-gradient(135deg, rgba(0,20,30,0.95), rgba(0,10,20,0.98));
      border: 2px solid rgba(0,229,255,0.3);
      box-shadow: 0 0 30px rgba(0,229,255,0.2);
      border-radius: 10px;
      padding: 1rem;
    }
    .crt-button {
      background: linear-gradient(135deg, rgba(0,229,255,0.2), rgba(0,229,255,0.1));
      border: 2px solid rgba(0,229,255,0.4);
      transition: all 0.2s ease;
      box-shadow: 0 0 15px rgba(0,229,255,0.3);
      border-radius: 6px;
      color: #00e5ff;
      font-weight: bold;
    }
    .crt-button:hover { transform: translateY(-2px); box-shadow: 0 0 30px rgba(0,229,255,0.5); }
    .crt-input {
      width: 100%;
      background: rgba(0,0,0,0.6);
      border: 2px solid rgba(0,229,255,0.3);
      color: #00e5ff;
      border-radius: 6px;
      padding: 0.5rem 0.75rem;
    }
    .hide-scrollbar::-webkit-scrollbar { width: 8px; }
    .hide-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,229,255,0.3); border-radius: 4px; }
  `}</style>
)

// Default Resume Config
const defaultConfig = {
  section: {
    id: "resume",
    background: "#030712",
    card: {
      bg: "bg-white/5",
      border: "border border-white/10",
      shadow: "shadow-[0_0_50px_-10px_rgba(0,255,255,0.25)]",
      glow: "bg-[linear-gradient(45deg,rgba(0,255,255,0.15),rgba(255,0,255,0.15))]",
    },
  },
  header: {
    title: "My Interactive Resume",
    subtitle: "Updated on October 12, 2025",
    gradient: "from-cyan-400 via-blue-400 to-purple-400",
    icon: "Calendar",
  },
  description:
    "Driven software engineer passionate about designing intelligent, scalable systems blending AI and design.",
  skills: [
    "Full-Stack Development",
    "AI & Machine Learning",
    "Cloud Infrastructure",
  ],
  links: {
    googleDrive: "https://drive.google.com/file/d/1abcdef1234567890/view?usp=sharing",
  },
  buttons: [
    {
      id: "view",
      label: "View Resume",
      icon: "Eye",
      gradient: "from-cyan-400 to-blue-500",
      textColor: "text-black",
      action: "modal",
    },
    {
      id: "download",
      label: "Download Resume",
      icon: "Download",
      gradient: "from-pink-500 to-purple-500",
      textColor: "text-white",
      action: "download",
    },
  ],
}

const iconMap = { Eye, Download, Calendar, FileUp, FileDown, Palette }

export default function ResumeAdmin() {
  const [draft, setDraft] = useState(defaultConfig)
  const [preview, setPreview] = useState(false)
  const [status, setStatus] = useState("System Ready")
  const [saveOpen, setSaveOpen] = useState(false)
  const [code, setCode] = useState("")
  const committedRef = useRef(defaultConfig)

  // Load saved
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_SAVED_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      setDraft(parsed)
      committedRef.current = parsed
    }
  }, [])

  const update = (path, val) => {
    const parts = path.split(".")
    const copy = JSON.parse(JSON.stringify(draft))
    let cur = copy
    for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]]
    cur[parts.at(-1)] = val
    setDraft(copy)
    setStatus("Draft Updated")
  }

  const pushArray = (path, val) => {
    const parts = path.split(".")
    const copy = JSON.parse(JSON.stringify(draft))
    let cur = copy
    for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]]
    cur[parts.at(-1)].push(val)
    setDraft(copy)
  }

  const removeAt = (path, idx) => {
    const parts = path.split(".")
    const copy = JSON.parse(JSON.stringify(draft))
    let cur = copy
    for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]]
    cur[parts.at(-1)].splice(idx, 1)
    setDraft(copy)
  }

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "resume_config.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const importJSON = (e) => {
    const f = e.target.files[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result)
        setDraft(parsed)
        setStatus("Imported Successfully")
      } catch {
        setStatus("Invalid JSON")
      }
    }
    reader.readAsText(f)
  }

  const confirmSave = () => {
    if (code.trim() !== ADMIN_CODE) {
      setStatus("ACCESS DENIED ❌")
      return
    }
    localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(draft))
    committedRef.current = draft
    setSaveOpen(false)
    setStatus("✓ Saved Successfully")
  }

  return (
    <div className="w-screen h-screen crt-screen text-white">
      <CRTStyles />
      <div className="p-6 flex flex-col h-full gap-4">
        <motion.div className="crt-panel flex justify-between items-center">
          <h1 className="crt-text text-2xl font-bold">RESUME ADMIN PANEL</h1>
          <button
            onClick={() => setPreview(!preview)}
            className="crt-button px-4 py-2 flex items-center gap-2"
          >
            <Eye size={16} /> {preview ? "EDIT" : "PREVIEW"}
          </button>
        </motion.div>

        {!preview ? (
          <div className="flex-1 flex gap-4 overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 crt-panel flex flex-col justify-between">
              <div className="space-y-2">
                <button
                  onClick={() => setSaveOpen(true)}
                  className="w-full crt-button px-3 py-2 flex items-center gap-2"
                >
                  <Save size={16} /> SAVE (CONFIRM)
                </button>
                <label className="crt-button px-3 py-2 flex items-center gap-2 cursor-pointer">
                  <Upload size={16} /> IMPORT
                  <input
                    type="file"
                    accept=".json"
                    onChange={importJSON}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={exportJSON}
                  className="w-full crt-button px-3 py-2 flex items-center gap-2"
                >
                  <Download size={16} /> EXPORT
                </button>
                <button
                  onClick={() => {
                    setDraft(defaultConfig)
                    setStatus("Reset to Default")
                  }}
                  className="w-full crt-button px-3 py-2 flex items-center gap-2"
                >
                  <RotateCcw size={16} /> RESET
                </button>
              </div>
              <div className="text-xs text-cyan-400 opacity-70">{status}</div>
            </div>

            {/* Editor */}
            <motion.div
              className="flex-1 crt-panel overflow-y-auto hide-scrollbar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="space-y-6">
                <div>
                  <h2 className="crt-text text-lg mb-2">Header</h2>
                  <input
                    value={draft.header.title}
                    onChange={(e) => update("header.title", e.target.value)}
                    className="crt-input mb-2"
                  />
                  <input
                    value={draft.header.subtitle}
                    onChange={(e) => update("header.subtitle", e.target.value)}
                    className="crt-input"
                  />
                </div>

                <div>
                  <h2 className="crt-text text-lg mb-2">Description</h2>
                  <textarea
                    value={draft.description}
                    onChange={(e) => update("description", e.target.value)}
                    className="crt-input h-24"
                  />
                </div>

                <div>
                  <h2 className="crt-text text-lg mb-2">Skills</h2>
                  <div className="flex gap-2 mb-2">
                    <input
                      id="skill-input"
                      className="flex-1 crt-input"
                      placeholder="Add skill (Enter)"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.target.value.trim()) {
                          pushArray("skills", e.target.value.trim())
                          e.target.value = ""
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById("skill-input")
                        if (input && input.value.trim()) {
                          pushArray("skills", input.value.trim())
                          input.value = ""
                        }
                      }}
                      className="crt-button px-3 py-2"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {draft.skills.map((s, i) => (
                      <div key={i} className="crt-panel flex items-center gap-2 px-3 py-1">
                        <span>{s}</span>
                        <button
                          onClick={() => removeAt("skills", i)}
                          className="text-red-400"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="crt-text text-lg mb-2">Google Drive Link</h2>
                  <input
                    value={draft.links.googleDrive}
                    onChange={(e) => update("links.googleDrive", e.target.value)}
                    className="crt-input"
                  />
                </div>

                <div>
                  <h2 className="crt-text text-lg mb-2">Buttons</h2>
                  {draft.buttons.map((btn, i) => (
                    <div key={i} className="crt-panel mb-2">
                      <input
                        value={btn.label}
                        onChange={(e) => {
                          const copy = { ...draft }
                          copy.buttons[i].label = e.target.value
                          setDraft(copy)
                        }}
                        className="crt-input mb-2"
                        placeholder="Label"
                      />
                      <select
                        value={btn.icon}
                        onChange={(e) => {
                          const copy = { ...draft }
                          copy.buttons[i].icon = e.target.value
                          setDraft(copy)
                        }}
                        className="crt-input mb-2"
                      >
                        {Object.keys(iconMap).map((key) => (
                          <option key={key}>{key}</option>
                        ))}
                      </select>
                      <select
                        value={btn.action}
                        onChange={(e) => {
                          const copy = { ...draft }
                          copy.buttons[i].action = e.target.value
                          setDraft(copy)
                        }}
                        className="crt-input"
                      >
                        <option value="modal">Modal</option>
                        <option value="download">Download</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          // Preview mode
          <motion.div
            className="flex-1 crt-panel overflow-y-auto hide-scrollbar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="crt-text text-2xl mb-4">PREVIEW</h2>
            <div className="space-y-4">
              <div className="crt-panel">
                <h3 className="text-lg crt-text">Header</h3>
                <p>{draft.header.title}</p>
                <p className="text-cyan-400">{draft.header.subtitle}</p>
              </div>
              <div className="crt-panel">
                <h3 className="text-lg crt-text">Description</h3>
                <p>{draft.description}</p>
              </div>
              <div className="crt-panel">
                <h3 className="text-lg crt-text">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {draft.skills.map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-cyan-500/20 rounded">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="crt-panel">
                <h3 className="text-lg crt-text">Buttons</h3>
                <div className="flex flex-wrap gap-2">
                  {draft.buttons.map((b, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-cyan-500/20 rounded inline-flex items-center gap-2"
                    >
                      {b.label} ({b.action})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Save Modal */}
      <AnimatePresence>
        {saveOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="crt-panel w-full max-w-md"
            >
              <h2 className="crt-text text-xl mb-3">CONFIRM SAVE</h2>
              <input
                type="password"
                placeholder="Enter admin code..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="crt-input mb-3"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSaveOpen(false)}
                  className="crt-button px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSave}
                  className="crt-button px-4 py-2 bg-cyan-500/30"
                >
                  Confirm & Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
