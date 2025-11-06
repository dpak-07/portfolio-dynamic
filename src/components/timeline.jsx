"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
  Brain,
  Code,
  Award,
  Rocket,
  Zap,
  Trophy,
  Lightbulb,
  Star,
  ArrowRight,
  TrendingUp,
  Users,
  Target,
  X,
  GraduationCap,
  Briefcase,
  Cloud,
  Link,
  Mail,
} from "lucide-react";
import { useFirestoreData } from "@/hooks/useFirestoreData";
import { logSectionView, logLinkClick, logUniqueUser } from "@/utils/analytics";

// Icon mapping - Centralized
const iconMap = {
  TrendingUp,
  Target,
  Users,
  Trophy,
  Brain,
  Code,
  Award,
  Rocket,
  Zap,
  Lightbulb,
  Star,
  GraduationCap,
  Briefcase,
  Cloud,
  Link,
  Mail
};

// Scroll reveal hook
const useScrollReveal = (threshold = 0.2) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
};

// Animated counter component
const AnimatedCounter = ({ value, duration = 2, isVisible }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const end = parseInt(value) || 0;
    const increment = end / (duration * 60);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [isVisible, value, duration]);

  return <span>{count}+</span>;
};

// Detailed modal popup with swipe to close
const DetailModal = ({ event, isOpen, onClose }) => {
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 300], [1, 0]);

  if (!event) return null;

  // Handle icon - convert string to component if needed
  const IconComponent = typeof event.icon === 'string' ? iconMap[event.icon] : event.icon;

  const handleDragEnd = (e, { offset, velocity }) => {
    if (offset.y > 100 || velocity.y > 500) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && event && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal - Swipeable */}
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none"
          >
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              onDragEnd={handleDragEnd}
              style={{ y, opacity }}
              className={`relative w-full md:max-w-3xl bg-gradient-to-br ${event.color} rounded-t-3xl md:rounded-3xl shadow-2xl border border-white/20 overflow-hidden pointer-events-auto max-h-[90vh] md:max-h-[85vh]`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Swipe indicator for mobile */}
              <div className="md:hidden sticky top-0 z-20 bg-white/10 backdrop-blur-sm py-2 flex justify-center">
                <div className="w-12 h-1.5 bg-white/40 rounded-full" />
              </div>

              {/* Background glow */}
              <div className="absolute inset-0 opacity-15 bg-white" />

              {/* Close button - Enhanced for mobile */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 flex items-center justify-center text-white z-20 transition-colors shadow-lg touch-manipulation"
                aria-label="Close modal"
              >
                <X size={20} className="md:hidden" />
                <X size={24} className="hidden md:block" />
              </motion.button>

              {/* Content - Scrollable */}
              <div className="relative z-10 p-6 md:p-12 space-y-6 md:space-y-8 overflow-y-auto max-h-[calc(90vh-3rem)] md:max-h-[calc(85vh-3rem)]">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-col md:flex-row items-start gap-4 md:gap-6 pr-12 md:pr-8"
                >
                  {IconComponent && (
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 flex items-center justify-center text-white flex-shrink-0"
                    >
                      <IconComponent size={32} className="md:hidden" />
                      <IconComponent size={40} className="hidden md:block" />
                    </motion.div>
                  )}
                  <div className="flex-1">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-xs md:text-sm font-bold text-white/70 uppercase tracking-widest mb-1 md:mb-2"
                    >
                      {event.period}
                    </motion.p>
                    <motion.h2
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-1 md:mb-2"
                    >
                      {event.title}
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-lg md:text-2xl font-semibold text-white/80"
                    >
                      {event.year}
                    </motion.p>
                  </div>
                </motion.div>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-base md:text-lg text-white/90 leading-relaxed"
                >
                  {event.description}
                </motion.p>

                {/* Achievements and Skills Grid */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="grid grid-cols-1 gap-6 md:gap-8"
                >
                  {/* Achievements */}
                  <div>
                    <p className="text-xs md:text-sm font-bold text-white/70 uppercase tracking-wider mb-3 md:mb-4">
                      ✓ Key Achievements
                    </p>
                    <div className="space-y-2 md:space-y-3">
                      {event.achievements && event.achievements.length > 0 ? (
                        event.achievements.map((achievement, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.65 + i * 0.08 }}
                            className="flex items-start gap-2 md:gap-3 p-2.5 md:p-3 rounded-lg bg-white/10"
                          >
                            <span className="w-2 h-2 rounded-full bg-white/60 mt-1.5 md:mt-2 flex-shrink-0" />
                            <span className="text-sm md:text-base text-white/80 font-medium">{achievement}</span>
                          </motion.div>
                        ))
                      ) : (
                        <p className="text-white/60 text-sm md:text-base">No achievements listed</p>
                      )}
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <p className="text-xs md:text-sm font-bold text-white/70 uppercase tracking-wider mb-3 md:mb-4">
                      🛠️ Skills & Tools
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {event.skills && event.skills.length > 0 ? (
                        event.skills.map((skill, i) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.7 + i * 0.05 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold rounded-full bg-white/20 text-white border border-white/40 hover:bg-white/30 active:bg-white/40 transition-all touch-manipulation"
                          >
                            {skill}
                          </motion.span>
                        ))
                      ) : (
                        <p className="text-white/60 text-sm md:text-base">No skills listed</p>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Bottom padding for mobile scroll */}
                <div className="h-4 md:h-0" />
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Mini card component - Rotation on desktop, smooth on mobile
const MiniCard = ({ event, onClick, isVisible, index }) => {
  // Handle icon - convert string to component if needed
  const IconComponent = typeof event.icon === 'string' ? iconMap[event.icon] : event.icon;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.15, y: -8 }}
      whileTap={{ scale: 0.95 }}
      className="flex-shrink-0 focus:outline-none touch-manipulation"
      initial={isMobile ? { opacity: 0, scale: 0.8 } : { opacity: 0, scale: 0.5, rotate: -180 }}
      animate={
        isVisible
          ? (isMobile ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1, rotate: 0 })
          : (isMobile ? { opacity: 0, scale: 0.8 } : { opacity: 0, scale: 0.5, rotate: -180 })
      }
      exit={isMobile ? { opacity: 0, scale: 0.8 } : { opacity: 0, scale: 0.5, rotate: 180 }}
      transition={
        isMobile
          ? { duration: 0.4, delay: index * 0.1, ease: "easeOut" }
          : { duration: 0.8, delay: index * 0.1, type: "spring", stiffness: 200, damping: 20 }
      }
    >
      <motion.div
        className={`w-36 h-36 md:w-48 md:h-48 rounded-2xl md:rounded-3xl bg-gradient-to-br ${event.color} border-2 border-white/30 shadow-2xl hover:shadow-2xl transition-all flex flex-col items-center justify-center gap-3 md:gap-4 cursor-pointer group overflow-hidden relative`}
      >
        {/* Background glow */}
        <motion.div 
          className="absolute inset-0 opacity-10 bg-white"
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ repeat: Infinity, duration: 3 }}
        />

        {/* Content */}
        <motion.div className="relative z-10 flex flex-col items-center justify-center h-full px-3 md:px-4">
          {IconComponent && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
            >
              <IconComponent size={40} className="text-white mb-2 md:hidden" />
              <IconComponent size={48} className="text-white mb-3 hidden md:block" />
            </motion.div>
          )}
          <p className="text-xs md:text-sm font-bold text-white/90 text-center line-clamp-3">
            {event.title}
          </p>
        </motion.div>

        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute inset-0 bg-white/25 backdrop-blur-sm rounded-2xl md:rounded-3xl flex items-center justify-center z-20"
        >
          <motion.span className="text-xs md:text-sm font-bold text-white text-center px-4 md:px-6 py-2 md:py-3 bg-white/20 rounded-lg md:rounded-xl backdrop-blur">
            {event.year}
          </motion.span>
        </motion.div>
      </motion.div>
    </motion.button>
  );
};

