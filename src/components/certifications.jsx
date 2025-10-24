"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  FileBadge,
  Building2,
  CalendarDays,
  BookOpen,
  Briefcase,
  Award,
  Loader2,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { useFirestoreData } from "@/hooks/useFirestoreData";

// Icon mapping
const iconComponents = {
  BookOpen: BookOpen,
  Briefcase: Briefcase,
  Award: Award,
};

const containerVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 15 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Utility function to optimize OneDrive links for direct image access
const optimizeOneDriveLink = (url) => {
  if (!url) return null;
  
  try {
    // If it's already a direct image link, return as is
    if (url.match(/\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i)) {
      return url;
    }
    
    // Convert OneDrive share links to direct download links
    if (url.includes('onedrive.live.com') || url.includes('1drv.ms')) {
      // For OneDrive share links, we need to convert them to direct download links
      // This is a basic conversion - you might need to adjust based on your OneDrive link structure
      if (url.includes('1drv.ms')) {
        // Shortened OneDrive link - we'll need to expand it first
        return url; // Return original, will need server-side processing or manual conversion
      }
      
      // For direct OneDrive links, add download parameter
      const urlObj = new URL(url);
      if (!urlObj.searchParams.has('download')) {
        urlObj.searchParams.set('download', '1');
      }
      return urlObj.toString();
    }
    
    return url;
  } catch (error) {
    console.error('Error optimizing OneDrive link:', error);
    return url;
  }
};

// Preload images for better performance
const preloadImages = (imageUrls) => {
  if (!imageUrls || !Array.isArray(imageUrls)) return;
  
  imageUrls.forEach((url) => {
    const optimizedUrl = optimizeOneDriveLink(url);
    if (optimizedUrl) {
      const img = new Image();
      img.src = optimizedUrl;
    }
  });
};

// High-quality image component with optimized loading
const HighQualityImage = ({ 
  src, 
  alt, 
  className, 
  onLoad, 
  onError,
  priority = false 
}) => {
  const [optimizedSrc, setOptimizedSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) {
      setHasError(true);
      return;
    }

    const optimized = optimizeOneDriveLink(src);
    setOptimizedSrc(optimized);
    setIsLoading(true);
    setHasError(false);

    // Preload high-quality image
    const img = new Image();
    img.onload = () => {
      setIsLoading(false);
      onLoad?.();
    };
    img.onerror = () => {
      setIsLoading(false);
      setHasError(true);
      onError?.();
      console.error('Failed to load image:', src);
    };
    img.src = optimized;

    // If priority, preload immediately
    if (priority) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = optimized;
      document.head.appendChild(link);
    }
  }, [src, onLoad, onError, priority]);

  if (hasError || !optimizedSrc) {
    return (
      <div className={`flex items-center justify-center bg-gray-800 rounded-lg ${className}`}>
        <div className="text-center text-gray-400">
          <FileBadge className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Image not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          >
            <Loader2 size={32} className="text-cyan-400" />
          </motion.div>
        </div>
      )}
      <img
        src={optimizedSrc}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
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
};

