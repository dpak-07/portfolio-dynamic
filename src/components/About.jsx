import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  FaCloud,
  FaBrain,
  FaLaptopCode,
  FaGraduationCap,
  FaTrophy,
  FaCompass,
  FaChevronDown,
  FaChevronUp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBolt,
} from "react-icons/fa";
import { useFirestoreData } from "@/hooks/useFirestoreData";

/* ============================================================================
   UTILITY FUNCTIONS
============================================================================ */
function mergeDeep(defaultObj, overrideObj) {
  if (!overrideObj) return defaultObj;
  const out = JSON.parse(JSON.stringify(defaultObj));
  const merge = (t, s) => {
    for (const k of Object.keys(s)) {
      const v = s[k];
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        t[k] = t[k] || {};
        merge(t[k], v);
      } else {
        t[k] = v;
      }
    }
  };
  merge(out, overrideObj);
  return out;
}

/* ============================================================================
   ICON MAPPING
============================================================================ */
const iconMap = {
  graduation: <FaGraduationCap size={22} />,
  brain: <FaBrain size={22} />,
  laptop: <FaLaptopCode size={22} />,
  cloud: <FaCloud size={22} />,
  trophy: <FaTrophy size={22} />,
  compass: <FaCompass size={22} />,
};

/* ============================================================================
   LOADING SPINNER
============================================================================ */
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="relative">
        <motion.div
          className="w-16 h-16 rounded-full border-4 border-cyan-500/20"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-cyan-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-cyan-500"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
    </div>
  );
}

/* ============================================================================
   COUNTER COMPONENT - FIXED
============================================================================ */
function Counter({ to = 0, ms = 1200, play = false }) {
  const [val, setVal] = useState(0);
  const hasAnimatedRef = useRef(false);
  
  useEffect(() => {
    if (!play || hasAnimatedRef.current) return;
    
    hasAnimatedRef.current = true;
    let raf;
    let start;
    
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / ms, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(eased * to));
      
      if (p < 1) {
        raf = requestAnimationFrame(step);
      }
    };
    
    raf = requestAnimationFrame(step);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [to, play, ms]);
  
  return <span className="block text-3xl md:text-4xl font-bold text-white">{val}</span>;
}

/* ============================================================================
   ANIMATION VARIANTS - UNCHANGED
============================================================================ */
const page = {
  hidden: { opacity: 0, y: 40, scale: 0.95, rotateX: 5, filter: 'blur(10px)' },
  enter: { 
    opacity: 1, y: 0, scale: 1, rotateX: 0, filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.12, delay: 0.1 }
  },
  exit: { 
    opacity: 0, y: -30, scale: 0.95, rotateX: -5, filter: 'blur(8px)',
    transition: { duration: 0.6, ease: [0.65, 0, 0.35, 1] }
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  enter: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1, duration: 0.5 } },
  exit: { opacity: 0, transition: { staggerChildren: 0.05, staggerDirection: -1, duration: 0.3 } }
};

const itemFade = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  enter: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.3, ease: [0.65, 0, 0.35, 1] } }
};

const cardFactory = (isMobile) => ({
  hidden: (i) => ({ 
    opacity: 0, y: isMobile ? 60 : 30, x: isMobile ? 0 : -20, scale: isMobile ? 0.8 : 0.95,
    rotateX: isMobile ? 15 : 10, rotateY: isMobile ? 0 : -15, filter: 'blur(10px)'
  }),
  enter: (i) => ({ 
    opacity: 1, y: 0, x: 0, scale: 1, rotateX: 0, rotateY: 0, filter: 'blur(0px)',
    transition: { duration: isMobile ? 0.8 : 0.6, delay: isMobile ? i * 0.15 : i * 0.08, ease: [0.22, 1, 0.36, 1] } 
  }),
  exit: (i) => ({ 
    opacity: 0, y: isMobile ? 40 : -20, scale: isMobile ? 0.85 : 0.95, filter: 'blur(8px)',
    transition: { duration: isMobile ? 0.5 : 0.4, delay: isMobile ? (i * 0.1) : 0, ease: [0.65, 0, 0.35, 1] } 
  }),
  hover: { scale: isMobile ? 1.02 : 1.05, y: isMobile ? -4 : -8, transition: { duration: 0.3, ease: "easeOut" } },
  tap: { scale: 0.98, transition: { duration: 0.2, ease: "easeOut" } }
});

