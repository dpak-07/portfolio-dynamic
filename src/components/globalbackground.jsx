// src/components/GlobalBackground.jsx

import { useEffect, useState } from "react";

export default function GlobalBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const mouseGlow = {
    background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(0,229,255,0.08), transparent 40%)`,
  };

  return (
    <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden">
      {/* 🌌 Starfield */}
      <div className="absolute inset-0 bg-black">
        {[...Array(100)].map((_, i) => (
          <span
            key={i}
            className="absolute w-[1px] h-[1px] bg-white rounded-full opacity-[0.07] animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${2 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 4}s`,
              filter: "blur(0.6px)",
            }}
          />
        ))}
      </div>

      {/* 💨 Nebula Blur FX */}
      <div className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-[#00e5ff44] via-transparent to-[#0ff4c466] blur-[120px] rounded-full opacity-20 top-[10%] left-[5%] animate-pulse" />
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-[#ff00ff33] to-[#0000ff55] blur-[100px] rounded-full opacity-20 bottom-[15%] right-[10%] animate-pulse" />

      {/* 🌈 Radial Sweep Gradient */}
      <div className="absolute inset-0 animate-backgroundAnimation bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyansoft/10 via-transparent to-transparent" />

      {/* 🖱️ Mouse Glow */}
      <div className="absolute inset-0 transition-transform duration-300" style={mouseGlow} />
    </div>
  );
}
