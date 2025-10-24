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

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(true);
  const [showResume, setShowResume] = useState(false);
  const sectionRef = useRef(null);

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
    if (!profileData?.resumeDriveLink) return { preview: "", download: "" };
    return getDriveLinks(profileData.resumeDriveLink);
  }, [profileData?.resumeDriveLink]);

  // ✅ Fade-in trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

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
      <div className="w-full h-screen flex items-center justify-center bg-black text-white">
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
      className={`relative w-full min-h-screen flex flex-col items-center justify-center text-white overflow-hidden px-4 sm:px-6 lg:px-8 transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
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

        {/* Roles */}
        <motion.p
          className="text-lg sm:text-xl md:text-2xl text-white/80 mb-4 sm:mb-6 max-w-2xl mx-auto px-4"
          variants={itemVariants}
        >
          {profileData.roles}
        </motion.p>

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
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full max-w-2xl mx-auto mb-6 sm:mb-8 px-4"
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
            className="w-full sm:w-auto bg-cyansoft text-black px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-cyan-300 hover:scale-105 transition-all text-center min-w-[140px]"
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
            className="w-full sm:w-auto border border-white/20 text-white/90 px-6 py-3 rounded-full font-medium hover:border-cyansoft hover:bg-white/10 transition-all text-center min-w-[140px]"
          >
            Contact
          </a>

          <button
            onClick={() => setShowResume(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-cyansoft text-black px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-cyan-300 hover:scale-105 transition-all min-w-[140px]"
          >
            <FaFileAlt className="w-4 h-4" /> Open Resume
          </button>

          <a
            href={download}
            download
            className="w-full sm:w-auto flex items-center justify-center gap-2 border border-white/20 text-white/90 px-6 py-3 rounded-full font-medium hover:border-cyansoft hover:bg-white/10 transition-all min-w-[140px]"
          >
            <FaDownload className="w-4 h-4" /> Download
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
                className="text-white/80 hover:text-cyansoft transition-all transform hover:scale-110"
              >
                <Icon className="w-6 h-6" />
              </a>
            );
          })}
        </motion.div>
      </motion.div>

      {/* ===== Explore More Button (Bottom) ===== */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
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

      {/* ===== Resume Modal ===== */}
      {showResume && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-md">
          <motion.button
            onClick={() => setShowResume(false)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white hover:text-cyansoft transition-all z-10 bg-black/50 rounded-full p-2"
            whileHover={{ scale: 1.2 }}
          >
            <FaTimes className="w-6 h-6" />
          </motion.button>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-4xl lg:max-w-5xl h-[80vh] bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl mx-4"
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