import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PhotoScene({
  photo,
  align = "left", // 'left' | 'right' | 'center'
  priority = false,
  className = "",
}) {
  const sceneRef = useRef(null);
  const imageRef = useRef(null);
  const metaRef = useRef(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    const ctx = gsap.context(() => {
      // Smooth subtle parallax scrub on the photograph
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { y: "5%", scale: 1.04 },
          {
            y: "-5%",
            scale: 1.0,
            ease: "none",
            scrollTrigger: {
              trigger: sceneRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      }

      // Fade & lift in metadata gently
      if (metaRef.current) {
        gsap.fromTo(
          metaRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sceneRef.current,
              start: "top 75%",
            },
          }
        );
      }
    }, sceneRef);

    return () => ctx.revert();
  }, []);

  const isLeft = align === "left";
  const isRight = align === "right";
  const isCenter = align === "center";

  // Determine aspect class
  const aspectClass = photo.aspect === "9:16" ? "aspect-[9/16] max-w-[420px]" : "aspect-[3/4] max-w-[540px]";

  return (
    <section
      ref={sceneRef}
      className={`relative min-h-screen py-24 md:py-36 px-6 md:px-16 flex items-center ${
        isCenter ? "justify-center" : isLeft ? "justify-start md:pl-20" : "justify-end md:pr-20"
      } ${className}`}
    >
      <div
        className={`w-full max-w-7xl flex flex-col ${
          isCenter
            ? "items-center text-center"
            : isLeft
            ? "md:flex-row items-start md:items-end gap-8 md:gap-14"
            : "md:flex-row-reverse items-start md:items-end gap-8 md:gap-14"
        }`}
      >
        {/* The Photograph Frame */}
        <div
          className={`relative w-full ${aspectClass} overflow-hidden rounded-sm bg-[#0d0d12] photo-frame-glow border border-white/5 group`}
        >
          {/* Subtle corner view-finder brackets */}
          <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-white/20 z-10 pointer-events-none" />
          <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-white/20 z-10 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-white/20 z-10 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-white/20 z-10 pointer-events-none" />

          {/* Actual image */}
          <img
            ref={imageRef}
            src={photo.src}
            alt={photo.title}
            loading={priority ? "eager" : "lazy"}
            className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
          />

          {/* Soft inner shadow/vignette */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
        </div>

        {/* Editorial Text & Photographic Metadata */}
        <div
          ref={metaRef}
          className={`max-w-md ${isCenter ? "mt-8" : "mb-2"} flex flex-col`}
        >
          {/* Subtle Roman / Chapter label */}
          <div className="flex items-center gap-3 mb-3">
            <span className="w-6 h-px bg-[#c8a97e]/60" />
            <span className="text-[11px] uppercase tracking-[0.28em] text-[#c8a97e] font-medium">
              {photo.location}
            </span>
          </div>

          {/* Image Title */}
          <h3 className="font-editorial text-2xl md:text-3xl lg:text-4xl text-[#f3efe6] font-light tracking-wide leading-tight mb-3">
            {photo.title}
          </h3>

          {/* Restrained poetic caption */}
          {photo.caption && (
            <p className="text-sm md:text-base text-[#a1a1aa] font-light leading-relaxed mb-6">
              {photo.caption}
            </p>
          )}

          {/* Camera EXIF Strip */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] tracking-[0.2em] text-[#71717a] uppercase font-mono">
            {photo.focalLength && <span>{photo.focalLength}</span>}
            {photo.aperture && <span>{photo.aperture}</span>}
            {photo.shutter && <span>{photo.shutter}</span>}
            {photo.iso && <span>ISO {photo.iso}</span>}
            {photo.date && <span>• {photo.date}</span>}
          </div>
        </div>
      </div>
    </section>
  );
}
