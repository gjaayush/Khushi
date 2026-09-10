import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PhotoSequence from "../gallery/PhotoSequence";
import CinematicMoment from "../gallery/CinematicMoment";
import { GALLERY_PHOTOS } from "../../data/gallery";

gsap.registerPlugin(ScrollTrigger);

export default function ForestSection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

  const placePhoto = GALLERY_PHOTOS.find((p) => p.id === "photo-26");
  const personPhoto = GALLERY_PHOTOS.find((p) => p.id === "photo-17");
  const trailPhoto = GALLERY_PHOTOS.find((p) => p.id === "photo-07");

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
    <div id="chapter-05" ref={sectionRef} className="relative w-full py-16 z-20">
      {/* Chapter 05 Header */}
      <div
        ref={headerRef}
        className="w-full max-w-4xl mx-auto px-6 mb-12 md:mb-16 flex flex-col items-center text-center"
      >
        <div className="flex items-center gap-2.5 mb-2.5">
          <span className="w-6 h-px bg-[#c8a97e]/60" />
          <span className="text-[9.5px] uppercase tracking-[0.35em] text-[#c8a97e] font-mono">
            CHAPTER 05
          </span>
          <span className="w-6 h-px bg-[#c8a97e]/60" />
        </div>
        <h2 className="font-cinematic text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-light text-[#f6f3ed] tracking-[0.3em] uppercase mb-2.5">
          INTO THE FOREST
        </h2>
        <p className="font-editorial text-lg sm:text-xl text-[#dfc28d] italic tracking-wide max-w-lg mb-2.5">
          "First there is the silence of the trees. Then there is you."
        </p>
        <div className="flex items-center gap-3 text-[10px] tracking-[0.25em] text-[#c8a97e] font-mono uppercase">
          <span>PLACE</span>
          <span className="opacity-50">→</span>
          <span>PERSON</span>
          <span className="opacity-50">→</span>
          <span>MEMORY</span>
        </div>
      </div>

      {/* Pinned Sequence: PLACE -> PERSON & MEMORY */}
      {placePhoto && personPhoto && (
        <PhotoSequence
          placePhoto={placePhoto}
          personPhoto={personPhoto}
          className="my-12"
        />
      )}

      {/* Companions on the slope */}
      {trailPhoto && (
        <CinematicMoment
          index={26}
          photo={trailPhoto}
          align="center"
          cameraRotationDeg={450}
        />
      )}
    </div>
  );
}
