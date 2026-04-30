"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Boxes,
  BrainCircuit,
  Cloud,
  Code2,
  Cpu,
  Database,
  Layers3,
  Server,
  Sparkles,
  Workflow,
  Wrench,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFirestoreData } from "@/hooks/useFirestoreData";
import { logLinkClick, logSectionView } from "../utils/analytics";

const FALLBACK_CATEGORIES = [
  { title: "Frontend Development", tech: ["React", "Next.js", "Tailwind CSS", "Framer Motion"] },
  { title: "Backend Development", tech: ["Node.js", "Express", "REST APIs", "Firebase"] },
  { title: "Cloud & DevOps", tech: ["AWS", "Docker", "GitHub Actions", "Vercel"] },
  { title: "AI & Machine Learning", tech: ["Python", "TensorFlow", "OpenAI", "MLOps"] },
];

const ACCENTS = ["#14b8a6", "#d97706", "#64748b", "#0ea5e9", "#10b981", "#8b5cf6", "#f59e0b", "#06b6d4"];
const ICONS = [Code2, Server, Cloud, BrainCircuit, Database, Cpu, Wrench, Boxes, Layers3, Workflow];

const containerVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] } },
};

function normalizeCategories(firestoreData) {
  const source = Array.isArray(firestoreData?.techStackData) ? firestoreData.techStackData : FALLBACK_CATEGORIES;

  return source
    .map((category, index) => ({
      title: category?.title || `Layer ${index + 1}`,
      tech: Array.isArray(category?.tech) ? category.tech.filter(Boolean) : [],
      accent: ACCENTS[index % ACCENTS.length],
      Icon: ICONS[index % ICONS.length],
    }))
    .filter((category) => category.tech.length > 0);
}

function distributeTools(tools) {
  const groups = [[], [], []];
  tools.forEach((tool, index) => groups[index % groups.length].push(tool));
  return groups;
}

