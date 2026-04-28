import { useEffect, useRef, useState } from "react";
import { Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  initializeGA,
  initializeGTM,
  logDeviceInfo,
  logError,
  logPageView,
  logTrafficSource,
  trackEvent,
} from "./utils/analytics";
import { isAdminAuthenticated, touchAdminSession } from "./utils/adminSession";
import { preloadFirestoreEntries } from "./utils/firestoreCache";

import Navbar from "./components/Navbar";
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
import OfflinePage from "./components/offiline";

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

import MassiveAnimatedBlogPage from "./components/blogpage";
import BlogEditor from "./components/admin/BlogEditor";
import LinkedInEditor from "./components/admin/LinkedInEditor";
import AdminResponsiveStyles from "./components/admin/AdminResponsiveStyles";

import { useFirestoreData } from "./hooks/useFirestoreData";

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

const INITIAL_FIRESTORE_ENTRIES = [
  { collectionName: "sections", docId: "visibility" },
  { collectionName: "portfolio", docId: "profile" },
  { collectionName: "resume", docId: "data" },
  { collectionName: "aboutpage", docId: "main" },
  { collectionName: "techStack", docId: "categories" },
  { collectionName: "portfolio", docId: "githubStats" },
  { collectionName: "projects", docId: "data" },
  { collectionName: "certifications", docId: "data" },
  { collectionName: "timeline", docId: "data" },
  { collectionName: "footer", docId: "details" },
  { collectionName: "blog" },
  { collectionName: "linkedin" },
];

function SectionsConfigLoader({ children }) {
  const { data: sectionsData, loading: sectionsLoading } = useFirestoreData("sections", "visibility");

  const sectionsConfig = sectionsData || DEFAULT_SECTIONS_CONFIG;
  const actualLoading = sectionsLoading;

  return children(sectionsConfig, actualLoading);
}

function AdminRoute({ children }) {
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(() => isAdminAuthenticated());
  const lastTouchRef = useRef(0);

  useEffect(() => {
    const syncSession = ({ force = false } = {}) => {
      const now = Date.now();
      if (!force && now - lastTouchRef.current < 60 * 1000) {
        return;
      }

      lastTouchRef.current = now;
      setIsAuthorized(Boolean(touchAdminSession(now)));
    };

    syncSession({ force: true });

    const handleActivity = () => syncSession();
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        syncSession({ force: true });
      }
    };

    const interval = setInterval(() => {
      setIsAuthorized(isAdminAuthenticated());
    }, 60 * 1000);

    window.addEventListener("pointerdown", handleActivity, { passive: true });
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("scroll", handleActivity, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("pointerdown", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [location.pathname]);

  if (!isAuthorized) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

function AdminNavbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
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
    { name: "Blog", path: "/admin/blog" },
    { name: "LinkedIn", path: "/admin/linkedin" },
    { name: "Analysis", path: "/admin/analysis" },
  ];
  const currentLink = links.find((link) => link.path === location.pathname);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a] p-4">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-semibold text-white/80">Admin Panel</div>
            <div className="text-xs text-white/45 md:hidden">
              {currentLink?.name || "Editor"}
            </div>
          </div>

          <div className="hidden flex-wrap gap-3 md:flex">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`rounded px-3 py-1 text-sm transition-all ${
                  location.pathname === link.path
                    ? "bg-white/20 text-white"
                    : "bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/" className="rounded bg-white/5 px-3 py-1 text-sm text-white/70 hover:bg-white/10">
              Back to site
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileOpen((open) => !open)}
              className="rounded bg-white/10 px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/15"
            >
              {mobileOpen ? "Close" : "Modules"}
            </button>
            <Link to="/" className="rounded bg-white/5 px-3 py-2 text-sm text-white/70 hover:bg-white/10">
              Site
            </Link>
          </div>
        </div>

        {mobileOpen && (
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 md:hidden">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`rounded px-3 py-2 text-sm transition-all ${
                  location.pathname === link.path
                    ? "bg-white/20 text-white"
                    : "bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HomeShell({ sectionsConfig }) {
  return (
    <div className="relative overflow-x-hidden text-white">
      <GlobalBackgroundEffects />
      <Navbar sectionsConfig={sectionsConfig} />

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

function AppRoutes({ sectionsConfig }) {
  return (
    <Routes>
      <Route path="/" element={<HomeShell sectionsConfig={sectionsConfig} />} />
      <Route
        path="/blog"
        element={
          sectionsConfig.blog ? <MassiveAnimatedBlogPage /> : <Navigate to="/" replace />
        }
      />

      <Route
        path="/admin/login"
        element={
          <div className="admin-mobile-shell relative min-h-screen">
            <GlobalBackgroundEffects />
            <div className="relative z-10">
              <AdminLogin />
            </div>
          </div>
        }
      />

      <Route
        path="/admindsh"
        element={
          <AdminRoute>
            <div className="admin-mobile-shell relative min-h-screen">
              <GlobalBackgroundEffects />
              <div className="relative z-10">
                <AdminDashboard />
              </div>
            </div>
          </AdminRoute>
        }
      />

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
              <div className="admin-mobile-shell relative min-h-screen bg-[#000] text-white">
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

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function AppContent({ sectionsConfig, sectionsLoading, bootstrapReady, minTimePassed, ssrRendered }) {
  const appReady = minTimePassed && !sectionsLoading && bootstrapReady;
  const [showLoader, setShowLoader] = useState(() => !ssrRendered);

  useEffect(() => {
    if (!appReady) {
      setShowLoader(true);
      return;
    }

    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 550);

    return () => clearTimeout(timer);
  }, [appReady]);

  return (
    <>
      <AnimatePresence>
        {showLoader && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999]"
          >
            <Loader ready={appReady} />
          </motion.div>
        )}
      </AnimatePresence>

      {appReady && !showLoader && (
        <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9 }}>
          <AdminResponsiveStyles />
          <AppRoutes sectionsConfig={sectionsConfig} />
        </motion.div>
      )}
    </>
  );
}

