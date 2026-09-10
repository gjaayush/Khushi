import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CinematicMoment({
  photo,
  index = 0,
  align = "left", // 'left' | 'right' | 'center'
  cameraRotationDeg = 0, // Target Y rotation in degrees for this moment
  isHero = false,
  className = "",
}) {
  const stageRef = useRef(null);
  const cardRef = useRef(null);
  const flashRef = useRef(null);
  const textRef = useRef(null);
  const exifRef = useRef(null);

  useEffect(() => {
    if (!stageRef.current) return;

    const ctx = gsap.context(() => {
      // Create ScrollTrigger timeline for photograph reveal & hold
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stageRef.current,
          start: "top 85%",
          end: "bottom 15%",
          scrub: 1.2,
        },
      });

      // 1. Shutter Flash / Aperture pulse at entry (CAMERA -> CLICK)
      tl.fromTo(
        flashRef.current,
        { opacity: 0, scale: 0.6 },
        { opacity: 0.7, scale: 1.4, duration: 0.12, ease: "power2.out" },
        0.1
      ).to(
        flashRef.current,
        { opacity: 0, scale: 1.8, duration: 0.2, ease: "power2.in" },
        0.22
      );

      // 2. Photo emerges from camera/lens area (PHOTO REVEALS with 100% clarity)
      tl.fromTo(
        cardRef.current,
        { opacity: 0, scale: 0.85, y: 50 },
        { opacity: 1, scale: 1.0, y: 0, duration: 0.35, ease: "power2.out" },
        0.15
      );

      // 3. Text and metadata reveal
      tl.fromTo(
        [textRef.current, exifRef.current],
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.3, ease: "power2.out" },
        0.25
      );

      // 4. Photo holds crystal-clear focus in center of scroll (0.45 - 0.7)

      // 5. Photo drifts downward and dissolves (PHOTO DRIFTS AWAY)
      // While camera rotates 90-120° into next angle
      tl.to(
        cardRef.current,
        { opacity: 0, y: 70, scale: 0.96, duration: 0.3, ease: "power2.in" },
        0.7
      );

      tl.to(
        [textRef.current, exifRef.current],
        { opacity: 0, y: 35, duration: 0.25, ease: "power2.in" },
        0.72
      );

    }, stageRef);

    return () => ctx.revert();
  }, [index, cameraRotationDeg, align]);

  const isLeft = align === "left";
  const isRight = align === "right";
  const isCenter = align === "center";

  // Compact luxury aspect sizing tailored for desktop, iPad, and mobile
  const aspectClass =
    photo.aspect === "9:16"
      ? "aspect-[9/16] w-full max-w-[270px] sm:max-w-[300px] md:max-w-[315px] lg:max-w-[345px]"
      : "aspect-[3/4] w-full max-w-[290px] sm:max-w-[330px] md:max-w-[345px] lg:max-w-[380px]";

  return (
    <section
      ref={stageRef}
      className={`relative min-h-[110vh] md:min-h-[120vh] flex items-center justify-center px-4 sm:px-6 md:px-10 py-12 overflow-hidden ${className}`}
    >
      {/* Optical Shutter Flash Bloom (strictly behind the photo) */}
      <div
        ref={flashRef}
        className="absolute pointer-events-none w-72 h-72 rounded-full bg-radial from-[#ffffff] via-[#c8a97e]/25 to-transparent blur-3xl opacity-0 z-10"
        aria-hidden="true"
      />

      {/* Responsive Content Container: Balanced split on iPad & Desktop */}
      <div
        className={`relative z-20 w-full max-w-6xl flex flex-col ${
          isCenter
            ? "items-center text-center gap-6"
            : isLeft
            ? "md:flex-row items-center md:items-center justify-start gap-6 md:gap-8 lg:gap-12 md:pl-6 lg:pl-10"
            : "md:flex-row-reverse items-center md:items-center justify-start gap-6 md:gap-8 lg:gap-12 md:pr-6 lg:pr-10"
        }`}
      >
        {/* The Photograph: 100% crystal-clear, zero overlays, luxury framing */}
        <div
          ref={cardRef}
          className={`relative ${aspectClass} overflow-hidden rounded-xl bg-[#0a0a0f] photo-frame-glow photo-card-interactive border border-white/15 will-change-transform shadow-2xl group`}
        >
          {/* Viewfinder corner brackets */}
          <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#c8a97e]/80 z-20 pointer-events-none group-hover:border-[#dfc28d] transition-colors" />
          <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#c8a97e]/80 z-20 pointer-events-none group-hover:border-[#dfc28d] transition-colors" />
          <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#c8a97e]/80 z-20 pointer-events-none group-hover:border-[#dfc28d] transition-colors" />
          <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#c8a97e]/80 z-20 pointer-events-none group-hover:border-[#dfc28d] transition-colors" />

          {/* Actual photograph - pure, crisp, untouched */}
          <img
            src={photo.src}
            alt={photo.title}
            loading={index < 2 ? "eager" : "lazy"}
            className="w-full h-full object-cover object-center block group-hover:scale-[1.02] transition-transform duration-700 ease-out"
            style={{ opacity: 1, filter: "none" }}
          />

          {/* Shutter capture stamp */}
          <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 text-[8.5px] tracking-[0.2em] text-white/90 font-mono uppercase bg-[#070709]/85 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
            <span>35MM RAW</span>
            <span className="w-1 h-1 rounded-full bg-[#c8a97e]" />
            <span>ARCHIVE</span>
          </div>
        </div>

        {/* Editorial Narrative & EXIF Glassmorphic Card */}
        <div
          ref={textRef}
          className={`w-full max-w-[320px] sm:max-w-[350px] md:max-w-[330px] lg:max-w-[370px] glass-panel rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col ${
            isCenter ? "items-center text-center mt-4" : "mt-4 md:mt-0"
          }`}
        >
          {/* Chapter location tag with amber indicator */}
          <div className={`flex items-center gap-2 mb-2 ${isCenter ? "justify-center" : ""}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#c8a97e]" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#c8a97e] font-mono font-medium">
              {photo.location}
            </span>
          </div>

          {/* Photo Title */}
          <h3 className="font-editorial text-2xl sm:text-3xl text-[#f6f3ed] font-light tracking-wide leading-snug mb-2.5">
            {photo.title}
          </h3>

          {/* Poetic caption */}
          {photo.caption && (
            <p className="text-xs sm:text-[13px] text-[#b4b4bc] font-light leading-relaxed mb-4">
              {photo.caption}
            </p>
          )}

          {/* EXIF Data Strip */}
          <div
            ref={exifRef}
            className={`pt-3 border-t border-white/10 flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-[9px] tracking-[0.2em] text-[#8e8e98] uppercase font-mono ${
              isCenter ? "justify-center" : ""
            }`}
          >
            {photo.focalLength && (
              <span className="text-[#c8a97e] font-medium">{photo.focalLength}</span>
            )}
            {photo.aperture && <span>{photo.aperture}</span>}
            {photo.shutter && <span>{photo.shutter}</span>}
            {photo.iso && <span>ISO {photo.iso}</span>}
            {photo.date && <span className="opacity-60">• {photo.date}</span>}
          </div>
        </div>
      </div>
    </section>
  );
}
