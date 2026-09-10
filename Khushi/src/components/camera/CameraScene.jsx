import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import CameraModel from "./CameraModel";
import CameraLights from "./CameraLights";
import CameraEnvironment from "./CameraEnvironment";
import { cameraState } from "../../animations/cameraTimeline";

function CameraController() {
  useFrame((state, delta) => {
    const damping = Math.min(delta * 4.0, 0.28);

    // Smoothly lerp camera position in 3D space
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

    // Look at target point
    state.camera.lookAt(
      cameraState.targetX,
      cameraState.targetY,
      cameraState.targetZ
    );
  });

  return null;
}

export default function CameraScene() {
  const containerRef = useRef();
  const [fov, setFov] = useState(38);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setFov(46); // Mobile
      } else if (w < 1024) {
        setFov(39); // iPad / Tablet
      } else {
        setFov(35); // Desktop / Laptop
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
          toneMappingExposure: 1.1,
        }}
        camera={{
          position: [0, 0, 1.15],
          fov: fov,
          near: 0.1,
          far: 30,
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