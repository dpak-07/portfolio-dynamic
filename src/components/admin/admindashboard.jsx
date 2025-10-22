import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase"; // Adjust path to your Firebase config

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

  // ✅ Load section visibility from Firestore
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

  // ✅ Save visibility to Firestore
  const toggleSection = async (key) => {
    try {
      setUpdating(true);
      const updated = { ...sections, [key]: !sections[key] };
      setSections(updated);
      
      await updateDoc(doc(db, "sections", "visibility"), updated);
      
      // Show success feedback
      const event = new CustomEvent('showToast', {
        detail: {
          message: `${key} section ${!sections[key] ? 'enabled' : 'disabled'}`,
          type: 'success'
        }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error("Error updating section:", error);
      // Revert on error
      setSections(sections);
      
      const event = new CustomEvent('showToast', {
        detail: {
          message: 'Failed to update section',
          type: 'error'
        }
      });
      window.dispatchEvent(event);
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Logout admin
  const logout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin/login");
  };

  // ✅ Editor links with icons
  const routes = [
    { 
      name: "Header Editor", 
      path: "/admin/header", 
      color: "from-cyan-500 to-blue-500",
      icon: "🚀"
    },
    { 
      name: "About Editor", 
      path: "/admin/about", 
      color: "from-purple-500 to-pink-500",
      icon: "👤"
    },
    { 
      name: "Tech Stack Editor", 
      path: "/admin/techadmin", 
      color: "from-green-500 to-emerald-500",
      icon: "⚙️"
    },
    { 
      name: "Projects Editor", 
      path: "/admin/projects", 
      color: "from-orange-500 to-amber-500",
      icon: "💼"
    },
    { 
      name: "Resume Editor", 
      path: "/admin/resume", 
      color: "from-sky-500 to-indigo-500",
      icon: "📄"
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const toggleVariants = {
    off: { scale: 1, backgroundColor: "#4B5563" },
    on: { scale: 1.05, backgroundColor: "#06B6D4" }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-cyansoft border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyansoft text-lg">Loading Dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex flex-col items-center py-12 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-gray-400 text-lg">Manage your portfolio content and visibility</p>
      </motion.div>

      {/* 🔗 Editor Links */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full mb-16"
      >
        {routes.map((route) => (
          <motion.div
            key={route.path}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              y: -5,
              transition: { type: "spring", stiffness: 300 }
            }}
            whileTap={{ scale: 0.95 }}
            className={`bg-gradient-to-r ${route.color} p-[1px] rounded-2xl shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300`}
          >
            <div className="bg-gray-900/90 backdrop-blur-sm p-6 rounded-2xl h-full flex flex-col">
              <div className="text-3xl mb-3">{route.icon}</div>
              <h3 className="text-xl font-semibold mb-4 text-white">{route.name}</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(route.path)}
                className="mt-auto px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-medium transition-all duration-300 text-white hover:text-cyan-300"
              >
                Open Editor
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 🧩 Section Visibility */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="w-full max-w-4xl bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-cyan-500/20 shadow-2xl"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Section Visibility
          </h2>
          <p className="text-gray-400">Toggle sections on/off for your portfolio</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {Object.entries(sections).map(([key, value]) => (
            <motion.div
              key={key}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-between bg-black/40 px-5 py-4 rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${value ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
                <span className="capitalize text-sm font-medium text-white/90">
                  {key.replace('-', ' ')}
                </span>
              </div>

              <motion.label
                className="relative inline-flex items-center cursor-pointer"
                animate={value ? "on" : "off"}
                variants={toggleVariants}
                whileTap={{ scale: 0.9 }}
              >
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => toggleSection(key)}
                  disabled={updating}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-lg"></div>
              </motion.label>
            </motion.div>
          ))}
        </motion.div>

        {/* Status Indicator */}
        <AnimatePresence>
          {updating && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center mt-6 space-x-2 text-cyan-400"
            >
              <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Updating...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 🚪 Logout Button */}
      <motion.button
        onClick={logout}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        whileHover={{ 
          scale: 1.05,
          backgroundColor: "#DC2626",
          transition: { type: "spring", stiffness: 300 }
        }}
        whileTap={{ scale: 0.95 }}
        className="mt-12 bg-red-600 hover:bg-red-700 px-8 py-3 rounded-2xl font-semibold transition-all duration-300 border border-red-500/20 shadow-lg flex items-center space-x-2"
      >
        <span>🚪</span>
        <span>Logout</span>
      </motion.button>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 text-center text-gray-500 text-sm"
      >
        <p>{Object.values(sections).filter(Boolean).length} of {Object.keys(sections).length} sections active</p>
      </motion.div>
    </div>
  );
}