const imgFloat = (reduceMotion) => ({
  idle: { y: 0, rotate: 0, scale: 1, filter: 'brightness(1)' },
  float: reduceMotion ? { y: 0, rotate: 0, scale: 1, filter: 'brightness(1)' } : { 
    y: [-8, 8, -8], rotate: [-1, 1, -1], scale: [1, 1.02, 1], filter: ['brightness(1)', 'brightness(1.1)', 'brightness(1)']
  }
});

/* ============================================================================
   SHIMMER & STYLES
============================================================================ */
function Shimmer() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopOpacity="0" />
          <stop offset="45%" stopOpacity="0.06" />
          <stop offset="100%" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g1)" transform="skewX(-12)" />
    </svg>
  );
}

function InjectStyles() {
  return (
    <style>
      {`
      @keyframes gradientMove { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
      .fancy-border { position: relative; overflow: hidden; border-radius: 14px; }
      .fancy-border::before {
        content: '';
        position: absolute; inset: -2px; z-index: 0; border-radius: 14px; padding: 2px;
        background: linear-gradient(90deg, rgba(0,229,255,0.08), rgba(0,0,0,0) 30%, rgba(0,229,255,0.04));
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor; mask-composite: exclude;
        animation: gradientMove 8s linear infinite;
      }
      .inner-glass { position: relative; z-index: 1; background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); box-shadow: inset 0 2px 10px rgba(0,0,0,0.42), 0 6px 18px rgba(0,0,0,0.45); }
      .pulse-hover:hover { box-shadow: 0 10px 30px rgba(0,229,255,0.08); transform: translateY(-4px) scale(1.01); }
      @media (max-width: 640px) {
        .inner-glass { background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)); box-shadow: inset 0 2px 8px rgba(0,0,0,0.4), 0 8px 16px rgba(0,0,0,0.3); }
        .fancy-border::before { background: linear-gradient(90deg, rgba(0,229,255,0.1), rgba(0,0,0,0) 30%, rgba(0,229,255,0.05)); }
      }
      `}
    </style>
  );
}

