import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./index.css";

// Components
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import About from "./components/About";
import TechStack from "./components/TechStack";
import Projects from "./components/Projects";
import Resume from "./components/Resume";
import Contact from "./components/Contact";
import Certifications from "./components/certifications";
import TimelineSection from "./components/timeline";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";
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

// Blog page
import MassiveAnimatedBlogPage from "./components/blogpage";

// Firestore hook
import { useFirestoreData } from "./firebase/hooks/useFirestoreData";

/* ✅ Fetch Sections Configuration from Firestore */
function SectionsConfigLoader({ children }) {
  const { data: sectionsData, loading: sectionsLoading } = useFirestoreData("sections", "visibility");

  const sectionsConfig = sectionsData || {
    home: true,
    about: true,
    "tech-stack": true,
    projects: true,
    resume: true,
    certifications: true,
    timeline: true,
    contact: true,
    blog: true,
  };

  // Instead of directly returning a loader, pass both values
  return children(sectionsConfig, sectionsLoading);
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
    { name: "Resume", path: "/admin/resume" },
    { name: "Certifications", path: "/admin/certifications" },
    { name: "Timeline", path: "/admin/timeline" },
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
              className={`text-sm px-3 py-1 rounded transition-all ${
                location.pathname === link.path
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
      <Navbar />

      {sectionsConfig.home && <Header />}

      <main>
        {sectionsConfig.about && <About />}
        {sectionsConfig["tech-stack"] && <TechStack />}
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

  // ⏱ Force loader to stay for at least 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => setMinTimePassed(true), 2000);
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

  // 🚨 If offline, show offline page
  if (isOffline) {
    return <OfflinePage />;
  }

  return (
    <SectionsConfigLoader>
      {(sectionsConfig, sectionsLoading) => {
        const stillLoading = !minTimePassed || sectionsLoading;

        // 🔥 Smooth fade-out animation for loader
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
                  <LoadingScreen isLoading={true} />
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
                          <div className="min-h-screen bg-slate-50 text-slate-900">
                            <Navbar />
                            <main className="pt-6">
                              <MassiveAnimatedBlogPage />
                            </main>
                            <Footer />
                          </div>
                        ) : (
                          <Navigate to="/" replace />
                        )
                      }
                    />

                    {/* 🔐 Admin Routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route
                      path="/admindsh"
                      element={
                        <AdminRoute>
                          <AdminDashboard />
                        </AdminRoute>
                      }
                    />

                    {/* 🧭 Admin Editor Routes */}
                    {[
                      ["header", HeaderEditor],
                      ["about", AboutEditor],
                      ["techadmin", TechStackEditor],
                      ["projects", ProjectsEditor],
                      ["resume", ResumeEditor],
                      ["certifications", CertificationsEditor],
                      ["timeline", TimelineEditor],
                    ].map(([path, Component]) => (
                      <Route
                        key={path}
                        path={`/admin/${path}`}
                        element={
                          <AdminRoute>
                            <div className="min-h-screen bg-[#000] text-white">
                              <AdminNavbar />
                              <Component />
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
