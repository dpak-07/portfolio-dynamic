"use client";

import { motion, useInView } from "framer-motion";
import {
  BrainCircuit,
  Cloud,
  Code2,
  Cpu,
  Database,
  Layers3,
  MonitorSmartphone,
  Server,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Wrench,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFirestoreData } from "@/hooks/useFirestoreData";
import { logLinkClick, logSectionView } from "../utils/analytics";

const FALLBACK_CATEGORIES = [
  { title: "Programming Languages", tech: ["Python", "JavaScript", "TypeScript", "Java", "C++"] },
  { title: "Frontend Development", tech: ["React", "Next.js", "Tailwind CSS", "Framer Motion"] },
  { title: "Backend Development", tech: ["Node.js", "Express", "REST APIs", "Firebase"] },
  { title: "Cloud & DevOps", tech: ["AWS", "Docker", "GitHub Actions", "Linux"] },
  { title: "AI & Machine Learning", tech: ["TensorFlow", "PyTorch", "OpenCV", "Scikit-learn"] },
];

const ACCENTS = ["#2dd4bf", "#f59e0b", "#38bdf8", "#22c55e", "#a78bfa", "#fb7185", "#60a5fa", "#f97316"];

const ICON_BY_TITLE = [
  [/programming|language/i, TerminalSquare],
  [/frontend|ui|web/i, MonitorSmartphone],
  [/backend|api|server/i, Server],
  [/database|storage|firestore|mongo|sql/i, Database],
  [/cloud|devops|aws|docker|deployment/i, Cloud],
  [/ai|machine|learning|data/i, BrainCircuit],
  [/mobile|android|ios|flutter|native/i, MonitorSmartphone],
  [/security|blockchain|crypto/i, ShieldCheck],
  [/tool|design|figma/i, Wrench],
];

const containerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
};

function pickIcon(title, index) {
  const match = ICON_BY_TITLE.find(([pattern]) => pattern.test(title));
  if (match) return match[1];
  return [Code2, Layers3, Cpu, Wrench][index % 4];
}

function normalizeCategories(firestoreData) {
  const source = Array.isArray(firestoreData?.techStackData) ? firestoreData.techStackData : FALLBACK_CATEGORIES;

  return source
    .map((category, index) => {
      const title = category?.title || `Category ${index + 1}`;
      const tech = Array.isArray(category?.tech)
        ? [...new Set(category.tech.map((tool) => String(tool || "").trim()).filter(Boolean))]
        : [];

      return {
        title,
        tech,
        accent: ACCENTS[index % ACCENTS.length],
        Icon: pickIcon(title, index),
      };
    })
    .filter((category) => category.tech.length > 0);
}

function LoadingState({ sectionRef }) {
  return (
    <section id="tech-stack" ref={sectionRef} className="relative overflow-hidden px-4 py-16 scroll-mt-24 sm:px-6 md:px-8">
      <div className="mx-auto flex min-h-80 max-w-6xl items-center justify-center">
        <div className="portfolio-panel flex items-center gap-3 rounded-lg px-5 py-4">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}>
            <Code2 className="h-5 w-5 text-cyan-500" />
          </motion.div>
          <span className="text-sm font-medium text-[var(--color-muted)]">Loading tech stack</span>
        </div>
      </div>
    </section>
  );
}

