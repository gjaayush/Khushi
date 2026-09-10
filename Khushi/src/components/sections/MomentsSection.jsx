import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CinematicMoment from "../gallery/CinematicMoment";
import { GALLERY_PHOTOS } from "../../data/gallery";

gsap.registerPlugin(ScrollTrigger);

export default function MomentsSection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

  const photos = GALLERY_PHOTOS.filter((p) => p.chapter === "chapter-03");

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

  const cameraRotations = [30, 110, 190, 260, 330, 400, 470, 540];
  const alignments = ["left", "right", "left", "right", "left", "right", "left", "right"];

  return (
    <div id="chapter-03" ref={sectionRef} className="relative w-full py-16 z-20">
      {/* Chapter 03 Header */}
      <div
        ref={headerRef}
        className="w-full max-w-4xl mx-auto px-6 mb-12 md:mb-16 flex flex-col items-center text-center"
      >
        <div className="flex items-center gap-2.5 mb-2.5">
          <span className="w-6 h-px bg-[#c8a97e]/60" />
          <span className="text-[9.5px] uppercase tracking-[0.35em] text-[#c8a97e] font-mono">
            CHAPTER 03
          </span>
          <span className="w-6 h-px bg-[#c8a97e]/60" />
        </div>
        <h2 className="font-cinematic text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-light text-[#f6f3ed] tracking-[0.3em] uppercase mb-2.5">
          MOMENTS
        </h2>
        <p className="font-editorial text-lg sm:text-xl text-[#dfc28d] italic tracking-wide max-w-lg mb-2">
          "We cross ordinary pavement and leave parts of ourselves behind."
        </p>
        <p className="text-[11px] sm:text-xs text-[#a1a1aa] font-light tracking-[0.18em] uppercase max-w-md">
          Passing through unfamiliar streets, fleeting greetings, and stone monuments.
        </p>
      </div>

      {/* Rhythmic Moments: Camera in position -> Shutter flash -> Photo reveals -> Photo drifts -> Camera rotates 90-120° */}
      {photos.map((photo, idx) => (
        <CinematicMoment
          key={photo.id}
          index={idx + 5}
          photo={photo}
          align={alignments[idx % alignments.length]}
          cameraRotationDeg={cameraRotations[idx % cameraRotations.length]}
          isHero={photo.isHero}
        />
      ))}
    </div>
  );
}
