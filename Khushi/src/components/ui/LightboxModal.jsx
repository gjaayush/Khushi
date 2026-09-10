import { useLightbox } from "../../context/LightboxContext";
import { GALLERY_PHOTOS } from "../../data/gallery";

export default function LightboxModal() {
  const { activePhoto, currentIndex, closeLightbox, nextPhoto, prevPhoto } = useLightbox();

  if (!activePhoto) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo Lightbox"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl transition-all duration-300"
      onClick={closeLightbox}
    >
      {/* Top Header Controls */}
      <div
        className="absolute top-0 inset-x-0 p-6 flex items-center justify-between text-white/70 z-10 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="inline-block w-2 h-2 rounded-full bg-[#c8a97e]" />
          <span className="font-mono text-xs tracking-widest text-[#c8a97e] uppercase">
            {activePhoto.chapter ? activePhoto.chapter.replace("-", " ") : "Archive"}
          </span>
          <span className="font-mono text-xs text-white/40">
            {currentIndex + 1} / {GALLERY_PHOTOS.length}
          </span>
        </div>

        <button
          onClick={closeLightbox}
          className="px-4 py-2 text-xs font-mono tracking-widest uppercase text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all cursor-pointer"
        >
          ✕ Close
        </button>
      </div>

      {/* Main Image Container */}
      <div
        className="relative max-w-6xl max-h-[85vh] p-4 flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={activePhoto.src}
          alt={activePhoto.alt || activePhoto.title || "Archive photograph"}
          className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl border border-white/10 select-none"
        />

        {/* Caption & EXIF */}
        {(activePhoto.title || activePhoto.description || activePhoto.exif) && (
          <div className="mt-4 text-center max-w-xl">
            {activePhoto.title && (
              <h3 className="font-serif text-lg text-[#f3efe6] tracking-wide">
                {activePhoto.title}
              </h3>
            )}
            {activePhoto.description && (
              <p className="mt-1 text-xs text-white/60 font-sans leading-relaxed">
                {activePhoto.description}
              </p>
            )}
            {activePhoto.exif && (
              <div className="mt-2 flex items-center justify-center gap-4 text-[11px] font-mono text-[#c8a97e]/80">
                {activePhoto.exif.lens && <span>{activePhoto.exif.lens}</span>}
                {activePhoto.exif.aperture && <span>{activePhoto.exif.aperture}</span>}
                {activePhoto.exif.shutter && <span>{activePhoto.exif.shutter}</span>}
                {activePhoto.exif.iso && <span>{activePhoto.exif.iso}</span>}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Previous Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          prevPhoto();
        }}
        className="absolute left-6 top-1/2 -translate-y-1/2 p-3 text-white/60 hover:text-white bg-white/5 hover:bg-white/15 rounded-full border border-white/10 backdrop-blur-md transition-all pointer-events-auto cursor-pointer"
        aria-label="Previous photograph"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Next Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          nextPhoto();
        }}
        className="absolute right-6 top-1/2 -translate-y-1/2 p-3 text-white/60 hover:text-white bg-white/5 hover:bg-white/15 rounded-full border border-white/10 backdrop-blur-md transition-all pointer-events-auto cursor-pointer"
        aria-label="Next photograph"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
