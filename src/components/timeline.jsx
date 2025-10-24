"use client";

import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Rocket, Brain, Award, Star, Target } from "lucide-react";

const orbits = [
  {
    label: "Past",
    color: "from-cyan-400 to-blue-500",
    size: 380,
    speed: 90,
    milestones: [
      { name: "Started Coding", year: "2021", icon: <Brain size={18} /> },
      { name: "Built First Website", year: "2022", icon: <Rocket size={18} /> },
    ],
  },
  {
    label: "Present",
    color: "from-fuchsia-400 to-purple-500",
    size: 500,
    speed: 70,
    milestones: [
      { name: "Lead Dev – NovaLab", year: "2024", icon: <Award size={18} /> },
      { name: "Created Cosmic Odyssey", year: "2025", icon: <Star size={18} /> },
    ],
  },
  {
    label: "Future",
    color: "from-emerald-400 to-teal-500",
    size: 650,
    speed: 50,
    milestones: [
      { name: "Launch AI Studio", year: "2026", icon: <Target size={18} /> },
      { name: "Empower Creators Globally", year: "2027", icon: <Sparkles size={18} /> },
    ],
  },
];

export default function SolarSelf() {
  const { scrollYProgress } = useScroll();
  const zoom = useTransform(scrollYProgress, [0, 1], [1, 0.6]);
  const [hovered, setHovered] = useState(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    setMouse({
      x: (e.clientX - innerWidth / 2) / 60,
      y: (e.clientY - innerHeight / 2) / 60,
    });
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative min-h-[250vh] bg-black overflow-hidden text-white flex flex-col items-center justify-center"
    >
      {/* Background Stars */}
      <div className="absolute inset-0">
        {[...Array(80)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: Math.random(),
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: ["0%", "-100%"],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 30 + Math.random() * 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute w-[2px] h-[2px] bg-white rounded-full blur-[1px]"
          />
        ))}
      </div>

      {/* Solar System */}
      <motion.div
        style={{
          scale: zoom,
          rotateY: mouse.x,
          rotateX: mouse.y,
        }}
        className="relative z-10 flex flex-col items-center justify-center perspective-[1200px]"
      >
        {/* Center - The Sun (You) */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], boxShadow: ["0 0 60px #facc15", "0 0 120px #fbbf24", "0 0 60px #facc15"] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="relative w-40 h-40 rounded-full bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 shadow-[0_0_60px_rgba(255,180,50,0.6)] flex items-center justify-center"
        >
          <h2 className="text-2xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            YOU ☀️
          </h2>
        </motion.div>

        {/* Energy waves around center */}
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 2.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ repeat: Infinity, duration: 4 + i, ease: "easeOut" }}
            className="absolute w-40 h-40 rounded-full border border-yellow-400/30 blur-[2px]"
          />
        ))}

        {/* Orbits */}
        {orbits.map((orbit, i) => (
          <motion.div
            key={i}
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: orbit.speed, ease: "linear" }}
            className={`absolute w-[${orbit.size}px] h-[${orbit.size}px] rounded-full border border-${orbit.color
              .split(" ")[0]
              .replace("from-", "")}-400/20 flex items-center justify-center`}
          >
            {orbit.milestones.map((milestone, j) => {
              const angle = (j / orbit.milestones.length) * Math.PI * 2;
              const radius = orbit.size / 2;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <motion.div
                  key={j}
                  onHoverStart={() => setHovered(`${i}-${j}`)}
                  onHoverEnd={() => setHovered(null)}
                  className="absolute flex flex-col items-center justify-center"
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                >
                  {/* Planet */}
                  <motion.div
                    whileHover={{ scale: 1.4 }}
                    animate={{ rotate: [0, 360] }}
                    transition={{ repeat: Infinity, duration: orbit.speed * 2, ease: "linear" }}
                    className={`w-14 h-14 rounded-full bg-gradient-to-br ${orbit.color} shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center justify-center cursor-pointer`}
                  >
                    {milestone.icon}
                  </motion.div>

                  {/* Info Popup */}
                  {hovered === `${i}-${j}` && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 180, damping: 12 }}
                      className="absolute top-20 w-48 p-3 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)] text-center"
                    >
                      <h3 className="text-sm font-semibold text-cyan-300">
                        {milestone.name}
                      </h3>
                      <p className="text-xs text-gray-300">{milestone.year}</p>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        ))}
      </motion.div>

      {/* Footer Floating Label */}
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5], y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute bottom-10 text-sm text-gray-400 flex items-center gap-2"
      >
        <Sparkles size={16} /> Orbiting through your evolution
      </motion.div>
    </section>
  );
}
