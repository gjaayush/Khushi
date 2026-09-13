import { useEffect, useState } from "react";
import gsap from "gsap";

// Critical assets to preload — GLB model + first visible images
const CRITICAL_ASSETS = [
  "/models/pentax_k-1_dslr.glb",
  "/media/Photo1.jpeg",
  "/media/Photo2.jpeg",
  "/media/photo3.jpeg",
  "/media/photo4.jpeg",
];

async function preloadAsset(url, onProgress) {
  try {
    const response = await fetch(url);
    const reader = response.body.getReader();
    const contentLength = parseInt(response.headers.get("Content-Length") || "0");
    let received = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.length;
      if (contentLength > 0) {
        onProgress(received / contentLength);
      }
    }
  } catch {
    // On any error, mark as complete so the loader never gets stuck
    onProgress(1);
  }
}

export default function PageLoader({ onLoaded }) {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const progresses = new Array(CRITICAL_ASSETS.length).fill(0);

    const updateTotal = (idx, val) => {
      progresses[idx] = val;
      // Weighted average: GLB is the heaviest (weight 3), images are lighter (weight 1 each)
      const weights = [3, 1, 1, 1, 1];
      const totalWeight = weights.reduce((a, b) => a + b, 0);
      const weighted = progresses.reduce((sum, p, i) => sum + p * weights[i], 0);
      const total = Math.min(99, Math.round((weighted / totalWeight) * 100));
      setProgress(total);
    };

    const promises = CRITICAL_ASSETS.map((url, idx) =>
      preloadAsset(url, (p) => updateTotal(idx, p))
    );

    // Safety timeout — if assets take > 8s, force dismiss anyway
    const safetyTimeout = setTimeout(() => {
      setProgress(100);
      dismiss();
    }, 8000);

    const dismiss = () => {
      clearTimeout(safetyTimeout);
      setProgress(100);
      gsap.to("#page-loader", {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          setHidden(true);
          if (onLoaded) onLoaded();
        },
      });
    };

    Promise.all(promises).then(dismiss);

    return () => {
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
            className="h-full bg-[#c8a97e] transition-all duration-200 ease-out"
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
