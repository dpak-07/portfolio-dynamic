"use client";

import { motion, useInView } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Cloud,
  Code2,
  Cpu,
  Database,
  Gauge,
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
const MotionDiv = motion.div;
const MotionLi = motion.li;

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
        accent: category?.accent || ACCENTS[index % ACCENTS.length],
        Icon: pickIcon(title, index),
      };
    })
    .filter((category) => category.title && category.tech.length > 0);
}

function formatCount(value, width = 2) {
  return String(value).padStart(width, "0");
}

function getDomainPath(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
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

function MetricCard({ label, value, accent }) {
  return (
    <div className="portfolio-panel-muted rounded-lg p-3 text-center">
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-faint)]">{label}</div>
      <div className="mt-1 truncate text-xl font-black leading-none sm:text-2xl" style={{ color: accent || "var(--color-text)" }}>
        {value}
      </div>
    </div>
  );
}

function CategoryNode({ category, index, active, selectedPanelId, onSelect }) {
  const Icon = category.Icon;

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-controls={selectedPanelId}
      onClick={onSelect}
      className="group relative min-h-[7rem] rounded-lg border p-3 text-left transition-transform hover:-translate-y-0.5 sm:min-h-[7.5rem]"
      style={{
        borderColor: active ? `${category.accent}88` : "var(--color-border)",
        background: active
          ? `linear-gradient(135deg, ${category.accent}22, rgba(245,158,11,0.08))`
          : "var(--color-surface-muted)",
        boxShadow: active ? `0 16px 38px ${category.accent}20` : "none",
      }}
    >
      {active && <span className="absolute right-2 top-2 h-2 w-2 rounded-full" style={{ backgroundColor: category.accent }} />}
      <div className="mb-3 flex items-center justify-between gap-3">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-lg border"
          style={{ borderColor: active ? `${category.accent}70` : "var(--color-border)", color: category.accent }}
        >
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-xs font-black text-[var(--color-faint)]">{formatCount(index + 1)}</span>
      </div>
      <div className="line-clamp-2 text-sm font-black leading-tight text-[var(--color-text)]">{category.title}</div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="line-clamp-1 text-[11px] font-semibold text-[var(--color-faint)]">
          {category.tech.slice(0, 2).join(" / ")}
        </span>
        <span className="shrink-0 rounded-full px-2 py-1 text-[10px] font-black" style={{ background: `${category.accent}22`, color: category.accent }}>
          {category.tech.length}
        </span>
      </div>
    </button>
  );
}

