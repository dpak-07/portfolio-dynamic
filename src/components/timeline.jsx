"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Award,
  Brain,
  Briefcase,
  CalendarDays,
  Cloud,
  Code,
  GraduationCap,
  Lightbulb,
  Link,
  Mail,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useFirestoreData } from "@/hooks/useFirestoreData";
import { logLinkClick, logSectionView } from "@/utils/analytics";

const iconMap = {
  TrendingUp,
  Target,
  Users,
  Trophy,
  Brain,
  Code,
  Award,
  Rocket,
  Zap,
  Lightbulb,
  GraduationCap,
  Briefcase,
  Cloud,
  Link,
  Mail,
};

const ACCENT_HEX = {
  blue: "#38bdf8",
  orange: "#f97316",
  emerald: "#10b981",
  fuchsia: "#d946ef",
  violet: "#8b5cf6",
  indigo: "#6366f1",
  cyan: "#06b6d4",
  rose: "#fb7185",
};

const ACCENTS = ["#38bdf8", "#f59e0b", "#10b981", "#d946ef", "#8b5cf6", "#06b6d4"];
const MotionArticle = motion.article;
const MotionDiv = motion.div;

function getAccent(event, index) {
  return ACCENT_HEX[event?.accentColor] || ACCENTS[index % ACCENTS.length];
}

function getEventKey(event, index) {
  return `${event.year}-${event.title}-${event._originIndex ?? index}`;
}

function formatStep(value) {
  return String(value).padStart(2, "0");
}

function normalizeTimeline(data) {
  const events = Array.isArray(data?.events)
    ? data.events
        .map((event, index) => ({
          ...event,
          _originIndex: index,
          title: String(event?.title || "").trim(),
          year: String(event?.year || "").trim(),
          period: String(event?.period || "").trim(),
          description: String(event?.description || "").trim(),
          achievements: Array.isArray(event?.achievements)
            ? event.achievements.map((item) => String(item).trim()).filter(Boolean)
            : [],
          skills: Array.isArray(event?.skills) ? event.skills.map((skill) => String(skill).trim()).filter(Boolean) : [],
        }))
        .filter((event) => event.title && event.year)
    : [];

  const stats = Array.isArray(data?.stats) ? data.stats.filter((stat) => stat?.label) : [];
  return { events, stats };
}

function extractYears(event) {
  const matches = `${event?.year || ""} ${event?.period || ""}`.match(/\d{4}/g) || [];
  return matches.map((year) => Number(year)).filter(Boolean);
}

function getCurrentSignalScore(event) {
  const text = `${event?.year || ""} ${event?.period || ""} ${event?.title || ""} ${event?.description || ""}`.toLowerCase();

  if (/\b(current|currently|present|ongoing|now)\b/.test(text)) return 80;
  if (/\b(leading|working|building|developing)\b/.test(text)) return 55;
  if (/\b(completed|certification|master class)\b/.test(text)) return -12;
  return 0;
}

function getTimelineRank(event) {
  const years = extractYears(event);
  const latestYear = years.length > 0 ? Math.max(...years) : 0;
  return latestYear * 100 + getCurrentSignalScore(event);
}

function sortTimelineEvents(events) {
  return [...events].sort((a, b) => {
    const rankDiff = getTimelineRank(b) - getTimelineRank(a);
    if (rankDiff !== 0) return rankDiff;
    return (b._originIndex ?? 0) - (a._originIndex ?? 0);
  });
}

function StatCard({ stat, index }) {
  const Icon = typeof stat.icon === "string" ? iconMap[stat.icon] : stat.icon;
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    <div className="portfolio-panel rounded-lg p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="portfolio-panel-muted flex h-9 w-9 items-center justify-center rounded-lg sm:h-10 sm:w-10" style={{ color: accent }}>
          {Icon ? <Icon className="h-4 w-4 sm:h-5 sm:w-5" /> : <Sparkles className="h-5 w-5" />}
        </span>
        <span className="text-[10px] font-bold text-[var(--color-faint)] sm:text-xs">{formatStep(index + 1)}</span>
      </div>
      <div className="text-2xl font-black text-[var(--color-text)] sm:text-3xl">{stat.value}</div>
      <div className="mt-1 text-[11px] font-semibold leading-tight text-[var(--color-muted)] sm:text-xs">{stat.label}</div>
    </div>
  );
}

