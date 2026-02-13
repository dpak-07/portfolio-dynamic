"use client";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Github, Loader2, ExternalLink, Star, Eye, X, Sparkles } from "lucide-react";
import { useFirestoreData } from "@/hooks/useFirestoreData";
import { logSectionView, logLinkClick } from "../utils/analytics";

export default function Projects() {
  const defaultImage =
    "https://1drv.ms/i/c/b09eaa48933f939d/IQTVWsrWzihRTr9b3RLtF1MuAauLX3J_kLQRQq7tOBjPxmc?width=300&height=168";

  const { data: projectsData, loading: firestoreLoading, error: firestoreError } =
    useFirestoreData("projects", "data");

  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (sectionInView) {
      logSectionView("projects");
    }
  }, [sectionInView]);

  const CATEGORY_ORDER = [
    "Cloud & Backend",
    "Full-Stack Applications",
    "AI/ML & Security",
    "Team Leadership",
    "Blockchain & Innovation",
    "Frontend & Tools",
  ];

  const categories = useMemo(() => {
    const rawCategories = projectsData?.categories || {};
    const orderedCategories = {};

    CATEGORY_ORDER.forEach((categoryName) => {
      if (rawCategories[categoryName]) {
        const sorted = [...rawCategories[categoryName]].sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        orderedCategories[categoryName] = sorted;
      }
    });

    Object.keys(rawCategories).forEach((key) => {
      if (!CATEGORY_ORDER.includes(key)) {
        const sorted = [...rawCategories[key]].sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        orderedCategories[key] = sorted;
      }
    });

    const allProjects = Object.values(orderedCategories)
      .flat()
      .sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });

    return {
      All: allProjects,
      ...orderedCategories,
    };
  }, [projectsData]);

  const categoryKeys = useMemo(() => {
    const keys = Object.keys(categories);
    return ["All", ...keys.filter(k => k !== "All")];
  }, [categories]);

  const [active, setActive] = useState("All");
  const [open, setOpen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile || !categories[active]?.length) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % categories[active].length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isMobile, active, categories]);

  const handleImageError = useCallback((e) => {
    e.target.src = defaultImage;
  }, []);

  const handleCategoryChange = useCallback((cat) => {
    setLoading(true);
    setShowAll(false);
    setTimeout(() => {
      setActive(cat);
      setLoading(false);
      setCurrentIndex(0);
    }, 400);
  }, []);

  const visibleProjects = useMemo(() => {
    const projects = categories[active] || [];
    if (isMobile) return [projects[currentIndex]];
    if (showAll) return projects;
    return projects.slice(0, 2);
  }, [categories, active, showAll, isMobile, currentIndex]);

  const hasMore = (categories[active]?.length || 0) > 2;

  if (firestoreError) {
    return (
      <section id="projects" className="relative min-h-screen py-20 px-6 bg-black">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-red-400 mb-4">Failed to Load Projects</h2>
          <p className="text-white/70">{firestoreError}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative min-h-screen py-20 px-6 overflow-hidden"
    >
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(circle at 20% 30%, rgba(0,255,255,0.05) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 70%, rgba(138,43,226,0.05) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 50%, rgba(0,255,255,0.05) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 30%, rgba(0,255,255,0.05) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.8, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Smooth Intro Header */}
      <motion.div
        className="relative z-10 text-center mb-16"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "backOut" }}
          className="inline-block"
        >
          <motion.h2
            className="text-5xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-4"
            animate={{
              backgroundPosition: ["0%", "100%", "0%"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundSize: "200% auto",
            }}
          >
            Featured Projects
          </motion.h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-white/60 text-base sm:text-lg"
        >
          Building solutions that make a difference
        </motion.p>

        {/* Decorative Line */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: 120, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="h-1 bg-gradient-to-r from-cyan-400 to-purple-600 mx-auto mt-6 rounded-full"
        />
      </motion.div>

      {/* Category Pills */}
      <motion.div
        className="flex flex-wrap justify-center gap-3 mb-12 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
      >
        {categoryKeys.map((cat, idx) => (
          <motion.button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.5 + idx * 0.05,
              type: "spring",
              stiffness: 200,
            }}
            whileHover={{
              scale: 1.08,
              y: -2,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all relative overflow-hidden ${active === cat
                ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/30"
                : "bg-white/5 text-white/70 border border-white/10 hover:border-cyan-400/40 hover:text-white hover:bg-white/10"
              }`}
          >
            {/* Shine effect on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
            <span className="relative z-10">{cat}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Loader */}
      <AnimatePresence>
        {(loading || firestoreLoading) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center h-60"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <Loader2 size={50} className="text-cyan-400" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects Grid */}
      <AnimatePresence mode="wait">
        {!loading && !firestoreLoading && (
          <>
            {/* Desktop Grid */}
            <motion.div
              key={`grid-${active}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className={`hidden md:grid gap-8 relative z-10 max-w-7xl mx-auto transition-all duration-500`}
              style={{
                gridTemplateColumns: showAll
                  ? 'repeat(auto-fill, minmax(320px, 1fr))'
                  : 'repeat(2, 1fr)'
              }}
            >
              {visibleProjects.map((p, i) => (
                <ProjectCard
                  key={`${p.title}-${i}`}
                  p={p}
                  i={i}
                  setOpen={setOpen}
                  handleImageError={handleImageError}
                  defaultImage={defaultImage}
                  hoveredCard={hoveredCard}
                  setHoveredCard={setHoveredCard}
                />
              ))}
            </motion.div>

            {/* Mobile Carousel */}
            <div className="md:hidden relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${active}-mobile-${currentIndex}`}
                  initial={{ opacity: 0, x: 100, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -100, scale: 0.9 }}
                  transition={{ duration: 0.4, type: "spring" }}
                >
                  {visibleProjects.map((p, i) => (
                    <ProjectCard
                      key={`${p.title}-mobile-${i}`}
                      p={p}
                      i={0}
                      setOpen={setOpen}
                      handleImageError={handleImageError}
                      defaultImage={defaultImage}
                      isMobile={true}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Mobile Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {categories[active]?.map((_, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`rounded-full transition-all ${idx === currentIndex
                        ? "w-8 h-2 bg-cyan-400 shadow-[0_0_8px_rgba(0,255,255,0.6)]"
                        : "w-2 h-2 bg-white/30 hover:bg-white/50"
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* View More Button */}
            {!isMobile && hasMore && (
              <motion.div
                className="flex justify-center mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.button
                  onClick={() => {
                    setShowAll(!showAll);
                    logLinkClick(showAll ? "projects_view_less" : "projects_view_more");
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold text-base shadow-lg hover:shadow-cyan-500/40 transition-all flex items-center gap-2 relative overflow-hidden group"
                >
                  {/* Animated background shine */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10">{showAll ? "Show Less" : "View More"}</span>
                  <motion.span
                    animate={{ y: showAll ? [-2, 2, -2] : [2, -2, 2] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="relative z-10"
                  >
                    {showAll ? "↑" : "↓"}
                  </motion.span>
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <ProjectModal
            open={open}
            setOpen={setOpen}
            handleImageError={handleImageError}
            defaultImage={defaultImage}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/* 🎨 Enhanced Project Card with Rich Hover Animations */
function ProjectCard({ p, i, setOpen, handleImageError, defaultImage, hoveredCard, setHoveredCard, isMobile }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const isHovered = !isMobile && hoveredCard === p.title;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: i * 0.1,
        type: "spring",
        stiffness: 100,
      }}
      onMouseEnter={() => !isMobile && setHoveredCard(p.title)}
      onMouseLeave={() => !isMobile && setHoveredCard(null)}
      className="relative overflow-hidden cursor-pointer group"
      style={{ aspectRatio: '16/9' }}
    >
      {/* Card Container with Enhanced Hover Effects */}
      <motion.div
        className="relative w-full h-full border border-white/10 shadow-xl bg-black"
        style={{ borderRadius: '16px' }}
        animate={{
          scale: isHovered ? 1.03 : 1,
          rotateY: isHovered ? 2 : 0,
          rotateX: isHovered ? -1 : 0,
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
          type: "spring",
          stiffness: 300,
        }}
      >
        {/* Animated Border Glow on Hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{
            boxShadow: isHovered
              ? [
                "0 0 20px rgba(0,255,255,0.3), 0 0 40px rgba(0,255,255,0.2)",
                "0 0 30px rgba(138,43,226,0.3), 0 0 50px rgba(138,43,226,0.2)",
                "0 0 20px rgba(0,255,255,0.3), 0 0 40px rgba(0,255,255,0.2)",
              ]
              : "0 0 0px rgba(0,255,255,0)",
          }}
          transition={{
            duration: 2,
            repeat: isHovered ? Infinity : 0,
            ease: "easeInOut"
          }}
        />

        {/* Featured Badge with Pulse Animation */}
        {p.featured && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            whileHover={{
              scale: 1.1,
              rotate: [0, -5, 5, -5, 0],
              transition: { duration: 0.5 }
            }}
            transition={{ delay: 0.3 }}
            className="absolute top-4 left-4 z-20 bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <motion.div
              animate={{
                rotate: isHovered ? 360 : 0,
              }}
              transition={{ duration: 0.6 }}
            >
              <Star className="w-4 h-4 fill-black text-black" />
            </motion.div>
            <span className="text-black font-bold text-xs">Featured</span>

            {/* Sparkle effect on hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="absolute -right-1 -top-1"
                >
                  <Sparkles className="w-3 h-3 text-yellow-200" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Full Photo with Advanced Hover Effects */}
        <div
          className="w-full h-full overflow-hidden"
          style={{ borderRadius: '16px' }}
        >
          {!imgLoaded && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          )}
          <motion.img
            src={p.img || defaultImage}
            alt={p.title}
            onLoad={() => setImgLoaded(true)}
            onError={handleImageError}
            className="w-full h-full object-cover"
            animate={{
              scale: isHovered ? 1.1 : (imgLoaded ? 1 : 1.1),
              filter: isHovered ? "brightness(1.1) saturate(1.2)" : "brightness(1) saturate(1)",
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>

        {/* Dynamic Gradient Overlay */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: isHovered
              ? "linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.85), rgba(0,0,0,0.4))"
              : "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.6), transparent)"
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Animated Scan Line Effect on Hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ top: "-100%" }}
              animate={{ top: "100%" }}
              exit={{ top: "100%" }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent pointer-events-none"
              style={{ borderRadius: '16px' }}
            />
          )}
        </AnimatePresence>

        {/* Content with Staggered Animations */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <motion.h3
            className="text-2xl font-bold text-white mb-2 text-center"
            animate={{
              y: isHovered ? -5 : 0,
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          >
            {p.title}
          </motion.h3>

          {/* Hover Content with Smooth Transitions */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Description with Slide Up */}
                <motion.p
                  className="text-white/90 text-sm line-clamp-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  {p.desc}
                </motion.p>

                {/* Tech Tags with Cascade Animation */}
                <motion.div
                  className="flex flex-wrap gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  {p.tech?.slice(0, 3).map((t, idx) => (
                    <motion.span
                      key={t}
                      initial={{ opacity: 0, scale: 0.5, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      whileHover={{
                        scale: 1.15,
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.3 }
                      }}
                      transition={{
                        delay: 0.2 + idx * 0.08,
                        type: "spring",
                        stiffness: 400,
                        damping: 15
                      }}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-medium cursor-default"
                    >
                      {t}
                    </motion.span>
                  ))}
                </motion.div>

                {/* Action Buttons with Fancy Hover Effects */}
                <motion.div
                  className="flex gap-3"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  {p.url && (
                    <motion.a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => {
                        e.stopPropagation();
                        logLinkClick("project_github");
                      }}
                      whileHover={{
                        scale: 1.08,
                        y: -3,
                        boxShadow: "0 5px 20px rgba(255,255,255,0.2)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm font-medium transition-colors relative overflow-hidden group/btn"
                    >
                      {/* Button shine effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.5 }}
                      />
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Github size={16} />
                      </motion.div>
                      <span className="relative z-10">Code</span>
                    </motion.a>
                  )}

                  <motion.button
                    onClick={() => {
                      setOpen(p);
                      logLinkClick("project_details");
                    }}
                    whileHover={{
                      scale: 1.08,
                      y: -3,
                      boxShadow: "0 5px 25px rgba(0,255,255,0.4)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-black font-semibold text-sm transition-colors relative overflow-hidden"
                  >
                    {/* Pulsing background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500"
                      animate={{
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="relative z-10"
                    >
                      <Eye size={16} />
                    </motion.div>
                    <span className="relative z-10">Details</span>
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile View Button */}
          {isMobile && (
            <motion.button
              onClick={() => {
                setOpen(p);
                logLinkClick("project_details");
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-black font-semibold text-sm"
            >
              <Eye size={18} />
              <span>View Details</span>
            </motion.button>
          )}
        </div>

        {/* Animated Corner Accents on Hover */}
        <AnimatePresence>
          {isHovered && (
            <>
              {/* Top Left Corner */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyan-400 rounded-tl-2xl"
              />
              {/* Bottom Right Corner */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-purple-500 rounded-br-2xl"
              />
            </>
          )}
        </AnimatePresence>

        {/* Shimmer Effect on Load */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            duration: 1.5,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
          style={{ borderRadius: '16px' }}
        />
      </motion.div>
    </motion.div>
  );
}

/* 🎬 Enhanced Modal with Advanced Hover Animations */
function ProjectModal({ open, setOpen, handleImageError, defaultImage }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop with Blur Animation */}
      <motion.div
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        onClick={() => setOpen(null)}
        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
        animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
        transition={{ duration: 0.3 }}
      />

      {/* Modal Container */}
      <motion.div
        className="relative z-10 bg-gradient-to-br from-gray-900 to-black border border-white/20 overflow-hidden max-w-5xl w-full shadow-2xl max-h-[90vh]"
        style={{ borderRadius: '20px' }}
        initial={{ scale: 0.8, y: 100, rotateX: 15 }}
        animate={{ scale: 1, y: 0, rotateX: 0 }}
        exit={{ scale: 0.8, y: 100, rotateX: 15 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Animated Glow Border */}
        <motion.div
          className="absolute inset-0 rounded-[20px] pointer-events-none"
          animate={{
            boxShadow: [
              "0 0 30px rgba(0,255,255,0.3)",
              "0 0 50px rgba(138,43,226,0.3)",
              "0 0 30px rgba(0,255,255,0.3)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Close Button with Rotation Animation */}
        <motion.button
          onClick={() => setOpen(null)}
          initial={{ opacity: 0, rotate: -180, scale: 0 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          whileHover={{
            scale: 1.2,
            rotate: 180,
            backgroundColor: "rgba(239, 68, 68, 0.2)",
          }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/80 backdrop-blur-sm border border-white/20 text-white hover:bg-white/10 transition-all"
        >
          <X size={20} />
        </motion.button>

        {/* Featured Badge with Animations */}
        {open.featured && (
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            whileHover={{
              scale: 1.15,
              rotate: [0, -10, 10, 0],
            }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="absolute top-4 left-4 z-20 bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg cursor-pointer"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Star className="w-4 h-4 fill-black text-black" />
            </motion.div>
            <span className="text-black font-bold text-xs">Featured</span>
          </motion.div>
        )}

        {/* Content */}
        <div className="flex flex-col md:flex-row max-h-[90vh]">
          {/* Photo Section with Hover Zoom */}
          <motion.div
            className="w-full md:w-1/2 relative bg-black min-h-[300px] overflow-hidden group/img"
            style={{
              borderTopLeftRadius: '20px',
              borderBottomLeftRadius: '20px',
            }}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          >
            {!loaded && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            )}
            <motion.img
              src={open.img || defaultImage}
              alt={open.title}
              onLoad={() => setLoaded(true)}
              onError={handleImageError}
              className="w-full h-full object-cover"
              initial={{ scale: 1.2 }}
              animate={{ scale: loaded ? 1 : 1.2 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6 }}
            />

            {/* Image Overlay Effect on Hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            />
          </motion.div>

          {/* Details Section */}
          <motion.div
            className="w-full md:w-1/2 p-6 overflow-y-auto"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <motion.h2
              className="text-2xl font-black text-white mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{
                scale: 1.02,
                x: 5,
                color: "#00ffff",
              }}
            >
              {open.title}
            </motion.h2>

            <motion.p
              className="text-white/80 text-sm leading-relaxed mb-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {open.long || open.desc}
            </motion.p>

            {/* Tech Stack with Fancy Hover */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.h3
                className="text-sm font-semibold text-cyan-400 mb-2"
                whileHover={{ x: 5, scale: 1.05 }}
              >
                Technologies
              </motion.h3>
              <div className="flex flex-wrap gap-2">
                {open.tech?.map((t, idx) => (
                  <motion.span
                    key={t}
                    initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.6 + idx * 0.05,
                      type: "spring",
                      stiffness: 400,
                    }}
                    whileHover={{
                      scale: 1.15,
                      rotate: [0, -3, 3, -3, 0],
                      backgroundColor: "rgba(6, 182, 212, 0.3)",
                      borderColor: "rgba(6, 182, 212, 0.6)",
                      transition: { duration: 0.4 }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 font-medium text-xs cursor-default"
                  >
                    {t}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons with Advanced Hover Effects */}
            <motion.div
              className="flex flex-col gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {open.live && (
                <motion.a
                  href={open.live}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => logLinkClick("project_live")}
                  whileHover={{
                    scale: 1.05,
                    y: -3,
                    boxShadow: "0 10px 30px rgba(34, 197, 94, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm shadow-lg transition-colors relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <motion.div
                    whileHover={{ rotate: 45, scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ExternalLink size={18} />
                  </motion.div>
                  <span className="relative z-10">Live Demo</span>
                </motion.a>
              )}

              {open.url && (
                <motion.a
                  href={open.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => logLinkClick("project_github")}
                  whileHover={{
                    scale: 1.05,
                    y: -3,
                    boxShadow: "0 10px 30px rgba(6, 182, 212, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-black font-semibold text-sm shadow-lg transition-colors relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Github size={18} />
                  </motion.div>
                  <span className="relative z-10">View Code</span>
                </motion.a>
              )}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}