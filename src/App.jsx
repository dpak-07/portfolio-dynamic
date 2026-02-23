import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./index.css";

// Analytics
import { initializeGA, initializeGTM } from "./utils/analytics";

// Components
import Navbar from "./components/Navbar";
import FloatingFAB from "./components/FloatingFAB";
import GlobalBackgroundEffects from "./components/GlobalBackgroundEffects";
import Header from "./components/Header";
import About from "./components/About";
import TechStack from "./components/TechStack";
import GitHubStats from "./components/GitHubStats";
import Projects from "./components/Projects";
import Resume from "./components/Resume";
import Contact from "./components/Contact";
import Certifications from "./components/certifications";
import TimelineSection from "./components/timeline";
import Footer from "./components/Footer";
import Loader from "./components/LoadingScreen";
import OfflinePage from "./components/offiline"; // ✅ NEW

// Admin pages
import AdminLogin from "./components/admin/adminlogin";
import AdminDashboard from "./components/admin/admindashboard";
import HeaderEditor from "./components/admin/headeradmin";
import AboutEditor from "./components/admin/aboutusadmin";
import TechStackEditor from "./components/admin/techadmin";
import ProjectsEditor from "./components/admin/projectadmin";
import ResumeEditor from "./components/admin/resumeadmin";
import CertificationsEditor from "./components/admin/certificationsadmin";
import TimelineEditor from "./components/admin/timelineadmin";
import GitHubStatsEditor from "./components/admin/githubstatsadmin";
import AnalysisDashboard from "./components/admin/AnalysisDashboard";

// Blog page
import MassiveAnimatedBlogPage from "./components/blogpage";
import BlogEditor from "./components/admin/BlogEditor";
import LinkedInEditor from "./components/admin/LinkedInEditor";

// Firestore hook
import { useFirestoreData } from "./hooks/useFirestoreData";

/* ✅ FIREBASE TOGGLE CONFIGURATION - Set to true to fetch from Firebase, false to use defaults */
/* ⚡ Set to false for faster development - no Firebase calls */
const SHOULD_FETCH_FROM_FIREBASE = false;

/* ✅ Default sections configuration (used when Firebase fetching is disabled) */
const DEFAULT_SECTIONS_CONFIG = {
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
};

/* ✅ Fetch Sections Configuration from Firestore */
function SectionsConfigLoader({ children }) {
  const { data: sectionsData, loading: sectionsLoading } = useFirestoreData(
    SHOULD_FETCH_FROM_FIREBASE ? "sections" : null,
    SHOULD_FETCH_FROM_FIREBASE ? "visibility" : null
  );

  /* ✅ Use Firebase data if fetching is enabled, otherwise use default config */
  const sectionsConfig = SHOULD_FETCH_FROM_FIREBASE
    ? sectionsData || DEFAULT_SECTIONS_CONFIG
    : DEFAULT_SECTIONS_CONFIG;

  /* ✅ If Firebase is disabled, sections are loaded instantly */
  const actualLoading = SHOULD_FETCH_FROM_FIREBASE ? sectionsLoading : false;

  return children(sectionsConfig, actualLoading);
}

/* ✅ AdminRoute — Protect admin pages */
function AdminRoute({ children }) {
  const isAdmin = localStorage.getItem("isAdmin") === "1";
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
}

