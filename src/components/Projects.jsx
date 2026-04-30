"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  ExternalLink,
  Github,
  Layers3,
  ListChecks,
  Loader2,
  PanelTop,
  Sparkles,
  Star,
  Target,
  X,
} from "lucide-react";
import { useFirestoreData } from "@/hooks/useFirestoreData";
import { logLinkClick, logSectionView } from "../utils/analytics";

const CATEGORY_ORDER = [
  "AI Product Systems",
  "Trust & Credentials",
  "Cloud & Backend",
  "Data Platforms",
  "Portfolio Infrastructure",
  "Full-Stack Applications",
  "AI/ML & Security",
  "Blockchain & Innovation",
  "Frontend & Tools",
];

const PROJECT_ACCENTS = ["#14b8a6", "#f59e0b", "#6366f1", "#10b981", "#fb7185", "#38bdf8", "#f97316"];
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

function getFirstSentence(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  const sentence = text.match(/[^.!?]+[.!?]?/)?.[0] || text;
  return sentence.trim();
}

function getProjectNotes(project) {
  const text = String(project?.long || project?.desc || "").trim();
  if (!text) return [];
  return text
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);
}

function getProjectBriefs(project) {
  return [
    { label: "Context", value: project?.desc, icon: Target },
    { label: "Build", value: getFirstSentence(project?.long || project?.desc), icon: CheckCircle2 },
    { label: "Stack", value: Array.isArray(project?.tech) ? project.tech.slice(0, 5).join(", ") : "", icon: Boxes },
  ].filter((item) => String(item.value || "").trim());
}

function ProjectImage({ project, className = "" }) {
  if (project.img) {
    return <img src={project.img} alt={project.title} className={`h-full w-full object-cover ${className}`} loading="lazy" />;
  }

  return (
    <div className={`flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,rgba(20,184,166,0.28),rgba(99,102,241,0.16),rgba(245,158,11,0.22))] p-5 text-center ${className}`}>
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
          className="portfolio-secondary-button inline-flex h-10 w-10 items-center justify-center rounded-lg"
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
          className="portfolio-secondary-button inline-flex h-10 w-10 items-center justify-center rounded-lg"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}

function Metric({ label, value, icon, accent }) {
  const Icon = icon;
  return (
    <div className="rounded-lg border p-3" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-muted)" }}>
      <div className="mb-2 flex items-center justify-between gap-3">
        {Icon && <Icon className="h-4 w-4" style={{ color: accent }} />}
        <span className="text-2xl font-black leading-none text-[var(--color-text)]">{value}</span>
      </div>
      <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--color-faint)]">{label}</div>
    </div>
  );
}

function BriefGrid({ project, accent, compact = false }) {
  const briefs = getProjectBriefs(project);
  if (briefs.length === 0) return null;

  return (
    <div className={`grid gap-2 ${compact ? "" : "sm:grid-cols-3"}`}>
      {briefs.map((item) => {
        const BriefIcon = item.icon;

        return (
          <div key={item.label} className="rounded-lg border p-3" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-muted)" }}>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--color-faint)]">
              <BriefIcon className="h-3.5 w-3.5" style={{ color: accent }} />
              {item.label}
            </div>
            <p className="line-clamp-4 text-xs font-semibold leading-relaxed text-[var(--color-muted)] sm:text-sm">{item.value}</p>
          </div>
        );
      })}
    </div>
  );
}

function ProjectNotes({ project, accent }) {
  const items = getProjectNotes(project);
  if (items.length === 0) return null;

  return (
    <div className="mt-5 grid gap-2 sm:grid-cols-2">
      {items.map((item, index) => (
        <div key={item} className="rounded-lg border px-3 py-2" style={{ borderColor: "var(--color-border)", background: "var(--color-bg-strong)" }}>
          <div className="mb-1 flex items-center justify-between gap-3">
            <ListChecks className="h-3.5 w-3.5" style={{ color: accent }} />
            <span className="text-[10px] font-black text-[var(--color-faint)]">{String(index + 1).padStart(2, "0")}</span>
          </div>
          <p className="text-xs font-semibold leading-relaxed text-[var(--color-muted)]">{item}</p>
        </div>
      ))}
    </div>
  );
}

