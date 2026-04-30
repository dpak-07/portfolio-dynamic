"use client";

import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  FaBrain,
  FaChevronDown,
  FaChevronUp,
  FaCloud,
  FaCompass,
  FaEnvelope,
  FaGraduationCap,
  FaLaptopCode,
  FaLink,
  FaMapMarkerAlt,
  FaTrophy,
  FaUsers,
} from "react-icons/fa";
import { useFirestoreData } from "@/hooks/useFirestoreData";
import { logLinkClick, logSectionView } from "../utils/analytics";
import { scrollToSection } from "@/utils/scrollToSection";

const DEFAULT_CONFIG = {
  image: {},
  bio: {
    short:
      "I build practical full-stack and AI products with a focus on clean interfaces, reliable systems, and measurable impact.",
    badges: ["Full-stack", "Cloud", "AI/ML"],
    expanded: {
      strengths: ["Product thinking", "Fast prototyping", "Reliable delivery"],
      recent: "Building portfolio systems, AI experiments, and cloud-backed product workflows.",
      values: "I like work that feels useful in the real world and stays maintainable after the first launch.",
    },
  },
  counters: [
    { id: "experience", value: 4, label: "Years" },
    { id: "projects", value: 20, label: "Projects" },
  ],
  cards: [
    {
      id: "learning",
      icon: "brain",
      title: "Learning",
      short: "AI, systems, and product craft.",
      long: "I keep sharpening the parts of engineering that make products faster, cleaner, and easier to scale.",
    },
    {
      id: "building",
      icon: "laptop",
      title: "Building",
      short: "Useful apps with reliable foundations.",
      long: "Most of my work sits between frontend polish, backend structure, cloud deployment, and AI features.",
    },
    {
      id: "direction",
      icon: "compass",
      title: "Direction",
      short: "Impact first, tech second.",
      long: "I choose tools around the problem, then tune the experience until it feels clear and quick.",
    },
  ],
  holoSections: [],
};

const iconMap = {
  graduation: FaGraduationCap,
  brain: FaBrain,
  laptop: FaLaptopCode,
  cloud: FaCloud,
  trophy: FaTrophy,
  users: FaUsers,
  link: FaLink,
  compass: FaCompass,
};

const sectionVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] } },
};

function mergeDeep(defaultObj, overrideObj) {
  if (!overrideObj) return defaultObj;
  const out = typeof structuredClone === "function" ? structuredClone(defaultObj) : JSON.parse(JSON.stringify(defaultObj));

  const merge = (target, source) => {
    Object.keys(source).forEach((key) => {
      const value = source[key];
      if (value && typeof value === "object" && !Array.isArray(value)) {
        target[key] = target[key] || {};
        merge(target[key], value);
      } else {
        target[key] = value;
      }
    });
  };

  merge(out, overrideObj);
  return out;
}

const Badge = memo(function Badge({ children }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      whileHover={{ y: -2, scale: 1.02 }}
      className="rounded-md border px-3 py-1 text-xs font-semibold text-cyan-600"
      style={{ background: "var(--color-accent-soft)", borderColor: "var(--color-border-strong)" }}
    >
      {children}
    </motion.span>
  );
});

const InfoCard = memo(function InfoCard({ card, active, onToggle }) {
  const Icon = iconMap[card.icon] || FaCompass;

  return (
    <motion.article
      variants={itemVariants}
      whileHover={{ y: -3 }}
      className="rounded-lg border p-4"
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-soft)" }}
    >
      <button type="button" onClick={onToggle} className="flex w-full items-start gap-3 text-left">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-cyan-500" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-soft)" }}>
          <Icon />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-base font-bold text-[var(--color-text)]">{card.title}</span>
          <span className="mt-1 block text-sm text-[var(--color-muted)]">{card.short}</span>
        </span>
        <span className="mt-1 text-[var(--color-faint)]">{active ? <FaChevronUp /> : <FaChevronDown />}</span>
      </button>

      <AnimatePresence initial={false}>
        {active && (
          <motion.p
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden text-sm leading-relaxed text-[var(--color-muted)]"
          >
            {card.long}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.article>
  );
});

