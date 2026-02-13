import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [sections, setSections] = useState({
    home: true,
    about: true,
    "tech-stack": true,
    projects: true,
    resume: true,
    contact: true,
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [terminalText, setTerminalText] = useState("");

  // Matrix rain effect
  const MatrixRain = () => {
    const columns = 40;
    const characters = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-5">
        {[...Array(columns)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-0 text-green-400 font-mono text-xs"
            style={{ left: `${(i / columns) * 100}%` }}
            animate={{
              y: ["0vh", "100vh"],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "linear",
            }}
          >
            {characters.charAt(Math.floor(Math.random() * characters.length))}
          </motion.div>
        ))}
      </div>
    );
  };

  // Terminal typing effect
  useEffect(() => {
    const messages = [
      "SYSTEM INITIALIZED...",
      "LOADING ADMIN PANEL...",
      "ACCESS GRANTED...",
      "WELCOME DEEPAK..."
    ];
    let currentIndex = 0;
    let charIndex = 0;

    const typewriter = setInterval(() => {
      if (currentIndex < messages.length) {
        if (charIndex < messages[currentIndex].length) {
          setTerminalText(prev => prev + messages[currentIndex][charIndex]);
          charIndex++;
        } else {
          setTerminalText(prev => prev + "\n");
          currentIndex++;
          charIndex = 0;
        }
      } else {
        clearInterval(typewriter);
      }
    }, 30);

    return () => clearInterval(typewriter);
  }, []);

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkAuthAndLoadSections = async () => {
      const isAdmin = localStorage.getItem("isAdmin") === "1";
      if (!isAdmin) {
        navigate("/");
        return;
      }

      try {
        setLoading(true);
        const sectionsDoc = await getDoc(doc(db, "sections", "visibility"));
        if (sectionsDoc.exists()) {
          setSections(sectionsDoc.data());
        }
      } catch (error) {
        console.error("Error loading sections:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadSections();
  }, [navigate]);

  const toggleSection = async (key) => {
    try {
      setUpdating(true);
      const updated = { ...sections, [key]: !sections[key] };
      setSections(updated);
      await updateDoc(doc(db, "sections", "visibility"), updated);
    } catch (error) {
      console.error("Error updating section:", error);
      setSections(sections);
    } finally {
      setUpdating(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin/login");
  };

  const routes = [
    { name: "HEADER", path: "/admin/header", code: "0x01", icon: "▲" },
    { name: "ABOUT", path: "/admin/about", code: "0x02", icon: "◆" },
    { name: "TECH.STACK", path: "/admin/techadmin", code: "0x03", icon: "⬢" },
    { name: "PROJECTS", path: "/admin/projects", code: "0x04", icon: "■" },
    { name: "RESUME", path: "/admin/resume", code: "0x05", icon: "▼" },
    { name: "CERTS", path: "/admin/certifications", code: "0x06", icon: "◉" },
    { name: "TIMELINE", path: "/admin/timeline", code: "0x07", icon: "◈" },
    { name: "BLOG", path: "/admin/blog", code: "0x08", icon: "✎" },
    { name: "LINKEDIN", path: "/admin/linkedin", code: "0x09", icon: "◈" },
    { name: "ANALYTICS", path: "/admin/analysis", code: "0x0A", icon: "◎" },
  ];

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <MatrixRain />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 text-center"
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 0 20px #00ff00",
                "0 0 40px #00ff00",
                "0 0 20px #00ff00"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 border-4 border-green-500 rounded-lg mx-auto mb-4 flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-green-500 text-3xl"
            >
              ◎
            </motion.div>
          </motion.div>
          <pre className="text-green-400 font-mono text-xs whitespace-pre-wrap max-w-md">
            {terminalText}
          </pre>
        </motion.div>
      </div>
    );
  }

  const activeSections = Object.values(sections).filter(Boolean).length;
  const totalSections = Object.keys(sections).length;

  return (
    <div className="h-screen bg-black text-green-400 relative overflow-hidden flex flex-col">
      <MatrixRain />

      {/* Scanline effect */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-30">
        <motion.div
          animate={{ y: ["0%", "100%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="h-1 w-full bg-gradient-to-b from-transparent via-green-500/30 to-transparent"
        />
      </div>

      {/* Grid background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(0, 255, 0, 0.05) 25%, rgba(0, 255, 0, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, 0.05) 75%, rgba(0, 255, 0, 0.05) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(0, 255, 0, 0.05) 25%, rgba(0, 255, 0, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, 0.05) 75%, rgba(0, 255, 0, 0.05) 76%, transparent 77%, transparent)
          `,
          backgroundSize: "40px 40px"
        }}
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Compact Top Bar */}
        <motion.div
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          className="border-b border-green-500/30 bg-black/90 backdrop-blur-sm"
        >
          <div className="px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 8px #00ff00",
                      "0 0 15px #00ff00",
                      "0 0 8px #00ff00"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-xl border border-green-500 rounded p-1.5"
                >
                  ◎
                </motion.div>
                <div>
                  <div className="flex items-center gap-2 font-mono text-sm">
                    <span className="text-green-500">[ROOT@ADMIN]</span>
                    <span className="text-green-600">USER:</span>
                    <motion.span
                      className="text-cyan-400 font-bold"
                      animate={{
                        textShadow: [
                          "0 0 5px #00ffff",
                          "0 0 12px #00ffff",
                          "0 0 5px #00ffff"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      deepak
                    </motion.span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right font-mono text-xs">
                  <div className="text-green-600">TIME</div>
                  <div className="text-green-400 font-bold">
                    {currentTime.toLocaleTimeString()}
                  </div>
                </div>

                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 15px #ff0000"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={logout}
                  className="px-3 py-1.5 bg-red-900/30 border border-red-500 text-red-400 font-mono text-xs font-bold hover:bg-red-900/50 transition-all"
                >
                  [ EXIT ]
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content - Single Screen */}
        <div className="flex-1 px-4 py-3 overflow-hidden">
          <div className="h-full grid grid-cols-12 gap-3">
            {/* Left Column - Stats & Sections */}
            <div className="col-span-3 flex flex-col gap-3">
              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-black/60 border border-green-500/30 backdrop-blur-sm p-3"
              >
                <div className="font-mono text-xs">
                  <div className="text-green-400 font-bold mb-2">{'>'} SYSTEM.STATUS</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-green-600">SECTIONS:</span>
                      <span className="text-green-400 font-bold">{activeSections}/{totalSections}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-600">MODULES:</span>
                      <span className="text-green-400 font-bold">{routes.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-600">HEALTH:</span>
                      <span className="text-green-400 font-bold">
                        {((activeSections / totalSections) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-600">STATUS:</span>
                      <motion.span
                        className="text-green-400 font-bold"
                        animate={{
                          textShadow: [
                            "0 0 5px #00ff00",
                            "0 0 10px #00ff00",
                            "0 0 5px #00ff00"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        ONLINE
                      </motion.span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Section Visibility */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex-1 bg-black/60 border border-green-500/30 backdrop-blur-sm p-3 overflow-y-auto"
              >
                <div className="font-mono text-xs mb-2 text-green-400 font-bold flex items-center justify-between">
                  <span>{'>'} SECTIONS</span>
                  {updating && (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="text-green-500"
                    >
                      ◎
                    </motion.span>
                  )}
                </div>
                <div className="space-y-1.5">
                  {Object.entries(sections).map(([key, value]) => (
                    <div
                      key={key}
                      className={`border p-2 transition-all ${value
                          ? "border-green-500/50 bg-green-900/20"
                          : "border-green-500/20 bg-black/40"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <motion.div
                            animate={value ? {
                              boxShadow: [
                                "0 0 3px #00ff00",
                                "0 0 6px #00ff00",
                                "0 0 3px #00ff00"
                              ]
                            } : {}}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className={`w-2 h-2 rounded-full ${value ? "bg-green-400" : "bg-gray-600"}`}
                          />
                          <span className="uppercase text-[10px] text-green-400">
                            {key.replace("-", "_")}
                          </span>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleSection(key)}
                          disabled={updating}
                          className={`px-2 py-0.5 border text-[9px] font-bold ${value
                              ? "border-green-500 text-green-400 bg-green-900/30"
                              : "border-gray-600 text-gray-500 bg-gray-900/30"
                            }`}
                        >
                          {value ? "ON" : "OFF"}
                        </motion.button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Control Modules */}
            <div className="col-span-9">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="h-full bg-black/60 border border-green-500/30 backdrop-blur-sm p-4"
              >
                <div className="font-mono text-sm mb-3 text-green-400 font-bold">
                  {'>'} CONTROL.MODULES <span className="text-green-600 text-xs ml-2">[{routes.length}]</span>
                </div>

                <div className="grid grid-cols-4 gap-3 h-[calc(100%-2rem)]">
                  {routes.map((route, index) => (
                    <motion.button
                      key={route.path}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.03 }}
                      whileHover={{
                        scale: 1.03,
                        boxShadow: "0 0 15px #00ff00",
                        borderColor: "#00ff00"
                      }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate(route.path)}
                      className="bg-black/60 border border-green-500/30 backdrop-blur-sm p-3 text-left font-mono relative overflow-hidden group hover:bg-green-900/20 transition-all flex flex-col justify-between"
                    >
                      <motion.div
                        className="absolute inset-0 bg-green-500/10"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.5 }}
                      />

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl text-green-500">{route.icon}</span>
                          <span className="text-[10px] text-green-600">{route.code}</span>
                        </div>
                        <div className="text-green-400 font-bold text-xs mb-1">{route.name}</div>
                        <div className="text-[10px] text-green-600">
                          {'>'} ACCESS
                        </div>
                      </div>

                      {/* Corner brackets */}
                      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-green-500/30 bg-black/90 px-4 py-1.5">
          <p className="text-center font-mono text-[10px] text-green-600">
            {'>'} SYSTEM © 2025 | v2.0.1 | NODE: ACTIVE_
          </p>
        </div>
      </div>
    </div>
  );
}