function EventModal({ event, accent, onClose }) {
  const Icon = typeof event.icon === "string" ? iconMap[event.icon] : event.icon;

  return (
    <MotionDiv className="fixed inset-0 z-[1001] flex items-end justify-center p-0 sm:items-center sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button type="button" aria-label="Close timeline detail" className="portfolio-modal-backdrop absolute inset-0" onClick={onClose} />
      <MotionArticle
        initial={{ y: 48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 48, opacity: 0 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className="portfolio-modal-card relative max-h-[92svh] w-full overflow-y-auto rounded-t-lg p-5 sm:max-w-3xl sm:rounded-lg sm:p-7"
      >
        <button type="button" onClick={onClose} className="portfolio-secondary-button absolute right-3 top-3 rounded-full p-2">
          <X className="h-5 w-5" />
        </button>
        <div className="mb-5 flex items-start gap-4 pr-10">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border" style={{ color: accent, borderColor: "var(--color-border)", background: "var(--color-surface-muted)" }}>
            {Icon ? <Icon className="h-7 w-7" /> : <CalendarDays className="h-7 w-7" />}
          </span>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-faint)]">{event.period}</div>
            <h3 className="text-2xl font-black leading-tight text-[var(--color-text)] sm:text-3xl">{event.title}</h3>
            <div className="mt-1 text-sm font-bold" style={{ color: accent }}>
              {event.year}
            </div>
          </div>
        </div>
        {event.description && <p className="text-sm leading-relaxed text-[var(--color-muted)]">{event.description}</p>}
        {event.achievements.length > 0 && (
          <div className="mt-6">
            <div className="mb-3 text-sm font-black text-[var(--color-text)]">Key Achievements</div>
            <div className="grid gap-2">
              {event.achievements.map((item) => (
                <div key={item} className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-muted)]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
        {event.skills.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {event.skills.map((skill) => (
              <span key={skill} className="portfolio-chip rounded-lg px-3 py-2 text-xs font-semibold">
                {skill}
              </span>
            ))}
          </div>
        )}
      </MotionArticle>
    </MotionDiv>
  );
}

function TimelineRail({ events, activeIndex, onSelect }) {
  return (
    <aside className="portfolio-panel rounded-lg p-3 sm:p-4 lg:sticky lg:top-24">
      <div className="mb-3 flex items-center justify-between gap-3 border-b pb-3" style={{ borderColor: "var(--color-border)" }}>
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-faint)]">Journey Console</div>
          <div className="text-lg font-black text-[var(--color-text)]">{events.length} milestones</div>
        </div>
        <div className="portfolio-panel-muted rounded-lg px-3 py-2 text-right">
          <div className="text-xl font-black leading-none text-[var(--color-text)]">{formatStep(activeIndex + 1)}</div>
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-faint)]">active</div>
        </div>
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto lg:block lg:space-y-2 lg:overflow-visible">
        {events.map((event, index) => {
          const accent = getAccent(event, index);
          const Icon = typeof event.icon === "string" ? iconMap[event.icon] : event.icon;
          const active = activeIndex === index;

          return (
            <button
              key={getEventKey(event, index)}
              type="button"
              onClick={() => onSelect(index)}
              className="relative min-w-[15.5rem] rounded-lg border p-3 text-left transition-transform hover:-translate-y-0.5 lg:min-w-0 lg:w-full"
              style={{
                borderColor: active ? `${accent}88` : "var(--color-border)",
                background: active ? `linear-gradient(135deg, ${accent}20, rgba(245,158,11,0.08))` : "var(--color-surface-muted)",
                boxShadow: active ? `0 14px 34px ${accent}1f` : "none",
              }}
            >
              <div className="mb-2 flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border" style={{ color: accent, borderColor: active ? `${accent}70` : "var(--color-border)" }}>
                  {Icon ? <Icon className="h-4 w-4" /> : <CalendarDays className="h-4 w-4" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-black" style={{ color: accent }}>
                    {event.year}
                  </span>
                  <span className="block truncate text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-faint)]">
                    {event.period}
                  </span>
                </span>
                {active && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />}
              </div>
              <div className="line-clamp-2 text-sm font-black leading-tight text-[var(--color-text)]">{event.title}</div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function ActiveJourneyPanel({ event, activeIndex, total, accent, onOpen, onPrevious, onNext }) {
  const Icon = typeof event.icon === "string" ? iconMap[event.icon] : event.icon;

  return (
    <MotionArticle
      key={getEventKey(event, activeIndex)}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
      className="portfolio-panel relative overflow-hidden rounded-lg"
    >
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: `linear-gradient(90deg, transparent, ${accent}, #fbbf24, transparent)` }} />
      <div className="pointer-events-none absolute -right-12 -top-12 hidden h-44 w-44 rounded-full border opacity-40 sm:block" style={{ borderColor: `${accent}55` }} />
      <div className="pointer-events-none absolute -right-4 top-12 hidden h-20 w-20 rounded-full border opacity-50 sm:block" style={{ borderColor: `${accent}44` }} />

      <div className="relative p-5 sm:p-7 lg:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.14em]" style={{ borderColor: `${accent}66`, color: accent }}>
            <Sparkles className="h-3.5 w-3.5" />
            {activeIndex === 0 ? "Current Focus" : `Chapter ${formatStep(activeIndex + 1)}`}
          </span>
          <span className="text-xs font-bold text-[var(--color-faint)]">
            {formatStep(activeIndex + 1)} / {formatStep(total)}
          </span>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_10rem] lg:items-start">
          <div>
            <div className="mb-5 flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border" style={{ color: accent, borderColor: `${accent}66`, background: "var(--color-surface-muted)" }}>
                {Icon ? <Icon className="h-7 w-7" /> : <CalendarDays className="h-7 w-7" />}
              </span>
              <div className="min-w-0">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-faint)]">{event.period}</div>
                <h3 className="mt-1 text-2xl font-black leading-tight text-[var(--color-text)] sm:text-4xl">{event.title}</h3>
                <div className="mt-2 text-sm font-black" style={{ color: accent }}>
                  {event.year}
                </div>
              </div>
            </div>

            {event.description && <p className="max-w-3xl text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">{event.description}</p>}
          </div>

          <div className="portfolio-panel-muted rounded-lg p-4 text-center">
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-faint)]">milestone</div>
            <div className="mt-1 text-5xl font-black leading-none" style={{ color: accent }}>
              {formatStep(activeIndex + 1)}
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--color-bg-strong)]">
              <MotionDiv
                initial={{ width: 0 }}
                animate={{ width: `${((activeIndex + 1) / total) * 100}%` }}
                transition={{ duration: 0.45 }}
                className="h-full rounded-full"
                style={{ backgroundColor: accent }}
              />
            </div>
          </div>
        </div>

        {event.achievements.length > 0 && (
          <div className="mt-6 grid gap-2 sm:grid-cols-3">
            {event.achievements.slice(0, 3).map((item) => (
              <div key={item} className="rounded-lg border px-3 py-2 text-xs font-semibold leading-relaxed text-[var(--color-muted)]" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-muted)" }}>
                {item}
              </div>
            ))}
          </div>
        )}

        {event.skills.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {event.skills.slice(0, 8).map((skill) => (
              <span key={skill} className="portfolio-chip rounded-lg px-3 py-2 text-xs font-semibold">
                {skill}
              </span>
            ))}
          </div>
        )}

        <div className="mt-7 flex flex-wrap items-center gap-2">
          <button type="button" onClick={onPrevious} className="portfolio-secondary-button inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold">
            <ArrowLeft className="h-4 w-4" />
            Prev
          </button>
          <button type="button" onClick={onNext} className="portfolio-secondary-button inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold">
            Next
            <ArrowRight className="h-4 w-4" />
          </button>
          <button type="button" onClick={onOpen} className="portfolio-primary-button ml-0 inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold sm:ml-auto sm:flex-none">
            Open Details
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </MotionArticle>
  );
}

