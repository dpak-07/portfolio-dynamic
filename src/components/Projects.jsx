"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowUpRight,
  Boxes,
  Code2,
  ExternalLink,
  Github,
  Layers3,
  Loader2,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { useFirestoreData } from "@/hooks/useFirestoreData";
import { logLinkClick, logSectionView } from "../utils/analytics";

const CATEGORY_ORDER = [
  "Cloud & Backend",
  "Full-Stack Applications",
  "AI/ML & Security",
  "Team Leadership",
  "Blockchain & Innovation",
  "Frontend & Tools",
];

const PROJECT_ACCENTS = ["#14b8a6", "#f59e0b", "#6366f1", "#10b981", "#fb7185", "#38bdf8"];
const MotionArticle = motion.article;
const MotionDiv = motion.div;

function normalizeProjects(projectsData) {
  const rawCategories = projectsData?.categories || {};
  const ordered = {};

  CATEGORY_ORDER.forEach((name, categoryIndex) => {
    if (Array.isArray(rawCategories[name])) {
      ordered[name] = rawCategories[name].map((project, projectIndex) => ({
        ...project,
        category: name,
        categoryIndex,
        projectIndex,
      }));
    }
  });

  Object.entries(rawCategories).forEach(([name, projects], fallbackIndex) => {
    if (!ordered[name] && Array.isArray(projects)) {
      ordered[name] = projects.map((project, projectIndex) => ({
        ...project,
        category: name,
        categoryIndex: CATEGORY_ORDER.length + fallbackIndex,
        projectIndex,
      }));
    }
  });

  Object.keys(ordered).forEach((name) => {
    ordered[name] = ordered[name]
      .filter((project) => project?.title)
      .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || (a.projectIndex ?? 0) - (b.projectIndex ?? 0));
  });

  const all = Object.values(ordered)
    .flat()
    .sort(
      (a, b) =>
        Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
        (a.categoryIndex ?? 0) - (b.categoryIndex ?? 0) ||
        (a.projectIndex ?? 0) - (b.projectIndex ?? 0)
    );

  return { All: all, ...ordered };
}

function getProjectKey(project, index) {
  return `${project.category || "project"}-${project.title}-${project.projectIndex ?? index}`;
}

function getProjectAccent(project, index = 0) {
  return PROJECT_ACCENTS[(project?.categoryIndex ?? index) % PROJECT_ACCENTS.length];
}

function ProjectImage({ project, className = "" }) {
  if (project.img) {
    return <img src={project.img} alt={project.title} className={`h-full w-full object-cover ${className}`} loading="lazy" />;
  }

  return (
    <div className={`flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,rgba(20,184,166,0.24),rgba(99,102,241,0.14),rgba(245,158,11,0.22))] p-5 text-center ${className}`}>
      <div>
        <Layers3 className="mx-auto mb-3 h-8 w-8 text-cyan-500" />
        <div className="text-base font-black leading-tight text-[var(--color-text)] sm:text-lg">{project.title}</div>
      </div>
    </div>
  );
}

