import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./index.css";

// Components
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import About from "./components/About";
import TechStack from "./components/TechStack";
import Projects from "./components/Projects";
import Resume from "./components/Resume";
import Contact from "./components/Contact";
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

// Blog page
import MassiveAnimatedBlogPage from "./components/blogpage";

// Firestore hook
import { useFirestoreData } from "./hooks/useFirestoreData";

/* ✅ Fetch Sections Configuration from Firestore */
function SectionsConfigLoader({ children }) {
  const { data: sectionsData, loading: sectionsLoading } = useFirestoreData('sections', 'visibility');

  const sectionsConfig = sectionsData || {
    home: true,
    about: true,
    "tech-stack": true,
    projects: true,
    resume: true,
    contact: true,
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
  ];

  return (
    <div className="p-4 border-b border-white/10 bg-[#0a0a0a] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="text-white/80 font-semibold">Admin Panel</div>
        <div className="flex gap-3">
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
        {sectionsConfig.contact && <Contact />}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1);
    return () => clearTimeout(timer);
  }, []);

  // Mouse glow effect (UI effect)
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

            {/* 📰 Blog */}
            <Route
              path="/blog"
              element={
                <div className="min-h-screen bg-slate-50 text-slate-900">
                  <Navbar />
                  <main className="pt-6">
                    <MassiveAnimatedBlogPage />
                  </main>
                  <Footer />
                </div>
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

            {/* 🧭 Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      )}
    </SectionsConfigLoader>
  );
}

export default App;