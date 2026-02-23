"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Eye,
  Download,
  FileText,
  X,
  Briefcase,
  Award,
  Code,
  Star,
} from "lucide-react";
import { useFirestoreData } from "@/hooks/useFirestoreData";
import { logSectionView, logLinkClick, logDownload, logResumeOpen } from "../utils/analytics";
import { getResumeLinks } from "@/utils/urlHelpers";

export default function Resume() {
  const [isOpen, setIsOpen] = useState(false);
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (sectionInView) {
      logSectionView("resume");
    }
  }, [sectionInView]);

  const { data: resumeData, loading, error } = useFirestoreData("resume", "data");

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    try {
      const date = new Date(dateString.replace?.(" ", "T") || dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (err) {
      return dateString;
    }
  };

  const { preview: embedLink, download: downloadLink } = getResumeLinks(
    resumeData?.resumeDriveLink
  );

  const handleViewResume = () => {
    setIsOpen(true);
    logResumeOpen();
    logLinkClick("view_resume");
  };

  const handleDownload = () => {
    logDownload("resume");
    logLinkClick("download_resume");
  };

  if (loading) {
    return (
      <section
        id="resume"
        ref={sectionRef}
        className="relative min-h-screen py-20 px-6 flex items-center justify-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <FileText className="w-16 h-16 text-cyan-400" />
        </motion.div>
      </section>
    );
  }

  if (error || !resumeData) {
    return (
      <section
        id="resume"
        ref={sectionRef}
        className="relative min-h-screen py-20 px-6 flex items-center justify-center"
      >
        <div className="text-center">
          <p className="text-red-400 text-xl">Failed to load resume</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="resume"
      ref={sectionRef}
      className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8 overflow-hidden scroll-mt-20"
    >
      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.h2
            className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-4 sm:mb-6 px-4"
            animate={{
              backgroundImage: [
                "linear-gradient(to right, #06b6d4, #8b5cf6)",
                "linear-gradient(to right, #8b5cf6, #06b6d4)",
                "linear-gradient(to right, #06b6d4, #8b5cf6)",
              ],
            }}
            transition={{ duration: 5, repeat: Infinity }}
            style={{
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            My Resume
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-4"
          >
            {resumeData?.description || "Explore my professional journey and skills"}
          </motion.p>
        </motion.div>

        {/* Resume Cards Grid - Centered */}
        <div className="flex justify-center mb-12 sm:mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl w-full px-4">
            {/* Skills Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-75 blur transition duration-500" />
              <div className="relative bg-slate-800/50 backdrop-blur-xl border border-purple-400/20 rounded-3xl p-6 sm:p-8 h-full">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Code className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2 mt-4">
                  {(resumeData?.skills || ["React", "Node.js", "Python", "JavaScript", "TypeScript", "CSS"]).slice(0, 6).map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 sm:px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs sm:text-sm border border-purple-400/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Achievements Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-3xl opacity-0 group-hover:opacity-75 blur transition duration-500" />
              <div className="relative bg-slate-800/50 backdrop-blur-xl border border-orange-400/20 rounded-3xl p-6 sm:p-8 h-full">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Award className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Achievements</h3>
                <p className="text-sm sm:text-base text-gray-300">
                  {resumeData?.achievements || "Multiple awards and certifications"}
                </p>
                <div className="mt-4 flex items-center gap-2 text-orange-400">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm font-semibold">Recognized</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Action Buttons - Mobile Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4"
        >
          <motion.button
            onClick={handleViewResume}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-base sm:text-lg rounded-xl overflow-hidden shadow-lg shadow-cyan-500/50"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <span className="relative flex items-center justify-center gap-2 sm:gap-3">
              <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
              View Resume
            </span>
          </motion.button>

          {downloadLink && (
            <motion.a
              href={downloadLink}
              onClick={handleDownload}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-base sm:text-lg rounded-xl overflow-hidden shadow-lg shadow-purple-500/50"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 }}
              />
              <span className="relative flex items-center justify-center gap-2 sm:gap-3">
                <Download className="w-5 h-5 sm:w-6 sm:h-6" />
                Download PDF
              </span>
            </motion.a>
          )}
        </motion.div>
      </div>

      {/* Resume Modal - Mobile Optimized */}
      <AnimatePresence>
        {isOpen && embedLink && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/90 z-[9998] backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-2 sm:p-4"
            >
              <motion.button
                onClick={() => setIsOpen(false)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-2 right-2 sm:top-6 sm:right-6 text-white hover:text-cyan-400 transition-all z-[10000] bg-black/80 hover:bg-black rounded-full p-3 sm:p-4 border border-white/20 hover:border-cyan-400"
              >
                <X className="w-6 h-6 sm:w-8 sm:h-8" />
              </motion.button>
              <iframe
                src={embedLink}
                className="w-full max-w-5xl h-[85vh] sm:h-[80vh] rounded-xl sm:rounded-2xl shadow-2xl border-2 border-cyan-400/30"
                title="Resume Preview"
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
