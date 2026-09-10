import { useEffect, useState } from "react";

export default function ScrollIndicator() {
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        const p = Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100));
        setScrollPercent(Math.round(p));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed right-6 bottom-8 z-30 hidden md:flex items-center gap-3 select-none pointer-events-none">
      <div className="h-16 w-[1.5px] bg-white/10 relative overflow-hidden">
        <div
          className="w-full bg-[#c8a97e] transition-all duration-150 ease-out"
          style={{ height: `${scrollPercent}%` }}
        />
      </div>
      <div className="text-[9px] tracking-[0.25em] text-[#71717a] font-mono">
        {scrollPercent.toString().padStart(2, "0")}%
      </div>
    </div>
  );
}