function ProjectLinks({ project, compact = false }) {
  return (
    <div className={`flex gap-2 ${compact ? "shrink-0" : ""}`}>
      {project.url && (
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer"
          title="View code"
          onClick={() => logLinkClick(`project_github_${project.title}`)}
          className="portfolio-secondary-button inline-flex h-9 w-9 items-center justify-center rounded-lg"
        >
          <Github className="h-4 w-4" />
        </a>
      )}
      {project.live && (
        <a
          href={project.live}
          target="_blank"
          rel="noreferrer"
          title="Open live project"
          onClick={() => logLinkClick(`project_live_${project.title}`)}
          className="portfolio-secondary-button inline-flex h-9 w-9 items-center justify-center rounded-lg"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}

function ProjectMetric({ label, value, icon, accent }) {
  const Icon = icon;

  return (
    <div className="portfolio-panel rounded-lg p-3 sm:p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        {Icon && <Icon className="h-4 w-4" style={{ color: accent || "var(--color-accent-strong)" }} />}
        <span className="text-xl font-black text-[var(--color-text)] sm:text-2xl">{value}</span>
      </div>
      <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-faint)]">{label}</div>
    </div>
  );
}

function CategoryTabs({ categoryKeys, categories, active, onChange }) {
  return (
    <div className="portfolio-panel mb-5 rounded-lg p-2">
      <div className="no-scrollbar flex gap-2 overflow-x-auto lg:flex-wrap">
        {categoryKeys.map((category, index) => {
          const selected = active === category;
          const accent = PROJECT_ACCENTS[index % PROJECT_ACCENTS.length];

          return (
            <button
              key={category}
              type="button"
              onClick={() => {
                onChange(category);
                logLinkClick(`project_category_${category}`);
              }}
              className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-left transition-transform hover:-translate-y-0.5"
              style={{
                borderColor: selected ? `${accent}88` : "var(--color-border)",
                background: selected ? `${accent}18` : "var(--color-surface-muted)",
                color: "var(--color-text)",
              }}
            >
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
              <span className="min-w-0">
                <span className="block max-w-[11rem] truncate text-xs font-black sm:max-w-none sm:text-sm">{category}</span>
                <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-faint)]">{categories[category]?.length || 0} builds</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SpotlightProject({ project, active, onOpen }) {
  const accent = getProjectAccent(project);

  return (
    <MotionArticle
      key={`${active}-${project.title}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="portfolio-panel relative overflow-hidden rounded-lg"
    >
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: `linear-gradient(90deg, transparent, ${accent}, #fbbf24, transparent)` }} />
      <div className="grid lg:grid-cols-[1.18fr_0.82fr]">
        <button type="button" onClick={() => onOpen(project)} className="relative block min-h-[245px] overflow-hidden text-left sm:min-h-[330px] lg:min-h-[450px]">
          <ProjectImage project={project} className="transition-transform duration-700 hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/88 via-slate-950/18 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-300 px-3 py-1 text-xs font-black text-slate-950">
                <Star className="h-3.5 w-3.5 fill-slate-950" />
                Main Build
              </span>
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                {project.category || active}
              </span>
            </div>
            <h3 className="max-w-3xl text-3xl font-black leading-tight text-white sm:text-5xl">{project.title}</h3>
          </div>
        </button>

        <div className="flex min-w-0 flex-col p-5 sm:p-7">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-faint)]">Build Brief</div>
              <div className="text-lg font-black text-[var(--color-text)]">{project.featured ? "Featured project" : "Selected project"}</div>
            </div>
            <div className="rounded-lg px-3 py-2 text-right" style={{ background: `${accent}18` }}>
              <Code2 className="ml-auto h-4 w-4" style={{ color: accent }} />
              <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-faint)]">active</div>
            </div>
          </div>

          {project.desc && <p className="text-xl font-black leading-tight text-[var(--color-text)]">{project.desc}</p>}
          <p className="mt-4 line-clamp-6 text-sm leading-relaxed text-[var(--color-muted)]">{project.long || project.desc}</p>

          <div className="mt-5 grid grid-cols-2 gap-2">
            {(project.tech || []).slice(0, 4).map((tool) => (
              <div key={tool} className="rounded-lg border px-3 py-2 text-xs font-bold text-[var(--color-text)]" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-muted)" }}>
                <div className="mb-1 h-1.5 w-7 rounded-full" style={{ backgroundColor: accent }} />
                {tool}
              </div>
            ))}
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
            <button type="button" onClick={() => onOpen(project)} className="portfolio-primary-button inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold sm:flex-none">
              Explore Build
              <ArrowUpRight className="h-4 w-4" />
            </button>
            <ProjectLinks project={project} />
          </div>
        </div>
      </div>
    </MotionArticle>
  );
}

function ProjectTile({ project, index, onOpen }) {
  const accent = getProjectAccent(project, index);

  return (
    <MotionArticle
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ delay: index * 0.03, duration: 0.28 }}
      className="portfolio-panel group relative overflow-hidden rounded-lg"
    >
      <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: accent }} />
      <div className="grid min-h-[154px] grid-cols-[112px_minmax(0,1fr)] sm:block sm:min-h-0">
        <button type="button" onClick={() => onOpen(project)} className="relative block h-full min-h-[154px] overflow-hidden text-left sm:aspect-[16/10] sm:min-h-0">
          <ProjectImage project={project} className="transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/62 via-transparent to-transparent" />
          <span className="absolute left-2 top-2 rounded-full bg-slate-950/80 px-2 py-1 text-[10px] font-black text-white backdrop-blur">
            {String(index + 2).padStart(2, "0")}
          </span>
          {project.featured && (
            <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-amber-300 px-2 py-1 text-[10px] font-black text-slate-950">
              <Star className="h-3 w-3 fill-slate-950" />
              Pick
            </span>
          )}
        </button>

        <div className="flex min-w-0 flex-col p-3 sm:p-4">
          <div className="mb-2 flex min-w-0 items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
            <span className="truncate text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-faint)]">{project.category}</span>
          </div>

          <button type="button" onClick={() => onOpen(project)} className="min-w-0 text-left">
            <h3 className="line-clamp-2 text-base font-black leading-tight text-[var(--color-text)] sm:text-xl">{project.title}</h3>
            {project.desc && <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--color-muted)] sm:text-sm">{project.desc}</p>}
          </button>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.tech?.slice(0, 4).map((tool) => (
              <span key={tool} className="portfolio-chip rounded-md px-2 py-1 text-[10px] font-semibold sm:text-[11px]">
                {tool}
              </span>
            ))}
          </div>

          <div className="mt-auto flex items-center gap-2 pt-3">
            <button type="button" onClick={() => onOpen(project)} className="portfolio-secondary-button inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold">
              Details
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
            </button>
            <ProjectLinks project={project} compact />
          </div>
        </div>
      </div>
    </MotionArticle>
  );
}

