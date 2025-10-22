"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, Download, Calendar, User } from "lucide-react"
import { useFirestoreData } from "@/hooks/useFirestoreData"

export default function Resume() {
  const [isOpen, setIsOpen] = useState(false)

  // Fetch resume data directly from Firestore
  const { data: resumeData, loading, error } = useFirestoreData("resume", "data")

  // Convert timestamp format for display
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown"
    try {
      // Handle both ISO string and Firestore Timestamp
      const date = new Date(dateString.replace?.(" ", "T") || dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (err) {
      return dateString
    }
  }

  // 🧠 Extract Drive ID and generate preview/download links
  const fileId = resumeData?.resumeDriveLink?.match(/\/d\/(.*?)\//)?.[1] || null
  const embedLink = fileId
    ? `https://drive.google.com/file/d/${fileId}/preview`
    : null
  const downloadLink = fileId
    ? `https://drive.google.com/uc?export=download&id=${fileId}`
    : null

  if (loading) {
    return (
      <section
        id="resume"
        className="relative bg-[#030712] py-20 sm:py-28 px-4 sm:px-8 text-white overflow-hidden"
      >
        <div className="relative max-w-5xl mx-auto rounded-3xl p-6 sm:p-10 bg-white/5 backdrop-blur-2xl border border-white/10 flex items-center justify-center h-64">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-4"
            >
              <Calendar className="w-12 h-12 text-cyan-400" />
            </motion.div>
            <p className="text-white/70">Loading resume...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error || !resumeData) {
    return (
      <section
        id="resume"
        className="relative bg-[#030712] py-20 sm:py-28 px-4 sm:px-8 text-white overflow-hidden"
      >
        <div className="relative max-w-5xl mx-auto rounded-3xl p-6 sm:p-10 bg-white/5 backdrop-blur-2xl border border-white/10 flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-400 mb-2">Failed to load resume data</p>
            <p className="text-white/70 text-sm">Please check your connection</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="resume"
      className="relative bg-[#030712] py-20 sm:py-28 px-4 sm:px-8 text-white overflow-hidden"
    >
      {/* ⚡ Resume Card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative max-w-5xl mx-auto rounded-3xl p-6 sm:p-10 bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_-10px_rgba(0,255,255,0.25)] overflow-hidden"
      >
        {/* 💡 Glow overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,255,255,0.15),rgba(255,0,255,0.15))] opacity-10 pointer-events-none rounded-3xl" />

        {/* ✨ Header with Updated Info */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0 items-start sm:items-center relative z-10 mb-6">
          <h2
            className={`text-3xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${resumeData.header?.gradient || "from-cyan-400 via-blue-400 to-purple-400"}`}
          >
            {resumeData.header?.title || "My Interactive Resume"}
          </h2>
          
          {/* Update Info */}
          <div className="flex flex-col gap-2 text-xs sm:text-sm">
            {/* Last Updated */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-cyan-300"
            >
              <Calendar className="w-4 h-4" />
              <span className="whitespace-nowrap">
                Updated: {formatDate(resumeData.lastUpdated)}
              </span>
            </motion.div>

            {/* Updated By */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 text-blue-300"
            >
              <User className="w-4 h-4" />
              <span className="whitespace-nowrap">
                By: {resumeData.updatedBy || "admin"}
              </span>
            </motion.div>
          </div>
        </div>

        {/* 📝 Description */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-white/80 mt-5 sm:mt-6 text-sm sm:text-base leading-relaxed relative z-10"
        >
          {resumeData.description}
        </motion.p>

        {/* 🧩 Skills */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mt-8 sm:mt-10 relative z-10">
          {resumeData.skills?.map((skill, i) => (
            <motion.span
              key={i}
              whileHover={{ scale: 1.05 }}
              animate={
                typeof window !== "undefined" && window.innerWidth > 640
                  ? { y: [0, -3, 0], opacity: [0.9, 1, 0.9] }
                  : {}
              }
              transition={{
                duration: 3 + i * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="px-3 sm:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-lg sm:rounded-xl text-white/90 text-xs sm:text-sm hover:border-cyan-400/50 transition"
            >
              {skill}
            </motion.span>
          ))}
        </div>

        {/* 🚀 Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-center sm:justify-end items-center gap-3 sm:gap-6 mt-10 sm:mt-12 relative z-10"
        >
          {/* View Resume */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            disabled={!embedLink}
            className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold rounded-lg sm:rounded-xl shadow-[0_0_20px_-5px_rgba(0,255,255,0.5)] hover:shadow-[0_0_35px_-5px_rgba(0,255,255,0.6)] transition-all flex justify-center items-center gap-2 disabled:opacity-50"
          >
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" /> View Resume
          </motion.button>

          {/* Download Resume */}
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={downloadLink || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-lg sm:rounded-xl shadow-[0_0_20px_-5px_rgba(255,0,255,0.5)] hover:shadow-[0_0_35px_-5px_rgba(255,0,255,0.6)] transition-all flex justify-center items-center gap-2"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" /> Download
          </motion.a>
        </motion.div>
      </motion.div>

      {/* 📄 Resume Modal */}
      <AnimatePresence>
        {isOpen && embedLink && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="relative bg-[#0a0f1a] border border-cyan-400/30 rounded-2xl shadow-[0_0_40px_-10px_rgba(0,255,255,0.4)] w-full max-w-[95%] sm:max-w-5xl h-[75vh] sm:h-[85vh] overflow-hidden"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 sm:top-4 right-3 sm:right-4 text-cyan-400 text-xl sm:text-2xl font-bold hover:text-red-500 transition z-10"
              >
                ✕
              </button>
              <iframe
                src={embedLink}
                className="w-full h-full rounded-2xl"
                title="Resume Viewer"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}