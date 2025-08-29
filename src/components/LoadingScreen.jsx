// src/components/LoadingScreen.jsx
import { useEffect, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

export default function LoadingScreen({ onFinish }) {
  const [visible, setVisible] = useState(true);
  const [step, setStep] = useState(0);
  const [flash, setFlash] = useState(false);

  const messages = [
    "Welcome to DevFolio of Deepak",
    "Crafting Innovative Experiences",
    "React • Tailwind • Firebase",
    "UI / UX + Motion Design",
    "Framer Motion + GSAP",
    "Fueling the Engines...",
    "Launching Now!"
  ];

  useEffect(() => {
    // Cycle text messages every ~857ms to fit 6s
    messages.forEach((_, i) => setTimeout(() => setStep(i), i * 857));

    // Trigger flash at 6 seconds
    const timer = setTimeout(() => {
      setFlash(true);

      // Hide loader after flash
      setTimeout(() => {
        setVisible(false);
        onFinish && onFinish();
      }, 800); // flash duration
    }, 6000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1 } }}
        >
          {/* 3D Starfield */}
          <Canvas className="absolute inset-0 z-0">
            <Suspense fallback={null}>
              <Stars radius={250} depth={100} count={9000} factor={5} saturation={0} fade />
            </Suspense>
          </Canvas>

          {/* Warp Rings */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-cyan-400/40"
                style={{ width: `${200 + i * 90}px`, height: `${200 + i * 90}px` }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.9, 0.2], rotate: [0, 180, 360] }}
                transition={{ repeat: Infinity, duration: 4 + i * 0.7, ease: "easeInOut" }}
              />
            ))}
            <motion.div
              className="w-44 h-44 rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 blur-3xl opacity-90 shadow-[0_0_70px_20px_rgba(0,255,255,0.6)]"
              animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
          </div>

          {/* Warp Tunnel Beams */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            {[...Array(70)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-[2px] h-28 bg-cyan-300/30"
                style={{ transform: `rotate(${(i / 70) * 360}deg) translateY(200px)`, transformOrigin: "center center" }}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: [0, 1, 0], opacity: [0, 0.8, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, delay: i * 0.03, ease: "easeInOut" }}
              />
            ))}
          </div>

          {/* Text */}
          <motion.div
            key={step}
            className="absolute bottom-20 text-center text-cyan-200 text-xl md:text-3xl font-mono tracking-widest drop-shadow-lg z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {messages[step]}
          </motion.div>

          {/* Flash */}
          <AnimatePresence>
            {flash && (
              <motion.div
                key="flash"
                className="absolute inset-0 bg-white z-[10000] pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