function CategorySwitch({ categoryKeys, categories, active, onChange }) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto">
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
            }}
          >
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
            <span className="min-w-0">
              <span className="block max-w-[11rem] truncate text-xs font-black text-[var(--color-text)] sm:text-sm">{category}</span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-faint)]">{categories[category]?.length || 0} builds</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ProjectStage({ project, activeIndex, total, onOpen, onSelectNext, onSelectPrevious }) {
  const accent = getProjectAccent(project, activeIndex);

  return (
    <MotionArticle
      key={project.title}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="portfolio-panel relative overflow-hidden rounded-lg"
    >
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: `linear-gradient(90deg, ${accent}, #fbbf24, transparent)` }} />
      <div className="grid lg:grid-cols-[minmax(0,1.02fr)_minmax(22rem,0.98fr)]">
        <button type="button" onClick={onOpen} className="relative min-h-[320px] overflow-hidden text-left sm:min-h-[420px] lg:min-h-[620px]">
          <ProjectImage project={project} className="transition-transform duration-700 hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/92 via-slate-950/18 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 sm:right-7">
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-300 px-3 py-1 text-xs font-black text-slate-950">
                <Star className="h-3.5 w-3.5 fill-slate-950" />
                Selected Work
              </span>
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                {project.category}
              </span>
            </div>
            <h3 className="max-w-4xl text-3xl font-black leading-tight text-white sm:text-5xl">{project.title}</h3>
          </div>
        </button>

        <div className="flex min-w-0 flex-col p-5 sm:p-7 lg:p-8">
          <div className="mb-6 flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.18em] text-[var(--color-faint)]">Case Study</div>
              <div className="mt-1 text-lg font-black text-[var(--color-text)]">
                {String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </div>
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-lg border" style={{ borderColor: `${accent}66`, color: accent, background: `${accent}12` }}>
              <PanelTop className="h-5 w-5" />
            </span>
          </div>

          {project.desc && <p className="text-2xl font-black leading-tight text-[var(--color-text)]">{project.desc}</p>}
          <p className="mt-4 line-clamp-6 text-sm leading-relaxed text-[var(--color-muted)]">{project.long || project.desc}</p>

          <div className="mt-5">
            <BriefGrid project={project} accent={accent} compact />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {(project.tech || []).slice(0, 7).map((tool) => (
              <span key={tool} className="rounded-lg border px-3 py-2 text-xs font-bold text-[var(--color-text)]" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-muted)" }}>
                {tool}
              </span>
            ))}
          </div>

          <div className="mt-auto flex items-center gap-2 pt-6">
            <button type="button" onClick={onSelectPrevious} className="portfolio-secondary-button inline-flex h-10 w-10 items-center justify-center rounded-lg" title="Previous project">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button type="button" onClick={onSelectNext} className="portfolio-secondary-button inline-flex h-10 w-10 items-center justify-center rounded-lg" title="Next project">
              <ArrowRight className="h-4 w-4" />
            </button>
            <button type="button" onClick={onOpen} className="portfolio-primary-button ml-auto inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold sm:flex-none">
              Read Case
              <ArrowUpRight className="h-4 w-4" />
            </button>
            <ProjectLinks project={project} compact />
          </div>
        </div>
      </div>
    </MotionArticle>
  );
}

function ProjectCard({ project, index, onOpen, onSelect }) {
  const accent = getProjectAccent(project, index);

  return (
    <MotionArticle
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ delay: index * 0.025, duration: 0.28 }}
      className="portfolio-panel group relative overflow-hidden rounded-lg"
    >
      <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: accent }} />
      <button type="button" onClick={onSelect} className="block w-full text-left">
        <div className="relative aspect-[16/9] overflow-hidden">
          <ProjectImage project={project} className="transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
          <span className="absolute left-3 top-3 rounded-full bg-slate-950/80 px-2.5 py-1 text-[10px] font-black text-white backdrop-blur">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </button>

      <div className="flex min-h-[15rem] min-w-0 flex-col p-4">
        <div className="mb-2 flex min-w-0 items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
          <span className="truncate text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-faint)]">{project.category}</span>
        </div>
        <button type="button" onClick={onSelect} className="min-w-0 text-left">
          <h3 className="line-clamp-2 text-xl font-black leading-tight text-[var(--color-text)]">{project.title}</h3>
          {project.desc && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--color-muted)]">{project.desc}</p>}
        </button>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tech?.slice(0, 4).map((tool) => (
            <span key={tool} className="portfolio-chip rounded-md px-2 py-1 text-[10px] font-semibold sm:text-[11px]">
              {tool}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center gap-2 pt-4">
          <button type="button" onClick={onOpen} className="portfolio-secondary-button inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold">
            Details
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
          </button>
          <ProjectLinks project={project} compact />
        </div>
      </div>
    </MotionArticle>
  );
}

