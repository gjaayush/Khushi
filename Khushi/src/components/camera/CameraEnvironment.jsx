import { ContactShadows, Environment } from "@react-three/drei";

export default function CameraEnvironment() {
  return (
    <>
      {/* Soft contact shadow underneath the camera body */}
      <ContactShadows
        position={[0, -1.1, 0]}
        opacity={0.7}
        scale={6}
        blur={2.5}
        far={3.5}
        color="#020204"
      />

      {/* Preset neutral city/studio environment reflections for realistic metallic sheen */}
      <Environment preset="city" environmentIntensity={0.65} />
    </>
  );
}
