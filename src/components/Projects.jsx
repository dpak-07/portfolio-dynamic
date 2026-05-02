"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowUpRight,
  Code2,
  ExternalLink,
  FolderKanban,
  Github,
  ImageIcon,
  Layers3,
  Loader2,
  Star,
  X,
} from "lucide-react";
import { useFirestoreData } from "@/hooks/useFirestoreData";
import { logLinkClick, logSectionView } from "../utils/analytics";

const MotionArticle = motion.article;
const MotionDiv = motion.div;

const CATEGORY_ORDER = [
  "Cloud & Backend",
  "Full-Stack Applications",
  "AI/ML & Security",
  "Team Leadership",
  "Blockchain & Innovation",
  "Frontend & Tools",
];

function normalizeProjects(projectsData) {
  const rawCategories = projectsData?.categories || {};
  const ordered = {};

  CATEGORY_ORDER.forEach((name) => {
    if (Array.isArray(rawCategories[name])) {
      ordered[name] = [...rawCategories[name]];
    }
  });

  Object.entries(rawCategories).forEach(([name, projects]) => {
    if (!ordered[name] && Array.isArray(projects)) ordered[name] = [...projects];
  });

  Object.keys(ordered).forEach((name) => {
    ordered[name] = ordered[name]
      .filter((project) => project?.title)
      .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  });

  const all = Object.values(ordered)
    .flat()
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));

  return { All: all, ...ordered };
}

function ProjectImage({ project, className = "", compact = false }) {
  const [failed, setFailed] = useState(false);
  const src = String(project?.img || "").trim();

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={project.title}
        className={`h-full w-full object-cover transition duration-500 ${className}`}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-100 via-white to-zinc-200 p-6 text-center dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-950 ${className}`}>
      <div>
        <ImageIcon className="mx-auto mb-3 h-8 w-8 text-[var(--color-faint)]" />
        {!compact && <div className="text-lg font-black leading-tight text-[var(--color-text)]">{project.title}</div>}
      </div>
    </div>
  );
}

function SectionHeader({ totalProjects, featuredCount }) {
  return (
    <div className="mb-10 grid gap-5 lg:grid-cols-[0.9fr_0.55fr] lg:items-end">
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-faint)]">
          <FolderKanban className="h-3.5 w-3.5" />
          Project Gallery
        </div>
        <h2 className="portfolio-rainbow-text text-4xl font-extrabold leading-tight sm:text-5xl">
          Selected work, shipped with intent
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
          A focused look at full-stack products, AI systems, cloud work, and team-led builds.
        </p>
      </div>

<div className="grid grid-cols-2 gap-3 sm:max-w-sm lg:ml-auto">
        <div className="portfolio-panel portfolio-panel-accent rounded-2xl p-4" style={{ "--accent-local": "var(--color-accent-a)" }}>
          <div className="portfolio-accent-number text-3xl font-black" style={{ color: "var(--color-accent-a)" }}>{totalProjects}</div>
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-faint)]">Projects</div>
        </div>
        <div className="portfolio-panel portfolio-panel-accent rounded-2xl p-4" style={{ "--accent-local": "var(--color-accent-c)" }}>
          <div className="portfolio-accent-number text-3xl font-black" style={{ color: "var(--color-accent-c)" }}>{featuredCount}</div>
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-faint)]">Featured</div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, index, onOpen }) {
  return (
    <MotionArticle
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.035, duration: 0.3 }}
      whileHover={{ y: -6 }}
      className="portfolio-panel group overflow-hidden rounded-2xl"
    >
      <button type="button" onClick={() => onOpen(project)} className="block w-full text-left">
        <div className="relative aspect-video overflow-hidden bg-[var(--color-surface-muted)]">
          <ProjectImage project={project} compact />
          {project.featured && (
            <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-black text-zinc-950 shadow-sm">
              <Star className="h-3.5 w-3.5 fill-zinc-950" />
              Featured
            </div>
          )}
        </div>
      </button>

      <div className="p-4">
<h3 className="mb-1 text-xl font-black leading-tight" style={{ color: "var(--color-accent-a)" }}>{project.title}</h3>
        {project.desc && <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-[var(--color-muted)]">{project.desc}</p>}

<div className="mb-4 flex flex-wrap gap-1.5">
          {project.tech?.slice(0, 5).map((tool, idx) => (
            <span key={tool} className="rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ background: "var(--color-accent-soft)", border: "1px solid var(--color-accent-a)", color: "var(--color-accent-a)" }}>
              {tool}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
<button
            type="button"
            onClick={() => onOpen(project)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg, var(--color-accent-a), var(--color-accent-b))" }}
          >
            Details
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
{project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              onClick={() => logLinkClick("project_github")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl transition-transform hover:-translate-y-0.5"
              style={{ border: "1px solid var(--color-accent-a)", color: "var(--color-accent-a)" }}
              aria-label={`${project.title} source code`}
            >
              <Github className="h-4 w-4" />
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              onClick={() => logLinkClick("project_live")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl transition-transform hover:-translate-y-0.5"
              style={{ border: "1px solid var(--color-accent-c)", color: "var(--color-accent-c)" }}
              aria-label={`${project.title} live demo`}
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </MotionArticle>
  );
}

function SpotlightProject({ project, active, onOpen }) {
  return (
    <MotionArticle
      key={`${active}-${project.title}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="portfolio-panel mb-5 grid overflow-hidden rounded-2xl lg:grid-cols-[1.12fr_0.88fr]"
    >
      <button type="button" onClick={() => onOpen(project)} className="group relative block aspect-video overflow-hidden text-left">
        <ProjectImage project={project} className="transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-black text-zinc-950 shadow-sm">
          <Star className="h-3.5 w-3.5 fill-zinc-950" />
          Spotlight
        </div>
      </button>

      <div className="flex flex-col p-5 sm:p-7">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-faint)]">{active}</div>