export default function AutoScrollCarouselTimeline() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.16 });
  const loggedOnce = useRef(false);
  const { data: timelineData, loading, error } = useFirestoreData("timeline", "data");
  const { events, stats } = useMemo(() => normalizeTimeline(timelineData), [timelineData]);
  const orderedEvents = useMemo(() => sortTimelineEvents(events), [events]);
  const [selected, setSelected] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (inView && !loggedOnce.current) {
      logSectionView("timeline");
      loggedOnce.current = true;
    }
  }, [inView]);

  useEffect(() => {
    if (activeIndex >= orderedEvents.length) setActiveIndex(0);
  }, [activeIndex, orderedEvents.length]);

  if (loading && !timelineData) {
    return (
      <section id="timeline" ref={sectionRef} className="relative flex min-h-[70vh] items-center justify-center px-4 py-20">
        <div className="portfolio-panel flex items-center gap-3 rounded-lg px-5 py-4">
          <MotionDiv animate={{ rotate: 360 }} transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}>
            <CalendarDays className="h-5 w-5 text-cyan-500" />
          </MotionDiv>
          <span className="text-sm font-medium text-[var(--color-muted)]">Loading Firestore timeline</span>
        </div>
      </section>
    );
  }

  if (error || orderedEvents.length === 0) {
    return (
      <section id="timeline" ref={sectionRef} className="relative flex min-h-[70vh] items-center justify-center px-4 py-20">
        <div className="portfolio-panel max-w-xl rounded-lg p-6 text-center">
          <CalendarDays className="mx-auto mb-3 h-8 w-8 text-cyan-500" />
          <h2 className="portfolio-gradient-text text-3xl font-black">Timeline</h2>
          <p className="mt-3 text-sm text-[var(--color-muted)]">{error || "Timeline data is waiting for Firestore document timeline/data."}</p>
        </div>
      </section>
    );
  }

  const activeEvent = orderedEvents[activeIndex] || orderedEvents[0];
  const activeAccent = getAccent(activeEvent, activeIndex);
  const goPrevious = () => setActiveIndex((index) => (index - 1 + orderedEvents.length) % orderedEvents.length);
  const goNext = () => setActiveIndex((index) => (index + 1) % orderedEvents.length);

  return (
    <section id="timeline" ref={sectionRef} className="relative overflow-hidden px-4 py-14 scroll-mt-24 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <MotionDiv
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mb-7 text-center sm:mb-8"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-faint)]" style={{ borderColor: "var(--color-border)" }}>
            <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
            Journey Console
          </div>
          <h2 className="portfolio-gradient-text text-4xl font-extrabold sm:text-5xl">My Journey</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
            A focused timeline console with the latest chapter first and every milestone one tap away.
          </p>
        </MotionDiv>

        {stats.length > 0 && (
          <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <StatCard key={stat.label} stat={stat} index={index} />
            ))}
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-start">
          <TimelineRail events={orderedEvents} activeIndex={activeIndex} onSelect={setActiveIndex} />
          <ActiveJourneyPanel
            event={activeEvent}
            activeIndex={activeIndex}
            total={orderedEvents.length}
            accent={activeAccent}
            onPrevious={goPrevious}
            onNext={goNext}
            onOpen={() => {
              setSelected({ event: activeEvent, accent: activeAccent });
              logLinkClick(`timeline_${activeEvent.year}_${activeEvent.title}`);
            }}
          />
        </div>
      </div>

      <AnimatePresence>
        {selected && <EventModal event={selected.event} accent={selected.accent} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}
