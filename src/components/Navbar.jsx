"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFirestoreData } from "@/hooks/useFirestoreData";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const { data: firestoreSectionsData } = useFirestoreData("sections", "visibility");

  const sectionOrder = [
    "home",
    "about",
    "tech-stack",
    "projects",
    "resume",
    "certifications",
    "timeline",
    "contact",
  ];

  const sectionsConfig = useMemo(
    () =>
      firestoreSectionsData || {
        home: true,
        about: true,
        "tech-stack": true,
        projects: true,
        resume: true,
        certifications: true,
        timeline: true,
        contact: true,
      },
    [firestoreSectionsData]
  );

  const sections = useMemo(
    () => sectionOrder.filter((sec) => sectionsConfig[sec]),
    [sectionsConfig]
  );

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);
  const [underlinePos, setUnderlinePos] = useState({ x: 0, width: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const buttonsRef = useRef({});

  // 🌈 Scroll progress + visibility
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          const height = document.body.scrollHeight - window.innerHeight;
          setScrollProgress((scrolled / height) * 100);
          setIsVisible(scrolled < lastScroll || scrolled < 50);
          setLastScroll(scrolled);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  // 🧭 Active section observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting && sectionsConfig[e.target.id]) {
            setActive(e.target.id);
          }
        }),
      { threshold: 0.45 }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  // 🟦 Underline animation
  useEffect(() => {
    if (buttonsRef.current[active]) {
      const btn = buttonsRef.current[active];
      setUnderlinePos({ x: btn.offsetLeft, width: btn.offsetWidth });
    }
  }, [active]);

  // ✨ Smooth scroll
  const scrollTo = (id) => {
    if (!sectionsConfig[id]) return;
    const el = document.getElementById(id);
    const nav = document.querySelector("header");
    if (el && nav) {
      const navH = nav.offsetHeight;
      const y = el.getBoundingClientRect().top + window.scrollY - navH + 5;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setOpen(false);
  };

  // 🚫 Prevent background scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const linkClass = (id) =>
    `relative px-3 md:px-4 py-2 text-xs sm:text-sm md:text-base font-medium tracking-wide transition-all duration-500 group ${
      sectionsConfig[id]
        ? active === id
          ? "text-cyansoft glow-text"
          : "text-white/70 hover:text-cyansoft"
        : "text-gray-500 opacity-50 cursor-not-allowed"
    }`;

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: isVisible ? 0 : -80, opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-[999] flex flex-col items-center"
    >
      {/* 🔹 Scroll Progress */}
      <motion.div
        style={{ width: `${scrollProgress}%` }}
        className="h-[2px] bg-gradient-to-r from-cyansoft to-cyan-300 shadow-[0_0_10px_#00ffff] rounded-full"
      />

      {/* 🔸 Main Navbar */}
      <motion.nav
        animate={{
          y: [0, -1, 0],
          boxShadow: [
            "0 0 10px rgba(0,255,255,0.1)",
            "0 0 20px rgba(0,255,255,0.25)",
            "0 0 10px rgba(0,255,255,0.1)",
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative mt-3 sm:mt-4 px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] max-w-7xl
          rounded-full border border-white/10 bg-[rgba(15,15,15,0.4)]
          backdrop-blur-xl shadow-[0_0_20px_rgba(0,255,255,0.15)]"
      >
        {/* 🚀 Logo */}
        <motion.h1
          whileHover={{ scale: 1.06 }}
          animate={{
            textShadow: [
              "0 0 10px rgba(0,255,255,0.3)",
              "0 0 20px rgba(0,255,255,0.7)",
              "0 0 10px rgba(0,255,255,0.3)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          onClick={() => scrollTo("home")}
          className="font-extrabold cursor-pointer bg-gradient-to-r from-cyan-300 via-blue-300 to-cyansoft bg-clip-text text-transparent text-lg sm:text-xl md:text-2xl"
        >
          Deepak<span className="text-white/60 font-light">.dev</span>
        </motion.h1>

        {/* 🖥 Desktop Nav */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6 relative">
          {sections.map((sec) => (
            <motion.button
              key={sec}
              ref={(el) => (buttonsRef.current[sec] = el)}
              onClick={() => scrollTo(sec)}
              className={linkClass(sec)}
              whileHover={{ scale: 1.08 }}
            >
              {sec.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              <span className="absolute inset-0 rounded-full bg-cyansoft/10 opacity-0 group-hover:animate-ripple" />
            </motion.button>
          ))}

          {/* ⚡ Underline */}
          <motion.div
            className="absolute bottom-0 h-[2px] bg-gradient-to-r from-cyan-400 via-cyansoft to-cyan-400 shadow-[0_0_10px_#00ffff] rounded-full"
            animate={{ x: underlinePos.x, width: underlinePos.width }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
        </div>

        {/* 📱 Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setOpen(!open)}
          className="md:hidden text-white/90 hover:text-cyansoft"
        >
          {open ? <FaTimes size={22} /> : <FaBars size={22} />}
        </motion.button>

        {/* 📱 Mobile Drawer */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="absolute top-full mt-3 left-0 right-0 mx-auto w-[95%] bg-black/85 backdrop-blur-2xl border border-cyan-400/30 rounded-2xl p-5 shadow-[0_0_25px_rgba(0,255,255,0.25)] md:hidden"
            >
              <div className="flex flex-col gap-3">
                {sections.map((sec) => (
                  <motion.button
                    key={sec}
                    onClick={() => scrollTo(sec)}
                    whileTap={{ scale: 0.97 }}
                    className={`text-left px-4 py-3 text-base rounded-md transition-all duration-300 ${
                      active === sec
                        ? "bg-cyansoft text-black font-semibold"
                        : "text-white/80 hover:bg-cyansoft/10"
                    }`}
                  >
                    {sec.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* 💫 Glow Trail */}
      <motion.div
        className="absolute bottom-0 w-[60%] sm:w-[40%] h-[2px] bg-gradient-to-r from-transparent via-cyansoft to-transparent opacity-40 blur-sm"
        animate={{ x: ["-40%", "40%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ✨ Styles */}
      <style jsx="true">{`
        .glow-text {
          text-shadow: 0 0 8px rgba(0, 255, 255, 0.6),
            0 0 15px rgba(0, 255, 255, 0.4);
        }
        @keyframes ripple {
          0% {
            opacity: 0.3;
            transform: scale(0.9);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
          100% {
            opacity: 0;
            transform: scale(1.3);
          }
        }
        .animate-ripple {
          animation: ripple 0.8s ease-out;
        }

        /* 🧠 Responsive optimization for ultra-wide */
        @media (min-width: 1600px) {
          nav {
            max-width: 1400px !important;
          }
        }

        /* 💡 Reduce heavy glow on small screens */
        @media (max-width: 480px) {
          .shadow-[0_0_20px_rgba(0,255,255,0.15)] {
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.1) !important;
          }
        }
      `}</style>
    </motion.header>
  );
}
