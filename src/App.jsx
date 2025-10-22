import { useEffect, useState, useRef } from "react";
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
import Certifications from "./components/Certifications"; // ✅ New
import TimelineSection from "./components/timeline"; // ✅ New
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";

// Admin pages
import AdminLogin from "./components/admin/adminlogin";
import AdminDashboard from "./components/admin/admindashboard";
import HeaderEditor from "./components/admin/headeradmin";
import AboutEditor from "./components/admin/aboutusadmin";
import TechStackEditor from "./components/admin/techadmin";
import ProjectsEditor from "./components/admin/projectadmin";
import ResumeEditor from "./components/admin/resumeadmin";
import CertificationsEditor from "./components/admin/certificationsadmin"; // ✅ New
import TimelineEditor from "./components/admin/timelineadmin"; // ✅ New

// Blog page
import MassiveAnimatedBlogPage from "./components/blogpage";

// Firestore hook
import { useFirestoreData } from "./hooks/useFirestoreData";

/* ✅ Fetch Sections Configuration from Firestore */
function SectionsConfigLoader({ children }) {
  const { data: sectionsData, loading: sectionsLoading } = useFirestoreData("sections", "visibility");

  const sectionsConfig = sectionsData || {
    home: true,
    about: true,
    "tech-stack": true,
    projects: true,
    resume: true,
    certifications: true, // ✅ Added
    timeline: true, // ✅ Added
    contact: true,
    blog: true, // Blog is separate page but toggled for nav link
  };

  if (sectionsLoading) {
    return <LoadingScreen />;
  }

  return children(sectionsConfig);
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
    { name: "Certifications", path: "/admin/certifications" }, // ✅ New
    { name: "Timeline", path: "/admin/timeline" }, // ✅ New
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

/* ✅ Lazy Section Loader (only renders when visible) */
function LazySection({ children, threshold = 0.25 }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAppeared, setHasAppeared] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasAppeared(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} className="relative min-h-[50vh]">
      <AnimatePresence>
        {hasAppeared && (
          <motion.div
            key="lazy-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: isVisible ? 1 : 0.6, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ✅ Public Home Page Shell */
function HomeShell({ sectionsConfig }) {
  return (
    <div className="relative overflow-x-hidden text-white">
      <Navbar />

      {sectionsConfig.home && (
        <LazySection>
          <Header />
        </LazySection>
      )}

      <main>
        {sectionsConfig.about && (
          <LazySection>
            <About />
          </LazySection>
        )}
        {sectionsConfig["tech-stack"] && (
          <LazySection>
            <TechStack />
          </LazySection>
        )}
        {sectionsConfig.projects && (
          <LazySection>
            <Projects />
          </LazySection>
        )}
        {sectionsConfig.resume && (
          <LazySection>
            <Resume />
          </LazySection>
        )}
        {sectionsConfig.certifications && (
          <LazySection>
            <Certifications />
          </LazySection>
        )}
        {sectionsConfig.timeline && (
          <LazySection>
            <TimelineSection />
          </LazySection>
        )}
        {sectionsConfig.contact && (
          <LazySection>
            <Contact />
          </LazySection>
        )}
      </main>

      <Footer />
    </div>
  );
}

/* ✅ Main App */
function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1);
    return () => clearTimeout(timer);
  }, []);

  // Mouse glow UI effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      document.body.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.body.style.setProperty("--mouse-y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <SectionsConfigLoader>
      {(sectionsConfig) => (
        <BrowserRouter>
          <Routes>
            {/* 🌍 Public Routes */}
            <Route path="/" element={<HomeShell sectionsConfig={sectionsConfig} />} />

            {/* 📰 Blog Page (Separate Page) */}
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
            <Route
              path="/admin/header"
              element={
                <AdminRoute>
                  <div className="min-h-screen bg-[#000] text-white">
                    <AdminNavbar />
                    <HeaderEditor />
                  </div>
                </AdminRoute>
              }
            />

            <Route
              path="/admin/about"
              element={
                <AdminRoute>
                  <div className="min-h-screen bg-[#000] text-white">
                    <AdminNavbar />
                    <AboutEditor />
                  </div>
                </AdminRoute>
              }
            />

            <Route
              path="/admin/techadmin"
              element={
                <AdminRoute>
                  <div className="min-h-screen bg-[#000] text-white">
                    <AdminNavbar />
                    <TechStackEditor />
                  </div>
                </AdminRoute>
              }
            />

            <Route
              path="/admin/projects"
              element={
                <AdminRoute>
                  <div className="min-h-screen bg-[#000] text-white">
                    <AdminNavbar />
                    <ProjectsEditor />
                  </div>
                </AdminRoute>
              }
            />

            <Route
              path="/admin/resume"
              element={
                <AdminRoute>
                  <div className="min-h-screen bg-[#000] text-white">
                    <AdminNavbar />
                    <ResumeEditor />
                  </div>
                </AdminRoute>
              }
            />

            {/* ✅ Certifications Admin Route */}
            <Route
              path="/admin/certifications"
              element={
                <AdminRoute>
                  <div className="min-h-screen bg-[#000] text-white">
                    <AdminNavbar />
                    <CertificationsEditor />
                  </div>
                </AdminRoute>
              }
            />

            {/* ✅ Timeline Admin Route */}
            <Route
              path="/admin/timeline"
              element={
                <AdminRoute>
                  <div className="min-h-screen bg-[#000] text-white">
                    <AdminNavbar />
                    <TimelineEditor />
                  </div>
                </AdminRoute>
              }
            />

            {/* 🧭 Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      )}
    </SectionsConfigLoader>
  );
}

export default App;
