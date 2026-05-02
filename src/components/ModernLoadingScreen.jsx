import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const rings = [
  { size: "h-32 w-32", color: "var(--color-accent-a)", delay: 0 },
  { size: "h-24 w-24", color: "var(--color-accent-b)", delay: 0.16 },
  { size: "h-16 w-16", color: "var(--color-accent-c)", delay: 0.32 },
];

export default function ModernLoadingScreen({ ready = false }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{
        color: "var(--color-text)",
        background:
          "linear-gradient(135deg, color-mix(in srgb, var(--color-accent-a) 12%, transparent), transparent 32%), linear-gradient(225deg, color-mix(in srgb, var(--color-accent-c) 10%, transparent), transparent 34%), linear-gradient(180deg, var(--color-bg), var(--color-bg-strong))",
      }}
    >
      <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] [background-size:44px_44px]" />

      <motion.div
        className="relative z-10 flex flex-col items-center gap-7 px-6 text-center"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="relative flex h-36 w-36 items-center justify-center">
          {rings.map((ring, index) => (
            <motion.div
              key={ring.color}
              className={`absolute rounded-full border ${ring.size}`}
              style={{
                borderColor: ring.color,
                boxShadow: `0 0 ${18 + index * 8}px color-mix(in srgb, ${ring.color} 35%, transparent)`,
              }}
              animate={{
                rotate: index % 2 === 0 ? 360 : -360,
                scale: [1, 1.05, 1],
              }}
              transition={{
                rotate: { duration: 2.8 + index * 0.45, repeat: Infinity, ease: "linear" },
                scale: { duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: ring.delay },
              }}
            />
          ))}

          <motion.div
            className="relative flex h-20 w-20 items-center justify-center rounded-lg border text-3xl font-black"
            style={{
              borderColor: "var(--color-border-strong)",
              background: isDark ? "rgba(7, 16, 15, 0.82)" : "rgba(255, 255, 255, 0.86)",
              boxShadow: "var(--shadow-elevated)",
            }}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="bg-gradient-to-r from-[var(--color-accent-a)] via-[var(--color-accent-b)] to-[var(--color-accent-c)] bg-clip-text text-transparent">
              D
            </span>
          </motion.div>
        </div>

        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--color-faint)]">
            {ready ? "Almost There" : "Loading"}
          </div>
          <div className="mt-2 text-2xl font-black sm:text-3xl">
            Deepak<span className="text-[var(--color-accent-a)]">.</span>
          </div>
          <motion.div
            className="mx-auto mt-4 h-1 w-44 overflow-hidden rounded-full bg-[var(--color-surface-soft)]"
            aria-hidden="true"
          >
            <motion.div
              className="h-full w-20 rounded-full bg-gradient-to-r from-[var(--color-accent-a)] via-[var(--color-accent-b)] to-[var(--color-accent-c)]"
              animate={{ x: [-90, 176] }}
              transition={{ duration: 1.05, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