// Stats component
const StatsSection = () => {
  const [ref, isVisible] = useScrollReveal(0.3);
  
  // Fetch stats data from Firestore
  const { data: timelineData } = useFirestoreData("timeline", "data");
  
  const stats = timelineData?.stats || null;

  // Don't render if no stats available
  if (!stats || stats.length === 0) return null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8 }}
      className="mt-12 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
    >
      {stats.map((stat, i) => {
        // Handle both string icon names and direct icon components
        const IconComponent = typeof stat.icon === 'string' ? iconMap[stat.icon] : stat.icon;
        
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            whileHover={{ y: -5 }}
            className="p-4 md:p-6 rounded-xl md:rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-white/20 backdrop-blur transition-all text-center group"
          >
            {IconComponent && (
              <motion.div
                animate={isVisible ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
                transition={{ repeat: Infinity, duration: 3, delay: i * 0.2 }}
                className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white/10 flex items-center justify-center text-white mx-auto mb-2 md:mb-3 group-hover:bg-white/20 transition-colors"
              >
                <IconComponent size={20} className="md:hidden" />
                <IconComponent size={24} className="hidden md:block" />
              </motion.div>
            )}
            <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              <AnimatedCounter
                value={stat.value}
                duration={2.5}
                isVisible={isVisible}
              />
            </p>
            <p className="text-xs md:text-sm text-gray-400 mt-1 md:mt-2 group-hover:text-white transition-colors">
              {stat.label}
            </p>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

// Main component - Auto-scrolling carousel
export default function AutoScrollCarouselTimeline() {
  const [ref, isVisible] = useScrollReveal(0.3);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoScrollTimer = useRef(null);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Add a ref for the timeline container and expose an id for easy navigation
  const timelineRef = useRef(null);

  // Fetch timeline data from Firestore
  const { data: timelineData } = useFirestoreData("timeline", "data");
  
  // Default timeline events - fallback to null if no data
  const defaultTimelineEvents = [
    {
      year: "2022",
      period: "Started Learning",
      title: "Full-Stack Certification HDHD in (CSC)",
      icon: Award,
      color: "from-blue-400 to-indigo-500",
      accentColor: "blue",
      description: "Completed comprehensive Full Stack Web Development course at CSC - HDFC Skill Development Center, mastering C, C++, Java, and modern web technologies with extensive hands-on projects.",
      achievements: [
        "Full-stack development certification",
        "Mastered C, C++, Java",
        "Built end-to-end web applications",
      ],
      skills: ["C", "C++", "Java", "Full-Stack Development", "Web Technologies"],
    },
    {
      year: "2023",
      period: "AI & Data Science",
      title: "College - Velammal Engineering",
      icon: GraduationCap,
      color: "from-orange-400 to-red-500",
      accentColor: "orange",
      description: "Started B.Tech in AI & Data Science at Velammal Engineering College, Chennai. Specializing in Machine Learning, Deep Learning, and Data Mining.",
      achievements: [
        "3rd Year AI & Data Science",
        "Specialized in ML & Deep Learning",
        "Applied AI in real-world projects",
      ],
      skills: ["Machine Learning", "Deep Learning", "Data Mining", "Python", "TensorFlow", "PyTorch"],
    },
    {
      year: "2024",
      period: "CodeSoft Internship",
      title: "Web Development Intern",
      icon: Briefcase,
      color: "from-emerald-400 to-teal-500",
      accentColor: "emerald",
      description: "Completed web development internship at CodeSoft, building interactive calculators, responsive landing pages, and portfolio websites using HTML, CSS, and JavaScript.",
      achievements: [
        "Built interactive calculator app",
        "Created responsive landing pages",
        "Developed professional frontend skills",
      ],
      skills: ["HTML", "CSS", "JavaScript", "Frontend Development", "Responsive Design"],
    },
    {
      year: "2024-2025",
      period: "Leadership & Team Lead",
      title: "Team Lead - 404 Found US",
      icon: Trophy,
      color: "from-fuchsia-400 to-rose-500",
      accentColor: "fuchsia",
      description: "Leading 6-member team '404 Found US' for Smart India Hackathon 2025 with CredsOne project. Managing team coordination, project milestones, and mentoring members in technical domains.",
      achievements: [
        "Managing 6-member development team",
        "SIH 2025 project leadership",
        "Team coordination & mentorship",
      ],
      skills: ["Team Leadership", "Project Management", "Mentoring", "Coordination"],
    },
    {
      year: "2025",
      period: "Zidio Internship",
      title: "Backend Developer",
      icon: Rocket,
      color: "from-violet-400 to-purple-600",
      accentColor: "violet",
      description: "Developed MERN stack projects with comprehensive admin functionalities and advanced Excel data analysis platform. Gained expertise in backend architecture and database management.",
      achievements: [
        "Excel Analysis Platform built",
        "Advanced data visualization",
        "Backend architecture expertise",
      ],
      skills: ["React", "Node.js", "MongoDB", "Express", "Data Analytics", "Backend Development"],
    },
    {
      year: "2025",
      period: "AI & Blockchain Focus",
      title: "Study Spark & CredsOne",
      icon: Zap,
      color: "from-indigo-400 to-blue-600",
      accentColor: "indigo",
      description: "Building AI-powered learning platform Study Spark (VECT Hackelite 2025) with Llama 3 integration and CredsOne blockchain credential system for SIH 2025.",
      achievements: [
        "Study Spark AI platform developed",
        "CredsOne blockchain system (SIH 2025)",
        "Llama 3 AI integration",
      ],
      skills: ["AI/ML", "Llama 3", "Blockchain", "React", "Node.js", "Web3"],
    },
    {
      year: "2025",
      period: "Cloud & Security",
      title: "Multi-Domain Expertise",
      icon: Cloud,
      color: "from-cyan-400 to-emerald-500",
      accentColor: "cyan",
      description: "Working on Phushit security app for fake website detection and Velammal College website as backend & cloud engineer with AWS deployment.",
      achievements: [
        "Phushit multi-platform security app",
        "Velammal website backend & cloud",
        "AWS & Docker deployment",
      ],
      skills: ["AWS EC2", "AWS S3", "Flask", "Security", "Cloud Engineering"],
    },
    {
      year: "2025",
      period: "UI/UX & Design",
      title: "Noviteck UI/UX Master Class",
      icon: Lightbulb,
      color: "from-rose-400 to-pink-500",
      accentColor: "rose",
      description: "Completed intensive 30-day UI/UX Design Master Class covering Figma, WordPress, and modern design principles with practical project work.",
      achievements: [
        "30-day intensive UI/UX training",
        "Figma & WordPress expertise",
        "User-centered design skills",
      ],
      skills: ["Figma", "WordPress", "UI/UX Design", "Prototyping"],
    },
  ];

  const timelineEvents = timelineData?.events || defaultTimelineEvents;

  // Analytics - Log section view and unique user
  useEffect(() => {
    logSectionView("journey-timeline");
    logUniqueUser();
  }, []);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-scroll carousel
  useEffect(() => {
    if (!isAutoPlay) return;

    const totalItems = timelineEvents.length;

    autoScrollTimer.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalItems);
    }, 4000);

    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, [isAutoPlay, timelineEvents.length]);

  // Calculate visible cards
  const getVisibleCards = () => {
    const cards = [];
    const totalCards = timelineEvents.length;
    const visibleCount = isMobile ? 2 : 3;

    for (let i = 0; i < visibleCount; i++) {
      cards.push(timelineEvents[(currentIndex + i) % totalCards]);
    }

    return cards;
  };

  const visibleCards = getVisibleCards();
  const visibleYears = visibleCards.map(event => event.year).join(" • ");
  const visiblePeriods = visibleCards.map(event => event.period).join(" • ");

  const handleCardClick = (event) => {
    setSelectedEvent(event);
    setIsAutoPlay(false);
    // Analytics - Log event click
    logLinkClick(`timeline-event-${event.year}-${event.period}`);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setIsAutoPlay(true);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Analytics - Log contact click
    logLinkClick('journey-contact-cta');
  };

  const handleEmailClick = () => {
    // Analytics - Log email click
    logLinkClick('journey-email-cta');
  };

  // If page navigates to "#timeline" or hash changes, scroll into view
  useEffect(() => {
    const maybeScroll = () => {
      if (timelineRef.current && window.location.hash === "#timeline") {
        timelineRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    // on mount
    maybeScroll();

    // listen for future hash changes
    window.addEventListener("hashchange", maybeScroll);
    return () => window.removeEventListener("hashchange", maybeScroll);
  }, []);

  return (
    <div
      id="timeline"
      ref={timelineRef}
      className="relative min-h-screen w-full bg-gradient-to-br from-slate-950 via-black to-slate-900 text-white overflow-hidden"
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-60 h-60 md:w-80 md:h-80 bg-cyan-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.12, 0.2, 0.12] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-40 -left-40 w-60 h-60 md:w-80 md:h-80 bg-purple-500 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 md:px-8 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: -40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -40 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 md:mb-24"
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
            >
              My Journey
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-sm md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed px-4"
            >
              From coding fundamentals to leading teams at national hackathons. Explore my journey as a Full-Stack Developer, Team Lead, and AI/ML Enthusiast from Chennai, India.
            </motion.p>
          </motion.div>

          {/* Auto-scrolling carousel */}
          <div className="relative mb-12 md:mb-16">
            {/* Years and periods display */}
            <motion.div
              key={`years-${currentIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center mb-12 md:mb-20"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-2"
              >
                {visibleYears}
              </motion.div>
              
              <motion.p
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-sm md:text-lg lg:text-xl text-cyan-300/80 uppercase tracking-widest font-semibold px-4"
              >
                {visiblePeriods}
              </motion.p>
            </motion.div>

            {/* Cards container */}
            <div className="flex gap-4 md:gap-8 justify-center items-center py-8 md:py-12 px-2">
              {visibleCards.map((event, index) => (
                <MiniCard
                  key={`${currentIndex}-${index}`}
                  event={event}
                  onClick={() => handleCardClick(event)}
                  isVisible={true}
                  index={index}
                />
              ))}
            </div>

            {/* Progress indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center gap-1.5 md:gap-2 mt-12 md:mt-16 flex-wrap px-4"
            >
              {timelineEvents.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => handleDotClick(i)}
                  animate={{
                    width: currentIndex === i ? 24 : 8,
                    opacity: currentIndex === i ? 1 : 0.4,
                  }}
                  className="h-1.5 md:h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 transition-all cursor-pointer hover:opacity-80 touch-manipulation"
                />
              ))}
            </motion.div>

            {/* Carousel info */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center mt-6 md:mt-10 text-xs md:text-sm text-gray-400"
            >
              Auto-scrolling • Click dots or cards to explore
            </motion.p>
          </div>

          {/* Stats section */}
          <StatsSection />

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            className="mt-16 md:mt-32 p-8 md:p-16 rounded-2xl md:rounded-3xl bg-gradient-to-r from-cyan-500/15 to-purple-600/15 border border-white/15 backdrop-blur-xl text-center"
          >
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6"
            >
              Let's Collaborate on Projects
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm md:text-lg text-gray-300 mb-8 md:mb-10 max-w-lg mx-auto px-4"
            >
              Have an exciting project idea? Need a team lead or full-stack developer? Let's connect and build something amazing together!
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={scrollToContact}
                className="w-full sm:w-auto px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-cyan-400 to-purple-600 text-white font-bold text-base md:text-lg rounded-xl hover:shadow-2xl transition-all inline-flex items-center justify-center gap-3 touch-manipulation"
              >
                Get In Touch
                <ArrowRight size={20} className="md:hidden" />
                <ArrowRight size={22} className="hidden md:block" />
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                href="mailto:deepakofficial0103@gmail.com"
                onClick={handleEmailClick}
                className="w-full sm:w-auto px-8 md:px-10 py-3 md:py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-base md:text-lg rounded-xl transition-all inline-flex items-center justify-center gap-3 touch-manipulation"
              >
                <Mail size={20} className="md:hidden" />
                <Mail size={22} className="hidden md:block" />
                Send Email
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Detail Modal */}
      <DetailModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={handleCloseModal}
      />
    </div>
  );
}