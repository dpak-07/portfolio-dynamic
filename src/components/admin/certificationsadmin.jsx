"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Certifications() {
  const certifications = [
    { title: "Google Cloud Certified", issuer: "Google", year: "2024" },
    { title: "AWS Developer Associate", issuer: "Amazon", year: "2023" },
    { title: "Frontend Web Developer", issuer: "FreeCodeCamp", year: "2022" },
  ];

  return (
    <section id="certifications" className="py-16 bg-[#0a0a0a] text-white">
      <div className="max-w-5xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-8 text-center"
        >
          🏆 Certifications
        </motion.h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
            >
              <h3 className="text-lg font-semibold">{cert.title}</h3>
              <p className="text-sm text-gray-400 mt-1">{cert.issuer}</p>
              <p className="text-sm text-gray-500 mt-1">{cert.year}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
