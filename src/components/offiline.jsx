"use client";

import { motion, useAnimation } from "framer-motion";
import { WifiOff, RefreshCcw } from "lucide-react";
import { useEffect } from "react";

export default function OfflinePage() {
  const wifiControls = useAnimation();

  // Subtle rotation pulse animation for Wi-Fi icon
  useEffect(() => {
    const loop = async () => {
      while (true) {
        await wifiControls.start({ rotate: 10, transition: { duration: 0.3 } });
        await wifiControls.start({ rotate: -10, transition: { duration: 0.3 } });
        await wifiControls.start({ rotate: 0, transition: { duration: 0.3 } });
      }
    };
    loop();
  }, [wifiControls]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#050505] via-[#0b0f1a] to-[#000000] text-white overflow-hidden font-sans">

      {/* Animated Circuit Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(12,216,245,0.05),transparent_70%)] pointer-events-none" />
      <motion.div
        className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')]"
        animate={{ opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Falling binary rain effect */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-cyan-400 text-xs opacity-40 font-mono"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: ["-10%", "110%"],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 6,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {Array(6)
            .fill(0)
            .map(() => (Math.random() > 0.5 ? "1" : "0"))
            .join(" ")}
        </motion.div>
      ))}

      {/* Central Glowing Wi-Fi Icon */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div animate={wifiControls}>
          <WifiOff className="w-28 h-28 text-cyan-400 drop-shadow-[0_0_25px_#06b6d4]" />
        </motion.div>
      </motion.div>

      {/* Glitch Hologram Text */}
      <div className="relative mt-8 text-5xl sm:text-6xl font-black uppercase tracking-wide select-none">
        <motion.span
          className="text-cyan-400"
          animate={{
            textShadow: [
              "0px 0px 20px #06b6d4",
              "0px 0px 30px #22d3ee",
              "0px 0px 20px #06b6d4",
            ],
          }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          YOU’RE OFFLINE
        </motion.span>
        <motion.span
          className="absolute top-0 left-0 text-purple-500 opacity-70 blur-sm"
          animate={{ x: [-2, 2, -2], y: [2, -2, 2] }}
          transition={{ duration: 0.15, repeat: Infinity, repeatType: "mirror" }}
        >
          YOU’RE OFFLINE
        </motion.span>
      </div>

      {/* Subtitle */}
      <motion.p
        className="mt-4 text-white/70 text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        You’re drifting beyond the network...  
        Searching for a signal in the digital void ⚡
      </motion.p>

      {/* Reconnect Button */}
      <motion.button
        onClick={() => window.location.reload()}
        className="mt-10 relative px-8 py-3 flex items-center gap-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-700 overflow-hidden font-semibold uppercase tracking-wide"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <RefreshCcw className="w-5 h-5" />
        Retry Connection

        {/* Glow & pulse animation */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ["-150%", "150%"] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>

      {/* Floating energy orbs */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-28 h-28 rounded-full blur-3xl opacity-20"
          style={{
            background:
              i % 2 === 0
                ? "radial-gradient(circle, #06b6d4 0%, transparent 70%)"
                : "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
          }}
          animate={{
            x: [0, 40 * Math.sin(i), -40 * Math.cos(i)],
            y: [0, 30 * Math.cos(i), -30 * Math.sin(i)],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
