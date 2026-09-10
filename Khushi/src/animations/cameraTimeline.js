import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * CAMERA POSE ARCHITECTURE
 * Defines baseline cinematic waypoints across the continuous narrative archive.
 * Calibrated for physical 35mm DSLR:
 * - modelX, modelY, modelZ: spatial translation of DSLR body
 * - modelRotX: pitch (vertical tilt)
 * - modelRotY: yaw (continuous 360°+ rotation)
 * - modelRotZ: roll (dynamic bank)
 * - camX, camY, camZ: Three.js camera position
 * - targetX, targetY, targetZ: camera look-at focus point
 * - scale: relative scale multiplier
 */
export const CAMERA_POSES = {
  // Chapter 01: Through A Lens (Prologue / Hero)
  // Eye-level commanding front product view, lens facing viewer directly
  introHero: {
    camX: 0.0,
    camY: 0.0,
    camZ: 2.5,
    targetX: 0.0,
    targetY: 0.0,
    targetZ: 0.0,
    modelX: 0.0,
    modelY: 0.0,
    modelZ: 0.0,
    modelRotX: 0.03,
    modelRotY: 0.0,
    modelRotZ: 0.0,
    scale: 1.05,
  },
  introExit: {
    camX: 0.65,
    camY: 0.25,
    camZ: 2.45,
    targetX: 0.25,
    targetY: -0.05,
    targetZ: 0.0,
    modelX: 0.75,
    modelY: -0.05,
    modelZ: 0.05,
    modelRotX: 0.12,
    modelRotY: 0.65, // ~37° top dial angle
    modelRotZ: -0.03,
    scale: 1.02,
  },

  // Chapter 05: Forest Pinned Sequence Ambient Companion
  forestSequence: {
    camX: -0.5,
    camY: 0.15,
    camZ: 2.5,
    targetX: -0.2,
    targetY: 0.05,
    targetZ: 0.0,
    modelX: -0.65,
    modelY: 0.08,
    modelZ: -0.1,
    modelRotX: 0.08,
    modelRotY: 7.2,
    modelRotZ: 0.02,
    scale: 0.98,
  },

  // Special Chapter: Motion In Time (Video Archive)
  // Dynamic elevated perspective alongside dual video reels
  motionReels: {
    camX: 0.0,
    camY: 0.45,
    camZ: 2.65,
    targetX: 0.0,
    targetY: 0.15,
    targetZ: -0.1,
    modelX: 0.0,
    modelY: 0.35,
    modelZ: -0.2,
    modelRotX: 0.24,
    modelRotY: 8.65,
    modelRotZ: 0.0,
    scale: 0.95,
  },
  motionExit: {
    camX: -0.6,
    camY: -0.1,
    camZ: 2.55,
    targetX: -0.3,
    targetY: -0.05,
    targetZ: -0.05,
    modelX: -0.55,
    modelY: -0.08,
    modelZ: -0.1,
    modelRotX: 0.06,
    modelRotY: 9.15,
    modelRotZ: -0.02,
    scale: 1.0,
  },

  // Final Chapter / Epilogue: Return
  // Completes 720° (4*PI) journey, settles in exact center hero pose facing user
  epilogueReturn: {
    camX: 0.0,
    camY: 0.0,
    camZ: 2.45,
    targetX: 0.0,
    targetY: 0.0,
    targetZ: 0.0,
    modelX: 0.0,
    modelY: 0.0,
    modelZ: 0.0,
    modelRotX: 0.02,
    modelRotY: Math.PI * 4, // 720° (2 full 360° revolutions, settling perfectly facing forward)
    modelRotZ: 0.0,
    scale: 1.15,
  },
};

// Reactive state object read on every frame by Three.js Canvas / CameraScene / CameraModel
export const cameraState = {
  camX: 0,
  camY: 0,
  camZ: 2.5,

  targetX: 0,
  targetY: 0,
  targetZ: 0,

  modelX: 0,
  modelY: 0,
  modelZ: 0,
  modelRotX: 0.03,
  modelRotY: 0,
  modelRotZ: 0,
  modelScaleMultiplier: 1.05,

  lightingIntensity: 1.15,
  canvasOpacity: 1.0,
};

/**
 * Generates the full 8-phase cinematic capture choreography for an individual photo.
 * Ensures the camera:
 * 1. Travels across 3D space (not static/centered)
 * 2. Turns its front lens directly towards the viewer
 * 3. Approaches the viewer until the lens is HUGE (filling 65-85% of visual field)
 * 4. Settles for the shutter click moment
 * 5. Pulls back into a companion 3/4 pose alongside the revealed photograph
 * 6. Travels away toward the next memory
 */
