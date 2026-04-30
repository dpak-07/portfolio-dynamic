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

const ACCENTS = ["#14b8a6", "#f59e0b", "#38bdf8", "#22c55e", "#8b5cf6", "#fb7185", "#60a5fa", "#f97316"];
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

const DOMAIN_COPY = [
  [/programming|language/i, "Problem solving, scripting, fundamentals, and production-ready application logic."],
  [/frontend|ui|web/i, "Fast interfaces, responsive layouts, motion details, and user-focused product screens."],
  [/backend|api|server/i, "APIs, auth flows, service logic, integrations, and scalable backend architecture."],
  [/database|storage|firestore|mongo|sql/i, "Data modeling, persistence, queries, realtime content, and admin-driven systems."],
  [/cloud|devops|aws|docker|deployment/i, "Deployment, hosting, source control, Linux workflows, and cloud-ready delivery."],
  [/ai|machine|learning|data/i, "Applied AI, computer vision, analytics, model workflows, and data experimentation."],
  [/mobile|android|ios|flutter|native/i, "Cross-platform mobile builds with app-style interaction and Firebase-backed flows."],
  [/tool|design|figma/i, "Design systems, prototyping, developer workflow, testing, and collaboration tools."],
];

function pickIcon(title, index) {
  const match = ICON_BY_TITLE.find(([pattern]) => pattern.test(title));
  return match ? match[1] : [Code2, Layers3, Cpu, Wrench][index % 4];
}

function getDomainCopy(title) {
  const match = DOMAIN_COPY.find(([pattern]) => pattern.test(title));
  return match ? match[1] : "A focused toolset I use to move ideas from prototype to working product.";
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
        summary: getDomainCopy(title),
      };
    })
    .filter((category) => category.title && category.tech.length > 0);
}

function formatCount(value, width = 2) {
  return String(value).padStart(width, "0");
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

function StatTile({ label, value, accent }) {
  return (
    <div className="rounded-lg border px-3 py-3" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-muted)" }}>
      <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--color-faint)]">{label}</div>
      <div className="mt-1 truncate text-2xl font-black leading-none" style={{ color: accent || "var(--color-text)" }}>
        {value}
      </div>
    </div>
  );
}

function CategoryRibbon({ categories, activeIndex, onSelect }) {
  return (
    <div className="portfolio-panel mb-4 rounded-lg p-2">
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {categories.map((category, index) => {
          const Icon = category.Icon;
          const active = index === activeIndex;

          return (
            <button
              key={category.title}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(index)}
              className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-left transition-transform hover:-translate-y-0.5"
              style={{
                borderColor: active ? `${category.accent}88` : "var(--color-border)",
                background: active ? `${category.accent}18` : "var(--color-surface-muted)",
              }}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border" style={{ borderColor: active ? `${category.accent}66` : "var(--color-border)", color: category.accent }}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block max-w-[11rem] truncate text-sm font-black text-[var(--color-text)]">{category.title}</span>
                <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-faint)]">{formatCount(category.tech.length)} tools</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DomainHero({ selected, activeIndex, categories, onPrevious, onNext }) {
  const Icon = selected.Icon;

  return (
    <div className="portfolio-panel relative overflow-hidden rounded-lg">
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: `linear-gradient(90deg, transparent, ${selected.accent}, #fbbf24, transparent)` }} />
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 opacity-30 sm:block" style={{ background: `linear-gradient(90deg, transparent, ${selected.accent}33)` }} />
      <div className="relative p-5 sm:p-7 lg:p-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border sm:h-16 sm:w-16" style={{ borderColor: `${selected.accent}66`, color: selected.accent, background: `${selected.accent}12` }}>
              <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
            </span>
            <div className="min-w-0">
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--color-faint)]">Capability Layer</div>
              <h3 className="mt-1 text-3xl font-black leading-none text-[var(--color-text)] sm:text-5xl">{selected.title}</h3>
            </div>
          </div>
          <div className="hidden rounded-lg border px-3 py-2 text-right sm:block" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-muted)" }}>
            <div className="text-3xl font-black leading-none" style={{ color: selected.accent }}>
              {formatCount(activeIndex + 1)}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-faint)]">of {formatCount(categories.length)}</div>
          </div>
        </div>

        <p className="max-w-2xl text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">{selected.summary}</p>

        <div className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {selected.tech.slice(0, 6).map((tool, index) => (
            <MotionDiv
              key={tool}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.035 }}
              className="min-h-16 rounded-lg border px-3 py-3"
              style={{ borderColor: "var(--color-border)", background: "var(--color-bg-strong)" }}
            >
              <div className="mb-2 h-1.5 w-8 rounded-full" style={{ backgroundColor: selected.accent }} />
              <div className="break-words text-xs font-black leading-tight text-[var(--color-text)] sm:text-sm">{tool}</div>
            </MotionDiv>
          ))}
        </div>

        <div className="mt-7 flex items-center justify-between gap-3">
          <button type="button" onClick={onPrevious} className="portfolio-secondary-button inline-flex h-10 w-10 items-center justify-center rounded-lg" title="Previous stack layer">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5">
            {categories.map((category, index) => (
              <span
                key={category.title}
                className="h-2 rounded-full transition-all"
                style={{
                  width: index === activeIndex ? "1.35rem" : "0.5rem",
                  backgroundColor: index === activeIndex ? selected.accent : "var(--color-border-strong)",
                }}
              />
            ))}
          </div>
          <button type="button" onClick={onNext} className="portfolio-secondary-button inline-flex h-10 w-10 items-center justify-center rounded-lg" title="Next stack layer">
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ToolWall({ selected }) {
  return (
    <div className="portfolio-panel relative overflow-hidden rounded-lg p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.18em] text-[var(--color-faint)]">Tool Wall</div>
          <div className="text-lg font-black text-[var(--color-text)]">{selected.tech.length} active tools</div>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border" style={{ borderColor: `${selected.accent}55`, color: selected.accent, background: `${selected.accent}12` }}>
          <Layers3 className="h-5 w-5" />
        </span>
      </div>

      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
        {selected.tech.map((tool, index) => (
          <MotionLi
            key={tool}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.018 }}
            className="min-h-11 rounded-lg border px-3 py-2 text-xs font-bold leading-tight text-[var(--color-text)]"
            style={{ borderColor: "var(--color-border)", background: index % 3 === 0 ? `${selected.accent}10` : "var(--color-surface-muted)" }}
          >
            <span className="mb-1 block h-1 w-5 rounded-full" style={{ backgroundColor: selected.accent }} />
            {tool}
          </MotionLi>
        ))}
      </ul>
    </div>
  );
}

