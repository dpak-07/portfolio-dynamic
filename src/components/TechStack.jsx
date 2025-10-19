import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { Code2 } from "lucide-react"
import { useEffect, useState } from "react"

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

export default function AnimatedTechStack() {
  const categories = [
    { title: "Languages", color: "from-purple-400 to-pink-500", tech: ["C", "Python", "Java", "JavaScript", "Dart", "HTML", "CSS", "TypeScript"] },
    { title: "Frontend", color: "from-blue-500 to-cyan-400", tech: ["React", "Next.js", "Tailwind CSS", "Flutter", "Bootstrap", "Vite"] },
    { title: "Backend", color: "from-green-500 to-emerald-400", tech: ["Node.js", "Express", "Flask", "FastAPI", "Spring Boot"] },
    { title: "Databases", color: "from-orange-400 to-amber-500", tech: ["MongoDB", "MySQL", "SQLite", "PostgreSQL", "Firebase"] },
    { title: "Cloud & DevOps", color: "from-yellow-400 to-lime-400", tech: ["AWS", "Google Cloud", "Docker", "Kubernetes", "Vercel"] },
    { title: "AI & ML", color: "from-red-400 to-pink-400", tech: ["TensorFlow", "PyTorch", "OpenCV", "Keras", "NumPy", "Pandas"] },
    { title: "Mobile", color: "from-teal-400 to-green-400", tech: ["React Native", "Flutter", "Android", "iOS", "Expo"] },
    { title: "Tools", color: "from-indigo-400 to-blue-400", tech: ["Git", "GitHub", "VS Code", "Postman", "Linux", "Figma"] },
  ]

  const [index, setIndex] = useState(0)
  const [dragStart, setDragStart] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  // 3D Tilt Motion
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [8, -8])
  const rotateY = useTransform(x, [-100, 100], [-8, 8])

  useEffect(() => {
    if (!autoPlay) return
    const timer = setInterval(() => handleNext(), 4000)
    return () => clearInterval(timer)
  }, [index, autoPlay])

  const handleNext = () => setIndex((prev) => (prev + 1) % categories.length)
  const handlePrev = () => setIndex((prev) => (prev - 1 + categories.length) % categories.length)

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
              className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md px-6 py-8 group flex flex-col items-start justify-between"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-white/10 rounded-xl shadow-inner">
                  <Code2 className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-white tracking-wide">{category.title}</h3>
              </div>
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
            <motion.div
              key={categories[index].title}
              variants={mobileSlideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              onTouchMove={handleMove}
              onTouchEnd={handleLeave}
              className="relative w-[90%] flex flex-col items-start justify-between rounded-3xl border border-cyan-300/20 backdrop-blur-[10px] p-6 shadow-[0_0_40px_rgba(0,255,255,0.15)] transition-transform duration-300 bg-[linear-gradient(135deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.05)_100%)] before:absolute before:inset-0 before:bg-[linear-gradient(120deg,rgba(255,255,255,0.25)_0%,transparent_60%)] before:opacity-10 before:rounded-3xl before:pointer-events-none overflow-hidden"
            >
              {/* Glow line */}
              <div className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${categories[index].color} animate-pulse z-10`} />

              {/* Header */}
              <div className="flex items-center gap-3 mb-4 z-20">
                <div className="p-2 bg-white/10 rounded-xl border border-white/10">
                  <Code2 className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-white tracking-wide">{categories[index].title}</h3>
              </div>

              {/* Tech List */}
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
            </motion.div>
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
            ✨ “Code. Learn. Build. Repeat.” — constantly refining the craft.
          </p>
        </div>
      </motion.div>
    </section>
  )
}
