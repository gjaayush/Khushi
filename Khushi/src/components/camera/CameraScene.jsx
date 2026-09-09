import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import CameraModel from "./CameraModel";
import CameraLights from "./CameraLights";

export default function CameraScene() {
  return (
    <div className="camera-canvas">
      <Canvas
        camera={{
          position: [0, 1, 5],
          fov: 45,
        }}
      >
        <CameraLights />
        <CameraModel />
        <OrbitControls />
      </Canvas>
    </div>
  );
}