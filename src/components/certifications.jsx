"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  Award,
  BookOpen,
  Briefcase,
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileBadge,
  Loader2,
  X,
} from "lucide-react";
import { useFirestoreData } from "@/hooks/useFirestoreData";
import { logLinkClick, logSectionView } from "../utils/analytics";
import { normalizeSupabasePublicUrl } from "@/utils/urlHelpers";

const iconComponents = {
  BookOpen,
  Briefcase,
  Award,
};

const fallbackCategories = [
  {
    id: "courses",
    label: "Courses",
    icon: "BookOpen",
    items: [],
  },
  {
    id: "internships",
    label: "Internships",
    icon: "Briefcase",
    items: [],
  },
  {
    id: "participations",
    label: "Participations",
    icon: "Award",
    items: [],
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.07, delayChildren: 0.06 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: "easeOut" },
  },
};

function optimizeOneDriveLink(url) {
  if (!url) return null;
  const normalizedUrl = normalizeSupabasePublicUrl(url);

  try {
    if (normalizedUrl.match(/\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i)) {
      return normalizedUrl;
    }

    if (normalizedUrl.includes("onedrive.live.com") || normalizedUrl.includes("1drv.ms")) {
      if (normalizedUrl.includes("1drv.ms")) return normalizedUrl;

      const urlObj = new URL(normalizedUrl);
      if (!urlObj.searchParams.has("download")) {
        urlObj.searchParams.set("download", "1");
      }
      return urlObj.toString();
    }

    return normalizedUrl;
  } catch (error) {
    console.error("Error optimizing certificate link:", error);
    return normalizedUrl;
  }
}

function preloadImages(imageUrls) {
  if (!Array.isArray(imageUrls)) return;

  imageUrls.forEach((url) => {
    const optimizedUrl = optimizeOneDriveLink(url);
    if (optimizedUrl) {
      const img = new Image();
      img.src = optimizedUrl;
    }
  });
}

function HighQualityImage({ src, alt, className, onLoad, onError, priority = false }) {
  const [optimizedSrc, setOptimizedSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) {
      setHasError(true);
      return undefined;
    }

    const optimized = optimizeOneDriveLink(src);
    setOptimizedSrc(optimized);
    setIsLoading(true);
    setHasError(false);

    const img = new Image();
    img.onload = () => {
      setIsLoading(false);
      onLoad?.();
    };
    img.onerror = () => {
      setIsLoading(false);
      setHasError(true);
      onError?.();
    };
    img.src = optimized;

    if (priority) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = optimized;
      document.head.appendChild(link);

      return () => {
        if (link.parentNode) link.parentNode.removeChild(link);
      };
    }

    return undefined;
  }, [src, onLoad, onError, priority]);

  if (hasError || !optimizedSrc) {
    return (
      <div className={`flex items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] ${className}`}>
        <div className="text-center text-[var(--color-muted)]">
          <FileBadge className="mx-auto mb-2 h-12 w-12 opacity-50" />
          <p className="text-sm">Image not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-[var(--color-surface-muted)]">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}>
            <Loader2 size={32} className="text-[var(--color-text)]" />
          </motion.div>
        </div>
      )}
      <img
        src={optimizedSrc}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
        onLoad={() => {
          setIsLoading(false);
          onLoad?.();
        }}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
          onError?.();
        }}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    </div>
  );
}

function normalizeCategories(certsData) {
  const categories = Array.isArray(certsData?.categories) ? certsData.categories : fallbackCategories;

  return categories.map((cat) => {
    const Icon = iconComponents[cat.icon] || Award;
    return {
      ...cat,
      items: Array.isArray(cat.items) ? cat.items : [],
      iconNode: <Icon className="h-5 w-5" />,
    };
  });
}

function CertificateCard({ item, index, onOpen }) {
  const imageCount = Array.isArray(item.images) ? item.images.length : 0;

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -6 }}
      onClick={() => onOpen(item)}
      className="portfolio-panel group cursor-pointer rounded-2xl p-5 text-left"
    >
<div className="mb-5 flex items-start justify-between gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border" style={{ borderColor: "var(--color-accent-a)", background: "var(--color-accent-soft)" }}>
          <FileBadge className="h-5 w-5" style={{ color: "var(--color-accent-a)" }} />
        </span>
        <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-2.5 py-1 text-xs font-bold text-[var(--color-muted)]">
          {imageCount ? `${imageCount} image${imageCount > 1 ? "s" : ""}` : "No image"}
        </span>
      </div>

<div className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: "var(--color-accent-a)" }}>Milestone {index + 1}</div>
      <h3 className="mt-2 text-lg font-black leading-tight text-[var(--color-text)]">{item.title}</h3>