function CapabilityLanes({ categories, activeIndex, onSelect }) {
  return (
    <div className="mt-4 grid gap-2 md:grid-cols-2">
      {categories.map((category, index) => {
        const Icon = category.Icon;
        const active = index === activeIndex;
        const preview = category.tech.slice(0, 4);

        return (
          <button
            key={category.title}
            type="button"
            onClick={() => onSelect(index)}
            className="group rounded-lg border p-3 text-left transition-transform hover:-translate-y-0.5"
            style={{
              borderColor: active ? `${category.accent}88` : "var(--color-border)",
              background: active ? `${category.accent}14` : "var(--color-surface)",
            }}
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border" style={{ borderColor: "var(--color-border)", color: category.accent }}>
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-black text-[var(--color-text)]">{category.title}</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-faint)]">{formatCount(category.tech.length)} tools</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {preview.map((tool) => (
                <span key={tool} className="rounded-md border px-2 py-1 text-[10px] font-semibold text-[var(--color-muted)]" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-muted)" }}>
                  {tool}
                </span>
              ))}
            </div>
          </button>
        );
      })}
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
        className="mx-auto max-w-7xl"
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="mb-7 text-center sm:mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-faint)]" style={{ borderColor: "var(--color-border)" }}>
            <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
            Capability Matrix
          </div>
          <h2 id="tech-stack-title" className="portfolio-gradient-text text-4xl font-extrabold sm:text-5xl">
            Tech Stack
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
            A crisp view of the technologies I use to design, build, deploy, and improve real products.
          </p>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-2 sm:gap-3">
          <StatTile label="Layers" value={formatCount(categories.length)} accent="var(--color-accent-strong)" />
          <StatTile label="Tools" value={formatCount(totalTools)} accent={selected.accent} />
          <StatTile label="Focus" value={selected.title} accent={selected.accent} />
        </div>

        <CategoryRibbon
          categories={categories}
          activeIndex={activeIndex}
          onSelect={(index) => {
            setActiveIndex(index);
            logLinkClick(`tech_category_${categories[index].title}`);
          }}
        />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.06fr)_minmax(22rem,0.94fr)] lg:items-start">
          <DomainHero selected={selected} activeIndex={activeIndex} categories={categories} onPrevious={goPrevious} onNext={goNext} />
          <ToolWall selected={selected} />
        </div>

        <CapabilityLanes
          categories={categories}
          activeIndex={activeIndex}
          onSelect={(index) => {
            setActiveIndex(index);
            logLinkClick(`tech_lane_${categories[index].title}`);
          }}
        />
      </MotionDiv>
    </section>
  );
}
