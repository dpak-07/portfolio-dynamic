"use client"
import { motion } from "framer-motion"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useFirestoreData } from "@/hooks/useFirestoreData"

export default function Footer() {
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()

  // 🔥 Fetch footer data from Firestore
  const { data: firestoreFooterData, loading: firestoreLoading, error: firestoreError } = useFirestoreData('footer', 'details')

  // Parse Firestore data or use fallback
  const footerData = firestoreFooterData?.footerData || [
    {
      title: "About Me",
      type: "about",
      content: (
        <p className="text-sm text-white/70 leading-relaxed">
          Hi, I'm <span className="font-medium text-white">Deepak S</span> — a
          creative developer crafting digital experiences with{" "}
          <span className="text-cyansoft">React, Next.js</span>, and a passion
          for design. ✨
        </p>
      ),
    },
    {
      title: "Quick Links",
      type: "links",
      links: ["About", "Projects", "Skills", "Contact"],
    },
    {
      title: "Contact",
      type: "contact",
      email: "deepakofficail0103@gmail.com",
      phone: "📞 6369021716",
      socials: [
        {
          href: "https://github.com/dpak-07",
          icon: "fab fa-github",
        },
        {
          href: "https://www.linkedin.com/in/deepak-saminathan/",
          icon: "fab fa-linkedin",
        },
        {
          href: "https://www.instagram.com/d.pak_07/",
          icon: "fab fa-instagram",
        },
      ],
    },
  ]

  const copyEmail = async () => {
    try {
      const email = footerData.find(section => section.type === "contact")?.email || "deepakofficail0103@gmail.com"
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Clipboard error:", err)
    }
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay, duration: 0.6, ease: "easeOut" },
    }),
  }

  return (
    <motion.footer
      className="relative bg-gradient-to-b from-black/30 via-black/60 to-black/90 backdrop-blur-2xl border-t border-white/10 text-white py-16 mt-0 overflow-hidden"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyansoft/10 to-transparent blur-3xl"></div>

      {/* Loading state */}
      {firestoreLoading && (
        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
          <div className="animate-pulse text-white/50">Loading footer...</div>
        </div>
      )}

      {/* Error state */}
      {firestoreError && (
        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
          <div className="text-red-400/50 text-sm">{firestoreError}</div>
        </div>
      )}

      {/* Footer content mapped from JSON */}
      {!firestoreLoading && !firestoreError && (
        <>
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left relative z-10">
            {footerData.map((section, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                custom={0.2 + idx * 0.2}
                className="space-y-3"
              >
                <h3 className="text-lg font-semibold text-cyansoft mb-3">
                  {section.title}
                </h3>

                {/* About Me Section */}
                {section.type === "about" && section.content}

                {/* Quick Links */}
                {section.type === "links" && (
                  <ul className="space-y-3 text-sm text-white/70">
                    {section.links?.map((link, i) => (
                      <motion.li
                        key={i}
                        whileHover={{ x: 6, color: "#22d3ee" }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <a href={`#${link.toLowerCase()}`} className="transition">
                          {link}
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                )}

                {/* Contact Section */}
                {section.type === "contact" && (
                  <>
                    <p
                      className="text-sm underline cursor-pointer hover:text-cyansoft transition"
                      onClick={copyEmail}
                    >
                      {section.email}
                    </p>
                    <p className="text-sm mt-1 text-white/70">{section.phone}</p>

                    <div className="flex justify-center md:justify-start gap-4 mt-5">
                      {section.socials?.map((link, sIdx) => (
                        <motion.a
                          key={sIdx}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-cyansoft overflow-hidden group"
                          whileHover={{ scale: 1.2, rotate: 6 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <span className="absolute inset-0 bg-cyansoft/20 opacity-0 group-hover:opacity-100 transition"></span>
                          <i className={link.icon}></i>
                        </motion.a>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>

          {/* Divider Line */}
          <motion.div
            className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/60 relative z-10"
            variants={fadeUp}
            custom={0.8}
          >
            &copy; {new Date().getFullYear()} Deepak S — Built with{" "}
            <span className="text-cyansoft">React</span>{" "}
            <motion.span
              onClick={() => navigate("/admindsh")}
              whileHover={{
                scale: 1.3,
                rotate: [0, -10, 10, 0],
              }}
              whileTap={{ scale: 0.9 }}
              animate={{
                scale: [1, 1.15, 1],
                transition: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              className="inline-block cursor-pointer ml-1 text-cyansoft hover:text-cyansoft/70 transition"
              title="Go to Admin Dashboard"
            >
              ❤️
            </motion.span>
          </motion.div>
        </>
      )}

      {/* Copy Notification */}
      {copied && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          className="absolute left-1/2 -translate-x-1/2 bottom-20 text-sm text-cyansoft bg-white/10 backdrop-blur-md px-4 py-1 rounded-full border border-white/10"
        >
          Copied to clipboard!
        </motion.div>
      )}
    </motion.footer>
  )
}