export function getMomentChoreography({ chapter, index = 0, align = "left", isMobile = false, isTablet = false }) {
  // Determine front-facing capture rotation in radians for this moment
  // Base rotation accumulates continuously to avoid snapping
  let baseYaw = 0;
  let approachAngle = 0.55; // 3/4 side angle before turn
  let chapterTilt = 0.05;

  if (chapter === "chapter-02") {
    // HER: Intimate portraits, warm gentle turns around 0 -> 2*PI
    baseYaw = 0.0 + (index * 0.45);
    approachAngle = 0.65;
    chapterTilt = 0.04;
  } else if (chapter === "chapter-03") {
    // MOMENTS: Kinetic street sweeps, lateral tracking from 2.5 -> 6.0 rad
    baseYaw = 2.4 + (index * 0.48);
    approachAngle = index % 2 === 0 ? 0.85 : -0.85;
    chapterTilt = 0.08;
  } else if (chapter === "chapter-04") {
    // THE JOURNEY: High overhead mountain highway angles from 6.28 -> 8.2 rad
    baseYaw = Math.PI * 2 + (index * 0.5);
    approachAngle = 0.75;
    chapterTilt = 0.22; // marked downward tilt over top dials
  } else if (chapter === "chapter-05") {
    // INTO THE FOREST: Deep organic glide, subtle bank
    baseYaw = 7.6 + (index * 0.4);
    approachAngle = 0.5;
    chapterTilt = 0.06;
  } else if (chapter === "chapter-06") {
    // THE MOUNTAINS: Low-angle to high viewpoint sweep from 9.2 -> 10.6 rad
    baseYaw = 9.2 + (index * 0.55);
    approachAngle = index % 2 === 0 ? -0.9 : 0.9;
    chapterTilt = -0.1; // dramatic low angle looking up
  } else if (chapter === "chapter-07") {
    // LOOKING BACK: Nostalgic sunset glide from 10.8 -> 12.0 rad
    baseYaw = 10.8 + (index * 0.45);
    approachAngle = 0.42;
    chapterTilt = 0.03;
  } else {
    baseYaw = index * 0.5;
  }

  // The front lens faces the viewer at exact multiples of 2*PI relative to baseYaw
  const captureRotY = Math.round(baseYaw / (Math.PI * 2)) * (Math.PI * 2);

  // Responsive spatial modifiers
  const latMult = isMobile ? 0.2 : isTablet ? 0.65 : 1.0;
  const vertOffset = isMobile ? 0.26 : 0.0;
  const isPhotoLeft = align === "left";

  // When photo is on left, camera sits on right (+X); when photo is on right, camera sits on left (-X)
  const companionSideX = (isPhotoLeft ? 0.92 : -0.92) * latMult;
  const companionAngleY = captureRotY + (isPhotoLeft ? 0.42 : -0.42);

  // 1. ENTRY POSE (Camera sweeps into frame from travel)
  const entryPose = {
    camX: (isPhotoLeft ? -0.4 : 0.4) * latMult,
    camY: chapterTilt * 0.5 + (isMobile ? 0.1 : 0),
    camZ: 2.45 + (isMobile ? 0.35 : 0),
    targetX: 0.0,
    targetY: 0.0,
    targetZ: 0.0,
    modelX: (isPhotoLeft ? -0.75 : 0.75) * latMult,
    modelY: (chapterTilt * 0.6) + vertOffset,
    modelZ: -0.15,
    modelRotX: chapterTilt,
    modelRotY: captureRotY + approachAngle,
    modelRotZ: isPhotoLeft ? -0.04 : 0.04,
    scale: 1.05 * (isMobile ? 0.85 : 1.0),
  };

  // 2. TRAVEL POSE (Camera sweeps across 3D space, beginning turn)
  const travelPose = {
    camX: 0.0,
    camY: vertOffset * 0.3,
    camZ: 2.3 + (isMobile ? 0.3 : 0),
    targetX: 0.0,
    targetY: 0.0,
    targetZ: 0.0,
    modelX: (isPhotoLeft ? -0.3 : 0.3) * latMult,
    modelY: vertOffset * 0.5,
    modelZ: 0.0,
    modelRotX: chapterTilt * 0.4,
    modelRotY: captureRotY + (approachAngle * 0.4),
    modelRotZ: 0.0,
    scale: 1.18 * (isMobile ? 0.88 : 1.0),
  };

  // 3. FACING POSE (Front lens turns directly toward viewer)
  const facingPose = {
    camX: 0.0,
    camY: vertOffset * 0.2,
    camZ: 2.05 + (isMobile ? 0.25 : 0),
    targetX: 0.0,
    targetY: 0.0,
    targetZ: 0.0,
    modelX: 0.0,
    modelY: vertOffset * 0.3,
    modelZ: 0.08,
    modelRotX: 0.02,
    modelRotY: captureRotY, // ◉ FRONT LENS FACES USER DIRECTLY
    modelRotZ: 0.0,
    scale: 1.32 * (isMobile ? 0.92 : 1.0),
  };

  // 4. LENS APPROACH POSE (Lens physically advances and becomes HUGE)
  // Visually occupies 70-85% of visual field on desktop, 55-65% on mobile
  const lensApproachPose = {
    camX: 0.0,
    camY: vertOffset * 0.1,
    camZ: isMobile ? 1.6 : isTablet ? 1.42 : 1.32,
    targetX: 0.0,
    targetY: 0.0,
    targetZ: 0.0,
    modelX: 0.0,
    modelY: vertOffset * 0.2,
    modelZ: 0.26,
    modelRotX: 0.01,
    modelRotY: captureRotY, // ◉ DEAD CENTER LENS
    modelRotZ: 0.0,
    scale: isMobile ? 1.25 : isTablet ? 1.48 : 1.68,
  };

  // 5. LENS CLOSE POSE (Short sharp settle right before shutter click)
  const lensClosePose = {
    camX: 0.0,
    camY: vertOffset * 0.1,
    camZ: isMobile ? 1.55 : isTablet ? 1.38 : 1.28,
    targetX: 0.0,
    targetY: 0.0,
    targetZ: 0.0,
    modelX: 0.0,
    modelY: vertOffset * 0.18,
    modelZ: 0.28,
    modelRotX: 0.01,
    modelRotY: captureRotY,
    modelRotZ: 0.0,
    scale: isMobile ? 1.28 : isTablet ? 1.52 : 1.72,
  };

  // 6. SHUTTER RECOIL POSE (Tiny mechanical pulse at shutter instant)
  const captureKickPose = {
    camX: 0.0,
    camY: vertOffset * 0.1,
    camZ: isMobile ? 1.58 : isTablet ? 1.4 : 1.3,
    targetX: 0.0,
    targetY: 0.0,
    targetZ: 0.0,
    modelX: 0.0,
    modelY: vertOffset * 0.18,
    modelZ: 0.24,
    modelRotX: 0.02,
    modelRotY: captureRotY,
    modelRotZ: 0.0,
    scale: isMobile ? 1.24 : isTablet ? 1.47 : 1.65,
  };

  // 7. COMPANION POSE (Camera pulls back into side 3/4 angle while photo reveals)
  const companionPose = {
    camX: (isPhotoLeft ? 0.35 : -0.35) * latMult,
    camY: vertOffset * 0.2,
    camZ: 2.35 + (isMobile ? 0.35 : 0),
    targetX: (companionSideX * 0.4),
    targetY: vertOffset * 0.2,
    targetZ: 0.0,
    modelX: companionSideX,
    modelY: vertOffset,
    modelZ: 0.0,
    modelRotX: 0.05,
    modelRotY: companionAngleY, // 3/4 companion pose
    modelRotZ: isPhotoLeft ? 0.02 : -0.02,
    scale: 1.08 * (isMobile ? 0.85 : 1.0),
  };

  // 8. EXIT POSE (Camera begins travelling toward next memory)
  const exitPose = {
    camX: (isPhotoLeft ? 0.5 : -0.5) * latMult,
    camY: vertOffset * 0.2,
    camZ: 2.45 + (isMobile ? 0.35 : 0),
    targetX: 0.0,
    targetY: 0.0,
    targetZ: 0.0,
    modelX: (isPhotoLeft ? 1.05 : -1.05) * latMult,
    modelY: vertOffset,
    modelZ: -0.15,
    modelRotX: 0.08,
    modelRotY: captureRotY + (approachAngle * 1.3),
    modelRotZ: isPhotoLeft ? 0.03 : -0.03,
    scale: 1.02 * (isMobile ? 0.82 : 1.0),
  };

  return {
    entryPose,
    travelPose,
    facingPose,
    lensApproachPose,
    lensClosePose,
    captureKickPose,
    companionPose,
    exitPose,
    captureRotY,
  };
}

// Master triggers store
let activeTriggers = [];

/**
 * Initializes the overarching chapter timeline.
 * Handles Hero prologue, video reels, and final epilogue return.
 */
export function initCameraScrollTriggers() {
  activeTriggers.forEach((t) => t.kill && t.kill());
  activeTriggers = [];

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const isTablet = typeof window !== "undefined" && window.innerWidth >= 768 && window.innerWidth < 1024;
  const P = CAMERA_POSES;

  // 1. CHAPTER 01: THROUGH A LENS (Hero Prologue)
  // Large center hero camera -> turns smoothly into 3/4 travel exit
  const t1 = ScrollTrigger.create({
    trigger: "#chapter-01",
    start: "top top",
    end: "bottom top",
    scrub: 1.0,
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
  // Elevated perspective over video reels
  const tMotion = ScrollTrigger.create({
    trigger: "#chapter-motion",
    start: "top bottom",
    end: "bottom top",
    scrub: 1.0,
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
  // Reverses journey, returns to exact center hero pose, completing 720° rotation
  const tFinal = ScrollTrigger.create({
    trigger: "#final-chapter",
    start: "top bottom",
    end: "bottom bottom",
    scrub: 1.0,
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