function App({ ssrRendered = false }) {
  const [minTimePassed, setMinTimePassed] = useState(() => ssrRendered);
  const [isOffline, setIsOffline] = useState(() =>
    typeof navigator === "undefined" ? false : !navigator.onLine
  );
  const [bootstrapReady, setBootstrapReady] = useState(() => ssrRendered);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimePassed(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let active = true;

    preloadFirestoreEntries(INITIAL_FIRESTORE_ENTRIES)
      .catch((error) => {
        console.error("Initial Firestore preload failed:", error);
      })
      .finally(() => {
        if (active) {
          setBootstrapReady(true);
        }
      });

    return () => {
      active = false;
    };
  }, []);

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

  useEffect(() => {
    const handleMouseMove = (event) => {
      document.body.style.setProperty("--mouse-x", `${event.clientX}px`);
      document.body.style.setProperty("--mouse-y", `${event.clientY}px`);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    initializeGA();
    initializeGTM();

    let cleanup = null;

    Promise.resolve({ logDeviceInfo, logTrafficSource, logError, trackEvent, logPageView })
      .then((mod) => {
        const safeLogDeviceInfo = mod.logDeviceInfo || (() => {});
        const safeLogTrafficSource = mod.logTrafficSource || (() => {});
        const safeLogError = mod.logError || (() => {});
        const safeTrackEvent = mod.trackEvent || mod.sendGAEvent || (() => {});
        const safeLogPageView =
          mod.logPageView ||
          ((path, title) =>
            safeTrackEvent("page_view", {
              page_path: path,
              page_title: title,
              page_location: window.location.href,
            }));

        safeLogDeviceInfo();
        safeLogTrafficSource();
        safeLogPageView(window.location.pathname, "Portfolio Homepage");

        const handleVisibilityChange = () => {
          safeTrackEvent("user_engagement", {
            event_category: "engagement",
            event_label: document.hidden ? "page_hidden" : "page_visible",
            value: Date.now(),
          });
        };

        let lastInteractionAt = 0;
        const handleInteraction = () => {
          const now = Date.now();
          if (now - lastInteractionAt < 15000) return;

          lastInteractionAt = now;
          safeTrackEvent("user_interaction", {
            event_category: "engagement",
            event_label: "user_active",
            timestamp: new Date(now).toISOString(),
          });
        };

        const handleError = (event) => {
          safeLogError(event.message, event.error?.stack, "Global");
          safeTrackEvent("error_occurred", {
            event_category: "error",
            event_label: event.message,
            error_stack: event.error?.stack,
          });
        };

        const handleUnhandledRejection = (event) => {
          safeLogError("Unhandled Promise Rejection", event.reason?.toString(), "UnhandledPromise");
          safeTrackEvent("error_unhandled_promise", {
            event_category: "error",
            event_label: "unhandled_promise",
            reason: event.reason?.toString(),
          });
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("pointerdown", handleInteraction, { passive: true });
        window.addEventListener("keydown", handleInteraction);
        window.addEventListener("error", handleError);
        window.addEventListener("unhandledrejection", handleUnhandledRejection);

        cleanup = () => {
          document.removeEventListener("visibilitychange", handleVisibilityChange);
          window.removeEventListener("pointerdown", handleInteraction);
          window.removeEventListener("keydown", handleInteraction);
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

  if (isOffline) {
    return <OfflinePage />;
  }

  return (
    <SectionsConfigLoader>
      {(sectionsConfig, sectionsLoading) => (
        <AppContent
          sectionsConfig={sectionsConfig}
          sectionsLoading={sectionsLoading}
          bootstrapReady={bootstrapReady}
          minTimePassed={minTimePassed}
          ssrRendered={ssrRendered}
        />
      )}
    </SectionsConfigLoader>
  );
}

export default App;
