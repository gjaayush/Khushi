import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CinematicMoment from "../gallery/CinematicMoment";
import { GALLERY_PHOTOS } from "../../data/gallery";

gsap.registerPlugin(ScrollTrigger);

export default function JourneySection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

  const photos = GALLERY_PHOTOS.filter((p) => p.chapter === "chapter-04");

  useEffect(() => {
    if (!headerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const cameraRotations = [60, 150, 240, 310, 390, 480, 560, 640, 720];
  const alignments = ["left", "right", "left", "right", "left", "right", "left", "right", "center"];

  return (
    <div id="chapter-04" ref={sectionRef} className="relative w-full py-16 z-20">
      {/* Chapter 04 Header */}
      <div
        ref={headerRef}
        className="w-full max-w-4xl mx-auto px-6 mb-12 md:mb-16 flex flex-col items-center text-center"
      >
        <div className="flex items-center gap-2.5 mb-2.5">
          <span className="w-6 h-px bg-[#c8a97e]/60" />
          <span className="text-[9.5px] uppercase tracking-[0.35em] text-[#c8a97e] font-mono">
            CHAPTER 04
          </span>
          <span className="w-6 h-px bg-[#c8a97e]/60" />
        </div>
        <h2 className="font-cinematic text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-light text-[#f6f3ed] tracking-[0.3em] uppercase mb-2.5">
          THE JOURNEY
        </h2>
        <p className="font-editorial text-lg sm:text-xl text-[#dfc28d] italic tracking-wide max-w-lg mb-2">
          "The road bends, the mist gathers, and the valley opens."
        </p>
        <p className="text-[11px] sm:text-xs text-[#a1a1aa] font-light tracking-[0.18em] uppercase max-w-md">
          Winding tarmac through cloud banks, morning tea above the valleys, and nights under neon hope.
        </p>
      </div>

      {/* Rhythmic Moments */}
      {photos.map((photo, idx) => (
        <CinematicMoment
          key={photo.id}
          index={idx + 15}
          photo={photo}
          align={alignments[idx % alignments.length]}
          cameraRotationDeg={cameraRotations[idx % cameraRotations.length]}
          isHero={photo.isHero}
        />
      ))}
    </div>
  );
}
