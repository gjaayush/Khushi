import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Reactive state object read every frame by R3F Canvas
export const cameraState = {
  // Camera world coordinates
  camX: 0,
  camY: 0,
  camZ: 3.2, // Optimal distance for large hero presentation

  // Target look-at
  targetX: 0,
  targetY: 0,
  targetZ: 0,

  // Model offset & continuous 360° rotation
  modelX: 0,
  modelY: 0,
  modelZ: 0,
  modelRotX: 0,
  modelRotY: 0,
  modelRotZ: 0,
  modelScaleMultiplier: 1.0,

  // Atmospheric lighting & canvas opacity
  lightingIntensity: 1.1,
  canvasOpacity: 1.0,
};

/**
 * Updates camera position, spatial travel, and rotation dynamically as each moment is scrubbed.
 * Implements: Camera moves into position -> Shutter click -> Photo emerges -> Photo drifts -> Camera rotates 90-120°
 */
export function updateCameraForMoment(index, progress, targetRotDeg, align) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const isTablet = typeof window !== "undefined" && window.innerWidth >= 768 && window.innerWidth < 1024;

  const targetRad = (targetRotDeg * Math.PI) / 180;
  const rotationStep = (110 * Math.PI) / 180; // Smooth 110° rotation between moments
  const nextRad = targetRad + rotationStep;

  // 1. Dynamic 360° Rotation Progression
  if (progress < 0.65) {
    // Camera is in position during photograph reveal & hold
    cameraState.modelRotY = targetRad;
    cameraState.modelRotX = 0.06 * Math.sin(index * 1.5);
  } else {
    // As photo drifts away, camera rotates 90-120° into next angle
    const exitProgress = (progress - 0.65) / 0.35;
    cameraState.modelRotY = gsap.utils.interpolate(targetRad, nextRad, exitProgress);
    cameraState.modelRotX = gsap.utils.interpolate(0.06 * Math.sin(index * 1.5), 0.14, exitProgress);
  }

  // 2. Spatial Camera Travel (X, Y, Z coordinates change per moment)
  if (isMobile) {
    // On mobile, frame camera in upper viewport so photo emerges cleanly underneath
    cameraState.modelX = 0;
    cameraState.modelY = 0.72;
    cameraState.modelZ = -0.2;
    cameraState.camZ = 3.6;
    cameraState.modelScaleMultiplier = 0.85;
  } else if (isTablet) {
    // On iPad / Tablet, balanced lateral movement avoiding edge clipping
    const lateralOffset = align === "left" ? 0.95 : align === "right" ? -0.95 : 0;
    cameraState.modelX = lateralOffset;
    cameraState.modelY = align === "center" ? 0.38 : 0;
    cameraState.modelZ = align === "center" ? -0.35 : 0.08 * Math.cos(index);
    cameraState.camZ = 3.3;
    cameraState.modelScaleMultiplier = 0.92;
  } else {
    // On Desktop / Laptop, balanced cinematic staging:
    const lateralOffset = align === "left" ? 1.25 : align === "right" ? -1.25 : 0;
    cameraState.modelX = lateralOffset;
    cameraState.modelY = align === "center" ? 0.35 : 0.04 * Math.sin(index);
    cameraState.modelZ = align === "center" ? -0.5 : 0.15 * Math.sin(index);
    cameraState.camZ = 3.1;
    cameraState.modelScaleMultiplier = 0.98;
  }
}

/**
 * Master ScrollTrigger choreographies for Opening Hero and Epilogue
 */
export function initCameraScrollTriggers() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // CHAPTER 01: HERO SECTION
  // Starts with commanding DSLR facing front center with mouse-hover & drag interaction.
  // As user scrolls down, camera smoothly transitions towards the first moment.
  ScrollTrigger.create({
    trigger: "#chapter-01",
    start: "top top",
    end: "bottom top",
    scrub: 1.2,
    onUpdate: (self) => {
      const p = self.progress;
      // As scroll begins, camera starts moving right and turning to 3/4 angle
      const targetX = isMobile ? 0 : 1.1;
      cameraState.modelX = gsap.utils.interpolate(0, targetX, p);
      cameraState.modelRotY = gsap.utils.interpolate(0, 0.7, p); // Front -> 3/4 view
      cameraState.modelRotX = gsap.utils.interpolate(0, 0.06, p);
      cameraState.camZ = gsap.utils.interpolate(2.8, 3.1, p);
    },
  });

  // FINAL CHAPTER: EPILOGUE
  // DSLR completes full 360° cycle, returns to center hero pose, fading gently to black.
  ScrollTrigger.create({
    trigger: "#final-chapter",
    start: "top bottom",
    end: "bottom bottom",
    scrub: 1.2,
    onUpdate: (self) => {
      const p = self.progress;
      cameraState.camZ = gsap.utils.interpolate(3.2, 2.9, p);
      cameraState.modelX = gsap.utils.interpolate(cameraState.modelX, 0, p);
      cameraState.modelY = gsap.utils.interpolate(cameraState.modelY, 0, p);
      cameraState.modelRotY = gsap.utils.interpolate(cameraState.modelRotY, Math.PI * 8, p); // Settles at true front hero
      cameraState.modelRotX = gsap.utils.interpolate(cameraState.modelRotX, 0, p);
      cameraState.lightingIntensity = gsap.utils.interpolate(1.2, 0.3, p);
    },
  });
}
