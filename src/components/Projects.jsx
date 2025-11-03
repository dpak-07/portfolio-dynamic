"use client";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Github, Loader2, Menu, X, ExternalLink } from "lucide-react";
import { useFirestoreData } from "@/hooks/useFirestoreData";
import { logSectionView, logLinkClick } from "../utils/analytics"; // ✅ analytics import

export default function Projects() {
  const defaultImage =
    "https://1drv.ms/i/c/b09eaa48933f939d/IQTVWsrWzihRTr9b3RLtF1MuAauLX3J_kLQRQq7tOBjPxmc?width=300&height=168";

  const { data: projectsData, loading: firestoreLoading, error: firestoreError } =
    useFirestoreData("projects", "data");

  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { once: true, amount: 0.3 });

  // ✅ Track when Projects section enters viewport
  useEffect(() => {
    if (sectionInView) {
      logSectionView("projects");
    }
  }, [sectionInView]);

  // 🧠 Compute categories from Firestore
  const categories = useMemo(() => {
    const rawCategories = projectsData?.categories || {
      "Cloud & Backend": [],
      "Team Leadership": [],
      "Full-Stack Applications": [],
      "AI/ML & Security": [],
      "Blockchain & Innovation": [],
      "Frontend & Tools": [],
    };

    const allProjects = Object.values(rawCategories).flat();
    return {
      All: allProjects,
      ...rawCategories,
    };
  }, [projectsData]);

  const [active, setActive] = useState("All");
  const [open, setOpen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleImageError = useCallback((e) => {
    e.target.src = defaultImage;
  }, []);

  const handleCategoryChange = useCallback((cat) => {
    setLoading(true);
    setMobileMenuOpen(false);
    setTimeout(() => {
      setActive(cat);
      setLoading(false);
      setCurrentIndex(0);
    }, 600);
  }, []);

  const handleSwipe = useCallback((direction, total) => {
    if (direction === "left") {
      setCurrentIndex((prev) => (prev + 1) % total);
    } else if (direction === "right") {
      setCurrentIndex((prev) => (prev - 1 + total) % total);
    }
  }, []);

  if (firestoreError) {
    return (
      <section
        id="projects"
        className="relative min-h-screen py-20 px-6 overflow-hidden bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#101010]"
      >
        <div className="relative z-10 text-center">
          <h2 className="text-3xl font-bold text-red-400 mb-4">
            Failed to Load Projects
          </h2>
          <p className="text-white/70">{firestoreError}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative min-h-screen py-20 px-6 overflow-hidden bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#101010]"
    >
      {/* ✨ Floating Glow */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(0,255,255,0.1),transparent_70%)]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      />

      {/* Header */}
      <motion.div
        className="relative z-10 text-center mb-14"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient">
          My Projects
        </h2>
        <p className="text-white/70 mt-3 text-sm sm:text-base">
          Explore some of my major works across different domains
        </p>
      </motion.div>

      {/* Desktop Tabs */}
      <div className="hidden sm:flex flex-wrap justify-center gap-4 mb-10">
        {Object.keys(categories).map((cat) => (
          <motion.button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            whileHover={{ scale: 1.08 }}
            className={`relative px-5 py-2.5 rounded-full text-sm sm:text-lg font-semibold transition-all duration-300 ${
              active === cat
                ? "bg-gradient-to-r from-cyan-400 to-purple-600 text-black shadow-[0_0_15px_rgba(0,255,255,0.6)]"
                : "text-white/70 border border-white/10 hover:text-cyan-300 hover:border-cyan-400/30"
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Mobile Dropdown */}
      <div className="sm:hidden relative mb-8 max-w-xs mx-auto">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl px-4 py-3 text-white flex items-center justify-between hover:border-cyan-400/30 transition-colors"
        >
          <span>{active}</span>
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden z-20"
            >
              {Object.keys(categories).map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`w-full text-left px-4 py-3 transition-colors ${
                    active === cat
                      ? "bg-cyan-400/20 text-cyan-300 border-l-4 border-cyan-400"
                      : "text-white/70 hover:text-cyan-300 hover:bg-white/5"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loader */}
      <AnimatePresence>
        {(loading || firestoreLoading) && (
          <motion.div
            key="loader"
            className="flex justify-center items-center h-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            >
              <Loader2 size={40} className="text-cyan-400" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Cards */}
      <AnimatePresence mode="wait">
        {!loading && !firestoreLoading && (
          <motion.div
            key={active}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            {categories[active]?.map((p, i) => (
              <ProjectCard
                key={p.title}
                p={p}
                i={i}
                setOpen={setOpen}
                handleImageError={handleImageError}
                defaultImage={defaultImage}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <ProjectModal
            open={open}
            setOpen={setOpen}
            handleImageError={handleImageError}
            defaultImage={defaultImage}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/* 🔹 Project Card */
function ProjectCard({ p, i, setOpen, handleImageError, defaultImage }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleImageLoad = useCallback(() => setImgLoaded(true), []);
  const handleImageErrorInternal = useCallback(
    (e) => handleImageError(e),
    [handleImageError]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: i * 0.1 }}
      className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl overflow-hidden relative shadow-lg hover:shadow-cyan-400/30 transition-all duration-500 hover:-translate-y-2"
    >
      <div className="relative h-48 overflow-hidden">
        <motion.img
          src={p.img || defaultImage}
          alt={p.title}
          onLoad={handleImageLoad}
          onError={handleImageErrorInternal}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>

      <div className="p-5 text-left">
        <h3 className="text-xl font-bold text-white mb-2">{p.title}</h3>
        <p className="text-white/60 text-sm line-clamp-2 mb-3">{p.desc}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {p.tech?.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-xs bg-white/10 px-2 py-1 rounded-full border border-white/20 text-white/80"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center">
          {p.url ? (
            <a
              href={p.url}
              target="_blank"
              rel="noreferrer"
              onClick={() => logLinkClick("project_github")}
              className="text-cyan-400 text-sm flex items-center gap-1 hover:text-cyan-300 transition-colors group/link"
            >
              <Github size={16} />
              <span className="group-hover/link:underline">Code</span>
            </a>
          ) : (
            <span className="text-gray-400 italic text-sm">Private Repo</span>
          )}
          <button
            onClick={() => {
              setOpen(p);
              logLinkClick("project_details");
            }}
            className="text-white/60 hover:text-cyan-400 transition-colors hover:scale-110 flex items-center gap-1 group/btn"
          >
            <span>Details</span>
            <motion.span
              initial={{ x: 0 }}
              whileHover={{ x: 3 }}
              transition={{ duration: 0.2 }}
            >
              →
            </motion.span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* 🔹 Modal */
function ProjectModal({ open, setOpen, handleImageError, defaultImage }) {
  const [loaded, setLoaded] = useState(false);

  const handleImageLoad = useCallback(() => setLoaded(true), []);
  const handleImageErrorInternal = useCallback(
    (e) => handleImageError(e),
    [handleImageError]
  );

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-lg"
        onClick={() => setOpen(null)}
      />
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: -30 }}
        transition={{ duration: 0.4, type: "spring" }}
        className="relative z-10 bg-gradient-to-br from-[#111] to-[#1c1c1c] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl overflow-y-auto max-h-[90vh]"
      >
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="w-full lg:w-2/5 flex-shrink-0">
            <motion.img
              src={open.img || defaultImage}
              alt={open.title}
              onLoad={handleImageLoad}
              onError={handleImageErrorInternal}
              className="w-full h-64 sm:h-72 object-cover rounded-xl border border-white/10"
            />
          </div>

          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-3">
              {open.title}
            </h3>
            <p className="text-white/80 text-sm mb-4">{open.long || open.desc}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {open.tech?.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1.5 rounded-full bg-white/10 text-white/70 text-xs border border-white/20"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {open.live && (
                <a
                  href={open.live}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => logLinkClick("project_live")}
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 px-5 py-2.5 rounded-xl font-semibold text-white shadow-lg hover:scale-105 transition-all"
                >
                  <ExternalLink size={18} />
                  <span>Live Demo</span>
                </a>
              )}
              {open.url && (
                <a
                  href={open.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => logLinkClick("project_github")}
                  className="flex items-center justify-center gap-2 bg-cyan-400 hover:bg-cyan-500 px-5 py-2.5 rounded-xl font-semibold text-black shadow-lg hover:scale-105 transition-all"
                >
                  <Github size={18} />
                  <span>Source Code</span>
                </a>
              )}
              <button
                onClick={() => setOpen(null)}
                className="flex items-center justify-center gap-2 border border-white/20 text-white px-5 py-2.5 rounded-xl hover:bg-white/10 transition-all"
              >
                <X size={18} />
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
