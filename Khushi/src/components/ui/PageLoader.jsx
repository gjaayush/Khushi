import { useEffect, useState } from "react";
import gsap from "gsap";

export default function PageLoader({ onLoaded }) {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      count += Math.floor(Math.random() * 14) + 8;
      if (count >= 100) {
        count = 100;
        setProgress(100);
        clearInterval(interval);

        // Fade out loader smoothly
        gsap.to("#page-loader", {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            setHidden(true);
            if (onLoaded) onLoaded();
          },
        });
      } else {
        setProgress(count);
      }
    }, 35);

    // Safety timeout: max 2.5 seconds fallback
    const safetyTimeout = setTimeout(() => {
      setProgress(100);
      setHidden(true);
      if (onLoaded) onLoaded();
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(safetyTimeout);
    };
  }, [onLoaded]);

  if (hidden) return null;

  return (
    <div
      id="page-loader"
      className={`fixed inset-0 z-50 bg-[#060608] flex flex-col items-center justify-center select-none ${
        progress >= 100 ? "pointer-events-none" : ""
      }`}
    >
      <div className="flex flex-col items-center max-w-sm px-6 text-center">
        {/* Film aperture ring icon */}
        <div className="relative w-16 h-16 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-[#c8a97e]/30 animate-spin" style={{ animationDuration: "8s" }} />
          <div className="w-8 h-8 rounded-full border border-white/20" />
          <div className="w-2 h-2 rounded-full bg-[#c8a97e]" />
        </div>

        {/* Brand statement */}
        <span className="text-[10px] tracking-[0.4em] text-[#c8a97e] font-mono uppercase mb-3">
          OPTICAL MEMORY ARCHIVE
        </span>

        <h2 className="font-editorial text-2xl md:text-3xl text-[#f3efe6] font-light tracking-wide mb-8">
          A camera remembers moments.
        </h2>

        {/* Progress number */}
        <div className="font-mono text-3xl md:text-4xl text-[#c8a97e] font-light mb-3">
          {progress.toString().padStart(3, "0")}%
        </div>

        {/* Progress bar */}
        <div className="w-48 h-[1.5px] bg-white/10 overflow-hidden mb-4">
          <div
            className="h-full bg-[#c8a97e] transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-[9px] tracking-[0.3em] text-[#71717a] font-mono uppercase">
          INITIALIZING OPTICAL SENSOR
        </span>
      </div>
    </div>
  );
}
