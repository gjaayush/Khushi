import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { cameraState } from "../../animations/cameraTimeline";

export default function CameraLights() {
  const keyLightRef = useRef();
  const rimLightRef = useRef();
  const backLightRef = useRef();

  useFrame(() => {
    const intensity = cameraState.lightingIntensity || 1.0;
    if (keyLightRef.current) {
      keyLightRef.current.intensity = 2.4 * intensity;
    }
    if (rimLightRef.current) {
      rimLightRef.current.intensity = 3.2 * intensity;
    }
    if (backLightRef.current) {
      // Shines clearly when the camera rotates to reveal its back LCD screen
      backLightRef.current.intensity = 2.0 * intensity;
    }
  });

  return (
    <>
      {/* Ambient shadow fill */}
      <ambientLight intensity={0.7} color="#161822" />

      {/* Main warm key light for front prism and lens */}
      <directionalLight
        ref={keyLightRef}
        position={[4, 5, 4]}
        intensity={2.4}
        color="#fff6ed"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      {/* Crisp cool rim light for dials and body contours */}
      <directionalLight
        ref={rimLightRef}
        position={[-5, 3.5, -3]}
        intensity={3.2}
        color="#9fc2ea"
      />

      {/* Rear studio light to illuminate LCD screen and viewfinder when camera rotates 180° */}
      <directionalLight
        ref={backLightRef}
        position={[2, 2, -4]}
        intensity={2.0}
        color="#e6ecf5"
      />

      {/* Subtle floor bounce */}
      <directionalLight
        position={[0, -3, 2]}
        intensity={0.5}
        color="#dfd3be"
      />

      {/* Pin specular light focused on front optical coating */}
      <pointLight
        position={[0.2, 0.4, 2.0]}
        intensity={1.5}
        color="#e5f0ff"
        distance={5.0}
      />
    </>
  );
}