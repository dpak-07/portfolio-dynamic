"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import {
  FaAws,
  FaCode,
  FaDatabase,
  FaDocker,
  FaFigma,
  FaGitAlt,
  FaGithub,
  FaJava,
  FaLinux,
  FaMobileAlt,
  FaNodeJs,
  FaPython,
  FaReact,
  FaServer,
  FaTools,
} from "react-icons/fa";
import {
  SiAndroid,
  SiBootstrap,
  SiC,
  SiCss3,
  SiCplusplus,
  SiDart,
  SiDjango,
  SiExpress,
  SiFastapi,
  SiFirebase,
  SiFlask,
  SiFlutter,
  SiHtml5,
  SiIos,
  SiJavascript,
  SiKeras,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNumpy,
  SiOpencv,
  SiPandas,
  SiPostgresql,
  SiPostman,
  SiPytorch,
  SiReact,
  SiScikitlearn,
  SiSpringboot,
  SiSqlite,
  SiTailwindcss,
  SiTensorflow,
  SiTypescript,
  SiVite,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import { useFirestoreData } from "@/hooks/useFirestoreData";
import { logSectionView } from "../utils/analytics";

const CATEGORY_META = [
  {
    title: "Programming Languages",
    Icon: FaCode,
    summary: "Core languages I use to build apps, APIs, automation, and data workflows.",
  },
  {
    title: "Frontend & Mobile Development",
    Icon: FaMobileAlt,
    summary: "Responsive interfaces and cross-platform app experiences.",
  },
  {
    title: "Backend Development",
    Icon: FaServer,
    summary: "APIs, services, server-side logic, and production application layers.",
  },
  {
    title: "Databases",
    Icon: FaDatabase,
    summary: "Relational, document, and Firebase-backed data storage.",
  },
  {
    title: "Cloud & DevOps",
    Icon: FaDocker,
    summary: "Deployment, source control, cloud hosting, and local engineering workflow.",
  },
  {
    title: "AI & Machine Learning",
    Icon: SiTensorflow,
    summary: "Modeling, computer vision, data processing, and ML experimentation.",
  },
  {
    title: "Design & Productivity",
    Icon: FaTools,
    summary: "Design, API testing, and daily development tooling.",
  },
];

const CATEGORY_TITLES = new Set(CATEGORY_META.map((category) => category.title));

const CATEGORY_ALIASES = {
  languages: "Programming Languages",
  "programming languages": "Programming Languages",
  frontend: "Frontend & Mobile Development",
  "frontend development": "Frontend & Mobile Development",
  "frontend & tools": "Frontend & Mobile Development",
  mobile: "Frontend & Mobile Development",
  "mobile development": "Frontend & Mobile Development",
  backend: "Backend Development",
  "backend development": "Backend Development",
  databases: "Databases",
  database: "Databases",
  "cloud & devops": "Cloud & DevOps",
  devops: "Cloud & DevOps",
  "ai & ml": "AI & Machine Learning",
  "ai & machine learning": "AI & Machine Learning",
  tools: "Design & Productivity",
  "design & productivity": "Design & Productivity",
};

const PREFERRED_CATEGORY_BY_TECH = {
  html: "Frontend & Mobile Development",
  html5: "Frontend & Mobile Development",
  css: "Frontend & Mobile Development",
  css3: "Frontend & Mobile Development",
  react: "Frontend & Mobile Development",
  reactjs: "Frontend & Mobile Development",
  nextjs: "Frontend & Mobile Development",
  reactnative: "Frontend & Mobile Development",
  flutter: "Frontend & Mobile Development",
  tailwindcss: "Frontend & Mobile Development",
  bootstrap: "Frontend & Mobile Development",
  vite: "Frontend & Mobile Development",
  android: "Frontend & Mobile Development",
  ios: "Frontend & Mobile Development",
  nodejs: "Backend Development",
  express: "Backend Development",
  expressjs: "Backend Development",
  flask: "Backend Development",
  django: "Backend Development",
  fastapi: "Backend Development",
  springboot: "Backend Development",
  mongodb: "Databases",
  mysql: "Databases",
  sqlite: "Databases",
  postgresql: "Databases",
  firebase: "Databases",
  firestore: "Databases",
  awsec2: "Cloud & DevOps",
  awss3: "Cloud & DevOps",
  aws: "Cloud & DevOps",
  docker: "Cloud & DevOps",
  git: "Cloud & DevOps",
  github: "Cloud & DevOps",
  linux: "Cloud & DevOps",
  tensorflow: "AI & Machine Learning",
  pytorch: "AI & Machine Learning",
  opencv: "AI & Machine Learning",
  keras: "AI & Machine Learning",
  numpy: "AI & Machine Learning",
  pandas: "AI & Machine Learning",
  scikitlearn: "AI & Machine Learning",
  vscode: "Design & Productivity",
  figma: "Design & Productivity",
  postman: "Design & Productivity",
};

const ICON_BY_TECH = {
  python: FaPython,
  c: SiC,
  cplusplus: SiCplusplus,
  java: FaJava,
  javascript: SiJavascript,
  typescript: SiTypescript,
  dart: SiDart,
  html: SiHtml5,
  html5: SiHtml5,
  css: SiCss3,
  css3: SiCss3,
  react: FaReact,
  reactjs: FaReact,
  nextjs: SiNextdotjs,
  reactnative: SiReact,
  flutter: SiFlutter,
  tailwindcss: SiTailwindcss,
  bootstrap: SiBootstrap,
  vite: SiVite,
  android: SiAndroid,
  ios: SiIos,
  nodejs: FaNodeJs,
  express: SiExpress,
  expressjs: SiExpress,
  flask: SiFlask,
  django: SiDjango,
  fastapi: SiFastapi,
  springboot: SiSpringboot,
  mongodb: SiMongodb,
  mysql: SiMysql,
  sqlite: SiSqlite,
  postgresql: SiPostgresql,
  firebase: SiFirebase,
  firestore: SiFirebase,
  awsec2: FaAws,
  awss3: FaAws,
  aws: FaAws,
  docker: FaDocker,
  git: FaGitAlt,
  github: FaGithub,
  linux: FaLinux,
  tensorflow: SiTensorflow,
  pytorch: SiPytorch,
  opencv: SiOpencv,
  keras: SiKeras,
  numpy: SiNumpy,
  pandas: SiPandas,
  scikitlearn: SiScikitlearn,
  vscode: VscVscode,
  figma: FaFigma,
  postman: SiPostman,
};

const PROFICIENCY_BY_CATEGORY = {
  "Programming Languages": 86,
  "Frontend & Mobile Development": 91,
  "Backend Development": 84,
  Databases: 80,
  "Cloud & DevOps": 78,
  "AI & Machine Learning": 82,
  "Design & Productivity": 88,
};

function normalizeKey(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\+\+/g, "plusplus")
    .replace(/#/g, "sharp")
    .replace(/[^a-z0-9]/g, "");
}

function normalizeTitle(title) {
  const key = String(title || "").trim().toLowerCase();
  return CATEGORY_ALIASES[key] || String(title || "").trim();
}

function formatTool(tool) {
  const cleaned = String(tool || "").trim();
  const byKey = {
    html: "HTML5",
    css: "CSS3",
    react: "React.js",
    nextjs: "Next.js",
    express: "Express.js",
    aws: "AWS",
    vscode: "VS Code",
    scikitlearn: "Scikit-learn",
  };
  return byKey[normalizeKey(cleaned)] || cleaned;
}

function normalizeCategories(firestoreData) {
  const source = Array.isArray(firestoreData?.techStackData) ? firestoreData.techStackData : [];
  const grouped = new Map(CATEGORY_META.map((category) => [category.title, []]));
  const seen = new Set();

  source.forEach((category) => {
    const sourceTitle = normalizeTitle(category?.title);
    const tools = Array.isArray(category?.tech) ? category.tech : [];

    tools.forEach((tool) => {
      const label = formatTool(tool);
      const key = normalizeKey(label);
      if (!key || seen.has(key)) return;

      const preferredTitle = PREFERRED_CATEGORY_BY_TECH[key] || (CATEGORY_TITLES.has(sourceTitle) ? sourceTitle : "Design & Productivity");
      if (!grouped.has(preferredTitle)) grouped.set(preferredTitle, []);

      const Icon = ICON_BY_TECH[key] || FaCode;
      grouped.get(preferredTitle).push({ label, key, Icon });
      seen.add(key);
    });
  });

  return CATEGORY_META.map((meta) => ({
    ...meta,
    tools: grouped.get(meta.title) || [],
    proficiency: PROFICIENCY_BY_CATEGORY[meta.title] || 78,
  })).filter((category) => category.tools.length > 0);
}

function StatusState({ sectionRef, error }) {
  return (
    <section id="tech-stack" ref={sectionRef} className="relative overflow-hidden px-4 py-20 scroll-mt-24 sm:px-6 lg:px-8">
      <div className="portfolio-panel mx-auto max-w-3xl rounded-2xl p-6 text-center sm:p-8">
        <FaCode className="mx-auto mb-3 h-8 w-8 text-[var(--color-accent-strong)]" />
        <h2 className="portfolio-gradient-text text-3xl font-black">Skills Showcase</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--color-muted)]">
          {error || "Tech stack data is being prepared."}
        </p>
      </div>
    </section>
  );
}

