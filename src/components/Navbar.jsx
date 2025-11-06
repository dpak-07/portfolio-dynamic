"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFirestoreData } from "@/hooks/useFirestoreData";
import { FaBars, FaTimes } from "react-icons/fa";
import { logLinkClick } from "../utils/analytics";

export default function Navbar() {
  const { data: firestoreSectionsData } = useFirestoreData("sections", "visibility");

  const sectionOrder = [
    "home",
    "about",
    "tech-stack",
    "projects",
    "certifications",
    "timeline",
    "resume",
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollTimer, setScrollTimer] = useState(null);

  // 🌈 Scroll progress + navbar visibility with 3-second timer
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          const height = document.body.scrollHeight - window.innerHeight;
          setScrollProgress((scrolled / height) * 100);
          
          // Hide navbar on scroll down, show on scroll up
          if (scrolled > lastScroll && scrolled > 50) {
            setIsVisible(false);
          } else {
            setIsVisible(true);
          }
          setLastScroll(scrolled);

          // Clear previous timer
          if (scrollTimer) clearTimeout(scrollTimer);

          // Set new timer - show navbar after 3 seconds of no scrolling
          const timer = setTimeout(() => {
            setIsVisible(true);
          }, 3000);
          setScrollTimer(timer);

          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, [lastScroll, scrollTimer]);

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
  }, [sections, sectionsConfig]);

  // ✨ Smooth scroll with analytics logging
  const scrollTo = (id) => {
    if (!sectionsConfig[id]) return;
    const el = document.getElementById(id);
    const nav = document.querySelector("header");

    if (el && nav) {
      const navH = nav.offsetHeight;
      const y = el.getBoundingClientRect().top + window.scrollY - navH + 5;
      window.scrollTo({ top: y, behavior: "smooth" });
    }

    logLinkClick(`nav_${id}`);
    setOpen(false);
  };

  // 🚫 Prevent background scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const linkClass = (id) =>
    `relative px-2 sm:px-3 lg:px-4 py-2 text-xs sm:text-sm lg:text-base font-medium tracking-wide transition-all duration-300 ${
      sectionsConfig[id]
        ? active === id
          ? "text-cyansoft neon-text"
          : "text-white/70 hover:text-cyansoft"
        : "text-gray-500 opacity-50 cursor-not-allowed"
    }`;

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: isVisible ? 0 : -60, opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-[999] flex flex-col items-center"
    >
      {/* 🔹 Scroll Progress */}
      <motion.div
        style={{ width: `${scrollProgress}%` }}
        className="h-[2px] bg-gradient-to-r from-cyansoft to-cyan-300 neon-glow"
      />

      {/* 🔸 Main Navbar */}
      <motion.nav
        className="relative mt-1 sm:mt-2 px-2 sm:px-4 md:px-6 lg:px-10 xl:px-12 py-2 sm:py-2.5 
          flex items-center justify-between 
          w-[99%] sm:w-[98%] md:w-[96%] lg:w-[94%] xl:w-[92%] 
          max-w-[1800px]
          rounded-full border border-cyan-400/20 bg-[rgba(10,10,10,0.5)]
          backdrop-blur-xl neon-border"
      >
        {/* 🚀 Logo */}
        <motion.h1
          whileHover={{ scale: 1.03 }}
          onClick={() => scrollTo("home")}
          className="font-extrabold cursor-pointer bg-gradient-to-r from-cyan-300 via-blue-400 to-cyansoft 
            bg-clip-text text-transparent text-sm sm:text-base md:text-lg lg:text-xl neon-text-logo"
        >
          Deepak Portfolio
        </motion.h1>

        {/* 🖥 Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2 xl:gap-3">
          {sections.map((sec) => (
            <motion.button
              key={sec}
              onClick={() => scrollTo(sec)}
              className={linkClass(sec)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {sec.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </motion.button>
          ))}
        </div>

        {/* 📱 Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setOpen(!open)}
          className="md:hidden text-white/90 hover:text-cyansoft transition-colors p-1"
        >
          {open ? <FaTimes size={18} /> : <FaBars size={18} />}
        </motion.button>

        {/* 📱 Mobile Drawer */}
        <AnimatePresence>
          {open && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden"
                style={{ top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}
              />
              
              {/* Menu */}
              <motion.div
                key="menu"
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="absolute top-full mt-2 left-2 right-2 mx-auto
                  bg-black/90 backdrop-blur-2xl border border-cyan-400/30 
                  rounded-2xl p-3 sm:p-4 neon-border-mobile md:hidden
                  max-h-[70vh] overflow-y-auto"
              >
                <div className="flex flex-col gap-2">
                  {sections.map((sec) => (
                    <motion.button
                      key={sec}
                      onClick={() => scrollTo(sec)}
                      whileTap={{ scale: 0.97 }}
                      className={`text-left px-3 py-2.5 text-sm rounded-lg transition-all duration-300 ${
                        active === sec
                          ? "bg-cyansoft text-black font-semibold neon-button"
                          : "text-white/80 hover:bg-cyansoft/10"
                      }`}
                    >
                      {sec.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ✨ Styles */}
      <style jsx="true">{`
        .neon-text {
          text-shadow: 0 0 8px rgba(0, 255, 255, 0.6),
            0 0 12px rgba(0, 255, 255, 0.4);
        }
        
        .neon-text-logo {
          filter: drop-shadow(0 0 8px rgba(0, 255, 255, 0.5));
        }
        
        .neon-glow {
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.6),
            0 0 20px rgba(0, 255, 255, 0.3);
        }
        
        .neon-border {
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.1),
            inset 0 0 15px rgba(0, 255, 255, 0.05);
        }
        
        .neon-border-mobile {
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.2),
            0 0 40px rgba(0, 255, 255, 0.1);
        }
        
        .neon-button {
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.4);
        }

        /* Mobile optimizations */
        @media (max-width: 640px) {
          .neon-border {
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.08);
          }
        }

        /* Tablet optimizations */
        @media (min-width: 641px) and (max-width: 1024px) {
          nav {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
        }

        /* Large screen optimizations */
        @media (min-width: 1600px) {
          nav {
            max-width: 1900px !important;
          }
        }
      `}</style>
    </motion.header>
  );
}