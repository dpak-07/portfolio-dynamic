import { useLightweightMotion } from "@/hooks/useLightweightMotion";

export default function GlobalBackgroundEffects() {
  const lightweightMotion = useLightweightMotion();

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#06100f]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(20,184,166,0.22),transparent_36%),linear-gradient(225deg,rgba(245,158,11,0.13),transparent_34%),linear-gradient(180deg,#07110f_0%,#050808_58%,#020303_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.055),transparent_24%,rgba(0,0,0,0.38))]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(226,232,240,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(226,232,240,0.18)_1px,transparent_1px)] [background-size:56px_56px]" />

      {!lightweightMotion && (
        <div className="absolute inset-0 opacity-45">
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-emerald-300/12 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-amber-300/8 to-transparent" />
        </div>
      )}
    </div>
  );
}
