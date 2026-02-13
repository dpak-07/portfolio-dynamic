import { useEffect, useState } from "react";
import { TypeAnimation } from "react-type-animation";

export default function Loader({ onFinish }) {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHide(true);
      setTimeout(() => {
        onFinish?.();
      }, 600);
    }, 4200); // total loader duration

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#0b0f14] transition-opacity duration-700 ${hide ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
    >
      <div className="w-[340px] rounded-2xl bg-[#0f1620] p-6 shadow-2xl shadow-emerald-500/10 border border-white/5">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-yellow-400" />
          <span className="h-3 w-3 rounded-full bg-green-400" />
        </div>

        <div className="font-mono text-sm leading-6 text-emerald-400">
          <TypeAnimation
            sequence={[
              "> initializing portfolio...\n",
              600,
              "> loading Deepak.exe...\n",
              600,
              "> compiling cool stuff...\n",
              600,
              "> launching experience...\n",
              800,
            ]}
            speed={60}
            repeat={0}
            cursor={true}
          />
        </div>
      </div>
    </div>
  );
}
