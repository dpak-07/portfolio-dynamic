import { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);

  const sections = ["home", "about", "tech-stack", "projects", "resume", "contact"];
  const buttonsRef = useRef({}); // store refs for active underline

  // Smooth scroll with dynamic navbar height
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    const navbar = document.querySelector("header");
    if (el && navbar) {
      const navbarHeight = navbar.offsetHeight;
      const y = el.getBoundingClientRect().top + window.scrollY - navbarHeight + 5;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setOpen(false);
  };

  // Track active section
  useEffect(() => {
    const navbar = document.querySelector("header");
    const navbarHeight = navbar ? navbar.offsetHeight : 80;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id || "home");
          }
        });
      },
      {
        rootMargin: `-${navbarHeight + 20}px 0px -50% 0px`,
        threshold: 0.4,
      }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Detect scroll for navbar style
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Desktop + mobile link styling
  const linkClass = (id) =>
    `relative px-4 py-2 text-sm font-medium transition-colors duration-500 ${
      active === id ? "text-cyansoft" : "text-white/80 hover:text-cyansoft"
    }`;

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80, damping: 20 }}
      className="fixed inset-x-0 top-0 z-50 pointer-events-none"
    >
      <motion.nav
        animate={{
          backgroundColor: isScrolled ? "rgba(0,0,0,0.5)" : "transparent",
          backdropFilter: isScrolled ? "blur(10px)" : "blur(0px)",
        }}
        transition={{ duration: 0.6 }}
        className={`pointer-events-auto relative w-full px-6 py-3 border-b ${
          isScrolled ? "border-white/10 shadow-lg" : "border-transparent"
        }`}
      >
        <motion.div
          className={`w-full max-w-7xl mx-auto flex items-center transition-all duration-700 ${
            isScrolled ? "justify-between" : "justify-center"
          }`}
        >
          {/* 🚀 Logo */}
          <motion.h1
            whileHover={{ scale: 1.08 }}
            transition={{ type: "spring", stiffness: 200 }}
            className={`font-extrabold cursor-pointer bg-gradient-to-r from-cyan-300 to-cyansoft bg-clip-text text-transparent font-[Playfair] ${
              isScrolled ? "text-xl md:text-2xl" : "text-3xl md:text-5xl"
            }`}
            onClick={() => scrollTo("home")}
          >
            Deepak | Portfolio
          </motion.h1>

          {/* 🖥 Desktop Nav */}
          <AnimatePresence>
            {isScrolled && (
              <motion.div
                key="desktop-nav"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
                className="hidden md:flex gap-6 items-center relative"
              >
                {sections.map((sec) => (
                  <motion.button
                    key={sec}
                    ref={(el) => (buttonsRef.current[sec] = el)}
                    onClick={() => scrollTo(sec)}
                    className={linkClass(sec)}
                    whileHover={{ scale: 1.1 }}
                  >
                    {sec.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </motion.button>
                ))}

                {/* 🔥 Animated underline */}
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 h-[2px] bg-cyansoft rounded-full"
                  initial={false}
                  animate={{
                    x: buttonsRef.current[active]?.offsetLeft || 0,
                    width: buttonsRef.current[active]?.offsetWidth || 0,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 📱 Mobile Toggle */}
          <AnimatePresence>
            {isScrolled && (
              <motion.div
                key="mobile-toggle"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
                className="md:hidden z-50"
              >
                <button
                  onClick={() => setOpen(!open)}
                  aria-label="Toggle menu"
                  className="text-white/90 hover:text-cyansoft transition-all"
                >
                  {open ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 📱 Mobile Drawer */}
        <AnimatePresence>
          {open && isScrolled && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-[92%] max-w-sm bg-black/70 border border-white/10 backdrop-blur-xl rounded-xl p-5 shadow-lg md:hidden"
            >
              <motion.div
                className="flex flex-col gap-3"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.07 } },
                }}
              >
                {sections.map((sec) => (
                  <motion.button
                    key={sec}
                    onClick={() => scrollTo(sec)}
                    whileTap={{ scale: 0.95 }}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    className={`text-left px-4 py-2 rounded-md text-white/90 hover:bg-white/10 transition-all duration-200 ${
                      active === sec ? "bg-cyansoft text-black font-semibold" : ""
                    }`}
                  >
                    {sec.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </motion.header>
  );
}