function SelectedDomain({ selected, activeIndex, categories, selectedPanelId, onPrevious, onNext }) {
  const SelectedIcon = selected.Icon;
  const maxTools = Math.max(...categories.map((category) => category.tech.length), 1);
  const signalStrength = Math.max(24, Math.round((selected.tech.length / maxTools) * 100));
  const highlightTools = selected.tech.slice(0, 4);

  return (
    <div id={selectedPanelId} className="portfolio-panel relative overflow-hidden rounded-lg p-4 sm:p-6">
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: `linear-gradient(90deg, transparent, ${selected.accent}, transparent)` }} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 opacity-35" style={{ background: `linear-gradient(90deg, ${selected.accent}33, transparent)` }} />

      <div className="relative">
        <div className="mb-5 flex items-start gap-3 sm:gap-4">
          <span className="portfolio-panel-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-lg sm:h-14 sm:w-14" style={{ color: selected.accent }}>
            <SelectedIcon className="h-6 w-6 sm:h-7 sm:w-7" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-faint)]">
              domain.signal/{getDomainPath(selected.title)}
            </div>
            <h3 className="mt-1 text-2xl font-black leading-tight text-[var(--color-text)] sm:text-3xl">{selected.title}</h3>
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              {formatCount(activeIndex + 1)} / {formatCount(categories.length)} active domain
            </p>
          </div>
          <div className="portfolio-panel-muted hidden rounded-lg px-3 py-2 text-right sm:block">
            <div className="text-2xl font-black leading-none" style={{ color: selected.accent }}>
              {formatCount(selected.tech.length)}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-faint)]">tools</div>
          </div>
        </div>

        <div className="mb-5 rounded-lg border p-3" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-muted)" }}>
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--color-faint)]">
              <Gauge className="h-3.5 w-3.5" />
              Signal Strength
            </span>
            <span className="text-xs font-black" style={{ color: selected.accent }}>
              {signalStrength}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[var(--color-bg-strong)]">
            <MotionDiv
              key={selected.title}
              initial={{ width: 0 }}
              animate={{ width: `${signalStrength}%` }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ backgroundColor: selected.accent }}
            />
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {highlightTools.map((tool, index) => (
            <MotionDiv
              key={tool}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="min-h-16 rounded-lg border p-2 text-center"
              style={{ borderColor: "var(--color-border)", background: "var(--color-bg-strong)" }}
            >
              <div className="mx-auto mb-2 h-1.5 w-8 rounded-full" style={{ backgroundColor: selected.accent }} />
              <div className="break-words text-[11px] font-bold leading-tight text-[var(--color-text)]">{tool}</div>
            </MotionDiv>
          ))}
        </div>

        <ul className="flex flex-wrap gap-2.5 sm:gap-2">
          {selected.tech.map((tool, index) => (
            <MotionLi
              key={tool}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.015 }}
              className="portfolio-chip inline-flex min-h-10 max-w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-center text-xs font-semibold leading-tight sm:text-sm"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: selected.accent }} />
              {tool}
            </MotionLi>
          ))}
        </ul>

        <div className="mt-6 flex items-center justify-between gap-3 border-t pt-4" style={{ borderColor: "var(--color-border)" }}>
          <button type="button" onClick={onPrevious} className="portfolio-secondary-button inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold">
            <ArrowLeft className="h-4 w-4" />
            Prev
          </button>
          <div className="flex items-center gap-1.5">
            {categories.map((category, index) => (
              <span
                key={category.title}
                className="h-2 w-2 rounded-full transition-transform"
                style={{
                  backgroundColor: index === activeIndex ? selected.accent : "var(--color-border-strong)",
                  transform: index === activeIndex ? "scale(1.25)" : "scale(1)",
                }}
              />
            ))}
          </div>
          <button type="button" onClick={onNext} className="portfolio-secondary-button inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold">
            Next
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
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
            <span className="text-sm font-medium text-[var(--color-muted)]">Loading skill map</span>
          </div>
        </div>
      </section>
    );
  }

  if (error || categories.length === 0) {
    return <StatusState sectionRef={sectionRef} error={error} />;
  }

  const selected = categories[activeIndex] || categories[0];
  const totalTools = new Set(categories.flatMap((category) => category.tech)).size;
  const selectedPanelId = "tech-stack-panel";
  const coreTools = [...new Set(categories.flatMap((category) => category.tech))].slice(0, 12);
  const goPrevious = () => setActiveIndex((index) => (index - 1 + categories.length) % categories.length);
  const goNext = () => setActiveIndex((index) => (index + 1) % categories.length);

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
        <div className="mb-7 text-center sm:mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-faint)]" style={{ borderColor: "var(--color-border)" }}>
            <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
            Stack Signal
          </div>
          <h2 id="tech-stack-title" className="portfolio-gradient-text text-4xl font-extrabold sm:text-5xl">
            Tech Stack
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
            A compact map of the tools I use across frontend, backend, cloud, AI, data, and product builds.
          </p>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-2 sm:gap-3">
          <MetricCard label="Domains" value={formatCount(categories.length)} accent="var(--color-accent-strong)" />
          <MetricCard label="Tools" value={formatCount(totalTools)} accent={selected.accent} />
          <MetricCard label="Active" value={selected.title} accent={selected.accent} />
        </div>

        <div className="portfolio-panel mb-4 overflow-hidden rounded-lg px-3 py-2">
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {coreTools.map((tool) => (
              <span key={tool} className="portfolio-chip shrink-0 rounded-md px-2.5 py-1.5 text-[11px] font-bold">
                {tool}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div className="portfolio-panel rounded-lg p-3 sm:p-4">
            <div className="mb-3 flex items-center justify-between gap-3 border-b pb-3" style={{ borderColor: "var(--color-border)" }}>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-faint)]">Signal Grid</div>
                <div className="text-lg font-black text-[var(--color-text)]">Select a domain</div>
              </div>
              <div className="rounded-lg px-3 py-2 text-right" style={{ background: `${selected.accent}18` }}>
                <div className="text-xl font-black leading-none" style={{ color: selected.accent }}>
                  {formatCount(activeIndex + 1)}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-faint)]">active</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {categories.map((category, index) => (
                <CategoryNode
                  key={category.title}
                  category={category}
                  index={index}
                  active={index === activeIndex}
                  selectedPanelId={selectedPanelId}
                  onSelect={() => {
                    setActiveIndex(index);
                    logLinkClick(`tech_category_${category.title}`);
                  }}
                />
              ))}
            </div>
          </div>

          <SelectedDomain
            selected={selected}
            activeIndex={activeIndex}
            categories={categories}
            selectedPanelId={selectedPanelId}
            onPrevious={goPrevious}
            onNext={goNext}
          />
        </div>
      </MotionDiv>
    </section>
  );
}
