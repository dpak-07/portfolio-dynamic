"use client";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useInView,
} from "framer-motion";
import { Code2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useFirestoreData } from "@/hooks/useFirestoreData";
import { logSectionView, logLinkClick } from "../utils/analytics";

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: "easeOut", staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 14, duration: 0.8 },
  },
};

// ✅ Improved mobile slide animation
const mobileSlideVariants = {
  enter: (direction) => ({
    opacity: 0,
    x: direction > 0 ? "100%" : "-100%",
    scale: 0.85,
    rotateY: direction > 0 ? 25 : -25,
    filter: "blur(8px)",
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    rotateY: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 20,
      duration: 0.7,
      opacity: { duration: 0.4 },
      filter: { duration: 0.5 },
    },
  },
  exit: (direction) => ({
    opacity: 0,
    x: direction > 0 ? "-100%" : "100%",
    scale: 0.85,
    rotateY: direction > 0 ? -25 : 25,
    filter: "blur(8px)",
    transition: {
      duration: 0.5,
      ease: [0.65, 0, 0.35, 1],
    },
  }),
};

// 🌈 Color mapping for categories
const COLOR_MAP = {
  "Programming Languages": "from-purple-400 to-pink-500",
  Languages: "from-purple-400 to-pink-500",
  "Frontend Development": "from-blue-500 to-cyan-400",
  Frontend: "from-blue-500 to-cyan-400",
  "Backend Development": "from-green-500 to-emerald-400",
  Backend: "from-green-500 to-emerald-400",
  Databases: "from-orange-400 to-amber-500",
  "Cloud & DevOps": "from-yellow-400 to-lime-400",
  "AI & Machine Learning": "from-red-400 to-pink-400",
  "AI & ML": "from-red-400 to-pink-400",
  "Mobile Development": "from-teal-400 to-green-400",
  Mobile: "from-teal-400 to-green-400",
  Tools: "from-indigo-400 to-blue-400",
};

const DEFAULT_GRADIENTS = [
  "from-cyan-400 to-blue-500",
  "from-purple-400 to-pink-500",
  "from-green-400 to-emerald-500",
  "from-orange-400 to-amber-500",
  "from-red-400 to-pink-500",
  "from-yellow-400 to-lime-500",
  "from-indigo-400 to-blue-500",
  "from-teal-400 to-green-500",
];

