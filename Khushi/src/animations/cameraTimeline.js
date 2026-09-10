import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * CAMERA POSE SYSTEM
 * Defines precise 3D spatial waypoints across the continuous narrative journey.
 * Coordinates calibrated for photorealistic 35mm DSLR:
 * - modelX, modelY, modelZ: spatial translation of the DSLR body
 * - modelRotX: pitch (vertical tilt)
 * - modelRotY: yaw (continuous 360°+ rotation)
 * - modelRotZ: roll (subtle dynamic bank)
 * - camZ: camera distance / zoom perspective
 * - scale: responsive relative scale factor
 */
export const CAMERA_POSES = {
  // Chapter 01: Through A Lens (Prologue / Hero)
  // VIEW 01: HERO FRONT / 3/4
  // Camera sits eye-level, slightly offset, looking directly at DSLR prism & lens mount
  introHero: {
    camX: 0.0,
    camY: 0.0,
    camZ: 3.0,
    targetX: 0.0,
    targetY: 0.0,
    targetZ: 0.0,
    modelX: 0.0,
    modelY: 0.0,
    modelZ: 0.0,
    modelRotX: 0.04,
    modelRotY: 0.0,
    modelRotZ: 0.0,
    scale: 1.0,
  },
  // First Transition: Camera glides right and up, looking down and left at the top dial
  introExit: {
    camX: 0.75,
    camY: 0.35,
    camZ: 2.85,
    targetX: 0.35,
    targetY: -0.05,
    targetZ: 0.0,
    modelX: 0.85,
    modelY: -0.05,
    modelZ: 0.08,
    modelRotX: 0.12,
    modelRotY: 0.65, // ~37°
    modelRotZ: -0.03,
    scale: 0.98,
  },

  // Chapter 02: Her (Intimate Portraits)
  // VIEW 02: LEFT SIDE / 3/4 PROFILE
  // Camera sweeps across left, looking dynamically across into right frame
  herMid: {
    camX: -0.65,
    camY: 0.22,
    camZ: 2.7,
    targetX: 0.15,
    targetY: 0.08,
    targetZ: 0.05,
    modelX: 0.35,
    modelY: 0.14,
    modelZ: 0.16,
    modelRotX: 0.14,
    modelRotY: 1.15, // ~66° angle showing prism and dials
    modelRotZ: 0.04,
    scale: 1.02,
  },
  // VIEW 03: LENS CLOSE / MACRO OPTICAL PERSPECTIVE
  // Deep close-up on lens element and aperture, camera pushed in close (camZ: 2.25)
  herCross: {
    camX: -0.85,
    camY: -0.15,
    camZ: 2.35,
    targetX: -0.45,
    targetY: -0.05,
    targetZ: 0.15,
    modelX: -0.72,
    modelY: -0.06,
    modelZ: 0.22,
    modelRotX: 0.08,
    modelRotY: 1.62, // ~93° side profile
    modelRotZ: -0.04,
    scale: 1.12,
  },
  herExit: {
    camX: 0.45,
    camY: -0.25,
    camZ: 2.9,
    targetX: 0.25,
    targetY: -0.1,
    targetZ: 0.0,
    modelX: 0.55,
    modelY: -0.15,
    modelZ: -0.05,
    modelRotX: -0.05,
    modelRotY: 2.05, // ~117°
    modelRotZ: 0.02,
    scale: 0.96,
  },

  // Chapter 03: Moments (Street & City)
  // VIEW 04: REAR / 3/4 & VIEWFINDER VIEW
  // Dynamic sweep across visual field, showcasing back LCD screen, buttons, eyepiece
  momentsSweep: {
    camX: -0.75,
    camY: 0.3,
    camZ: 3.1,
    targetX: -0.35,
    targetY: 0.15,
    targetZ: -0.05,
    modelX: -0.85,
    modelY: 0.2,
    modelZ: -0.1,
    modelRotX: 0.16,
    modelRotY: 2.75, // ~158°
    modelRotZ: 0.05,
    scale: 0.95,
  },
  momentsRearView: {
    camX: 0.2,
    camY: 0.15,
    camZ: 2.65, // Close rear LCD inspection
    targetX: 0.1,
    targetY: 0.12,
    targetZ: 0.0,
    modelX: 0.12,
    modelY: 0.22,
    modelZ: 0.05,
    modelRotX: 0.08,
    modelRotY: 3.25, // ~186° directly from back
    modelRotZ: -0.02,
    scale: 1.05,
  },
  momentsExit: {
    camX: 0.85,
    camY: -0.2,
    camZ: 3.2,
    targetX: 0.45,
    targetY: -0.1,
    targetZ: -0.1,
    modelX: 0.8,
    modelY: -0.12,
    modelZ: -0.15,
    modelRotX: 0.18,
    modelRotY: 4.15, // ~238° rotation
    modelRotZ: -0.04,
    scale: 0.93,
  },

  // Chapter 04: The Journey (Mountain Highways & Cloud Banks)
  // VIEW 05: TOP / HIGH ANGLE OVERHEAD VIEW
  // Elevated camera perspective looking down at top control dials and pentaprism
  journeySweep: {
    camX: -0.65,
    camY: 0.65, // Elevated Y
    camZ: 2.8,
    targetX: -0.45,
    targetY: 0.15,
    targetZ: -0.15,
    modelX: -0.75,
    modelY: 0.28,
    modelZ: -0.3,
    modelRotX: 0.38, // Marked downward tilt looking at mode dial
    modelRotY: 4.95, // ~283°
    modelRotZ: 0.06,
    scale: 0.92,
  },
  journeyOrbit: {
    camX: 0.55,
    camY: -0.3,
    camZ: 3.2,
    targetX: 0.25,
    targetY: -0.15,
    targetZ: -0.1,
    modelX: 0.35,
    modelY: -0.2,
    modelZ: -0.2,
    modelRotX: -0.08,
    modelRotY: 5.65, // ~324°
    modelRotZ: -0.03,
    scale: 0.94,
  },
  journeyExit: {
    camX: 0.7,
    camY: 0.18,
    camZ: 2.9,
    targetX: 0.45,
    targetY: 0.08,
    targetZ: 0.0,
    modelX: 0.65,
    modelY: 0.1,
    modelZ: 0.0,
    modelRotX: 0.06,
    modelRotY: 6.28, // 360° completed (2 * PI)
    modelRotZ: 0.0,
    scale: 0.98,
  },

  // Chapter 05: Into The Forest (Place -> Person -> Memory)
  // Progressive movement matching the pinned sequence: close glide -> diagonal tilt -> memory release
  forestPlace: {
    camX: 0.85,
    camY: -0.12,
    camZ: 2.7,
    targetX: 0.55,
    targetY: -0.05,
    targetZ: 0.1,
    modelX: 0.8,
    modelY: -0.05,
    modelZ: 0.2,
    modelRotX: 0.04,
    modelRotY: 6.85, // 392°
    modelRotZ: 0.02,
    scale: 1.04,
  },
  forestMemory: {
    camX: -0.8,
    camY: 0.25,
    camZ: 2.85,
    targetX: -0.45,
    targetY: 0.12,
    targetZ: 0.05,
    modelX: -0.75,
    modelY: 0.15,
    modelZ: 0.05,
    modelRotX: 0.14,
    modelRotY: 7.45, // 427°
    modelRotZ: -0.04,
    scale: 0.98,
  },
  forestExit: {
    camX: 0.6,
    camY: -0.2,
    camZ: 3.1,
    targetX: 0.35,
    targetY: -0.1,
    targetZ: -0.05,
    modelX: 0.5,
    modelY: -0.15,
    modelZ: -0.1,
    modelRotX: 0.16,
    modelRotY: 8.0, // 458°
    modelRotZ: 0.02,
    scale: 0.95,
  },

  // Special Chapter: Motion In Time (Video Archive)
  // VIEW 07: ELEVATED / CINEMATIC REELS VIEW
  motionReels: {
    camX: 0.0,
    camY: 0.55,
    camZ: 3.35,
    targetX: 0.0,
    targetY: 0.25,
    targetZ: -0.2,
    modelX: 0.0,
    modelY: 0.42,
    modelZ: -0.35,
    modelRotX: 0.28,
    modelRotY: 8.65, // 495°
    modelRotZ: 0.0,
    scale: 0.88,
  },
  motionExit: {
    camX: -0.7,
    camY: -0.15,
    camZ: 3.1,
    targetX: -0.4,
    targetY: -0.08,
    targetZ: -0.1,
    modelX: -0.6,
    modelY: -0.1,
    modelZ: -0.2,
    modelRotX: 0.08,
    modelRotY: 9.25, // 530°
    modelRotZ: -0.03,
    scale: 0.92,
  },

  // Chapter 06: The Mountains (Landscape Pull-Back)
  // VIEW 06: WIDE VIEW / DEEP PULL-BACK
  // Camera pulls back significantly into distance (camZ: 3.9), scale decreases, allowing grand mountain photos to dominate
  mountainsWide: {
    camX: 0.85,
    camY: -0.35,
    camZ: 3.9, // Wide pull-back
    targetX: 0.45,
    targetY: -0.2,
    targetZ: -0.5,
    modelX: 0.72,
    modelY: -0.28,
    modelZ: -0.85, // Pulled back deep
    modelRotX: -0.1,
    modelRotY: 9.95, // 570°
    modelRotZ: 0.04,
    scale: 0.78,
  },
  mountainsExit: {
    camX: -0.75,
    camY: 0.25,
    camZ: 3.3,
    targetX: -0.45,
    targetY: 0.12,
    targetZ: -0.25,
    modelX: -0.68,
    modelY: 0.18,
    modelZ: -0.45,
    modelRotX: 0.14,
    modelRotY: 10.65, // 610°
    modelRotZ: -0.02,
    scale: 0.88,
  },

  // Chapter 07: Looking Back (Quiet Balconies & Reflections)
  // VIEW 08: SIDE / LOW ANGLE NOSTALGIC GLIDE
  // Gentle, atmospheric glide with dramatic low-angle perspective
  lookingBackSoft: {
    camX: 0.7,
    camY: -0.15,
    camZ: 3.0,
    targetX: 0.4,
    targetY: -0.05,
    targetZ: -0.05,
    modelX: 0.62,
    modelY: -0.05,
    modelZ: -0.1,
    modelRotX: 0.06,
    modelRotY: 11.35, // 650°
    modelRotZ: 0.02,
    scale: 0.96,
  },
  lookingBackSunset: {
    camX: -0.35,
    camY: 0.18,
    camZ: 2.85,
    targetX: -0.15,
    targetY: 0.1,
    targetZ: 0.0,
    modelX: -0.3,
    modelY: 0.12,
    modelZ: 0.0,
    modelRotX: 0.04,
    modelRotY: 11.95, // 685°
    modelRotZ: -0.01,
    scale: 1.0,
  },

  // Epilogue: Return
  // VIEW 09: HERO RETURN
  // Camera returns smoothly to center hero framing, completing 720° (4*PI) journey
  epilogueReturn: {
    camX: 0.0,
    camY: 0.0,
    camZ: 2.8,
    targetX: 0.0,
    targetY: 0.0,
    targetZ: 0.0,
    modelX: 0.0,
    modelY: 0.0,
    modelZ: 0.0,
    modelRotX: 0.0,
    modelRotY: Math.PI * 4, // 720° (2 full 360° revolutions, settling perfectly facing forward)
    modelRotZ: 0.0,
    scale: 1.05,
  },
};

