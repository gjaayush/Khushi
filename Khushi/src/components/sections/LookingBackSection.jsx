import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CinematicMoment from "../gallery/CinematicMoment";
import { GALLERY_PHOTOS } from "../../data/gallery";

gsap.registerPlugin(ScrollTrigger);

export default function LookingBackSection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

  const windowPhoto = GALLERY_PHOTOS.find((p) => p.id === "photo-14");
  const balconyPhoto = GALLERY_PHOTOS.find((p) => p.id === "photo-15");
  const sunsetPhoto = GALLERY_PHOTOS.find((p) => p.id === "photo-30");

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

  return (
    <div id="chapter-07" ref={sectionRef} className="relative w-full py-16 z-20">
      {/* Chapter 07 Header */}
      <div
        ref={headerRef}
        className="w-full max-w-4xl mx-auto px-6 mb-12 md:mb-16 flex flex-col items-center text-center"
      >
        <div className="flex items-center gap-2.5 mb-2.5">
          <span className="w-6 h-px bg-[#c8a97e]/60" />
          <span className="text-[9.5px] uppercase tracking-[0.35em] text-[#c8a97e] font-mono">
            CHAPTER 07
          </span>
          <span className="w-6 h-px bg-[#c8a97e]/60" />
        </div>
        <h2 className="font-cinematic text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-light text-[#f6f3ed] tracking-[0.3em] uppercase mb-2.5">
          LOOKING BACK
        </h2>
        <p className="font-editorial text-lg sm:text-xl text-[#dfc28d] italic tracking-wide max-w-lg mb-2">
          "To look backward is not to linger, but to understand."
        </p>
        <p className="text-[11px] sm:text-xs text-[#a1a1aa] font-light tracking-[0.18em] uppercase max-w-md">
          Windows, quiet balconies, and the peaceful evening light of places left behind.
        </p>
      </div>

      {/* 1. Standing near window overlooking mountains - Rear viewfinder angle (180°) */}
      {windowPhoto && (
        <CinematicMoment
          index={30}
          photo={windowPhoto}
          align="left"
          cameraRotationDeg={720 + 180} // 180° back view
        />
      )}

      {/* 2. On balcony overlooking the valley */}
      {balconyPhoto && (
        <CinematicMoment
          index={31}
          photo={balconyPhoto}
          align="right"
          cameraRotationDeg={720 + 260} // Grip side
        />
      )}

      {/* 3. Golden hour candid memory */}
      {sunsetPhoto && (
        <CinematicMoment
          index={32}
          photo={sunsetPhoto}
          align="center"
          cameraRotationDeg={720 + 340} // Returning toward front
        />
      )}
    </div>
  );
}
