"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirestoreData } from "@/hooks/useFirestoreData";

const FOOTER_ACCENTS = [
  "var(--color-accent-a)",
  "var(--color-accent-b)",
  "var(--color-accent-c)",
];

const FALLBACK_FOOTER = [
  {
    title: "About Me",
    type: "about",
    content:
      "Hi, I'm Deepak S - a developer crafting practical web, cloud, and AI products with React, Next.js, and Firebase.",
  },
  {
    title: "Quick Links",
    type: "links",
    links: ["About", "Projects", "Tech Stack", "Contact"],
  },
  {
    title: "Contact",
    type: "contact",
    email: "deepakofficial0103@gmail.com",
    phone: "+91 6369021716",
    socials: [
      { href: "https://github.com/dpak-07", icon: "fab fa-github" },
      { href: "https://www.linkedin.com/in/deepak-saminathan/", icon: "fab fa-linkedin" },
      { href: "https://www.instagram.com/d.pak_07/", icon: "fab fa-instagram" },
    ],
  },
];

function toSectionId(label) {
  const normalized = String(label || "").trim().toLowerCase();
  if (normalized === "tech stack" || normalized === "skills") return "tech-stack";
  return normalized.replace(/\s+/g, "-");
}

export default function Footer() {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { data: firestoreFooterData, loading: firestoreLoading, error: firestoreError } = useFirestoreData("footer", "details");
  const footerData = firestoreFooterData?.footerData || FALLBACK_FOOTER;

  const copyEmail = async () => {
    try {
      const email = footerData.find((section) => section.type === "contact")?.email || FALLBACK_FOOTER[2].email;
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard error:", err);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay, duration: 0.45, ease: "easeOut" },
    }),
  };

  return (
    <motion.footer
      className="relative mt-0 overflow-hidden border-t py-16 backdrop-blur-2xl"
      style={{
        borderColor: "var(--color-border)",
        color: "var(--color-text)",
        background:
          "linear-gradient(135deg, color-mix(in srgb, var(--color-accent-a) 12%, transparent), transparent 34%), linear-gradient(225deg, color-mix(in srgb, var(--color-accent-c) 10%, transparent), transparent 36%), linear-gradient(180deg, color-mix(in srgb, var(--color-surface-soft) 74%, transparent), var(--color-bg-strong))",
      }}
      initial="hidden"
      animate="show"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent-a)] to-transparent" />
      <div className="pointer-events-none absolute inset-x-6 top-8 h-px bg-gradient-to-r from-[var(--color-accent-b)]/0 via-[var(--color-accent-b)]/50 to-[var(--color-accent-c)]/0" />

      {firestoreLoading && (
        <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
          <div className="animate-pulse text-[var(--color-faint)]">Loading footer...</div>
        </div>
      )}

      {firestoreError && (
        <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
          <div className="text-sm text-red-400/70">{firestoreError}</div>
        </div>
      )}

      {!firestoreLoading && !firestoreError && (
        <>
          <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 text-center md:grid-cols-3 md:text-left">
            {footerData.map((section, idx) => {
              const accent = FOOTER_ACCENTS[idx % FOOTER_ACCENTS.length];

              return (
                <motion.div
                  key={section.title || idx}
                  variants={fadeUp}
                  custom={0.12 + idx * 0.12}
                  className="group relative overflow-hidden rounded-lg border p-5 text-left transition-colors"
                  style={{
                    "--footer-accent": accent,
                    borderColor: "color-mix(in srgb, var(--footer-accent) 28%, var(--color-border))",
                    background: "color-mix(in srgb, var(--color-surface-soft) 82%, transparent)",
                  }}
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-[var(--footer-accent)] opacity-80" />
                  <h3 className="mb-3 text-lg font-semibold" style={{ color: "var(--footer-accent)" }}>
                    {section.title}
                  </h3>

                  {section.type === "about" && (
                    typeof section.content === "string" ? (
                      <p className="text-sm leading-relaxed text-[var(--color-muted)]">{section.content}</p>
                    ) : (
                      section.content
                    )
                  )}

                  {section.type === "links" && (
                    <ul className="space-y-3 text-sm text-[var(--color-muted)]">
                      {section.links?.map((link) => (
                        <motion.li key={link} whileHover={{ x: 6 }} transition={{ type: "spring", stiffness: 200 }}>
                          <a href={`#${toSectionId(link)}`} className="transition hover:text-[var(--footer-accent)]">
                            {link}
                          </a>
                        </motion.li>
                      ))}
                    </ul>
                  )}

                  {section.type === "contact" && (
                    <>
                      <button type="button" className="text-sm underline transition hover:text-[var(--footer-accent)]" onClick={copyEmail}>
                        {section.email}
                      </button>
                      {section.phone && <p className="mt-1 text-sm text-[var(--color-muted)]">{section.phone}</p>}
                      {section.location && <p className="mt-1 text-sm text-[var(--color-muted)]">{section.location}</p>}
                      {section.team && <p className="mt-1 text-sm text-[var(--color-muted)]">{section.team}</p>}

                      <div className="mt-5 flex justify-center gap-4 md:justify-start">
                        {section.socials?.map((link, sIdx) => (
                          <motion.a
                            key={`${link.href}-${sIdx}`}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border"
                            style={{ borderColor: "var(--footer-accent)", color: "var(--footer-accent)" }}
                            whileHover={{ scale: 1.12, rotate: 4 }}
                            whileTap={{ scale: 0.94 }}
                          >
                            <span className="absolute inset-0 bg-[var(--footer-accent)]/20 opacity-0 transition group-hover:opacity-100" />
                            <i className={link.icon} />
                          </motion.a>
                        ))}
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>

          <motion.div
            className="relative z-10 mx-auto mt-12 max-w-6xl border-t px-6 pt-6 text-center text-xs text-[var(--color-faint)]"
            style={{ borderColor: "var(--color-border)" }}
            variants={fadeUp}
            custom={0.5}
          >
            &copy; {new Date().getFullYear()} Deepak S - Built with <span style={{ color: "var(--color-accent-a)" }}>React</span>, styled with <span style={{ color: "var(--color-accent-c)" }}>care</span>
            <motion.button
              type="button"
              onClick={() => navigate("/admindsh")}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
className="ml-2 transition hover:text-[var(--color-accent-b)]"
              title="Go to Admin Dashboard"
            >
              Admin
            </motion.button>
          </motion.div>
        </>
      )}

      {copied && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
className="portfolio-panel absolute bottom-20 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-sm"
        style={{ color: "var(--color-accent-a)" }}
        >
          Copied to clipboard
        </motion.div>
      )}
    </motion.footer>
  );
}