export default function AnimatedTechStack() {
  const sectionRef = useRef(null);
  const loggedOnce = useRef(false);
  const inView = useInView(sectionRef, { once: true, amount: 0.16, margin: "-80px" });
  const { data: firestoreData, loading, error } = useFirestoreData("techStack", "categories");
  const categories = useMemo(() => normalizeCategories(firestoreData), [firestoreData]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (inView && !loggedOnce.current) {
      logSectionView("tech-stack");
      loggedOnce.current = true;
    }
  }, [inView]);

  useEffect(() => {
    if (activeIndex >= categories.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, categories.length]);

  const selected = categories[activeIndex] || categories[0];
  const allTools = useMemo(() => new Set(categories.flatMap((category) => category.tech)).size, [categories]);
  const topTools = useMemo(() => categories.flatMap((category) => category.tech.slice(0, 3)).slice(0, 12), [categories]);

  if (loading && !firestoreData) {
    return <LoadingState sectionRef={sectionRef} />;
  }

  if (!selected) {
    return (
      <section id="tech-stack" ref={sectionRef} className="relative overflow-hidden px-4 py-16 scroll-mt-24 sm:px-6 md:px-8">
        <div className="portfolio-panel mx-auto max-w-6xl rounded-lg p-8 text-center">
          <Code2 className="mx-auto mb-3 h-8 w-8 text-cyan-500" />
          <p className="text-sm text-[var(--color-muted)]">{error ? "Unable to load tech stack data" : "No tech stack data available"}</p>
        </div>
      </section>
    );
  }

  const SelectedIcon = selected.Icon;

  return (
    <section id="tech-stack" ref={sectionRef} className="relative overflow-hidden px-4 py-16 scroll-mt-24 sm:px-6 md:px-8 lg:py-20">
      <motion.div className="mx-auto max-w-6xl" variants={containerVariants} initial="hidden" animate={inView ? "visible" : "hidden"}>
        <motion.div className="mb-9 text-center" variants={itemVariants}>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-faint)]" style={{ borderColor: "var(--color-border)" }}>
            <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
            Skills Matrix
          </div>
          <h2 className="portfolio-gradient-text text-4xl font-extrabold sm:text-5xl">Tech Stack</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
            Practical tools grouped by how I use them across product builds, data work, cloud delivery, and team projects.
          </p>
        </motion.div>

        <motion.div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]" variants={itemVariants}>
          <aside className="portfolio-panel rounded-lg p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-faint)]">Overview</div>
                <div className="text-lg font-bold text-[var(--color-text)]">Tool categories</div>
              </div>
              <div className="portfolio-panel-muted rounded-lg p-2 text-cyan-500">
                <Layers3 className="h-5 w-5" />
              </div>
            </div>

            <div className="mb-5 grid grid-cols-3 gap-2">
              {[
                ["Groups", categories.length],
                ["Tools", allTools],
                ["Active", selected.tech.length],
              ].map(([label, value]) => (
                <div key={label} className="portfolio-panel-muted rounded-lg px-3 py-2 text-center">
                  <div className="text-lg font-bold text-[var(--color-text)]">{value}</div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-faint)]">{label}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden" style={{ scrollbarWidth: "none" }}>
              {categories.map((category, index) => {
                const active = index === activeIndex;
                return (
                  <button
                    key={category.title}
                    type="button"
                    onClick={() => {
                      setActiveIndex(index);
                      logLinkClick(`tech_category_${category.title}`);
                    }}
                    className="shrink-0 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors"
                    style={{
                      borderColor: active ? category.accent : "var(--color-border)",
                      background: active ? "var(--color-accent-soft)" : "var(--color-surface-muted)",
                      color: "var(--color-text)",
                    }}
                  >
                    {category.title}
                  </button>
                );
              })}
            </div>

            <div className="hidden flex-col gap-2 lg:flex">
              {categories.map((category, index) => {
                const Icon = category.Icon;
                const active = index === activeIndex;
                return (
                  <button
                    key={category.title}
                    type="button"
                    onClick={() => {
                      setActiveIndex(index);
                      logLinkClick(`tech_category_${category.title}`);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition-colors"
                    style={{
                      borderColor: active ? category.accent : "var(--color-border)",
                      background: active ? "linear-gradient(90deg, rgba(45,212,191,0.13), rgba(245,158,11,0.08))" : "transparent",
                      color: "var(--color-text)",
                    }}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border" style={{ borderColor: "var(--color-border)", color: category.accent }}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{category.title}</span>
                      <span className="block text-xs text-[var(--color-faint)]">{category.tech.length} tools</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="portfolio-panel rounded-lg p-4 sm:p-5">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <span className="portfolio-panel-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-lg" style={{ color: selected.accent }}>
                  <SelectedIcon className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-faint)]">Focused Group</div>
                  <h3 className="text-xl font-bold text-[var(--color-text)] sm:text-2xl">{selected.title}</h3>
                </div>
              </div>
              <div className="portfolio-panel-muted w-fit rounded-lg px-3 py-2 text-sm font-semibold text-[var(--color-muted)]">
                {selected.tech.length} tools
              </div>
            </div>

            <motion.div
              key={selected.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4"
            >
              {selected.tech.map((tool, index) => (
                <motion.span
                  key={tool}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.018, duration: 0.18 }}
                  className="portfolio-chip rounded-lg px-3 py-2 text-center text-xs font-semibold sm:text-sm"
                >
                  {tool}
                </motion.span>
              ))}
            </motion.div>

            <div className="mt-5 rounded-lg border p-4" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-muted)" }}>
              <div className="mb-3 text-sm font-bold text-[var(--color-text)]">Frequently combined</div>
              <div className="flex flex-wrap gap-2">
                {topTools.map((tool) => (
                  <span key={`${selected.title}-${tool}`} className="rounded-md px-2 py-1 text-xs font-medium text-[var(--color-muted)]" style={{ background: "var(--color-bg-strong)" }}>
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" variants={itemVariants}>
          {categories.map((category, index) => {
            const Icon = category.Icon;
            return (
              <button
                key={category.title}
                type="button"
                onClick={() => setActiveIndex(index)}
                className="portfolio-panel group rounded-lg p-4 text-left transition-transform hover:-translate-y-1"
                style={{
                  borderColor: index === activeIndex ? category.accent : "var(--color-border)",
                }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="portfolio-panel-muted flex h-9 w-9 items-center justify-center rounded-lg" style={{ color: category.accent }}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-semibold text-[var(--color-faint)]">{category.tech.length}</span>
                </div>
                <h4 className="min-h-[2.5rem] text-sm font-bold leading-snug text-[var(--color-text)]">{category.title}</h4>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {category.tech.slice(0, 4).map((tool) => (
                    <span key={tool} className="rounded-md px-2 py-1 text-[11px] font-medium text-[var(--color-muted)]" style={{ background: "var(--color-surface-muted)" }}>
                      {tool}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
