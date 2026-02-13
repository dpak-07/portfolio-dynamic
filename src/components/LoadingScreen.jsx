import { useEffect, useState } from "react";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";

export default function Loader({ onFinish }) {
  const [hide, setHide] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 30;
      });
    }, 300);

    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setHide(true);
        setTimeout(() => {
          onFinish?.();
        }, 800);
      }, 300);
    }, 4500); // total loader duration

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [onFinish]);

  // Floating particles
  const Particle = ({ delay, duration }) => (
    <motion.div
      className="absolute w-1 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
      animate={{
        y: [0, -400, 0],
        x: [0, Math.sin(delay) * 100, 0],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        left: `${Math.cos(delay) * 50 + 50}%`,
        bottom: "0%",
      }}
    />
  );

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden transition-opacity duration-1000 ${
        hide ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Animated Background Gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#0a0e27] via-[#0f1420] to-[#0a0e27]"
        animate={{
          background: [
            "linear-gradient(135deg, #0a0e27 0%, #0f1420 50%, #0a0e27 100%)",
            "linear-gradient(135deg, #0f1420 0%, #1a1f35 50%, #0f1420 100%)",
            "linear-gradient(135deg, #0a0e27 0%, #0f1420 50%, #0a0e27 100%)",
          ],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <Particle key={i} delay={i * 0.5} duration={3 + i * 0.5} />
        ))}
      </div>

      {/* Radial Glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(0, 229, 255, 0.3) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Main Content Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-[90%] max-w-[420px]"
      >
        {/* Card Container */}
        <div className="rounded-3xl bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl p-8 border border-white/10 shadow-2xl">
          {/* Terminal Header */}
          <div className="mb-6 flex items-center gap-3">
            <motion.span
              className="h-3 w-3 rounded-full bg-red-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
            <motion.span
              className="h-3 w-3 rounded-full bg-yellow-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
            />
            <motion.span
              className="h-3 w-3 rounded-full bg-green-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
            />
            <div className="ml-3 text-xs text-white/50 font-mono tracking-widest">
              INITIALIZING...
            </div>
          </div>

          {/* Terminal Content */}
          <div className="font-mono text-sm leading-7 text-cyan-300 mb-8 min-h-[140px]">
            <TypeAnimation
              sequence={[
                "> Deepak.portfolio v2.0\n",
                400,
                "> Initializing core modules...\n",
                300,
                "> ✓ Rendering components\n",
                300,
                "> ✓ Loading animations\n",
                300,
                "> ✓ Syncing Firebase data\n",
                300,
                "> ✓ Compiling stylesheets\n",
                300,
                "> ✓ Optimizing assets\n",
                400,
                "> Launching portfolio experience...\n",
                600,
              ]}
              speed={70}
              repeat={0}
              cursor={true}
              className="text-cyan-300"
            />
          </div>

          {/* Progress Bar Container */}
          <div className="space-y-3">
            {/* Label */}
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-white/60 uppercase tracking-widest">
                Loading
              </span>
              <span className="text-xs font-mono text-cyan-400">
                {Math.round(progress)}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-white/5 rounded-full overflow-hidden border border-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Status Text */}
          <motion.div
            className="mt-6 text-center"
            animate={{ opacity: [0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <p className="text-xs text-white/40 font-mono tracking-widest">
              {progress < 30
                ? "Initializing..."
                : progress < 60
                ? "Loading resources..."
                : progress < 90
                ? "Finalizing..."
                : "Almost there..."}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Accent Line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
        animate={{
          boxShadow: [
            "0 0 10px rgba(0, 229, 255, 0.3)",
            "0 0 30px rgba(0, 229, 255, 0.6)",
            "0 0 10px rgba(0, 229, 255, 0.3)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
}
