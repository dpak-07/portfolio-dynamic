import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Github, Loader2 } from "lucide-react"
import { useFirestoreData } from "@/hooks/useFirestoreData"

export default function Projects() {
  const placeholder = "images/placeholder.jpg"

  // 🔥 Fetch projects from Firestore
  const { data: projectsData, loading: firestoreLoading, error: firestoreError } = useFirestoreData('projects', 'data')

  // Parse Firestore data or use empty categories
  const categories = projectsData?.categories || {
    "Cloud / Backend": [],
    "Full-Stack": [],
    "Frontend": [],
    "Data / ML": [],
  }

  const [active, setActive] = useState("Cloud / Backend")
  const [open, setOpen] = useState(null)
  const [loading, setLoading] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleImageError = (e) => (e.target.src = placeholder)

  const handleCategoryChange = (cat) => {
    setLoading(true)
    setTimeout(() => {
      setActive(cat)
      setLoading(false)
      setCurrentIndex(0)
    }, 600)
  }

  const handleSwipe = (direction, total) => {
    if (direction === "left") {
      setCurrentIndex((prev) => (prev + 1) % total)
    } else if (direction === "right") {
      setCurrentIndex((prev) => (prev - 1 + total) % total)
    }
  }

  // Show error state if Firestore fails
  if (firestoreError) {
    return (
      <section id="projects" className="relative min-h-screen py-20 px-6 overflow-hidden bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#101010]">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(0,255,255,0.1),transparent_70%)]"
          animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        />
        <div className="relative z-10 text-center">
          <h2 className="text-3xl font-bold text-red-400 mb-4">Failed to Load Projects</h2>
          <p className="text-white/70">{firestoreError}</p>
        </div>
      </section>
    )
  }

  return (
    <section
      id="projects"
      className="relative min-h-screen py-20 px-6 overflow-hidden bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#101010]"
    >
      {/* Floating background glow */}
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

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {Object.keys(categories).map((cat) => (
          <motion.button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            whileHover={{ scale: 1.08 }}
            className={`relative px-5 py-2.5 rounded-full text-sm sm:text-lg font-semibold transition-all duration-300 ${
              active === cat
                ? "bg-gradient-to-r from-cyan-400 to-purple-600 text-black shadow-[0_0_15px_rgba(0,255,255,0.6)]"
                : "text-white/70 border border-white/10 hover:text-cyan-300"
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Loader */}
      <AnimatePresence>
        {loading || firestoreLoading && (
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

      {/* 🟩 Desktop Grid + Mobile Carousel */}
      <AnimatePresence mode="wait">
        {!loading && !firestoreLoading && (
          <>
            {/* Desktop Grid */}
            <motion.div
              key={active + "-desktop"}
              className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              {categories[active]?.map((p, i) => (
                <ProjectCard key={p.title} p={p} i={i} setOpen={setOpen} handleImageError={handleImageError} />
              ))}
            </motion.div>

            {/* Mobile Carousel */}
            <motion.div
              key={active + "-mobile"}
              className="sm:hidden relative overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="flex"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, info) => {
                  if (info.offset.x < -50) handleSwipe("left", categories[active].length)
                  else if (info.offset.x > 50) handleSwipe("right", categories[active].length)
                }}
                animate={{ x: `-${currentIndex * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {categories[active]?.map((p, i) => (
                  <div key={p.title} className="min-w-full px-4">
                    <ProjectCard p={p} i={i} setOpen={setOpen} handleImageError={handleImageError} />
                  </div>
                ))}
              </motion.div>

              {/* Progress Dots */}
              <div className="flex justify-center mt-6 gap-2">
                {categories[active]?.map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      i === currentIndex ? "bg-cyan-400 scale-125" : "bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {open && <ProjectModal open={open} setOpen={setOpen} handleImageError={handleImageError} />}
      </AnimatePresence>
    </section>
  )
}

/* 🔹 Project Card */
function ProjectCard({ p, i, setOpen, handleImageError }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: i * 0.1 }}
      className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl overflow-hidden relative shadow-lg hover:shadow-cyan-400/30 transition-all duration-500 hover:-translate-y-2"
    >
      <div className="relative max-h-56 overflow-hidden">
        {!imgLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-[#111] via-[#1a1a1a] to-[#111]" />
        )}
        <motion.img
          src={p.img}
          alt={p.title}
          onLoad={() => setImgLoaded(true)}
          onError={handleImageError}
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{
            opacity: imgLoaded ? 1 : 0,
            filter: imgLoaded ? "blur(0px)" : "blur(10px)",
          }}
          transition={{ duration: 0.6 }}
          className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-700"
        />
      </div>

      <div className="p-5 text-left">
        <h3 className="text-xl font-bold text-white">{p.title}</h3>
        <p className="text-white/60 mt-2 text-sm">{p.desc}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {p.tech.map((t) => (
            <span key={t} className="text-xs bg-white/10 px-2 py-1 rounded-full border border-white/20 text-white/80">
              {t}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center mt-5">
          {p.url ? (
            <a href={p.url} target="_blank" rel="noreferrer" className="text-cyan-400 text-sm flex items-center gap-1 hover:underline">
              <Github size={16} /> Repo
            </a>
          ) : (
            <span className="text-gray-400 italic text-sm">Private</span>
          )}
          <button onClick={() => setOpen(p)} className="text-white/60 hover:text-cyan-400 transition">
            View →
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/* 🔹 Modal */
function ProjectModal({ open, setOpen, handleImageError }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-lg" onClick={() => setOpen(null)} />
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: -30 }}
        transition={{ duration: 0.4, type: "spring" }}
        className="relative z-10 bg-gradient-to-br from-[#111] to-[#1c1c1c] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl overflow-y-auto max-h-[90vh]"
      >
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-stretch">
          <div className="flex-shrink-0 w-full sm:w-2/5 relative">
            {!loaded && <div className="absolute inset-0 animate-pulse bg-[#1a1a1a]" />}
            <motion.img
              src={open.img}
              alt={open.title}
              onLoad={() => setLoaded(true)}
              onError={handleImageError}
              initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              animate={{
                opacity: loaded ? 1 : 0,
                scale: loaded ? 1 : 1.1,
                filter: loaded ? "blur(0px)" : "blur(10px)",
              }}
              transition={{ duration: 0.6 }}
              className="w-full h-auto rounded-xl object-contain shadow-lg border border-white/10"
            />
          </div>

          <div className="flex flex-col justify-between w-full">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">{open.title}</h3>
              <p className="text-white/80 mb-4 text-sm sm:text-base leading-relaxed">{open.long}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {open.tech.map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs border border-white/20">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-auto">
              {open.live && (
                <a href={open.live} target="_blank" rel="noreferrer" className="bg-green-500 px-4 py-2 rounded-md font-semibold text-white shadow hover:shadow-green-400/40 transition">
                  Live Site
                </a>
              )}
              {open.url ? (
                <a href={open.url} target="_blank" rel="noreferrer" className="bg-cyan-400 px-4 py-2 rounded-md font-semibold text-black shadow hover:shadow-cyan-400/40 transition flex items-center gap-2">
                  <Github size={18} /> GitHub
                </a>
              ) : (
                <span className="text-gray-400 italic self-center">Private Repo</span>
              )}
              <button onClick={() => setOpen(null)} className="border border-white/20 text-white px-4 py-2 rounded-md hover:bg-white/10 transition">
                Close
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}