function LoadingState({ sectionRef }) {
  return (
    <section id="tech-stack" ref={sectionRef} className="relative overflow-hidden px-4 py-20 scroll-mt-24 sm:px-6 md:px-8">
      <div className="mx-auto flex min-h-80 max-w-6xl items-center justify-center">
        <div className="flex items-center gap-3 rounded-lg border px-5 py-4" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
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
  const inView = useInView(sectionRef, { once: true, amount: 0.18, margin: "-80px" });
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
  const selectedTools = selected?.tech || [];
  const allTools = useMemo(() => new Set(categories.flatMap((category) => category.tech)).size, [categories]);
  const maxTools = Math.max(1, ...categories.map((category) => category.tech.length));
  const toolGroups = distributeTools(selectedTools);

  if (loading && !firestoreData) {
    return <LoadingState sectionRef={sectionRef} />;
  }

  if (!selected) {
    return (
      <section id="tech-stack" ref={sectionRef} className="relative overflow-hidden px-4 py-20 scroll-mt-24 sm:px-6 md:px-8">
        <div className="mx-auto max-w-6xl rounded-lg border p-8 text-center" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
          <Code2 className="mx-auto mb-3 h-8 w-8 text-cyan-500" />
          <p className="text-sm text-[var(--color-muted)]">{error ? "Unable to load tech stack data" : "No tech stack data available"}</p>
        </div>
      </section>
    );
  }

  const SelectedIcon = selected.Icon;

  return (
    <section id="tech-stack" ref={sectionRef} className="relative overflow-hidden px-4 py-20 scroll-mt-24 sm:px-6 md:px-8">
      <motion.div className="mx-auto max-w-6xl" variants={containerVariants} initial="hidden" animate={inView ? "visible" : "hidden"}>
        <motion.div className="mb-10 text-center" variants={itemVariants}>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-faint)]" style={{ borderColor: "var(--color-border)" }}>
            <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
            Stack Studio
          </div>
          <h2 className="bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl" style={{ backgroundImage: "linear-gradient(90deg, var(--color-text), var(--color-accent-strong), var(--color-warm))" }}>
            Tech Stack
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--color-muted)] sm:text-base">
            A working blueprint of the tools I use to design, build, ship, and scale products.
          </p>
        </motion.div>

        <motion.div className="grid gap-5 lg:grid-cols-[0.82fr_1.45fr]" variants={itemVariants}>
          <aside className="rounded-lg border p-4" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-soft)" }}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-faint)]">Build Console</div>
                <div className="text-lg font-bold text-[var(--color-text)]">Tool layers</div>
              </div>
              <div className="rounded-lg border p-2 text-cyan-500" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-soft)" }}>
                <Workflow className="h-5 w-5" />
              </div>
            </div>

            <div className="mb-5 grid grid-cols-3 gap-2">
              {[
                ["Layers", categories.length],
                ["Tools", allTools],
                ["Active", selectedTools.length],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border px-3 py-2" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-muted)" }}>
                  <div className="text-lg font-bold text-[var(--color-text)]">{value}</div>
                  <div className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-faint)]">{label}</div>
                </div>
              ))}
            </div>

            <div className="hidden flex-col gap-2 lg:flex">
              {categories.map((category, index) => {
                const Icon = category.Icon;
                const active = index === activeIndex;
                return (
                  <motion.button
                    key={category.title}
                    type="button"
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setActiveIndex(index);
                      logLinkClick(`tech_layer_${category.title}`);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition-colors"
                    style={{
                      borderColor: active ? category.accent : "var(--color-border)",
                      background: active ? "linear-gradient(90deg, rgba(20,184,166,0.14), rgba(217,119,6,0.08))" : "transparent",
                      color: "var(--color-text)",
                    }}
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg border" style={{ borderColor: "var(--color-border)", color: category.accent }}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{category.title}</span>
                      <span className="block text-xs text-[var(--color-faint)]">{category.tech.length} tools</span>
                    </span>
                    <ArrowRight className={`h-4 w-4 transition-transform ${active ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-35"}`} />
                  </motion.button>
                );
              })}
            </div>

            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:hidden" style={{ scrollbarWidth: "none" }}>
              {categories.map((category, index) => {
                const active = index === activeIndex;
                return (
                  <motion.button
                    key={category.title}
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setActiveIndex(index);
                      logLinkClick(`tech_layer_${category.title}`);
                    }}
                    className="shrink-0 rounded-lg border px-3 py-2 text-sm font-semibold"
                    style={{
                      borderColor: active ? category.accent : "var(--color-border)",
                      background: active ? "var(--color-accent-soft)" : "var(--color-surface-muted)",
                      color: "var(--color-text)",
                    }}
                  >
                    {category.title}
                  </motion.button>
                );
              })}
            </div>
          </aside>

          <div className="rounded-lg border p-4 sm:p-5" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-soft)" }}>
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border" style={{ color: selected.accent, borderColor: "var(--color-border)", background: "var(--color-surface-soft)" }}>
                  <SelectedIcon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-faint)]">Active Blueprint</div>
                  <h3 className="text-xl font-bold text-[var(--color-text)]">{selected.title}</h3>
                </div>
              </div>
              <div className="rounded-lg border px-3 py-2 text-sm font-semibold text-[var(--color-muted)]" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-muted)" }}>
                {selectedTools.length} connected tools
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selected.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]"
              >
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-muted)" }}>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-sm font-bold text-[var(--color-text)]">Tool Map</div>
                    <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-200/70">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: selected.accent }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(18, Math.round((selectedTools.length / maxTools) * 100))}%` }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {selectedTools.map((tool, index) => (
                      <motion.span
                        key={tool}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.025, duration: 0.22 }}
                        className="rounded-lg border px-3 py-2 text-center text-sm font-semibold text-[var(--color-text)]"
                        style={{ borderColor: "var(--color-border)", background: "var(--color-bg-strong)" }}
                      >
                        {tool}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3">
                  {["Shape", "Build", "Ship"].map((phase, phaseIndex) => (
                    <div key={phase} className="rounded-lg border p-3" style={{ borderColor: "var(--color-border)", background: "var(--color-bg-strong)" }}>
                      <div className="mb-2 flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold text-slate-950" style={{ backgroundColor: selected.accent }}>
                          {phaseIndex + 1}
                        </span>
                        <span className="font-semibold text-[var(--color-text)]">{phase}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(toolGroups[phaseIndex].length ? toolGroups[phaseIndex] : selectedTools.slice(0, 2)).map((tool) => (
                          <span key={`${phase}-${tool}`} className="rounded-md px-2 py-1 text-xs font-medium text-[var(--color-muted)]" style={{ background: "var(--color-surface-muted)" }}>
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" variants={itemVariants}>
          {categories.map((category, index) => {
            const Icon = category.Icon;
            return (
              <motion.button
                key={category.title}
                type="button"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveIndex(index)}
                className="group rounded-lg border p-4 text-left transition-colors"
                style={{
                  background: index === activeIndex ? "linear-gradient(135deg, var(--color-accent-soft), rgba(217,119,6,0.08))" : "var(--color-surface)",
                  borderColor: index === activeIndex ? category.accent : "var(--color-border)",
                  boxShadow: "var(--shadow-soft)",
                }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border" style={{ color: category.accent, borderColor: "var(--color-border)" }}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-semibold text-[var(--color-faint)]">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h4 className="line-clamp-1 text-sm font-bold text-[var(--color-text)]">{category.title}</h4>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {category.tech.slice(0, 3).map((tool) => (
                    <span key={tool} className="rounded-md px-2 py-1 text-[11px] font-medium text-[var(--color-muted)]" style={{ background: "var(--color-surface-muted)" }}>
                      {tool}
                    </span>
                  ))}
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
