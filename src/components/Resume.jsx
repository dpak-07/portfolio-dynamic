"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Eye,
  Download,
  Calendar,
  User,
  FileText,
  X,
  ChevronRight,
  Briefcase,
} from "lucide-react";
import { useFirestoreData } from "@/hooks/useFirestoreData";
import { logSectionView, logLinkClick, logDownload, logResumeOpen } from "../utils/analytics";

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

  const fileId = resumeData?.resumeDriveLink?.match(/\/d\/(.*?)\//)?.[1] || null;
  const embedLink = fileId ? `https://drive.google.com/file/d/${fileId}/preview` : null;
  const downloadLink = fileId ? `https://drive.google.com/uc?export=download&id=${fileId}` : null;

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
        className="relative bg-black py-20 px-6 flex items-center justify-center"
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
        className="relative bg-black py-20 px-6 flex items-center justify-center"
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
      className="relative bg-black py-16 px-6 overflow-hidden scroll-mt-20"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      
      {/* Floating Orb Animation */}
      <motion.div
        animate={{ 
          opacity: [0.1, 0.3, 0.1],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{ 
          opacity: [0.1, 0.25, 0.1],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-40 left-20 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]"
      />

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
          className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      <div className="relative max-w-5xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center md:text-left"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-4"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Briefcase className="w-3 h-3 text-cyan-400" />
            </motion.div>
            <span className="text-cyan-400 text-xs font-medium uppercase tracking-wider">
              Professional Resume
            </span>
          </motion.div>
          
          <h2 className="text-5xl md:text-7xl font-black text-white mb-3 bg-gradient-to-r from-white via-cyan-200 to-cyan-500 bg-clip-text text-transparent">
            Career Overview
          </h2>
          <p className="text-white/60 text-lg md:text-xl max-w-3xl">
            {resumeData.description}
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Resume Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="relative group"
          >
            {/* Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-1000" />
            
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:border-cyan-500/30 transition-all">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <FileText className="w-12 h-12 text-cyan-400" />
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Professional Resume</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-sm text-white/60">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(resumeData.lastUpdated)}
                        </span>
                        <span className="hidden sm:block text-white/30">•</span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {resumeData.updatedBy || "Admin"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleViewResume}
                    disabled={!embedLink}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Resume</span>
                  </motion.button>

                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={downloadLink || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleDownload}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/25"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Skills Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative group"
          >
            {/* Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-0 group-hover:opacity-15 transition duration-1000" />
            
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:border-purple-500/30 transition-all">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <ChevronRight className="w-5 h-5 text-cyan-400" />
                Technical Skills
              </h3>
              <div className="flex flex-wrap gap-3">
                {resumeData.skills?.map((skill, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.1, y: -3 }}
                    className="relative group/skill"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg blur opacity-0 group-hover/skill:opacity-30 transition" />
                    <span className="relative block px-4 py-2 bg-black/40 border border-white/20 rounded-lg text-white/90 text-sm font-medium hover:border-cyan-400/50 hover:text-cyan-400 transition-all">
                      {skill}
                    </span>
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Resume Modal */}
      <AnimatePresence>
        {isOpen && embedLink && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-900 border-2 border-cyan-400/30 rounded-3xl shadow-2xl shadow-cyan-500/20 w-full max-w-6xl h-[90vh] overflow-hidden"
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-2.5 shadow-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Resume Preview */}
              <iframe 
                src={embedLink} 
                className="w-full h-full rounded-3xl" 
                title="Resume Viewer"
                allow="autoplay"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}