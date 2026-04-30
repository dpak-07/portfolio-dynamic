"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, User, Code, Briefcase, Award, Clock, FileText, Mail, BookOpen, Menu, X, BarChart3 } from "lucide-react";
import { logLinkClick } from "../utils/analytics";
import { scrollToSection } from "@/utils/scrollToSection";
import { useLightweightMotion } from "@/hooks/useLightweightMotion";

export default function Navbar({ sectionsConfig }) {
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

  const resolvedSectionsConfig = useMemo(
    () =>
      sectionsConfig || {
        home: true,
        about: true,
        "tech-stack": true,
        "github-stats": true,
        projects: true,
        resume: true,
        certifications: true,
        timeline: true,
        contact: true,
        blog: true,
      },
    [sectionsConfig]
  );

  // Filter visible sections based on config
  const visibleNavItems = useMemo(
    () => navItems.filter((item) => resolvedSectionsConfig[item.id]),
    [resolvedSectionsConfig]
  );

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const lightweightMotion = useLightweightMotion();

  // Active section observer - optimized for instant detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && resolvedSectionsConfig[entry.target.id]) {
            setActive(entry.target.id);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "-72px 0px -35% 0px",
      }
    );

    visibleNavItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [visibleNavItems, resolvedSectionsConfig]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY <= 120) {
        setActive("home");
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll with analytics
  const scrollTo = (id) => {
    if (!resolvedSectionsConfig[id]) return;

    if (scrollToSection(id, { offset: 88 })) {
      setActive(id);
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
      {/* Desktop Navbar */}
      <motion.header
        initial={lightweightMotion ? false : { y: -48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: lightweightMotion ? 0.1 : 0.25, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-[999] pt-1 hidden lg:block"
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16 bg-[#07100f]/86 backdrop-blur-md border border-emerald-200/10 rounded-lg px-4 sm:px-6 shadow-lg shadow-black/25">
            {/* Logo */}
            <motion.button
              onClick={() => scrollTo("home")}
              whileHover={lightweightMotion ? undefined : { scale: 1.04 }}
              whileTap={lightweightMotion ? undefined : { scale: 0.97 }}
              className="flex items-center gap-2 group"
            >
              <span className="text-white font-bold text-lg bg-gradient-to-r from-emerald-200 via-teal-300 to-amber-200 bg-clip-text text-transparent">
                Deepak
              </span>
            </motion.button>

            {/* Desktop Navigation */}
            <div className="flex items-center gap-1">
              {visibleNavItems.map(({ id, label, icon: Icon }) => (
                <motion.button
                  key={id}
                  onClick={() => scrollTo(id)}
                  whileHover={lightweightMotion ? undefined : { scale: 1.04 }}
                  whileTap={lightweightMotion ? undefined : { scale: 0.97 }}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${active === id
                    ? "text-white"
                    : "text-white/60 hover:text-white/90"
                    }`}
                >
                  {active === id && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-0 bg-gradient-to-r from-emerald-500/18 to-amber-400/12 rounded-lg border border-emerald-300/25"
                      transition={lightweightMotion ? { duration: 0.12 } : { type: "spring", bounce: 0.15, duration: 0.45 }}
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
            {resolvedSectionsConfig.blog && (
              <motion.a
                href="/blog"
                whileHover={lightweightMotion ? undefined : { scale: 1.04 }}
                whileTap={lightweightMotion ? undefined : { scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-amber-400 text-slate-950 rounded-lg font-semibold shadow-lg shadow-emerald-950/25 transition-colors hover:from-emerald-300 hover:to-amber-300"
              >
                <BookOpen size={16} />
                Blog
              </motion.a>
            )}
          </div>
        </nav>
      </motion.header>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Floating Menu Button */}
        <motion.button
          whileTap={lightweightMotion ? undefined : { scale: 0.92 }}
          onClick={() => setOpen(!open)}
          className="fixed bottom-6 right-6 z-[998] p-3 rounded-full bg-gradient-to-r from-emerald-500 to-amber-400 text-slate-950 shadow-lg shadow-black/30 transition-colors hover:from-emerald-300 hover:to-amber-300"
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div
                key="close"
                initial={lightweightMotion ? { opacity: 1 } : { rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={lightweightMotion ? { opacity: 0 } : { rotate: -90, opacity: 0 }}
                transition={{ duration: lightweightMotion ? 0.08 : 0.2 }}
              >
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={lightweightMotion ? { opacity: 1 } : { rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={lightweightMotion ? { opacity: 0 } : { rotate: 90, opacity: 0 }}
                transition={{ duration: lightweightMotion ? 0.08 : 0.2 }}
              >
                <Menu size={24} />
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
              transition={{ duration: lightweightMotion ? 0.08 : 0.18 }}
              className="fixed inset-0 bg-black/65 z-[997] md:backdrop-blur-sm"
            />
          )}
        </AnimatePresence>

        {/* Mobile Menu Modal */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={lightweightMotion ? { opacity: 0, y: 8 } : { scale: 0.94, opacity: 0, y: 18 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={lightweightMotion ? { opacity: 0, y: 8 } : { scale: 0.94, opacity: 0, y: 18 }}
              transition={lightweightMotion ? { duration: 0.1 } : { type: "spring", damping: 24, stiffness: 260 }}
              className="fixed bottom-24 right-6 z-[998] w-52 overflow-hidden rounded-lg border border-emerald-200/10 bg-[#07100f]/95 shadow-xl shadow-black/35"
            >
              {/* Navigation Items */}
              <div className="py-2 space-y-1">
                {visibleNavItems.map(({ id, label, icon: Icon }, index) => (
                  <motion.button
                    key={id}
                    initial={lightweightMotion ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: lightweightMotion ? 0 : index * 0.025, duration: 0.12 }}
                    onClick={() => scrollTo(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
                      active === id
                        ? "bg-gradient-to-r from-emerald-500/22 to-amber-400/12 border-l-2 border-emerald-300 text-white"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium text-sm">{label}</span>
                  </motion.button>
                ))}

                {/* Blog Link (Mobile) - Conditional */}
                {resolvedSectionsConfig.blog && (
                  <motion.a
                    href="/blog"
                    initial={lightweightMotion ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: lightweightMotion ? 0 : (visibleNavItems.length + 1) * 0.025, duration: 0.12 }}
                    className="flex items-center gap-3 px-4 py-3 text-left mt-2 pt-2 border-t border-white/10 bg-gradient-to-r from-emerald-500/18 to-amber-400/12 text-white transition-colors hover:from-emerald-500/26 hover:to-amber-400/20"
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
