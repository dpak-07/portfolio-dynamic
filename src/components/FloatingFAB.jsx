"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFirestoreData } from "@/hooks/useFirestoreData";
import {
    FaBars,
    FaTimes,
    FaHome,
    FaUser,
    FaCode,
    FaBriefcase,
    FaCertificate,
    FaClock,
    FaFileAlt,
    FaEnvelope,
} from "react-icons/fa";
import { logLinkClick } from "../utils/analytics";

const iconMap = {
    home: FaHome,
    about: FaUser,
    "tech-stack": FaCode,
    projects: FaBriefcase,
    certifications: FaCertificate,
    timeline: FaClock,
    resume: FaFileAlt,
    contact: FaEnvelope,
};

export default function FloatingFAB() {
    const { data: firestoreSectionsData } = useFirestoreData("sections", "visibility");

    const sectionOrder = [
        "home",
        "about",
        "tech-stack",
        "github-stats",
        "projects",
        "certifications",
        "timeline",
        "resume",
        "contact",
    ];

    const sectionsConfig = useMemo(
        () =>
            firestoreSectionsData || {
                home: true,
                about: true,
                "tech-stack": true,
                "github-stats": true,
                projects: true,
                resume: true,
                certifications: true,
                timeline: true,
                contact: true,
            },
        [firestoreSectionsData]
    );

    const sections = useMemo(
        () => sectionOrder.filter((sec) => sectionsConfig[sec]),
        [sectionsConfig]
    );

    const [isOpen, setIsOpen] = useState(false);
    const [active, setActive] = useState("home");

    // Active section observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) =>
                entries.forEach((e) => {
                    if (e.isIntersecting && sectionsConfig[e.target.id]) {
                        setActive(e.target.id);
                    }
                }),
            { threshold: 0.45 }
        );
        sections.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, [sections, sectionsConfig]);

    // Smooth scroll with analytics
    const scrollTo = (id) => {
        if (!sectionsConfig[id]) return;
        const el = document.getElementById(id);
        const nav = document.querySelector("header");

        if (el && nav) {
            const navH = nav.offsetHeight;
            const y = el.getBoundingClientRect().top + window.scrollY - navH + 5;
            window.scrollTo({ top: y, behavior: "smooth" });
        }

        logLinkClick(`fab_${id}`);
        setIsOpen(false);
    };

    // Prevent background scroll when menu open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    // Calculate radial menu positions
    const getRadialPosition = (index, total) => {
        const radius = 120; // Distance from center
        const startAngle = -90; // Start from top
        const angleStep = 180 / (total - 1); // Spread across 180 degrees (semi-circle)
        const angle = (startAngle + angleStep * index) * (Math.PI / 180);

        return {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
        };
    };

    return (
        <>
            {/* Only show on mobile/tablet */}
            <div className="md:hidden fixed bottom-6 right-6 z-[998]">
                {/* Backdrop */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                            style={{ zIndex: -1 }}
                        />
                    )}
                </AnimatePresence>

                {/* Menu Items */}
                <AnimatePresence>
                    {isOpen &&
                        sections.map((sec, index) => {
                            const Icon = iconMap[sec] || FaBriefcase;
                            const pos = getRadialPosition(index, sections.length);
                            const isActive = active === sec;

                            return (
                                <motion.button
                                    key={sec}
                                    initial={{ scale: 0, x: 0, y: 0 }}
                                    animate={{
                                        scale: 1,
                                        x: pos.x,
                                        y: pos.y,
                                    }}
                                    exit={{ scale: 0, x: 0, y: 0 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 20,
                                        delay: index * 0.05,
                                    }}
                                    onClick={() => scrollTo(sec)}
                                    className={`absolute bottom-0 right-0 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${isActive
                                        ? "bg-gradient-to-br from-cyan-400 to-blue-500 text-black"
                                        : "bg-gray-900/90 text-cyan-400 border border-cyan-400/30"
                                        }`}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        boxShadow: isActive
                                            ? "0 0 20px rgba(0, 255, 255, 0.5)"
                                            : "0 0 10px rgba(0, 255, 255, 0.2)",
                                    }}
                                >
                                    <Icon className="w-5 h-5" />
                                </motion.button>
                            );
                        })}
                </AnimatePresence>

                {/* Main FAB Button */}
                <motion.button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-black flex items-center justify-center shadow-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    style={{
                        boxShadow: "0 0 30px rgba(0, 255, 255, 0.6), 0 4px 20px rgba(0, 0, 0, 0.3)",
                    }}
                >
                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.div
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <FaTimes className="w-6 h-6" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="menu"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <FaBars className="w-6 h-6" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>

                {/* Pulse effect when closed */}
                {!isOpen && (
                    <motion.div
                        className="absolute inset-0 rounded-full bg-cyan-400/30"
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                )}
            </div>
        </>
    );
}