/* ✅ Shared Admin Navbar */
function AdminNavbar() {
  const location = useLocation();
  const links = [
    { name: "Dashboard", path: "/admindsh" },
    { name: "Header", path: "/admin/header" },
    { name: "About", path: "/admin/about" },
    { name: "Tech", path: "/admin/techadmin" },
    { name: "Projects", path: "/admin/projects" },
    { name: "GitHub Stats", path: "/admin/githubstats" },
    { name: "Resume", path: "/admin/resume" },
    { name: "Certifications", path: "/admin/certifications" },
    { name: "Timeline", path: "/admin/timeline" },
    { name: "Analysis", path: "/admin/analysis" },
  ];

  return (
    <div className="p-4 border-b border-white/10 bg-[#0a0a0a] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="text-white/80 font-semibold">Admin Panel</div>
        <div className="flex gap-3 flex-wrap">
          {links.map((link) => (
            <a
              key={link.path}
              href={link.path}
              className={`text-sm px-3 py-1 rounded transition-all ${location.pathname === link.path
                ? "bg-white/20 text-white"
                : "bg-white/5 text-white/70 hover:bg-white/10"
                }`}
            >
              {link.name}
            </a>
          ))}
          <a
            href="/"
            className="text-sm px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-white/70"
          >
            Back to site
          </a>
        </div>
      </div>
    </div>
  );
}

/* ✅ Public Home Page Shell */
function HomeShell({ sectionsConfig }) {
  return (
    <div className="relative overflow-x-hidden text-white">
      {/* Global Background Effects */}
      <GlobalBackgroundEffects />

      {/* Desktop Navbar */}
      <Navbar />

      {/* Mobile FAB Menu */}
      <FloatingFAB />

      {sectionsConfig.home && <Header />}

      <main className="relative z-10">
        {sectionsConfig.about && <About />}
        {sectionsConfig["tech-stack"] && <TechStack />}
        {sectionsConfig["github-stats"] && <GitHubStats />}
        {sectionsConfig.projects && <Projects />}
        {sectionsConfig.resume && <Resume />}
        {sectionsConfig.certifications && <Certifications />}
        {sectionsConfig.timeline && <TimelineSection />}
        {sectionsConfig.contact && <Contact />}
      </main>

      <Footer />
    </div>
  );
}

