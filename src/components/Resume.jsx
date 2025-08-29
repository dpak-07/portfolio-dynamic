// src/components/Resume.jsx
"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Resume() {
  const [isOpen, setIsOpen] = useState(false)

  const skills = [
    "Full-Stack Development",
    "AI & Machine Learning",
    "Data Analytics",
    "Cloud Deployment",
    "Product Design",
    "Agile & Team Collaboration"
  ]

  // Escape key closes modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsOpen(false)
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [])

  // Variants for stagger animation
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <section id="resume" className="py-24 px-4 relative">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-cyansoft/10 via-transparent to-purple-500/10 blur-2xl"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-5xl mx-auto bg-panel/70 backdrop-blur-2xl rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden"
      >
        {/* Glowing animated border */}
        <div className="absolute inset-0 rounded-3xl border border-cyansoft/30 pointer-events-none animate-pulse"></div>

        {/* Header with status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row justify-between items-center mb-8"
        >
          <h2 className="text-4xl font-extrabold text-cyansoft">Resume</h2>

          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-green-600/20 text-green-400 px-4 py-2 rounded-full text-sm font-semibold shadow-md animate-pulse"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-ping"></span>
            Open to Work
          </motion.span>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-white/80 mb-10 max-w-2xl mx-auto"
        >
          Passionate about building scalable digital solutions that blend technology with user-centric design. 
          Experienced in full-stack development, AI solutions, and product strategy.
        </motion.p>

        {/* Skills Section (staggered animation) */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {skills.map((skill, i) => (
            <motion.span
              key={i}
              variants={item}
              className="px-5 py-2 bg-white/10 text-white rounded-xl text-sm font-medium shadow-sm hover:bg-cyansoft/20 transition"
            >
              {skill}
            </motion.span>
          ))}
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row justify-center gap-6"
        >
          <button
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-cyansoft to-cyan-400 text-black px-8 py-3 rounded-xl font-semibold shadow-cyanglow hover:scale-105 transition-transform"
          >
            <i className="fas fa-eye mr-2"></i> Open Resume
          </button>

          <a
            href="/Deepak_Resume.pdf"
            download
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform"
          >
            <i className="fas fa-download mr-2"></i> Download Resume
          </a>
        </motion.div>
      </motion.div>

      {/* Modal for Resume */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-0 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-none sm:rounded-2xl shadow-xl w-full h-full sm:max-w-4xl sm:h-[80vh] relative overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-black text-xl font-bold hover:text-red-500 z-10"
              >
                ✕
              </button>

              {/* Embedded PDF */}
              <iframe
                src="/Deepak_Resume.pdf"
                className="w-full h-full"
                title="Resume PDF"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
