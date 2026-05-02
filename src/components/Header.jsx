"use client";

import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaDownload,
  FaFileAlt,
  FaTimes,
  FaInstagram,
  FaTwitter,
  FaGlobe,
  FaChevronDown,
  FaBookOpen,
} from "react-icons/fa";
import { useRef, useState, useEffect, useMemo } from "react";
import { useFirestoreData } from "@/hooks/useFirestoreData";
import { useResumeResource } from "@/hooks/useResumeResource";
import { useLightweightMotion } from "@/hooks/useLightweightMotion";
import { logSectionView, logLinkClick, logDownload, logResumeOpen } from "../utils/analytics";
import { scrollToSection } from "@/utils/scrollToSection";

export default function Header({ showBlogLink = false }) {
  const {
    data: firestoreProfileData,
    loading: firestoreLoading,
    error: firestoreError,
  } = useFirestoreData("portfolio", "profile");

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showResume, setShowResume] = useState(false);
  const [showAllRoles, setShowAllRoles] = useState(false);
  const sectionRef = useRef(null);
  const loggedOnce = useRef(false);
  const lightweightMotion = useLightweightMotion();

  useEffect(() => {
    if (!loggedOnce.current) {
      logSectionView("home");
      loggedOnce.current = true;
    }
  }, []);

  useEffect(() => {
    if (firestoreProfileData) {
      setProfileData(firestoreProfileData);
      setLoading(false);
    } else if (firestoreError) {
      setError(firestoreError);
      setLoading(false);
    } else if (firestoreLoading) {
      setLoading(true);
    }
  }, [firestoreProfileData, firestoreError, firestoreLoading]);

  const { preview, download } = useResumeResource();

  const processedRoles = useMemo(() => {
    if (!profileData?.roles) {
      return { first2: "", remaining: "", hasMore: false, full: "" };
    }

    const rolesArray = profileData.roles
      .split(/\s*(?:\u2022|\u00e2\u20ac\u00a2|\|)\s*/)
      .map((role) => role.trim())
      .filter(Boolean);

    return {
      first2: rolesArray.slice(0, 2).join(" / "),
      remaining: rolesArray.slice(2).join(" / "),
      hasMore: rolesArray.length > 2,
      full: rolesArray.join(" / "),
    };
  }, [profileData?.roles]);

  const containerVariants = useMemo(
    () =>
      lightweightMotion
        ? {
            hidden: { opacity: 1, y: 0 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.12 } },
          }
        : {
            hidden: { opacity: 0, y: 32 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.12, duration: 0.6, ease: "easeOut" },
            },
          },
    [lightweightMotion]
  );

  const itemVariants = useMemo(
    () =>
      lightweightMotion
        ? {
            hidden: { opacity: 1, y: 0 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.12 } },
          }
        : {
            hidden: { opacity: 0, y: 24 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
          },
    [lightweightMotion]
  );

  const iconMap = {
    github: FaGithub,
    linkedin: FaLinkedin,
    email: FaEnvelope,
    instagram: FaInstagram,
    twitter: FaTwitter,
    website: FaGlobe,
  };

  const validSocials = Object.entries(profileData?.socials || {}).filter(
    ([, url]) => url && typeof url === "string" && url.trim() !== ""
  );

  const allSocials =
    validSocials.length > 0
      ? validSocials
      : [["website", profileData?.socials?.website || ""]];
  const typewriterLines = profileData?.typewriterLines || [];

  const handleOpenResume = () => {
    if (!preview) {
      scrollToSection("resume", { offset: 88 });
      return;
    }

    logLinkClick("resume");
    logResumeOpen();
    setShowResume(true);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-white">
        <motion.div
          className="h-12 w-12 rounded-full border-4 border-cyan-400 border-t-transparent"
          animate={lightweightMotion ? undefined : { rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-lg text-red-400">
        Error: {error || "No profile data found."}
      </div>
    );
  }

  return (
    <header
      id="home"
      ref={sectionRef}
      className="relative flex min-h-[100svh] w-full scroll-mt-24 flex-col items-center justify-center overflow-hidden text-[var(--color-text)]"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(145deg, rgba(20,184,166,0.16), transparent 38%), linear-gradient(220deg, rgba(217,119,6,0.1), transparent 34%), linear-gradient(180deg, color-mix(in srgb, var(--color-bg) 82%, transparent), var(--color-bg-strong))",
          }}
        />
        <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(15,23,42,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.16)_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-teal-200/20 to-transparent" />
      </div>

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-4 text-center sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="mb-4 text-4xl font-extrabold leading-tight text-[var(--color-text)] drop-shadow-sm sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl"
          variants={itemVariants}
        >
          Hi, I&apos;m {profileData.name}
        </motion.h1>

        <motion.div className="mb-4 max-w-5xl px-4 sm:mb-6" variants={itemVariants}>
          <div className="block sm:hidden">
            <p className="text-center text-base text-[var(--color-muted)]">
              {showAllRoles ? processedRoles.full : processedRoles.first2}
            </p>
            {processedRoles.hasMore && (
              <button
                onClick={() => setShowAllRoles((prev) => !prev)}
                className="mt-2 text-sm font-medium text-cyansoft underline transition-colors hover:text-cyan-300"
              >
                {showAllRoles ? "Show Less" : "Read More"}
              </button>
            )}
          </div>

          <p
            className="hidden overflow-x-auto whitespace-nowrap text-base text-[var(--color-muted)] sm:block sm:text-lg md:text-xl"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style jsx="true">{`
              p::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {processedRoles.full}
          </p>
        </motion.div>

        <motion.div
          className="mb-6 h-[28px] max-w-2xl px-4 font-mono text-sm text-[var(--color-faint)] sm:mb-8 sm:h-[32px] sm:text-base md:text-lg"
          variants={itemVariants}
        >
          {lightweightMotion ? (
            <span>{typewriterLines[0] || ""}</span>
          ) : (
            <Typewriter
              words={typewriterLines}
              loop={0}
              cursor
              cursorStyle="|"
              typeSpeed={44}
              deleteSpeed={24}
              delaySpeed={2000}
            />
          )}
        </motion.div>

        <motion.div
          className="mx-auto mb-6 flex w-full max-w-3xl flex-col items-stretch justify-center gap-3 px-4 sm:mb-8 sm:flex-row sm:items-center"
          variants={itemVariants}
        >
          <a
            href="#projects"
            onClick={(event) => {
              event.preventDefault();
              scrollToSection("projects", { offset: 88 });
            }}
            className="flex-1 whitespace-nowrap rounded-lg bg-cyansoft px-5 py-2.5 text-center text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-950/15 transition-colors hover:bg-emerald-200 sm:flex-none sm:text-base"
          >
            View Projects
          </a>

          <a
            href="#contact"
            onClick={(event) => {
              event.preventDefault();
              scrollToSection("contact", { offset: 88 });
            }}
            className="flex-1 whitespace-nowrap rounded-lg border px-5 py-2.5 text-center text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-amber-200/10 sm:flex-none sm:text-base"
            style={{ borderColor: "var(--color-border-strong)" }}
          >
            Contact
          </a>

          <button
            onClick={handleOpenResume}
            className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-cyansoft px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-950/20 transition-colors hover:bg-emerald-200 sm:flex-none sm:text-base"
          >
            <FaFileAlt className="h-3.5 w-3.5" /> Open Resume
          </button>

          <a
            href={download}
            download
            onClick={(event) => {
              if (!download) {
                event.preventDefault();
                scrollToSection("resume", { offset: 88 });
                return;
              }

              logDownload("resume");
            }}
            className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-5 py-2.5 text-sm font-medium text-[var(--color-text)] transition-colors sm:flex-none sm:text-base ${
              download ? "hover:border-cyansoft hover:bg-white/10" : "pointer-events-none opacity-50"
            }`}
            style={{ borderColor: "var(--color-border-strong)" }}
          >
            <FaDownload className="h-3.5 w-3.5" /> Download
          </a>
        </motion.div>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 px-4 sm:gap-6"
          variants={itemVariants}
        >
          {allSocials.map(([key, url], index) => {
            const Icon = iconMap[key] || FaGlobe;
            return (
              <a
                key={`${key}-${index}`}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => logLinkClick(key)}
                className="text-[var(--color-muted)] transition-all hover:scale-110 hover:text-cyansoft"
              >
                <Icon className="h-6 w-6" />
              </a>
            );
          })}
        </motion.div>

        <motion.div className="mt-12 flex w-full justify-center sm:mt-16" variants={itemVariants}>
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={(event) => {
                event.preventDefault();
                scrollToSection("about", { offset: 88 });
              }}
              className="group flex flex-col items-center gap-2 text-cyansoft transition-colors hover:text-cyan-300"
            >
              <span className="text-sm font-medium opacity-75 transition-opacity group-hover:opacity-100">
                Explore More
              </span>
              <FaChevronDown className="h-5 w-5 transition-transform group-hover:scale-125" />
            </button>

            {showBlogLink && (
              <motion.a
                href="/blog"
                onClick={() => logLinkClick("header_blog")}
                initial={lightweightMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={lightweightMotion ? undefined : { y: -3, scale: 1.03 }}
                whileTap={lightweightMotion ? undefined : { scale: 0.97 }}
                className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface)]/80 px-5 py-3 text-sm font-bold text-[var(--color-text)] shadow-lg shadow-black/10 backdrop-blur-xl transition hover:border-cyansoft hover:text-cyansoft sm:text-base"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-teal-400 to-amber-300 text-slate-950 transition group-hover:scale-105">
                  <FaBookOpen className="h-3.5 w-3.5" />
                </span>
                Visit My Blog
              </motion.a>
            )}
          </div>
        </motion.div>
      </motion.div>

      {showResume && preview && (
        <div
          className="portfolio-modal-backdrop fixed inset-0 z-[9999] flex flex-col items-center justify-center px-3 pb-3 pt-20 sm:p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setShowResume(false);
            }
          }}
        >
          <motion.button
            onClick={() => setShowResume(false)}
            className="portfolio-secondary-button absolute right-4 top-20 z-[10000] rounded-full p-3 transition-all hover:border-cyansoft hover:text-cyansoft sm:right-6 sm:top-6"
            whileHover={lightweightMotion ? undefined : { scale: 1.1 }}
            whileTap={lightweightMotion ? undefined : { scale: 0.9 }}
          >
            <FaTimes className="h-6 w-6" />
          </motion.button>

          <motion.div
            initial={lightweightMotion ? { opacity: 1 } : { scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: lightweightMotion ? 0.12 : 0.4, ease: "easeOut" }}
            className="portfolio-modal-card h-[calc(100svh-6rem)] w-full max-w-4xl overflow-hidden rounded-lg shadow-2xl sm:h-[82svh] lg:max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <iframe src={preview} className="h-full w-full rounded-lg bg-white" title="Resume" />
          </motion.div>
        </div>
      )}
    </header>
  );
}
