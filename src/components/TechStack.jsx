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

const ACCENTS = ["#14b8a6", "#f59e0b", "#6366f1", "#10b981", "#38bdf8", "#fb7185", "#8b5cf6", "#f97316"];
const MotionDiv = motion.div;
const MotionLi = motion.li;

const ICON_BY_TITLE = [
  [/product|frontend|ui|web|react|next/i, MonitorSmartphone],
  [/backend|api|server/i, Server],
  [/ai|machine|learning|data/i, BrainCircuit],
  [/database|storage|firestore|mongo|sql|supabase/i, Database],
  [/cloud|devops|aws|docker|deployment|ci/i, Cloud],
  [/trust|security|blockchain|crypto/i, ShieldCheck],
  [/mobile|android|ios|flutter|native/i, MonitorSmartphone],
  [/tool|design|quality|figma|testing/i, Wrench],
  [/programming|language/i, TerminalSquare],
];

const DOMAIN_COPY = [
  [/product|frontend|ui|web|react|next/i, "Product screens, responsive systems, motion details, and interfaces that make shipped work easy to inspect."],
  [/backend|api|server/i, "Service logic, APIs, auth, deployment wiring, and backend foundations for real product workflows."],
  [/ai|machine|learning|data/i, "Applied AI, model experimentation, data cleaning, analysis, and AI-assisted product features."],
  [/database|storage|firestore|mongo|sql|supabase/i, "Data modeling, realtime content, persistence, admin systems, and storage for portfolio-scale products."],
  [/cloud|devops|aws|docker|deployment|ci/i, "Cloud hosting, Linux workflows, CI/CD, container basics, and deployment decisions that keep apps reachable."],
  [/trust|security|blockchain|crypto/i, "Credential verification, secure flows, access control, cryptographic thinking, and safer user journeys."],
  [/mobile|android|ios|flutter|native/i, "Cross-platform mobile interfaces backed by APIs, auth flows, and app-style interactions."],
  [/tool|design|quality|figma|testing/i, "Design handoff, API testing, documentation, polish passes, and quality checks before release."],
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
        accent: ACCENTS[index % ACCENTS.length],
        Icon: pickIcon(title, index),
        summary: getDomainCopy(title),
        index,
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
        <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--color-muted)]">{error || "Tech stack data is being prepared."}</p>
      </div>
    </section>
  );
}

function StackStat({ label, value, accent }) {
  return (
    <div className="rounded-lg border p-3" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-muted)" }}>
      <div className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--color-faint)]">{label}</div>
      <div className="mt-1 truncate text-2xl font-black leading-none" style={{ color: accent || "var(--color-text)" }}>
        {value}
      </div>
    </div>
  );
}

function StackNav({ categories, activeIndex, onSelect }) {
  return (
    <div className="grid gap-2">
      {categories.map((category, index) => {
        const Icon = category.Icon;
        const active = index === activeIndex;

        return (
          <button
            key={category.title}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(index)}
            className="group flex min-h-14 items-center gap-3 rounded-lg border p-3 text-left transition-transform hover:-translate-y-0.5"
            style={{
              borderColor: active ? `${category.accent}88` : "var(--color-border)",
              background: active ? `${category.accent}18` : "var(--color-surface-muted)",
            }}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border" style={{ borderColor: active ? `${category.accent}66` : "var(--color-border)", color: category.accent }}>
              <Icon className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-black text-[var(--color-text)]">{category.title}</span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-faint)]">{formatCount(category.tech.length)} tools</span>
            </span>
            <span className="h-2 w-2 rounded-full transition-transform group-hover:scale-125" style={{ backgroundColor: category.accent }} />
          </button>
        );
      })}
    </div>
  );
}

