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

function pickIcon(title, index) {
  const match = ICON_BY_TITLE.find(([pattern]) => pattern.test(title));
  return match ? match[1] : [Code2, Layers3, Cpu, Wrench][index % 4];
}

function normalizeCategories(firestoreData) {
  const source = Array.isArray(firestoreData?.techStackData) ? firestoreData.techStackData : [];

  return source
    .map((category, index) => {
      const title = String(category?.title || "").trim();
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
    .filter((category) => category.title && category.tech.length > 0);
}

function StatusState({ sectionRef, error }) {
  return (
    <section id="tech-stack" ref={sectionRef} className="relative overflow-hidden px-4 py-20 scroll-mt-24 sm:px-6 md:px-8">
      <div className="portfolio-panel mx-auto max-w-3xl rounded-lg p-6 text-center sm:p-8">
        <Code2 className="mx-auto mb-3 h-8 w-8 text-cyan-500" />
        <h2 className="portfolio-gradient-text text-3xl font-black">Tech Stack</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--color-muted)]">
          {error || "Tech stack data is waiting for Firestore document techStack/categories."}
        </p>
      </div>
    </section>
  );
}

export default function AnimatedTechStack() {
  const sectionRef = useRef(null);
  const loggedOnce = useRef(false);
  const inView = useInView(sectionRef, { once: true, amount: 0.14, margin: "-80px" });
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
    if (activeIndex >= categories.length) setActiveIndex(0);
  }, [activeIndex, categories.length]);

  if (loading && !firestoreData) {
    return (
      <section id="tech-stack" ref={sectionRef} className="relative overflow-hidden px-4 py-20 scroll-mt-24 sm:px-6 md:px-8">
        <div className="portfolio-panel mx-auto flex min-h-72 max-w-5xl items-center justify-center rounded-lg p-8">
          <div className="flex items-center gap-3">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}>
              <Code2 className="h-5 w-5 text-cyan-500" />
            </motion.div>
            <span className="text-sm font-medium text-[var(--color-muted)]">Loading Firestore tech stack</span>
          </div>
        </div>
      </section>
    );
  }

  if (error || categories.length === 0) {
    return <StatusState sectionRef={sectionRef} error={error} />;
  }

  const selected = categories[activeIndex] || categories[0];
  const SelectedIcon = selected.Icon;
  const totalTools = new Set(categories.flatMap((category) => category.tech)).size;
  const highlightTools = selected.tech.slice(0, 5);

  return (
    <section id="tech-stack" ref={sectionRef} className="relative overflow-hidden px-4 py-16 scroll-mt-24 sm:px-6 md:px-8 lg:py-20">
      <motion.div
        className="mx-auto max-w-6xl"
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-faint)]" style={{ borderColor: "var(--color-border)" }}>
            <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
            Firestore Stack
          </div>
          <h2 className="portfolio-gradient-text text-4xl font-extrabold sm:text-5xl">Tech Stack</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
            A mobile-first map of the tools powering my full-stack, cloud, AI, and product work.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="portfolio-panel overflow-hidden rounded-lg">
            <div className="border-b p-4 sm:p-5" style={{ borderColor: "var(--color-border)" }}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-faint)]">Skill Deck</div>
                  <div className="text-lg font-bold text-[var(--color-text)]">{categories.length} categories</div>
                </div>
                <div className="portfolio-panel-muted rounded-lg px-3 py-2 text-right">
                  <div className="text-xl font-black text-[var(--color-text)]">{totalTools}</div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-faint)]">tools</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 lg:grid-cols-1 lg:p-4">
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
                    className="min-h-24 rounded-lg border p-3 text-left transition-all lg:min-h-0"
                    style={{
                      borderColor: active ? category.accent : "var(--color-border)",
                      background: active ? "linear-gradient(135deg, rgba(45,212,191,0.15), rgba(245,158,11,0.09))" : "var(--color-surface-muted)",
                      boxShadow: active ? `0 16px 36px ${category.accent}22` : "none",
                    }}
                  >
                    <div className="mb-3 flex items-center justify-between gap-2 lg:mb-0">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border" style={{ borderColor: "var(--color-border)", color: category.accent }}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-xs font-bold text-[var(--color-faint)]">{category.tech.length}</span>
                    </div>
                    <div className="text-sm font-bold leading-tight text-[var(--color-text)] lg:mt-2">{category.title}</div>
                    <div className="mt-1 hidden text-xs text-[var(--color-faint)] lg:block">{category.tech.slice(0, 3).join(" / ")}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="portfolio-panel relative overflow-hidden rounded-lg p-5 sm:p-6">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-40" style={{ background: `linear-gradient(90deg, ${selected.accent}33, transparent)` }} />
            <div className="relative">
              <div className="mb-5 flex items-start gap-4">
                <span className="portfolio-panel-muted flex h-14 w-14 shrink-0 items-center justify-center rounded-lg" style={{ color: selected.accent }}>
                  <SelectedIcon className="h-7 w-7" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-faint)]">Now Viewing</div>
                  <h3 className="text-2xl font-black leading-tight text-[var(--color-text)]">{selected.title}</h3>
                </div>
              </div>

              <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
                {highlightTools.map((tool, index) => (
                  <motion.div
                    key={tool}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="min-h-20 rounded-lg border p-2 text-center"
                    style={{ borderColor: "var(--color-border)", background: "var(--color-bg-strong)" }}
                  >
                    <div className="mx-auto mb-2 h-1.5 w-8 rounded-full" style={{ backgroundColor: selected.accent }} />
                    <div className="break-words text-[11px] font-bold leading-tight text-[var(--color-text)]">{tool}</div>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {selected.tech.map((tool, index) => (
                  <motion.span
                    key={tool}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.018 }}
                    className="portfolio-chip rounded-lg px-3 py-2 text-center text-xs font-semibold sm:text-sm"
                  >
                    {tool}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
