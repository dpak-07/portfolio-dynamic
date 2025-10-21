"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useFirestoreData } from "@/hooks/useFirestoreData";

export default function Navbar() {
  // 🔥 Fetch sections visibility from Firestore
  const { data: firestoreSectionsData } = useFirestoreData('sections', 'visibility');

  // Maintain original order: home, about, tech-stack, projects, resume, contact
  const sectionOrder = ["home", "about", "tech-stack", "projects", "resume", "contact"];
  
  // Use Firestore data directly (memoized to prevent unnecessary recalculations)
  const sectionsConfig = useMemo(() => {
    return firestoreSectionsData || {
      home: true,
      about: true,
      "tech-stack": true,
      projects: true,
      resume: true,
      contact: true,
    };
  }, [firestoreSectionsData]);

  const sections = useMemo(() => sectionOrder.filter(sec => sectionsConfig[sec]), [sectionsConfig]);

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const buttonsRef = useRef({});
  const [underlinePos, setUnderlinePos] = useState({ x: 0, width: 0 });

  // Update underline position
  useEffect(() => {
    if (buttonsRef.current[active]) {
      const activeBtn = buttonsRef.current[active];
      setUnderlinePos({
        x: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
      });
    }
  }, [active, sections]);

  // Smooth Scroll
  const scrollTo = (id) => {
    if (!sectionsConfig[id]) return;
    const el = document.getElementById(id);
    const navbar = document.querySelector("header");
    if (el && navbar) {
      const navbarHeight = navbar.offsetHeight;
      const y = el.getBoundingClientRect().top + window.scrollY - navbarHeight + 5;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setOpen(false);
  };

  // Track Active Section
  useEffect(() => {
    if (sections.length === 0) return;

    const navbar = document.querySelector("header");
    const navbarHeight = navbar ? navbar.offsetHeight : 80;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && sectionsConfig[entry.target.id]) {
            setActive(entry.target.id || "home");
          }
        });
      },
      {
        rootMargin: `-${navbarHeight + 20}px 0px -50% 0px`,
        threshold: 0.4,
      }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el && sectionsConfig[id]) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionsConfig, sections]);

  // Scroll effect for navbar style
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Classes
  const linkClass = (id) =>
    `relative px-4 py-2 text-sm md:text-base font-medium tracking-wide transition-all duration-500 ${
      sectionsConfig[id]
        ? active === id
          ? "text-cyansoft glow-text"
          : "text-white/80 hover:text-cyansoft hover:glow-text"
        : "text-gray-500 cursor-not-allowed opacity-50"
    }`;

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80, damping: 20 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <motion.nav
        animate={{
          backgroundColor: isScrolled ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.25)",
          backdropFilter: isScrolled ? "blur(10px)" : "blur(4px)",
          boxShadow: isScrolled
            ? "0 0 20px rgba(0,255,255,0.15)"
            : "0 0 0 rgba(0,255,255,0)",
        }}
        transition={{ duration: 0.6 }}
        className="relative w-full px-6 py-3 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* 🚀 Logo */}
          <motion.h1
            whileHover={{ scale: 1.08 }}
            className="font-extrabold cursor-pointer bg-gradient-to-r from-cyan-300 to-cyansoft bg-clip-text text-transparent text-2xl md:text-3xl font-[Playfair] glow-text"
            onClick={() => scrollTo("home")}
          >
            Deepak | Portfolio
          </motion.h1>

          {/* 🖥 Desktop Navigation */}
          <div className="hidden md:flex gap-6 items-center relative">
            {sections.map((sec) => (
              <motion.button
                key={sec}
                ref={(el) => {
                  if (el) buttonsRef.current[sec] = el;
                }}
                onClick={() => scrollTo(sec)}
                disabled={!sectionsConfig[sec]}
                whileHover={{ scale: 1.08 }}
                className={linkClass(sec)}
              >
                {sec.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </motion.button>
            ))}

            {/* 🔥 Neon underline */}
            <motion.div
              className="absolute bottom-0 h-[2px] bg-cyansoft/90 rounded-full shadow-[0_0_10px_#00ffff]"
              initial={false}
              animate={{
                x: underlinePos.x,
                width: underlinePos.width,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          </div>

          {/* 📱 Mobile Toggle */}
          <motion.div
            whileTap={{ scale: 0.85 }}
            className="md:hidden z-50"
          >
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              className="text-white/90 hover:text-cyansoft transition-all"
            >
              {open ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </motion.div>
        </div>

        {/* 📱 Mobile Drawer — Innovative Style */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -20, rotateX: -20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -20, rotateX: 20 }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 18,
              }}
              className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-[92%] max-w-sm 
                bg-gradient-to-b from-black/90 to-black/60 border border-cyansoft/30 
                backdrop-blur-xl rounded-2xl p-5 shadow-[0_0_30px_rgba(0,255,255,0.2)] 
                md:hidden"
            >
              <motion.div
                className="flex flex-col gap-4"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.07 } },
                }}
              >
                {sections.map((sec) => (
                  <motion.button
                    key={sec}
                    onClick={() => scrollTo(sec)}
                    disabled={!sectionsConfig[sec]}
                    whileTap={{ scale: 0.95 }}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    className={`text-left px-4 py-2 rounded-md text-white transition-all duration-200 
                      relative overflow-hidden group ${
                        sectionsConfig[sec]
                          ? active === sec
                            ? "bg-cyansoft text-black font-semibold"
                            : "hover:bg-cyansoft/10"
                          : "text-gray-500 cursor-not-allowed opacity-50"
                      }`}
                  >
                    {/* 💡 Animated Gradient Shine on hover */}
                    <span className="relative z-10">
                      {sec.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-cyansoft/20 via-cyansoft/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                      animate={{ x: open ? 0 : -50 }}
                    />
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ✨ Global Glow Styles */}
      <style jsx="true">{`
        .glow-text {
          text-shadow: 0 0 10px rgba(0, 255, 255, 0.6),
            0 0 20px rgba(0, 255, 255, 0.4);
        }
      `}</style>
    </motion.header>
  );
}