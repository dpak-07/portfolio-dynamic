import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ModernLoadingScreen() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + Math.random() * 15;
            });
        }, 200);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 left-0 w-96 h-96 bg-cyan-500 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.6, 0.3],
                        x: [0, -100, 0],
                        y: [0, 50, 0],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full blur-[100px]"
                />
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center gap-8">
                {/* Logo/Icon Animation */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
                    className="relative"
                >
                    {/* Outer Ring */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="w-32 h-32 rounded-full border-4 border-transparent border-t-cyan-400 border-r-purple-400"
                    />

                    {/* Inner Circle */}
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center shadow-2xl shadow-cyan-500/50"
                    >
                        <span className="text-3xl font-bold text-white">D</span>
                    </motion.div>
                </motion.div>

                {/* Loading Text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center"
                >
                    <h2 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Loading Portfolio
                    </h2>
                    <motion.p
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-white/60 text-sm"
                    >
                        Preparing an amazing experience...
                    </motion.p>
                </motion.div>

                {/* Progress Bar */}
                <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 100)}%` }}
                        transition={{ duration: 0.3 }}
                        className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full shadow-lg shadow-cyan-500/50"
                    />
                </div>

                {/* Progress Percentage */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-white/40 text-sm font-mono"
                >
                    {Math.min(Math.round(progress), 100)}%
                </motion.div>

                {/* Floating Particles */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                            x: [0, (Math.random() - 0.5) * 200],
                            y: [0, (Math.random() - 0.5) * 200],
                        }}
                        transition={{
                            duration: 2 + Math.random() * 2,
                            repeat: Infinity,
                            delay: i * 0.3,
                        }}
                        className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                        style={{
                            left: `${50 + (Math.random() - 0.5) * 20}%`,
                            top: `${50 + (Math.random() - 0.5) * 20}%`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
