import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function About() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // 🖱️ Mouse glow effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const mouseGlow = {
    background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(0,229,255,0.06), transparent 50%)`,
  };

  return (
    <section
      id="about"
      className="relative w-full py-28 px-6 scroll-mt-32 flex items-center justify-center"
      style={mouseGlow}
    >
      <motion.div
        className="relative z-10 w-full max-w-7xl flex flex-col md:flex-row items-center gap-12 md:gap-16 p-8 md:p-16 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-md bg-white/5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        transition={{ staggerChildren: 0.2 }}
      >
        {/* 🖼️ Profile Image with Glow */}
        <motion.div
          className="relative flex-shrink-0 group"
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: { opacity: 1, scale: 1 },
          }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          {/* Glow Ring */}
          <motion.div
            className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-cyansoft/50 to-cyan-300/30 blur-3xl"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          ></motion.div>

          {/* Square Image */}
          <img
            src="images/your-image.jpg"
            alt="Deepak"
            className="relative w-64 h-64 md:w-80 md:h-80 object-cover rounded-2xl border-4 border-cyansoft shadow-[0_0_50px_rgba(0,229,255,0.5)] transition-transform duration-700 group-hover:scale-105"
          />
        </motion.div>

        {/* 📄 Text Content */}
        <motion.div
          className="text-center md:text-left space-y-6 md:space-y-8 max-w-3xl"
          variants={{
            hidden: { opacity: 0, x: 60 },
            visible: { opacity: 1, x: 0 },
          }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <motion.h2
            className="text-4xl md:text-6xl font-black bg-gradient-to-r from-cyansoft to-cyan-300 bg-clip-text text-transparent font-[Orbitron]"
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8 }}
          >
            About Me
          </motion.h2>

          <motion.p
            className="text-lg md:text-2xl text-white/90 leading-relaxed font-[Poppins]"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8 }}
          >
            I’m currently a{" "}
            <span className="text-cyansoft font-bold">
              pre-final year student in Artificial Intelligence and Data Science
            </span>{" "}
            at{" "}
            <span className="text-cyan-300 font-bold">
              Velammal Engineering College
            </span>
            . My passion is solving real-world problems with{" "}
            <span className="text-white font-semibold">
              AI, machine learning, and data-driven innovation
            </span>
            .
          </motion.p>

          <motion.p
            className="text-base md:text-xl text-white/70 leading-relaxed font-[Inter]"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8 }}
          >
            I love building{" "}
            <span className="text-white font-semibold">scalable full-stack apps</span>{" "}
            with <span className="text-cyan-200">React, Node.js, Flask, MongoDB</span>.{" "}
            I’m also diving deep into{" "}
            <span className="text-cyan-200">cloud computing</span> and{" "}
            <span className="text-cyan-200">AI deployment pipelines</span> for production-ready systems.
          </motion.p>

          {/* 🔗 Buttons */}
          <motion.div
            className="flex justify-center md:justify-start gap-4 md:gap-6 pt-4 md:pt-6"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8 }}
          >
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 md:px-8 py-3 md:py-4 bg-cyansoft text-black font-bold rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
            >
              🚀 See Projects
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 md:px-8 py-3 md:py-4 border border-white/20 text-white/80 font-medium rounded-xl hover:bg-white/10 hover:scale-105 transition-transform duration-300"
            >
              ✨ Get in Touch
            </a>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