/* ============================================================================
   MAIN COMPONENT
============================================================================ */
export default function AboutWithDriveImage({ overrideConfig }) {
  const { data: firestoreData, loading, error } = useFirestoreData("aboutpage", "main");

  const cfg = useMemo(() => {
    if (!firestoreData && loading) return null;
    if (!firestoreData && !loading) return null;
    let baseConfig = firestoreData;
    if (overrideConfig) baseConfig = mergeDeep(firestoreData, overrideConfig);
    return baseConfig;
  }, [firestoreData, overrideConfig, loading]);

  const [mode, setMode] = useState("holo");
  const [hovered, setHovered] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [contentExpanded, setContentExpanded] = useState(false);
  const [rightExpanded, setRightExpanded] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [imgFailed, setImgFailed] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgSize, setImgSize] = useState({ width: "14rem", height: "14rem" });
  const [reduceMotion, setReduceMotion] = useState(false);
  const [countersVisible, setCountersVisible] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  const countersRef = useRef(null);
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { once: true, amount: 0.14 });

  useEffect(() => {
    if (cfg?.image?.url) {
      setImgSrc(cfg.image.url);
      setImgFailed(false);
      setImgLoaded(false);
    }
  }, [cfg?.image?.url]);

  useEffect(() => {
    if (sectionInView) {
      const t = setTimeout(() => setIntroDone(true), 120);
      return () => clearTimeout(t);
    }
  }, [sectionInView]);

  // ⚡ FIXED: Counter activation
  useEffect(() => {
    if (!loading && cfg && cfg.counters && cfg.counters.length > 0 && !countersVisible) {
      const timer = setTimeout(() => {
        setCountersVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [loading, cfg, countersVisible]);

  useEffect(() => {
    try {
      const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
      setReduceMotion(Boolean(mq?.matches));
      const handler = (e) => setReduceMotion(e.matches);
      if (mq?.addEventListener) mq.addEventListener("change", handler);
      return () => mq?.removeEventListener?.("change", handler);
    } catch (e) {}
  }, []);

  useEffect(() => {
    const computeSize = () => {
      const w = window.innerWidth;
      const mobile = w < 768;
      setIsMobile(mobile);
      
      if (mobile) {
        const size = Math.round(Math.min(w * 0.92, 300));
        setImgSize({ width: `${size}px`, height: `${size}px`, maxWidth: '100%' });
      } else if (w < 1024) {
        const size = rightExpanded ? "22rem" : "16rem";
        setImgSize({ width: size, height: size, maxWidth: '100%' });
      } else {
        const size = rightExpanded ? "20rem" : "16rem";
        setImgSize({ width: size, height: size, maxWidth: '100%' });
      }
    };
    computeSize();
    
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(computeSize, 100);
    };
    
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, [rightExpanded]);

  const onImgError = () => {
    setImgFailed(true);
    setImgLoaded(true);
  };
  
  const onImgLoad = () => {
    setImgLoaded(true);
    setImgFailed(false);
  };

  if (!cfg || loading) {
    return (
      <motion.section id="about" className="relative w-full py-8 px-4 sm:py-14 sm:px-6 md:py-20 md:px-8 lg:px-10 overflow-hidden">
        <InjectStyles />
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white font-[Orbitron] mb-6">About Me</h2>
          <LoadingSpinner />
        </div>
      </motion.section>
    );
  }

  const cards = cfg.cards || [];
  const counterData = cfg.counters || [];
  const iframeFallback = cfg.image?.iframeFallbackUrl || imgSrc;
  const variantsForImg = imgFloat(reduceMotion);
  const cardVariants = cardFactory(isMobile);

  const orbsVariants = {
    animate: { scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], transition: { duration: 8, repeat: Infinity, ease: "easeInOut" } }
  };

  return (
    <motion.section
      id="about"
      ref={sectionRef}
      className="relative w-full py-8 px-4 sm:py-14 sm:px-6 md:py-20 md:px-8 lg:px-10 overflow-hidden"
      variants={page}
      initial="hidden"
      whileInView="enter"
      viewport={{ once: true, amount: 0.12 }}
      exit="exit"
      aria-busy={!imgLoaded}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-3xl" variants={orbsVariants} animate="animate" />
        <motion.div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl" variants={orbsVariants} animate="animate" style={{ animationDelay: "2s" }} />
        <motion.div className="absolute top-1/2 left-1/3 w-72 h-72 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 blur-3xl" variants={orbsVariants} animate="animate" style={{ animationDelay: "4s" }} />
      </div>
      
      <InjectStyles />

      <AnimatePresence>
        {!introDone && (
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "110%" }}
            exit={{ x: "110%" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-40 pointer-events-none"
            style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.86) 0%, rgba(0,0,0,0.6) 30%, rgba(0,229,255,0.06) 100%)' }}
          />
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <motion.h2 
            variants={itemFade} 
            initial="hidden" 
            animate={sectionInView ? "enter" : "hidden"} 
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-white font-[Orbitron]"
          >
            About Me
          </motion.h2>
          <motion.div 
            variants={itemFade} 
            initial="hidden" 
            animate={sectionInView ? "enter" : "hidden"} 
            transition={{ delay: 0.08 }} 
            className="flex gap-2 bg-white/8 backdrop-blur-md rounded-full p-1.5 border border-white/10 w-full sm:w-auto"
          >
            <motion.button 
              whileTap={{ scale: 0.96 }} 
              onClick={() => setMode("mosaic")} 
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-full text-sm md:text-base font-medium transition-all duration-300 ${
                mode === "mosaic" ? "bg-cyansoft text-black shadow-lg shadow-cyan-500/20" : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              Mosaic
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.96 }} 
              onClick={() => setMode("holo")} 
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-full text-sm md:text-base font-medium transition-all duration-300 ${
                mode === "holo" ? "bg-cyan-300 text-black shadow-lg shadow-cyan-500/20" : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              Holo
            </motion.button>
          </motion.div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {mode === "mosaic" ? (
            <motion.div key="mosaic" variants={staggerContainer} initial="hidden" animate="enter" exit="exit" className={`${isMobile ? "grid grid-cols-1 gap-3" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"}`}>
              {isMobile ? (
                <div className="col-span-3">
                  <motion.div className="flex flex-col gap-4 px-4 py-3">
                    {cards.map((c, i) => (
                      <motion.article
                        key={c.id}
                        custom={i}
                        variants={cardVariants}
                        onPointerEnter={() => setHovered(c.id)}
                        onPointerLeave={() => setHovered(null)}
                        whileTap={{ scale: 0.98 }}
                        className="fancy-border inner-glass pulse-hover w-full rounded-2xl p-5 backdrop-blur-xl transform-gpu"
                        onClick={() => setExpandedCard((s) => (s === c.id ? null : c.id))}
                        aria-expanded={expandedCard === c.id}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-white/5 border border-white/6 text-cyan-200">{iconMap[c.icon]}</div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-white">{c.title}</h3>
                            <p className="text-xs text-white/70 mt-1">{c.short}</p>
                          </div>
                          <div className="ml-2 self-start text-white/70">{expandedCard === c.id ? <FaChevronUp /> : <FaChevronDown />}</div>
                        </div>
                        <AnimatePresence>
                          {expandedCard === c.id && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto", marginTop: 10 }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.28 }} className="text-sm text-white/80 overflow-hidden mt-2">
                              <p>{c.long}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.article>
                    ))}
                  </motion.div>
                  <div className="text-xs text-white/60 mt-2 px-3">Tap a card to expand.</div>
                </div>
              ) : (
                <motion.div variants={staggerContainer} initial="hidden" animate="enter" className="col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                  {cards.map((c, i) => (
                    <motion.article
                      key={c.id}
                      custom={i}
                      variants={cardVariants}
                      onPointerEnter={() => setHovered(c.id)}
                      onPointerLeave={() => setHovered(null)}
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.995 }}
                      className="fancy-border inner-glass pulse-hover relative rounded-2xl p-5 min-h-[140px] transform transition-all duration-200 overflow-hidden"
                    >
                      <div className="flex items-start gap-3 relative z-10">
                        <div className="p-2 rounded-lg bg-white/5 border border-white/6 text-cyan-200">{iconMap[c.icon]}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base md:text-lg font-semibold text-white">{c.title}</h3>
                          <p className="text-xs md:text-sm text-white/70 mt-1">{c.short}</p>
                        </div>
                      </div>
                      <motion.div layout initial={{ opacity: 0, height: 0 }} animate={hovered === c.id ? { opacity: 1, height: "auto", marginTop: 10 } : { opacity: 0, height: 0, marginTop: 0 }} className="mt-3 text-sm text-white/80 overflow-hidden relative z-10">
                        <p>{c.long}</p>
                      </motion.div>
                    </motion.article>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="holo" 
              variants={staggerContainer} 
              initial="hidden" 
              animate="enter" 
              exit="exit" 
              className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 items-stretch mx-auto max-w-[95%] sm:max-w-[90%] md:max-w-none"
            >
              <motion.div 
                layout 
                key="profile-card" 
                custom={0}
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
                className="md:col-span-1 flex items-stretch w-full transform-gpu perspective-1000"
              >
                <div className="relative rounded-2xl p-4 sm:p-5 md:p-6 border border-white/8 bg-gradient-to-br from-white/3 to-white/6 backdrop-blur-xl shadow-lg w-full flex flex-col h-full overflow-hidden fancy-border inner-glass">
                  <motion.div
                    aria-hidden
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="absolute -left-1/4 -top-1/4 w-[150%] h-[150%] rounded-full blur-3xl bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-indigo-600/5 pointer-events-none transform -rotate-12"
                  />

                  <div className="flex flex-col items-center flex-1 min-h-0">
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.48 }} className="relative rounded-2xl overflow-hidden border-2 border-cyansoft shadow-[0_0_28px_rgba(0,229,255,0.10)]">
                      <motion.div
                        variants={variantsForImg}
                        initial="idle"
                        animate={rightExpanded ? "float" : "idle"}
                        transition={reduceMotion ? { duration: 0 } : { duration: 3.6, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
                        style={{ width: imgSize.width, height: imgSize.height }}
                        className="rounded-2xl overflow-hidden bg-black relative"
                      >
                        {!imgLoaded && (
                          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30">
                            <svg className="w-10 h-10 animate-spin text-white/90" viewBox="0 0 50 50" aria-hidden>
                              <circle className="opacity-25" cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                              <path className="opacity-90" fill="currentColor" d="M43.94 25c0-10.41-8.43-18.85-18.85-18.85-10.41 0-18.85 8.44-18.85 18.85h4.07c0-8.16 6.62-14.78 14.78-14.78 8.16 0 14.78 6.62 14.78 14.78H43.94z"></path>
                            </svg>
                          </div>
                        )}

                        {!imgFailed && imgSrc ? (
                          <img
                            src={imgSrc}
                            alt="Profile"
                            loading="lazy"
                            onError={onImgError}
                            onLoad={onImgLoad}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          />
                        ) : (
                          iframeFallback ? (
                            <iframe
                              src={iframeFallback}
                              className="w-full h-full border-0"
                              title="OneDrive Profile"
                              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                              style={{ display: "block", minHeight: "100%", minWidth: "100%" }}
                              onLoad={() => setImgLoaded(true)}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-black/60 text-white/80">No image</div>
                          )
                        )}

                        <AnimatePresence>
                          {rightExpanded && imgLoaded && !reduceMotion && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }} className="absolute inset-0 pointer-events-none rounded-2xl" style={{ boxShadow: "inset 0 0 40px rgba(0,229,255,0.08), 0 18px 60px rgba(0,229,255,0.05)" }} />
                          )}
                        </AnimatePresence>

                        <div className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-60 transition-opacity duration-500">
                          <Shimmer />
                        </div>
                      </motion.div>
                    </motion.div>

                    <h3 className="mt-5 text-xl md:text-2xl font-bold text-white tracking-wide">Deepak</h3>
                    <p className="text-sm md:text-base text-white/80 mt-1.5">Pre-final year — AI & DS</p>

                    {/* ⚡ COUNTERS */}
                    <div ref={countersRef} className="mt-6 flex gap-8 justify-center w-full">
                      {counterData && counterData.length > 0 ? (
                        counterData.map((c, idx) => (
                          <motion.div 
                            key={c.id} 
                            initial={{ opacity: 0, y: 8 }} 
                            whileInView={{ opacity: 1, y: 0 }} 
                            viewport={{ once: true, amount: 0.6 }} 
                            className="text-center min-w-0"
                          >
                            <Counter to={Number(c.value) || 0} play={countersVisible} />
                            <span className="text-sm md:text-base text-white/70">{c.label}</span>
                          </motion.div>
                        ))
                      ) : null}
                    </div>

                    <AnimatePresence initial={false}>
                      {rightExpanded && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0, marginTop: 8 }} 
                          animate={{ opacity: 1, height: "auto", marginTop: isMobile ? 12 : 16 }} 
                          exit={{ opacity: 0, height: 0, marginTop: 8 }} 
                          transition={{ duration: 0.32 }} 
                          className="w-full mt-4"
                        >
                          <div className={`${isMobile ? 'p-3' : 'p-4'} rounded-xl bg-black/50 border border-white/8 backdrop-blur-md text-white/90`}>
                            <div className="flex flex-col gap-3 min-w-0">
                              <div className="flex items-start gap-3 text-sm md:text-base">
                                <FaMapMarkerAlt className="text-cyan-200 shrink-0 mt-0.5" />
                                <div className="min-w-0"><div className="leading-tight">Chennai, India</div></div>
                              </div>
                              <div className="flex items-start gap-3 text-sm md:text-base">
                                <FaEnvelope className="text-cyan-200 shrink-0 mt-0.5" />
                                <div className="min-w-0"><a className="underline text-white/90 break-words" href="mailto:deepakofficial0103@gmail.com">deepakofficial0103@gmail.com</a></div>
                              </div>
                              <div className="flex items-start gap-3 text-sm md:text-base">
                                <FaCalendarAlt className="text-cyan-200 shrink-0 mt-0.5" />
                                <div className="min-w-0"><div className="whitespace-nowrap">4+ years experience</div></div>
                              </div>
                              <motion.div className={`text-sm md:text-base text-white/75 leading-relaxed ${isMobile ? 'overflow-hidden' : ''}`}>
                                I focus on projects that deliver measurable public impact and scale reliably for actual users.
                              </motion.div>
                              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="text-sm md:text-base text-white/80 flex items-center gap-2.5">
                                  <FaBolt className="text-yellow-300 text-lg" />
                                  <span>Open to freelance & internships</span>
                                </div>
                                <div className="flex gap-2">
                                  <a href="#projects" className="px-3 py-1 rounded-md bg-cyansoft text-black text-sm font-medium">Projects</a>
                                  <a href="#contact" className="px-3 py-1 rounded-md border border-white/10 text-sm">Contact</a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                layout 
                key="right-stack" 
                variants={staggerContainer}
                className="md:col-span-2 flex flex-col gap-6"
              >
                <motion.div custom={1} variants={cardVariants} whileHover="hover" whileTap="tap" className="transform-gpu perspective-1000">
                  <CompactBio 
                    data={cfg.bio} 
                    onExpandedChange={(isOpen) => setRightExpanded(Boolean(isOpen))}
                    isMobile={isMobile}
                    isExpanded={isMobile ? contentExpanded : rightExpanded}
                  />
                </motion.div>
                <motion.div custom={2} variants={cardVariants} whileHover="hover" whileTap="tap" className="transform-gpu perspective-1000">
                  <RevealSegment title="Interests" content={cfg.holoSections?.find(s => s.type === "interests")?.content || "Computer Vision, NLP, Cloud AI, MLOps"} />
                </motion.div>
                <motion.div custom={3} variants={cardVariants} whileHover="hover" whileTap="tap" className="transform-gpu perspective-1000">
                  <RevealSegment title="Currently Learning" content={cfg.holoSections?.find(s => s.type === "learning")?.content || "Kubernetes for ML, transformer optimization, distributed training"} />
                </motion.div>

                <div className="mt-2 md:mt-0 p-5 rounded-2xl border border-white/6 bg-gradient-to-br from-white/3 to-white/6 backdrop-blur-md">
                  <div className="flex flex-col gap-4">
                    {isMobile && (
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setContentExpanded(!contentExpanded);
                          setRightExpanded(!contentExpanded);
                        }}
                        className={`w-full px-4 py-3 rounded-xl text-sm font-medium bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-cyan-400/20 border border-cyan-500/20 backdrop-blur-sm transition-all duration-300 transform ${
                          contentExpanded ? 'text-cyan-300 shadow-lg shadow-cyan-500/20' : 'text-white/90'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <span>{contentExpanded ? 'Show Less' : 'Read More'}</span>
                          <motion.div animate={{ rotate: contentExpanded ? 180 : 0, y: contentExpanded ? -1 : 1 }} transition={{ duration: 0.3 }}>
                            {contentExpanded ? <FaChevronUp /> : <FaChevronDown />}
                          </motion.div>
                        </div>
                      </motion.button>
                    )}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <motion.a whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }} href="#projects" className="px-5 py-2 rounded-md bg-cyansoft text-black text-sm md:text-base font-medium text-center">View Projects</motion.a>
                      <motion.a whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }} href="#contact" className="px-5 py-2 rounded-md border border-white/10 hover:bg-white/6 text-sm md:text-base text-center">Contact</motion.a>
                      <motion.a whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }} href="#resume" className="px-5 py-2 rounded-md border border-white/10 hover:bg-white/6 text-sm md:text-base text-center">Resume</motion.a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

/* ============================================================================
   SUB-COMPONENTS
============================================================================ */
const CompactBio = ({ data, onExpandedChange, isMobile, isExpanded }) => {
  const [isHovered, setIsHovered] = useState(false);
  const bioShort = data?.short || "";
  const badges = Array.isArray(data?.badges) ? data.badges : [];
  const expanded = data?.expanded || {};
  
  useEffect(() => {
    if (typeof onExpandedChange === 'function') onExpandedChange(isExpanded);
  }, [isExpanded, onExpandedChange]);

  return (
    <motion.div 
      variants={page} 
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`group relative ${
        isMobile ? 'px-4 py-4 mx-auto rounded-xl' : 'p-5 sm:p-6 md:p-7 rounded-2xl'
      } border-2 border-white/10 bg-gradient-to-br from-white/8 via-white/4 to-transparent backdrop-blur-xl overflow-hidden shadow-lg transform-gpu ${isMobile ? 'shadow-cyan-500/10' : ''}`}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        animate={{ scale: isHovered ? [1, 1.2] : 1, rotate: isHovered ? [0, 45] : 0 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
      />

      <div className="relative z-10">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <motion.h5 
              className={`${isMobile ? 'text-base font-bold mb-3' : 'text-lg md:text-xl font-bold mb-4'} text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-200 to-cyan-100 tracking-wide transform-gpu`}
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              style={{ backgroundSize: "200% auto" }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            >
              Bio
            </motion.h5>
            <motion.p className={`${isMobile ? 'text-sm leading-relaxed' : 'text-sm md:text-base lg:text-lg leading-relaxed'} text-white/90 mb-5`}>
              {bioShort}
            </motion.p>
            <motion.div className={`flex gap-2 sm:gap-3 flex-wrap ${isMobile ? 'mt-3 justify-start' : 'mt-2'}`}>
              {badges.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Badge isMobile={isMobile}>{b}</Badge>
                </motion.div>
              ))}
            </motion.div>
            {!isMobile && (
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onExpandedChange(!isExpanded)} 
                aria-expanded={isExpanded}
                className="mt-6 flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-cyan-400/20 hover:from-cyan-500/30 hover:via-blue-500/25 hover:to-cyan-400/30 border-2 border-cyan-500/20 hover:border-cyan-400/30 transition-all duration-300 text-white shadow-lg hover:shadow-cyan-500/25 transform-gpu"
              >
                <span className="text-sm font-medium tracking-wide">{isExpanded ? "Show Less" : "Read More"}</span>
                <motion.div animate={{ rotate: isExpanded ? 180 : 0, y: isExpanded ? -1 : 1 }} transition={{ duration: 0.3 }} className="text-cyan-300">
                  {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </motion.div>
              </motion.button>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isExpanded && (
            <motion.div 
              key="expanded" 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: "auto", transition: { height: { duration: isMobile ? 0.5 : 0.4 }, opacity: { duration: 0.3, delay: 0.1 } } }} 
              exit={{ opacity: 0, height: 0, transition: { height: { duration: 0.3 }, opacity: { duration: 0.2 } } }}
              className="overflow-hidden text-sm md:text-base text-white/80 mt-6"
            >
              <div className="space-y-6">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <div className="text-sm text-cyan-300/90 mb-2 font-medium">Key strengths</div>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    {expanded.strengths?.map((s, i) => (
                      <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>{s}</motion.li>
                    ))}
                  </ul>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <div className="text-sm text-cyan-300/90 mb-2 font-medium">Recent work</div>
                  <p>{expanded.recent}</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <div className="text-sm text-cyan-300/90 mb-2 font-medium">Why I build</div>
                  <p>{expanded.values}</p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{ boxShadow: isHovered ? "0 0 25px 3px rgba(0, 229, 255, 0.12), inset 0 0 25px 3px rgba(0, 229, 255, 0.08)" : "0 0 0px 0px rgba(0, 229, 255, 0), inset 0 0 0px 0px rgba(0, 229, 255, 0)" }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
  );
};

const Badge = ({ children, isMobile }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.span
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 25 } }}
      whileHover={{ scale: isMobile ? 1.02 : 1.08, y: isMobile ? -2 : -4, transition: { type: "spring", stiffness: 400, damping: 10 } }}
      whileTap={{ scale: 0.95, transition: { type: "spring", stiffness: 400, damping: 10 } }}
      className={`relative inline-block ${isMobile ? 'text-xs px-3 py-1' : 'text-xs md:text-sm px-4 py-1.5'} bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-cyan-400/15 border ${isMobile ? 'border' : 'border-2'} border-cyan-500/20 ${isMobile ? 'rounded-md' : 'rounded-lg'} text-cyan-100 font-medium tracking-wide ${isMobile ? 'shadow-sm' : 'shadow-lg'} backdrop-blur-sm transition-all duration-300 transform hover:shadow-cyan-500/25 overflow-hidden ${isMobile ? 'active:scale-95' : ''}`}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-400/20"
        animate={{ x: isHovered ? ["0%", "100%", "0%"] : "0%", opacity: isHovered ? [0.3, 0.5, 0.3] : 0 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-0"
        animate={{ boxShadow: isHovered ? ["0 0 10px 2px rgba(0,229,255,0.3), inset 0 0 4px 1px rgba(0,229,255,0.3)", "0 0 15px 3px rgba(0,229,255,0.4), inset 0 0 6px 2px rgba(0,229,255,0.4)", "0 0 10px 2px rgba(0,229,255,0.3), inset 0 0 4px 1px rgba(0,229,255,0.3)"] : "none" }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span className="relative z-10" animate={isHovered ? { y: [0, -2, 0] } : {}} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
        {children}
      </motion.span>
    </motion.span>
  );
};

const RevealSegment = ({ title, content }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      ref={ref} 
      initial={{ opacity: 0, y: 12, scale: 0.97 }} 
      animate={inView ? { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } : {}}
      whileHover={{ scale: 1.02, y: -5, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group p-5 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl shadow-lg relative overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        animate={{ scale: isHovered ? [1, 1.2] : 1, rotate: isHovered ? [0, 45] : 0 }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
      />
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100"
        animate={{ backgroundPosition: isHovered ? ["200% 0", "-200% 0"] : "0 0" }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)", backgroundSize: "200% 100%" }}
      />
      <div className="relative z-10">
        <motion.h5 initial={{ opacity: 0.8 }} animate={{ opacity: 1 }} className="text-base md:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-100 mb-2">{title}</motion.h5>
        <motion.p initial={{ opacity: 0.6 }} animate={{ opacity: 0.9 }} className="text-sm md:text-base text-white/80">{content}</motion.p>
      </div>
      <motion.div
        className="absolute inset-0 rounded-2xl"
        animate={{ boxShadow: isHovered ? "0 0 20px 2px rgba(0, 229, 255, 0.1), inset 0 0 20px 2px rgba(0, 229, 255, 0.08)" : "0 0 0px 0px rgba(0, 229, 255, 0), inset 0 0 0px 0px rgba(0, 229, 255, 0)" }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};