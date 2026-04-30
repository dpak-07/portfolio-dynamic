"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
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

function normalizeTimeline(data) {
  const events = Array.isArray(data?.events)
    ? data.events
        .map((event) => ({
          ...event,
          title: String(event?.title || "").trim(),
          year: String(event?.year || "").trim(),
          period: String(event?.period || "").trim(),
          achievements: Array.isArray(event?.achievements) ? event.achievements.filter(Boolean) : [],
          skills: Array.isArray(event?.skills) ? event.skills.filter(Boolean) : [],
        }))
        .filter((event) => event.title && event.year)
    : [];

  const stats = Array.isArray(data?.stats) ? data.stats.filter((stat) => stat?.label) : [];
  return { events, stats };
}

function StatCard({ stat, index }) {
  const Icon = typeof stat.icon === "string" ? iconMap[stat.icon] : stat.icon;
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    <div className="portfolio-panel rounded-lg p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="portfolio-panel-muted flex h-10 w-10 items-center justify-center rounded-lg" style={{ color: accent }}>
          {Icon ? <Icon className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
        </span>
        <span className="text-xs font-bold text-[var(--color-faint)]">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="text-3xl font-black text-[var(--color-text)]">{stat.value}</div>
      <div className="mt-1 text-xs font-semibold text-[var(--color-muted)]">{stat.label}</div>
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
            <div className="mt-1 text-sm font-bold" style={{ color: accent }}>{event.year}</div>
          </div>
        </div>
        {event.description && <p className="text-sm leading-relaxed text-[var(--color-muted)]">{event.description}</p>}
        {event.achievements.length > 0 && (
          <div className="mt-6">
            <div className="mb-3 text-sm font-black text-[var(--color-text)]">Key Achievements</div>
            <div className="grid gap-2">
              {event.achievements.map((item) => (
                <div key={item} className="portfolio-panel-muted rounded-lg p-3 text-sm text-[var(--color-muted)]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
        {event.skills.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {event.skills.map((skill) => (
<span key={skill} className="portfolio-entry-chip rounded-lg px-3 py-2 text-xs font-semibold">
                {skill}
              </span>
            ))}
          </div>
        )}
      </MotionArticle>
    </MotionDiv>
  );
}

export default function AutoScrollCarouselTimeline() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.16 });
  const loggedOnce = useRef(false);
  const { data: timelineData, loading, error } = useFirestoreData("timeline", "data");
  const { events, stats } = useMemo(() => normalizeTimeline(timelineData), [timelineData]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (inView && !loggedOnce.current) {
      logSectionView("timeline");
      loggedOnce.current = true;
    }
  }, [inView]);

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

  if (error || events.length === 0) {
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

  return (
    <section id="timeline" ref={sectionRef} className="relative overflow-hidden px-4 py-16 scroll-mt-24 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <MotionDiv
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mb-8 text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-faint)]" style={{ borderColor: "var(--color-border)" }}>
            <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
            Journey Path
          </div>
          <h2 className="portfolio-gradient-text text-4xl font-extrabold sm:text-5xl">My Journey</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
            A creative trail through learning, internships, leadership, hackathons, and product work.
          </p>
        </MotionDiv>

        {stats.length > 0 && (
          <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <StatCard key={stat.label} stat={stat} index={index} />
            ))}
          </div>
        )}

        <div className="relative">
          <div className="absolute left-5 top-0 h-full w-px bg-gradient-to-b from-cyan-400 via-amber-300 to-transparent sm:left-1/2" />
          <div className="space-y-4">
            {events.map((event, index) => {
              const accent = getAccent(event, index);
              const Icon = typeof event.icon === "string" ? iconMap[event.icon] : event.icon;
              const alignRight = index % 2 === 1;

              return (
                <MotionArticle
                  key={`${event.year}-${event.title}`}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.22 }}
                  transition={{ delay: index * 0.04, duration: 0.3 }}
                  className={`relative pl-14 sm:grid sm:grid-cols-2 sm:gap-8 sm:pl-0 ${alignRight ? "" : ""}`}
                >
                  <div className="absolute left-0 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border bg-[var(--color-bg-strong)] sm:left-1/2 sm:-translate-x-1/2" style={{ borderColor: accent, color: accent }}>
                    {Icon ? <Icon className="h-5 w-5" /> : <CalendarDays className="h-5 w-5" />}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelected({ event, accent });
                      logLinkClick(`timeline_${event.year}_${event.title}`);
                    }}
                    className={`portfolio-panel relative block rounded-lg p-4 text-left transition-transform hover:-translate-y-1 sm:p-5 ${alignRight ? "sm:col-start-2" : "sm:col-start-1"}`}
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="rounded-full px-3 py-1 text-xs font-black text-slate-950" style={{ backgroundColor: accent }}>
                        {event.year}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-faint)]">{event.period}</span>
                    </div>
                    <h3 className="text-xl font-black leading-tight text-[var(--color-text)]">{event.title}</h3>
                    {event.description && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[var(--color-muted)]">{event.description}</p>}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {event.skills.slice(0, 4).map((skill) => (
<span key={skill} className="portfolio-entry-chip rounded-md px-2 py-1 text-[11px] font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </button>
                </MotionArticle>
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
