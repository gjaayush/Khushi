import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PhotoSection({
  mainPhoto,
  altPhoto,
  title,
  subtitle,
  caption,
  className = "",
}) {
  const containerRef = useRef(null);
  const mainImgRef = useRef(null);
  const altImgRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      if (mainImgRef.current) {
        gsap.fromTo(
          mainImgRef.current,
          { y: "4%", scale: 1.03 },
          {
            y: "-4%",
            scale: 1.0,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.3,
            },
          }
        );
      }

      if (altImgRef.current) {
        gsap.fromTo(
          altImgRef.current,
          { y: "-6%", scale: 1.05 },
          {
            y: "6%",
            scale: 1.0,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.3,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className={`relative min-h-screen py-28 px-6 md:px-16 flex flex-col items-center justify-center ${className}`}
    >
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-12 lg:gap-20">
        {/* Main Shot */}
        <div className="w-full md:w-7/12 flex flex-col">
          <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-[#09090d] photo-frame-glow border border-white/10 group">
            <img
              ref={mainImgRef}
              src={mainPhoto.src}
              alt={mainPhoto.title}
              loading="lazy"
              className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-4 left-4 text-[10px] tracking-[0.25em] text-[#c8a97e] font-mono uppercase bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              PRIMARY PERSPECTIVE
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-[11px] tracking-[0.2em] text-[#71717a] font-mono uppercase">
            <span>{mainPhoto.title}</span>
            <span>{mainPhoto.location}</span>
          </div>
        </div>

        {/* Continuation / Alternate Angle + Editorial Context */}
        <div className="w-full md:w-5/12 flex flex-col justify-center">
          {altPhoto && (
            <div className="relative aspect-[3/4] max-w-[320px] mb-8 overflow-hidden rounded-sm bg-[#09090d] photo-frame-glow border border-white/10 group self-start md:self-auto">
              <img
                ref={altImgRef}
                src={altPhoto.src}
                alt={altPhoto.title}
                loading="lazy"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-3 left-3 text-[9px] tracking-[0.2em] text-white/70 font-mono uppercase bg-black/70 px-2.5 py-0.5 rounded-full border border-white/10">
                CONTINUATION
              </div>
            </div>
          )}

          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#c8a97e] font-medium mb-2">
              {subtitle || "CONTINUATION OF A MOMENT"}
            </span>
            <h3 className="font-editorial text-2xl md:text-3xl lg:text-4xl text-[#f3efe6] font-light tracking-wide leading-tight mb-4">
              {title || mainPhoto.title}
            </h3>
            <p className="text-sm md:text-base text-[#a1a1aa] font-light leading-relaxed mb-6">
              {caption || mainPhoto.caption}
            </p>

            <div className="flex items-center gap-6 text-[10px] tracking-[0.25em] text-[#71717a] font-mono uppercase pt-4 border-t border-white/10">
              <span>{mainPhoto.focalLength}</span>
              <span>{mainPhoto.aperture}</span>
              <span>{mainPhoto.shutter}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
