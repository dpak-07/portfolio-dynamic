import { useState, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Github, Loader2, Menu, X, ExternalLink } from "lucide-react"
import { useFirestoreData } from "@/hooks/useFirestoreData"

export default function Projects() {
  const defaultImage = "https://1drv.ms/i/c/b09eaa48933f939d/IQTVWsrWzihRTr9b3RLtF1MuAauLX3J_kLQRQq7tOBjPxmc?width=300&height=168"

  // 🔥 Fetch projects from Firestore
  const { data: projectsData, loading: firestoreLoading, error: firestoreError } = useFirestoreData('projects', 'data')

  // Parse Firestore data with useMemo to prevent unnecessary recalculations
  const categories = useMemo(() => {
    const rawCategories = projectsData?.categories || {
      "Cloud & Backend": [],
      "Team Leadership": [],
      "Full-Stack Applications": [],
      "AI/ML & Security": [],
      "Blockchain & Innovation": [],
      "Frontend & Tools": [],
    }

    // Create "All" category by combining all projects
    const allProjects = Object.values(rawCategories).flat()
    
    // Return with "All" first, then the rest in the specified order
    return {
      "All": allProjects,
      ...rawCategories
    }
  }, [projectsData])

  const [active, setActive] = useState("All")
  const [open, setOpen] = useState(null)
  const [loading, setLoading] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleImageError = useCallback((e) => {
    e.target.src = defaultImage
  }, [defaultImage])

  const handleCategoryChange = useCallback((cat) => {
    setLoading(true)
    setMobileMenuOpen(false)
    setTimeout(() => {
      setActive(cat)
      setLoading(false)
      setCurrentIndex(0)
    }, 600)
  }, [])

  const handleSwipe = useCallback((direction, total) => {
    if (direction === "left") {
      setCurrentIndex((prev) => (prev + 1) % total)
    } else if (direction === "right") {
      setCurrentIndex((prev) => (prev - 1 + total) % total)
    }
  }, [])

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

      {/* 🟩 Desktop Grid + Mobile Carousel */}
      <AnimatePresence mode="wait">
        {!loading && !firestoreLoading && (
          <>
            {/* Desktop Grid */}
            <motion.div
              key={active + "-desktop"}
              className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
                    <ProjectCard 
                      p={p} 
                      i={i} 
                      setOpen={setOpen} 
                      handleImageError={handleImageError}
                      defaultImage={defaultImage}
                    />
                  </div>
                ))}
              </motion.div>

              {/* Enhanced Progress Bar */}
              {categories[active]?.length > 1 && (
                <div className="mt-6 px-4">
                  <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ 
                        width: `${((currentIndex + 1) / categories[active].length) * 100}%` 
                      }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-white/60 text-sm">
                      {currentIndex + 1} / {categories[active].length}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleSwipe("right", categories[active].length)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
                      >
                        ←
                      </button>
                      <button
                        onClick={() => handleSwipe("left", categories[active].length)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
                      >
                        →
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </>
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
  )
}

/* 🔹 Optimized Project Card with Faster Image Loading */
function ProjectCard({ p, i, setOpen, handleImageError, defaultImage }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  
  // Use default image if no image provided
  const imageSrc = p.img || defaultImage

  const handleImageLoad = useCallback(() => {
    setImgLoaded(true)
  }, [])

  const handleImageErrorInternal = useCallback((e) => {
    setImgError(true)
    handleImageError(e)
  }, [handleImageError])

  // Preload image immediately on component mount
  useState(() => {
    const img = new Image()
    img.src = imageSrc
    img.onload = handleImageLoad
    img.onerror = handleImageErrorInternal
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: i * 0.1 }}
      className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl overflow-hidden relative shadow-lg hover:shadow-cyan-400/30 transition-all duration-500 hover:-translate-y-2"
    >
      <div className="relative h-48 overflow-hidden">
        {/* Image Loading Spinner */}
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-[#111] via-[#1a1a1a] to-[#111] z-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full"
            />
          </div>
        )}
        
        {/* Fallback for image error */}
        {imgError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-[#111] via-[#1a1a1a] to-[#111] z-10">
            <div className="text-center text-white/50">
              <div className="w-12 h-12 mx-auto mb-2 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-lg">📷</span>
              </div>
              <p className="text-xs">Image not available</p>
            </div>
          </div>
        )}

        {/* Actual Image - Now with eager loading for above-fold content */}
        <motion.img
          src={imageSrc}
          alt={p.title}
          onLoad={handleImageLoad}
          onError={handleImageErrorInternal}
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{
            opacity: imgLoaded && !imgError ? 1 : 0,
            filter: imgLoaded && !imgError ? "blur(0px)" : "blur(10px)",
          }}
          transition={{ duration: 0.4 }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading={i < 3 ? "eager" : "lazy"} // Eager load first 3 images
          decoding="async"
          fetchPriority={i < 3 ? "high" : "low"}
        />
      </div>

      <div className="p-5 text-left">
        <h3 className="text-xl font-bold text-white mb-2">{p.title}</h3>
        <p className="text-white/60 text-sm line-clamp-2 mb-3">{p.desc}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {p.tech?.slice(0, 3).map((t) => (
            <span key={t} className="text-xs bg-white/10 px-2 py-1 rounded-full border border-white/20 text-white/80">
              {t}
            </span>
          ))}
          {p.tech?.length > 3 && (
            <span className="text-xs bg-white/5 px-2 py-1 rounded-full border border-white/10 text-white/60">
              +{p.tech.length - 3}
            </span>
          )}
        </div>
        <div className="flex justify-between items-center">
          {p.url ? (
            <a 
              href={p.url} 
              target="_blank" 
              rel="noreferrer" 
              className="text-cyan-400 text-sm flex items-center gap-1 hover:text-cyan-300 transition-colors group/link"
            >
              <Github size={16} />
              <span className="group-hover/link:underline">Code</span>
            </a>
          ) : (
            <span className="text-gray-400 italic text-sm">Private Repo</span>
          )}
          <button 
            onClick={() => setOpen(p)} 
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
  )
}

