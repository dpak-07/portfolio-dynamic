import { useEffect, useState } from "react";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";

export default function Loader({ onFinish }) {
  const [hide, setHide] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 24;
      });
    }, 300);

    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setHide(true);
        setTimeout(() => {
          onFinish?.();
        }, 800);
      }, 300);
    }, 4500);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black transition-opacity duration-1000 ${
        hide ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-[90%] max-w-[420px]"
      >
        <div className="rounded-3xl bg-black/90 p-8 border border-white/10 shadow-2xl">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-red-500" />
            <span className="h-3 w-3 rounded-full bg-yellow-500" />
            <span className="h-3 w-3 rounded-full bg-green-500" />
            <div className="ml-3 text-xs text-white/50 font-mono tracking-widest">
              INITIALIZING...
            </div>
          </div>

          <div className="font-mono text-sm leading-7 text-cyan-300 mb-8 min-h-[120px]">
            <TypeAnimation
              sequence={[
                "> Deepak.portfolio v2.0\n",
                350,
                "> Initializing core modules...\n",
                250,
                "> Rendering components\n",
                250,
                "> Syncing Firebase data\n",
                250,
                "> Compiling stylesheets\n",
                250,
                "> Launching portfolio experience...\n",
                500,
              ]}
              speed={70}
              repeat={0}
              cursor={true}
              className="text-cyan-300"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-white/60 uppercase tracking-widest">
                Loading
              </span>
              <span className="text-xs font-mono text-cyan-400">
                {Math.round(progress)}%
              </span>
            </div>

            <div className="h-1 bg-white/5 rounded-full overflow-hidden border border-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
          </div>

          <motion.div
            className="mt-6 text-center"
            animate={{ opacity: [0.55, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <p className="text-xs text-white/40 font-mono tracking-widest">
              {progress < 35
                ? "Preparing data..."
                : progress < 75
                ? "Warming the interface..."
                : "Almost there..."}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
