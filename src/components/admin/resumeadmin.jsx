"use client"
import React, { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Eye, Save, RotateCcw, Download, Upload, Plus, X, Palette, Calendar, FileDown, FileUp, Loader, AlertCircle, CheckCircle, Wifi, WifiOff
} from "lucide-react"
import { doc, setDoc, getDoc, onSnapshot, Timestamp } from "firebase/firestore"
import { db } from "@/firebase"

const STORAGE_DRAFT_KEY = "resume_config_draft"
const STORAGE_SAVED_KEY = "resume_config_saved"
const FIRESTORE_RESUME_DOC = "resume/data"
const FIRESTORE_ADMIN_DOC = "admin/credentials"
const SYNC_DEBOUNCE = 500

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
      overflow: hidden;
    }
    .crt-screen::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, transparent 50%, rgba(0,255,255,0.05) 50%);
      background-size: 100% 4px;
      animation: scanline 8s linear infinite;
      pointer-events: none;
      z-index: 40;
    }
    .crt-text { text-shadow: 0 0 10px rgba(0,229,255,0.8), 0 0 20px rgba(0,229,255,0.4); }
    .crt-panel {
      background: linear-gradient(135deg, rgba(0,20,30,0.95), rgba(0,10,20,0.98));
      border: 2px solid rgba(0,229,255,0.3);
      box-shadow: 0 0 30px rgba(0,229,255,0.2);
      border-radius: 10px;
      padding: 1rem;
      transition: all 0.2s ease;
    }
    .crt-button {
      background: linear-gradient(135deg, rgba(0,229,255,0.2), rgba(0,229,255,0.1));
      border: 2px solid rgba(0,229,255,0.4);
      transition: all 0.2s ease;
      box-shadow: 0 0 15px rgba(0,229,255,0.3);
      border-radius: 6px;
      color: #00e5ff;
      font-weight: bold;
      cursor: pointer;
      user-select: none;
    }
    .crt-button:hover:not(:disabled) { 
      transform: translateY(-2px); 
      box-shadow: 0 0 30px rgba(0,229,255,0.5); 
    }
    .crt-button:disabled { opacity: 0.35; cursor: not-allowed; }
    .crt-input {
      width: 100%;
      background: rgba(0,0,0,0.6);
      border: 2px solid rgba(0,229,255,0.3);
      color: #00e5ff;
      border-radius: 6px;
      padding: 0.5rem 0.75rem;
      font-family: "Courier New", monospace;
      transition: all 0.2s ease;
    }
    .crt-input:focus {
      outline: none;
      border-color: rgba(0,229,255,0.6);
      box-shadow: 0 0 20px rgba(0,229,255,0.3);
    }
    .crt-input:-webkit-autofill {
      -webkit-box-shadow: inset 0 0 20px rgba(0,229,255,0.1);
      -webkit-text-fill-color: #00e5ff;
    }
    .hide-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(0,229,255,0.3) transparent; }
    .hide-scrollbar::-webkit-scrollbar { width: 8px; }
    .hide-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .hide-scrollbar::-webkit-scrollbar-thumb { 
      background: rgba(0,229,255,0.3); 
      border-radius: 4px;
      border: 2px solid transparent;
      background-clip: content-box;
    }
    .hide-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,229,255,0.5); }
    .status-success { color: #4ade80; text-shadow: 0 0 10px rgba(74,222,128,0.6); }
    .status-error { color: #f87171; text-shadow: 0 0 10px rgba(248,113,113,0.6); }
    .status-info { color: #60a5fa; text-shadow: 0 0 10px rgba(96,165,250,0.6); }
    * { -webkit-user-select: none; -moz-user-select: none; user-select: none; }
    input, textarea { -webkit-user-select: text; -moz-user-select: text; user-select: text; }
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
    subtitle: "Updated on October 21, 2025",
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
  const [status, setStatus] = useState("🔌 Connecting to Firebase...")
  const [statusType, setStatusType] = useState("info")
  const [saveOpen, setSaveOpen] = useState(false)
  const [code, setCode] = useState("")
  const [adminCode, setAdminCode] = useState(null)
  const [isOnline, setIsOnline] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  
  const committedRef = useRef(defaultConfig)
  const unsubscribeRef = useRef(null)
  const syncTimeoutRef = useRef(null)
  const draftChangeTimeoutRef = useRef(null)
  const prevDraftRef = useRef(null)

  // Block Google auto-save
  useEffect(() => {
    const preventAutoSave = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        setStatus("⚠ Use SAVE button instead of Ctrl+S")
        setStatusType("info")
        setTimeout(() => {
          setStatus("✓ Ready to save")
          setStatusType("success")
        }, 2000)
        return false
      }
    }

    window.addEventListener('keydown', preventAutoSave)
    
    const disableAutofill = () => {
      const inputs = document.querySelectorAll('input, textarea')
      inputs.forEach(input => {
        input.setAttribute('autocomplete', 'off')
        input.setAttribute('autocorrect', 'off')
        input.setAttribute('autocapitalize', 'off')
        input.setAttribute('spellcheck', 'false')
      })
    }
    
    disableAutofill()
    const interval = setInterval(disableAutofill, 1000)

    return () => {
      window.removeEventListener('keydown', preventAutoSave)
      clearInterval(interval)
    }
  }, [])

  // Initialize from Firebase
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Fetch admin code
        const adminDocRef = doc(db, FIRESTORE_ADMIN_DOC)
        const adminSnap = await getDoc(adminDocRef)
        
        if (adminSnap.exists()) {
          const adminData = adminSnap.data()
          setAdminCode(String(adminData.secretCode))
          setStatus("✓ Admin credentials loaded")
          setStatusType("success")
        } else {
          throw new Error("Admin credentials not found")
        }

        // Load resume from localStorage or Firestore
        const saved = localStorage.getItem(STORAGE_SAVED_KEY)
        const session = sessionStorage.getItem(STORAGE_DRAFT_KEY)
        
        let initialDraft = null
        if (session) {
          initialDraft = JSON.parse(session)
          setStatus("✓ Draft loaded from session")
        } else if (saved) {
          initialDraft = JSON.parse(saved)
          setStatus("✓ Config loaded from cache")
        } else {
          initialDraft = defaultConfig
          setStatus("✓ Using default config")
        }
        
        setDraft(initialDraft)
        committedRef.current = initialDraft
        prevDraftRef.current = JSON.stringify(initialDraft)

        // Real-time listener
        const resumeDocRef = doc(db, FIRESTORE_RESUME_DOC)
        unsubscribeRef.current = onSnapshot(
          resumeDocRef,
          (snapshot) => {
            if (snapshot.exists()) {
              console.log("📡 Real-time update received from Firestore")
            }
          },
          (error) => {
            console.error("Firebase listener error:", error)
          }
        )

        setStatusType("success")
      } catch (error) {
        console.error("Init error:", error)
        setStatus("⚠ Using offline mode")
        setStatusType("error")
        setDraft(defaultConfig)
        committedRef.current = defaultConfig
        prevDraftRef.current = JSON.stringify(defaultConfig)
        setAdminCode("69")
      }
    }

    initializeData()

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      unsubscribeRef.current?.()
      clearTimeout(syncTimeoutRef.current)
      clearTimeout(draftChangeTimeoutRef.current)
    }
  }, [])

  // Debounced draft save
  useEffect(() => {
    if (!draft) return

    if (draftChangeTimeoutRef.current) {
      clearTimeout(draftChangeTimeoutRef.current)
    }

    const draftString = JSON.stringify(draft)
    if (draftString === prevDraftRef.current) {
      return
    }

    prevDraftRef.current = draftString
    setHasChanges(true)
    sessionStorage.setItem(STORAGE_DRAFT_KEY, draftString)
  }, [draft])

  const saveToFirebase = useCallback(async (config) => {
    if (!isOnline) {
      setStatus("✗ No internet connection")
      setStatusType("error")
      return false
    }

    setIsSyncing(true)
    try {
      const enrichedConfig = {
        ...config,
        lastUpdated: new Date().toISOString(),
        updatedBy: "kavshick",
        updatedAt: Timestamp.now(),
      }

      await setDoc(
        doc(db, FIRESTORE_RESUME_DOC),
        enrichedConfig,
        { merge: true }
      )

      setStatus("✓ SAVED TO FIREBASE")
      setStatusType("success")
      setHasChanges(false)
      return true
    } catch (error) {
      console.error("Firebase save error:", error)
      setStatus("✗ Firebase save failed")
      setStatusType("error")
      return false
    } finally {
      setIsSyncing(false)
    }
  }, [isOnline])

  const update = useCallback((path, val) => {
    setDraft(prev => {
      const parts = path.split(".")
      const copy = JSON.parse(JSON.stringify(prev))
      let cur = copy
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]]
      cur[parts.at(-1)] = val
      return copy
    })
    setStatus("Draft Updated")
    setStatusType("info")
  }, [])

  const pushArray = useCallback((path, val) => {
    setDraft(prev => {
      const parts = path.split(".")
      const copy = JSON.parse(JSON.stringify(prev))
      let cur = copy
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]]
      cur[parts.at(-1)].push(val)
      return copy
    })
  }, [])

  const removeAt = useCallback((path, idx) => {
    setDraft(prev => {
      const parts = path.split(".")
      const copy = JSON.parse(JSON.stringify(prev))
      let cur = copy
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]]
      cur[parts.at(-1)].splice(idx, 1)
      return copy
    })
  }, [])

  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `resume_config_${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    setStatus("✓ Exported config")
    setStatusType("success")
  }, [draft])

  const importJSON = useCallback((e) => {
    const f = e.target.files[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result)
        setDraft(parsed)
        prevDraftRef.current = JSON.stringify(parsed)
        setStatus("✓ Imported Successfully")
        setStatusType("success")
      } catch {
        setStatus("✗ Invalid JSON")
        setStatusType("error")
      }
    }
    reader.readAsText(f)
  }, [])

  const confirmSave = useCallback(async () => {
    if (String(code).trim() !== String(adminCode)) {
      setStatus("✗ ACCESS DENIED")
      setStatusType("error")
      setTimeout(() => setCode(""), 2000)
      return
    }
    
    localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(draft))
    sessionStorage.removeItem(STORAGE_DRAFT_KEY)
    committedRef.current = draft

    const success = await saveToFirebase(draft)
    
    if (success) {
      setSaveOpen(false)
      setCode("")
    }
  }, [code, adminCode, draft, saveToFirebase])

  const resetDefault = useCallback(() => {
    if (window.confirm("Reset to default config?")) {
      setDraft(defaultConfig)
      committedRef.current = defaultConfig
      prevDraftRef.current = JSON.stringify(defaultConfig)
      setStatus("Reset done")
      setStatusType("info")
      setHasChanges(false)
    }
  }, [])

  return (
    <div className="w-screen h-screen crt-screen text-white">
      <CRTStyles />
      <div className="p-6 flex flex-col h-full gap-4 relative z-10">
        <motion.div className="crt-panel flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="crt-text text-2xl font-bold">RESUME ADMIN PANEL</h1>
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
              onClick={() => setPreview(!preview)}
              className="crt-button px-4 py-2 flex items-center gap-2"
            >
              <Eye size={16} /> {preview ? "EDIT" : "PREVIEW"}
            </button>
          </div>
        </motion.div>

        {!preview ? (
          <div className="flex-1 flex gap-4 overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 crt-panel flex flex-col justify-between overflow-y-auto hide-scrollbar">
              <div className="space-y-2">
                <button
                  onClick={() => setSaveOpen(true)}
                  disabled={!hasChanges}
                  className="w-full crt-button px-3 py-2 flex items-center gap-2"
                >
                  <Save size={16} /> SAVE (CONFIRM)
                </button>
                <label className="crt-button px-3 py-2 flex items-center gap-2 cursor-pointer w-full text-center justify-center">
                  <Upload size={16} /> IMPORT
                  <input
                    type="file"
                    accept=".json"
                    onChange={importJSON}
                    className="hidden"
                    autoComplete="off"
                  />
                </label>
                <button
                  onClick={exportJSON}
                  className="w-full crt-button px-3 py-2 flex items-center gap-2"
                >
                  <Download size={16} /> EXPORT
                </button>
                <button
                  onClick={resetDefault}
                  className="w-full crt-button px-3 py-2 flex items-center gap-2"
                >
                  <RotateCcw size={16} /> RESET
                </button>
              </div>
              <div className="text-xs text-cyan-400 opacity-70 break-words">{status}</div>
            </div>

            {/* Editor */}
            <motion.div
              className="flex-1 crt-panel overflow-y-auto hide-scrollbar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="space-y-6 pr-4">
                <div>
                  <h2 className="crt-text text-lg mb-2">Header</h2>
                  <input
                    value={draft.header.title}
                    onChange={(e) => update("header.title", e.target.value)}
                    className="crt-input mb-2"
                    autoComplete="off"
                  />
                  <input
                    value={draft.header.subtitle}
                    onChange={(e) => update("header.subtitle", e.target.value)}
                    className="crt-input"
                    autoComplete="off"
                  />
                </div>

                <div>
                  <h2 className="crt-text text-lg mb-2">Description</h2>
                  <textarea
                    value={draft.description}
                    onChange={(e) => update("description", e.target.value)}
                    className="crt-input h-24 resize-none"
                    autoComplete="off"
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
                      autoComplete="off"
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById("skill-input")
                        if (input && input.value.trim()) {
                          pushArray("skills", input.value.trim())
                          input.value = ""
                        }
                      }}
                      className="crt-button px-3 py-2 flex-shrink-0"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {draft.skills.map((s, i) => (
                      <div key={`skill-${i}`} className="crt-panel flex items-center gap-2 px-3 py-1">
                        <span>{s}</span>
                        <button
                          onClick={() => removeAt("skills", i)}
                          className="text-red-400 hover:text-red-300 transition-colors"
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
                    autoComplete="off"
                  />
                </div>

                <div>
                  <h2 className="crt-text text-lg mb-2">Buttons</h2>
                  {draft.buttons.map((btn, i) => (
                    <div key={`btn-${i}`} className="crt-panel mb-2">
                      <input
                        value={btn.label}
                        onChange={(e) => {
                          const copy = JSON.parse(JSON.stringify(draft))
                          copy.buttons[i].label = e.target.value
                          setDraft(copy)
                        }}
                        className="crt-input mb-2"
                        placeholder="Label"
                        autoComplete="off"
                      />
                      <select
                        value={btn.icon}
                        onChange={(e) => {
                          const copy = JSON.parse(JSON.stringify(draft))
                          copy.buttons[i].icon = e.target.value
                          setDraft(copy)
                        }}
                        className="crt-input mb-2"
                      >
                        {Object.keys(iconMap).map((key) => (
                          <option key={key} value={key}>{key}</option>
                        ))}
                      </select>
                      <select
                        value={btn.action}
                        onChange={(e) => {
                          const copy = JSON.parse(JSON.stringify(draft))
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
            <div className="space-y-4 pr-4">
              <div className="crt-panel">
                <h3 className="text-lg crt-text mb-2">Header</h3>
                <p className="text-lg font-bold">{draft.header.title}</p>
                <p className="text-cyan-400">{draft.header.subtitle}</p>
              </div>
              <div className="crt-panel">
                <h3 className="text-lg crt-text mb-2">Description</h3>
                <p className="text-sm">{draft.description}</p>
              </div>
              <div className="crt-panel">
                <h3 className="text-lg crt-text mb-2">Skills ({draft.skills.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {draft.skills.map((s, i) => (
                    <span key={`preview-skill-${i}`} className="px-3 py-1 bg-cyan-500/20 rounded text-sm">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="crt-panel">
                <h3 className="text-lg crt-text mb-2">Buttons</h3>
                <div className="flex flex-wrap gap-2">
                  {draft.buttons.map((b, i) => (
                    <span
                      key={`preview-btn-${i}`}
                      className="px-4 py-2 bg-cyan-500/20 rounded inline-flex items-center gap-2 text-sm"
                    >
                      {b.label} ({b.action})
                    </span>
                  ))}
                </div>
              </div>
              <div className="crt-panel">
                <h3 className="text-lg crt-text mb-2">Links</h3>
                <p className="text-xs break-all text-cyan-300">{draft.links.googleDrive}</p>
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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="crt-panel w-full max-w-md"
            >
              <h2 className="crt-text text-xl mb-4">CONFIRM SAVE</h2>
              <p className="text-sm crt-text opacity-60 mb-3">
                {isOnline
                  ? "Enter admin code to save to Firebase & local storage."
                  : "🔌 Offline: Will save locally only. Firebase sync when online."}
              </p>
              <input
                type="password"
                placeholder="Enter admin code..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="crt-input mb-3"
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmSave()
                }}
                autoComplete="off"
                spellCheck="false"
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
                  disabled={isSyncing}
                  className="crt-button px-4 py-2 bg-cyan-500/30"
                >
                  {isSyncing ? "SAVING..." : "Confirm & Save"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}