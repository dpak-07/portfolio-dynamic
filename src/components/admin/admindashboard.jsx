import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  Award,
  BarChart3,
  BookOpen,
  Code2,
  Eye,
  EyeOff,
  FileText,
  FolderKanban,
  Github,
  Image as ImageIcon,
  LayoutDashboard,
  Linkedin,
  LogOut,
  RefreshCw,
  TimerReset,
  UserRound,
} from "lucide-react";
import { db } from "../../firebase";
import { clearAdminSession, touchAdminSession } from "../../utils/adminSession";

const DEFAULT_SECTIONS = {
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

const ROUTES = [
  { name: "Header", path: "/admin/header", icon: ImageIcon, accent: "#22d3ee", description: "Hero profile, roles, and links" },
  { name: "About", path: "/admin/about", icon: UserRound, accent: "#a78bfa", description: "Bio cards, counters, and copy" },
  { name: "Tech Stack", path: "/admin/techadmin", icon: Code2, accent: "#34d399", description: "Skills, categories, and priorities" },
  { name: "Projects", path: "/admin/projects", icon: FolderKanban, accent: "#f59e0b", description: "Portfolio case studies and tags" },
  { name: "GitHub", path: "/admin/githubstats", icon: Github, accent: "#60a5fa", description: "Repository stats and highlights" },
  { name: "Resume", path: "/admin/resume", icon: FileText, accent: "#fb7185", description: "Resume source and downloads" },
  { name: "Certifications", path: "/admin/certifications", icon: Award, accent: "#fbbf24", description: "Certificates and proof links" },
  { name: "Timeline", path: "/admin/timeline", icon: TimerReset, accent: "#38bdf8", description: "Career and learning milestones" },
  { name: "Blog", path: "/admin/blog", icon: BookOpen, accent: "#c084fc", description: "Posts, drafts, and publishing" },
  { name: "LinkedIn", path: "/admin/linkedin", icon: Linkedin, accent: "#0ea5e9", description: "Carousel and social content" },
  { name: "Analytics", path: "/admin/analysis", icon: BarChart3, accent: "#4ade80", description: "Traffic, engagement, and summaries" },
];

function withTimeout(promise, ms = 4500) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      window.setTimeout(() => reject(new Error("Request timed out")), ms);
    }),
  ]);
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [sections, setSections] = useState(DEFAULT_SECTIONS);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkAuthAndLoadSections = async () => {
      if (!touchAdminSession()) {
        navigate("/admin/login", { replace: true });
        return;
      }

      try {
        setLoading(true);
        const sectionsDoc = await withTimeout(getDoc(doc(db, "sections", "visibility")));
        if (sectionsDoc.exists()) {
          setSections((prev) => ({ ...prev, ...sectionsDoc.data() }));
        }
      } catch (error) {
        console.error("Error loading sections:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadSections();
  }, [navigate]);

  const activeSections = useMemo(
    () => Object.values(sections).filter(Boolean).length,
    [sections]
  );
  const totalSections = Object.keys(sections).length;
  const visibilityScore = Math.round((activeSections / totalSections) * 100);

  const toggleSection = async (key) => {
    try {
      setUpdating(true);
      const updated = { ...sections, [key]: !sections[key] };
      setSections(updated);
      await updateDoc(doc(db, "sections", "visibility"), updated);
    } catch (error) {
      console.error("Error updating section:", error);
      setSections(sections);
    } finally {
      setUpdating(false);
    }
  };

  const logout = () => {
    clearAdminSession();
    navigate("/admin/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="crt-panel flex w-full max-w-sm flex-col items-center gap-4 p-6 text-center">
          <RefreshCw className="h-7 w-7 animate-spin text-cyan-300" />
          <div>
            <p className="text-base font-semibold text-white">Loading dashboard</p>
            <p className="mt-1 text-sm text-slate-400">Syncing section visibility and modules.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <section className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-200">
              <LayoutDashboard className="h-3.5 w-3.5" />
              Live Control Center
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-normal text-white sm:text-4xl">
              Portfolio Admin
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Manage the visible sections, edit portfolio modules, and keep the public site aligned from one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-lg border border-white/10 bg-slate-950/45 px-4 py-3">
              <p className="text-xs text-slate-500">Local Time</p>
              <p className="text-sm font-semibold text-white">
                {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold text-rose-100"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Visible Sections", value: `${activeSections}/${totalSections}`, accent: "#22d3ee" },
            { label: "Module Editors", value: ROUTES.length, accent: "#a78bfa" },
            { label: "Visibility Health", value: `${visibilityScore}%`, accent: "#34d399" },
            { label: "Database", value: updating ? "Saving" : "Synced", accent: "#f59e0b" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="crt-panel p-4"
              style={{ borderTopColor: stat.accent, borderTopWidth: 3 }}
            >
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">{stat.label}</p>
              <p className="mt-3 text-2xl font-semibold text-white">{stat.value}</p>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">Module Editors</h2>
                <p className="text-sm text-slate-400">Open a focused editor for each portfolio area.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-3">
              {ROUTES.map((route, index) => {
                const Icon = route.icon;
                return (
                  <motion.button
                    key={route.path}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.025 }}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => navigate(route.path)}
                    className="crt-panel group min-h-[132px] p-4 text-left"
                    style={{ borderTopColor: route.accent, borderTopWidth: 3 }}
                  >
                    <div className="flex h-full flex-col justify-between gap-5">
                      <div className="flex items-start justify-between gap-3">
                        <span
                          className="flex h-10 w-10 items-center justify-center rounded-lg border"
                          style={{
                            color: route.accent,
                            borderColor: `${route.accent}66`,
                            background: `${route.accent}1a`,
                          }}
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="text-xs text-slate-500">Open</span>
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-white">{route.name}</h3>
                        <p className="mt-1 text-sm leading-5 text-slate-400">{route.description}</p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <aside className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Section Visibility</h2>
              <p className="text-sm text-slate-400">Toggle public site sections on or off.</p>
            </div>

            <div className="crt-panel p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">Published Areas</p>
                  <p className="text-xs text-slate-500">{activeSections} active right now</p>
                </div>
                {updating && <RefreshCw className="h-4 w-4 animate-spin text-cyan-300" />}
              </div>

              <div className="space-y-2">
                {Object.entries(sections).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-slate-950/35 px-3 py-2"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                          value
                            ? "border-emerald-300/35 bg-emerald-300/10 text-emerald-200"
                            : "border-slate-500/30 bg-slate-900/60 text-slate-500"
                        }`}
                      >
                        {value ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </span>
                      <span className="truncate text-sm font-medium capitalize text-slate-100">
                        {key.replace("-", " ")}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSection(key)}
                      disabled={updating}
                      className="shrink-0 px-3 py-1.5 text-xs font-semibold"
                    >
                      {value ? "On" : "Off"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
