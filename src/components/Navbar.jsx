"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFirestoreData } from "@/hooks/useFirestoreData";
import { Home, User, Code, Briefcase, Award, Clock, FileText, Mail, BookOpen, Menu, X, BarChart3, MoreVertical } from "lucide-react";
import { logLinkClick } from "../utils/analytics";

export default function Navbar() {
  // Firestore data for section visibility
  const { data: firestoreSectionsData } = useFirestoreData("sections", "visibility");

  // Navigation items with modern icons
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "about", label: "About", icon: User },
    { id: "tech-stack", label: "Tech Stack", icon: Code },
    { id: "github-stats", label: "GitHub Stats", icon: BarChart3 },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "certifications", label: "Certifications", icon: Award },
    { id: "timeline", label: "Timeline", icon: Clock },
    { id: "resume", label: "Resume", icon: FileText },
    { id: "contact", label: "Contact", icon: Mail },
  ];

  // Sections configuration from Firestore or defaults
  const sectionsConfig = useMemo(
    () =>
      firestoreSectionsData || {
        home: true,
        about: true,
        "tech-stack": true,
        "github-stats": true,
        projects: true,
        resume: true,
        certifications: true,
        timeline: true,
        contact: true,
      },
    [firestoreSectionsData]
  );

  // Filter visible sections based on config
  const visibleNavItems = useMemo(
    () => navItems.filter((item) => sectionsConfig[item.id]),
    [sectionsConfig]
  );

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll progress and navbar visibility - optimized
  useEffect(() => {
    let ticking = false;
    let hideTimer = null;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          const height = document.body.scrollHeight - window.innerHeight;
          setScrollProgress((scrolled / height) * 100);

          // Hide navbar on scroll down, show on scroll up
          if (scrolled > lastScroll && scrolled > 100) {
            setIsVisible(false);
          } else {
            setIsVisible(true);
          }
          setLastScroll(scrolled);

          // Clear previous timer
          if (hideTimer) clearTimeout(hideTimer);

          // Show navbar after 2 seconds of no scrolling
          hideTimer = setTimeout(() => {
            setIsVisible(true);
          }, 2000);

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [lastScroll]);

  // Active section observer - optimized for instant detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && sectionsConfig[entry.target.id]) {
            setActive(entry.target.id);
          }
        });
      },
      { threshold: 0.2 } // Reduced threshold for faster detection
    );

    visibleNavItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [visibleNavItems, sectionsConfig]);

  // Smooth scroll with analytics
  const scrollTo = (id) => {
    if (!sectionsConfig[id]) return;

    const el = document.getElementById(id);
    if (el) {
      const navHeight = 80;
      const y = el.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: y, behavior: "smooth" });
      setOpen(false);
    }

    logLinkClick(`nav_${id}`);
  };

  // Prevent background scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 origin-left z-[1000]"
        style={{ scaleX: scrollProgress / 100 }}
        initial={{ scaleX: 0 }}
      />

      {/* Desktop Navbar */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: isVisible ? 0 : -100,
          opacity: isVisible ? 1 : 0
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-[999] pt-1 hidden lg:block"
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl px-4 sm:px-6 shadow-2xl">
            {/* Logo */}
            <motion.button
              onClick={() => scrollTo("home")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 group"
            >
              <span className="text-white font-bold text-lg bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Deepak
              </span>
            </motion.button>

            {/* Desktop Navigation */}
            <div className="flex items-center gap-1">
              {visibleNavItems.map(({ id, label, icon: Icon }) => (
                <motion.button
                  key={id}
                  onClick={() => scrollTo(id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${active === id
                    ? "text-white"
                    : "text-white/60 hover:text-white/90"
                    }`}
                >
                  {active === id && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg border border-cyan-500/30"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon size={16} />
                    {label}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Blog Link (Desktop) - Conditional */}
            {sectionsConfig.blog && (
              <motion.a
                href="/blog"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-medium shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all"
              >
                <BookOpen size={16} />
                Blog
              </motion.a>
            )}
          </div>
        </nav>
      </motion.header>

      {/* Mobile Floating Bottom Navigation */}
      <div className="lg:hidden">
        {/* Floating Menu Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setOpen(!open)}
          className="fixed bottom-6 right-6 z-[998] p-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg hover:shadow-xl transition-all"
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MoreVertical size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Mobile Menu Backdrop */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[997]"
            />
          )}
        </AnimatePresence>

        {/* Mobile Menu Modal */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="fixed bottom-24 right-6 z-[998] w-48 bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
            >
              {/* Navigation Items */}
              <div className="py-2 space-y-1">
                {visibleNavItems.map(({ id, label, icon: Icon }, index) => (
                  <motion.button
                    key={id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => scrollTo(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
                      active === id
                        ? "bg-gradient-to-r from-cyan-500/30 to-purple-500/30 border-l-2 border-cyan-500 text-white"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium text-sm">{label}</span>
                  </motion.button>
                ))}

                {/* Blog Link (Mobile) - Conditional */}
                {sectionsConfig.blog && (
                  <motion.a
                    href="/blog"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (visibleNavItems.length + 1) * 0.05 }}
                    className="flex items-center gap-3 px-4 py-3 text-left mt-2 pt-2 border-t border-white/10 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white hover:from-cyan-500/30 hover:to-purple-500/30 transition-all"
                  >
                    <BookOpen size={18} />
                    <span className="font-medium text-sm">Blog</span>
                  </motion.a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}