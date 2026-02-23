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
import { useInView } from "framer-motion";
import { logSectionView, logLinkClick, logDownload } from "../utils/analytics";


// ✅ Helper — Converts Google Drive URL → Preview & Download URLs
const getDriveLinks = (url) => {
  if (!url) return { preview: "", download: "" };
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)\//);
  if (!match) return { preview: url, download: url };
  const fileId = match[1];
  return {
    preview: `https://drive.google.com/file/d/${fileId}/preview`,
    download: `https://drive.google.com/uc?export=download&id=${fileId}`,
  };
};

export default function Header() {
  // 🔥 Fetch profile data from Firestore
  const { data: firestoreProfileData, loading: firestoreLoading, error: firestoreError } = useFirestoreData('portfolio', 'profile');
  const { data: resumeDocData } = useFirestoreData("resume", "data");

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(true);
  const [showResume, setShowResume] = useState(false);
  const [showAllRoles, setShowAllRoles] = useState(false);
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const loggedOnce = useRef(false);

  useEffect(() => {
    if (!loggedOnce.current) {
      logSectionView("home");
      loggedOnce.current = true;
    }
  }, []);


  // ✅ Update profile data from Firestore
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

  // ✅ Drive links (memoized)
  const { preview, download } = useMemo(() => {
    const sourceResumeLink = resumeDocData?.resumeDriveLink || profileData?.resumeDriveLink;
    if (!sourceResumeLink) return { preview: "", download: "" };
    return getDriveLinks(sourceResumeLink);
  }, [resumeDocData?.resumeDriveLink, profileData?.resumeDriveLink]);

  // ✅ Fade-in trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // ✅ Process roles for mobile display
  const processedRoles = useMemo(() => {
    if (!profileData?.roles) return { first2: "", remaining: "", hasMore: false };

    const rolesArray = profileData.roles.split("•").map(role => role.trim()).filter(Boolean);
    const first2 = rolesArray.slice(0, 2).join(" • ");
    const remaining = rolesArray.slice(2).join(" • ");

    return {
      first2,
      remaining,
      hasMore: rolesArray.length > 2,
      full: profileData.roles
    };
  }, [profileData?.roles]);

  // ✅ Animation variants
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

  // ✅ Map of social icons
  const iconMap = {
    github: FaGithub,
    linkedin: FaLinkedin,
    email: FaEnvelope,
    instagram: FaInstagram,
    twitter: FaTwitter,
    website: FaGlobe,
  };

  // 🌀 Loading Spinner
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white">
        <motion.div
          className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
      </div>
    );
  }

  // ❌ Error State
  if (error || !profileData) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-red-400 text-lg">
        Error: {error || "No profile data found."}
      </div>
    );
  }

  // ✅ Filter socials
  const validSocials = Object.entries(profileData.socials || {}).filter(
    ([, url]) => url && typeof url === "string" && url.trim() !== ""
  );
  const allSocials =
    validSocials.length > 0
      ? validSocials
      : [["website", profileData.socials?.website || ""]];

  return (
    <header
      id="home"
      ref={sectionRef}
      className={`relative w-full min-h-screen flex flex-col items-center justify-center text-white overflow-hidden transition-opacity duration-700 ${visible ? "opacity-100" : "opacity-0"
        }`}
    >
      {/* 🌈 Animated Gradient Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-800/40 via-black to-blue-900/30 animate-gradientShift"></div>
        <div className="absolute -top-40 left-0 w-[500px] h-[500px] bg-cyan-500/20 blur-[180px] rounded-full animate-blob1"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/25 blur-[160px] rounded-full animate-blob2"></div>
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-teal-400/15 blur-[200px] rounded-full animate-blob3"></div>

        <style jsx="true">{`
          @keyframes gradientShift {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          @keyframes blob1 {
            0% {
              transform: translate(0, 0) scale(1);
            }
            50% {
              transform: translate(30px, -40px) scale(1.1);
            }
            100% {
              transform: translate(0, 0) scale(1);
            }
          }
          @keyframes blob2 {
            0% {
              transform: translate(0, 0) scale(1);
            }
            50% {
              transform: translate(-50px, 40px) scale(1.2);
            }
            100% {
              transform: translate(0, 0) scale(1);
            }
          }
          @keyframes blob3 {
            0% {
              transform: translate(-20px, 20px) scale(1);
            }
            50% {
              transform: translate(40px, -20px) scale(1.15);
            }
            100% {
              transform: translate(-20px, 20px) scale(1);
            }
          }
          .animate-gradientShift {
            background-size: 200% 200%;
            animation: gradientShift 12s ease-in-out infinite;
          }
          .animate-blob1 {
            animation: blob1 20s ease-in-out infinite;
          }
          .animate-blob2 {
            animation: blob2 18s ease-in-out infinite;
          }
          .animate-blob3 {
            animation: blob3 22s ease-in-out infinite;
          }
        `}</style>
      </div>

      {/* ========================== MAIN CONTENT =========================== */}
      <motion.div
        className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Name */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-cyansoft drop-shadow-lg leading-tight mb-4 sm:mb-6"
          variants={itemVariants}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          Hi, I'm {profileData.name}
        </motion.h1>

        {/* Roles - Mobile: First 2, Desktop: All */}
        <motion.div
          className="mb-4 sm:mb-6 max-w-5xl mx-auto px-4"
          variants={itemVariants}
        >
          {/* Mobile View */}
          <div className="block sm:hidden">
            <p className="text-base text-white/80 text-center">
              {showAllRoles ? processedRoles.full : processedRoles.first2}
            </p>
            {processedRoles.hasMore && (
              <button
                onClick={() => setShowAllRoles(!showAllRoles)}
                className="mt-2 text-cyansoft text-sm font-medium hover:text-cyan-300 transition-colors underline"
              >
                {showAllRoles ? "Show Less" : "Read More"}
              </button>
            )}
          </div>

          {/* Desktop View */}
          <p
            className="hidden sm:block text-base sm:text-lg md:text-xl text-white/80 whitespace-nowrap overflow-x-auto"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <style jsx="true">{`
              p::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {processedRoles.full}
          </p>
        </motion.div>

        {/* Typewriter */}
        <motion.div
          className="text-sm sm:text-base md:text-lg text-white/60 font-mono h-[28px] sm:h-[32px] mb-6 sm:mb-8 max-w-2xl mx-auto px-4"
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

        {/* ==== Buttons Section ==== */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center w-full max-w-3xl mx-auto mb-6 sm:mb-8 px-4"
          variants={itemVariants}
        >
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("projects")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex-1 sm:flex-none bg-cyansoft text-black px-5 py-2.5 rounded-full font-semibold shadow-lg hover:bg-cyan-300 hover:scale-105 transition-all text-center text-sm sm:text-base whitespace-nowrap"
          >
            View Projects
          </a>

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex-1 sm:flex-none border border-white/20 text-white/90 px-5 py-2.5 rounded-full font-medium hover:border-cyansoft hover:bg-white/10 transition-all text-center text-sm sm:text-base whitespace-nowrap"
          >
            Contact
          </a>

          <button
            onClick={() => {
              logLinkClick("resume");
              setShowResume(true);
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-cyansoft text-black px-5 py-2.5 rounded-full font-semibold shadow-lg hover:bg-cyan-300 hover:scale-105 transition-all text-sm sm:text-base whitespace-nowrap"
          >
            <FaFileAlt className="w-3.5 h-3.5" /> Open Resume
          </button>

          <a
            href={download}
            download
            onClick={() => logDownload("resume")}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 border border-white/20 text-white/90 px-5 py-2.5 rounded-full font-medium hover:border-cyansoft hover:bg-white/10 transition-all text-sm sm:text-base whitespace-nowrap"
          >
            <FaDownload className="w-3.5 h-3.5" /> Download
          </a>
        </motion.div>

        {/* ===== Social Icons ===== */}
        <motion.div
          className="flex flex-wrap gap-4 sm:gap-6 justify-center items-center px-4"
          variants={itemVariants}
        >
          {allSocials.map(([key, url], idx) => {
            const Icon = iconMap[key] || FaGlobe;
            return (
              <a
                key={idx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => logLinkClick(key)}
                className="text-white/80 hover:text-cyansoft transition-all transform hover:scale-110"
              >
                <Icon className="w-6 h-6" />
              </a>
            );
          })}
        </motion.div>

        {/* ===== Explore More Button - Now inside main content for better centering ===== */}
        <motion.div
          className="mt-12 sm:mt-16 w-full flex justify-center"
          variants={itemVariants}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("about")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex flex-col items-center gap-2 text-cyansoft hover:text-cyan-300 transition-colors group"
          >
            <span className="text-sm font-medium opacity-75 group-hover:opacity-100">
              Explore More
            </span>
            <FaChevronDown className="w-5 h-5 group-hover:scale-125 transition-transform" />
          </button>
        </motion.div>
      </motion.div>

      {/* ===== Resume Modal ===== */}
      {showResume && (
        <div
          className="fixed inset-0 bg-black/90 z-[9999] flex flex-col items-center justify-center p-4 backdrop-blur-md"
          onClick={(e) => {
            // Close if clicking the backdrop
            if (e.target === e.currentTarget) {
              setShowResume(false);
            }
          }}
        >
          <motion.button
            onClick={() => setShowResume(false)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white hover:text-cyansoft transition-all z-[10000] bg-black/80 hover:bg-black rounded-full p-3 border border-white/20 hover:border-cyansoft"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaTimes className="w-6 h-6" />
          </motion.button>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-4xl lg:max-w-5xl h-[80vh] bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={preview}
              className="w-full h-full rounded-xl"
              title="Resume"
            ></iframe>
          </motion.div>
        </div>
      )}
    </header>
  );
}
