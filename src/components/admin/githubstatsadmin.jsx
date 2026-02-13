"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
    Eye, Save, RotateCcw, Download, Upload, Loader, AlertCircle, CheckCircle, Wifi, WifiOff
} from "lucide-react";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";

const STORAGE_DRAFT_KEY = "github_stats_draft";
const STORAGE_SAVED_KEY = "github_stats_saved";
const FIRESTORE_GITHUB_DOC = "portfolio/githubStats";
const FIRESTORE_ADMIN_DOC = "admin/credentials";
const SYNC_DEBOUNCE = 500;

// CRT Theme Styles
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
    }
    .crt-button {
      background: linear-gradient(135deg, rgba(0,229,255,0.2), rgba(0,229,255,0.1));
      border: 2px solid rgba(0,229,255,0.4);
      transition: all 0.2s ease;
      box-shadow: 0 0 15px rgba(0,229,255,0.3);
      color: #00e5ff;
      font-weight: bold;
      cursor: pointer;
    }
    .crt-button:hover:not(:disabled) { 
      transform: translateY(-2px); 
      box-shadow: 0 0 30px rgba(0,229,255,0.5); 
    }
    .crt-button:disabled { opacity: 0.35; cursor: not-allowed; }
    .crt-input {
      background: rgba(0,0,0,0.6);
      border: 2px solid rgba(0,229,255,0.3);
      color: #00e5ff;
      font-family: "Courier New", monospace;
    }
    .crt-input:focus {
      outline: none;
      border-color: rgba(0,229,255,0.6);
      box-shadow: 0 0 20px rgba(0,229,255,0.3);
    }
    .status-success { color: #4ade80; text-shadow: 0 0 10px rgba(74,222,128,0.6); }
    .status-error { color: #f87171; text-shadow: 0 0 10px rgba(248,113,113,0.6); }
    .status-info { color: #60a5fa; text-shadow: 0 0 10px rgba(96,165,250,0.6); }
  `}</style>
);

// Default Config
const defaultConfig = {
    username: "dpak-07",
    enabled: true,
    showContributions: true,
    showStreak: true,
    showStats: true,
    lastUpdated: new Date().toISOString(),
    updatedBy: "admin",
};

export default function GitHubStatsAdmin() {
    const [draft, setDraft] = useState(defaultConfig);
    const [preview, setPreview] = useState(false);
    const [status, setStatus] = useState("🔌 Connecting to Firebase...");
    const [statusType, setStatusType] = useState("info");
    const [saveOpen, setSaveOpen] = useState(false);
    const [code, setCode] = useState("");
    const [adminCode, setAdminCode] = useState(null);
    const [isOnline, setIsOnline] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    const committedRef = useRef(defaultConfig);
    const draftChangeTimeoutRef = useRef(null);
    const prevDraftRef = useRef(null);

    // Load from Firebase
    const loadFromFirebase = useCallback(async () => {
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

            const githubDocRef = doc(db, FIRESTORE_GITHUB_DOC);
            const githubSnap = await getDoc(githubDocRef);

            let initialDraft = null;

            if (githubSnap.exists()) {
                initialDraft = githubSnap.data();
                setStatus("✓ GitHub stats loaded from Firestore");
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

    useEffect(() => {
        loadFromFirebase();

        const handleOnline = () => {
            setIsOnline(true);
            loadFromFirebase();
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
                ...config,
                lastUpdated: new Date().toISOString(),
                updatedBy: "admin",
                updatedAt: Timestamp.now(),
            };

            await setDoc(
                doc(db, FIRESTORE_GITHUB_DOC),
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

    const initiateSave = () => {
        if (!hasChanges) {
            setStatus("✓ No changes to save");
            setStatusType("info");
            return;
        }
        setSaveOpen(true);
    };

    const confirmSave = async () => {
        if (code !== adminCode) {
            setStatus("✗ Invalid admin code");
            setStatusType("error");
            return;
        }

        const success = await saveToFirebase(draft);
        if (success) {
            committedRef.current = draft;
            localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(draft));
            sessionStorage.removeItem(STORAGE_DRAFT_KEY);
        }
        setSaveOpen(false);
        setCode("");
    };

    const update = (key, value) => {
        setDraft((prev) => ({ ...prev, [key]: value }));
    };

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
                            <h1 className="text-2xl font-bold crt-text">
                                GITHUB_STATS.ADMIN
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
                            <button
                                onClick={() => setPreview(!preview)}
                                className="crt-button px-4 py-2 rounded flex items-center gap-2"
                            >
                                <Eye size={16} />
                                {preview ? "EDIT" : "PREVIEW"}
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content */}
                <div className="flex-1 overflow-auto hide-scrollbar">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="crt-panel rounded-lg p-6 space-y-6"
                    >
                        <div>
                            <label className="block text-sm crt-text mb-2">GitHub Username</label>
                            <input
                                value={draft.username}
                                onChange={(e) => update("username", e.target.value)}
                                className="w-full crt-input px-3 py-2 rounded"
                                placeholder="dpak-07"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={draft.enabled}
                                    onChange={(e) => update("enabled", e.target.checked)}
                                    className="w-5 h-5"
                                />
                                <span className="crt-text">Enable GitHub Stats Section</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={draft.showContributions}
                                    onChange={(e) => update("showContributions", e.target.checked)}
                                    className="w-5 h-5"
                                />
                                <span className="crt-text">Show Contributions Graph</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={draft.showStreak}
                                    onChange={(e) => update("showStreak", e.target.checked)}
                                    className="w-5 h-5"
                                />
                                <span className="crt-text">Show Streak Stats</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={draft.showStats}
                                    onChange={(e) => update("showStats", e.target.checked)}
                                    className="w-5 h-5"
                                />
                                <span className="crt-text">Show Stats Cards</span>
                            </label>
                        </div>

                        <div className="pt-4 border-t border-cyan-400/20">
                            <button
                                onClick={initiateSave}
                                disabled={!hasChanges}
                                className="w-full crt-button px-6 py-3 rounded flex items-center justify-center gap-2"
                            >
                                <Save size={16} />
                                SAVE CHANGES
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Save Modal */}
            {saveOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="crt-panel rounded-lg p-6 w-96"
                    >
                        <h3 className="text-xl crt-text mb-4">CONFIRM SAVE</h3>
                        <input
                            type="password"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Enter admin code"
                            className="w-full crt-input px-3 py-2 rounded mb-4"
                            onKeyDown={(e) => e.key === "Enter" && confirmSave()}
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={confirmSave}
                                className="flex-1 crt-button px-4 py-2 rounded"
                            >
                                CONFIRM
                            </button>
                            <button
                                onClick={() => {
                                    setSaveOpen(false);
                                    setCode("");
                                }}
                                className="flex-1 crt-button px-4 py-2 rounded"
                            >
                                CANCEL
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
