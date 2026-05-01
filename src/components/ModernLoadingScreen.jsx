import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ModernLoadingScreen() {
    const [progress, setProgress] = useState(0);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Check current theme
        const checkTheme = () => {
            const dark = document.documentElement.getAttribute("data-theme") === "dark" ||
                window.matchMedia("(prefers-color-scheme: dark)").matches;
            setIsDark(dark);
        };
        checkTheme();
        
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
        
        // Progress animation
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + Math.random() * 15;
            });
        }, 150);

        return () => {
            clearInterval(interval);
            observer.disconnect();
        };
    }, []);

    return (
        <div 
            className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden ${
                isDark 
                    ? "bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950" 
                    : "bg-white"
            }`}
        >
            {/* Dark mode: Animated background orbs */}
            {isDark && (
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                            x: [0, 100, 0],
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-0 left-0 w-96 h-96 bg-cyan-500 rounded-full blur-[120px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.3, 0.6, 0.3],
                            x: [0, -100, 0],
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-[120px]"
                    />
                </div>
            )}

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center gap-6">
                {/* Logo/Icon - Simple D */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
                    className={`w-20 h-20 rounded-full flex items-center justify-center ${
                        isDark 
                            ? "bg-gradient-to-br from-cyan-500 to-purple-500 shadow-lg shadow-cyan-500/30" 
                            : "bg-black shadow-lg shadow-gray-300"
                    }`}
                >
                    <span className={`text-2xl font-bold ${isDark ? "text-white" : "text-white"}`}>D</span>
                </motion.div>

                {/* Loading Text */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
                >
                    {isDark ? (
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Loading
                        </h2>
                    ) : (
                        <h2 className="text-2xl font-bold text-black">
                            Loading
                        </h2>
                    )}
                    <motion.p
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className={`text-sm mt-1 ${isDark ? "text-white/50" : "text-gray-400"}`}
                    >
                        Please wait...
                    </motion.p>
                </motion.div>

                {/* Simple Progress Bar */}
                <div className={`w-40 h-1 rounded-full overflow-hidden ${
                    isDark ? "bg-white/10" : "bg-gray-200"
                }`}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 100)}%` }}
                        transition={{ duration: 0.2 }}
                        className={`h-full rounded-full ${
                            isDark 
                                ? "bg-gradient-to-r from-cyan-500 to-purple-500" 
                                : "bg-black"
                        }`}
                    />
                </div>
            </div>
        </div>
    );
}