// Reactive state object read on every frame by R3F Canvas / CameraScene / CameraModel
export const cameraState = {
  camX: 0,
  camY: 0,
  camZ: 3.0,

  targetX: 0,
  targetY: 0,
  targetZ: 0,

  modelX: 0,
  modelY: 0,
  modelZ: 0,
  modelRotX: 0.04,
  modelRotY: 0,
  modelRotZ: 0,
  modelScaleMultiplier: 1.0,

  lightingIntensity: 1.1,
  canvasOpacity: 1.0,
};

// Helper function: Multi-waypoint continuous interpolation
function interpolateWaypointSequence(waypoints, progress, isMobile, isTablet) {
  if (!waypoints || waypoints.length === 0) return;
  if (waypoints.length === 1) {
    applyPose(waypoints[0], isMobile, isTablet);
    return;
  }

  const p = Math.max(0, Math.min(1, progress));
  const numSegments = waypoints.length - 1;
  const rawIdx = p * numSegments;
  const segIdx = Math.min(Math.floor(rawIdx), numSegments - 1);
  const localT = rawIdx - segIdx;

  // Smooth sinusoidal ease curve for fluid product-commercial movement
  const easedT = 0.5 - 0.5 * Math.cos(localT * Math.PI);

  const pA = waypoints[segIdx];
  const pB = waypoints[segIdx + 1];

  applyInterpolatedPose(pA, pB, easedT, isMobile, isTablet);
}

