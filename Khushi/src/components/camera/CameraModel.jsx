import { useGLTF } from "@react-three/drei";

export default function CameraModel() {
  const { scene } = useGLTF("/models/pentax_k-1_dslr.glb");

  return (
    <primitive
      object={scene}
      scale={5}
      position={[0, 0, 0]}
    />
  );
}

useGLTF.preload("/models/pentax_k-1_dslr.glb");