function ProjectModal({ project, onClose }) {
  return (
    <MotionDiv className="fixed inset-0 z-[1001] flex items-end justify-center p-0 sm:items-center sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button type="button" aria-label="Close project details" className="portfolio-modal-backdrop absolute inset-0" onClick={onClose} />
      <MotionArticle
        initial={{ opacity: 0, y: 32, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 32, scale: 0.98 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className="portfolio-modal-card relative max-h-[92svh] w-full max-w-5xl overflow-hidden rounded-t-lg sm:rounded-lg"
      >
        <button type="button" onClick={onClose} className="portfolio-secondary-button absolute right-3 top-3 z-20 rounded-full p-2">
          <X className="h-5 w-5" />
        </button>

        <div className="grid max-h-[92svh] overflow-y-auto lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative min-h-56 overflow-hidden bg-slate-950 sm:min-h-72 lg:min-h-[520px]">
            <ProjectImage project={project} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/74 via-transparent to-transparent" />
          </div>
          <div className="p-5 sm:p-7">
            <div className="mb-4 flex flex-wrap items-center gap-2 pr-10">
              {project.featured && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-300 px-3 py-1 text-xs font-black text-slate-950">
                  <Star className="h-3.5 w-3.5 fill-slate-950" />
                  Featured
                </span>
              )}
              {project.category && <span className="portfolio-chip rounded-full px-3 py-1 text-xs font-bold">{project.category}</span>}
            </div>
            <h3 className="pr-8 text-2xl font-black leading-tight text-[var(--color-text)] sm:text-3xl">{project.title}</h3>
            {project.desc && <p className="mt-2 text-sm font-semibold text-cyan-500">{project.desc}</p>}
            <p className="mt-5 text-sm leading-relaxed text-[var(--color-muted)]">{project.long || project.desc}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {project.tech?.map((tool) => (
                <span key={tool} className="portfolio-chip rounded-lg px-3 py-2 text-xs font-semibold">
                  {tool}
                </span>
              ))}
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {project.live && (
                <a href={project.live} target="_blank" rel="noreferrer" onClick={() => logLinkClick(`project_live_${project.title}`)} className="portfolio-primary-button inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold">
                  <ExternalLink className="h-4 w-4" />
                  Live Demo
                </a>
              )}
              {project.url && (
                <a href={project.url} target="_blank" rel="noreferrer" onClick={() => logLinkClick(`project_github_${project.title}`)} className="portfolio-secondary-button inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold">
                  <Github className="h-4 w-4" />
                  View Code
                </a>
              )}
            </div>
          </div>
        </div>
      </MotionArticle>
    </MotionDiv>
  );
}

export default function Projects() {
  const { data: projectsData, loading, error } = useFirestoreData("projects", "data");
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { once: true, amount: 0.22 });
  const categories = useMemo(() => normalizeProjects(projectsData), [projectsData]);
  const categoryKeys = useMemo(() => Object.keys(categories).filter((key) => categories[key]?.length), [categories]);
  const [active, setActive] = useState("All");
  const [open, setOpen] = useState(null);

  useEffect(() => {
    if (sectionInView) logSectionView("projects");
  }, [sectionInView]);

  useEffect(() => {
    if (!categoryKeys.includes(active)) setActive(categoryKeys[0] || "All");
  }, [active, categoryKeys]);

  const visibleProjects = categories[active] || [];
  const spotlight = visibleProjects[0];
  const remaining = visibleProjects.slice(1);
  const metrics = useMemo(() => {
    const allProjects = categories.All || [];
    return {
      total: allProjects.length,
      featured: allProjects.filter((project) => project.featured).length,
      stacks: new Set(allProjects.flatMap((project) => project.tech || [])).size,
    };
  }, [categories]);

  const openProject = (project) => {
    setOpen(project);
    logLinkClick(`project_open_${project.title}`);
  };

  if (loading && !projectsData) {
    return (
      <section id="projects" ref={sectionRef} className="relative flex min-h-[70vh] items-center justify-center px-4 py-20">
        <div className="portfolio-panel flex items-center gap-3 rounded-lg px-5 py-4">
          <MotionDiv animate={{ rotate: 360 }} transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}>
            <Loader2 className="h-5 w-5 text-cyan-500" />
          </MotionDiv>
          <span className="text-sm font-medium text-[var(--color-muted)]">Loading Firestore projects</span>
        </div>
      </section>
    );
  }

  if (error || categoryKeys.length === 0) {
    return (
      <section id="projects" ref={sectionRef} className="relative flex min-h-[70vh] items-center justify-center px-4 py-20">
        <div className="portfolio-panel max-w-xl rounded-lg p-6 text-center">
          <Layers3 className="mx-auto mb-3 h-8 w-8 text-cyan-500" />
          <h2 className="portfolio-gradient-text text-3xl font-black">Projects</h2>
          <p className="mt-3 text-sm text-[var(--color-muted)]">{error || "Projects data is waiting for Firestore document projects/data."}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" ref={sectionRef} className="relative overflow-hidden px-4 py-14 scroll-mt-24 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 text-center sm:mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-faint)]" style={{ borderColor: "var(--color-border)" }}>
            <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
            Build Board
          </div>
          <h2 className="portfolio-gradient-text text-4xl font-extrabold sm:text-5xl">Featured Projects</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
            A sharper board of shipped products, hackathon builds, backend systems, and creative experiments.
          </p>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-2 sm:gap-3">
          <ProjectMetric label="Projects" value={metrics.total} icon={Layers3} accent={PROJECT_ACCENTS[0]} />
          <ProjectMetric label="Featured" value={metrics.featured} icon={Star} accent={PROJECT_ACCENTS[1]} />
          <ProjectMetric label="Tech" value={metrics.stacks} icon={Boxes} accent={PROJECT_ACCENTS[2]} />
        </div>

        <CategoryTabs categoryKeys={categoryKeys} categories={categories} active={active} onChange={setActive} />

        {spotlight && <SpotlightProject project={spotlight} active={active} onOpen={openProject} />}

        {remaining.length > 0 && (
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {remaining.map((project, index) => (
              <ProjectTile key={getProjectKey(project, index)} project={project} index={index} onOpen={openProject} />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>{open && <ProjectModal project={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}
