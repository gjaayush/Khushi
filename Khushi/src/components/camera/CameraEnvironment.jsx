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

      {/* Self-contained, 100% offline Studio Environment Panels (Zero external CDN fetch dependencies) */}
      <Environment environmentIntensity={0.75}>
        {/* Key Studio Softbox */}
        <mesh position={[4, 5, 4]} scale={[6, 6, 1]}>
          <planeGeometry />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
        {/* Warm Fill Softbox */}
        <mesh position={[-5, 3, 3]} scale={[5, 5, 1]}>
          <planeGeometry />
          <meshBasicMaterial color="#dfc28d" toneMapped={false} />
        </mesh>
        {/* Cool Rim Light Strip */}
        <mesh position={[-4, 4, -4]} scale={[4, 8, 1]}>
          <planeGeometry />
          <meshBasicMaterial color="#9fc2ea" toneMapped={false} />
        </mesh>
        {/* Top Diffuser Ring */}
        <mesh position={[0, 7, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[8, 8, 1]}>
          <ringGeometry args={[2, 4, 16]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
      </Environment>
    </>
  );
}