function ProjectModal({ project, onClose }) {
  const accent = getProjectAccent(project);

  return (
    <MotionDiv className="fixed inset-0 z-[1001] flex items-end justify-center p-0 sm:items-center sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button type="button" aria-label="Close project details" className="portfolio-modal-backdrop absolute inset-0" onClick={onClose} />
      <MotionArticle
        initial={{ opacity: 0, y: 32, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 32, scale: 0.98 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className="portfolio-modal-card relative max-h-[92svh] w-full max-w-6xl overflow-hidden rounded-t-lg sm:rounded-lg"
      >
        <button type="button" onClick={onClose} className="portfolio-secondary-button absolute right-3 top-3 z-20 rounded-full p-2">
          <X className="h-5 w-5" />
        </button>

        <div className="grid max-h-[92svh] overflow-y-auto lg:grid-cols-[0.82fr_1.18fr]">
          <div className="relative min-h-56 overflow-hidden bg-slate-950 sm:min-h-72 lg:min-h-[620px]">
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
            <h3 className="pr-8 text-2xl font-black leading-tight text-[var(--color-text)] sm:text-4xl">{project.title}</h3>
            {project.desc && <p className="mt-2 text-sm font-semibold text-cyan-500">{project.desc}</p>}
            <p className="mt-5 text-sm leading-relaxed text-[var(--color-muted)]">{project.long || project.desc}</p>

            <div className="mt-6">
              <BriefGrid project={project} accent={accent} />
            </div>
            <ProjectNotes project={project} accent={accent} />

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
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    if (sectionInView) logSectionView("projects");
  }, [sectionInView]);

  useEffect(() => {
    if (!categoryKeys.includes(active)) setActive(categoryKeys[0] || "All");
  }, [active, categoryKeys]);

  const visibleProjects = categories[active] || [];

  useEffect(() => {
    if (activeProjectIndex >= visibleProjects.length) setActiveProjectIndex(0);
  }, [activeProjectIndex, visibleProjects.length]);

  const selectedProject = visibleProjects[activeProjectIndex] || visibleProjects[0];
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

  if (error || categoryKeys.length === 0 || !selectedProject) {
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

  const selectPrevious = () => setActiveProjectIndex((index) => (index - 1 + visibleProjects.length) % visibleProjects.length);
  const selectNext = () => setActiveProjectIndex((index) => (index + 1) % visibleProjects.length);

  return (
    <section id="projects" ref={sectionRef} className="relative overflow-hidden px-4 py-14 scroll-mt-24 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 grid gap-5 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-faint)]" style={{ borderColor: "var(--color-border)" }}>
              <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
              Selected Work Desk
            </div>
            <h2 className="portfolio-gradient-text text-4xl font-extrabold sm:text-5xl">Projects That Prove the Stack</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
              Fewer, stronger case studies using the existing description, stack, links, and project details already in Firestore.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Metric label="Projects" value={metrics.total} icon={Layers3} accent={PROJECT_ACCENTS[0]} />
            <Metric label="Featured" value={metrics.featured} icon={Star} accent={PROJECT_ACCENTS[1]} />
            <Metric label="Tools" value={metrics.stacks} icon={Boxes} accent={PROJECT_ACCENTS[2]} />
          </div>
        </div>

        <div className="portfolio-panel mb-4 rounded-lg p-2">
          <CategorySwitch
            categoryKeys={categoryKeys}
            categories={categories}
            active={active}
            onChange={(category) => {
              setActive(category);
              setActiveProjectIndex(0);
            }}
          />
        </div>

        <ProjectStage
          project={selectedProject}
          activeIndex={activeProjectIndex}
          total={visibleProjects.length}
          onOpen={() => openProject(selectedProject)}
          onSelectNext={selectNext}
          onSelectPrevious={selectPrevious}
        />

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {visibleProjects.map((project, index) => (
            <ProjectCard
              key={getProjectKey(project, index)}
              project={project}
              index={index}
              onOpen={() => openProject(project)}
              onSelect={() => setActiveProjectIndex(index)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>{open && <ProjectModal project={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}