function StackSpotlight({ selected, activeIndex, categories }) {
  const Icon = selected.Icon;
  const primaryTools = selected.tech.slice(0, 6);

  return (
    <div className="portfolio-panel relative overflow-hidden rounded-lg p-5 sm:p-7 lg:p-8">
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: `linear-gradient(90deg, ${selected.accent}, #fbbf24, transparent)` }} />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-20" style={{ background: `linear-gradient(135deg, transparent, ${selected.accent}55)` }} />

      <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-stretch">
        <div>
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border sm:h-16 sm:w-16" style={{ borderColor: `${selected.accent}66`, color: selected.accent, background: `${selected.accent}12` }}>
                <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
              </span>
              <div className="min-w-0">
                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--color-faint)]">Active Capability</div>
                <h3 className="mt-1 text-3xl font-black leading-tight text-[var(--color-text)] sm:text-5xl">{selected.title}</h3>
              </div>
            </div>
            <div className="rounded-lg border px-3 py-2 text-right" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-muted)" }}>
              <div className="text-3xl font-black leading-none" style={{ color: selected.accent }}>
                {formatCount(activeIndex + 1)}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-faint)]">of {formatCount(categories.length)}</div>
            </div>
          </div>

          <p className="max-w-3xl text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">{selected.summary}</p>

          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {primaryTools.map((tool, index) => (
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
        </div>

        <div className="rounded-lg border p-4" style={{ borderColor: `${selected.accent}55`, background: `${selected.accent}10` }}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--color-faint)]">Stack Density</div>
              <div className="text-4xl font-black leading-none" style={{ color: selected.accent }}>
                {formatCount(selected.tech.length)}
              </div>
            </div>
            <Layers3 className="h-6 w-6" style={{ color: selected.accent }} />
          </div>
          <div className="grid gap-2">
            {selected.tech.slice(0, 4).map((tool) => (
              <div key={tool} className="rounded-lg border px-3 py-2 text-xs font-bold text-[var(--color-text)]" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
                {tool}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CapabilityCard({ category, active, onSelect }) {
  const Icon = category.Icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      className="portfolio-panel group min-h-[15rem] rounded-lg p-4 text-left transition-transform hover:-translate-y-1"
      style={{ borderColor: active ? `${category.accent}88` : "var(--color-border)" }}
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border" style={{ borderColor: `${category.accent}55`, color: category.accent, background: `${category.accent}12` }}>
          <Icon className="h-5 w-5" />
        </span>
        <span className="rounded-full px-2.5 py-1 text-[10px] font-black text-slate-950" style={{ backgroundColor: category.accent }}>
          {formatCount(category.index + 1)}
        </span>
      </div>
      <h3 className="text-xl font-black leading-tight text-[var(--color-text)]">{category.title}</h3>
      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[var(--color-muted)]">{category.summary}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {category.tech.slice(0, 5).map((tool) => (
          <span key={tool} className="portfolio-chip rounded-md px-2 py-1 text-[10px] font-semibold">
            {tool}
          </span>
        ))}
      </div>
    </button>
  );
}

function ToolIndex({ categories }) {
  const allTools = [...new Set(categories.flatMap((category) => category.tech))];

  return (
    <div className="portfolio-panel rounded-lg p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.18em] text-[var(--color-faint)]">Tool Index</div>
          <div className="text-lg font-black text-[var(--color-text)]">{allTools.length} active technologies</div>
        </div>
        <Code2 className="h-5 w-5 text-cyan-500" />
      </div>
      <ul className="flex flex-wrap gap-2">
        {allTools.map((tool, index) => (
          <MotionLi
            key={tool}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: Math.min(index * 0.008, 0.18) }}
            className="portfolio-chip rounded-lg px-3 py-2 text-xs font-bold"
          >
            {tool}
          </MotionLi>
        ))}
      </ul>
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

  return (
    <section id="tech-stack" ref={sectionRef} aria-labelledby="tech-stack-title" className="relative overflow-hidden px-4 py-14 scroll-mt-24 sm:px-6 md:px-8 lg:py-20">
      <MotionDiv
        className="mx-auto max-w-7xl"
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="mb-7 grid gap-5 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-faint)]" style={{ borderColor: "var(--color-border)" }}>
              <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
              Capability Map
            </div>
            <h2 id="tech-stack-title" className="portfolio-gradient-text text-4xl font-extrabold sm:text-5xl">
              Tech Stack
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
              A product-focused map of the tools I use to design, build, deploy, secure, and improve working software.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <StackStat label="Layers" value={formatCount(categories.length)} accent="var(--color-accent-strong)" />
            <StackStat label="Tools" value={formatCount(totalTools)} accent={selected.accent} />
            <StackStat label="Focus" value={selected.title} accent={selected.accent} />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[21rem_minmax(0,1fr)] lg:items-start">
          <aside className="portfolio-panel rounded-lg p-3 lg:sticky lg:top-24">
            <StackNav
              categories={categories}
              activeIndex={activeIndex}
              onSelect={(index) => {
                setActiveIndex(index);
                logLinkClick(`tech_category_${categories[index].title}`);
              }}
            />
          </aside>

          <div className="grid gap-4">
            <StackSpotlight selected={selected} activeIndex={activeIndex} categories={categories} />
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {categories.map((category, index) => (
                <CapabilityCard
                  key={category.title}
                  category={category}
                  active={index === activeIndex}
                  onSelect={() => {
                    setActiveIndex(index);
                    logLinkClick(`tech_card_${category.title}`);
                  }}
                />
              ))}
            </div>
            <ToolIndex categories={categories} />
          </div>
        </div>
      </MotionDiv>
    </section>
  );
}
