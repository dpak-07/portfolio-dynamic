"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Award, CalendarDays, Download, Eye, FileText, Layers3, Sparkles, UserCheck, X } from "lucide-react";
import { logDownload, logLinkClick, logResumeOpen, logSectionView } from "../utils/analytics";
import { useResumeResource } from "@/hooks/useResumeResource";

function formatDate(dateString) {
  if (!dateString) return "";
  try {
    const date = new Date(String(dateString).replace(" ", "T"));
    if (Number.isNaN(date.getTime())) return String(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return String(dateString);
  }
}

export default function Resume() {
  const [isOpen, setIsOpen] = useState(false);
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { once: true, amount: 0.24 });
  const { resumeData, loading, error, preview: embedLink, download: downloadLink } = useResumeResource();

  useEffect(() => {
    if (sectionInView) logSectionView("resume");
  }, [sectionInView]);

  const skills = Array.isArray(resumeData?.skills) ? resumeData.skills.filter(Boolean) : [];
  const title = resumeData?.header?.title || "Resume";
  const updated = formatDate(resumeData?.lastUpdated);

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
      <section id="resume" ref={sectionRef} className="relative flex min-h-[70vh] items-center justify-center px-4 py-20">
        <div className="portfolio-panel flex items-center gap-3 rounded-lg px-5 py-4">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}>
            <FileText className="h-5 w-5 text-cyan-500" />
          </motion.div>
          <span className="text-sm font-medium text-[var(--color-muted)]">Loading Firestore resume</span>
        </div>
      </section>
    );
  }

  if (error || !resumeData) {
    return (
      <section id="resume" ref={sectionRef} className="relative flex min-h-[70vh] items-center justify-center px-4 py-20">
        <div className="portfolio-panel max-w-xl rounded-lg p-6 text-center">
          <FileText className="mx-auto mb-3 h-8 w-8 text-cyan-500" />
          <h2 className="portfolio-gradient-text text-3xl font-black">Resume</h2>
          <p className="mt-3 text-sm text-[var(--color-muted)]">{error || "Resume data is waiting for Firestore document resume/data."}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="resume" ref={sectionRef} className="relative overflow-hidden px-4 py-16 scroll-mt-24 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="portfolio-panel relative overflow-hidden rounded-lg"
          initial={{ opacity: 0, y: 28 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <div className="pointer-events-none absolute inset-0 opacity-70" style={{ background: "linear-gradient(135deg, rgba(45,212,191,0.14), transparent 38%), linear-gradient(315deg, rgba(245,158,11,0.12), transparent 34%)" }} />

          <div className="relative grid gap-0 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="border-b p-5 sm:p-8 lg:border-b-0 lg:border-r lg:p-10" style={{ borderColor: "var(--color-border)" }}>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-faint)]" style={{ borderColor: "var(--color-border)" }}>
                <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
                Career Snapshot
              </div>

              <h2 className="portfolio-gradient-text text-4xl font-black leading-tight sm:text-5xl">{title}</h2>

              {resumeData.description && (
                <p className="mt-5 text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">{resumeData.description}</p>
              )}

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="portfolio-panel-muted rounded-lg p-3">
                  <Layers3 className="mb-2 h-5 w-5 text-cyan-500" />
                  <div className="text-2xl font-black text-[var(--color-text)]">{skills.length}</div>
                  <div className="text-xs font-semibold text-[var(--color-faint)]">skills listed</div>
                </div>
                <div className="portfolio-panel-muted rounded-lg p-3">
                  <CalendarDays className="mb-2 h-5 w-5 text-amber-500" />
                  <div className="text-sm font-black text-[var(--color-text)]">{updated || "Live"}</div>
                  <div className="text-xs font-semibold text-[var(--color-faint)]">last updated</div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleViewResume}
                  disabled={!embedLink}
                  className="portfolio-primary-button inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  <Eye className="h-4 w-4" />
                  View Resume
                </button>

                {downloadLink && (
                  <a
                    href={downloadLink}
                    onClick={handleDownload}
                    className="portfolio-secondary-button inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold sm:w-auto"
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </a>
                )}
              </div>
            </div>

            <div className="p-5 sm:p-8 lg:p-10">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-faint)]">Skill Cloud</div>
                  <div className="text-xl font-black text-[var(--color-text)]">What the resume highlights</div>
                </div>
                <div className="portfolio-panel-muted hidden rounded-lg p-3 text-cyan-500 sm:block">
                  <Award className="h-6 w-6" />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.025 }}
                    className="portfolio-chip rounded-lg px-3 py-2 text-xs font-semibold sm:text-sm"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="portfolio-panel-muted rounded-lg p-4">
                  <UserCheck className="mb-3 h-5 w-5 text-cyan-500" />
                  <div className="text-sm font-bold text-[var(--color-text)]">Updated by</div>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">{resumeData.updatedBy || "Firestore"}</p>
                </div>
                <div className="portfolio-panel-muted rounded-lg p-4">
                  <FileText className="mb-3 h-5 w-5 text-amber-500" />
                  <div className="text-sm font-bold text-[var(--color-text)]">Source</div>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">{resumeData.resumeDriveLink ? "Drive resume linked" : "No resume link published"}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

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
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4"
            >
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="portfolio-secondary-button absolute right-2 top-2 z-[10000] rounded-full p-3 transition-all hover:border-cyan-400 hover:text-cyan-400 sm:right-6 sm:top-6"
              >
                <X className="h-6 w-6" />
              </button>
              <iframe src={embedLink} className="h-[86svh] w-full max-w-5xl rounded-lg border border-cyan-400/30 bg-white shadow-2xl sm:h-[82vh]" title="Resume Preview" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