export default function AnimatedTechStack() {
  // ✅ Section tracking with ref
  const sectionRef = useRef(null);
  const hasLoggedView = useRef(false);

  const sectionInView = useInView(sectionRef, {
    once: true,
    amount: 0.2,
    margin: "-100px"
  });

  useEffect(() => {
    if (sectionInView && !hasLoggedView.current) {
      console.log("✅ Tech Stack section in view - logging...");
      logSectionView("tech-stack");
      hasLoggedView.current = true;
    }
  }, [sectionInView]);

  // Firestore hook
  const { data: firestoreData, loading, error } = useFirestoreData(
    "techStack",
    "categories"
  );

  const [categories, setCategories] = useState([]);
  const [index, setIndex] = useState(0);
  const [[page, direction], setPage] = useState([0, 0]);
  const [dragStart, setDragStart] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [maxHeight, setMaxHeight] = useState(0);

  // 3D Tilt Motion
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [8, -8]);
  const rotateY = useTransform(x, [-100, 100], [-8, 8]);

  // 🔥 Prepare categories and calculate max height
  useEffect(() => {
    if (firestoreData && firestoreData.techStackData) {
      const processed = firestoreData.techStackData.map((cat, index) => {
        const color =
          COLOR_MAP[cat.title] ||
          DEFAULT_GRADIENTS[index % DEFAULT_GRADIENTS.length] ||
          "from-cyan-400 to-blue-500";
        return {
          title: cat.title,
          color: color,
          tech: Array.isArray(cat.tech) ? cat.tech : [],
        };
      });
      setCategories(processed);

      const maxTechCount = Math.max(...processed.map(cat => cat.tech.length));
      const calculatedHeight = 180 + Math.ceil(maxTechCount / 2) * 48;
      setMaxHeight(calculatedHeight);

      console.log("✅ Tech stack loaded:", processed.length, "categories");
      console.log("✅ Max height calculated:", calculatedHeight);
    }
  }, [firestoreData]);

  // 🔄 Auto-play mobile carousel
  useEffect(() => {
    if (!autoPlay || categories.length === 0) return;
    const timer = setInterval(() => handleNext(true), 4000);
    return () => clearInterval(timer);
  }, [index, autoPlay, categories.length]);

  const handleNext = (isAutoSwipe = false) => {
    if (categories.length === 0) return;
    if (!isAutoSwipe) {
      console.log("👉 Tech swipe next - logging...");
      logLinkClick("tech_swipe_next");
    }
    const newIndex = (index + 1) % categories.length;
    setPage([newIndex, 1]);
    setIndex(newIndex);
  };

  const handlePrev = () => {
    if (categories.length === 0) return;
    console.log("👈 Tech swipe prev - logging...");
    logLinkClick("tech_swipe_prev");
    const newIndex = (index - 1 + categories.length) % categories.length;
    setPage([newIndex, -1]);
    setIndex(newIndex);
  };

  const handleDragStart = (e) => {
    setDragStart(e.touches[0].clientX);
    setAutoPlay(false);
  };

  const handleDragEnd = (e) => {
    const swipe = dragStart - e.changedTouches[0].clientX;
    if (swipe > 50) handleNext(false);
    else if (swipe < -50) handlePrev();
    setAutoPlay(true);
  };

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xVal = e.touches[0].clientX - rect.left - rect.width / 2;
    const yVal = e.touches[0].clientY - rect.top - rect.height / 2;
    x.set(xVal);
    y.set(yVal);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  // 🌀 Loading State
  if (loading) {
    return (
      <section
        id="tech-stack"
        ref={sectionRef}
        className="relative py-20 overflow-hidden scroll-mt-20"
      >
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
    );
  }

  // 🌀 Error State
  if (error) {
    return (
      <section
        id="tech-stack"
        ref={sectionRef}
        className="relative py-20 overflow-hidden scroll-mt-20"
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-center h-96">
          <div className="text-center">
            <Code2 className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-white/70">Unable to load tech stack data</p>
          </div>
        </div>
      </section>
    );
  }

  // 🌀 Empty State
  if (!categories || categories.length === 0) {
    return (
      <section
        id="tech-stack"
        ref={sectionRef}
        className="relative py-20 overflow-hidden scroll-mt-20"
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-center h-96">
          <div className="text-center">
            <Code2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-white/70">No tech stack data available</p>
          </div>
        </div>
      </section>
    );
  }

  // 💫 Main Render
  return (
    <section
      id="tech-stack"
      ref={sectionRef}
      className="relative py-20 overflow-hidden scroll-mt-20"
    >
      {/* CRT Glow */}
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

        {/* 🖥 Desktop Grid */}
        <motion.div
          className="hidden sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          variants={containerVariants}
        >
          {categories.map((category) => (
            <motion.div
              key={category.title}
              variants={cardVariants}
              whileHover={{
                scale: 1.07,
                y: -5,
                boxShadow: "0 0 35px rgba(0,255,255,0.15)",
              }}
              className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md px-6 py-8 group flex flex-col"
              style={{ minHeight: '280px' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-white/10 rounded-xl shadow-inner">
                  <Code2 className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-white tracking-wide">
                  {category.title}
                </h3>
              </div>

              <div className="flex-1">
                <ul className="grid grid-cols-2 gap-2 w-full">
                  {category.tech.map((tech) => (
                    <motion.li
                      key={tech}
                      whileHover={{
                        scale: 1.08,
                        color: "#fff",
                        textShadow: "0px 0px 10px rgba(0,255,255,0.7)",
                      }}
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

        {/* 📱 Mobile Carousel - Fixed Height Container */}
        <div
          className="sm:hidden relative w-full flex justify-center items-center mt-6 perspective-[1200px]"
          style={{ height: `${maxHeight + 100}px` }}
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}
        >
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            {categories[index] && (
              <motion.div
                key={categories[index].title}
                custom={direction}
                variants={mobileSlideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d",
                  minHeight: `${maxHeight}px`
                }}
                onTouchMove={handleMove}
                onTouchEnd={handleLeave}
                className="absolute w-[90%] flex flex-col rounded-3xl border border-cyan-300/20 backdrop-blur-[10px] p-6 shadow-[0_0_40px_rgba(0,255,255,0.15)] bg-[linear-gradient(135deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.05)_100%)] overflow-hidden"
              >
                {/* Neon glow bar */}
                <div className="absolute left-0 right-0 top-0 h-[3px] overflow-hidden rounded-t-3xl">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${categories[index].color}`}
                    animate={{
                      opacity: [0.6, 1, 0.6],
                      boxShadow: [
                        `0 0 10px rgba(0, 255, 255, 0.4)`,
                        `0 0 20px rgba(0, 255, 255, 0.8)`,
                        `0 0 10px rgba(0, 255, 255, 0.4)`,
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>

                <div className="flex items-center gap-3 mb-6 z-20 mt-2">
                  <div className="p-2 bg-white/10 rounded-xl border border-white/10">
                    <Code2 className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white tracking-wide">
                    {categories[index].title}
                  </h3>
                </div>

                <div className="flex-1 flex items-start">
                  <ul className="grid grid-cols-2 gap-3 w-full z-20">
                    {categories[index].tech.map((tech, techIndex) => (
                      <motion.li
                        key={tech}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: techIndex * 0.05, duration: 0.3 }}
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

        {/* Swipe Indicators */}
        <div className="sm:hidden flex justify-center mt-6 space-x-2">
          {categories.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                console.log(`📍 Indicator ${i} clicked - logging...`);
                logLinkClick(`tech_indicator_${i}`);
                const newDirection = i > index ? 1 : -1;
                setPage([i, newDirection]);
                setIndex(i);
                setAutoPlay(false);
                setTimeout(() => setAutoPlay(true), 3000);
              }}
              className={`h-[4px] w-6 rounded-full transition-all duration-300 cursor-pointer ${i === index
                ? "bg-cyan-400 shadow-[0_0_12px_rgba(0,255,255,0.8)] w-10"
                : "bg-white/10 hover:bg-white/30"
                }`}
              aria-label={`Go to slide ${i + 1}`}
            ></button>
          ))}
        </div>

        {/* Outro */}
        <div className="text-center mt-20">
          <p className="text-white/50 text-sm md:text-base italic">
            ✨ "Code. Learn. Build. Repeat."
          </p>
        </div>
      </motion.div>
    </section>
  );
}