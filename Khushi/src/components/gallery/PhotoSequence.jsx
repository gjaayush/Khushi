import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PhotoSequence({
  placePhoto,
  personPhoto,
  className = "",
}) {
  const containerRef = useRef(null);
  const placeImgRef = useRef(null);
  const personImgRef = useRef(null);
  const textPlaceRef = useRef(null);
  const textPersonRef = useRef(null);
  const progressLineRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=220%",
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
        },
      });

      // Sequence timeline:
      // Phase 1: Place is visible and slowly zooms
      // Phase 2: Crossfade from Place to Person & Memory
      // Phase 3: Person holds in full clarity, text reveals

      tl.to(placeImgRef.current, {
        scale: 1.05,
        ease: "none",
        duration: 0.5,
      }, 0);

      tl.to(progressLineRef.current, {
        scaleX: 1,
        ease: "none",
        duration: 1,
      }, 0);

      tl.to(textPlaceRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.25,
        ease: "power2.in",
      }, 0.35);

      tl.to(personImgRef.current, {
        opacity: 1,
        scale: 1.0,
        duration: 0.45,
        ease: "power2.inOut",
      }, 0.45);

      tl.to(textPersonRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: "power2.out",
      }, 0.6);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-screen bg-[#060608] flex items-center justify-center overflow-hidden ${className}`}
    >
      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl px-4 sm:px-6 md:px-10 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 lg:gap-14">
        {/* Pinned Image Frame - 100% crystal clear */}
        <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[340px] lg:max-w-[370px] aspect-[3/4] overflow-hidden rounded-xl bg-[#0a0a0e] photo-frame-glow photo-card-interactive border border-white/15 shadow-2xl">
          {/* PLACE IMAGE */}
          <div className="absolute inset-0">
            <img
              ref={placeImgRef}
              src={placePhoto.src}
              alt={placePhoto.title}
              loading="lazy"
              className="w-full h-full object-cover object-center block"
              style={{ opacity: 1, filter: "none" }}
            />
          </div>

          {/* PERSON & MEMORY IMAGE */}
          <div
            ref={personImgRef}
            className="absolute inset-0 opacity-0 scale-105"
          >
            <img
              src={personPhoto.src}
              alt={personPhoto.title}
              loading="lazy"
              className="w-full h-full object-cover object-center block"
              style={{ opacity: 1, filter: "none" }}
            />
          </div>

          {/* Viewfinder corner brackets */}
          <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#c8a97e]/80 z-20 pointer-events-none" />
          <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#c8a97e]/80 z-20 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#c8a97e]/80 z-20 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#c8a97e]/80 z-20 pointer-events-none" />

          {/* Phase Badge */}
          <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 px-2.5 py-1 bg-[#070709]/85 backdrop-blur-md rounded border border-white/15 text-[9px] tracking-[0.22em] text-[#c8a97e] uppercase font-mono">
            <span>SEQUENCE</span>
            <span className="w-1 h-1 rounded-full bg-[#c8a97e]" />
            <span>01 & 02</span>
          </div>
        </div>

        {/* Narrative Progression Glassmorphic Card */}
        <div className="w-full max-w-[320px] sm:max-w-[350px] md:max-w-[340px] lg:max-w-[370px] glass-panel rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col">
          {/* Linear Progress Indicator */}
          <div className="w-24 h-[2px] bg-white/10 mb-5 overflow-hidden rounded-full">
            <div
              ref={progressLineRef}
              className="w-full h-full bg-[#c8a97e] origin-left scale-x-0"
            />
          </div>

          {/* Dynamic Content Container */}
          <div className="relative min-h-[140px]">
            {/* Phase 1 Text: PLACE */}
            <div ref={textPlaceRef} className="absolute inset-0 flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#c8a97e] font-mono font-medium mb-1.5">
                01 — PLACE
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl text-[#f6f3ed] font-light leading-snug mb-2.5">
                {placePhoto.title}
              </h3>
              <p className="text-xs sm:text-[13px] text-[#b4b4bc] font-light leading-relaxed">
                Before memory takes form, there is only the quiet architecture of the trees and descending mountain fog.
              </p>
            </div>

            {/* Phase 2 Text: PERSON & MEMORY */}
            <div
              ref={textPersonRef}
              className="absolute inset-0 flex flex-col opacity-0 translate-y-3"
            >
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#c8a97e] font-mono font-medium mb-1.5">
                02 — PERSON & MEMORY
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl text-[#f6f3ed] font-light leading-snug mb-2.5">
                {personPhoto.title}
              </h3>
              <p className="text-xs sm:text-[13px] text-[#b4b4bc] font-light leading-relaxed">
                Then she steps into the frame. The forest is no longer just a place—it becomes a memory.
              </p>
            </div>
          </div>

          {/* Location & Metadata */}
          <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] tracking-[0.2em] text-[#8e8e98] font-mono uppercase">
            <span>{placePhoto.location}</span>
            <span className="text-[#c8a97e]">LEPCHAJAGAT</span>
          </div>
        </div>
      </div>
    </div>
  );
}
