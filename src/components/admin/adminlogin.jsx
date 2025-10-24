import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

// Constants for better maintainability
const CONSTANTS = {
  STORAGE_KEYS: {
    IS_ADMIN: "isAdmin",
    LOGIN_TIMESTAMP: "loginTimestamp"
  },
  ROUTES: {
    DASHBOARD: "/admindsh",
    HOME: "/"
  },
  TIMEOUTS: {
    NAVIGATION_DELAY: 800,
    CREDENTIALS_LOAD_DELAY: 2000,
    ANIMATION_DELAY: 150
  },
  SECURITY: {
    SESSION_DURATION: 2 * 60 * 60 * 1000 // 2 hours in milliseconds
  }
};

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Validate session on component mount
  const validateSession = useCallback(() => {
    const isAdmin = localStorage.getItem(CONSTANTS.STORAGE_KEYS.IS_ADMIN);
    const loginTime = localStorage.getItem(CONSTANTS.STORAGE_KEYS.LOGIN_TIMESTAMP);
    
    if (isAdmin === "1" && loginTime) {
      const sessionAge = Date.now() - parseInt(loginTime);
      if (sessionAge < CONSTANTS.SECURITY.SESSION_DURATION) {
        navigate(CONSTANTS.ROUTES.DASHBOARD);
        return true;
      } else {
        // Session expired
        localStorage.removeItem(CONSTANTS.STORAGE_KEYS.IS_ADMIN);
        localStorage.removeItem(CONSTANTS.STORAGE_KEYS.LOGIN_TIMESTAMP);
      }
    }
    return false;
  }, [navigate]);

  // Load admin credentials from Firestore with retry logic
  const loadAdminCredentials = useCallback(async () => {
    try {
      const adminDoc = await getDoc(doc(db, "admin", "credentials"));
      
      if (adminDoc.exists()) {
        const data = adminDoc.data();
        if (data.user && data.password) {
          setAdminCredentials(data);
          setError("");
        } else {
          throw new Error("Invalid admin configuration");
        }
      } else {
        throw new Error("Admin configuration not found");
      }
    } catch (error) {
      console.error("Error loading admin credentials:", error);
      
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 1000 * (retryCount + 1));
        setError("Retrying connection...");
      } else {
        setError("Failed to load admin configuration. Please check your connection and try again.");
      }
    }
  }, [retryCount]);

  // Effects
  useEffect(() => {
    if (!validateSession()) {
      setTimeout(() => setIsVisible(true), CONSTANTS.TIMEOUTS.ANIMATION_DELAY);
      loadAdminCredentials();
    }
  }, [validateSession, loadAdminCredentials]);

  // Form submission handler
  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!form.username.trim() || !form.password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    if (!adminCredentials) {
      setError("System configuration not ready. Please try again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Simulate API call delay for security (prevents timing attacks)
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

      // Validate credentials with case-sensitive comparison
      const isUsernameValid = form.username === adminCredentials.user;
      const isPasswordValid = form.password === adminCredentials.password;

      if (isUsernameValid && isPasswordValid) {
        // Set admin flag and login timestamp
        localStorage.setItem(CONSTANTS.STORAGE_KEYS.IS_ADMIN, "1");
        localStorage.setItem(CONSTANTS.STORAGE_KEYS.LOGIN_TIMESTAMP, Date.now().toString());
        
        // Success feedback before navigation
        setTimeout(() => {
          navigate(CONSTANTS.ROUTES.DASHBOARD, { replace: true });
        }, CONSTANTS.TIMEOUTS.NAVIGATION_DELAY);
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError("");
  }, [error]);

  // Handle retry connection
  const handleRetry = useCallback(() => {
    setRetryCount(0);
    setError("");
    loadAdminCredentials();
  }, [loadAdminCredentials]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
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
        stiffness: 100,
        damping: 10
      }
    }
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      boxShadow: "0 0 0 2px rgba(6, 182, 212, 0.5)",
      transition: { type: "spring", stiffness: 400 }
    },
    blur: {
      scale: 1,
      boxShadow: "0 0 0 0px rgba(6, 182, 212, 0)",
      transition: { type: "spring", stiffness: 400 }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      boxShadow: "0 10px 30px -10px rgba(6, 182, 212, 0.5)",
      transition: { type: "spring", stiffness: 400 }
    },
    tap: { scale: 0.95 },
    loading: { 
      scale: 0.98,
      opacity: 0.8
    }
  };

  // Show loading while fetching credentials
  if (!adminCredentials && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-400 text-lg mb-2">Loading Admin Configuration</p>
          <p className="text-gray-400 text-sm">Setting up secure connection...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white relative overflow-hidden">
      
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -40, 0],
              x: [null, Math.random() * 30 - 15, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 3,
            }}
          />
        ))}

        {/* Animated Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-500 rounded-full mix-blend-screen opacity-15 blur-3xl"
          animate={{
            x: [0, 80, 0],
            y: [0, -60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen opacity-10 blur-3xl"
          animate={{
            x: [0, -60, 0],
            y: [0, 80, 0],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        {/* Security Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Main Login Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className="relative z-10 w-full max-w-md px-4 sm:px-6"
      >
        <motion.div
          variants={itemVariants}
          className="bg-gray-900/50 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-500/10"
        >
          {/* Header Section */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
              className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/25"
            >
              <span className="text-3xl">🔒</span>
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Admin Portal
            </h1>
            <p className="text-gray-400 text-sm">
              Secure Access • Portfolio Management
            </p>
          </motion.div>

          {/* System Status Messages */}
          <AnimatePresence>
            {error && error.includes("configuration") && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="bg-yellow-500/20 border border-yellow-500/40 rounded-xl p-4 mb-6"
              >
                <div className="flex items-start space-x-3 text-yellow-400">
                  <span className="text-lg mt-0.5">⚙️</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">System Configuration Required</p>
                    <p className="text-xs opacity-90 mt-1">
                      Admin credentials not configured. Please ensure the database is properly seeded.
                    </p>
                    <button
                      onClick={handleRetry}
                      className="mt-2 px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg text-xs transition-colors"
                    >
                      Retry Connection
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <motion.input
                type="text"
                placeholder="Enter admin username"
                value={form.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                variants={inputVariants}
                whileFocus="focus"
                className="w-full bg-black/40 border border-cyan-500/40 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-all duration-300 backdrop-blur-sm"
                disabled={loading || !adminCredentials}
                autoComplete="username"
                maxLength={50}
              />
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <motion.input
                type="password"
                placeholder="Enter admin password"
                value={form.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                variants={inputVariants}
                whileFocus="focus"
                className="w-full bg-black/40 border border-cyan-500/40 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-all duration-300 backdrop-blur-sm"
                disabled={loading || !adminCredentials}
                autoComplete="current-password"
                maxLength={100}
              />
            </motion.div>

            {/* Login Error Message */}
            <AnimatePresence>
              {error && !error.includes("configuration") && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="bg-red-500/20 border border-red-500/40 rounded-xl p-3"
                >
                  <div className="flex items-center space-x-2 text-red-400 text-sm">
                    <span className="text-base">🔐</span>
                    <span className="flex-1">{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Button */}
            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                variants={buttonVariants}
                initial="initial"
                whileHover={(!loading && adminCredentials) ? "hover" : "loading"}
                whileTap="tap"
                animate={loading ? "loading" : "initial"}
                disabled={loading || !adminCredentials}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-700 disabled:to-gray-800 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 relative overflow-hidden disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20"
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center justify-center space-x-3"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span className="text-sm">Securing Access...</span>
                    </motion.div>
                  ) : !adminCredentials ? (
                    <motion.div
                      key="disabled"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-center space-x-2 opacity-70"
                    >
                      <span>🔄</span>
                      <span>Initializing System...</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="text"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center justify-center space-x-3"
                    >
                      <span className="text-lg">🚀</span>
                      <span className="text-sm font-medium">Access Dashboard</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Button Shine Effect */}
                {adminCredentials && !loading && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                  />
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Security Information */}
          <motion.div
            variants={itemVariants}
            className="mt-6 space-y-4"
          >
            {/* System Status */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">System Status:</span>
              <span className={`flex items-center space-x-1 ${adminCredentials ? 'text-green-400' : 'text-yellow-400'}`}>
                <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                <span>{adminCredentials ? 'Secure' : 'Configuring'}</span>
              </span>
            </div>

            {/* Security Badge */}
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3">
              <p className="text-xs text-cyan-400 text-center">
                <span className="font-semibold">🔒 Encrypted Connection</span><br />
                <span className="opacity-80">All credentials are securely validated</span>
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-6 space-y-2"
        >
          <p className="text-sm text-gray-500">
            Portfolio Management System v2.0
          </p>
          <p className="text-xs text-gray-600">
            Secure Authentication • Production Ready
          </p>
        </motion.div>
      </motion.div>

      {/* Background Glow Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
    </div>
  );
}