export default function CertificationsSection() {
  // 🔥 Fetch certifications from Firestore
  const { data: certsData, loading: firestoreLoading, error: firestoreError } = useFirestoreData('certifications', 'data');

  // Parse Firestore data and map icons
  const certificateData = certsData ? {
    categories: certsData.categories.map(cat => ({
      ...cat,
      icon: iconComponents[cat.icon] ? React.createElement(iconComponents[cat.icon], { 
        className: "w-5 h-5 text-cyan-400" 
      }) : null
    }))
  } : {
    categories: [
      {
        id: "courses",
        label: "Courses",
        icon: <BookOpen className="w-5 h-5 text-cyan-400" />,
        items: [],
      },
      {
        id: "internships",
        label: "Internships", 
        icon: <Briefcase className="w-5 h-5 text-purple-400" />,
        items: [],
      },
      {
        id: "participations",
        label: "Participations",
        icon: <Award className="w-5 h-5 text-amber-400" />,
        items: [],
      },
    ],
  };

  const [active, setActive] = useState("courses");
  const [selected, setSelected] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [imageLoadingStates, setImageLoadingStates] = useState({});
  const [scrollProgress, setScrollProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const sectionRef = useRef(null);
  const scrollRef = useRef(null);
  const progressControls = useAnimation();
  const dropdownRef = useRef(null);

  const activeCategory = certificateData.categories.find(
    (cat) => cat.id === active
  );

  // Preload images for active category when data changes
  useEffect(() => {
    if (activeCategory?.items) {
      activeCategory.items.forEach(item => {
        if (item.images && item.images.length > 0) {
          preloadImages(item.images);
        }
      });
    }
  }, [activeCategory]);

  // Preload all images when selected item changes
  useEffect(() => {
    if (selected?.images) {
      preloadImages(selected.images);
    }
  }, [selected]);

  const handleCategoryChange = (cat) => {
    setLoading(true);
    setIsDropdownOpen(false);
    setTimeout(() => {
      setActive(cat);
      setLoading(false);
    }, 400);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll progress bar update (for desktop)
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const progress =
        container.scrollLeft /
        (container.scrollWidth - container.clientWidth);
      setScrollProgress(progress);
      progressControls.start({ scaleX: progress });
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [progressControls]);

  // Reset image loading when selected item changes
  useEffect(() => {
    if (selected) {
      setImageIndex(0);
      // Reset loading states for all images of selected item
      const newLoadingStates = {};
      selected.images?.forEach((_, index) => {
        newLoadingStates[index] = true;
      });
      setImageLoadingStates(newLoadingStates);
    }
  }, [selected]);

  // Auto image carousel
  useEffect(() => {
    if (!selected?.images || selected.images.length <= 1) return;
    const timer = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % selected.images.length);
    }, 5000); // Increased interval for high-quality images
    return () => clearInterval(timer);
  }, [selected]);

  const nextImage = () => {
    if (!selected?.images) return;
    setImageIndex((prev) => (prev + 1) % selected.images.length);
  };

  const prevImage = () => {
    if (!selected?.images) return;
    setImageIndex(
      (prev) => (prev - 1 + selected.images.length) % selected.images.length
    );
  };

  const handleImageLoad = (index) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [index]: false
    }));
  };

  const handleImageError = (index) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [index]: false
    }));
    console.error("Failed to load image:", selected?.images?.[index]);
  };

  // Function to open original OneDrive link
  const openOriginalLink = () => {
    if (selected?.images?.[imageIndex]) {
      window.open(selected.images[imageIndex], '_blank', 'noopener noreferrer');
    }
  };

  // Show error state if Firestore fails
  if (firestoreError) {
    return (
      <section id="certifications" className="relative w-full min-h-screen px-6 py-16 text-white overflow-hidden bg-[radial-gradient(circle_at_top_left,#0a0a0a_0%,#000000_60%,#050505_100%)]">
        <div className="relative z-10 text-center">
          <h2 className="text-3xl font-bold text-red-400 mb-4">Failed to Load Certifications</h2>
          <p className="text-white/70">{firestoreError}</p>
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
      transition={{ duration: 1 }}
      className="relative w-full min-h-screen px-6 py-16 text-white overflow-hidden bg-[radial-gradient(circle_at_top_left,#0a0a0a_0%,#000000_60%,#050505_100%)]"
    >
      {/* Animated BG */}
      <motion.div
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,255,0.08),rgba(0,0,0,0.9))] pointer-events-none"
      ></motion.div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

      {/* Title */}
      <h2 className="text-4xl md:text-5xl font-bold mb-10 text-center tracking-wide">
        🪄 My Certifications & Milestones
      </h2>

      {/* Desktop Tabs */}
      <div className="hidden md:flex justify-center flex-wrap gap-4 mb-10">
        {certificateData.categories.map((cat) => (
          <motion.button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium border transition-all ${
              active === cat.id
                ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                : "border-gray-600 hover:border-white"
            }`}
          >
            {cat.icon}
            {cat.label}
          </motion.button>
        ))}
      </div>

      {/* Mobile Dropdown */}
      <div className="md:hidden relative mb-8" ref={dropdownRef}>
        <motion.button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-600 bg-white/5 backdrop-blur-lg"
        >
          <div className="flex items-center gap-2">
            {certificateData.categories.find(cat => cat.id === active)?.icon}
            <span>{certificateData.categories.find(cat => cat.id === active)?.label}</span>
          </div>
          <motion.div
            animate={{ rotate: isDropdownOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden z-20"
            >
              {certificateData.categories.map((cat) => (
                <motion.button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                  className={`w-full flex items-center gap-2 px-4 py-3 text-left border-b border-white/10 last:border-b-0 ${
                    active === cat.id ? "bg-cyan-400/20" : ""
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loader */}
      <AnimatePresence>
        {(loading || firestoreLoading) && (
          <motion.div
            key="loader"
            className="flex justify-center items-center h-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            >
              <Loader2 size={40} className="text-cyan-400" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Certificates - Stacked on Mobile */}
      <AnimatePresence mode="wait">
        {!loading && !firestoreLoading && (
          <motion.div
            key={active}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="max-w-6xl mx-auto"
          >
            {/* Mobile: Vertical Stack */}
            <div className="md:hidden space-y-4">
              {activeCategory?.items?.map((item, i) => (
                <motion.div
                  key={i}
                  variants={cardVariants}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 0 25px rgba(255,255,255,0.15)",
                  }}
                  transition={{ type: "spring", stiffness: 180, damping: 14 }}
                  onClick={() => {
                    setSelected(item);
                    setImageIndex(0);
                  }}
                  className="cursor-pointer p-6 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-lg text-left relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-20 transition-all"></div>

                  <div className="flex items-center gap-2 mb-1">
                    <FileBadge className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                  </div>

                  <div className="flex items-center gap-2 mb-1 text-gray-400 text-sm">
                    <Building2 className="w-4 h-4" /> {item.issuer}
                  </div>

                  <div className="flex items-center gap-2 mb-2 text-gray-500 text-xs">
                    <CalendarDays className="w-4 h-4" /> {item.date}
                  </div>

                  <p className="text-gray-300 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Desktop: Grid Layout */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 overflow-visible">
              {activeCategory?.items?.map((item, i) => (
                <motion.div
                  key={i}
                  variants={cardVariants}
                  whileHover={{
                    scale: 1.05,
                    rotateX: 2,
                    rotateY: -2,
                    boxShadow:
                      "0 0 25px rgba(255,255,255,0.15), 0 0 50px rgba(0,255,255,0.1)",
                  }}
                  transition={{ type: "spring", stiffness: 180, damping: 14 }}
                  onClick={() => {
                    setSelected(item);
                    setImageIndex(0);
                  }}
                  className="cursor-pointer p-6 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-lg text-left relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-20 transition-all"></div>

                  <div className="flex items-center gap-2 mb-1">
                    <FileBadge className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                  </div>

                  <div className="flex items-center gap-2 mb-1 text-gray-400 text-sm">
                    <Building2 className="w-4 h-4" /> {item.issuer}
                  </div>

                  <div className="flex items-center gap-2 mb-2 text-gray-500 text-xs">
                    <CalendarDays className="w-4 h-4" /> {item.date}
                  </div>

                  <p className="text-gray-300 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 12 }}
              className="relative bg-white/10 border border-white/20 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto backdrop-blur-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-1"
              >
                <X size={24} />
              </button>

              <h3 className="text-2xl font-semibold mb-2 pr-8">{selected.title}</h3>
              <div className="flex items-center gap-2 mb-2 text-gray-300">
                <Building2 className="w-4 h-4" />
                <span>{selected.issuer}</span>
              </div>
              <div className="flex items-center gap-2 mb-4 text-gray-400 text-sm">
                <CalendarDays className="w-4 h-4" />
                <span>{selected.date}</span>
              </div>
              <p className="text-gray-300 text-sm mb-6">{selected.desc}</p>

              {selected.images && selected.images.length > 0 && (
                <div className="relative flex justify-center items-center bg-black/30 rounded-lg p-4">
                  {/* High Quality Image Component */}
                  <HighQualityImage
                    src={selected.images[imageIndex]}
                    alt={`${selected.title}-${imageIndex}`}
                    className="rounded-lg border border-white/20 shadow-lg max-h-[60vh] object-contain"
                    onLoad={() => handleImageLoad(imageIndex)}
                    onError={() => handleImageError(imageIndex)}
                    priority={imageIndex === 0}
                  />

                  {/* Navigation Arrows */}
                  {selected.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 p-3 rounded-full border border-white/30 transition-all z-20"
                      >
                        <ChevronLeft className="w-6 h-6 text-white" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 p-3 rounded-full border border-white/30 transition-all z-20"
                      >
                        <ChevronRight className="w-6 h-6 text-white" />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {selected.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 px-3 py-1 rounded-full text-sm text-white border border-white/20">
                      {imageIndex + 1} / {selected.images.length}
                    </div>
                  )}

                  {/* View Original Button */}
                  <button
                    onClick={openOriginalLink}
                    className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 p-2 rounded-full border border-white/30 transition-all z-20 flex items-center gap-1 text-xs"
                    title="View original in OneDrive"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Fallback if no images */}
              {(!selected.images || selected.images.length === 0) && (
                <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-600 rounded-lg">
                  <FileBadge className="w-12 h-12 mx-auto mb-4 opacity-50" />
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