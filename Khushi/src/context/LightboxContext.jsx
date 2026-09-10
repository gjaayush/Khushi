import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { GALLERY_PHOTOS } from "../data/gallery";

const LightboxContext = createContext(null);

export function LightboxProvider({ children }) {
  const [activePhoto, setActivePhoto] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const openLightbox = useCallback((photo) => {
    if (!photo) return;
    const idx = GALLERY_PHOTOS.findIndex((p) => p.src === photo.src || p.id === photo.id);
    setActivePhoto(photo);
    setCurrentIndex(idx !== -1 ? idx : 0);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setActivePhoto(null);
    setCurrentIndex(-1);
    document.body.style.overflow = "";
  }, []);

  const nextPhoto = useCallback(() => {
    if (currentIndex >= 0 && currentIndex < GALLERY_PHOTOS.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setActivePhoto(GALLERY_PHOTOS[nextIdx]);
    } else if (currentIndex === GALLERY_PHOTOS.length - 1) {
      setCurrentIndex(0);
      setActivePhoto(GALLERY_PHOTOS[0]);
    }
  }, [currentIndex]);

  const prevPhoto = useCallback(() => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      setActivePhoto(GALLERY_PHOTOS[prevIdx]);
    } else if (currentIndex === 0) {
      const lastIdx = GALLERY_PHOTOS.length - 1;
      setCurrentIndex(lastIdx);
      setActivePhoto(GALLERY_PHOTOS[lastIdx]);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!activePhoto) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "ArrowLeft") prevPhoto();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhoto, closeLightbox, nextPhoto, prevPhoto]);

  return (
    <LightboxContext.Provider
      value={{
        activePhoto,
        currentIndex,
        openLightbox,
        closeLightbox,
        nextPhoto,
        prevPhoto,
      }}
    >
      {children}
    </LightboxContext.Provider>
  );
}

export function useLightbox() {
  const context = useContext(LightboxContext);
  if (!context) {
    throw new Error("useLightbox must be used within a LightboxProvider");
  }
  return context;
}
