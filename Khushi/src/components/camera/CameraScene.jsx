import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import CameraModel from "./CameraModel";
import CameraLights from "./CameraLights";
import CameraEnvironment from "./CameraEnvironment";
import { cameraState } from "../../animations/cameraTimeline";

function CameraController() {
  const currentTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    const damping = Math.min(delta * 4.5, 0.28);

    // Smoothly lerp Three.js camera position in 3D world space
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      cameraState.camX,
      damping
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      cameraState.camY,
      damping
    );
    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      cameraState.camZ,
      damping
    );

    // Smoothly lerp camera look-at target in 3D world space
    currentTarget.current.x = THREE.MathUtils.lerp(
      currentTarget.current.x,
      cameraState.targetX,
      damping
    );
    currentTarget.current.y = THREE.MathUtils.lerp(
      currentTarget.current.y,
      cameraState.targetY,
      damping
    );
    currentTarget.current.z = THREE.MathUtils.lerp(
      currentTarget.current.z,
      cameraState.targetZ,
      damping
    );

    // Point camera smoothly at the dynamic target
    state.camera.lookAt(currentTarget.current);
  });

  return null;
}

export default function CameraScene() {
  const containerRef = useRef();
  const [fov, setFov] = useState(32);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setFov(42); // Mobile: balanced wide-normal
      } else if (w < 1024) {
        setFov(36); // iPad / Tablet
      } else {
        setFov(32); // Desktop: cinematic telephoto compression
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className="camera-canvas-container fixed inset-0 pointer-events-none z-10 w-full h-full overflow-hidden"
      aria-hidden="true"
    >
      <Canvas
        shadows
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        camera={{
          position: [0, 0, 2.5],
          fov: fov,
          near: 0.02,
          far: 40,
        }}
      >
        <Suspense fallback={null}>
          <CameraController />
          <CameraLights />
          <CameraEnvironment />
          <CameraModel />
        </Suspense>
      </Canvas>
    </div>
  );
}