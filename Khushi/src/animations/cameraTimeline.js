import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * MASTER CAMERA ARCHITECTURE
 * Continuous 3D spatial journey across the narrative archive.
 * Calibrated for physical 35mm DSLR:
 * - modelX, modelY, modelZ: spatial translation of DSLR body
 * - modelRotX: pitch (vertical tilt)
 * - modelRotY: yaw (continuous cumulative rotation)
 * - modelRotZ: roll (dynamic banking)
 * - camX, camY, camZ: Three.js camera position
 * - targetX, targetY, targetZ: camera look-at focus point
 * - modelScaleMultiplier: relative scale factor
 */
export const CAMERA_POSES = {
  // Chapter 01: Through A Lens (Prologue / Hero)
  // Large commanding front product view, lens facing viewer directly
  introHero: {
    camX: 0.0,
    camY: 0.0,
    camZ: 2.3,
    targetX: 0.0,
    targetY: 0.0,
    targetZ: 0.0,
    modelX: 0.0,
    modelY: 0.0,
    modelZ: 0.0,
    modelRotX: 0.02,
    modelRotY: 0.0,
    modelRotZ: 0.0,
    scale: 1.15,
  },
  introExit: {
    camX: 0.45,
    camY: 0.2,
    camZ: 2.4,
    targetX: 0.15,
    targetY: -0.05,
    targetZ: 0.0,
    modelX: 0.55,
    modelY: -0.08,
    modelZ: 0.05,
    modelRotX: 0.18, // Lens starts tilting downward toward upcoming Chapter 02
    modelRotY: 0.55,
    modelRotZ: -0.02,
    scale: 1.12,
  },

  // Special Chapter: Motion In Time (Video Archive)
  // Elevated perspective over dual 1080p video viewfinders
  motionReels: {
    camX: 0.0,
    camY: 0.42,
    camZ: 2.55,
    targetX: 0.0,
    targetY: 0.12,
    targetZ: -0.1,
    modelX: 0.0,
    modelY: 0.32,
    modelZ: -0.15,
    modelRotX: 0.22,
    modelRotY: 8.65,
    modelRotZ: 0.0,
    scale: 1.05,
  },
  motionExit: {
    camX: -0.5,
    camY: -0.08,
    camZ: 2.45,
    targetX: -0.2,
    targetY: -0.05,
    targetZ: -0.05,
    modelX: -0.45,
    modelY: -0.06,
    modelZ: -0.08,
    modelRotX: 0.1,
    modelRotY: 9.15,
    modelRotZ: -0.02,
    scale: 1.08,
  },

  // Final Chapter / Epilogue: Return
  // Completes 720° (4*PI) journey, settles in exact center hero pose facing user
  epilogueReturn: {
    camX: 0.0,
    camY: 0.0,
    camZ: 2.3,
    targetX: 0.0,
    targetY: 0.0,
    targetZ: 0.0,
    modelX: 0.0,
    modelY: 0.0,
    modelZ: 0.0,
    modelRotX: 0.02,
    modelRotY: Math.PI * 4, // 720° (2 full 360° revolutions, settling perfectly facing forward)
    modelRotZ: 0.0,
    scale: 1.2,
  },
};

// Reactive state object read on every frame by Three.js Canvas / CameraScene / CameraModel
export const cameraState = {
  camX: 0,
  camY: 0,
  camZ: 2.3,

  targetX: 0,
  targetY: 0,
  targetZ: 0,

  modelX: 0,
  modelY: 0,
  modelZ: 0,
  modelRotX: 0.02,
  modelRotY: 0,
  modelRotZ: 0,
  modelScaleMultiplier: 1.15,

  lightingIntensity: 1.15,
  canvasOpacity: 1.0,
};

/**
 * Calculates continuous spatial choreography for any photograph:
 * - Stage 1: Camera slowly travels through 3D space from previous memory pose.
 * - Stage 2: Lens gradually tilts downward toward upcoming content below.
 * - Stage 3: Photo approaches, camera glides to the side (REMAINS LARGE).
 * - Stage 4: Lens calculates direction vector and aims directly at the photograph!
 * - Stage 5: Camera settles into position. Settle pause.
 * - Stage 6: Subtle capture moment (optical bloom + shutter click).
 * - Stage 7: Photo is revealed. Camera REMAINS BESIDE PHOTO (occupying 40-50% height).
 * - Stage 8: User continues scrolling: Camera continues from current pose toward next memory.
 */
