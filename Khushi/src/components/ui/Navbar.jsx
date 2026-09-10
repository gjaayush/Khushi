import { useState, useEffect } from "react";
import { CHAPTERS } from "../../data/gallery";

export default function Navbar({ onNavigate, isMuted, onToggleAudio }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeChapter, setActiveChapter] = useState("chapter-01");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      // Track active chapter
      const chapterEls = CHAPTERS.map((c) => document.getElementById(c.id)).filter(Boolean);
      const scrollPos = window.scrollY + window.innerHeight * 0.4;

      for (let i = chapterEls.length - 1; i >= 0; i--) {
        const el = chapterEls[i];
        if (el.offsetTop <= scrollPos) {
          setActiveChapter(CHAPTERS[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
        scrolled
          ? "py-2.5 bg-[#070709]/90 backdrop-blur-md border-b border-white/10 shadow-lg"
          : "py-4 bg-gradient-to-b from-[#070709]/80 to-transparent"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 flex items-center justify-between">
        {/* Brand / Minimalist Logomark */}
        <div
          onClick={() => onNavigate && onNavigate("#chapter-01")}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#c8a97e] group-hover:scale-150 transition-transform" />
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#f3efe6] font-mono font-medium">
            KHUSHI <span className="text-[#c8a97e]/70 hidden sm:inline">// ARCHIVE</span>
          </span>
        </div>

        {/* Compact Chapter Navigation Bar */}
        <nav className="hidden md:flex items-center gap-1 px-2 py-1 bg-white/[0.03] border border-white/10 rounded-full backdrop-blur-md">
          {CHAPTERS.map((ch) => {
            const isActive = activeChapter === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => onNavigate && onNavigate(`#${ch.id}`)}
                className={`px-2.5 py-0.5 text-[9px] uppercase tracking-[0.2em] font-mono rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-[#c8a97e] text-[#070709] font-bold shadow-sm"
                    : "text-[#8e8e98] hover:text-[#f3efe6] hover:bg-white/5"
                }`}
              >
                {ch.number}
              </button>
            );
          })}
        </nav>

        {/* Compact Audio Atmosphere Toggle */}
        <button
          onClick={onToggleAudio}
          className="flex items-center gap-2 px-2.5 py-1 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-full transition-all duration-300 group"
          title={isMuted ? "Unmute Ambient Audio" : "Mute Audio"}
        >
          <div className="flex items-end gap-[2px] h-2.5 w-2.5">
            <span
              className={`w-[1.5px] bg-[#c8a97e] transition-all duration-300 ${
                !isMuted ? "h-2.5 animate-pulse" : "h-1 opacity-40"
              }`}
            />
            <span
              className={`w-[1.5px] bg-[#c8a97e] transition-all duration-500 ${
                !isMuted ? "h-1.5 animate-pulse delay-75" : "h-1 opacity-40"
              }`}
            />
            <span
              className={`w-[1.5px] bg-[#c8a97e] transition-all duration-300 ${
                !isMuted ? "h-2.5 animate-pulse delay-150" : "h-1 opacity-40"
              }`}
            />
          </div>
          <span className="text-[9px] tracking-[0.2em] text-[#a1a1aa] group-hover:text-[#f3efe6] font-mono uppercase">
            {isMuted ? "AUDIO" : "ON"}
          </span>
        </button>
      </div>
    </header>
  );
}
