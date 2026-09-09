export default function CameraLights() {
  return (
    <>
      <ambientLight intensity={1.5} />

      <directionalLight
        position={[5, 5, 5]}
        intensity={3}
      />

      <directionalLight
        position={[-5, 3, 2]}
        intensity={1.5}
      />
    </>
  );
}