<div className="mt-4 space-y-2 text-sm text-[var(--color-muted)]">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 shrink-0" style={{ color: "var(--color-accent-b)" }} />
          <span>{item.issuer}</span>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: "var(--color-accent-c)" }}>
          <CalendarDays className="h-4 w-4 shrink-0" />
          <span>{item.date}</span>
        </div>
      </div>

      <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-[var(--color-muted)]">{item.desc}</p>
    </motion.article>
  );
}

export default function CertificationsSection() {
  const { data: certsData, loading: firestoreLoading, error: firestoreError } = useFirestoreData("certifications", "data");
  const certificateData = useMemo(() => ({ categories: normalizeCategories(certsData) }), [certsData]);

  const [active, setActive] = useState("courses");
  const [selected, setSelected] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const sectionRef = useRef(null);
  const dropdownRef = useRef(null);
  const sectionInView = useInView(sectionRef, { once: true, amount: 0.22 });

  const activeCategory = certificateData.categories.find((cat) => cat.id === active) || certificateData.categories[0];
  const totalItems = certificateData.categories.reduce((sum, cat) => sum + cat.items.length, 0);

  useEffect(() => {
    if (sectionInView) logSectionView("certifications");
  }, [sectionInView]);

  useEffect(() => {
    if (!certificateData.categories.some((cat) => cat.id === active)) {
      setActive(certificateData.categories[0]?.id || "courses");
    }
  }, [active, certificateData.categories]);

  useEffect(() => {
    activeCategory?.items?.forEach((item) => preloadImages(item.images));
  }, [activeCategory]);

  useEffect(() => {
    if (selected?.images) preloadImages(selected.images);
  }, [selected]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (selected) setImageIndex(0);
  }, [selected]);

  useEffect(() => {
    if (!selected?.images || selected.images.length <= 1) return undefined;
    const timer = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % selected.images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [selected]);

  const handleCategoryChange = (cat) => {
    setLoading(true);
    setIsDropdownOpen(false);
    setTimeout(() => {
      setActive(cat);
      setLoading(false);
    }, 250);
  };

  const nextImage = () => {
    if (!selected?.images) return;
    setImageIndex((prev) => (prev + 1) % selected.images.length);
  };

  const prevImage = () => {
    if (!selected?.images) return;
    setImageIndex((prev) => (prev - 1 + selected.images.length) % selected.images.length);
  };

  const openOriginalLink = () => {
    if (selected?.images?.[imageIndex]) {
      logLinkClick("certificate_original");
      window.open(selected.images[imageIndex], "_blank", "noopener noreferrer");
    }
  };

  if (firestoreError) {
    return (
      <section id="certifications" className="relative flex min-h-[70vh] w-full items-center justify-center px-4 py-16">
        <div className="portfolio-panel max-w-xl rounded-2xl p-6 text-center">
          <h2 className="text-3xl font-bold text-[var(--color-text)]">Failed to Load Certifications</h2>
          <p className="mt-3 text-sm text-[var(--color-muted)]">{firestoreError}</p>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      id="certifications"
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="relative w-full overflow-hidden px-4 py-16 scroll-mt-24 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-5 lg:grid-cols-[0.9fr_0.55fr] lg:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-faint)]">
              <Award className="h-3.5 w-3.5" />
              Certifications
            </div>
            <h2 className="portfolio-gradient-text text-4xl font-extrabold leading-tight sm:text-5xl">
              Certifications & milestones
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
              Courses, internships, hackathons, and learning milestones in one clean timeline-friendly view.
            </p>
          </div>

<div className="grid grid-cols-2 gap-3 sm:max-w-sm lg:ml-auto">
            <div className="portfolio-panel portfolio-panel-accent rounded-2xl p-4" style={{ "--accent-local": "var(--color-accent-a)" }}>
              <div className="text-3xl font-black" style={{ color: "var(--color-accent-a)" }}>{certificateData.categories.length}</div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-faint)]">Groups</div>
            </div>
            <div className="portfolio-panel portfolio-panel-accent rounded-2xl p-4" style={{ "--accent-local": "var(--color-accent-c)" }}>
              <div className="text-3xl font-black" style={{ color: "var(--color-accent-c)" }}>{totalItems}</div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-faint)]">Milestones</div>
            </div>
          </div>
        </div>

        <div className="mb-8 hidden flex-wrap gap-3 md:flex">
          {certificateData.categories.map((cat) => (
            <motion.button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryChange(cat.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
className={`flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-bold transition-all ${
                active === cat.id
                  ? "border-[var(--color-accent-a)] bg-[var(--color-accent-a)] text-white"
                  : "border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-muted)] hover:border-[var(--color-accent-a)] hover:text-[var(--color-accent-a)]"
              }`}
            >
              {cat.iconNode}
              {cat.label}
            </motion.button>
          ))}
        </div>

        <div className="relative mb-8 md:hidden" ref={dropdownRef}>
          <motion.button
            type="button"
            onClick={() => setIsDropdownOpen((value) => !value)}
            whileTap={{ scale: 0.98 }}
            className="portfolio-panel flex w-full items-center justify-between rounded-2xl px-4 py-3 text-[var(--color-text)]"
          >
            <div className="flex items-center gap-2">
              {activeCategory?.iconNode}
              <span className="font-bold">{activeCategory?.label}</span>
            </div>
            <motion.div animate={{ rotate: isDropdownOpen ? 180 : 0 }} transition={{ duration: 0.24 }}>
              <ChevronDown className="h-5 w-5" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="portfolio-panel absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl"
              >
                {certificateData.categories.map((cat) => (
<button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`flex w-full items-center gap-2 border-b border-[var(--color-border)] px-4 py-3 text-left text-sm font-bold last:border-b-0 ${
                      active === cat.id ? "text-white" : "text-[var(--color-muted)]"
                    }`}
                    style={active === cat.id ? { background: "linear-gradient(135deg, var(--color-accent-a), var(--color-accent-b))" } : {}}
                  >
                    {cat.iconNode}
                    {cat.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {(loading || firestoreLoading) && (
            <motion.div key="loader" className="flex h-40 items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}>
                <Loader2 size={40} className="text-[var(--color-text)]" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!loading && !firestoreLoading && (
            <motion.div key={active} variants={containerVariants} initial="hidden" animate="visible" exit="hidden">
              {activeCategory?.items?.length ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {activeCategory.items.map((item, index) => (
                    <CertificateCard key={`${item.title}-${index}`} item={item} index={index} onOpen={setSelected} />
                  ))}
                </div>
              ) : (
                <div className="portfolio-panel rounded-2xl p-8 text-center text-sm text-[var(--color-muted)]">
                  No certifications added in this category yet.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="portfolio-modal-backdrop fixed inset-0 z-[1001] flex items-center justify-center p-3 sm:p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 18 }}
              className="portfolio-modal-card relative max-h-[92svh] w-full max-w-4xl overflow-y-auto rounded-2xl p-5 sm:p-6"
              onClick={(event) => event.stopPropagation()}
            >
              <button onClick={() => setSelected(null)} className="portfolio-secondary-button absolute right-3 top-3 z-10 rounded-full p-2 transition-colors" aria-label="Close certificate modal">
                <X size={20} />
              </button>

              <h3 className="mb-2 pr-10 text-2xl font-black text-[var(--color-text)]">{selected.title}</h3>
              <div className="mb-2 flex items-center gap-2 text-[var(--color-muted)]">
                <Building2 className="h-4 w-4" />
                <span>{selected.issuer}</span>
              </div>
              <div className="mb-4 flex items-center gap-2 text-sm text-[var(--color-faint)]">
                <CalendarDays className="h-4 w-4" />
                <span>{selected.date}</span>
              </div>
              <p className="mb-6 text-sm leading-relaxed text-[var(--color-muted)]">{selected.desc}</p>

              {selected.images && selected.images.length > 0 ? (
                <div className="portfolio-panel-muted relative flex items-center justify-center rounded-2xl p-3 sm:p-4">
                  <HighQualityImage
                    src={selected.images[imageIndex]}
                    alt={`${selected.title}-${imageIndex}`}
                    className="max-h-[60vh] rounded-xl border border-[var(--color-border)] object-contain shadow-lg"
                    priority={imageIndex === 0}
                  />

                  {selected.images.length > 1 && (
                    <>
                      <button onClick={prevImage} className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/70 bg-white/90 p-2.5 text-zinc-950 shadow-lg transition-all hover:bg-white sm:left-4" aria-label="Previous certificate image">
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button onClick={nextImage} className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/70 bg-white/90 p-2.5 text-zinc-950 shadow-lg transition-all hover:bg-white sm:right-4" aria-label="Next certificate image">
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </>
                  )}

                  {selected.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/70 bg-white/90 px-3 py-1 text-sm font-bold text-zinc-950 shadow-sm">
                      {imageIndex + 1} / {selected.images.length}
                    </div>
                  )}

                  <button onClick={openOriginalLink} className="absolute right-3 top-3 z-20 flex items-center gap-1 rounded-full border border-white/70 bg-white/90 p-2 text-xs text-zinc-950 shadow-lg transition-all hover:bg-white sm:right-4 sm:top-4" title="View original">
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-[var(--color-border)] py-12 text-center text-[var(--color-muted)]">
                  <FileBadge className="mx-auto mb-4 h-12 w-12 opacity-50" />
                  <p>No certificate image available</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