function applyInterpolatedPose(pA, pB, t, isMobile, isTablet) {
  // Lateral movement scaling for responsive viewports:
  // Mobile: tight lateral travel (±0.35 max)
  // Tablet: balanced travel (±0.75)
  // Desktop: full dynamic travel
  const lateralFactor = isMobile ? 0.35 : isTablet ? 0.75 : 1.0;
  const verticalOffset = isMobile ? 0.28 : 0;
  const scaleReduction = isMobile ? 0.78 : isTablet ? 0.9 : 1.0;

  // 1. Three.js Camera Position interpolation
  const rawCamX = gsap.utils.interpolate(pA.camX ?? 0, pB.camX ?? 0, t);
  const rawCamY = gsap.utils.interpolate(pA.camY ?? 0, pB.camY ?? 0, t);
  const rawCamZ = gsap.utils.interpolate(pA.camZ ?? 3.0, pB.camZ ?? 3.0, t);

  cameraState.camX = rawCamX * lateralFactor;
  cameraState.camY = rawCamY + (isMobile ? 0.15 : 0);
  cameraState.camZ = rawCamZ + (isMobile ? 0.35 : 0);

  // 2. Three.js Camera Look-At Target interpolation
  const rawTargetX = gsap.utils.interpolate(pA.targetX ?? 0, pB.targetX ?? 0, t);
  const rawTargetY = gsap.utils.interpolate(pA.targetY ?? 0, pB.targetY ?? 0, t);
  const rawTargetZ = gsap.utils.interpolate(pA.targetZ ?? 0, pB.targetZ ?? 0, t);

  cameraState.targetX = rawTargetX * lateralFactor;
  cameraState.targetY = rawTargetY + (isMobile ? 0.15 : 0);
  cameraState.targetZ = rawTargetZ;

  // 3. Model Position interpolation
  const rawX = gsap.utils.interpolate(pA.modelX, pB.modelX, t);
  const rawY = gsap.utils.interpolate(pA.modelY, pB.modelY, t);
  const rawZ = gsap.utils.interpolate(pA.modelZ, pB.modelZ, t);

  cameraState.modelX = rawX * lateralFactor;
  cameraState.modelY = rawY + verticalOffset;
  cameraState.modelZ = rawZ;

  // 4. Model Rotation interpolation: continuous yaw, pitch & roll
  const rotXFactor = isMobile ? 0.6 : 1.0;
  cameraState.modelRotX = gsap.utils.interpolate(pA.modelRotX, pB.modelRotX, t) * rotXFactor;
  cameraState.modelRotY = gsap.utils.interpolate(pA.modelRotY, pB.modelRotY, t);
  cameraState.modelRotZ = gsap.utils.interpolate(pA.modelRotZ, pB.modelRotZ, t) * rotXFactor;

  // 5. Scale interpolation
  const rawScale = gsap.utils.interpolate(pA.scale || 1.0, pB.scale || 1.0, t);
  cameraState.modelScaleMultiplier = rawScale * scaleReduction;
}

