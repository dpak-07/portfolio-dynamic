"use client";

import React from "react";
import { motion } from "framer-motion";

export default function TimelineSection() {
  const timeline = [
    { year: "2025", event: "Joined XYZ Company as Software Engineer" },
    { year: "2023", event: "Graduated with B.Tech in Computer Science" },
    { year: "2021", event: "Started building personal projects" },
    { year: "2019", event: "Began my coding journey" },
  ];

  return (
    <section id="timeline" className="py-16 bg-[#0a0a0a] text-white">
      <div className="max-w-4xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-10 text-center"
        >
          🕒 My Journey
        </motion.h2>

        <div className="relative border-l border-white/20 pl-8 space-y-8">
          {timeline.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white"></span>
              <h3 className="text-xl font-semibold">{item.year}</h3>
              <p className="text-gray-400">{item.event}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