/* 🔹 Optimized Modal with Faster Image Loading */
function ProjectModal({ open, setOpen, handleImageError, defaultImage }) {
  const [loaded, setLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  
  // Use default image if no image provided
  const imageSrc = open.img || defaultImage

  const handleImageLoad = useCallback(() => {
    setLoaded(true)
  }, [])

  const handleImageErrorInternal = useCallback((e) => {
    setImgError(true)
    handleImageError(e)
  }, [handleImageError])

  // Preload modal image when modal opens
  useState(() => {
    if (open) {
      const img = new Image()
      img.src = imageSrc
      img.onload = handleImageLoad
      img.onerror = handleImageErrorInternal
    }
  })

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-lg" onClick={() => setOpen(null)} />
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: -30 }}
        transition={{ duration: 0.4, type: "spring" }}
        className="relative z-10 bg-gradient-to-br from-[#111] to-[#1c1c1c] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl overflow-y-auto max-h-[90vh]"
      >
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
          {/* Image Section - Consistent sizing */}
          <div className="w-full lg:w-2/5 flex-shrink-0">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5">
              {/* Image Loading Spinner */}
              {!loaded && !imgError && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a] z-10">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-12 h-12 border-3 border-cyan-400 border-t-transparent rounded-full"
                  />
                </div>
              )}
              
              {/* Fallback for image error */}
              {imgError && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a] z-10">
                  <div className="text-center text-white/50">
                    <div className="w-16 h-16 mx-auto mb-3 bg-white/10 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📷</span>
                    </div>
                    <p className="text-sm">Image not available</p>
                  </div>
                </div>
              )}

              {/* Actual Image - High priority for modal */}
              <motion.img
                src={imageSrc}
                alt={open.title}
                onLoad={handleImageLoad}
                onError={handleImageErrorInternal}
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{
                  opacity: loaded && !imgError ? 1 : 0,
                  filter: loaded && !imgError ? "blur(0px)" : "blur(10px)",
                }}
                transition={{ duration: 0.4 }}
                className="w-full h-64 sm:h-72 object-cover"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">{open.title}</h3>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-4">
                {open.long || open.desc}
              </p>
              <div className="flex flex-wrap gap-2">
                {open.tech?.map((t) => (
                  <span 
                    key={t} 
                    className="px-3 py-1.5 rounded-full bg-white/10 text-white/70 text-xs border border-white/20 hover:bg-white/15 transition-colors"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {open.live && (
                <a 
                  href={open.live} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 px-5 py-2.5 rounded-xl font-semibold text-white shadow-lg hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 group/live"
                >
                  <ExternalLink size={18} />
                  <span>Live Demo</span>
                </a>
              )}
              {open.url ? (
                <a 
                  href={open.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center justify-center gap-2 bg-cyan-400 hover:bg-cyan-500 px-5 py-2.5 rounded-xl font-semibold text-black shadow-lg hover:shadow-cyan-400/25 transition-all duration-300 hover:scale-105 group/github"
                >
                  <Github size={18} />
                  <span>Source Code</span>
                </a>
              ) : (
                <div className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 px-5 py-2.5 rounded-xl text-gray-400 italic">
                  <Github size={18} />
                  <span>Private Repository</span>
                </div>
              )}
              <button 
                onClick={() => setOpen(null)} 
                className="flex items-center justify-center gap-2 border border-white/20 hover:border-white/30 text-white hover:bg-white/10 px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 group/close"
              >
                <X size={18} />
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}