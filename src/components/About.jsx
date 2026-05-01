"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  FaArrowRight,
  FaBrain,
  FaCloud,
  FaCompass,
  FaEnvelope,
  FaGraduationCap,
  FaLaptopCode,
  FaLayerGroup,
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
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.06 },
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

function LoadingState({ sectionRef }) {
  return (
    <section id="about" ref={sectionRef} className="relative overflow-hidden px-4 py-16 scroll-mt-24 sm:px-6 lg:px-8">
      <div className="portfolio-panel mx-auto max-w-6xl rounded-2xl p-8 text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[var(--color-border-strong)] border-t-[var(--color-text)]" />
        <p className="text-sm text-[var(--color-muted)]">Loading about section</p>
      </div>
    </section>
  );
}

function Badge({ children }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      whileHover={{ y: -2 }}
      className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-1 text-xs font-bold text-[var(--color-text)]"
    >
      {children}
    </motion.span>
  );
}

function HighlightCard({ card, index }) {
  const Icon = iconMap[card.icon] || FaCompass;
  const accents = ["var(--color-accent-a)", "var(--color-accent-b)", "var(--color-accent-c)", "var(--color-accent-d)"];

  return (
    <motion.article
      variants={itemVariants}
      whileHover={{ y: -5 }}
      style={{ "--accent-local": accents[index % accents.length] }}
      className="portfolio-panel portfolio-panel-accent rounded-2xl p-4"
    >
      <div className="portfolio-accent-icon mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)]">
        <Icon className="h-4 w-4" />
      </div>
      <div className="portfolio-accent-number text-xs font-bold uppercase tracking-[0.16em]">0{index + 1}</div>
      <h3 className="mt-1 text-base font-black text-[var(--color-text)]">{card.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{card.short || card.long}</p>
    </motion.article>
  );
}

export default function AboutWithDriveImage({ overrideConfig }) {
  const { data: firestoreData, loading, error, refetch } = useFirestoreData("aboutpage", "main");
  const sectionRef = useRef(null);
  const loggedOnce = useRef(false);
  const inView = useInView(sectionRef, { once: true, amount: 0.16, margin: "-80px" });
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

  if (loading && !firestoreData) {
    return <LoadingState sectionRef={sectionRef} />;
  }

  const bio = cfg.bio || DEFAULT_CONFIG.bio;
  const badges = Array.isArray(bio.badges) ? bio.badges : [];
  const counters = Array.isArray(cfg.counters) ? cfg.counters : [];
  const cards = Array.isArray(cfg.cards) ? cfg.cards : [];
  const strengths = Array.isArray(bio.expanded?.strengths) ? bio.expanded.strengths.slice(0, 4) : [];
  const imageUrl = cfg.image?.url;
  const interests = cfg.holoSections?.find((section) => section.type === "interests")?.content;
  const leadership = cfg.holoSections?.find((section) => section.type === "leadership")?.content;

  return (
    <motion.section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden px-4 py-16 scroll-mt-24 sm:px-6 lg:px-8 lg:py-24"
      variants={sectionVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <div className="mx-auto max-w-7xl">
        {error && (
          <motion.div variants={itemVariants} className="mx-auto mb-6 max-w-md rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface-muted)] px-4 py-3 text-sm text-[var(--color-muted)]">
            Failed to load data.{" "}
            <button type="button" onClick={refetch} className="font-bold underline text-[var(--color-text)]">
              Retry
            </button>
          </motion.div>
        )}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.58fr)] lg:items-start xl:gap-12">
          <div>
            <motion.div variants={itemVariants} className="mb-6">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-faint)]">
                <FaLayerGroup className="h-3.5 w-3.5" />
                About Me
              </div>
              <h2 className="portfolio-rainbow-text text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                Building useful systems with clean product thinking.
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--color-muted)] sm:text-lg">
                {bio.short}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-7 flex flex-wrap gap-2">
              {badges.map((badge) => (
                <Badge key={badge}>{badge}</Badge>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {counters.map((counter, index) => (
                <div
                  key={counter.id || counter.label}
                  style={{ "--accent-local": ["var(--color-accent-a)", "var(--color-accent-b)", "var(--color-accent-c)"][index % 3] }}
                  className="portfolio-panel portfolio-panel-accent rounded-2xl p-4"
                >
                  <div className="portfolio-accent-number text-3xl font-black">{counter.value}</div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-faint)]">{counter.label}</div>
                </div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="grid gap-3 md:grid-cols-2">
              <div className="portfolio-panel rounded-2xl p-5">
                <h3 className="text-sm font-black uppercase tracking-[0.16em] text-[var(--color-text)]">Strengths</h3>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--color-muted)]">
                  {strengths.map((strength) => (
                    <li key={strength} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-text)]" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="portfolio-panel rounded-2xl p-5">
                <h3 className="text-sm font-black uppercase tracking-[0.16em] text-[var(--color-text)]">Current Focus</h3>
                <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted)]">
                  {bio.expanded?.recent || leadership || "AI products, cloud-backed apps, and practical portfolio systems."}
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  logLinkClick("projects");
                  scrollToSection("projects", { offset: 88 });
                }}
                className="portfolio-primary-button inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold"
              >
                View Projects
                <FaArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  logLinkClick("contact");
                  scrollToSection("contact", { offset: 88 });
                }}
                className="portfolio-secondary-button inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold"
              >
                Contact
              </button>
            </motion.div>
          </div>

          <div className="grid gap-4 lg:sticky lg:top-24">
            <motion.aside variants={itemVariants} className="portfolio-panel overflow-hidden rounded-2xl">
              <div className="relative aspect-[4/5] bg-[var(--color-surface-muted)] sm:aspect-[5/4] lg:aspect-[4/5]">
                {imageUrl && !imgFailed ? (
                  <img
                    src={imageUrl}
                    alt="Deepak S"
                    loading="lazy"
                    onError={() => setImgFailed(true)}
                    className="h-full w-full object-cover grayscale"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-300 text-7xl font-black text-zinc-700 dark:from-zinc-900 dark:to-zinc-700 dark:text-zinc-200">
                    D
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/78 to-transparent p-5 text-white">
                  <h3 className="text-2xl font-black">Deepak S</h3>
                  <p className="mt-1 text-sm text-white/72">AI & Data Science student - Full-stack builder</p>
                </div>
              </div>
            </motion.aside>

            <motion.div variants={itemVariants} className="grid gap-3 sm:grid-cols-2">
              <a
                href="mailto:deepakofficial0103@gmail.com"
                onClick={() => logLinkClick("email")}
                className="portfolio-panel rounded-2xl p-4 text-sm text-[var(--color-muted)] transition-transform hover:-translate-y-1"
              >
                <FaEnvelope className="mb-3 h-4 w-4 text-[var(--color-text)]" />
                <span className="break-all">deepakofficial0103@gmail.com</span>
              </a>
              <div className="portfolio-panel rounded-2xl p-4 text-sm text-[var(--color-muted)]">
                <FaMapMarkerAlt className="mb-3 h-4 w-4 text-[var(--color-text)]" />
                <span>Chennai, India</span>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div variants={itemVariants} className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cards.slice(0, 4).map((card, index) => (
            <HighlightCard key={card.id || card.title} card={card} index={index} />
          ))}
        </motion.div>

        <motion.div variants={itemVariants} className="portfolio-panel mt-3 rounded-2xl p-5">
          <h3 className="text-sm font-black uppercase tracking-[0.16em] text-[var(--color-text)]">Interests</h3>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
            {interests || "Computer Vision, NLP, Cloud AI, MLOps, full-stack systems, and product design."}
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