export function getMomentChoreography({
  chapter,
  index = 0,
  align = "left",
  isMobile = false,
  isTablet = false,
}) {
  // Accumulate continuous baseline yaw rotation to avoid 360° spin snaps
  let baseYaw = 0;
  if (chapter === "chapter-02") {
    // HER: Intimate portraits, gentle cumulative progression
    baseYaw = 0.35 + index * 0.45;
  } else if (chapter === "chapter-03") {
    // MOMENTS: Street sweeps, progressive tracking from 2.5 -> 6.0 rad
    baseYaw = 2.4 + index * 0.45;
  } else if (chapter === "chapter-04") {
    // THE JOURNEY: High mountain passes from 6.28 -> 8.2 rad
    baseYaw = Math.PI * 2 + index * 0.45;
  } else if (chapter === "chapter-05") {
    // INTO THE FOREST: Deep serene organic glide
    baseYaw = 7.6 + index * 0.4;
  } else if (chapter === "chapter-06") {
    // THE MOUNTAINS: Sweeping landscape angles
    baseYaw = 9.2 + index * 0.5;
  } else if (chapter === "chapter-07") {
    // LOOKING BACK: Nostalgic sunset reflections
    baseYaw = 10.8 + index * 0.4;
  } else {
    baseYaw = index * 0.5;
  }

  const isPhotoLeft = align === "left";
  const isPhotoRight = align === "right";
  const isPhotoCenter = align === "center";

  // Desktop side coordinates:
  // If photo is on LEFT, camera moves to RIGHT (+X).
  // If photo is on RIGHT, camera moves to LEFT (-X).
  const latFactor = isMobile ? 0.0 : isTablet ? 0.65 : 1.0;
  const companionX = isPhotoCenter
    ? 0.0
    : (isPhotoLeft ? 0.88 : -0.88) * latFactor;

  // Vertical placement: On mobile, camera sits gracefully above the photo card
  const companionY = isMobile ? 0.38 : isPhotoCenter ? 0.45 : 0.0;

  // LENS AIMING MATHEMATICS:
  // Front lens faces +Z when modelRotY = 0.
  // To aim at photo on the LEFT (from +X toward -X):
  // Lens must rotate counter-clockwise (positive Y rotation) by ~44° (+0.76 rad).
  // To aim at photo on the RIGHT (from -X toward +X):
  // Lens must rotate clockwise (negative Y rotation) by ~44° (-0.76 rad).
  // If photo is below (on mobile or center):
  // Camera pitch (modelRotX) tilts downward (+0.32 to +0.40 rad) directly at the photo!
  const aimYawOffset = isMobile
    ? 0.0
    : isPhotoCenter
    ? 0.0
    : isPhotoLeft
    ? 0.76 // Aim left at photo
    : -0.76; // Aim right at photo

  const aimPitch = isMobile ? 0.32 : isPhotoCenter ? 0.38 : 0.08;

  // Base capture yaw angle (rounded to preserve front orientation orientation)
  const captureBaseYaw = Math.round(baseYaw / (Math.PI * 2)) * (Math.PI * 2);
  const targetAimedYaw = captureBaseYaw + aimYawOffset;

  // 1. START / TRAVEL POSE: Camera enters slowly through 3D space
  // Inherits previous position, begins moving
  const prevSideX = isPhotoLeft ? -0.45 : 0.45;
  const startPose = {
    camX: prevSideX * latFactor * 0.5,
    camY: isMobile ? 0.15 : 0.0,
    camZ: 2.45 + (isMobile ? 0.35 : 0),
    targetX: 0.0,
    targetY: 0.0,
    targetZ: 0.0,
    modelX: prevSideX * latFactor,
    modelY: companionY * 0.5,
    modelZ: -0.1,
    modelRotX: 0.04,
    modelRotY: captureBaseYaw + (isPhotoLeft ? -0.35 : 0.35),
    modelRotZ: isPhotoLeft ? 0.02 : -0.02,
    scale: 1.12 * (isMobile ? 0.88 : 1.0),
  };

  // 2. STAGE 1: SLOW SPATIAL TRAVEL (Camera moves through 3D space)
  const travelPose = {
    camX: 0.0,
    camY: isMobile ? 0.15 : 0.0,
    camZ: 2.38 + (isMobile ? 0.35 : 0),
    targetX: 0.0,
    targetY: 0.0,
    targetZ: 0.0,
    modelX: (companionX * 0.4),
    modelY: companionY * 0.7,
    modelZ: 0.0,
    modelRotX: 0.08,
    modelRotY: captureBaseYaw + (isPhotoLeft ? 0.15 : -0.15),
    modelRotZ: 0.0,
    scale: 1.15 * (isMobile ? 0.9 : 1.0),
  };

  // 3. STAGE 2: LENS GRADUALLY POINTS DOWNWARD ("Something is about to appear below")
  const downwardPose = {
    camX: (companionX * 0.3),
    camY: isMobile ? 0.18 : 0.05,
    camZ: 2.35 + (isMobile ? 0.35 : 0),
    targetX: 0.0,
    targetY: -0.1,
    targetZ: 0.0,
    modelX: (companionX * 0.7),
    modelY: companionY * 0.9,
    modelZ: 0.05,
    modelRotX: 0.26, // ↘ LENS VISIBLY POINTS DOWNWARD
    modelRotY: captureBaseYaw + (isPhotoLeft ? 0.35 : -0.35),
    modelRotZ: isPhotoLeft ? -0.02 : 0.02,
    scale: 1.16 * (isMobile ? 0.92 : 1.0),
  };

  // 4. STAGE 3 & 4: CAMERA MOVES TO THE SIDE (Remains Large)
  const sideApproachPose = {
    camX: companionX * 0.35,
    camY: isMobile ? 0.15 : 0.0,
    camZ: 2.3 + (isMobile ? 0.35 : 0),
    targetX: companionX * 0.2,
    targetY: isMobile ? 0.1 : 0.0,
    targetZ: 0.0,
    modelX: companionX,
    modelY: companionY,
    modelZ: 0.08,
    modelRotX: aimPitch * 0.6,
    modelRotY: targetAimedYaw * 0.7,
    modelRotZ: 0.0,
    scale: 1.18 * (isMobile ? 0.92 : 1.0),
  };

  // 5. STAGE 5: LENS AIMS DIRECTLY AT THE PHOTO
  const aimedPose = {
    camX: companionX * 0.35,
    camY: isMobile ? 0.15 : 0.0,
    camZ: 2.25 + (isMobile ? 0.35 : 0),
    targetX: companionX * 0.3,
    targetY: isMobile ? 0.1 : 0.0,
    targetZ: 0.0,
    modelX: companionX,
    modelY: companionY,
    modelZ: 0.1,
    modelRotX: aimPitch, // ◉ AIMED AT PHOTO PITCH
    modelRotY: targetAimedYaw, // ◉ LENS DIRECTLY AIMED AT PHOTOGRAPH
    modelRotZ: isPhotoLeft ? 0.02 : -0.02,
    scale: 1.2 * (isMobile ? 0.95 : 1.0),
  };

  // 6. STAGE 6: SETTLE PAUSE (Camera holds still in sharp focus aimed at photo)
  const settlePose = {
    camX: companionX * 0.35,
    camY: isMobile ? 0.15 : 0.0,
    camZ: 2.25 + (isMobile ? 0.35 : 0),
    targetX: companionX * 0.3,
    targetY: isMobile ? 0.1 : 0.0,
    targetZ: 0.0,
    modelX: companionX,
    modelY: companionY,
    modelZ: 0.1,
    modelRotX: aimPitch,
    modelRotY: targetAimedYaw,
    modelRotZ: isPhotoLeft ? 0.02 : -0.02,
    scale: 1.2 * (isMobile ? 0.95 : 1.0),
  };

  // 7. STAGE 7: SUBTLE SHUTTER RECOIL (Micro physical impulse)
  const captureKickPose = {
    camX: companionX * 0.35,
    camY: isMobile ? 0.15 : 0.0,
    camZ: 2.27 + (isMobile ? 0.35 : 0),
    targetX: companionX * 0.3,
    targetY: isMobile ? 0.1 : 0.0,
    targetZ: 0.0,
    modelX: companionX,
    modelY: companionY,
    modelZ: 0.06, // Tiny shutter recoil
    modelRotX: aimPitch + 0.015,
    modelRotY: targetAimedYaw,
    modelRotZ: 0.0,
    scale: 1.18 * (isMobile ? 0.94 : 1.0),
  };

  // 8. STAGE 8: CAMERA REMAINS BESIDE PHOTO (Holds in full 3D beauty)
  const holdPose = {
    camX: companionX * 0.35,
    camY: isMobile ? 0.15 : 0.0,
    camZ: 2.25 + (isMobile ? 0.35 : 0),
    targetX: companionX * 0.3,
    targetY: isMobile ? 0.1 : 0.0,
    targetZ: 0.0,
    modelX: companionX,
    modelY: companionY,
    modelZ: 0.1,
    modelRotX: aimPitch,
    modelRotY: targetAimedYaw, // Lens remains aimed at photo
    modelRotZ: isPhotoLeft ? 0.02 : -0.02,
    scale: 1.2 * (isMobile ? 0.95 : 1.0),
  };

  // 9. STAGE 9 & 10: CAMERA TRAVELS ONWARD TO NEXT MEMORY (NO RESET!)
  // Smoothly departs from current side pose toward the next approach angle
  const exitPose = {
    camX: companionX * 0.45,
    camY: isMobile ? 0.15 : -0.05,
    camZ: 2.38 + (isMobile ? 0.35 : 0),
    targetX: 0.0,
    targetY: 0.0,
    targetZ: 0.0,
    modelX: companionX * 1.15,
    modelY: companionY * 0.6 - 0.06,
    modelZ: -0.08,
    modelRotX: 0.12,
    modelRotY: targetAimedYaw + (isPhotoLeft ? 0.45 : -0.45),
    modelRotZ: isPhotoLeft ? 0.03 : -0.03,
    scale: 1.12 * (isMobile ? 0.88 : 1.0),
  };

  return {
    startPose,
    travelPose,
    downwardPose,
    sideApproachPose,
    aimedPose,
    settlePose,
    captureKickPose,
    holdPose,
    exitPose,
  };
}

