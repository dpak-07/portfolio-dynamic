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
import { logSectionView, logLinkClick, logDownload, logResumeOpen } from "../utils/analytics";
import { useResumeResource } from "@/hooks/useResumeResource";

export default function Resume() {
  const [isOpen, setIsOpen] = useState(false);
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (sectionInView) {
      logSectionView("resume");
    }
  }, [sectionInView]);

  const { resumeData, loading, error, preview: embedLink, download: downloadLink } =
    useResumeResource();

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

  const handleViewResume = () => {
    if (!embedLink) return;
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
            className="portfolio-gradient-text mb-4 px-4 text-4xl font-black sm:mb-6 sm:text-5xl md:text-6xl"
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
            className="mx-auto max-w-2xl px-4 text-base text-[var(--color-muted)] sm:text-lg"
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
              <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-teal-400 to-amber-300 opacity-0 blur transition duration-500 group-hover:opacity-40" />
              <div className="portfolio-panel relative h-full rounded-lg p-6 sm:p-8">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 transition-transform group-hover:scale-105 sm:h-16 sm:w-16">
                  <Code className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-[var(--color-text)] sm:text-2xl">Skills</h3>
                <div className="flex flex-wrap gap-2 mt-4">
                  {(resumeData?.skills || ["React", "Node.js", "Python", "JavaScript", "TypeScript", "CSS"]).slice(0, 6).map((skill, i) => (
                    <span
                      key={i}
                      className="portfolio-chip rounded-md px-2.5 py-1 text-xs sm:px-3 sm:text-sm"
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
              <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 opacity-0 blur transition duration-500 group-hover:opacity-40" />
              <div className="portfolio-panel relative h-full rounded-lg p-6 sm:p-8">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 transition-transform group-hover:scale-105 sm:h-16 sm:w-16">
                  <Award className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-[var(--color-text)] sm:text-2xl">Achievements</h3>
                <p className="text-sm text-[var(--color-muted)] sm:text-base">
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
            disabled={!embedLink}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`group relative w-full overflow-hidden rounded-lg px-6 py-3 text-base font-bold shadow-lg sm:w-auto sm:px-8 sm:py-4 sm:text-lg ${
              embedLink
                ? "portfolio-primary-button"
                : "bg-slate-700/80 shadow-slate-900/30 cursor-not-allowed"
            }`}
          >
            {embedLink && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            )}
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
              className="portfolio-secondary-button group relative w-full overflow-hidden rounded-lg px-6 py-3 text-base font-bold shadow-lg sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
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
              className="portfolio-modal-backdrop fixed inset-0 z-[9998]"
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
                className="portfolio-secondary-button absolute right-2 top-2 z-[10000] rounded-full p-3 transition-all hover:border-cyan-400 hover:text-cyan-400 sm:right-6 sm:top-6 sm:p-4"
              >
                <X className="w-6 h-6 sm:w-8 sm:h-8" />
              </motion.button>
              <iframe
                src={embedLink}
                className="h-[86svh] w-full max-w-5xl rounded-lg border border-cyan-400/30 bg-white shadow-2xl sm:h-[82vh]"
                title="Resume Preview"
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
