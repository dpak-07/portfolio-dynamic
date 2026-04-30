"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowUpRight, ExternalLink, Github, Layers3, Loader2, Sparkles, Star, X } from "lucide-react";
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

function ProjectImage({ project, className = "" }) {
  if (project.img) {
    return <img src={project.img} alt={project.title} className={`h-full w-full object-cover ${className}`} loading="lazy" />;
  }

  return (
    <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-400/25 via-cyan-400/15 to-amber-300/25 p-6 text-center ${className}`}>
      <div>
        <Layers3 className="mx-auto mb-3 h-8 w-8 text-cyan-500" />
        <div className="text-lg font-black leading-tight text-[var(--color-text)]">{project.title}</div>
      </div>
    </div>
  );
}

function ProjectCard({ project, index, onOpen }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="portfolio-panel group overflow-hidden rounded-lg"
    >
      <button type="button" onClick={() => onOpen(project)} className="block w-full text-left">
        <div className="relative aspect-[4/3] overflow-hidden">
          <ProjectImage project={project} className="transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/82 via-slate-950/18 to-transparent" />
          {project.featured && (
            <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-amber-300 px-2.5 py-1 text-[11px] font-black text-slate-950">
              <Star className="h-3.5 w-3.5 fill-slate-950" />
              Featured
            </div>
          )}
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-xl font-black leading-tight text-white">{project.title}</h3>
            {project.desc && <p className="mt-1 line-clamp-2 text-xs text-white/78">{project.desc}</p>}
          </div>
        </div>
      </button>

      <div className="p-4">
        <div className="mb-4 flex flex-wrap gap-1.5">
          {project.tech?.slice(0, 5).map((tool) => (
            <span key={tool} className="portfolio-chip rounded-md px-2 py-1 text-[11px] font-semibold">
              {tool}
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => onOpen(project)} className="portfolio-primary-button inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold">
            Details
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
          {project.url && (
            <a href={project.url} target="_blank" rel="noreferrer" onClick={() => logLinkClick("project_github")} className="portfolio-secondary-button inline-flex h-9 w-9 items-center justify-center rounded-lg">
              <Github className="h-4 w-4" />
            </a>
          )}
          {project.live && (
            <a href={project.live} target="_blank" rel="noreferrer" onClick={() => logLinkClick("project_live")} className="portfolio-secondary-button inline-flex h-9 w-9 items-center justify-center rounded-lg">
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function ProjectModal({ project, onClose }) {
  return (
    <motion.div className="fixed inset-0 z-[1001] flex items-center justify-center p-3 sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button type="button" aria-label="Close project details" className="portfolio-modal-backdrop absolute inset-0" onClick={onClose} />
      <motion.article
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.96 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className="portfolio-modal-card relative max-h-[92svh] w-full max-w-5xl overflow-hidden rounded-lg"
      >
        <button type="button" onClick={onClose} className="portfolio-secondary-button absolute right-3 top-3 z-20 rounded-full p-2">
          <X className="h-5 w-5" />
        </button>

        <div className="grid max-h-[92svh] overflow-y-auto lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative min-h-64 overflow-hidden bg-slate-950 lg:min-h-[520px]">
            <ProjectImage project={project} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/72 via-transparent to-transparent" />
          </div>
          <div className="p-5 sm:p-7">
            {project.featured && (
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-amber-300 px-3 py-1 text-xs font-black text-slate-950">
                <Star className="h-3.5 w-3.5 fill-slate-950" />
                Featured Project
              </div>
            )}
            <h3 className="pr-10 text-3xl font-black leading-tight text-[var(--color-text)]">{project.title}</h3>
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
                <a href={project.live} target="_blank" rel="noreferrer" onClick={() => logLinkClick("project_live")} className="portfolio-primary-button inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold">
                  <ExternalLink className="h-4 w-4" />
                  Live Demo
                </a>
              )}
              {project.url && (
                <a href={project.url} target="_blank" rel="noreferrer" onClick={() => logLinkClick("project_github")} className="portfolio-secondary-button inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold">
                  <Github className="h-4 w-4" />
                  View Code
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.article>
    </motion.div>
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

  if (loading && !projectsData) {
    return (
      <section id="projects" ref={sectionRef} className="relative flex min-h-[70vh] items-center justify-center px-4 py-20">
        <div className="portfolio-panel flex items-center gap-3 rounded-lg px-5 py-4">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}>
            <Loader2 className="h-5 w-5 text-cyan-500" />
          </motion.div>
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
    <section id="projects" ref={sectionRef} className="relative overflow-hidden px-4 py-16 scroll-mt-24 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-faint)]" style={{ borderColor: "var(--color-border)" }}>
            <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
            Project Gallery
          </div>
          <h2 className="portfolio-gradient-text text-4xl font-extrabold sm:text-5xl">Featured Projects</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
            A clearer gallery of what I built, led, deployed, and shipped.
          </p>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          {categoryKeys.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setActive(category);
                logLinkClick(`project_category_${category}`);
              }}
              className="shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition-colors"
              style={{
                borderColor: active === category ? "rgba(45,212,191,0.7)" : "var(--color-border)",
                background: active === category ? "var(--color-accent-soft)" : "var(--color-surface-muted)",
                color: "var(--color-text)",
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {spotlight && (
          <motion.article
            key={`${active}-${spotlight.title}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="portfolio-panel mb-5 grid overflow-hidden rounded-lg lg:grid-cols-[1.15fr_0.85fr]"
          >
            <button type="button" onClick={() => setOpen(spotlight)} className="relative block min-h-72 overflow-hidden text-left lg:min-h-[430px]">
              <ProjectImage project={spotlight} className="transition-transform duration-700 hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/86 via-slate-950/14 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-amber-300 px-3 py-1 text-xs font-black text-slate-950">
                  <Star className="h-3.5 w-3.5 fill-slate-950" />
                  Spotlight
                </div>
                <h3 className="text-3xl font-black leading-tight text-white sm:text-4xl">{spotlight.title}</h3>
              </div>
            </button>

            <div className="p-5 sm:p-7">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-faint)]">{active}</div>
              {spotlight.desc && <p className="mt-3 text-xl font-black leading-tight text-[var(--color-text)]">{spotlight.desc}</p>}
              <p className="mt-4 line-clamp-6 text-sm leading-relaxed text-[var(--color-muted)]">{spotlight.long || spotlight.desc}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {spotlight.tech?.slice(0, 8).map((tool) => (
                  <span key={tool} className="portfolio-chip rounded-lg px-3 py-2 text-xs font-semibold">
                    {tool}
                  </span>
                ))}
              </div>
              <button type="button" onClick={() => setOpen(spotlight)} className="portfolio-primary-button mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold sm:w-auto">
                Explore Project
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </motion.article>
        )}

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
