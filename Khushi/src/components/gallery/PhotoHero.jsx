import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PhotoHero({
  photo,
  statement = "EVERY JOURNEY LEAVES SOMETHING BEHIND.",
  subStatement = "Caucasus High Pass // 2,400m",
  className = "",
}) {
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax translation
      if (imgRef.current) {
        gsap.fromTo(
          imgRef.current,
          { scale: 1.08, y: "4%" },
          {
            scale: 1.0,
            y: "-4%",
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      }

      // Elegant statement reveal
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 1.4,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 65%",
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
      className={`relative w-full min-h-[90vh] md:min-h-[100vh] flex flex-col items-center justify-center my-10 md:my-16 px-4 sm:px-8 ${className}`}
    >
      {/* Background Frame - ZERO overlays covering image */}
      <div className="relative w-full max-w-4xl h-[50vh] sm:h-[58vh] md:h-[62vh] max-h-[620px] overflow-hidden rounded-2xl photo-frame-glow photo-card-interactive border border-white/15 bg-[#09090c] shadow-2xl">
        {/* The crystal-clear photograph */}
        <img
          ref={imgRef}
          src={photo.src}
          alt={photo.title}
          loading="lazy"
          className="w-full h-full object-cover object-center block"
          style={{ opacity: 1, filter: "none" }}
        />

        {/* Minimal corner coordinate markings */}
        <div className="absolute top-4 left-4 sm:top-5 sm:left-5 text-[9px] tracking-[0.25em] text-white/85 font-mono bg-[#070709]/85 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
          N 42°39′ // E 44°38′
        </div>
        <div className="absolute top-4 right-4 sm:top-5 sm:right-5 text-[9px] tracking-[0.25em] text-white/85 font-mono bg-[#070709]/85 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
          ELEV 2379M
        </div>
      </div>

      {/* Statement below/overlaying bottom with luxury glass-panel */}
      <div
        ref={titleRef}
        className="w-full max-w-xl -mt-8 sm:-mt-10 z-20 px-6 py-5 rounded-2xl glass-panel flex flex-col items-center text-center shadow-2xl"
      >
        <span className="text-[9.5px] uppercase tracking-[0.35em] text-[#c8a97e] font-mono mb-1.5">
          {subStatement}
        </span>
        <h2 className="font-editorial text-xl sm:text-2xl md:text-3xl text-[#f6f3ed] font-light tracking-wide leading-snug">
          {statement}
        </h2>
      </div>
    </section>
  );
}
