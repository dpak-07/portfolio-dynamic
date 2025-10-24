import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen({ isLoading, onFinish }) {
  const [currentText, setCurrentText] = useState(0);

  const loadingTexts = [
    "Initializing your portfolio...",
    "Loading data from the future...",
    "Calibrating animations...",
    "Almost there...",
  ];

  useEffect(() => {
    if (!isLoading) {
      onFinish && onFinish();
      return;
    }

    const textInterval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % loadingTexts.length);
    }, 2500);

    return () => clearInterval(textInterval);
  }, [isLoading, onFinish]);

  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950"
    >
      {/* Floating background orbs */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.05, 0.3, 0.05],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Core loader */}
      <div className="relative flex flex-col items-center justify-center text-center z-10">
        {/* Radiating pulse waves */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border-2 border-cyan-400/20"
            style={{
              width: 100 + i * 50,
              height: 100 + i * 50,
            }}
            animate={{
              scale: [1, 1.8],
              opacity: [0.4, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Central glowing core */}
        <motion.div
          className="w-8 h-8 rounded-full bg-cyan-400 shadow-[0_0_30px_8px_rgba(34,211,238,0.6)]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Orbiting rings */}
        <motion.div
          className="absolute w-32 h-32 border-t-2 border-cyan-500/40 rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute w-48 h-48 border-b-2 border-purple-400/30 rounded-full"
          animate={{ rotate: -360 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Orbiting particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-300 rounded-full shadow-lg"
            style={{
              transformOrigin: "0 80px",
              rotate: `${i * 60}deg`,
            }}
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}

        {/* Animated loading text */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentText}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
            className="text-white text-lg font-light mt-24 tracking-wide"
          >
            {loadingTexts[currentText]}
          </motion.div>
        </AnimatePresence>

        {/* Bouncing progress dots */}
        <div className="flex space-x-2 mt-6">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-3 h-3 bg-white rounded-full"
              animate={{
                y: [0, -8, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
