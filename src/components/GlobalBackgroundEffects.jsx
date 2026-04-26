const driftingParticles = [
  { left: "8%", top: "14%", size: 6, duration: 16, delay: 0 },
  { left: "18%", top: "74%", size: 5, duration: 20, delay: 1.2 },
  { left: "31%", top: "24%", size: 4, duration: 15, delay: 2.1 },
  { left: "42%", top: "82%", size: 7, duration: 18, delay: 0.7 },
  { left: "56%", top: "16%", size: 5, duration: 17, delay: 1.8 },
  { left: "64%", top: "58%", size: 4, duration: 21, delay: 2.8 },
  { left: "76%", top: "28%", size: 6, duration: 19, delay: 0.4 },
  { left: "88%", top: "68%", size: 5, duration: 22, delay: 3.2 },
];

const signalBeams = [
  "from-cyan-500/20 via-transparent to-transparent",
  "from-purple-500/20 via-transparent to-transparent",
  "from-blue-500/20 via-transparent to-transparent",
];

export default function GlobalBackgroundEffects() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <style>{`
        @keyframes bgFloatA {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.18; }
          50% { transform: translate3d(42px, -34px, 0) scale(1.08); opacity: 0.28; }
        }

        @keyframes bgFloatB {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.14; }
          50% { transform: translate3d(-38px, 24px, 0) scale(1.1); opacity: 0.22; }
        }

        @keyframes bgFloatC {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.12; }
          50% { transform: translate3d(28px, 32px, 0) scale(1.05); opacity: 0.19; }
        }

        @keyframes driftParticle {
          0%, 100% { transform: translate3d(0, 0, 0) scale(0.9); opacity: 0.2; }
          50% { transform: translate3d(0, -24px, 0) scale(1.15); opacity: 0.65; }
        }

        @keyframes gridPan {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(72px, 72px, 0); }
        }

        @keyframes beamSweep {
          0%, 100% { transform: translateX(-12%) rotate(-16deg); opacity: 0.16; }
          50% { transform: translateX(12%) rotate(-16deg); opacity: 0.28; }
        }

        @keyframes shimmerLine {
          0% { transform: translateX(-25%); opacity: 0; }
          20% { opacity: 0.35; }
          50% { opacity: 0.15; }
          100% { transform: translateX(25%); opacity: 0; }
        }
      `}</style>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_32%),linear-gradient(180deg,rgba(2,6,23,0.96),rgba(2,6,23,1))]" />

      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute left-[-8%] top-[-6%] h-[620px] w-[620px] rounded-full bg-cyan-500 blur-[140px]"
          style={{ animation: "bgFloatA 24s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-[-18%] right-[-4%] h-[720px] w-[720px] rounded-full bg-purple-500 blur-[150px]"
          style={{ animation: "bgFloatB 28s ease-in-out infinite" }}
        />
        <div
          className="absolute left-[28%] top-[30%] h-[460px] w-[460px] rounded-full bg-blue-500 blur-[110px]"
          style={{ animation: "bgFloatC 22s ease-in-out infinite" }}
        />
      </div>

      <div className="absolute inset-0 overflow-hidden opacity-70">
        {signalBeams.map((beam, index) => (
          <div
            key={beam}
            className={`absolute left-[-15%] h-40 w-[70%] rounded-full bg-gradient-to-r ${beam} blur-3xl`}
            style={{
              top: `${20 + index * 22}%`,
              animation: `beamSweep ${18 + index * 3}s ease-in-out infinite`,
              animationDelay: `${index * 1.1}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 overflow-hidden">
        {driftingParticles.map((particle, index) => (
          <span
            key={`${particle.left}-${particle.top}`}
            className="absolute rounded-full bg-white/70 shadow-[0_0_22px_rgba(34,211,238,0.35)]"
            style={{
              left: particle.left,
              top: particle.top,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animation: `driftParticle ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}

        <div className="absolute inset-x-0 top-[18%] h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
        <div
          className="absolute inset-x-[-20%] top-[18%] h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
          style={{ animation: "shimmerLine 10s ease-in-out infinite" }}
        />
        <div className="absolute inset-x-0 top-[66%] h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent" />
      </div>

      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div
          className="absolute inset-[-72px] [background-image:linear-gradient(rgba(34,211,238,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.08)_1px,transparent_1px)] [background-size:72px_72px]"
          style={{ animation: "gridPan 24s linear infinite" }}
        />
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 16% 24%, rgba(34, 211, 238, 0.08), transparent 26%), radial-gradient(circle at 78% 20%, rgba(168, 85, 247, 0.08), transparent 24%), radial-gradient(circle at 58% 78%, rgba(59, 130, 246, 0.07), transparent 22%)",
        }}
      />
    </div>
  );
}
