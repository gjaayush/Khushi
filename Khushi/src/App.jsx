import { useEffect, useState } from "react";
import useLenis from "./hooks/useLenis";
import { initCameraScrollTriggers } from "./animations/cameraTimeline";

// Camera Narrator
import CameraScene from "./components/camera/CameraScene";

// Narrative Chapters
import IntroSection from "./components/sections/IntroSection";
import PortraitSection from "./components/sections/PortraitSection";
import MomentsSection from "./components/sections/MomentsSection";
import JourneySection from "./components/sections/JourneySection";
import ForestSection from "./components/sections/ForestSection";
import MountainsSection from "./components/sections/MountainsSection";
import LookingBackSection from "./components/sections/LookingBackSection";
import FinalSection from "./components/sections/FinalSection";

// UI & Atmosphere
import Navbar from "./components/ui/Navbar";
import PageLoader from "./components/ui/PageLoader";
import ScrollIndicator from "./components/ui/ScrollIndicator";
import FilmOverlay from "./components/ui/FilmOverlay";
import AudioAtmosphere from "./components/ui/AudioAtmosphere";

function App() {
  const { scrollTo } = useLenis();
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    // Wait for DOM layout to settle, then initialize ScrollTrigger links
    const timeout = setTimeout(() => {
      initCameraScrollTriggers();
    }, 200);

    return () => clearTimeout(timeout);
  }, []);

  const handleNavigate = (targetSelector) => {
    scrollTo(targetSelector);
  };

  const handleToggleAudio = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <div className="relative min-h-screen bg-[#070709] text-[#e8e6e3] overflow-x-hidden selection:bg-[#c8a97e]/30 selection:text-[#f3efe6]">
      {/* 1. Cinematic Preloader */}
      <PageLoader />

      {/* 2. Audio Atmosphere */}
      <AudioAtmosphere isMuted={isMuted} />

      {/* 3. Film Overlays (Grain, Vignette, Letterbox) */}
      <FilmOverlay />

      {/* 4. Minimalist Header */}
      <Navbar
        onNavigate={handleNavigate}
        isMuted={isMuted}
        onToggleAudio={handleToggleAudio}
      />

      {/* 5. Fixed 3D Pentax DSLR Narrator Canvas */}
      <CameraScene />

      {/* 6. Narrative Chapters Flow */}
      <main className="relative z-20 flex flex-col">
        {/* Chapter 01: Through A Lens */}
        <IntroSection />

        {/* Chapter 02: Her */}
        <PortraitSection />

        {/* Chapter 03: Moments */}
        <MomentsSection />

        {/* Chapter 04: The Journey */}
        <JourneySection />

        {/* Chapter 05: Into The Forest */}
        <ForestSection />

        {/* Chapter 06: The Mountains */}
        <MountainsSection />

        {/* Chapter 07: Looking Back */}
        <LookingBackSection />

        {/* Final Chapter: Some Moments Stay */}
        <FinalSection />
      </main>

      {/* 7. Scroll Indicator Ruler */}
      <ScrollIndicator />
    </div>
  );
}

export default App;
