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
  TerminalSquare,
  Wrench,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFirestoreData } from "@/hooks/useFirestoreData";
import { logLinkClick, logSectionView } from "../utils/analytics";

const ACCENTS = ["#2dd4bf", "#f59e0b", "#38bdf8", "#22c55e", "#a78bfa", "#fb7185", "#60a5fa", "#f97316"];
const MotionDiv = motion.div;
const MotionSpan = motion.span;

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
          {error || "Tech stack data is being prepared."}
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
            <MotionDiv animate={{ rotate: 360 }} transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}>
              <Code2 className="h-5 w-5 text-cyan-500" />
            </MotionDiv>
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
  const selectedPanelId = `tech-stack-panel-${activeIndex}`;

  return (
    <section
      id="tech-stack"
      ref={sectionRef}
      aria-labelledby="tech-stack-title"
      className="relative overflow-hidden px-4 py-14 scroll-mt-24 sm:px-6 md:px-8 lg:py-20"
    >
      <MotionDiv
        className="mx-auto max-w-6xl"
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="mb-8 text-center sm:mb-10">
          <h2 id="tech-stack-title" className="portfolio-gradient-text text-4xl font-extrabold sm:text-5xl">
            Tech Stack
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
            A recruiter-friendly snapshot of the tools I use across full-stack, cloud, AI, and product work.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
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

            <div
              className="no-scrollbar -mx-3 flex snap-x gap-3 overflow-x-auto px-3 pb-4 pt-3 sm:-mx-4 sm:px-4 lg:mx-0 lg:grid lg:grid-cols-1 lg:gap-2 lg:overflow-visible lg:p-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {categories.map((category, index) => {
                const Icon = category.Icon;
                const active = index === activeIndex;

                return (
                  <button
                    key={category.title}
                    type="button"
                    aria-pressed={active}
                    aria-controls={selectedPanelId}
                    onClick={() => {
                      setActiveIndex(index);
                      logLinkClick(`tech_category_${category.title}`);
                    }}
                    className="min-h-[6.25rem] w-[78vw] max-w-[21rem] shrink-0 snap-start rounded-lg border p-3 text-left transition-all sm:w-[18rem] lg:w-full lg:min-h-0"
                    style={{
                      borderColor: active ? category.accent : "var(--color-border)",
                      background: active ? "linear-gradient(135deg, rgba(45,212,191,0.15), rgba(245,158,11,0.09))" : "var(--color-surface-muted)",
                      boxShadow: active ? `0 16px 36px ${category.accent}22` : "none",
                    }}
                  >
                    <div className="mb-2 flex items-center justify-between gap-2 lg:mb-0">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border" style={{ borderColor: "var(--color-border)", color: category.accent }}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-xs font-bold text-[var(--color-faint)]">{category.tech.length}</span>
                    </div>
                    <div className="text-sm font-bold leading-tight text-[var(--color-text)] lg:mt-2">{category.title}</div>
                    <div className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--color-faint)]">
                      {category.tech.slice(0, 3).join(" / ")}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div id={selectedPanelId} className="portfolio-panel relative overflow-hidden rounded-lg p-4 sm:p-6">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-40" style={{ background: `linear-gradient(90deg, ${selected.accent}33, transparent)` }} />
            <div className="relative">
              <div className="mb-5 flex items-center gap-3 sm:items-start sm:gap-4">
                <span className="portfolio-panel-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-lg sm:h-14 sm:w-14" style={{ color: selected.accent }}>
                  <SelectedIcon className="h-6 w-6 sm:h-7 sm:w-7" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-faint)] sm:text-xs sm:tracking-[0.18em]">Now Viewing</div>
                  <h3 className="text-xl font-black leading-tight text-[var(--color-text)] sm:text-2xl">{selected.title}</h3>
                  <p className="mt-1 text-xs text-[var(--color-muted)] sm:hidden">{selected.tech.length} tools selected</p>
                </div>
              </div>

              <div className="mb-5 hidden gap-2 sm:grid sm:grid-cols-3 md:grid-cols-5">
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

              <ul className="flex flex-wrap gap-2.5 sm:grid sm:grid-cols-3 sm:gap-2">
                {selected.tech.map((tool, index) => (
                  <motion.li
                    key={tool}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.018 }}
                    className="portfolio-chip inline-flex min-h-10 max-w-full items-center justify-center rounded-lg px-3 py-2 text-center text-xs font-semibold leading-tight sm:text-sm"
                  >
                    {tool}
                  </motion.li>
                ))}
              </ul>
            </div>
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
                  <MotionDiv
                    key={tool}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="min-h-20 rounded-lg border p-2 text-center"
                    style={{ borderColor: "var(--color-border)", background: "var(--color-bg-strong)" }}
                  >
                    <div className="mx-auto mb-2 h-1.5 w-8 rounded-full" style={{ backgroundColor: selected.accent }} />
                    <div className="break-words text-[11px] font-bold leading-tight text-[var(--color-text)]">{tool}</div>
                  </MotionDiv>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {selected.tech.map((tool, index) => (
                  <MotionSpan
                    key={tool}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.018 }}
                    className="portfolio-chip rounded-lg px-3 py-2 text-center text-xs font-semibold sm:text-sm"
                  >
                    {tool}
                  </MotionSpan>
                ))}
              </div>
            </div>
          </div>
        </div>
      </MotionDiv>
    </section>
  );
}