/* ✅ Main App */
function App() {
  const [minTimePassed, setMinTimePassed] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // ⏱ Force loader to stay for at least 500ms (optimized for instant loading)
  useEffect(() => {
    const timer = setTimeout(() => setMinTimePassed(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // 🌐 Detect offline / online
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // ✨ Mouse glow UI
  useEffect(() => {
    const handleMouseMove = (e) => {
      document.body.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.body.style.setProperty("--mouse-y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 📊 Analytics tracking & Google Analytics initialization
  useEffect(() => {
    // ✅ Initialize Google Analytics 4 and Google Tag Manager
    initializeGA();
    initializeGTM();

    let cleanup = null;

    // Import analytics functions dynamically
    import("./utils/analytics")
      .then((mod) => {
        const logDeviceInfo = mod.logDeviceInfo || (() => { });
        const logTrafficSource = mod.logTrafficSource || (() => { });
        const logError = mod.logError || (() => { });
        const trackEvent = mod.trackEvent || mod.sendGAEvent || (() => { });
        const logPageView =
          mod.logPageView ||
          ((path, title) =>
            trackEvent("page_view", {
              page_path: path,
              page_title: title,
              page_location: window.location.href,
            }));

        // Log device and traffic info on mount
        logDeviceInfo();
        logTrafficSource();

        // ✅ Track initial page view
        logPageView(window.location.pathname, "Portfolio Homepage");

        // ✅ Track page visibility changes
        const handleVisibilityChange = () => {
          if (document.hidden) {
            trackEvent("user_engagement", {
              event_category: "engagement",
              event_label: "page_hidden",
              value: new Date().getTime(),
            });
          } else {
            trackEvent("user_engagement", {
              event_category: "engagement",
              event_label: "page_visible",
              value: new Date().getTime(),
            });
          }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);

        // ✅ Track user interactions
        const handleInteraction = () => {
          trackEvent("user_interaction", {
            event_category: "engagement",
            event_label: "user_active",
            timestamp: new Date().toISOString(),
          });
        };
        window.addEventListener("click", handleInteraction);
        window.addEventListener("scroll", handleInteraction);

        // ✅ Global error tracking
        const handleError = (event) => {
          logError(event.message, event.error?.stack, "Global");
          trackEvent("error_occurred", {
            event_category: "error",
            event_label: event.message,
            error_stack: event.error?.stack,
          });
        };
        window.addEventListener("error", handleError);

        // ✅ Unhandled promise rejection tracking
        const handleUnhandledRejection = (event) => {
          logError(
            "Unhandled Promise Rejection",
            event.reason?.toString(),
            "UnhandledPromise"
          );
          trackEvent("error_unhandled_promise", {
            event_category: "error",
            event_label: "unhandled_promise",
            reason: event.reason?.toString(),
          });
        };
        window.addEventListener("unhandledrejection", handleUnhandledRejection);

        cleanup = () => {
          document.removeEventListener("visibilitychange", handleVisibilityChange);
          window.removeEventListener("click", handleInteraction);
          window.removeEventListener("scroll", handleInteraction);
          window.removeEventListener("error", handleError);
          window.removeEventListener("unhandledrejection", handleUnhandledRejection);
        };
      })
      .catch((error) => {
        console.error("Analytics module load failed:", error);
      });

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  // 🚨 If offline, show offline page
  if (isOffline) return <OfflinePage />;

  return (
    <SectionsConfigLoader>
      {(sectionsConfig, sectionsLoading) => {
        const stillLoading = !minTimePassed || sectionsLoading;

        useEffect(() => {
          if (!stillLoading) {
            setFadeOut(true);
            const t = setTimeout(() => setFadeOut(false), 800);
            return () => clearTimeout(t);
          }
        }, [stillLoading]);

        return (
          <>
            <AnimatePresence>
              {stillLoading && (
                <motion.div
                  key="loader"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="fixed inset-0 z-[9999]"
                >
                  <Loader onFinish={() => setMinTimePassed(true)} />
                </motion.div>
              )}
            </AnimatePresence>

            {!stillLoading && (
              <motion.div
                key="main"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <BrowserRouter>
                  <Routes>
                    {/* 🌍 Public Routes */}
                    <Route path="/" element={<HomeShell sectionsConfig={sectionsConfig} />} />

                    {/* 📰 Blog Page */}
                    <Route
                      path="/blog"
                      element={
                        sectionsConfig.blog ? (
                          <MassiveAnimatedBlogPage />
                        ) : (
                          <Navigate to="/" replace />
                        )
                      }
                    />

                    {/* 🔐 Admin Routes */}
                    <Route path="/admin/login" element={
                      <div className="relative min-h-screen">
                        <GlobalBackgroundEffects />
                        <div className="relative z-10">
                          <AdminLogin />
                        </div>
                      </div>
                    } />
                    <Route
                      path="/admindsh"
                      element={
                        <AdminRoute>
                          <div className="relative min-h-screen">
                            <GlobalBackgroundEffects />
                            <div className="relative z-10">
                              <AdminDashboard />
                            </div>
                          </div>
                        </AdminRoute>
                      }
                    />

                    {/* 🧭 Admin Editor Routes */}
                    {[
                      ["header", HeaderEditor],
                      ["about", AboutEditor],
                      ["techadmin", TechStackEditor],
                      ["projects", ProjectsEditor],
                      ["githubstats", GitHubStatsEditor],
                      ["resume", ResumeEditor],
                      ["certifications", CertificationsEditor],
                      ["timeline", TimelineEditor],
                      ["blog", BlogEditor],
                      ["linkedin", LinkedInEditor],
                      ["analysis", AnalysisDashboard],
                    ].map(([path, Component]) => (
                      <Route
                        key={path}
                        path={`/admin/${path}`}
                        element={
                          <AdminRoute>
                            <div className="min-h-screen bg-[#000] text-white relative">
                              <GlobalBackgroundEffects />
                              <AdminNavbar />
                              <div className="relative z-10">
                                <Component />
                              </div>
                            </div>
                          </AdminRoute>
                        }
                      />
                    ))}

                    {/* 🧭 Catch-all redirect */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </BrowserRouter>
              </motion.div>
            )}
          </>
        );
      }}
    </SectionsConfigLoader>
  );
}

export default App;
