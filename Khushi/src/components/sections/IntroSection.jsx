import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function IntroSection() {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Intro timeline on load
      const tl = gsap.timeline({ delay: 0.4 });

      tl.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.6, ease: "power3.out" }
      ).fromTo(
        footerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" },
        "-=0.8"
      );

      // Fade out on scroll
      gsap.to([headerRef.current, footerRef.current], {
        opacity: 0,
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "50% top",
          scrub: 1.0,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="chapter-01"
      ref={containerRef}
      className="relative w-full h-[160vh] flex flex-col items-center justify-between select-none"
    >
      {/* Viewfinder Corner Overlays */}
      <div className="fixed inset-6 sm:inset-10 pointer-events-none z-20 flex flex-col justify-between opacity-60">
        <div className="flex justify-between items-start">
          <div className="w-4 h-4 border-t border-l border-[#c8a97e]/60" />
          <div className="text-[9px] font-mono tracking-[0.25em] text-[#c8a97e]/70 uppercase hidden sm:block">
            DSLR ARCHIVE // 35MM FULL FRAME
          </div>
          <div className="w-4 h-4 border-t border-r border-[#c8a97e]/60" />
        </div>
        <div className="flex justify-between items-end">
          <div className="w-4 h-4 border-b border-l border-[#c8a97e]/60" />
          <div className="text-[9px] font-mono tracking-[0.25em] text-[#8e8e98] uppercase hidden sm:block">
            36.4 MP // SENSOR STABILIZED
          </div>
          <div className="w-4 h-4 border-b border-r border-[#c8a97e]/60" />
        </div>
      </div>

      {/* Sticky viewport content - 3D DSLR is centered behind/beside */}
      <div className="sticky top-0 w-full h-screen flex flex-col items-center justify-between py-12 sm:py-16 px-6 z-20 pointer-events-none">
        {/* Top Header */}
        <div ref={headerRef} className="flex flex-col items-center text-center mt-4 sm:mt-6">
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="w-6 h-px bg-[#c8a97e]/60" />
            <span className="text-[9.5px] uppercase tracking-[0.35em] text-[#c8a97e] font-mono font-medium">
              CHAPTER 01 // PROLOGUE
            </span>
            <span className="w-6 h-px bg-[#c8a97e]/60" />
          </div>

          <h1 className="font-cinematic text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-[#f6f3ed] tracking-[0.35em] uppercase mb-2">
            THROUGH A LENS
          </h1>

          <p className="font-editorial text-base sm:text-xl text-[#dfc28d] font-light italic tracking-wider">
            A collection of moments.
          </p>
        </div>

        {/* Bottom Editorial Quote & Interactive 3D Rotation Cue */}
        <div ref={footerRef} className="flex flex-col items-center text-center mb-4 sm:mb-6">
          <div className="px-4 py-2 rounded-full glass-panel mb-4 pointer-events-auto">
            <p className="text-[11px] sm:text-xs text-[#b4b4bc] font-light tracking-[0.18em] uppercase">
              "A camera doesn't remember everything. It remembers moments."
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            {/* Interactive hint badge */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[8.5px] tracking-[0.25em] text-[#c8a97e] font-mono uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8a97e] animate-ping" />
              <span>DRAG OR MOVE MOUSE TO ROTATE 3D CAMERA</span>
            </div>
            <div className="w-[1.5px] h-6 bg-gradient-to-b from-[#c8a97e] to-transparent animate-pulse mt-1" />
          </div>
        </div>
      </div>
    </section>
  );
}
