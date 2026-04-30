import { useLightweightMotion } from "@/hooks/useLightweightMotion";

export default function GlobalBackgroundEffects() {
  const lightweightMotion = useLightweightMotion();

  return (
    <div className="site-background pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="site-background-base absolute inset-0" />
      <div className="site-background-vignette absolute inset-0" />
      <div className="site-background-grid absolute inset-0" />

      {!lightweightMotion && (
        <div className="site-background-accent absolute inset-0 opacity-70" />
      )}
    </div>
  );
}
