"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, User, Code, Briefcase, Award, Clock, FileText, Mail, BookOpen, Menu, X, BarChart3, Moon, Sun } from "lucide-react";
import { logLinkClick } from "../utils/analytics";
import { scrollToSection } from "@/utils/scrollToSection";
import { useLightweightMotion } from "@/hooks/useLightweightMotion";

const NAV_ITEMS = [
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

export default function Navbar({ sectionsConfig, theme = "light", onThemeToggle }) {
  const isDark = theme === "dark";

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
    () => NAV_ITEMS.filter((item) => resolvedSectionsConfig[item.id]),
    [resolvedSectionsConfig]
  );

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const lightweightMotion = useLightweightMotion();

  // Active section observer. This avoids a scroll listener firing on every frame.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const visibleScores = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        let nextActive = null;

        entries.forEach((entry) => {
          if (!resolvedSectionsConfig[entry.target.id]) return;

          if (entry.isIntersecting) {
            visibleScores.set(entry.target.id, entry.intersectionRatio);
          } else {
            visibleScores.delete(entry.target.id);
          }
        });

        if (visibleScores.size > 0) {
          nextActive = [...visibleScores.entries()].sort((a, b) => b[1] - a[1])[0][0];
        } else if (window.scrollY <= 120) {
          nextActive = "home";
        }

        if (nextActive) {
          setActive((current) => (current === nextActive ? current : nextActive));
        }
      },
      {
        threshold: [0.18, 0.35, 0.55],
        rootMargin: "-72px 0px -35% 0px",
      }
    );

    visibleNavItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [visibleNavItems, resolvedSectionsConfig]);

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
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const toggleTheme = () => {
    onThemeToggle?.();
    logLinkClick(`theme_${isDark ? "light" : "dark"}`);
  };

  const ThemeIcon = isDark ? Sun : Moon;

  return (
    <>
      {/* Desktop Navbar */}
      <motion.header
        initial={lightweightMotion ? false : { y: -48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: lightweightMotion ? 0.1 : 0.25, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-[999] hidden pt-1 xl:block"
      >
        <nav className="mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-8">
          <div
            className="relative flex h-16 items-center justify-between rounded-lg border px-4 shadow-lg backdrop-blur-md sm:px-6"
            style={{
              backgroundColor: "var(--color-nav)",
              borderColor: "var(--color-border)",
              boxShadow: "var(--shadow-soft)",
            }}
          >
            {/* Logo */}
            <motion.button
              onClick={() => scrollTo("home")}
              whileHover={lightweightMotion ? undefined : { scale: 1.04 }}
              whileTap={lightweightMotion ? undefined : { scale: 0.97 }}
              className="group flex items-center gap-2"
            >
              <span
                className="bg-clip-text text-lg font-bold text-transparent"
                style={{
                  backgroundImage: "linear-gradient(90deg, var(--color-text), var(--color-accent-strong), var(--color-warm))",
                }}
              >
                Deepak
              </span>
            </motion.button>

            {/* Desktop Navigation */}
            <div className="flex items-center gap-0.5">
              {visibleNavItems.map(({ id, label, icon: Icon }) => (
                <motion.button
                  key={id}
                  onClick={() => scrollTo(id)}
                  whileHover={lightweightMotion ? undefined : { scale: 1.04 }}
                  whileTap={lightweightMotion ? undefined : { scale: 0.97 }}
                  className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ${
                    active === id ? "text-[var(--color-text)]" : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
                  }`}
                >
                  {active === id && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-0 rounded-lg border"
                      style={{
                        background: "linear-gradient(90deg, var(--color-accent-soft), rgba(217, 119, 6, 0.1))",
                        borderColor: "var(--color-border-strong)",
                      }}
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

            <button
              type="button"
              onClick={toggleTheme}
              className="ml-2 flex h-10 w-10 items-center justify-center rounded-lg border text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
              style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface-soft)" }}
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
              title={isDark ? "Light theme" : "Dark theme"}
            >
              <ThemeIcon size={17} />
            </button>

            {/* Blog Link (Desktop) - Conditional */}
            {resolvedSectionsConfig.blog && (
              <motion.a
                href="/blog"
                whileHover={lightweightMotion ? undefined : { scale: 1.04 }}
                whileTap={lightweightMotion ? undefined : { scale: 0.97 }}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-400 to-amber-300 px-4 py-2 font-semibold text-slate-950 shadow-lg shadow-emerald-950/15 transition-colors hover:from-teal-300 hover:to-amber-200"
              >
                <BookOpen size={16} />
                Blog
              </motion.a>
            )}
          </div>
        </nav>
      </motion.header>

      {/* Mobile Navigation */}
      <div className="xl:hidden">
        <motion.header
          initial={lightweightMotion ? false : { y: -32, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: lightweightMotion ? 0.08 : 0.22, ease: "easeOut" }}
          className="fixed inset-x-0 top-0 z-[1000] px-3 pt-2 sm:px-4"
        >
          <nav
            className="flex h-14 items-center justify-between rounded-lg border px-3 shadow-lg backdrop-blur-md"
            style={{
              backgroundColor: "var(--color-nav)",
              borderColor: "var(--color-border)",
              boxShadow: "var(--shadow-soft)",
            }}
          >
            <button
              type="button"
              onClick={() => scrollTo("home")}
              className="min-w-0 text-left"
              aria-label="Go to home"
            >
              <span
                className="block bg-clip-text text-base font-black text-transparent"
                style={{
                  backgroundImage: "linear-gradient(90deg, var(--color-text), var(--color-accent-strong), var(--color-warm))",
                }}
              >
                Deepak
              </span>
              <span className="block text-[11px] font-medium text-[var(--color-faint)]">Portfolio</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex h-10 w-10 items-center justify-center rounded-lg border text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
                style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface-soft)" }}
                aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
                title={isDark ? "Light theme" : "Dark theme"}
              >
                <ThemeIcon size={17} />
              </button>

              <motion.button
                type="button"
                whileTap={lightweightMotion ? undefined : { scale: 0.94 }}
                onClick={() => setOpen((value) => !value)}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-teal-400 to-amber-300 text-slate-950 shadow-lg shadow-black/15"
                aria-label={open ? "Close navigation" : "Open navigation"}
                aria-expanded={open}
                aria-controls="mobile-navigation"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {open ? (
                    <motion.span
                      key="close"
                      initial={lightweightMotion ? { opacity: 1 } : { rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={lightweightMotion ? { opacity: 0 } : { rotate: 90, opacity: 0 }}
                      transition={{ duration: lightweightMotion ? 0.08 : 0.16 }}
                    >
                      <X size={22} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={lightweightMotion ? { opacity: 1 } : { rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={lightweightMotion ? { opacity: 0 } : { rotate: -90, opacity: 0 }}
                      transition={{ duration: lightweightMotion ? 0.08 : 0.16 }}
                    >
                      <Menu size={22} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </nav>
        </motion.header>

        {/* Mobile Menu Backdrop */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              transition={{ duration: lightweightMotion ? 0.08 : 0.18 }}
              className="fixed inset-0 z-[998] bg-slate-950/55 backdrop-blur-sm"
            />
          )}
        </AnimatePresence>

        {/* Mobile Menu Modal */}
        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-navigation"
              initial={lightweightMotion ? { opacity: 0, y: -8 } : { scale: 0.98, opacity: 0, y: -18 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={lightweightMotion ? { opacity: 0, y: -8 } : { scale: 0.98, opacity: 0, y: -18 }}
              transition={lightweightMotion ? { duration: 0.1 } : { type: "spring", damping: 24, stiffness: 260 }}
              className="fixed inset-x-3 top-20 z-[999] max-h-[calc(100svh-6rem)] overflow-y-auto rounded-lg border shadow-xl sm:inset-x-4"
              style={{
                backgroundColor: "var(--color-nav)",
                borderColor: "var(--color-border)",
                boxShadow: "var(--shadow-elevated)",
              }}
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
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-all ${
                      active === id
                        ? "border-l-2 border-teal-400 bg-gradient-to-r from-teal-400/18 to-amber-300/10 text-[var(--color-text)]"
                        : "text-[var(--color-muted)] hover:bg-black/5 hover:text-[var(--color-text)]"
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
                    onClick={() => setOpen(false)}
                    initial={lightweightMotion ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: lightweightMotion ? 0 : (visibleNavItems.length + 1) * 0.025, duration: 0.12 }}
                    className="mt-2 flex items-center gap-3 border-t px-4 py-3 pt-2 text-left text-[var(--color-text)] transition-colors hover:bg-black/5"
                    style={{ borderColor: "var(--color-border)" }}
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
