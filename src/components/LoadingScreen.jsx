import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLightweightMotion } from "@/hooks/useLightweightMotion";

const loaderSteps = [
  { label: "Booting interface", threshold: 18 },
  { label: "Syncing portfolio data", threshold: 42 },
  { label: "Mapping projects and resume", threshold: 68 },
  { label: "Launching experience", threshold: 92 },
];

const loaderParticles = [
  { left: "14%", top: "20%", size: 8, delay: 0 },
  { left: "28%", top: "72%", size: 6, delay: 0.8 },
  { left: "46%", top: "16%", size: 5, delay: 1.4 },
  { left: "58%", top: "78%", size: 7, delay: 0.4 },
  { left: "74%", top: "30%", size: 6, delay: 1.8 },
  { left: "86%", top: "62%", size: 5, delay: 2.3 },
];

export default function Loader({ ready = false, onFinish }) {
  const [progress, setProgress] = useState(8);
  const finishedRef = useRef(false);
  const lightweightMotion = useLightweightMotion();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((current) => {
        const target = ready ? 100 : 94;
        if (current >= target) return target;

        const remaining = target - current;
        const step = ready ? Math.max(remaining * 0.28, 1.6) : Math.max(remaining * 0.1, 0.45);
        return Math.min(target, current + step);
      });
    }, 90);

    return () => clearInterval(interval);
  }, [ready]);

  useEffect(() => {
    if (!ready || progress < 100 || finishedRef.current) return;

    finishedRef.current = true;
    const timer = setTimeout(() => {
      onFinish?.();
    }, 220);

    return () => clearTimeout(timer);
  }, [onFinish, progress, ready]);

  const activeStep = useMemo(() => {
    let currentStep = null;
    for (const step of loaderSteps) {
      if (progress >= step.threshold) {
        currentStep = step;
      }
    }

    return currentStep?.label || "Preparing experience";
  }, [progress]);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#06100f]">
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(20,184,166,0.18),transparent_38%),linear-gradient(220deg,rgba(245,158,11,0.12),transparent_34%),linear-gradient(135deg,#07100f,#050808_52%,#020303_100%)]" />

      {!lightweightMotion && (
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -left-24 top-[-8%] h-[360px] w-[360px] rounded-full bg-emerald-500/18 blur-[92px]"
            animate={{ x: [0, 54, 0], y: [0, -24, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -right-20 bottom-[-10%] h-[380px] w-[380px] rounded-full bg-amber-500/16 blur-[96px]"
            animate={{ x: [0, -44, 0], y: [0, 26, 0], scale: [1, 1.12, 1] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      )}

      <div className="absolute inset-0 opacity-[0.09] [background-image:linear-gradient(rgba(226,232,240,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(226,232,240,0.18)_1px,transparent_1px)] [background-size:64px_64px]" />

      {!lightweightMotion && loaderParticles.map((particle) => (
        <motion.span
          key={`${particle.left}-${particle.top}`}
          className="absolute rounded-full bg-emerald-100/70 shadow-[0_0_18px_rgba(20,184,166,0.35)]"
          style={{
            left: particle.left,
            top: particle.top,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, -24, 0],
            opacity: [0.2, 0.65, 0.2],
            scale: [0.9, 1.12, 0.9],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: lightweightMotion ? 0.12 : 0.45, ease: "easeOut" }}
        className="relative z-10 mx-4 w-full max-w-[520px]"
      >
        <div className="rounded-lg border border-emerald-200/10 bg-[#07100f]/88 p-6 shadow-xl shadow-black/35 backdrop-blur-sm sm:p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200/80">
                Deepak Portfolio
              </p>
              <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">
                Warming up the experience
              </h2>
            </div>
            <div className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-100">
              {Math.round(progress)}%
            </div>
          </div>

          <div className="mb-8 flex items-center gap-6">
            <div className="relative flex h-24 w-24 items-center justify-center">
              <motion.div
                className="absolute inset-0 rounded-full border border-emerald-300/30"
                animate={lightweightMotion ? undefined : { rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-[10px] rounded-full border border-amber-300/35"
                animate={lightweightMotion ? undefined : { rotate: -360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-[20px] rounded-full bg-gradient-to-br from-emerald-300 via-teal-500 to-amber-300 shadow-[0_0_28px_rgba(20,184,166,0.25)]"
                animate={lightweightMotion ? undefined : { scale: [1, 1.06, 1] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="relative z-10 text-2xl font-black text-white">D</span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/45">
                Status
              </p>
              <p className="mt-2 text-lg font-semibold text-white">{activeStep}</p>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Pulling in profile data, refreshing the resume source, and tuning the interface
                before we render the full site.
              </p>
            </div>
          </div>

          <div className="mb-6 h-2 overflow-hidden rounded-full bg-white/8">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-teal-500 to-amber-300 shadow-[0_0_20px_rgba(20,184,166,0.35)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {loaderSteps.map((step) => {
              const isDone = progress >= step.threshold;
              return (
                <motion.div
                  key={step.label}
                  className={`rounded-2xl border px-4 py-3 transition-colors ${
                    isDone
                      ? "border-emerald-300/30 bg-emerald-300/10 text-white"
                      : "border-white/8 bg-white/[0.03] text-white/55"
                  }`}
                  animate={!lightweightMotion && isDone ? { scale: [1, 1.015, 1] } : {}}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        isDone ? "bg-emerald-200 shadow-[0_0_12px_rgba(20,184,166,0.65)]" : "bg-white/20"
                      }`}
                    />
                    <span className="text-sm font-medium">{step.label}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