export default function SkillsSection() {
  const sectionRef = useRef(null);
  const loggedOnce = useRef(false);
  const inView = useInView(sectionRef, { once: true, amount: 0.14, margin: "-80px" });
  const { data: firestoreData, loading, error } = useFirestoreData("techStack", "categories");
  const categories = useMemo(() => normalizeCategories(firestoreData), [firestoreData]);
  const totalTools = useMemo(() => new Set(categories.flatMap((category) => category.tools.map((tool) => tool.key))).size, [categories]);

  useEffect(() => {
    if (inView && !loggedOnce.current) {
      logSectionView("tech-stack");
      loggedOnce.current = true;
    }
  }, [inView]);

  if (loading && !firestoreData) {
    return (
      <section id="tech-stack" ref={sectionRef} className="relative overflow-hidden px-4 py-20 scroll-mt-24 sm:px-6 lg:px-8">
        <div className="portfolio-panel mx-auto flex min-h-64 max-w-5xl items-center justify-center rounded-2xl p-8">
          <div className="flex items-center gap-3 text-sm font-medium text-[var(--color-muted)]">
            <motion.span
              className="h-5 w-5 rounded-full border-2 border-[var(--color-border-strong)] border-t-[var(--color-text)]"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            Loading skills
          </div>
        </div>
      </section>
    );
  }

  if (error || categories.length === 0) {
    return <StatusState sectionRef={sectionRef} error={error} />;
  }

  return (
    <section
      id="tech-stack"
      ref={sectionRef}
      aria-labelledby="skills-title"
      className="relative overflow-hidden px-4 py-16 scroll-mt-24 sm:px-6 lg:px-8 lg:py-24"
    >
      <motion.div
        className="mx-auto max-w-7xl"
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="mb-10 grid gap-5 lg:grid-cols-[0.9fr_0.55fr] lg:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-faint)]">
              <FaCode className="h-3.5 w-3.5" />
              Skills Showcase
            </div>
            <h2 id="skills-title" className="portfolio-gradient-text text-4xl font-extrabold leading-tight sm:text-5xl">
              Clean, focused tech stack
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
              A deduplicated view of my strongest tools across web, mobile, backend, cloud, AI, and product work.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:max-w-sm lg:ml-auto">
            <div className="portfolio-panel rounded-2xl p-4">
              <div className="text-3xl font-black text-[var(--color-text)]">{categories.length}</div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-faint)]">Categories</div>
            </div>
            <div className="portfolio-panel rounded-2xl p-4">
              <div className="text-3xl font-black text-[var(--color-text)]">{totalTools}</div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-faint)]">Unique Tools</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category, categoryIndex) => {
            const CategoryIcon = category.Icon;

            return (
              <motion.article
                key={category.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: categoryIndex * 0.04, duration: 0.32 }}
                whileHover={{ y: -6 }}
                className="portfolio-panel group flex min-h-[23rem] flex-col rounded-2xl p-5 transition-shadow hover:shadow-[var(--shadow-elevated)]"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-strong)] text-[var(--color-text)] shadow-sm">
                    <CategoryIcon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-2.5 py-1 text-xs font-bold text-[var(--color-muted)]">
                    {category.tools.length} tools
                  </span>
                </div>

                <h3 className="text-lg font-black leading-tight text-[var(--color-text)]">{category.title}</h3>
                <p className="mt-2 min-h-[3rem] text-sm leading-relaxed text-[var(--color-muted)]">{category.summary}</p>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-faint)]">
                    <span>Proficiency</span>
                    <span>{category.proficiency}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-muted)]">
                    <motion.div
                      className="h-full rounded-full bg-[var(--color-text)]"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${category.proficiency}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.08 * categoryIndex }}
                    />
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  {category.tools.map((tool, toolIndex) => {
                    const ToolIcon = tool.Icon;
                    return (
                      <motion.div
                        key={tool.key}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: toolIndex * 0.025 }}
                        className="flex min-h-11 items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 text-[var(--color-text)] transition-colors group-hover:bg-[var(--color-bg-strong)]"
                      >
                        <ToolIcon className="h-4 w-4 shrink-0 text-[var(--color-muted)]" />
                        <span className="min-w-0 break-words text-xs font-bold leading-tight">{tool.label}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.article>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
