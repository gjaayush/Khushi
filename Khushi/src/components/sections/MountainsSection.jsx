import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PhotoHero from "../gallery/PhotoHero";
import CinematicMoment from "../gallery/CinematicMoment";
import { GALLERY_PHOTOS } from "../../data/gallery";

gsap.registerPlugin(ScrollTrigger);

export default function MountainsSection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

  const heroMountain = GALLERY_PHOTOS.find((p) => p.id === "photo-22");
  const flagsSky = GALLERY_PHOTOS.find((p) => p.id === "photo-13");
  const flagsBridge = GALLERY_PHOTOS.find((p) => p.id === "photo-21");

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
    <div id="chapter-06" ref={sectionRef} className="relative w-full py-16 z-20">
      {/* Chapter 06 Header */}
      <div
        ref={headerRef}
        className="w-full max-w-4xl mx-auto px-6 mb-12 md:mb-16 flex flex-col items-center text-center"
      >
        <div className="flex items-center gap-2.5 mb-2.5">
          <span className="w-6 h-px bg-[#c8a97e]/60" />
          <span className="text-[9.5px] uppercase tracking-[0.35em] text-[#c8a97e] font-mono">
            CHAPTER 06
          </span>
          <span className="w-6 h-px bg-[#c8a97e]/60" />
        </div>
        <h2 className="font-cinematic text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-light text-[#f6f3ed] tracking-[0.3em] uppercase mb-2.5">
          THE MOUNTAINS
        </h2>
        <p className="font-editorial text-lg sm:text-xl text-[#dfc28d] italic tracking-wide max-w-lg">
          "The places we remember."
        </p>
      </div>

      {/* Large Viewport Hero: Caucasus High Pass & Glacial Lake */}
      {heroMountain && (
        <PhotoHero
          photo={heroMountain}
          statement="EVERY JOURNEY LEAVES SOMETHING BEHIND."
          subStatement="HIGH PASS // GLACIAL SANCTUARY"
        />
      )}

      {/* Prayer Flag Moments */}
      {flagsSky && (
        <CinematicMoment
          index={28}
          photo={flagsSky}
          align="right"
          cameraRotationDeg={540}
        />
      )}
      {flagsBridge && (
        <CinematicMoment
          index={29}
          photo={flagsBridge}
          align="left"
          cameraRotationDeg={620}
        />
      )}
    </div>
  );
}
