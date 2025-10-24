import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { Code2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useFirestoreData } from "@/hooks/useFirestoreData"

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: "easeOut", staggerChildren: 0.12 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 14, duration: 0.8 },
  },
}

const mobileSlideVariants = {
  enter: { opacity: 0, x: "-120%", rotateY: 15, scale: 0.9 },
  center: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 80, damping: 14, duration: 0.6 },
  },
  exit: {
    opacity: 0,
    x: "120%",
    rotateY: -15,
    scale: 0.9,
    transition: { duration: 0.6, ease: [0.65, 0, 0.35, 1] },
  },
}

// Color mapping for categories - dynamically handles any category title
const COLOR_MAP = {
  // Programming & Languages
  "Programming Languages": "from-purple-400 to-pink-500",
  "Languages": "from-purple-400 to-pink-500",
  
  // Frontend
  "Frontend Development": "from-blue-500 to-cyan-400",
  "Frontend": "from-blue-500 to-cyan-400",
  
  // Backend
  "Backend Development": "from-green-500 to-emerald-400",
  "Backend": "from-green-500 to-emerald-400",
  
  // Databases
  "Databases": "from-orange-400 to-amber-500",
  
  // Cloud & DevOps
  "Cloud & DevOps": "from-yellow-400 to-lime-400",
  
  // AI & ML
  "AI & Machine Learning": "from-red-400 to-pink-400",
  "AI & ML": "from-red-400 to-pink-400",
  
  // Mobile
  "Mobile Development": "from-teal-400 to-green-400",
  "Mobile": "from-teal-400 to-green-400",
  
  // Tools
  "Tools": "from-indigo-400 to-blue-400",
}

// Default gradient colors for unknown categories
const DEFAULT_GRADIENTS = [
  "from-cyan-400 to-blue-500",
  "from-purple-400 to-pink-500", 
  "from-green-400 to-emerald-500",
  "from-orange-400 to-amber-500",
  "from-red-400 to-pink-500",
  "from-yellow-400 to-lime-500",
  "from-indigo-400 to-blue-500",
  "from-teal-400 to-green-500",
]

