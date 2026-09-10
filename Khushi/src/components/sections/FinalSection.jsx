import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FinalSection() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const fadeOverlayRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Reveal text smoothly
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 75%",
          },
        }
      );

      // Slow fade to black at the very bottom
      gsap.to(fadeOverlayRef.current, {
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "60% top",
          end: "bottom bottom",
          scrub: 1.2,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="final-chapter"
      ref={containerRef}
      className="relative w-full h-[160vh] flex flex-col items-center justify-start text-center select-none"
    >
      {/* Sticky viewport content - DSLR is centered by cameraTimeline */}
      <div className="sticky top-0 w-full h-screen flex flex-col items-center justify-center px-6 z-20 pointer-events-none">
        <div ref={textRef} className="flex flex-col items-center max-w-xl">
          <div className="mb-4 flex items-center gap-2.5">
            <span className="w-6 h-px bg-[#c8a97e]/60" />
            <span className="text-[9.5px] uppercase tracking-[0.35em] text-[#c8a97e] font-mono">
              EPILOGUE
            </span>
            <span className="w-6 h-px bg-[#c8a97e]/60" />
          </div>

          <h2 className="font-cinematic text-3xl sm:text-4xl md:text-5xl font-light text-[#f6f3ed] tracking-[0.35em] uppercase mb-6">
            SOME MOMENTS STAY.
          </h2>

          <div className="font-editorial text-xl sm:text-2xl text-[#dfc28d] font-light italic leading-relaxed space-y-1.5 mb-8">
            <p>Captured in passing.</p>
            <p>Remembered forever.</p>
          </div>

          <div className="w-10 h-px bg-white/20 mb-6" />

          <p className="text-[10px] tracking-[0.3em] text-[#8e8e98] font-mono uppercase">
            PENTAX K-1 // MEMORY ARCHIVE COMPLETED
          </p>
        </div>
      </div>

      {/* Ultimate Fade to Pure Black Overlay */}
      <div
        ref={fadeOverlayRef}
        className="fixed inset-0 bg-[#040406] opacity-0 pointer-events-none z-40"
      />
    </section>
  );
}
