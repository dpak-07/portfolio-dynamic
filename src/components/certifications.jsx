"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  FileBadge,
  Building2,
  CalendarDays,
  BookOpen,
  Briefcase,
  Award,
  Loader2,
} from "lucide-react";
import { useFirestoreData } from "@/hooks/useFirestoreData";

// Icon mapping
const iconComponents = {
  BookOpen: BookOpen,
  Briefcase: Briefcase,
  Award: Award,
};

const containerVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 15 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function CertificationsSection() {
  // 🔥 Fetch certifications from Firestore
  const { data: certsData, loading: firestoreLoading, error: firestoreError } = useFirestoreData('certifications', 'data');

  // Parse Firestore data and map icons
  const certificateData = certsData ? {
    categories: certsData.categories.map(cat => ({
      ...cat,
      icon: iconComponents[cat.icon] ? React.createElement(iconComponents[cat.icon], { 
        className: "w-5 h-5 text-cyan-400" 
      }) : null
    }))
  } : {
    categories: [
      {
        id: "courses",
        label: "Courses",
        icon: <BookOpen className="w-5 h-5 text-cyan-400" />,
        items: [],
      },
      {
        id: "internships",
        label: "Internships", 
        icon: <Briefcase className="w-5 h-5 text-purple-400" />,
        items: [],
      },
      {
        id: "participations",
        label: "Participations",
        icon: <Award className="w-5 h-5 text-amber-400" />,
        items: [],
      },
    ],
  };

  const [active, setActive] = useState("courses");
  const [selected, setSelected] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const sectionRef = useRef(null);
  const scrollRef = useRef(null);
  const progressControls = useAnimation();

  const activeCategory = certificateData.categories.find(
    (cat) => cat.id === active
  );

  const handleCategoryChange = (cat) => {
    setLoading(true);
    setTimeout(() => {
      setActive(cat);
      setLoading(false);
    }, 400);
  };

  // Auto scroll horizontally (mobile)
  useEffect(() => {
    if (window.innerWidth < 768 && scrollRef.current && !firestoreLoading && !loading) {
      const scrollInterval = setInterval(() => {
        const container = scrollRef.current;
        if (!container) return;
        const maxScroll = container.scrollWidth - container.clientWidth;
        container.scrollLeft =
          container.scrollLeft >= maxScroll ? 0 : container.scrollLeft + 320;
      }, 3500);
      return () => clearInterval(scrollInterval);
    }
  }, [active, firestoreLoading, loading]);

  // Scroll progress bar update
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const progress =
        container.scrollLeft /
        (container.scrollWidth - container.clientWidth);
      setScrollProgress(progress);
      progressControls.start({ scaleX: progress });
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [progressControls]);

  // Auto image carousel
  useEffect(() => {
    if (!selected?.images || selected.images.length <= 1) return;
    const timer = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % selected.images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [selected]);

  const nextImage = () => {
    if (!selected?.images) return;
    setImageIndex((prev) => (prev + 1) % selected.images.length);
  };

  const prevImage = () => {
    if (!selected?.images) return;
    setImageIndex(
      (prev) => (prev - 1 + selected.images.length) % selected.images.length
    );
  };

  // Show error state if Firestore fails
  if (firestoreError) {
    return (
      <section id="certifications" className="relative w-full min-h-screen px-6 py-16 text-white overflow-hidden bg-[radial-gradient(circle_at_top_left,#0a0a0a_0%,#000000_60%,#050505_100%)]">
        <div className="relative z-10 text-center">
          <h2 className="text-3xl font-bold text-red-400 mb-4">Failed to Load Certifications</h2>
          <p className="text-white/70">{firestoreError}</p>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      id="certifications"
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative w-full min-h-screen px-6 py-16 text-white overflow-hidden bg-[radial-gradient(circle_at_top_left,#0a0a0a_0%,#000000_60%,#050505_100%)]"
    >
      {/* Animated BG */}
      <motion.div
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,255,0.08),rgba(0,0,0,0.9))] pointer-events-none"
      ></motion.div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

      {/* Title */}
      <h2 className="text-4xl md:text-5xl font-bold mb-10 text-center tracking-wide">
        🪄 My Certifications & Milestones
      </h2>

      {/* Tabs */}
      <div className="flex justify-center flex-wrap gap-4 mb-10">
        {certificateData.categories.map((cat) => (
          <motion.button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium border transition-all ${
              active === cat.id
                ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                : "border-gray-600 hover:border-white"
            }`}
          >
            {cat.icon}
            {cat.label}
          </motion.button>
        ))}
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

      {/* Certificates */}
      <AnimatePresence mode="wait">
        {!loading && !firestoreLoading && (
          <motion.div
            key={active}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            ref={scrollRef}
            className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto overflow-x-auto snap-x snap-mandatory scroll-smooth md:overflow-visible no-scrollbar pb-4"
          >
            {activeCategory?.items?.map((item, i) => (
              <motion.div
                key={i}
                variants={cardVariants}
                whileHover={{
                  scale: 1.05,
                  rotateX: 2,
                  rotateY: -2,
                  boxShadow:
                    "0 0 25px rgba(255,255,255,0.15), 0 0 50px rgba(0,255,255,0.1)",
                }}
                transition={{ type: "spring", stiffness: 180, damping: 14 }}
                onClick={() => {
                  setSelected(item);
                  setImageIndex(0);
                }}
                className="cursor-pointer min-w-[85%] sm:min-w-[45%] md:min-w-0 snap-center p-6 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-lg text-left relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-20 transition-all"></div>

                <div className="flex items-center gap-2 mb-1">
                  <FileBadge className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                </div>

                <div className="flex items-center gap-2 mb-1 text-gray-400 text-sm">
                  <Building2 className="w-4 h-4" /> {item.issuer}
                </div>

                <div className="flex items-center gap-2 mb-2 text-gray-500 text-xs">
                  <CalendarDays className="w-4 h-4" /> {item.date}
                </div>

                <p className="text-gray-300 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Scrollbar */}
      <div className="block md:hidden w-full max-w-5xl mx-auto mt-2 h-[3px] bg-white/10 rounded-full overflow-hidden">
        <motion.div
          animate={progressControls}
          initial={{ scaleX: 0 }}
          style={{ originX: 0 }}
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
        />
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 12 }}
              className="relative bg-white/10 border border-white/20 rounded-2xl p-6 max-w-2xl w-full backdrop-blur-xl"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 text-white hover:text-gray-300"
              >
                <X />
              </button>

              <h3 className="text-2xl font-semibold mb-2">{selected.title}</h3>
              <p className="text-gray-300 text-sm mb-4">{selected.desc}</p>

              {selected.images && selected.images.length > 0 && (
                <div className="relative flex justify-center items-center">
                  <motion.img
                    key={imageIndex}
                    src={selected.images[imageIndex]}
                    alt={`${selected.title}-${imageIndex}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="rounded-lg border border-white/20 shadow-lg max-h-[70vh] object-contain"
                  />

                  {selected.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full border border-white/30"
                      >
                        <ChevronLeft className="w-5 h-5 text-white" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full border border-white/30"
                      >
                        <ChevronRight className="w-5 h-5 text-white" />
                      </button>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}