export default function AnimatedTechStack() {
  // Fetch tech stack data from Firestore - matches your seed.js structure
  const { data: firestoreData, loading, error } = useFirestoreData("techStack", "categories")

  const [categories, setCategories] = useState([])
  const [index, setIndex] = useState(0)
  const [dragStart, setDragStart] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  // 3D Tilt Motion
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [8, -8])
  const rotateY = useTransform(x, [-100, 100], [-8, 8])

  // Process Firestore data and assign colors dynamically
  useEffect(() => {
    if (firestoreData && firestoreData.techStackData) {
      const processedCategories = firestoreData.techStackData.map((cat, index) => {
        // Get color from map or use a default based on index
        const color = COLOR_MAP[cat.title] || 
                     DEFAULT_GRADIENTS[index % DEFAULT_GRADIENTS.length] || 
                     "from-cyan-400 to-blue-500"
        
        return {
          title: cat.title,
          color: color,
          tech: Array.isArray(cat.tech) ? cat.tech : [],
        }
      })
      setCategories(processedCategories)
      console.log("✅ Tech stack loaded from Firestore:", processedCategories.length, "categories")
    }
  }, [firestoreData])

  // Auto-play for mobile carousel
  useEffect(() => {
    if (!autoPlay || categories.length === 0) return
    const timer = setInterval(() => handleNext(), 4000)
    return () => clearInterval(timer)
  }, [index, autoPlay, categories.length])

  const handleNext = () => {
    if (categories.length === 0) return
    setIndex((prev) => (prev + 1) % categories.length)
  }
  
  const handlePrev = () => {
    if (categories.length === 0) return
    setIndex((prev) => (prev - 1 + categories.length) % categories.length)
  }

  // Touch & Swipe Controls
  const handleDragStart = (e) => {
    setDragStart(e.touches[0].clientX)
    setAutoPlay(false)
  }

  const handleDragEnd = (e) => {
    const swipe = dragStart - e.changedTouches[0].clientX
    if (swipe > 50) handleNext()
    else if (swipe < -50) handlePrev()
    setAutoPlay(true)
  }

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const xVal = e.touches[0].clientX - rect.left - rect.width / 2
    const yVal = e.touches[0].clientY - rect.top - rect.height / 2
    x.set(xVal)
    y.set(yVal)
  }

  const handleLeave = () => {
    x.set(0)
    y.set(0)
  }

  if (loading) {
    return (
      <section id="tech-stack" className="relative py-20 bg-black overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-center h-96">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <Code2 className="w-12 h-12 text-cyan-400" />
            </motion.div>
            <p className="text-white/70 mt-4">Loading tech stack...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    console.warn("⚠️ Error loading tech stack:", error)
    return (
      <section id="tech-stack" className="relative py-20 bg-black overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-center h-96">
          <div className="text-center">
            <Code2 className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-white/70">Unable to load tech stack data</p>
          </div>
        </div>
      </section>
    )
  }

  if (!categories || categories.length === 0) {
    return (
      <section id="tech-stack" className="relative py-20 bg-black overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-center h-96">
          <div className="text-center">
            <Code2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-white/70">No tech stack data available</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="tech-stack" className="relative py-20 bg-black overflow-hidden">
      {/* CRT Glow Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,255,255,0.07),transparent_70%)]"></div>
      <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-[0.04] bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.15)_0px,rgba(255,255,255,0.15)_1px,transparent_1px,transparent_2px)] animate-[scanline_6s_linear_infinite]" />
      <style>{`@keyframes scanline {0%{transform:translateY(0)}100%{transform:translateY(100%)}}`}</style>

      <motion.div
        className="max-w-6xl mx-auto px-6 md:px-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-2 drop-shadow-[0_0_20px_rgba(0,255,255,0.3)]">
            Tech Stack
          </h2>
          <p className="text-white/70 text-sm md:text-base tracking-wide">
            The core technologies that power my builds and innovations
          </p>
        </div>

        {/* Desktop Grid */}
        <motion.div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" variants={containerVariants}>
          {categories.map((category) => (
            <motion.div
              key={category.title}
              variants={cardVariants}
              whileHover={{ scale: 1.07, y: -5, boxShadow: "0 0 35px rgba(0,255,255,0.15)" }}
              className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md px-6 py-8 group flex flex-col"
            >
              {/* Header Section */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-white/10 rounded-xl shadow-inner">
                  <Code2 className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-white tracking-wide">{category.title}</h3>
              </div>

              {/* Tech Items - Now at top with proper spacing */}
              <div className="flex-1">
                <ul className="grid grid-cols-2 gap-2 w-full">
                  {category.tech.map((tech) => (
                    <motion.li
                      key={tech}
                      whileHover={{ scale: 1.08, color: "#fff", textShadow: "0px 0px 10px rgba(0,255,255,0.7)" }}
                      className="text-white/70 text-sm font-medium bg-white/5 px-3 py-2 text-center rounded-md border border-white/10 hover:bg-gradient-to-r hover:from-cyan-500/30 hover:to-blue-500/30 transition-all"
                    >
                      {tech}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 🌌 Mobile Tilt + Glassmorphic Swipeable Carousel */}
        <div
          className="sm:hidden relative w-full flex justify-center items-center mt-6 perspective-[1200px]"
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}
        >
          <AnimatePresence mode="wait" initial={false}>
            {categories[index] && (
              <motion.div
                key={categories[index].title}
                variants={mobileSlideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                onTouchMove={handleMove}
                onTouchEnd={handleLeave}
                className="relative w-[90%] flex flex-col rounded-3xl border border-cyan-300/20 backdrop-blur-[10px] p-6 shadow-[0_0_40px_rgba(0,255,255,0.15)] transition-transform duration-300 bg-[linear-gradient(135deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.05)_100%)] before:absolute before:inset-0 before:bg-[linear-gradient(120deg,rgba(255,255,255,0.25)_0%,transparent_60%)] before:opacity-10 before:rounded-3xl before:pointer-events-none overflow-hidden"
              >
                {/* Glow line */}
                <div className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${categories[index].color} animate-pulse z-10`} />

                {/* Header */}
                <div className="flex items-center gap-3 mb-6 z-20">
                  <div className="p-2 bg-white/10 rounded-xl border border-white/10">
                    <Code2 className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white tracking-wide">{categories[index].title}</h3>
                </div>

                {/* Tech List - Better spacing and alignment */}
                <div className="flex-1">
                  <ul className="grid grid-cols-2 gap-3 w-full z-20">
                    {categories[index].tech.map((tech) => (
                      <motion.li
                        key={tech}
                        whileHover={{
                          scale: 1.05,
                          color: "#fff",
                          textShadow: "0px 0px 10px rgba(0,255,255,0.8)",
                        }}
                        className="text-white/70 text-sm font-medium bg-white/5 px-3 py-2 text-center rounded-md border border-white/10 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 transition-all"
                      >
                        {tech}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Swipe Progress Bar */}
        <div className="sm:hidden flex justify-center mt-6 space-x-2">
          {categories.map((_, i) => (
            <div
              key={i}
              className={`h-[4px] w-6 rounded-full transition-all duration-300 ${
                i === index ? "bg-cyan-400 shadow-[0_0_12px_rgba(0,255,255,0.8)] w-10" : "bg-white/10"
              }`}
            ></div>
          ))}
        </div>

        {/* Outro */}
        <div className="text-center mt-20">
          <p className="text-white/50 text-sm md:text-base italic">
            ✨ "Code. Learn. Build. Repeat." — constantly refining the craft.
          </p>
        </div>
      </motion.div>
    </section>
  )
}