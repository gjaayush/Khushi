export default function FilmOverlay() {
  return (
    <>
      {/* Analog film grain overlay */}
      <div className="film-grain" aria-hidden="true" />

      {/* Cinematic vignette */}
      <div className="vignette-overlay" aria-hidden="true" />

      {/* Subtle top and bottom letterbox accent bars */}
      <div className="fixed top-0 inset-x-0 h-1 md:h-1.5 bg-black/40 z-30 pointer-events-none" />
      <div className="fixed bottom-0 inset-x-0 h-1 md:h-1.5 bg-black/40 z-30 pointer-events-none" />
    </>
  );
}
