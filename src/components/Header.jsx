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
} from "react-icons/fa";
import { useRef, useState, useEffect, useMemo } from "react";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

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
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(true);
  const [showResume, setShowResume] = useState(false);
  const sectionRef = useRef(null);

  // ✅ Fetch Firestore Data Once (no live listener)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "portfolio", "profile");
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setProfileData(snap.data());
        } else {
          throw new Error("Profile not found in Firestore.");
        }
      } catch (err) {
        console.error("❌ Firestore fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

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
      className={`relative w-full min-h-screen flex flex-col items-center justify-center text-white overflow-hidden px-5 py-16 sm:px-8 md:py-24 transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* 🌈 Animated Gradient Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-800/40 via-black to-blue-900/30 animate-gradientShift"></div>
        <div className="absolute -top-40 left-0 w-[500px] h-[500px] bg-cyan-500/20 blur-[180px] rounded-full animate-blob1"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/25 blur-[160px] rounded-full animate-blob2"></div>
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-teal-400/15 blur-[200px] rounded-full animate-blob3"></div>

        <style jsx>{`
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
        className="relative z-10 max-w-3xl w-full flex flex-col items-center text-center gap-6 sm:gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-cyansoft drop-shadow-lg leading-tight"
          variants={itemVariants}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          Hi, I'm {profileData.name}
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl md:text-2xl text-white/80"
          variants={itemVariants}
        >
          {profileData.roles}
        </motion.p>

        <motion.p
          className="text-sm sm:text-base md:text-lg text-white/60 font-mono h-[28px] sm:h-[32px]"
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
        </motion.p>

        {/* ==== Buttons Section ==== */}
        <motion.div
          className="mt-6 grid grid-cols-2 sm:flex sm:flex-row sm:flex-wrap gap-4 justify-center items-center w-full sm:w-auto"
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
            className="bg-cyansoft text-black px-5 py-3 rounded-full font-semibold shadow-lg hover:bg-cyan-300 hover:scale-105 transition-all text-center"
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
            className="border border-white/20 text-white/90 px-5 py-3 rounded-full font-medium hover:border-cyansoft hover:bg-white/10 transition-all text-center"
          >
            Contact
          </a>

          <button
            onClick={() => setShowResume(true)}
            className="flex items-center justify-center gap-2 bg-cyansoft text-black px-5 py-3 rounded-full font-semibold shadow-lg hover:bg-cyan-300 hover:scale-105 transition-all"
          >
            <FaFileAlt /> Open Resume
          </button>

          <a
            href={download}
            download
            className="flex items-center justify-center gap-2 border border-white/20 text-white/90 px-5 py-3 rounded-full font-medium hover:border-cyansoft hover:bg-white/10 transition-all"
          >
            <FaDownload /> Download
          </a>
        </motion.div>

        {/* ===== Social Icons ===== */}
        <motion.div
          className="flex flex-wrap gap-6 mt-6 justify-center"
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
                className="text-white/80 hover:text-cyansoft transition-all"
              >
                <Icon size={26} />
              </a>
            );
          })}
        </motion.div>
      </motion.div>

      {/* ===== Resume Modal ===== */}
      {showResume && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-md">
          <motion.button
            onClick={() => setShowResume(false)}
            className="absolute top-5 right-5 text-white hover:text-cyansoft transition-all"
            whileHover={{ scale: 1.2 }}
          >
            <FaTimes size={28} />
          </motion.button>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-5xl h-[80vh] bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl"
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
