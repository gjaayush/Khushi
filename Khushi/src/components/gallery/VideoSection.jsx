import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function VideoCard({
  src,
  title,
  subtitle,
  caption,
  location,
  tag,
  index = 1,
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [timeFormatted, setTimeFormatted] = useState("00:00");

  // Auto-play / pause when entering / leaving viewport for buttery performance
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().then(() => setIsPlaying(true)).catch(() => {});
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const current = video.currentTime;
    const dur = video.duration;
    setProgress((current / dur) * 100);

    const mins = Math.floor(current / 60)
      .toString()
      .padStart(2, "0");
    const secs = Math.floor(current % 60)
      .toString()
      .padStart(2, "0");
    setTimeFormatted(`${mins}:${secs}`);
  };

  const handleTogglePlay = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleToggleMute = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center w-full max-w-[340px] sm:max-w-[370px] md:max-w-[360px] lg:max-w-[400px] group"
    >
      {/* Video Viewfinder Frame */}
      <div
        onClick={handleTogglePlay}
        className="relative w-full aspect-[9/16] sm:aspect-[3/4] md:aspect-[9/16] max-h-[520px] overflow-hidden rounded-2xl bg-[#08080c] photo-frame-glow photo-card-interactive border border-white/15 shadow-2xl cursor-pointer select-none"
      >
        {/* Actual Video Element */}
        <video
          ref={videoRef}
          src={src}
          loop
          muted={isMuted}
          playsInline
          preload="none"
          autoPlay
          onTimeUpdate={handleTimeUpdate}
          className="w-full h-full object-cover object-center block group-hover:scale-[1.015] transition-transform duration-700 ease-out"
        />

        {/* Viewfinder Corner Brackets */}
        <div className="absolute top-3.5 left-3.5 w-3.5 h-3.5 border-t-2 border-l-2 border-[#c8a97e]/90 z-20 pointer-events-none" />
        <div className="absolute top-3.5 right-3.5 w-3.5 h-3.5 border-t-2 border-r-2 border-[#c8a97e]/90 z-20 pointer-events-none" />
        <div className="absolute bottom-6 left-3.5 w-3.5 h-3.5 border-b-2 border-l-2 border-[#c8a97e]/90 z-20 pointer-events-none" />
        <div className="absolute bottom-6 right-3.5 w-3.5 h-3.5 border-b-2 border-r-2 border-[#c8a97e]/90 z-20 pointer-events-none" />

        {/* Top HUD: Recording Status & Camera Mode */}
        <div className="absolute top-3.5 inset-x-3.5 z-20 flex items-center justify-between pointer-events-none">
          {/* Blinking REC tag */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/75 backdrop-blur-md border border-white/10 text-[8.5px] font-mono uppercase tracking-[0.2em] text-white/90">
            <span
              className={`w-2 h-2 rounded-full bg-red-500 ${
                isPlaying ? "animate-pulse" : "opacity-40"
              }`}
            />
            <span>{isPlaying ? "REC" : "PAUSED"}</span>
            <span className="text-[#c8a97e] font-semibold">{timeFormatted}</span>
          </div>

          {/* Video format info */}
          <div className="px-2 py-0.5 rounded bg-black/75 backdrop-blur-md border border-white/10 text-[8.5px] font-mono uppercase tracking-[0.18em] text-[#c8a97e]">
            <span>{tag}</span>
          </div>
        </div>

        {/* Play/Pause Central Pulse Cue (visible on hover or when paused) */}
        <div
          className={`absolute inset-0 z-20 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
            !isPlaying ? "opacity-100 bg-black/40" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <div className="w-13 h-13 rounded-full bg-black/75 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white/90 shadow-2xl transition-transform transform group-hover:scale-105">
            {isPlaying ? (
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg className="w-5 h-5 fill-current translate-x-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </div>
        </div>

        {/* Bottom Bar: Sound Toggle & Playback Progress */}
        <div className="absolute bottom-2.5 inset-x-3.5 z-20 flex items-center justify-between">
          <button
            onClick={handleToggleMute}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 hover:bg-black/95 backdrop-blur-md border border-white/15 text-[8.5px] tracking-[0.2em] font-mono text-white transition-colors pointer-events-auto shadow-lg"
            title={isMuted ? "Unmute Video" : "Mute Video"}
          >
            <div className="flex items-end gap-[1.5px] h-2 w-2.5">
              <span
                className={`w-[1px] bg-[#c8a97e] transition-all ${
                  !isMuted ? "h-2 animate-pulse" : "h-0.5 opacity-40"
                }`}
              />
              <span
                className={`w-[1px] bg-[#c8a97e] transition-all ${
                  !isMuted ? "h-1.5 animate-pulse delay-75" : "h-0.5 opacity-40"
                }`}
              />
              <span
                className={`w-[1px] bg-[#c8a97e] transition-all ${
                  !isMuted ? "h-2 animate-pulse delay-150" : "h-0.5 opacity-40"
                }`}
              />
            </div>
            <span>{isMuted ? "MUTED" : "SOUND"}</span>
          </button>

          <span className="text-[8px] font-mono tracking-[0.2em] text-[#8e8e98] uppercase">
            CLICK TO {isPlaying ? "PAUSE" : "PLAY"}
          </span>
        </div>

        {/* Video Scrubber Progress Line */}
        <div className="absolute bottom-0 inset-x-0 h-[2.5px] bg-white/10 overflow-hidden z-20">
          <div
            className="h-full bg-gradient-to-r from-[#a98a58] to-[#dfc28d] transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Narrative Glassmorphic Box */}
      <div className="w-full mt-4 p-5 rounded-2xl glass-panel shadow-2xl flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c8a97e]" />
            <span className="text-[9.5px] uppercase tracking-[0.3em] text-[#c8a97e] font-mono font-medium">
              {location}
            </span>
          </div>
          <span className="text-[9px] font-mono tracking-[0.2em] text-[#71717a] uppercase">
            REEL 0{index}
          </span>
        </div>

        <h3 className="font-editorial text-2xl text-[#f6f3ed] font-light tracking-wide leading-snug mb-2">
          {title}
        </h3>

        {subtitle && (
          <p className="font-editorial text-sm text-[#dfc28d] italic tracking-wide mb-2.5">
            "{subtitle}"
          </p>
        )}

        <p className="text-xs text-[#b4b4bc] font-light leading-relaxed mb-3.5">
          {caption}
        </p>

        <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[9px] font-mono tracking-[0.2em] text-[#8e8e98] uppercase">
          <span>CINEMATIC REEL // H.264</span>
          <span className="text-[#c8a97e]">LIVE MOTION</span>
        </div>
      </div>
    </div>
  );
}

export default function VideoSection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    if (!headerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
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
    <section
      id="chapter-motion"
      ref={sectionRef}
      className="relative w-full py-20 px-4 sm:px-8 z-20 overflow-hidden"
    >
      {/* Chapter Header */}
      <div
        ref={headerRef}
        className="w-full max-w-4xl mx-auto mb-14 md:mb-18 flex flex-col items-center text-center"
      >
        <div className="flex items-center gap-2.5 mb-2.5">
          <span className="w-6 h-px bg-[#c8a97e]/60" />
          <span className="text-[9.5px] uppercase tracking-[0.35em] text-[#c8a97e] font-mono font-medium">
            SPECIAL ARCHIVE // LIVING MOTION
          </span>
          <span className="w-6 h-px bg-[#c8a97e]/60" />
        </div>

        <h2 className="font-cinematic text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-light text-[#f6f3ed] tracking-[0.3em] uppercase mb-2.5">
          MOTION IN TIME
        </h2>

        <p className="font-editorial text-lg sm:text-xl text-[#dfc28d] italic tracking-wide max-w-lg mb-2">
          "Photographs hold the silence. Motion remembers the breath."
        </p>

        <p className="text-[11px] sm:text-xs text-[#a1a1aa] font-light tracking-[0.18em] uppercase max-w-md">
          Moving recordings from the archives — candid smiles, passing winds, and living light.
        </p>
      </div>

      {/* Dual Video Grid: Side-by-Side on Desktop & iPad */}
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 lg:gap-16 justify-items-center">
        {/* Video 1 */}
        <VideoCard
          index={1}
          src="/media/Video1.mp4"
          tag="REEL 01 // 1080P"
          location="Mountain Retreat"
          title="In Passing Light"
          subtitle="A moment that refused to be still."
          caption="Between shutter clicks, movement happens. The spontaneous laughter and wind across the hills that a single still frame could only hint at."
        />

        {/* Video 2 */}
        <VideoCard
          index={2}
          src="/media/Video2.mp4"
          tag="REEL 02 // 1080P"
          location="The Living Hour"
          title="The Breath of the Day"
          subtitle="Where memories learn to move."
          caption="Watching the afternoon unfold in continuous light. The quiet gestures, warmth, and laughter preserved in real-time motion."
        />
      </div>
    </section>
  );
}