function LoadingState({ sectionRef }) {
  return (
    <section id="about" ref={sectionRef} className="relative overflow-hidden px-4 py-16 scroll-mt-24 sm:px-6 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-lg border p-8 text-center" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
          <p className="text-sm text-[var(--color-muted)]">Loading about section</p>
        </div>
      </div>
    </section>
  );
}

export default function AboutWithDriveImage({ overrideConfig }) {
  const { data: firestoreData, loading, error, refetch } = useFirestoreData("aboutpage", "main");
  const sectionRef = useRef(null);
  const loggedOnce = useRef(false);
  const inView = useInView(sectionRef, { once: true, amount: 0.16, margin: "-80px" });
  const [expandedBio, setExpandedBio] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [imgFailed, setImgFailed] = useState(false);

  const cfg = useMemo(() => {
    const base = firestoreData || DEFAULT_CONFIG;
    return overrideConfig ? mergeDeep(base, overrideConfig) : base;
  }, [firestoreData, overrideConfig]);

  useEffect(() => {
    if (inView && !loggedOnce.current) {
      logSectionView("about");
      loggedOnce.current = true;
    }
  }, [inView]);

  useEffect(() => {
    if (cfg.cards?.length && activeCard === null) {
      setActiveCard(cfg.cards[0]?.id || 0);
    }
  }, [activeCard, cfg.cards]);

  if (loading && !firestoreData) {
    return <LoadingState sectionRef={sectionRef} />;
  }

  const bio = cfg.bio || DEFAULT_CONFIG.bio;
  const badges = Array.isArray(bio.badges) ? bio.badges : [];
  const counters = Array.isArray(cfg.counters) ? cfg.counters : [];
  const cards = Array.isArray(cfg.cards) ? cfg.cards : [];
  const strengths = Array.isArray(bio.expanded?.strengths) ? bio.expanded.strengths : [];
  const imageUrl = cfg.image?.url;
  const interests = cfg.holoSections?.find((section) => section.type === "interests")?.content;
  const learning = cfg.holoSections?.find((section) => section.type === "learning")?.content;
  const leadership = cfg.holoSections?.find((section) => section.type === "leadership")?.content;

  return (
    <motion.section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden px-4 py-16 scroll-mt-24 sm:px-6 md:px-8 lg:py-20"
      variants={sectionVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, var(--color-border-strong), transparent)" }} />

      <div className="mx-auto max-w-6xl">
        <motion.div className="mb-10 text-center" variants={itemVariants}>
          <h2 className="bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl" style={{ backgroundImage: "linear-gradient(90deg, var(--color-text), var(--color-accent-strong), var(--color-warm))" }}>
            About Me
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--color-muted)] sm:text-base">
            A compact look at how I think, build, learn, and collaborate.
          </p>
        </motion.div>

        {error && (
          <motion.div variants={itemVariants} className="mx-auto mb-6 max-w-md rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
            Failed to load data.{" "}
            <button type="button" onClick={refetch} className="underline">
              Retry
            </button>
          </motion.div>
        )}

        <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
          <motion.aside variants={itemVariants} className="rounded-lg border p-4 sm:p-5" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-soft)" }}>
            <div className="overflow-hidden rounded-lg border" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-muted)" }}>
              {imageUrl && !imgFailed ? (
                <img src={imageUrl} alt="Deepak" loading="lazy" onError={() => setImgFailed(true)} className="aspect-square w-full object-cover" />
              ) : (
                <div className="flex aspect-square w-full items-center justify-center bg-gradient-to-br from-teal-400/25 to-amber-300/20 text-6xl font-black text-cyan-600">
                  D
                </div>
              )}
            </div>

            <div className="mt-5">
              <h3 className="text-2xl font-bold text-[var(--color-text)]">Deepak</h3>
              <p className="mt-1 text-sm text-[var(--color-muted)]">Pre-final year - AI & DS</p>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {counters.map((counter) => (
                <div key={counter.id || counter.label} className="rounded-lg border px-3 py-2 text-center" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-muted)" }}>
                  <motion.div className="text-2xl font-black text-[var(--color-text)]" initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    {counter.value}
                  </motion.div>
                  <div className="text-[10px] font-semibold leading-tight text-[var(--color-faint)]">{counter.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3 text-sm text-[var(--color-muted)]">
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-cyan-500" />
                <span>Chennai, India</span>
              </div>
              <a href="mailto:deepakofficial0103@gmail.com" onClick={() => logLinkClick("email")} className="flex items-center gap-3 break-all transition-colors hover:text-cyan-500">
                <FaEnvelope className="shrink-0 text-cyan-500" />
                <span>deepakofficial0103@gmail.com</span>
              </a>
            </div>
          </motion.aside>

          <div className="grid gap-5">
            <motion.div variants={itemVariants} className="rounded-lg border p-5" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)", boxShadow: "var(--shadow-soft)" }}>
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-faint)]">Profile</div>
                  <h3 className="text-xl font-bold text-[var(--color-text)]">How I Work</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setExpandedBio((value) => !value)}
                  className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold text-[var(--color-text)]"
                  style={{ borderColor: "var(--color-border)", background: "var(--color-surface-soft)" }}
                >
                  {expandedBio ? "Less" : "More"}
                  {expandedBio ? <FaChevronUp /> : <FaChevronDown />}
                </button>
              </div>

              <p className="text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">{bio.short}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <Badge key={badge}>{badge}</Badge>
                ))}
              </div>

              <AnimatePresence initial={false}>
                {expandedBio && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.24 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-5 grid gap-4 text-sm text-[var(--color-muted)] md:grid-cols-3">
                      <div className="rounded-lg border p-3" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-muted)" }}>
                        <div className="mb-2 font-bold text-[var(--color-text)]">Strengths</div>
                        <ul className="space-y-1">
                          {strengths.map((strength) => (
                            <li key={strength}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-lg border p-3" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-muted)" }}>
                        <div className="mb-2 font-bold text-[var(--color-text)]">Recent Work</div>
                        <p>{bio.expanded?.recent}</p>
                      </div>
                      <div className="rounded-lg border p-3" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-muted)" }}>
                        <div className="mb-2 font-bold text-[var(--color-text)]">Why I Build</div>
                        <p>{bio.expanded?.values}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <div className="grid gap-3 md:grid-cols-3">
              {cards.map((card) => (
                <InfoCard
                  key={card.id || card.title}
                  card={card}
                  active={activeCard === (card.id || card.title)}
                  onToggle={() => setActiveCard((current) => (current === (card.id || card.title) ? null : card.id || card.title))}
                />
              ))}
            </div>

            <motion.div variants={itemVariants} className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border p-4" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
                <div className="mb-2 text-sm font-bold text-[var(--color-text)]">Interests</div>
                <p className="text-sm text-[var(--color-muted)]">{interests || "Computer Vision, NLP, Cloud AI, MLOps"}</p>
              </div>
              <div className="rounded-lg border p-4" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
                <div className="mb-2 text-sm font-bold text-[var(--color-text)]">{leadership ? "Leadership" : "Currently Learning"}</div>
                <p className="text-sm text-[var(--color-muted)]">{leadership || learning || "Kubernetes for ML, transformer optimization, distributed training"}</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  logLinkClick("projects");
                  scrollToSection("projects", { offset: 88 });
                }}
                className="rounded-lg bg-gradient-to-r from-teal-400 to-amber-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg"
              >
                View Projects
              </button>
              <button
                type="button"
                onClick={() => {
                  logLinkClick("contact");
                  scrollToSection("contact", { offset: 88 });
                }}
                className="rounded-lg border px-5 py-3 text-sm font-semibold text-[var(--color-text)]"
                style={{ borderColor: "var(--color-border)" }}
              >
                Contact
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
