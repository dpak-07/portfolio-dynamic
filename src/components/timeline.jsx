"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowUpRight,
  Award,
  Brain,
  Briefcase,
  CalendarDays,
  ChevronDown,
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
        <span className="text-[10px] font-bold text-[var(--color-faint)] sm:text-xs">{String(index + 1).padStart(2, "0")}</span>
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

function CurrentTimelineCard({ event, accent, onOpen }) {
  const Icon = typeof event.icon === "string" ? iconMap[event.icon] : event.icon;

  return (
    <MotionArticle
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.24 }}
      transition={{ duration: 0.35 }}
      className="portfolio-panel overflow-hidden rounded-lg"
    >
      <div className="relative p-5 sm:p-6 lg:p-7">
        <div className="absolute inset-x-0 top-0 h-1" style={{ background: `linear-gradient(90deg, ${accent}, #fbbf24)` }} />
        <div className="mb-5 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.14em]" style={{ borderColor: `${accent}66`, color: accent }}>
            <Sparkles className="h-3.5 w-3.5" />
            Current
          </span>
          <span className="text-xs font-bold text-[var(--color-faint)]">{event.year}</span>
        </div>

        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border sm:h-14 sm:w-14" style={{ color: accent, borderColor: `${accent}66`, background: "var(--color-surface-muted)" }}>
            {Icon ? <Icon className="h-6 w-6 sm:h-7 sm:w-7" /> : <CalendarDays className="h-7 w-7" />}
          </span>
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-faint)]">{event.period}</div>
            <h3 className="mt-1 text-2xl font-black leading-tight text-[var(--color-text)] sm:text-3xl">{event.title}</h3>
          </div>
        </div>

        {event.description && <p className="mt-5 text-sm leading-relaxed text-[var(--color-muted)]">{event.description}</p>}

        {event.achievements.length > 0 && (
          <ul className="mt-5 space-y-2">
            {event.achievements.slice(0, 3).map((item) => (
              <li key={item} className="flex gap-2 text-sm text-[var(--color-muted)]">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}

        {event.skills.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {event.skills.slice(0, 6).map((skill) => (
              <span key={skill} className="portfolio-chip rounded-lg px-3 py-2 text-xs font-semibold">
                {skill}
              </span>
            ))}
          </div>
        )}

        <button type="button" onClick={onOpen} className="portfolio-primary-button mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold sm:w-auto">
          Full Story
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </MotionArticle>
  );
}

function TimelineAccordionCard({ event, index, expanded, isCurrent, accent, onToggle, onOpen }) {
  const Icon = typeof event.icon === "string" ? iconMap[event.icon] : event.icon;

  return (
    <MotionArticle
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ delay: index * 0.025, duration: 0.26 }}
      className="portfolio-panel overflow-hidden rounded-lg"
    >
      <button type="button" onClick={onToggle} className="flex w-full items-center gap-3 p-3 text-left sm:gap-4 sm:p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border" style={{ color: accent, borderColor: `${accent}66`, background: "var(--color-surface-muted)" }}>
          {Icon ? <Icon className="h-5 w-5" /> : <CalendarDays className="h-5 w-5" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="mb-1 flex flex-wrap items-center gap-2">
            <span className="rounded-full px-2.5 py-1 text-[11px] font-black text-slate-950" style={{ backgroundColor: accent }}>
              {event.year}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-faint)]">{event.period}</span>
            {isCurrent && <span className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--color-accent-strong)]">Now</span>}
          </span>
          <span className="block truncate text-base font-black leading-tight text-[var(--color-text)] sm:text-lg">{event.title}</span>
          {!expanded && event.description && <span className="mt-1 hidden text-xs leading-relaxed text-[var(--color-muted)] sm:line-clamp-1">{event.description}</span>}
        </span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-[var(--color-faint)] transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <MotionDiv
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden border-t border-[var(--color-border)]"
          >
            <div className="px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
              {event.description && <p className="text-sm leading-relaxed text-[var(--color-muted)]">{event.description}</p>}

              {event.achievements.length > 0 && (
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {event.achievements.slice(0, 4).map((item) => (
                    <div key={item} className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs leading-relaxed text-[var(--color-muted)]">
                      {item}
                    </div>
                  ))}
                </div>
              )}

              {event.skills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {event.skills.slice(0, 6).map((skill) => (
                    <span key={skill} className="portfolio-chip rounded-md px-2 py-1 text-[11px] font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <button type="button" onClick={onOpen} className="portfolio-secondary-button mt-4 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold">
                View Details
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
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
  const [expandedKey, setExpandedKey] = useState(null);

  useEffect(() => {
    if (inView && !loggedOnce.current) {
      logSectionView("timeline");
      loggedOnce.current = true;
    }
  }, [inView]);

  useEffect(() => {
    setExpandedKey((currentKey) => {
      if (currentKey && orderedEvents.some((event, index) => getEventKey(event, index) === currentKey)) {
        return currentKey;
      }
      return orderedEvents[0] ? getEventKey(orderedEvents[0], 0) : null;
    });
  }, [orderedEvents]);

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

  const currentEvent = orderedEvents[0];
  const currentAccent = getAccent(currentEvent, 0);

  return (
    <section id="timeline" ref={sectionRef} className="relative overflow-hidden px-4 py-14 scroll-mt-24 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <MotionDiv
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mb-7 text-center sm:mb-8"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-faint)]" style={{ borderColor: "var(--color-border)" }}>
            <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
            Journey Path
          </div>
          <h2 className="portfolio-gradient-text text-4xl font-extrabold sm:text-5xl">My Journey</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
            The latest work appears first, with older milestones tucked into expandable cards.
          </p>
        </MotionDiv>

        {stats.length > 0 && (
          <div className="mb-6 grid grid-cols-2 gap-3 lg:mb-8 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <StatCard key={stat.label} stat={stat} index={index} />
            ))}
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <CurrentTimelineCard
              event={currentEvent}
              accent={currentAccent}
              onOpen={() => {
                setSelected({ event: currentEvent, accent: currentAccent });
                logLinkClick(`timeline_${currentEvent.year}_${currentEvent.title}`);
              }}
            />
          </div>

          <div className="space-y-3">
            {orderedEvents.map((event, index) => {
              const key = getEventKey(event, index);
              const accent = getAccent(event, index);

              return (
                <TimelineAccordionCard
                  key={key}
                  event={event}
                  index={index}
                  accent={accent}
                  isCurrent={index === 0}
                  expanded={expandedKey === key}
                  onToggle={() => setExpandedKey((currentKey) => (currentKey === key ? "" : key))}
                  onOpen={() => {
                    setSelected({ event, accent });
                    logLinkClick(`timeline_${event.year}_${event.title}`);
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selected && <EventModal event={selected.event} accent={selected.accent} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}