<h3 className="mt-3 text-3xl font-black leading-tight sm:text-4xl" style={{ color: "var(--color-accent-a)" }}>{project.title}</h3>
        {project.desc && <p className="mt-3 text-xl font-black leading-tight" style={{ color: "var(--color-accent-b)" }}>{project.desc}</p>}
        <p className="mt-4 line-clamp-7 text-sm leading-relaxed text-[var(--color-muted)]">{project.long || project.desc}</p>

<div className="mt-5 flex flex-wrap gap-2">
          {project.tech?.slice(0, 8).map((tool, idx) => (
            <span key={tool} className="rounded-full px-3 py-2 text-xs font-semibold" style={{ background: "var(--color-accent-soft)", border: "1px solid var(--color-accent-a)", color: "var(--color-accent-a)" }}>
              {tool}
            </span>
          ))}
        </div>

<div className="mt-auto pt-6">
          <button
            type="button"
            onClick={() => onOpen(project)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white sm:w-auto"
            style={{ background: "linear-gradient(135deg, var(--color-accent-a), var(--color-accent-b))" }}
          >
            Explore Project
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </MotionArticle>
  );
}

function ProjectModal({ project, onClose }) {
  return (
    <MotionDiv className="fixed inset-0 z-[1001] flex items-center justify-center p-3 sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button type="button" aria-label="Close project details" className="portfolio-modal-backdrop absolute inset-0" onClick={onClose} />
      <MotionArticle
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.96 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className="portfolio-modal-card relative max-h-[92svh] w-full max-w-5xl overflow-hidden rounded-2xl"
      >
        <button type="button" onClick={onClose} className="portfolio-secondary-button absolute right-3 top-3 z-20 rounded-full p-2" aria-label="Close modal">
          <X className="h-5 w-5" />
        </button>

        <div className="grid max-h-[92svh] overflow-y-auto lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative aspect-video overflow-hidden bg-[var(--color-surface-muted)]">
            <ProjectImage project={project} />
          </div>
          <div className="p-5 sm:p-7">
            {project.featured && (
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-1 text-xs font-black text-[var(--color-text)]">
                <Star className="h-3.5 w-3.5 fill-[var(--color-text)]" />
                Featured Project
              </div>
            )}
<h3 className="pr-10 text-3xl font-black leading-tight" style={{ color: "var(--color-accent-a)" }}>{project.title}</h3>
            {project.desc && <p className="mt-2 text-sm font-semibold" style={{ color: "var(--color-accent-b)" }}>{project.desc}</p>}
            <p className="mt-5 text-sm leading-relaxed text-[var(--color-muted)]">{project.long || project.desc}</p>

<div className="mt-6 flex flex-wrap gap-2">
              {project.tech?.map((tool, idx) => (
                <span key={tool} className="rounded-full px-3 py-2 text-xs font-semibold" style={{ background: "var(--color-accent-soft)", border: "1px solid var(--color-accent-a)", color: "var(--color-accent-a)" }}>
                  {tool}
                </span>
              ))}
            </div>

<div className="mt-7 grid gap-3 sm:grid-cols-2">
              {project.live && (
                <a href={project.live} target="_blank" rel="noreferrer" onClick={() => logLinkClick("project_live")} className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white" style={{ background: "linear-gradient(135deg, var(--color-accent-a), var(--color-accent-b))" }}>
                  <ExternalLink className="h-4 w-4" />
                  Live Demo
                </a>
              )}
              {project.url && (
                <a href={project.url} target="_blank" rel="noreferrer" onClick={() => logLinkClick("project_github")} className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold" style={{ border: "1px solid var(--color-accent-a)", color: "var(--color-accent-a)" }}>
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
  const [spotlightIndex, setSpotlightIndex] = useState(0);

  useEffect(() => {
    if (sectionInView) logSectionView("projects");
  }, [sectionInView]);

  useEffect(() => {
    if (!categoryKeys.includes(active)) setActive(categoryKeys[0] || "All");
  }, [active, categoryKeys]);

  const visibleProjects = categories[active] || [];
  const allProjects = categories.All || [];
  const featuredCount = allProjects.filter((project) => project.featured).length;
  const safeSpotlightIndex = visibleProjects.length ? spotlightIndex % visibleProjects.length : 0;
  const spotlight = visibleProjects[safeSpotlightIndex];
  const remaining = visibleProjects.filter((_, index) => index !== safeSpotlightIndex);

  useEffect(() => {
    setSpotlightIndex(0);
  }, [active]);

  useEffect(() => {
    if (!sectionInView || open || visibleProjects.length <= 1) return undefined;

    const timer = window.setInterval(() => {
      setSpotlightIndex((current) => (current + 1) % visibleProjects.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [open, sectionInView, visibleProjects.length]);

  if (loading && !projectsData) {
    return (
      <section id="projects" ref={sectionRef} className="relative flex min-h-[70vh] items-center justify-center px-4 py-20">
        <div className="portfolio-panel flex items-center gap-3 rounded-2xl px-5 py-4">
          <MotionDiv animate={{ rotate: 360 }} transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}>
            <Loader2 className="h-5 w-5 text-[var(--color-text)]" />
          </MotionDiv>
          <span className="text-sm font-medium text-[var(--color-muted)]">Loading projects</span>
        </div>
      </section>
    );
  }

  if (error || categoryKeys.length === 0) {
    return (
      <section id="projects" ref={sectionRef} className="relative flex min-h-[70vh] items-center justify-center px-4 py-20">
        <div className="portfolio-panel max-w-xl rounded-2xl p-6 text-center">
          <Layers3 className="mx-auto mb-3 h-8 w-8 text-[var(--color-text)]" />
          <h2 className="portfolio-gradient-text text-3xl font-black">Projects</h2>
          <p className="mt-3 text-sm text-[var(--color-muted)]">{error || "Projects data is waiting for Firestore document projects/data."}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" ref={sectionRef} className="relative overflow-hidden px-4 py-16 scroll-mt-24 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader totalProjects={allProjects.length} featuredCount={featuredCount} />

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categoryKeys.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setActive(category);
                setSpotlightIndex(0);
                logLinkClick(`project_category_${category}`);
              }}
className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition-all ${
                active === category
                  ? "border-[var(--color-accent-a)] bg-[var(--color-accent-a)] text-white"
                  : "border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-muted)] hover:border-[var(--color-accent-a)] hover:text-[var(--color-accent-a)]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {spotlight && <SpotlightProject project={spotlight} active={active} onOpen={setOpen} />}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {remaining.map((project, index) => (
            <ProjectCard key={`${project.title}-${index}`} project={project} index={index} onOpen={setOpen} />
          ))}
        </div>
      </div>

      <AnimatePresence>{open && <ProjectModal project={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}
