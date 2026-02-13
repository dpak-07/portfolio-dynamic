import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, User, Code, Briefcase, Award, Clock, FileText, Mail, BookOpen } from "lucide-react";

export default function EnhancedNavbar() {
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState("home");
    const [isVisible, setIsVisible] = useState(true);
    const [lastScroll, setLastScroll] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);

    // Navigation items with icons
    const navItems = [
        { id: "home", label: "Home", icon: Home },
        { id: "about", label: "About", icon: User },
        { id: "tech-stack", label: "Tech Stack", icon: Code },
        { id: "projects", label: "Projects", icon: Briefcase },
        { id: "certifications", label: "Certifications", icon: Award },
        { id: "timeline", label: "Timeline", icon: Clock },
        { id: "resume", label: "Resume", icon: FileText },
        { id: "contact", label: "Contact", icon: Mail },
    ];

    // Scroll progress and navbar visibility
    useEffect(() => {
        let ticking = false;
        let hideTimer = null;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.scrollY;
                    const height = document.body.scrollHeight - window.innerHeight;
                    setScrollProgress((scrolled / height) * 100);

                    // Hide navbar on scroll down, show on scroll up
                    if (scrolled > lastScroll && scrolled > 100) {
                        setIsVisible(false);
                    } else {
                        setIsVisible(true);
                    }
                    setLastScroll(scrolled);

                    // Clear previous timer
                    if (hideTimer) clearTimeout(hideTimer);

                    // Show navbar after 2 seconds of no scrolling
                    hideTimer = setTimeout(() => {
                        setIsVisible(true);
                    }, 2000);

                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (hideTimer) clearTimeout(hideTimer);
        };
    }, [lastScroll]);

    // Active section observer - optimized for instant detection
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActive(entry.target.id);
                    }
                });
            },
            { threshold: 0.2 } // Reduced threshold for faster detection
        );

        navItems.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    // Smooth scroll
    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) {
            const navHeight = 80;
            const y = el.getBoundingClientRect().top + window.scrollY - navHeight;
            window.scrollTo({ top: y, behavior: "smooth" });
            setOpen(false);
        }
    };

    // Prevent background scroll when mobile menu open
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [open]);

    return (
        <>
            {/* Scroll Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 origin-left z-[1000]"
                style={{ scaleX: scrollProgress / 100 }}
                initial={{ scaleX: 0 }}
            />

            {/* Navbar */}
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{
                    y: isVisible ? 0 : -100,
                    opacity: isVisible ? 1 : 0
                }}
                transition={{ duration: 0.15, ease: "easeOut" }} // Reduced from 0.3s to 0.15s
                className="fixed top-0 left-0 right-0 z-[999] pt-1"
            >
                <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="relative flex items-center justify-between h-16 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl px-4 sm:px-6 shadow-2xl">
                        {/* Logo */}
                        <motion.button
                            onClick={() => scrollTo("home")}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 group"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/50 group-hover:shadow-cyan-500/80 transition-all">
                                <span className="text-white font-bold text-xl">D</span>
                            </div>
                            <span className="hidden sm:block text-white font-bold text-lg bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                Deepak
                            </span>
                        </motion.button>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-1">
                            {navItems.map(({ id, label, icon: Icon }) => (
                                <motion.button
                                    key={id}
                                    onClick={() => scrollTo(id)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${active === id
                                        ? "text-white"
                                        : "text-white/60 hover:text-white/90"
                                        }`}
                                >
                                    {active === id && (
                                        <motion.div
                                            layoutId="navbar-active"
                                            className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg border border-cyan-500/30"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                        <Icon size={16} />
                                        {label}
                                    </span>
                                </motion.button>
                            ))}
                        </div>

                        {/* Blog Link (Desktop) */}
                        <motion.a
                            href="/blog"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-medium shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all"
                        >
                            <BookOpen size={16} />
                            Blog
                        </motion.a>

                        {/* Mobile Menu Button */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setOpen(!open)}
                            className="lg:hidden p-2 text-white/80 hover:text-white transition-colors"
                        >
                            {open ? <X size={24} /> : <Menu size={24} />}
                        </motion.button>
                    </div>
                </nav>
            </motion.header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {open && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[998] lg:hidden"
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-[280px] bg-gradient-to-b from-slate-900 to-slate-950 border-l border-white/10 z-[999] lg:hidden overflow-y-auto"
                        >
                            {/* Close Button */}
                            <div className="flex justify-end p-4">
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setOpen(false)}
                                    className="p-2 text-white/80 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </motion.button>
                            </div>

                            {/* Navigation Items */}
                            <div className="px-4 pb-6 space-y-2">
                                {navItems.map(({ id, label, icon: Icon }, index) => (
                                    <motion.button
                                        key={id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.01 }} // Reduced delay for instant appearance
                                        onClick={() => scrollTo(id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${active === id
                                            ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-white"
                                            : "text-white/70 hover:bg-white/5 hover:text-white"
                                            }`}
                                    >
                                        <Icon size={20} />
                                        <span className="font-medium">{label}</span>
                                    </motion.button>
                                ))}

                                {/* Blog Link (Mobile) */}
                                <motion.a
                                    href="/blog"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: navItems.length * 0.01 }} // Reduced delay
                                    className="w-full flex items-center gap-3 px-4 py-3 mt-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-medium shadow-lg"
                                >
                                    <BookOpen size={20} />
                                    Blog
                                </motion.a>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
