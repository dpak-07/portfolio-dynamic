import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [sections, setSections] = useState({
    about: true,
    tech: true,
    projects: true,
    resume: true,
    contact: true,
  });

  // ✅ Load section visibility from localStorage
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "1";
    if (!isAdmin) navigate("/");

    const savedConfig = localStorage.getItem("sectionsConfig");
    if (savedConfig) {
      setSections(JSON.parse(savedConfig));
    }
  }, [navigate]);

  // ✅ Save visibility to localStorage
  const toggleSection = (key) => {
    const updated = { ...sections, [key]: !sections[key] };
    setSections(updated);
    localStorage.setItem("sectionsConfig", JSON.stringify(updated));
  };

  // ✅ Logout admin
  const logout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin/login");
  };

  // ✅ Editor links
  const routes = [
    { name: "Header Editor", path: "/admin/header", color: "from-cyan-500 to-blue-500" },
    { name: "About Editor", path: "/admin/about", color: "from-purple-500 to-pink-500" },
    { name: "Tech Stack Editor", path: "/admin/techadmin", color: "from-green-500 to-emerald-500" },
    { name: "Projects Editor", path: "/admin/projects", color: "from-orange-500 to-amber-500" },
    { name: "Resume Editor", path: "/admin/resume", color: "from-sky-500 to-indigo-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex flex-col items-center py-12 px-4">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-8 text-cyansoft text-center"
      >
        Admin Dashboard
      </motion.h1>

      {/* 🔗 Editor Links */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full"
      >
        {routes.map((r, i) => (
          <motion.div
            key={r.path}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`bg-gradient-to-r ${r.color} p-[1px] rounded-xl shadow-lg transition`}
          >
            <div className="bg-black/80 p-6 rounded-xl text-center">
              <h3 className="text-lg font-semibold mb-2">{r.name}</h3>
              <button
                onClick={() => navigate(r.path)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 transition rounded text-sm text-cyansoft"
              >
                Open Editor
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 🧩 Section Visibility */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-16 w-full max-w-3xl bg-white/5 rounded-2xl p-6 border border-white/10"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-cyansoft">
          Section Visibility Controls
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(sections).map((key, i) => (
            <motion.div
              key={key}
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-between bg-black/40 px-4 py-3 rounded-xl border border-white/10"
            >
              <span className="capitalize text-sm font-medium text-white/80">
                {key} Section
              </span>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={sections[key]}
                  onChange={() => toggleSection(key)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyansoft rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyansoft"></div>
              </label>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 🚪 Logout Button */}
      <motion.button
        onClick={logout}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="mt-12 bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full font-medium transition"
      >
        Logout
      </motion.button>
    </div>
  );
}