let activeTriggers = [];

/**
 * Initializes master ScrollTriggers for overarching sections:
 * Hero prologue, Motion In Time, and Final Epilogue Return.
 */
export function initCameraScrollTriggers() {
  activeTriggers.forEach((t) => t.kill && t.kill());
  activeTriggers = [];

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const P = CAMERA_POSES;

  // 1. CHAPTER 01: THROUGH A LENS (Hero Prologue)
  // Large center hero camera -> smoothly transitions into downward travel exit
  const t1 = ScrollTrigger.create({
    trigger: "#chapter-01",
    start: "top top",
    end: "bottom top",
    scrub: 1.2,
    onUpdate: (self) => {
      const p = self.progress;
      const eased = 0.5 - 0.5 * Math.cos(p * Math.PI);
      const pA = P.introHero;
      const pB = P.introExit;

      cameraState.camX = gsap.utils.interpolate(pA.camX, pB.camX, eased);
      cameraState.camY = gsap.utils.interpolate(pA.camY, pB.camY, eased);
      cameraState.camZ = gsap.utils.interpolate(pA.camZ, pB.camZ, eased) + (isMobile ? 0.35 : 0);

      cameraState.targetX = gsap.utils.interpolate(pA.targetX, pB.targetX, eased);
      cameraState.targetY = gsap.utils.interpolate(pA.targetY, pB.targetY, eased);
      cameraState.targetZ = gsap.utils.interpolate(pA.targetZ, pB.targetZ, eased);

      cameraState.modelX = gsap.utils.interpolate(pA.modelX, pB.modelX, eased);
      cameraState.modelY = gsap.utils.interpolate(pA.modelY, pB.modelY, eased);
      cameraState.modelZ = gsap.utils.interpolate(pA.modelZ, pB.modelZ, eased);

      cameraState.modelRotX = gsap.utils.interpolate(pA.modelRotX, pB.modelRotX, eased);
      cameraState.modelRotY = gsap.utils.interpolate(pA.modelRotY, pB.modelRotY, eased);
      cameraState.modelRotZ = gsap.utils.interpolate(pA.modelRotZ, pB.modelRotZ, eased);

      cameraState.modelScaleMultiplier = gsap.utils.interpolate(pA.scale, pB.scale, eased);
    },
  });
  activeTriggers.push(t1);

  // 2. SPECIAL CHAPTER: MOTION IN TIME (Video Archive)
  const tMotion = ScrollTrigger.create({
    trigger: "#chapter-motion",
    start: "top bottom",
    end: "bottom top",
    scrub: 1.2,
    onUpdate: (self) => {
      const p = self.progress;
      const eased = 0.5 - 0.5 * Math.cos(p * Math.PI);
      const pA = P.motionReels;
      const pB = P.motionExit;

      cameraState.camX = gsap.utils.interpolate(pA.camX, pB.camX, eased);
      cameraState.camY = gsap.utils.interpolate(pA.camY, pB.camY, eased);
      cameraState.camZ = gsap.utils.interpolate(pA.camZ, pB.camZ, eased) + (isMobile ? 0.35 : 0);

      cameraState.targetX = gsap.utils.interpolate(pA.targetX, pB.targetX, eased);
      cameraState.targetY = gsap.utils.interpolate(pA.targetY, pB.targetY, eased);
      cameraState.targetZ = gsap.utils.interpolate(pA.targetZ, pB.targetZ, eased);

      cameraState.modelX = gsap.utils.interpolate(pA.modelX, pB.modelX, eased);
      cameraState.modelY = gsap.utils.interpolate(pA.modelY, pB.modelY, eased);
      cameraState.modelZ = gsap.utils.interpolate(pA.modelZ, pB.modelZ, eased);

      cameraState.modelRotX = gsap.utils.interpolate(pA.modelRotX, pB.modelRotX, eased);
      cameraState.modelRotY = gsap.utils.interpolate(pA.modelRotY, pB.modelRotY, eased);
      cameraState.modelRotZ = gsap.utils.interpolate(pA.modelRotZ, pB.modelRotZ, eased);

      cameraState.modelScaleMultiplier = gsap.utils.interpolate(pA.scale, pB.scale, eased);
    },
  });
  activeTriggers.push(tMotion);

  // 3. FINAL CHAPTER: SOME MOMENTS STAY (Epilogue)
  // Continuous 720° (4*PI) return to exact center hero pose
  const tFinal = ScrollTrigger.create({
    trigger: "#final-chapter",
    start: "top bottom",
    end: "bottom bottom",
    scrub: 1.2,
    onUpdate: (self) => {
      const p = self.progress;
      const target = P.epilogueReturn;

      cameraState.camX = gsap.utils.interpolate(cameraState.camX, target.camX, p * 0.15);
      cameraState.camY = gsap.utils.interpolate(cameraState.camY, target.camY, p * 0.15);
      cameraState.camZ = gsap.utils.interpolate(cameraState.camZ, target.camZ, p * 0.15);

      cameraState.targetX = gsap.utils.interpolate(cameraState.targetX, target.targetX, p * 0.15);
      cameraState.targetY = gsap.utils.interpolate(cameraState.targetY, target.targetY, p * 0.15);
      cameraState.targetZ = gsap.utils.interpolate(cameraState.targetZ, target.targetZ, p * 0.15);

      cameraState.modelX = gsap.utils.interpolate(cameraState.modelX, target.modelX, p * 0.15);
      cameraState.modelY = gsap.utils.interpolate(cameraState.modelY, target.modelY, p * 0.15);
      cameraState.modelZ = gsap.utils.interpolate(cameraState.modelZ, target.modelZ, p * 0.15);

      cameraState.modelRotX = gsap.utils.interpolate(cameraState.modelRotX, target.modelRotX, p * 0.15);
      cameraState.modelRotY = gsap.utils.interpolate(cameraState.modelRotY, target.modelRotY, p * 0.15);
      cameraState.modelRotZ = gsap.utils.interpolate(cameraState.modelRotZ, target.modelRotZ, p * 0.15);

      cameraState.modelScaleMultiplier = gsap.utils.interpolate(cameraState.modelScaleMultiplier, target.scale, p * 0.15);
      cameraState.lightingIntensity = gsap.utils.interpolate(1.15, 0.25, p);
    },
  });
  activeTriggers.push(tFinal);

  ScrollTrigger.refresh();
}