function applyPose(pose, isMobile, isTablet) {
  const lateralFactor = isMobile ? 0.35 : isTablet ? 0.75 : 1.0;
  const verticalOffset = isMobile ? 0.28 : 0;
  const scaleReduction = isMobile ? 0.78 : isTablet ? 0.9 : 1.0;

  cameraState.camX = (pose.camX ?? 0) * lateralFactor;
  cameraState.camY = (pose.camY ?? 0) + (isMobile ? 0.15 : 0);
  cameraState.camZ = (pose.camZ ?? 3.0) + (isMobile ? 0.35 : 0);

  cameraState.targetX = (pose.targetX ?? 0) * lateralFactor;
  cameraState.targetY = (pose.targetY ?? 0) + (isMobile ? 0.15 : 0);
  cameraState.targetZ = pose.targetZ ?? 0;

  cameraState.modelX = pose.modelX * lateralFactor;
  cameraState.modelY = pose.modelY + verticalOffset;
  cameraState.modelZ = pose.modelZ;
  cameraState.modelRotX = pose.modelRotX * (isMobile ? 0.6 : 1.0);
  cameraState.modelRotY = pose.modelRotY;
  cameraState.modelRotZ = pose.modelRotZ * (isMobile ? 0.6 : 1.0);
  cameraState.modelScaleMultiplier = (pose.scale || 1.0) * scaleReduction;
}

// Master ScrollTrigger instances storage for clean recreation
let activeTriggers = [];

/**
 * Initializes the unified Master Camera Choreography.
 * Chains every narrative chapter into a single continuous 3D trajectory.
 */
