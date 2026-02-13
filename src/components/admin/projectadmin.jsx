import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, Save, Download, Upload,
  Plus, X, ArrowUp, ArrowDown, Image as ImageIcon, Github, Globe,
  FolderPlus, Trash, RotateCcw, Wifi, WifiOff, Loader,
  AlertCircle, CheckCircle, Bug, Code, Palette
} from "lucide-react";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";

const STORAGE_DRAFT_KEY = "projects_config_draft";
const FIRESTORE_PROJECTS_DOC = "projects/data";
const FIRESTORE_ADMIN_DOC = "admin/credentials";

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
    .status-success { color: #4ade80; text-shadow: 0 0 10px rgba(74,222,128,0.6); }
    .status-error { color: #f87171; text-shadow: 0 0 10px rgba(248,113,113,0.6); }
    .status-info { color: #60a5fa; text-shadow: 0 0 10px rgba(96,165,250,0.6); }
    .link-placeholder {
      color: rgba(0,229,255,0.5);
      font-style: italic;
    }
    .shake {
      animation: shake 0.5s ease-in-out;
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
    .debug-panel {
      background: rgba(255,0,0,0.1);
      border: 1px dashed rgba(255,0,0,0.3);
    }
    /* Button Styles */
    .btn-html {
      background: linear-gradient(135deg, #e44d26, #f16529);
      border: 2px solid #e44d26;
      color: white;
      box-shadow: 0 0 20px rgba(228, 77, 38, 0.4);
    }
    .btn-html:hover {
      background: linear-gradient(135deg, #f16529, #e44d26);
      border-color: #ff7b52;
      box-shadow: 0 0 30px rgba(228, 77, 38, 0.6);
    }
    .btn-css {
      background: linear-gradient(135deg, #264de4, #2965f1);
      border: 2px solid #264de4;
      color: white;
      box-shadow: 0 0 20px rgba(38, 77, 228, 0.4);
    }
    .btn-css:hover {
      background: linear-gradient(135deg, #2965f1, #264de4);
      border-color: #4d7cff;
      box-shadow: 0 0 30px rgba(38, 77, 228, 0.6);
    }
    .btn-js {
      background: linear-gradient(135deg, #f7df1e, #f0db4f);
      border: 2px solid #f7df1e;
      color: black;
      box-shadow: 0 0 20px rgba(247, 223, 30, 0.4);
    }
    .btn-js:hover {
      background: linear-gradient(135deg, #f0db4f, #f7df1e);
      border-color: #ffeb50;
      box-shadow: 0 0 30px rgba(247, 223, 30, 0.6);
    }
    .btn-react {
      background: linear-gradient(135deg, #61dafb, #21a9c7);
      border: 2px solid #61dafb;
      color: white;
      box-shadow: 0 0 20px rgba(97, 218, 251, 0.4);
    }
    .btn-react:hover {
      background: linear-gradient(135deg, #21a9c7, #61dafb);
      border-color: #8ae2ff;
      box-shadow: 0 0 30px rgba(97, 218, 251, 0.6);
    }
    .btn-node {
      background: linear-gradient(135deg, #339933, #66cc33);
      border: 2px solid #339933;
      color: white;
      box-shadow: 0 0 20px rgba(51, 153, 51, 0.4);
    }
    .btn-node:hover {
      background: linear-gradient(135deg, #66cc33, #339933);
      border-color: #85e085;
      box-shadow: 0 0 30px rgba(51, 153, 51, 0.6);
    }
    .btn-python {
      background: linear-gradient(135deg, #3776ab, #306998);
      border: 2px solid #3776ab;
      color: white;
      box-shadow: 0 0 20px rgba(55, 118, 171, 0.4);
    }
    .btn-python:hover {
      background: linear-gradient(135deg, #306998, #3776ab);
      border-color: #4a8fc9;
      box-shadow: 0 0 30px rgba(55, 118, 171, 0.6);
    }
    .image-placeholder {
      background: linear-gradient(135deg, rgba(0,229,255,0.1), rgba(0,229,255,0.05));
      border: 2px dashed rgba(0,229,255,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(0,229,255,0.5);
      font-size: 0.875rem;
    }
    .image-placeholder:hover {
      border-color: rgba(0,229,255,0.6);
      background: linear-gradient(135deg, rgba(0,229,255,0.15), rgba(0,229,255,0.1));
    }
  `}</style>
);

// Debug logger utility
const debugLog = (step, message, data = null) => {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  console.log(`🔧 [${timestamp}] ${step}:`, message, data || '');
};

// Default placeholder image
const PLACEHOLDER_IMAGE = "/images/placeholder.jpg";

export default function ProjectsAdminCRT() {
  const [projects, setProjects] = useState(null);
  const [activeCat, setActiveCat] = useState("");
  const [status, setStatus] = useState("🔌 Connecting to Firebase...");
  const [statusType, setStatusType] = useState("info");
  const [previewMode, setPreviewMode] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Save confirmation states
  const [changesPopupOpen, setChangesPopupOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState([]);
  const [adminCode, setAdminCode] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [adminSecret, setAdminSecret] = useState(null);
  const [authError, setAuthError] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [debugLogs, setDebugLogs] = useState([]);

  const committedRef = useRef(null);
  const draftChangeTimeoutRef = useRef(null);
  const prevProjectsRef = useRef(null);

  const defaultData = {
    categories: {
      "Cloud / Backend": [
        {
          title: "College Website (Backend & Cloud)",
          desc: "Worked as backend & cloud engineer",
          long: "Developed APIs, deployed backend on AWS, managed cloud infra, and integrated Nginx for production hosting.",
          img: "https://onedrive.live.com/embed?resid=XXXXXXXXXX",
          tech: ["Flask", "MongoDB", "Nginx", "AWS"],
          url: null,
          live: "https://velammal.edu.in/webteam",
          buttonStyle: "btn-html", // Default button style
        }
      ],
      "Full-Stack": [
        {
          title: "Hotel Management",
          desc: "MongoDB + Flask project",
          long: "Full-stack hotel & restaurant management system with CRUD, authentication, and admin dashboards.",
          img: "https://onedrive.live.com/embed?resid=XXXXXXXXXX",
          tech: ["Flask", "MongoDB", "HTML"],
          url: "https://github.com/Deepak-S-github/hotel-management",
          live: null,
          buttonStyle: "btn-css",
        }
      ],
      "Frontend": [
        {
          title: "Calculator",
          desc: "Simple calculator built with JS",
          long: "A clean web calculator supporting basic arithmetic operations built with HTML, CSS, and JS.",
          img: "https://onedrive.live.com/embed?resid=XXXXXXXXXX",
          tech: ["HTML", "CSS", "JavaScript"],
          url: "https://github.com/Deepak-S-github/CODSOFT-TASK-3-CALCULATOR-PPROJECT",
          live: null,
          buttonStyle: "btn-js",
        }
      ],
      "Data / ML": [
        {
          title: "PySpark Learning",
          desc: "PySpark exercises in notebooks",
          long: "Hands-on PySpark learning workspace with DataFrame API examples for beginners in Big Data.",
          img: "https://onedrive.live.com/embed?resid=XXXXXXXXXX",
          tech: ["Python", "PySpark", "Jupyter"],
          url: "https://github.com/dpak-07/py_spark_learing",
          live: null,
          buttonStyle: "btn-python",
        }
      ]
    },
    lastUpdated: new Date().toISOString(),
    updatedBy: "deepak",
  };

  // Add debug log to state
  const addDebugLog = (step, message, data = null) => {
    const log = {
      timestamp: new Date().toISOString(),
      step,
      message,
      data: data ? JSON.stringify(data, null, 2) : null
    };
    setDebugLogs(prev => [log, ...prev.slice(0, 49)]); // Keep last 50 logs
    debugLog(step, message, data);
  };

  // Get image URL - returns placeholder if no image
  const getImageUrl = (img) => {
    if (!img || img.trim() === "" || img === "https://onedrive.live.com/embed?resid=XXXXXXXXXX") {
      return PLACEHOLDER_IMAGE;
    }
    return img;
  };

  // Load data from Firebase
  const loadFromFirebase = useCallback(async () => {
    try {
      addDebugLog("INIT", "Starting Firebase initialization");
      setStatus("🔄 Loading admin credentials...");
      setStatusType("info");

      // Fetch admin code
      addDebugLog("ADMIN_LOAD", "Fetching admin document", { path: FIRESTORE_ADMIN_DOC });
      const adminDocRef = doc(db, FIRESTORE_ADMIN_DOC);
      const adminSnap = await getDoc(adminDocRef);

      if (adminSnap.exists()) {
        const adminData = adminSnap.data();
        addDebugLog("ADMIN_DATA", "Admin document found", adminData);

        // Try multiple possible field names
        const code = adminData.secretCode || adminData.code || adminData.adminCode || adminData.password;

        if (code) {
          const trimmedCode = String(code).trim();
          setAdminSecret(trimmedCode);
          addDebugLog("ADMIN_CODE", "Admin code loaded", {
            code: trimmedCode,
            length: trimmedCode.length,
            fieldsChecked: ["secretCode", "code", "adminCode", "password"]
          });
          setStatus("✓ Admin credentials loaded");
          setStatusType("success");
        } else {
          throw new Error("Admin code not found in document fields");
        }
      } else {
        addDebugLog("ADMIN_ERROR", "Admin document does not exist");
        throw new Error("Admin credentials document not found");
      }

      // Load projects data from Firestore
      addDebugLog("PROJECTS_LOAD", "Fetching projects document", { path: FIRESTORE_PROJECTS_DOC });
      setStatus("🔄 Loading projects data...");
      const projectsDocRef = doc(db, FIRESTORE_PROJECTS_DOC);
      const projectsSnap = await getDoc(projectsDocRef);

      let initialProjects = null;

      if (projectsSnap.exists()) {
        // Use data from Firestore
        initialProjects = projectsSnap.data();
        addDebugLog("PROJECTS_DATA", "Projects document loaded", {
          categories: Object.keys(initialProjects.categories || {}),
          hasCategories: !!initialProjects.categories
        });
        setStatus("✓ Projects loaded from Firestore");
      } else {
        // Fallback to session storage or default
        addDebugLog("PROJECTS_FALLBACK", "Projects document not found, checking session storage");
        const session = sessionStorage.getItem(STORAGE_DRAFT_KEY);

        if (session) {
          initialProjects = JSON.parse(session);
          addDebugLog("SESSION_LOAD", "Loaded from session storage");
          setStatus("✓ Draft loaded from session");
        } else {
          initialProjects = defaultData;
          addDebugLog("DEFAULT_LOAD", "Using default data");
          setStatus("✓ Using default projects");
        }
      }

      setProjects(initialProjects);
      committedRef.current = JSON.parse(JSON.stringify(initialProjects));
      prevProjectsRef.current = JSON.stringify(initialProjects);

      // Set active category
      const firstCat = Object.keys(initialProjects.categories || {})[0] || "";
      setActiveCat(firstCat);
      addDebugLog("ACTIVE_CATEGORY", "Set active category", { category: firstCat });
      setStatusType("success");
      addDebugLog("INIT_COMPLETE", "Initialization completed successfully");

    } catch (error) {
      addDebugLog("INIT_ERROR", "Initialization failed", { error: error.message });
      console.error("Init error:", error);
      setStatus("⚠ Using offline mode - " + error.message);
      setStatusType("error");

      // Fallback to session storage or default
      const session = sessionStorage.getItem(STORAGE_DRAFT_KEY);
      const fallbackProjects = session ? JSON.parse(session) : defaultData;

      setProjects(fallbackProjects);
      committedRef.current = JSON.parse(JSON.stringify(fallbackProjects));
      prevProjectsRef.current = JSON.stringify(fallbackProjects);

      const firstCat = Object.keys(fallbackProjects.categories || {})[0] || "";
      setActiveCat(firstCat);
      setAdminSecret("69"); // Fallback admin code
      addDebugLog("FALLBACK_MODE", "Using fallback data", {
        category: firstCat,
        hasSession: !!session
      });
    }
  }, []);

  // Save to Firebase - FIXED VERSION
  const saveToFirebase = useCallback(async (projectsData) => {
    if (!isOnline) {
      addDebugLog("SAVE_ERROR", "No internet connection");
      setStatus("✗ No internet connection");
      setStatusType("error");
      return false;
    }

    setIsSyncing(true);
    addDebugLog("SAVE_START", "Starting Firebase save", {
      hasCategories: !!projectsData.categories,
      categoryCount: Object.keys(projectsData.categories || {}).length,
      categories: Object.keys(projectsData.categories || {})
    });

    try {
      // Create a clean data object with only necessary fields
      const cleanData = {
        categories: {},
        lastUpdated: new Date().toISOString(),
        updatedBy: "deepak",
        updatedAt: Timestamp.now(),
      };

      // Deep copy and clean categories
      if (projectsData.categories) {
        Object.keys(projectsData.categories).forEach(category => {
          if (projectsData.categories[category] && Array.isArray(projectsData.categories[category])) {
            cleanData.categories[category] = projectsData.categories[category].map(project => ({
              title: project.title || "",
              desc: project.desc || "",
              long: project.long || "",
              img: project.img || "",
              tech: project.tech || [],
              url: project.url || null,
              live: project.live || null,
              buttonStyle: project.buttonStyle || "btn-html", // Include button style
            })).filter(project => project.title); // Remove empty projects
          }
        });
      }

      addDebugLog("FIREBASE_SAVE", "Saving to Firestore", {
        path: FIRESTORE_PROJECTS_DOC,
        categories: Object.keys(cleanData.categories),
        totalProjects: Object.values(cleanData.categories).reduce((sum, arr) => sum + arr.length, 0)
      });

      // Use setDoc with merge: false to completely replace the document
      await setDoc(
        doc(db, FIRESTORE_PROJECTS_DOC),
        cleanData,
        { merge: false }
      );

      addDebugLog("SAVE_SUCCESS", "Successfully saved to Firebase", {
        categories: Object.keys(cleanData.categories),
        totalProjects: Object.values(cleanData.categories).reduce((sum, arr) => sum + arr.length, 0)
      });

      setStatus("✓ SAVED TO FIREBASE");
      setStatusType("success");
      setHasChanges(false);
      committedRef.current = JSON.parse(JSON.stringify(projectsData));
      return true;
    } catch (error) {
      addDebugLog("SAVE_ERROR", "Firebase save failed", {
        error: error.message,
        code: error.code
      });
      console.error("❌ Firebase save error:", error);
      setStatus("✗ Firebase save failed: " + error.message);
      setStatusType("error");
      return false;
    } finally {
      setIsSyncing(false);
      addDebugLog("SAVE_COMPLETE", "Save process completed");
    }
  }, [isOnline]);

  // Manual sync function
  const manualSyncToFirebase = async () => {
    if (!window.confirm("Force overwrite Firebase with current local data? This will replace ALL remote data.")) {
      return;
    }

    addDebugLog("MANUAL_SYNC", "Force syncing to Firebase", {
      localCategories: Object.keys(projects.categories || {}),
      localProjects: Object.values(projects.categories || {}).reduce((sum, arr) => sum + arr.length, 0)
    });

    const success = await saveToFirebase(projects);

    if (success) {
      addDebugLog("MANUAL_SYNC_SUCCESS", "Force sync completed");
      setStatus("✓ Force sync completed");
      setStatusType("success");
    } else {
      addDebugLog("MANUAL_SYNC_FAILED", "Force sync failed");
    }
  };

  // Verify Firebase data
  const verifyFirebaseData = async () => {
    try {
      addDebugLog("VERIFY", "Verifying Firebase data");
      const projectsDocRef = doc(db, FIRESTORE_PROJECTS_DOC);
      const projectsSnap = await getDoc(projectsDocRef);

      if (projectsSnap.exists()) {
        const firebaseData = projectsSnap.data();
        addDebugLog("VERIFY_DATA", "Firebase data found", {
          categories: Object.keys(firebaseData.categories || {}),
          totalProjects: Object.values(firebaseData.categories || {}).reduce((sum, arr) => sum + arr.length, 0),
          lastUpdated: firebaseData.lastUpdated
        });

        // Compare with local data
        const localCategories = Object.keys(projects.categories || {}).sort();
        const firebaseCategories = Object.keys(firebaseData.categories || {}).sort();

        if (JSON.stringify(localCategories) !== JSON.stringify(firebaseCategories)) {
          addDebugLog("VERIFY_MISMATCH", "Data mismatch detected", {
            local: localCategories,
            firebase: firebaseCategories
          });
          setStatus("⚠ Data mismatch with Firebase");
          setStatusType("error");
        } else {
          addDebugLog("VERIFY_MATCH", "Data matches Firebase");
          setStatus("✓ Data verified with Firebase");
          setStatusType("success");
        }
      } else {
        addDebugLog("VERIFY_ERROR", "No data in Firebase");
        setStatus("✗ No data in Firebase");
        setStatusType("error");
      }
    } catch (error) {
      addDebugLog("VERIFY_ERROR", "Verification failed", { error: error.message });
      setStatus("✗ Verification failed: " + error.message);
      setStatusType("error");
    }
  };

  // Initialize from Firebase
  useEffect(() => {
    addDebugLog("MOUNT", "Component mounted");
    loadFromFirebase();

    const handleOnline = () => {
      addDebugLog("NETWORK", "Online status changed", { online: true });
      setIsOnline(true);
      setStatus("✓ Back online");
      setStatusType("success");
    };
    const handleOffline = () => {
      addDebugLog("NETWORK", "Online status changed", { online: false });
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
      addDebugLog("UNMOUNT", "Component unmounted");
    };
  }, [loadFromFirebase]);

  // Debounced projects tracking
  useEffect(() => {
    if (!projects) return;

    if (draftChangeTimeoutRef.current) {
      clearTimeout(draftChangeTimeoutRef.current);
    }

    const projectsString = JSON.stringify(projects);
    if (projectsString === prevProjectsRef.current) {
      return;
    }

    prevProjectsRef.current = projectsString;
    setHasChanges(true);
    sessionStorage.setItem(STORAGE_DRAFT_KEY, projectsString);
    addDebugLog("STATE_CHANGE", "Projects state changed", {
      categories: Object.keys(projects.categories || {}),
      hasChanges: true
    });
  }, [projects]);

  // Update project function
  const updateProject = (idx, key, value) => {
    addDebugLog("UPDATE_PROJECT", "Updating project field", {
      category: activeCat,
      index: idx,
      field: key,
      value: value
    });

    const copy = JSON.parse(JSON.stringify(projects));
    if (copy.categories && copy.categories[activeCat] && copy.categories[activeCat][idx]) {
      copy.categories[activeCat][idx][key] = value;
      setProjects(copy);
    }
  };

  // Add project function
  const addProject = () => {
    addDebugLog("ADD_PROJECT", "Adding new project", { category: activeCat });
    const copy = JSON.parse(JSON.stringify(projects));
    if (!copy.categories) copy.categories = {};
    if (!copy.categories[activeCat]) {
      copy.categories[activeCat] = [];
    }
    copy.categories[activeCat].push({
      title: "New Project",
      desc: "",
      long: "",
      tech: [],
      img: "",
      url: "",
      live: "",
      buttonStyle: "btn-html" // Default button style
    });
    setProjects(copy);
  };

  // Remove project function
  const removeProject = (idx) => {
    addDebugLog("REMOVE_PROJECT", "Removing project", { category: activeCat, index: idx });
    const copy = JSON.parse(JSON.stringify(projects));
    if (copy.categories && copy.categories[activeCat] && copy.categories[activeCat][idx]) {
      copy.categories[activeCat].splice(idx, 1);
      setProjects(copy);
      setStatus(`Project removed from ${activeCat}`);
      setStatusType("success");
    }
  };

  // Move project function
  const moveProject = (idx, dir) => {
    addDebugLog("MOVE_PROJECT", "Moving project", { category: activeCat, index: idx, direction: dir });
    const copy = JSON.parse(JSON.stringify(projects));
    if (!copy.categories || !copy.categories[activeCat]) return;

    const arr = copy.categories[activeCat];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= arr.length) return;
    [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
    setProjects(copy);
  };

  const handleImageUpload = async (e, idx) => {
    addDebugLog("IMAGE_UPLOAD", "Starting Supabase image upload", { category: activeCat, index: idx });
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setStatus("✗ Please select an image file");
      setStatusType("error");
      return;
    }

    try {
      setStatus("📤 Uploading image to Supabase...");
      setStatusType("info");
      setIsSyncing(true);

      // Import uploadImage dynamically
      const { uploadImage } = await import("@/utils/supabaseStorage");

      // Upload to Supabase
      const imageUrl = await uploadImage(file, 'projects');

      addDebugLog("IMAGE_UPLOAD_SUCCESS", "Image uploaded successfully", { url: imageUrl });

      // Update project with Supabase URL
      updateProject(idx, "img", imageUrl);

      setStatus("✓ Image uploaded successfully");
      setStatusType("success");
    } catch (error) {
      addDebugLog("IMAGE_UPLOAD_ERROR", "Upload failed", { error: error.message });
      console.error("Image upload error:", error);
      setStatus(`✗ Upload failed: ${error.message}`);
      setStatusType("error");
    } finally {
      setIsSyncing(false);
    }
  };

  // Button style options
  const buttonStyles = [
    { value: "btn-html", label: "HTML", color: "#e44d26" },
    { value: "btn-css", label: "CSS", color: "#264de4" },
    { value: "btn-js", label: "JavaScript", color: "#f7df1e" },
    { value: "btn-react", label: "React", color: "#61dafb" },
    { value: "btn-node", label: "Node.js", color: "#339933" },
    { value: "btn-python", label: "Python", color: "#3776ab" },
  ];

  // Add category function
  const addCategory = () => {
    addDebugLog("ADD_CATEGORY", "Adding new category", { name: newCatName });
    const name = newCatName.trim();
    if (!name) {
      setStatus("⚠ Category name cannot be empty");
      setStatusType("error");
      return;
    }
    if (projects.categories && projects.categories[name]) {
      setStatus("⚠ Category already exists");
      setStatusType("error");
      return;
    }

    const copy = JSON.parse(JSON.stringify(projects));
    if (!copy.categories) copy.categories = {};
    copy.categories[name] = [];
    setProjects(copy);
    setActiveCat(name);
    setNewCatName("");
    setStatus(`Added category "${name}"`);
    setStatusType("success");
  };

  // Delete category function
  const deleteCategory = (cat) => {
    addDebugLog("DELETE_CATEGORY", "Attempting to delete category", {
      category: cat,
      currentCategories: Object.keys(projects.categories || {})
    });

    if (!projects?.categories || !projects.categories[cat]) {
      addDebugLog("DELETE_ERROR", "Category not found", { category: cat });
      setStatus("⚠ Category not found");
      setStatusType("error");
      return;
    }

    const projectCount = projects.categories[cat].length;
    if (window.confirm(`Delete category "${cat}" and all its ${projectCount} projects?`)) {
      const copy = JSON.parse(JSON.stringify(projects));

      // Delete the category
      delete copy.categories[cat];

      // Update active category if we're deleting the current one
      const remainingCats = Object.keys(copy.categories || {});
      if (activeCat === cat) {
        setActiveCat(remainingCats[0] || "");
      }

      setProjects(copy);
      addDebugLog("DELETE_SUCCESS", "Category deleted locally", {
        category: cat,
        remainingCategories: remainingCats,
        newActiveCategory: remainingCats[0] || "",
        projectCountDeleted: projectCount
      });
      setStatus(`Deleted category "${cat}" with ${projectCount} projects`);
      setStatusType("success");
    } else {
      addDebugLog("DELETE_CANCELLED", "User cancelled deletion", { category: cat });
    }
  };

  // Save confirmation flow
  const initiateSaveConfirmation = () => {
    addDebugLog("SAVE_CONFIRMATION", "Initiating save confirmation");
    const prev = committedRef.current || defaultData;
    const changed = computeChanges(prev, projects);

    addDebugLog("CHANGES_DETECTED", "Changes computed", {
      changes: changed,
      hasChanges: changed.length > 0
    });

    if (changed.length === 0) {
      setStatus("No changes detected");
      setStatusType("info");
      return;
    }
    setPendingChanges(changed);
    setAdminCode("");
    setAuthError(false);
    setChangesPopupOpen(true);
  };

  // Save confirmation function
  const confirmSaveWithCode = async () => {
    addDebugLog("CONFIRM_SAVE", "Confirming save with code", {
      inputCode: adminCode,
      hasAdminSecret: !!adminSecret
    });

    if (!adminSecret) {
      addDebugLog("AUTH_ERROR", "Admin credentials not loaded");
      setStatus("✗ Admin credentials not loaded");
      setStatusType("error");
      return;
    }

    const inputCode = String(adminCode).trim();
    const storedCode = String(adminSecret).trim();

    addDebugLog("CODE_COMPARISON", "Comparing codes", {
      input: inputCode,
      stored: storedCode,
      match: inputCode === storedCode
    });

    if (inputCode !== storedCode) {
      addDebugLog("AUTH_FAILED", "Authentication failed - wrong code");
      setStatus("✗ ACCESS DENIED - Wrong code");
      setStatusType("error");
      setAuthError(true);
      // Clear input and reset auth error after delay
      setTimeout(() => {
        setAdminCode("");
        setAuthError(false);
      }, 2000);
      return;
    }

    addDebugLog("AUTH_SUCCESS", "Authentication successful");
    setAuthError(false);
    sessionStorage.removeItem(STORAGE_DRAFT_KEY);

    const success = await saveToFirebase(projects);

    if (success) {
      committedRef.current = JSON.parse(JSON.stringify(projects));
      setChangesPopupOpen(false);
      setAdminCode("");
      setStatus("✓ SAVED SUCCESSFULLY");
      setStatusType("success");
    }
  };

  const refreshFromFirebase = async () => {
    addDebugLog("REFRESH", "Refreshing from Firebase");
    setStatus("🔄 Refreshing from Firebase...");
    setStatusType("info");
    await loadFromFirebase();
  };

  const resetToDefault = () => {
    addDebugLog("RESET", "Resetting to default data");
    if (window.confirm("Reset all changes to default?")) {
      setProjects(defaultData);
      setStatus("Reset to default");
      setStatusType("info");
      setHasChanges(false);

      // Reset active category
      const firstCat = Object.keys(defaultData.categories || {})[0] || "";
      setActiveCat(firstCat);
    }
  };

  const exportJson = () => {
    addDebugLog("EXPORT", "Exporting data as JSON");
    const blob = new Blob([JSON.stringify(projects, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "projects_config.json";
    a.click();
    URL.revokeObjectURL(url);
    setStatus("Exported configuration");
    setStatusType("success");
  };

  const importJson = (e) => {
    addDebugLog("IMPORT", "Importing data from JSON");
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const imported = JSON.parse(evt.target.result);
        setProjects(imported);
        setStatus("Imported successfully");
        setStatusType("success");
        setHasChanges(true);

        // Set active category
        const firstCat = Object.keys(imported.categories || {})[0] || "";
        setActiveCat(firstCat);
        addDebugLog("IMPORT_SUCCESS", "Import successful", { categories: Object.keys(imported.categories || {}) });
      } catch (err) {
        addDebugLog("IMPORT_ERROR", "Import failed - invalid JSON", { error: err.message });
        setStatus("Import failed: Invalid JSON");
        setStatusType("error");
      }
    };
    reader.readAsText(file);
  };

  // Diff helpers
  function computeChanges(oldConfig = {}, newConfig = {}) {
    const changes = [];

    // Check categories
    const oldCats = Object.keys(oldConfig.categories || {});
    const newCats = Object.keys(newConfig.categories || {});

    // Category changes
    if (JSON.stringify(oldCats) !== JSON.stringify(newCats)) {
      changes.push("categories");
    }

    // Project changes per category
    oldCats.forEach(cat => {
      const oldProjects = oldConfig.categories[cat] || [];
      const newProjects = newConfig.categories[cat] || [];
      if (JSON.stringify(oldProjects) !== JSON.stringify(newProjects)) {
        changes.push(`categories.${cat}`);
      }
    });

    return [...new Set(changes)];
  }

  // Debug: Log admin secret when it changes
  useEffect(() => {
    if (adminSecret) {
      addDebugLog("ADMIN_SECRET_UPDATE", "Admin secret updated", {
        secret: adminSecret,
        length: adminSecret.length
      });
    }
  }, [adminSecret]);

  // Clear debug logs
  const clearDebugLogs = () => {
    setDebugLogs([]);
    addDebugLog("DEBUG", "Debug logs cleared");
  };

  if (!projects) {
    return (
      <div className="w-screen h-screen crt-screen crt-glow flex items-center justify-center">
        <CRTStyles />
        <div className="crt-text text-xl flex items-center gap-3">
          <Loader className="animate-spin" size={24} />
          Loading Projects Admin...
        </div>
      </div>
    );
  }

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
                PROJECTS ADMIN TERMINAL
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
              <button
                onClick={() => setDebugMode(!debugMode)}
                className={`crt-button px-3 py-1 rounded flex items-center gap-2 ${debugMode ? 'bg-yellow-500/20 border-yellow-400' : ''}`}
                title="Toggle Debug Mode"
              >
                <Bug size={14} />
                <span className="text-xs">{debugMode ? 'DEBUG ON' : 'DEBUG'}</span>
              </button>
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

        {/* DEBUG PANEL */}
        {debugMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="debug-panel rounded-lg p-4 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="crt-text text-sm font-bold">DEBUG LOGS</h3>
              <div className="flex gap-2">
                <button
                  onClick={clearDebugLogs}
                  className="crt-button px-2 py-1 text-xs"
                >
                  Clear Logs
                </button>
                <button
                  onClick={() => console.log('Debug State:', { projects, adminSecret, activeCat, hasChanges })}
                  className="crt-button px-2 py-1 text-xs"
                >
                  Log State
                </button>
              </div>
            </div>
            <div className="max-h-32 overflow-y-auto text-xs font-mono">
              {debugLogs.map((log, idx) => (
                <div key={idx} className="border-b border-red-400/20 py-1">
                  <span className="text-cyan-400">[{log.timestamp.split('T')[1]}]</span>
                  <span className="text-yellow-400 ml-2">{log.step}:</span>
                  <span className="text-white ml-1">{log.message}</span>
                  {log.data && (
                    <span className="text-green-400 ml-1">→ {log.data}</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* SIDEBAR */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-72 crt-panel rounded-lg p-4 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-sm crt-text mb-3 opacity-60">CATEGORIES</h3>
              <div className="space-y-2">
                {Object.keys(projects.categories || {}).map((cat) => (
                  <div key={cat} className="flex items-center justify-between">
                    <button
                      onClick={() => setActiveCat(cat)}
                      className={`w-full text-left px-3 py-2 rounded transition-all ${activeCat === cat
                          ? "crt-button crt-text"
                          : "text-cyan-400/60 hover:text-cyan-400"
                        }`}
                    >
                      {cat}
                    </button>
                    <button
                      onClick={() => deleteCategory(cat)}
                      className="text-red-400 ml-2 hover:text-red-300 transition-colors p-1 rounded hover:bg-red-400/10"
                      title="Delete category"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <input
                  className="crt-input text-sm mb-2 w-full"
                  placeholder="New category name"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  autoComplete="off"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addCategory();
                  }}
                />
                <button
                  onClick={addCategory}
                  className="crt-button w-full px-3 py-2 rounded flex items-center gap-2 justify-center crt-text"
                >
                  <FolderPlus size={16} /> Add Category
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm crt-text mb-3 opacity-60">ACTIONS</h3>
              <div className="space-y-2">
                <button
                  onClick={initiateSaveConfirmation}
                  disabled={!hasChanges}
                  className="crt-button w-full px-3 py-2 rounded flex items-center gap-2 crt-text disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Save size={16} /> SAVE TO FIREBASE
                </button>
                <button
                  onClick={manualSyncToFirebase}
                  className="crt-button w-full px-3 py-2 rounded flex items-center gap-2 crt-text"
                >
                  <RotateCcw size={16} /> FORCE SYNC
                </button>
                <button
                  onClick={verifyFirebaseData}
                  className="crt-button w-full px-3 py-2 rounded flex items-center gap-2 crt-text"
                >
                  <CheckCircle size={16} /> VERIFY DATA
                </button>
                <button
                  onClick={exportJson}
                  className="crt-button w-full px-3 py-2 rounded flex items-center gap-2 crt-text"
                >
                  <Download size={16} /> EXPORT
                </button>
                <button
                  onClick={resetToDefault}
                  className="crt-button w-full px-3 py-2 rounded flex items-center gap-2 crt-text"
                >
                  <RotateCcw size={16} /> RESET
                </button>
                <label className="crt-button w-full px-3 py-2 rounded flex items-center gap-2 cursor-pointer justify-center crt-text">
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
          </motion.div>

          {/* MAIN CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 crt-panel rounded-lg p-6 overflow-y-auto hide-scrollbar"
          >
            {!previewMode ? (
              // --- EDIT MODE ---
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="crt-text text-xl crt-header">{activeCat}</h2>
                  <button
                    onClick={addProject}
                    className="crt-button px-4 py-2 rounded flex items-center gap-2 crt-text"
                  >
                    <Plus size={16} /> Add Project
                  </button>
                </div>

                <div className="space-y-6">
                  {((projects.categories && projects.categories[activeCat]) || []).map((p, idx) => (
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
                            className="crt-button p-2 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move up"
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button
                            onClick={() => moveProject(idx, 1)}
                            disabled={idx === ((projects.categories && projects.categories[activeCat]) || []).length - 1}
                            className="crt-button p-2 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move down"
                          >
                            <ArrowDown size={16} />
                          </button>
                          <button
                            onClick={() => removeProject(idx)}
                            className="crt-button p-2 rounded text-red-400 hover:bg-red-400/10"
                            title="Delete project"
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
                          autoComplete="off"
                        />
                        <input
                          className="crt-input"
                          value={p.desc}
                          onChange={(e) => updateProject(idx, "desc", e.target.value)}
                          placeholder="Short description"
                          autoComplete="off"
                        />
                      </div>

                      <textarea
                        className="crt-input h-24 mb-3 w-full"
                        value={p.long}
                        onChange={(e) => updateProject(idx, "long", e.target.value)}
                        placeholder="Long description"
                        autoComplete="off"
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
                            autoComplete="off"
                          />
                          <label className="crt-button px-3 py-2 rounded flex items-center gap-2 cursor-pointer crt-text">
                            <ImageIcon size={16} /> Upload
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, idx)}
                            />
                          </label>
                        </div>
                        <div className={`mt-3 rounded-lg border max-h-48 max-w-full object-contain flex items-center justify-center overflow-hidden ${!p.img || p.img.trim() === "" ? 'image-placeholder h-32' : ''
                          }`}>
                          {!p.img || p.img.trim() === "" ? (
                            <div className="text-center p-4">
                              <ImageIcon size={24} className="mx-auto mb-2 opacity-50" />
                              <p className="text-sm opacity-70">No image set</p>
                              <p className="text-xs opacity-50 mt-1">Will use placeholder</p>
                            </div>
                          ) : (
                            <motion.img
                              src={getImageUrl(p.img)}
                              alt="Preview"
                              whileHover={{ scale: 1.05 }}
                              className="w-full h-full object-contain"
                            />
                          )}
                        </div>
                      </div>

                      {/* TECH */}
                      <div className="mb-3">
                        <label className="crt-text text-sm opacity-70">Tech Stack</label>
                        <input
                          type="text"
                          className="crt-input mt-2 w-full"
                          value={p.tech?.join(", ") || ""}
                          onChange={(e) =>
                            updateProject(
                              idx,
                              "tech",
                              e.target.value.split(",").map((t) => t.trim()).filter(t => t)
                            )
                          }
                          placeholder="Comma-separated (e.g., React, Node.js, AWS)"
                          autoComplete="off"
                        />
                      </div>

                      {/* BUTTON STYLE */}
                      <div className="mb-3">
                        <label className="crt-text text-sm opacity-70 flex items-center gap-2">
                          <Palette size={14} />
                          Button Style
                        </label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {buttonStyles.map((style) => (
                            <button
                              key={style.value}
                              type="button"
                              onClick={() => updateProject(idx, "buttonStyle", style.value)}
                              className={`px-3 py-2 rounded text-xs font-medium transition-all ${p.buttonStyle === style.value
                                  ? `${style.value} border-2 border-white scale-105`
                                  : 'crt-button opacity-70 hover:opacity-100'
                                }`}
                              style={{
                                backgroundColor: p.buttonStyle === style.value ? style.color : undefined
                              }}
                            >
                              {style.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* LINKS */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="crt-text text-sm opacity-70 flex items-center gap-2">
                            <Code size={14} />
                            GitHub URL
                          </label>
                          <input
                            className="crt-input mt-1 w-full"
                            value={p.url || ""}
                            onChange={(e) => updateProject(idx, "url", e.target.value)}
                            placeholder="https://github.com/username/repo"
                            autoComplete="off"
                          />
                        </div>
                        <div>
                          <label className="crt-text text-sm opacity-70 flex items-center gap-2">
                            <Globe size={14} />
                            Live Demo URL
                          </label>
                          <input
                            className="crt-input mt-1 w-full"
                            value={p.live || ""}
                            onChange={(e) => updateProject(idx, "live", e.target.value)}
                            placeholder="https://your-project.com"
                            autoComplete="off"
                          />
                        </div>
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
                {((projects.categories && projects.categories[activeCat]) || []).map((p, i) => (
                  <motion.div
                    key={i}
                    onClick={() => setSelectedProject(p)}
                    className="crt-panel p-4 rounded-lg hover:shadow-cyan-400/30 transition-all cursor-pointer"
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className={`w-full h-40 rounded mb-3 overflow-hidden flex items-center justify-center ${!p.img || p.img.trim() === "" ? 'image-placeholder' : ''
                      }`}>
                      {!p.img || p.img.trim() === "" ? (
                        <div className="text-center p-4">
                          <ImageIcon size={32} className="mx-auto mb-2 opacity-30" />
                          <p className="text-sm opacity-50">No Image</p>
                        </div>
                      ) : (
                        <img
                          src={getImageUrl(p.img)}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
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
                    {/* Preview button style */}
                    <div className="mt-3 flex gap-2">
                      {p.url && (
                        <button className={`px-3 py-1 rounded text-xs ${p.buttonStyle || 'btn-html'}`}>
                          View Code
                        </button>
                      )}
                      {p.live && (
                        <button className={`px-3 py-1 rounded text-xs ${p.buttonStyle || 'btn-html'}`}>
                          Live Demo
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* PROJECT DETAILS MODAL */}
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
              className="crt-panel max-w-2xl w-full p-6 overflow-y-auto hide-scrollbar max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="crt-text text-2xl crt-header">{selectedProject.title}</h2>
                <button
                  className="crt-button px-3 py-1 rounded"
                  onClick={() => setSelectedProject(null)}
                >
                  <X size={18} />
                </button>
              </div>
              <div className={`w-full rounded-lg mb-4 border border-cyan-400/30 max-h-64 overflow-hidden flex items-center justify-center ${!selectedProject.img || selectedProject.img.trim() === "" ? 'image-placeholder h-64' : ''
                }`}>
                {!selectedProject.img || selectedProject.img.trim() === "" ? (
                  <div className="text-center p-4">
                    <ImageIcon size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="text-lg opacity-50">No Project Image</p>
                    <p className="text-sm opacity-40 mt-1">Placeholder will be shown</p>
                  </div>
                ) : (
                  <img
                    src={getImageUrl(selectedProject.img)}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
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
                {selectedProject.url ? (
                  <a
                    href={selectedProject.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-2 px-4 py-2 rounded crt-text ${selectedProject.buttonStyle || 'btn-html'}`}
                  >
                    <Github size={16} /> GitHub
                  </a>
                ) : (
                  <span className="flex items-center gap-2 px-4 py-2 crt-text link-placeholder opacity-50">
                    <Github size={16} /> No GitHub link
                  </span>
                )}
                {selectedProject.live ? (
                  <a
                    href={selectedProject.live}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-2 px-4 py-2 rounded crt-text ${selectedProject.buttonStyle || 'btn-html'}`}
                  >
                    <Globe size={16} /> Live Demo
                  </a>
                ) : (
                  <span className="flex items-center gap-2 px-4 py-2 crt-text link-placeholder opacity-50">
                    <Globe size={16} /> No live demo
                  </span>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SAVE CONFIRMATION MODAL */}
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
                  <h3 className="text-xl crt-text crt-header mb-2">CONFIRM SAVE TO FIREBASE</h3>
                  <p className="text-sm crt-text opacity-60">
                    {isOnline
                      ? "Enter admin code to save projects to Firebase."
                      : "🔌 Offline: Cannot save to Firebase without internet connection."}
                  </p>
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto mb-4 space-y-3 hide-scrollbar">
                {pendingChanges.length === 0 ? (
                  <div className="text-sm crt-text opacity-60 text-center py-4">No changes detected</div>
                ) : (
                  pendingChanges.map((path, idx) => (
                    <div key={idx} className="crt-panel p-3 rounded">
                      <div className="text-xs crt-text opacity-60 mb-1">{path}</div>
                      <div className="text-sm crt-text text-cyan-300">
                        Modified section
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-2 mb-4">
                <input
                  type="password"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder="Enter admin code..."
                  className={`w-full crt-input px-4 py-2 rounded ${authError ? 'border-red-400 shake' : ''}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') confirmSaveWithCode();
                  }}
                  autoComplete="off"
                  disabled={!isOnline}
                />
                {authError && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <AlertCircle size={14} />
                    Wrong code! Please try again.
                  </p>
                )}
                {debugMode && (
                  <div className="text-xs text-cyan-400/60 space-y-1">
                    <div>Debug: Admin code ends with ...{adminSecret ? adminSecret.slice(-2) : '??'}</div>
                    <div>Input length: {adminCode.length}</div>
                    <div>Stored length: {adminSecret ? adminSecret.length : 0}</div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setChangesPopupOpen(false);
                    setPendingChanges([]);
                    setAdminCode("");
                    setAuthError(false);
                  }}
                  className="crt-button px-4 py-2 rounded crt-text"
                >
                  CANCEL
                </button>
                <button
                  onClick={confirmSaveWithCode}
                  disabled={isSyncing || !isOnline}
                  className="crt-button px-4 py-2 rounded crt-text bg-cyan-500/20 border-cyan-400 flex items-center gap-2 disabled:opacity-30"
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