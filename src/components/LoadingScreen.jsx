import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen({ isLoading, onFinish }) {
  const [progress, setProgress] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);
  const [dataStream, setDataStream] = useState([]);
  const [currentPhase, setCurrentPhase] = useState(0);

  const loadingPhases = [
    "Initializing neural network...",
    "Decrypting data streams...",
    "Compiling matrix sequences...",
    "Syncing DNA protocols...",
    "Loading quantum state...",
  ];

  useEffect(() => {
    if (!isLoading) {
      onFinish && onFinish();
      return;
    }

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 12;
      });
    }, 350);

    // Random glitch effect
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, 2500);

    // Generate random data stream
    const streamInterval = setInterval(() => {
      setDataStream((prev) => [
        ...prev.slice(-15),
        {
          id: Date.now() + Math.random(),
          text: Math.random().toString(36).substring(2, 7).toUpperCase(),
          type: ["DNA", "RNA", "HEX", "BIN"][Math.floor(Math.random() * 4)],
        },
      ]);
    }, 120);

    // Phase rotation
    const phaseInterval = setInterval(() => {
      setCurrentPhase((prev) => (prev + 1) % loadingPhases.length);
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(glitchInterval);
      clearInterval(streamInterval);
      clearInterval(phaseInterval);
    };
  }, [isLoading, onFinish]);

  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Matrix Rain Background */}
      <div className="absolute inset-0 opacity-25">
        {[...Array(35)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-0 text-cyan-400 font-mono text-xs leading-tight"
            style={{
              left: `${(i * 100) / 35}%`,
              textShadow: "0 0 8px rgba(6, 182, 212, 0.8)",
            }}
            animate={{
              y: ["0vh", "110vh"],
            }}
            transition={{
              duration: 2.5 + Math.random() * 2,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 2,
            }}
          >
            {Array.from({ length: 25 }, (_, j) => (
              <div key={j} style={{ opacity: 1 - j * 0.04 }}>
                {String.fromCharCode(0x30a0 + Math.random() * 96)}
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* DNA Helix Background Visualization */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10"
        viewBox="0 0 1000 800"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Top Helix Strand */}
        <motion.path
          d="M 50 400 Q 200 200, 350 400 T 650 400 T 950 400"
          stroke="rgba(6, 182, 212, 0.6)"
          strokeWidth="3"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 0], opacity: [0, 0.6, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        {/* Bottom Helix Strand */}
        <motion.path
          d="M 50 400 Q 200 600, 350 400 T 650 400 T 950 400"
          stroke="rgba(139, 92, 246, 0.6)"
          strokeWidth="3"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 0], opacity: [0, 0.6, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
            delay: 0.5,
          }}
        />
      </svg>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center px-4">
        {/* Central Hexagon with DNA Helix */}
        <div className="relative mb-8">
          {/* Radiating pulse waves */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border-2 border-cyan-400/20"
              style={{
                width: 120 + i * 60,
                height: 120 + i * 60,
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
              animate={{
                scale: [1, 1.8],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.6,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Main Hexagon Frame */}
          <motion.div
            className="relative"
            animate={{
              scale: glitchActive ? [1, 1.05, 0.98, 1.02, 1] : 1,
              x: glitchActive ? [-2, 2, -2, 2, 0] : 0,
            }}
            transition={{ duration: 0.2 }}
          >
            <svg width="140" height="140" viewBox="0 0 140 140">
              {/* Outer Hexagon */}
              <motion.path
                d="M70 15 L115 42.5 L115 97.5 L70 125 L25 97.5 L25 42.5 Z"
                stroke="url(#hexGradient)"
                strokeWidth="3"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  filter: "drop-shadow(0 0 8px rgba(6, 182, 212, 0.6))",
                }}
              />

              {/* Inner rotating hexagon */}
              <motion.path
                d="M70 30 L100 47.5 L100 82.5 L70 100 L40 82.5 L40 47.5 Z"
                stroke="url(#hexGradient2)"
                strokeWidth="2"
                fill="none"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  transformOrigin: "70px 70px",
                }}
              />

              <defs>
                <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <linearGradient id="hexGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>

            {/* Central DNA double helix animation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="relative w-12 h-16"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full"
                    style={{
                      left: `${25 + Math.sin((i * Math.PI) / 3) * 20}px`,
                      top: `${i * 10}px`,
                      backgroundColor: i % 2 === 0 ? "#06b6d4" : "#8b5cf6",
                      boxShadow: `0 0 10px ${i % 2 === 0 ? "#06b6d4" : "#8b5cf6"}`,
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </motion.div>
            </div>

            {/* Orbiting particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: "50%",
                  top: "50%",
                  transformOrigin: "0 70px",
                  rotate: `${i * 45}deg`,
                  backgroundColor: i % 2 === 0 ? "#06b6d4" : "#8b5cf6",
                  boxShadow: `0 0 10px ${i % 2 === 0 ? "#06b6d4" : "#8b5cf6"}`,
                }}
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  rotate: {
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear",
                  },
                  scale: {
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.25,
                  },
                }}
              />
            ))}
          </motion.div>

          {/* Glowing center dot */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          >
            <div
              className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
              style={{
                boxShadow: "0 0 20px rgba(6, 182, 212, 0.8)",
              }}
            />
          </motion.div>
        </div>

        {/* Glitchy Loading Text */}
        <AnimatePresence mode="wait">
          <motion.h2
            key={currentPhase}
            initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              x: glitchActive ? [0, -3, 3, -2, 0] : 0,
              textShadow: glitchActive
                ? [
                    "0 0 10px rgba(6, 182, 212, 0.8)",
                    "-3px 0 #ff00de, 3px 0 #00f0ff",
                    "0 0 10px rgba(6, 182, 212, 0.8)",
                  ]
                : "0 0 10px rgba(6, 182, 212, 0.8)",
            }}
            exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
            transition={{ duration: 0.5 }}
            className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 mb-6 text-center"
          >
            {loadingPhases[currentPhase]}
          </motion.h2>
        </AnimatePresence>

        {/* Data Stream Display */}
        <div className="flex flex-wrap justify-center gap-2 max-w-xl mb-6 min-h-[60px]">
          <AnimatePresence>
            {dataStream.slice(-10).map((item) => (
              <motion.span
                key={item.id}
                initial={{ opacity: 0, scale: 0, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="font-mono text-xs px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                style={{
                  textShadow: "0 0 5px rgba(6, 182, 212, 0.5)",
                }}
              >
                <span className="text-cyan-300/50">{item.type}:</span>
                {item.text}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="w-72 md:w-96 h-2 bg-gray-900/80 rounded-full overflow-hidden border border-cyan-900/50 mb-4">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 rounded-full relative"
            initial={{ width: "0%" }}
            animate={{
              width: `${Math.min(progress, 100)}%`,
              backgroundPosition: ["0% 50%", "100% 50%"],
            }}
            transition={{
              width: { duration: 0.3 },
              backgroundPosition: { duration: 2, repeat: Infinity, ease: "linear" },
            }}
            style={{
              backgroundSize: "200% 100%",
              boxShadow: "0 0 20px rgba(6, 182, 212, 0.6)",
            }}
          >
            {/* Progress bar glowing effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>
        </div>

        {/* Progress Percentage */}
        <motion.p
          className="text-cyan-400 font-mono text-lg mb-4"
          animate={{
            opacity: glitchActive ? [1, 0.3, 1] : 1,
            x: glitchActive ? [-1, 1, -1, 1, 0] : 0,
          }}
          style={{
            textShadow: "0 0 10px rgba(6, 182, 212, 0.8)",
          }}
        >
          {Math.floor(Math.min(progress, 100))}%
        </motion.p>

        {/* Animated Loading Dots */}
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-cyan-400"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
              style={{
                boxShadow: "0 0 8px rgba(6, 182, 212, 0.8)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Scanline Effect */}
      <motion.div
        className="absolute inset-x-0 h-1 pointer-events-none"
        animate={{ y: ["0%", "100vh"] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div
          className="w-full h-full"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(6, 182, 212, 0.3), transparent)",
            filter: "blur(2px)",
          }}
        />
      </motion.div>

      {/* Screen edge glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: "inset 0 0 100px rgba(6, 182, 212, 0.1)",
        }}
      />
    </motion.div>
  );
}