export function initCameraScrollTriggers() {
  // Clean up any existing triggers
  activeTriggers.forEach((t) => t.kill && t.kill());
  activeTriggers = [];

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const isTablet = typeof window !== "undefined" && window.innerWidth >= 768 && window.innerWidth < 1024;

  const P = CAMERA_POSES;

  // 1. CHAPTER 01: THROUGH A LENS (Prologue)
  // Starts in commanding front product pose; as scroll begins, camera glides and turns to 3/4 angle
  const t1 = ScrollTrigger.create({
    trigger: "#chapter-01",
    start: "top top",
    end: "bottom top",
    scrub: 1.0,
    onUpdate: (self) => {
      interpolateWaypointSequence([P.introHero, P.introExit], self.progress, isMobile, isTablet);
    },
  });
  activeTriggers.push(t1);

  // 2. CHAPTER 02: HER (Intimate Portraits)
  // Slow, intimate movement: camera travels diagonally across, rotates through side dial angles
  const t2 = ScrollTrigger.create({
    trigger: "#chapter-02",
    start: "top bottom",
    end: "bottom top",
    scrub: 1.0,
    onUpdate: (self) => {
      interpolateWaypointSequence([P.introExit, P.herMid, P.herCross, P.herExit], self.progress, isMobile, isTablet);
    },
  });
  activeTriggers.push(t2);

  // 3. CHAPTER 03: MOMENTS (Street & City)
  // Dynamic horizontal sweep across visual field, rotating through rear viewfinder angle
  const t3 = ScrollTrigger.create({
    trigger: "#chapter-03",
    start: "top bottom",
    end: "bottom top",
    scrub: 1.0,
    onUpdate: (self) => {
      interpolateWaypointSequence([P.herExit, P.momentsSweep, P.momentsRearView, P.momentsExit], self.progress, isMobile, isTablet);
    },
  });
  activeTriggers.push(t3);

  // 4. CHAPTER 04: THE JOURNEY (Mountain Highways & Cloud Banks)
  // Long cinematic travel, pull-back, top-down perspective, completing full 360° cycle
  const t4 = ScrollTrigger.create({
    trigger: "#chapter-04",
    start: "top bottom",
    end: "bottom top",
    scrub: 1.0,
    onUpdate: (self) => {
      interpolateWaypointSequence([P.momentsExit, P.journeySweep, P.journeyOrbit, P.journeyExit], self.progress, isMobile, isTablet);
    },
  });
  activeTriggers.push(t4);

  // 5. CHAPTER 05: INTO THE FOREST (Place -> Person -> Memory)
  // Progressive movement matching the pinned sequence: close glide -> diagonal tilt -> memory release
  const t5 = ScrollTrigger.create({
    trigger: "#chapter-05",
    start: "top bottom",
    end: "bottom top",
    scrub: 1.0,
    onUpdate: (self) => {
      interpolateWaypointSequence([P.journeyExit, P.forestPlace, P.forestMemory, P.forestExit], self.progress, isMobile, isTablet);
    },
  });
  activeTriggers.push(t5);

  // 6. SPECIAL CHAPTER: MOTION IN TIME (Video Archive)
  // Dynamic elevated perspective alongside dual video reels
  const tMotion = ScrollTrigger.create({
    trigger: "#chapter-motion",
    start: "top bottom",
    end: "bottom top",
    scrub: 1.0,
    onUpdate: (self) => {
      interpolateWaypointSequence([P.forestExit, P.motionReels, P.motionExit], self.progress, isMobile, isTablet);
    },
  });
  activeTriggers.push(tMotion);

  // 7. CHAPTER 06: THE MOUNTAINS (Landscape Pull-Back)
  // Camera moves backward into wide visual composition, allowing mountain photographs to breathe
  const t6 = ScrollTrigger.create({
    trigger: "#chapter-06",
    start: "top bottom",
    end: "bottom top",
    scrub: 1.0,
    onUpdate: (self) => {
      interpolateWaypointSequence([P.motionExit, P.mountainsWide, P.mountainsExit], self.progress, isMobile, isTablet);
    },
  });
  activeTriggers.push(t6);

  // 8. CHAPTER 07: LOOKING BACK (Quiet Balconies & Reflections)
  // Movement slows down significantly into peaceful, reflective gliding
  const t7 = ScrollTrigger.create({
    trigger: "#chapter-07",
    start: "top bottom",
    end: "bottom top",
    scrub: 1.0,
    onUpdate: (self) => {
      interpolateWaypointSequence([P.mountainsExit, P.lookingBackSoft, P.lookingBackSunset], self.progress, isMobile, isTablet);
    },
  });
  activeTriggers.push(t7);

  // 9. EPILOGUE: SOME MOMENTS STAY (The Return)
  // Gradually reverses the spatial journey, returns to exact center hero pose, fading gently to black
  const t8 = ScrollTrigger.create({
    trigger: "#final-chapter",
    start: "top bottom",
    end: "bottom bottom",
    scrub: 1.0,
    onUpdate: (self) => {
      interpolateWaypointSequence([P.lookingBackSunset, P.epilogueReturn], self.progress, isMobile, isTablet);
      cameraState.lightingIntensity = gsap.utils.interpolate(1.2, 0.25, self.progress);
    },
  });
  activeTriggers.push(t8);

  // Refresh ScrollTrigger so all chapter bounding boxes calculate accurately
  ScrollTrigger.refresh();
}
