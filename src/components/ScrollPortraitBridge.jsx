"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useFirestoreData } from "@/hooks/useFirestoreData";
import { useLightweightMotion } from "@/hooks/useLightweightMotion";

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (start, end, amount) => start + (end - start) * amount;
const easeInOut = (value) => value * value * (3 - 2 * value);

export default function ScrollPortraitBridge() {
  const lightweightMotion = useLightweightMotion();
  const { data: aboutData } = useFirestoreData("aboutpage", "main");
  const { data: profileData } = useFirestoreData("portfolio", "profile");
  const [state, setState] = useState(null);

  const photoUrl = useMemo(() => {
    const aboutPhotoUrl = typeof aboutData?.image?.url === "string" ? aboutData.image.url.trim() : "";
    const profilePhotoUrl = typeof profileData?.photoURL === "string" ? profileData.photoURL.trim() : "";
    return aboutPhotoUrl || profilePhotoUrl;
  }, [aboutData?.image?.url, profileData?.photoURL]);

  const displayInitial = String(profileData?.name || "D").trim().charAt(0).toUpperCase() || "D";

  useEffect(() => {
    if (lightweightMotion || typeof window === "undefined") {
      return undefined;
    }

    let frameId = 0;
    let sourceStart = null;

    const measure = () => {
      const source = document.querySelector("[data-scroll-portrait-source]");
      const target = document.querySelector("[data-scroll-portrait-target]");

      if (!source || !target) {
        setState(null);
        return;
      }

      const sourceRect = source.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      if (!sourceStart) {
        sourceStart = {
          left: sourceRect.left,
          top: sourceRect.top,
          width: sourceRect.width,
          height: sourceRect.height,
        };
      }

      const scrollY = window.scrollY || window.pageYOffset || 0;
      const targetAbsoluteTop = targetRect.top + scrollY;
      const travelStart = Math.max(0, sourceStart.top + scrollY - window.innerHeight * 0.18);
      const travelEnd = Math.max(travelStart + 1, targetAbsoluteTop - window.innerHeight * 0.24);
      const rawProgress = clamp((scrollY - travelStart) / (travelEnd - travelStart));
      const progress = easeInOut(rawProgress);

      const targetBox = {
        left: targetRect.left,
        top: targetRect.top,
        width: targetRect.width,
        height: targetRect.height,
      };

      const width = lerp(sourceStart.width, targetBox.width, progress);
      const height = lerp(sourceStart.height, targetBox.height, progress);
      const left = lerp(sourceStart.left, targetBox.left, progress);
      const top = lerp(sourceStart.top, targetBox.top, progress);
      const opacity = rawProgress <= 0.02 || rawProgress >= 0.985 ? 0 : Math.sin(rawProgress * Math.PI);

      setState({
        left,
        top,
        width,
        height,
        opacity,
        progress: rawProgress,
        rotateY: lerp(-16, 10, progress),
        rotateZ: lerp(-4, 2, Math.sin(rawProgress * Math.PI)),
        scale: lerp(0.98, 1.02, Math.sin(rawProgress * Math.PI)),
      });
    };

    const scheduleMeasure = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        measure();
      });
    };

    const resetAndMeasure = () => {
      sourceStart = null;
      scheduleMeasure();
    };

    measure();
    window.addEventListener("scroll", scheduleMeasure, { passive: true });
    window.addEventListener("resize", resetAndMeasure);
    window.addEventListener("orientationchange", resetAndMeasure);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener("scroll", scheduleMeasure);
      window.removeEventListener("resize", resetAndMeasure);
      window.removeEventListener("orientationchange", resetAndMeasure);
    };
  }, [lightweightMotion]);

  if (lightweightMotion || !state) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed z-[45] rounded-2xl"
      style={{
        left: state.left,
        top: state.top,
        width: state.width,
        height: state.height,
        opacity: state.opacity,
        perspective: 900,
      }}
    >
      <motion.div
        className="relative h-full w-full overflow-hidden rounded-2xl border border-cyansoft/35 bg-[var(--color-surface)] shadow-2xl shadow-black/25"
        style={{
          transform: `scale(${state.scale}) rotateY(${state.rotateY}deg) rotateZ(${state.rotateZ}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="absolute -inset-8 z-10 bg-gradient-to-tr from-transparent via-white/25 to-transparent opacity-40" />
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/28 via-transparent to-white/8" />
        {photoUrl ? (
          <img src={photoUrl} alt="" className="h-full w-full object-cover" loading="eager" decoding="async" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 via-cyan-700 to-amber-500 text-6xl font-bold text-white">
            {displayInitial}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
