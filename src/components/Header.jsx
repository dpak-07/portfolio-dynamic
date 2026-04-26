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
} from "react-icons/fa";
import { useRef, useState, useEffect, useMemo } from "react";
import { useFirestoreData } from "@/hooks/useFirestoreData";
import { useResumeResource } from "@/hooks/useResumeResource";
import { logSectionView, logLinkClick, logDownload, logResumeOpen } from "../utils/analytics";
import { scrollToSection } from "@/utils/scrollToSection";

export default function Header() {
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

  const { preview, download } = useResumeResource(profileData?.resumeDriveLink);

  const processedRoles = useMemo(() => {
    if (!profileData?.roles) {
      return { first2: "", remaining: "", hasMore: false, full: "" };
    }

    const rolesArray = profileData.roles
      .split("•")
      .map((role) => role.trim())
      .filter(Boolean);

    return {
      first2: rolesArray.slice(0, 2).join(" • "),
      remaining: rolesArray.slice(2).join(" • "),
      hasMore: rolesArray.length > 2,
      full: rolesArray.join(" • "),
    };
  }, [profileData?.roles]);

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.25, duration: 1, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } },
  };

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
          animate={{ rotate: 360 }}
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
      className="relative flex min-h-screen w-full scroll-mt-24 flex-col items-center justify-center overflow-hidden text-white"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.22),transparent_35%),linear-gradient(135deg,rgba(9,16,28,0.65),rgba(2,6,23,0.96))]" />
        <div className="absolute -top-40 left-0 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[180px] animate-[heroFloatA_20s_ease-in-out_infinite]" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-blue-500/25 blur-[160px] animate-[heroFloatB_18s_ease-in-out_infinite]" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-400/15 blur-[200px] animate-[heroFloatC_22s_ease-in-out_infinite]" />
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(34,211,238,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.06)_1px,transparent_1px)] [background-size:72px_72px] animate-[heroGrid_20s_linear_infinite]" />

        <style jsx="true">{`
          @keyframes heroFloatA {
            0%,
            100% {
              transform: translate3d(0, 0, 0) scale(1);
            }
            50% {
              transform: translate3d(38px, -42px, 0) scale(1.1);
            }
          }

          @keyframes heroFloatB {
            0%,
            100% {
              transform: translate3d(0, 0, 0) scale(1);
            }
            50% {
              transform: translate3d(-50px, 32px, 0) scale(1.16);
            }
          }

          @keyframes heroFloatC {
            0%,
            100% {
              transform: translate3d(-50%, -50%, 0) scale(1);
            }
            50% {
              transform: translate3d(calc(-50% + 40px), calc(-50% - 26px), 0) scale(1.1);
            }
          }

          @keyframes heroGrid {
            0% {
              background-position: 0 0, 0 0;
            }
            100% {
              background-position: 72px 72px, 72px 72px;
            }
          }
        `}</style>
      </div>

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-4 text-center sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="mb-4 text-4xl font-extrabold leading-tight text-cyansoft drop-shadow-lg sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl"
          variants={itemVariants}
        >
          Hi, I&apos;m {profileData.name}
        </motion.h1>

        <motion.div className="mb-4 max-w-5xl px-4 sm:mb-6" variants={itemVariants}>
          <div className="block sm:hidden">
            <p className="text-center text-base text-white/80">
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
            className="hidden overflow-x-auto whitespace-nowrap text-base text-white/80 sm:block sm:text-lg md:text-xl"
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
          className="mb-6 h-[28px] max-w-2xl px-4 font-mono text-sm text-white/60 sm:mb-8 sm:h-[32px] sm:text-base md:text-lg"
          variants={itemVariants}
        >
          <Typewriter
            words={profileData.typewriterLines || []}
            loop={0}
            cursor
            cursorStyle="|"
            typeSpeed={50}
            deleteSpeed={30}
            delaySpeed={1800}
          />
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
            className="flex-1 whitespace-nowrap rounded-full bg-cyansoft px-5 py-2.5 text-center text-sm font-semibold text-black shadow-lg transition-all hover:scale-105 hover:bg-cyan-300 sm:flex-none sm:text-base"
          >
            View Projects
          </a>

          <a
            href="#contact"
            onClick={(event) => {
              event.preventDefault();
              scrollToSection("contact", { offset: 88 });
            }}
            className="flex-1 whitespace-nowrap rounded-full border border-white/20 px-5 py-2.5 text-center text-sm font-medium text-white/90 transition-all hover:border-cyansoft hover:bg-white/10 sm:flex-none sm:text-base"
          >
            Contact
          </a>

          <button
            onClick={handleOpenResume}
            className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-cyansoft px-5 py-2.5 text-sm font-semibold text-black shadow-lg transition-all hover:scale-105 hover:bg-cyan-300 sm:flex-none sm:text-base"
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
            className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white/90 transition-all sm:flex-none sm:text-base ${
              download ? "hover:border-cyansoft hover:bg-white/10" : "pointer-events-none opacity-50"
            }`}
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
                className="text-white/80 transition-all hover:scale-110 hover:text-cyansoft"
              >
                <Icon className="h-6 w-6" />
              </a>
            );
          })}
        </motion.div>

        <motion.div className="mt-12 flex w-full justify-center sm:mt-16" variants={itemVariants}>
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
        </motion.div>
      </motion.div>

      {showResume && preview && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setShowResume(false);
            }
          }}
        >
          <motion.button
            onClick={() => setShowResume(false)}
            className="absolute right-4 top-4 z-[10000] rounded-full border border-white/20 bg-black/80 p-3 text-white transition-all hover:border-cyansoft hover:bg-black hover:text-cyansoft sm:right-6 sm:top-6"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaTimes className="h-6 w-6" />
          </motion.button>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mx-4 h-[80vh] w-full max-w-4xl overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] shadow-2xl lg:max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <iframe src={preview} className="h-full w-full rounded-xl" title="Resume" />
          </motion.div>
        </div>
      )}
    </header>
  );
}
