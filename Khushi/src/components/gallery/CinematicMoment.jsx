import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cameraState, getMomentChoreography } from "../../animations/cameraTimeline";
import { playShutterClick } from "../../utils/audioShutter";
import { useLightbox } from "../../context/LightboxContext";

gsap.registerPlugin(ScrollTrigger);

export default function CinematicMoment({
  photo,
  index = 0,
  align = "left", // 'left' | 'right' | 'center'
  cameraRotationDeg = 0,
  isHero = false,
  className = "",
}) {
  const stageRef = useRef(null);
  const cardRef = useRef(null);
  const flashRef = useRef(null);
  const textRef = useRef(null);
  const exifRef = useRef(null);
  const hasClicked = useRef(false);
  const { openLightbox } = useLightbox();

  useEffect(() => {
    if (!stageRef.current) return;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const isTablet = typeof window !== "undefined" && window.innerWidth >= 768 && window.innerWidth < 1024;

    const choreo = getMomentChoreography({
      chapter: photo.chapter,
      index,
      align,
      isMobile,
      isTablet,
    });

    const ctx = gsap.context(() => {
      // Proxy object representing 3D camera state during this pinned moment
      const poseProxy = {
        camX: choreo.startPose.camX,
        camY: choreo.startPose.camY,
        camZ: choreo.startPose.camZ,
        targetX: choreo.startPose.targetX,
        targetY: choreo.startPose.targetY,
        targetZ: choreo.startPose.targetZ,
        modelX: choreo.startPose.modelX,
        modelY: choreo.startPose.modelY,
        modelZ: choreo.startPose.modelZ,
        modelRotX: choreo.startPose.modelRotX,
        modelRotY: choreo.startPose.modelRotY,
        modelRotZ: choreo.startPose.modelRotZ,
        modelScaleMultiplier: choreo.startPose.scale,
      };

      // Sync pose proxy values to active Three.js cameraState on frame
      const syncCamera = () => {
        cameraState.camX = poseProxy.camX;
        cameraState.camY = poseProxy.camY;
        cameraState.camZ = poseProxy.camZ;
        cameraState.targetX = poseProxy.targetX;
        cameraState.targetY = poseProxy.targetY;
        cameraState.targetZ = poseProxy.targetZ;
        cameraState.modelX = poseProxy.modelX;
        cameraState.modelY = poseProxy.modelY;
        cameraState.modelZ = poseProxy.modelZ;
        cameraState.modelRotX = poseProxy.modelRotX;
        cameraState.modelRotY = poseProxy.modelRotY;
        cameraState.modelRotZ = poseProxy.modelRotZ;
        cameraState.modelScaleMultiplier = poseProxy.modelScaleMultiplier;
      };

      // Long, cinematic scrubbed pinned sequence:
      // T = 0.00 - 0.20: [STAGE 1] Slow spatial travel through 3D space
      // T = 0.20 - 0.42: [STAGE 2] Lens gradually tilts downward ("Something is about to appear below")
      // T = 0.42 - 0.60: [STAGE 3 & 4] Photo approaches; camera glides to the side (REMAINS LARGE)
      // T = 0.60 - 0.76: [STAGE 5] Camera turns front lens to aim directly at the photograph
      // T = 0.76 - 0.82: [STAGE 6] Settle pause (holds steady, observing memory)
      // T = 0.82 - 0.85: [STAGE 7] Subtle capture moment (soft optical bloom + shutter click)
      // T = 0.85 - 0.94: [STAGE 8] Photo revealed at 100% clarity; CAMERA REMAINS LARGE BESIDE PHOTO
      // T = 0.94 - 1.00: [STAGE 9 & 10] Photo drifts; camera continues journey to next memory (NO RESET)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stageRef.current,
          start: "top top",
          end: "+=260%",
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Precise shutter trigger with hysteresis
            if (self.progress >= 0.81 && self.progress <= 0.86) {
              if (!hasClicked.current) {
                playShutterClick(0.25);
                hasClicked.current = true;
              }
            } else if (self.progress < 0.75 || self.progress > 0.9) {
              hasClicked.current = false;
            }
          },
        },
        onUpdate: syncCamera,
      });

      // Initial element states
      gsap.set(cardRef.current, { opacity: 0, scale: 0.88, y: 50 });
      gsap.set([textRef.current, exifRef.current], { opacity: 0, y: 25 });
      gsap.set(flashRef.current, { opacity: 0, scale: 0.9 });

      // STAGE 1: 0.00 -> 0.20 (Slow Spatial Travel)
      tl.to(
        poseProxy,
        {
          camX: choreo.travelPose.camX,
          camY: choreo.travelPose.camY,
          camZ: choreo.travelPose.camZ,
          modelX: choreo.travelPose.modelX,
          modelY: choreo.travelPose.modelY,
          modelZ: choreo.travelPose.modelZ,
          modelRotX: choreo.travelPose.modelRotX,
          modelRotY: choreo.travelPose.modelRotY,
          modelRotZ: choreo.travelPose.modelRotZ,
          modelScaleMultiplier: choreo.travelPose.scale,
          duration: 0.2,
          ease: "sine.inOut",
        },
        0.0
      );

      // STAGE 2: 0.20 -> 0.42 (Lens Gradually Points Downward)
      tl.to(
        poseProxy,
        {
          camX: choreo.downwardPose.camX,
          camY: choreo.downwardPose.camY,
          camZ: choreo.downwardPose.camZ,
          targetY: choreo.downwardPose.targetY,
          modelX: choreo.downwardPose.modelX,
          modelY: choreo.downwardPose.modelY,
          modelZ: choreo.downwardPose.modelZ,
          modelRotX: choreo.downwardPose.modelRotX, // ↘ Lens tilts down
          modelRotY: choreo.downwardPose.modelRotY,
          modelRotZ: choreo.downwardPose.modelRotZ,
          modelScaleMultiplier: choreo.downwardPose.scale,
          duration: 0.22,
          ease: "power2.inOut",
        },
        0.2
      );

      // STAGE 3 & 4: 0.42 -> 0.60 (Photo Approaches & Camera Moves to the Side)
      // Photo card begins entering from below
      tl.to(
        cardRef.current,
        {
          opacity: 0.4,
          y: 20,
          scale: 0.94,
          duration: 0.18,
          ease: "sine.out",
        },
        0.42
      );

      // Camera glides to the side (REMAINS LARGE)
      tl.to(
        poseProxy,
        {
          camX: choreo.sideApproachPose.camX,
          camY: choreo.sideApproachPose.camY,
          camZ: choreo.sideApproachPose.camZ,
          targetX: choreo.sideApproachPose.targetX,
          targetY: choreo.sideApproachPose.targetY,
          modelX: choreo.sideApproachPose.modelX,
          modelY: choreo.sideApproachPose.modelY,
          modelZ: choreo.sideApproachPose.modelZ,
          modelRotX: choreo.sideApproachPose.modelRotX,
          modelRotY: choreo.sideApproachPose.modelRotY,
          modelRotZ: choreo.sideApproachPose.modelRotZ,
          modelScaleMultiplier: choreo.sideApproachPose.scale,
          duration: 0.18,
          ease: "power2.inOut",
        },
        0.42
      );

      // STAGE 5: 0.60 -> 0.76 (Lens Aims Directly at the Photograph)
      tl.to(
        poseProxy,
        {
          camX: choreo.aimedPose.camX,
          camY: choreo.aimedPose.camY,
          camZ: choreo.aimedPose.camZ,
          targetX: choreo.aimedPose.targetX,
          targetY: choreo.aimedPose.targetY,
          modelX: choreo.aimedPose.modelX,
          modelY: choreo.aimedPose.modelY,
          modelZ: choreo.aimedPose.modelZ,
          modelRotX: choreo.aimedPose.modelRotX, // ◉ Aimed pitch
          modelRotY: choreo.aimedPose.modelRotY, // ◉ Lens aimed directly at photo
          modelRotZ: choreo.aimedPose.modelRotZ,
          modelScaleMultiplier: choreo.aimedPose.scale,
          duration: 0.16,
          ease: "power2.out",
        },
        0.6
      );

      // STAGE 6: 0.76 -> 0.82 (Settle Pause - Camera Holds Steady Observing Memory)
      tl.to(
        poseProxy,
        {
          modelZ: choreo.settlePose.modelZ,
          duration: 0.06,
          ease: "none",
        },
        0.76
      );

      // STAGE 7: 0.82 -> 0.85 (Subtle Shutter Capture Moment)
      // Soft optical bloom flash (pure atmospheric glow, not a blinding whiteout)
      tl.fromTo(
        flashRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 0.7, scale: 1.35, duration: 0.02, ease: "power2.out" },
        0.82
      ).to(
        flashRef.current,
        { opacity: 0, scale: 1.55, duration: 0.03, ease: "power2.in" },
        0.84
      );

      // Subtle mechanical shutter recoil impulse
      tl.to(
        poseProxy,
        {
          modelZ: choreo.captureKickPose.modelZ,
          modelScaleMultiplier: choreo.captureKickPose.scale,
          duration: 0.02,
          ease: "power2.out",
        },
        0.82
      );

      // Photograph emerges crystal-clear out of the capture point
      tl.to(
        cardRef.current,
        {
          opacity: 1,
          scale: 1.0,
          y: 0,
          duration: 0.06,
          ease: "power2.out",
        },
        0.83
      );

      // Narrative text & EXIF metadata slide in
      tl.to(
        [textRef.current, exifRef.current],
        {
          opacity: 1,
          y: 0,
          stagger: 0.02,
          duration: 0.06,
          ease: "power2.out",
        },
        0.84
      );

      // STAGE 8: 0.85 -> 0.94 (PHOTO IS DISPLAYED & CAMERA REMAINS LARGE BESIDE IT)
      // The camera stays beside the photo in full 3D detail while the visitor reads
      tl.to(
        poseProxy,
        {
          camX: choreo.holdPose.camX,
          camY: choreo.holdPose.camY,
          camZ: choreo.holdPose.camZ,
          targetX: choreo.holdPose.targetX,
          targetY: choreo.holdPose.targetY,
          modelX: choreo.holdPose.modelX,
          modelY: choreo.holdPose.modelY,
          modelZ: choreo.holdPose.modelZ,
          modelRotX: choreo.holdPose.modelRotX,
          modelRotY: choreo.holdPose.modelRotY,
          modelScaleMultiplier: choreo.holdPose.scale,
          duration: 0.09,
          ease: "none",
        },
        0.85
      );

      // STAGE 9 & 10: 0.94 -> 1.00 (Photo Dissolves & Camera Continues Journey to Next Memory)
      tl.to(
        cardRef.current,
        {
          opacity: 0,
          y: 28,
          scale: 0.96,
          duration: 0.06,
          ease: "power2.in",
        },
        0.94
      );

      tl.to(
        [textRef.current, exifRef.current],
        {
          opacity: 0,
          y: 18,
          duration: 0.05,
          ease: "power2.in",
        },
        0.95
      );

      // Camera smoothly departs from its current side pose toward next memory (NO RESET)
      tl.to(
        poseProxy,
        {
          camX: choreo.exitPose.camX,
          camY: choreo.exitPose.camY,
          camZ: choreo.exitPose.camZ,
          modelX: choreo.exitPose.modelX,
          modelY: choreo.exitPose.modelY,
          modelZ: choreo.exitPose.modelZ,
          modelRotX: choreo.exitPose.modelRotX,
          modelRotY: choreo.exitPose.modelRotY,
          modelScaleMultiplier: choreo.exitPose.scale,
          duration: 0.06,
          ease: "sine.inOut",
        },
        0.94
      );
    }, stageRef);

    return () => ctx.revert();
  }, [photo.chapter, index, align]);

  const isLeft = align === "left";
  const isRight = align === "right";
  const isCenter = align === "center";

  // Luxury aspect sizing
  const aspectClass =
    photo.aspect === "9:16"
      ? "aspect-[9/16] w-full max-w-[270px] sm:max-w-[300px] md:max-w-[315px] lg:max-w-[345px]"
      : "aspect-[3/4] w-full max-w-[290px] sm:max-w-[330px] md:max-w-[345px] lg:max-w-[380px]";

  return (
    <section
      ref={stageRef}
      className={`relative w-full h-screen flex items-center justify-center px-4 sm:px-6 md:px-10 overflow-hidden select-none ${className}`}
    >
      {/* Subtle Optical Shutter Bloom (strictly behind the photograph) */}
      <div
        ref={flashRef}
        className="absolute pointer-events-none w-80 h-80 rounded-full bg-radial from-[#ffffff]/90 via-[#c8a97e]/30 to-transparent blur-3xl opacity-0 z-10"
        aria-hidden="true"
      />

      {/* Responsive Content Layout */}
      <div
        className={`relative z-20 w-full max-w-6xl flex flex-col ${
          isCenter
            ? "items-center text-center gap-6"
            : isLeft
            ? "md:flex-row items-center md:items-center justify-start gap-6 md:gap-8 lg:gap-12 md:pl-6 lg:pl-10"
            : "md:flex-row-reverse items-center md:items-center justify-start gap-6 md:gap-8 lg:gap-12 md:pr-6 lg:pr-10"
        }`}
      >
        {/* The Photograph: 100% crystal-clear, zero overlays, luxury framing, CLICKABLE FOR LIGHTBOX */}
        <div
          ref={cardRef}
          onClick={() => openLightbox(photo)}
          className={`relative ${aspectClass} cursor-pointer overflow-hidden rounded-xl bg-[#0a0a0f] photo-frame-glow photo-card-interactive border border-white/15 will-change-transform shadow-2xl group transition-all duration-300 hover:border-[#c8a97e]/60`}
          title="Click to view full image"
        >
          {/* Subtle Viewfinder corner brackets */}
          <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#c8a97e]/80 z-20 pointer-events-none group-hover:border-[#dfc28d] transition-colors" />
          <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#c8a97e]/80 z-20 pointer-events-none group-hover:border-[#dfc28d] transition-colors" />
          <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#c8a97e]/80 z-20 pointer-events-none group-hover:border-[#dfc28d] transition-colors" />
          <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#c8a97e]/80 z-20 pointer-events-none group-hover:border-[#dfc28d] transition-colors" />

          {/* Actual photograph - pure, crisp, untouched */}
          <img
            src={photo.src}
            alt={photo.title}
            loading={index < 2 ? "eager" : "lazy"}
            className="w-full h-full object-cover object-center block group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            style={{ opacity: 1, filter: "none" }}
          />
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
