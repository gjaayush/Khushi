import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { cameraState } from "../../animations/cameraTimeline";

export default function CameraModel() {
  const outerGroupRef = useRef();
  const innerGroupRef = useRef();
  const { scene } = useGLTF("/models/pentax_k-1_dslr.glb");

  // Dynamic responsive scale tailored for desktop, iPad, and mobile
  // Calibrated so DSLR visually occupies 40-70% visual height on Desktop,
  // 35-60% on Tablet, and 35-50% on Mobile
  const [deviceScale, setDeviceScale] = useState(3.95);

  // Mouse & Pointer interaction state
  const mousePos = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragDelta = useRef({ x: 0, y: 0 });
  const dragRotation = useRef({ x: 0, y: 0 });
  const dragVelocity = useRef({ x: 0, y: 0 });
  const scrollInfluence = useRef(1.0); // 1.0 on hero, decays smoothly to 0 on scroll

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        // Mobile (occupies ~40-52% viewport height)
        setDeviceScale(2.9);
      } else if (w < 1024) {
        // Tablet / iPad (occupies ~45-60% viewport height)
        setDeviceScale(3.5);
      } else if (w < 1440) {
        // Laptops & standard desktop (occupies ~55-70% viewport height)
        setDeviceScale(3.95);
      } else {
        // Large desktop / Ultrawide
        setDeviceScale(4.25);
      }
    };

    const handleScroll = () => {
      // Hero interactive influence smoothly fades as user scrolls past first viewport
      const threshold = window.innerHeight * 0.9;
      const progress = Math.min(1, Math.max(0, window.scrollY / threshold));
      scrollInfluence.current = 1.0 - progress;
    };

    const handlePointerMove = (e) => {
      // Normalized mouse coordinates: -1 to 1
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mousePos.current.x = nx;
      mousePos.current.y = ny;

      if (isDragging.current && scrollInfluence.current > 0.1) {
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        dragDelta.current.x = dx;
        dragDelta.current.y = dy;

        // Add to drag rotation: horizontal dragging spins Y axis 360°, vertical tilts X
        const sensitivity = 0.007;
        dragRotation.current.y += dx * sensitivity;
        dragRotation.current.x = Math.max(
          -0.6,
          Math.min(0.6, dragRotation.current.x + dy * sensitivity * 0.5)
        );

        dragVelocity.current.x = dx * sensitivity;
        dragVelocity.current.y = dy * sensitivity * 0.5;

        dragStart.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handlePointerDown = (e) => {
      // Allow drag rotation only in hero section
      if (scrollInfluence.current > 0.2) {
        isDragging.current = true;
        dragStart.current = { x: e.clientX, y: e.clientY };
        dragVelocity.current = { x: 0, y: 0 };
      }
    };

    const handlePointerUp = () => {
      isDragging.current = false;
    };

    handleResize();
    handleScroll();

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  // Compute bounding box and normalize scene around [0, 0, 0]
  const { normalizedScene, normScale } = useMemo(() => {
    const s = scene.clone(true);

    const box = new THREE.Box3().setFromObject(s);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1.0;
    const scaleFactor = 1.0 / maxDim;

    // Shift geometry so exact center is at (0, 0, 0)
    s.position.set(-center.x, -center.y, -center.z);

    // Refine PBR materials for photorealistic DSLR rendering
    s.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          const mat = child.material.clone();
          mat.envMapIntensity = 1.8;

          const nameLower = (child.name + " " + (mat.name || "")).toLowerCase();
          if (
            nameLower.includes("lens") &&
            !nameLower.includes("hood") &&
            !nameLower.includes("daf85mms")
          ) {
            // Optical glass element: deep, multi-coated anti-reflective glass
            mat.roughness = 0.02;
            mat.metalness = 0.2;
            mat.color = new THREE.Color("#101b26");
            mat.clearcoat = 1.0;
            mat.clearcoatRoughness = 0.03;
          } else {
            // Textured matte magnesium DSLR body and knurled alloy dials
            mat.roughness = 0.48;
            mat.metalness = 0.45;
          }
          child.material = mat;
        }
      }
    });

    return { normalizedScene: s, normScale: scaleFactor };
  }, [scene]);

  useFrame((state, delta) => {
    if (!outerGroupRef.current) return;

    // Spring damping factor
    const damping = Math.min(delta * 4.5, 0.28);
    const heroFactor = scrollInfluence.current;

    // Apply friction to drag velocity when user releases pointer
    if (!isDragging.current && Math.abs(dragVelocity.current.x) > 0.0001) {
      dragRotation.current.y += dragVelocity.current.x;
      dragVelocity.current.x *= 0.94; // Smooth friction decay
    }
    if (!isDragging.current && Math.abs(dragVelocity.current.y) > 0.0001) {
      dragRotation.current.x += dragVelocity.current.y;
      dragVelocity.current.x = Math.max(-0.6, Math.min(0.6, dragRotation.current.x));
      dragVelocity.current.y *= 0.92;
    }

    // Gentle ambient floating / breathing physics
    const time = state.clock.getElapsedTime();
    const floatY = Math.sin(time * 0.9) * 0.035 * (heroFactor > 0.5 ? 1.0 : 0.3);
    const floatRotZ = Math.cos(time * 0.7) * 0.015 * heroFactor;

    // Responsive mouse hover rotation (smooth tracking of pointer coordinates on index page)
    // Horizontal range: ±0.85 rad (~50°), Vertical range: ±0.35 rad (~20°)
    const hoverRotY = mousePos.current.x * 0.85 * heroFactor;
    const hoverRotX = -mousePos.current.y * 0.38 * heroFactor;

    // Model Position: blends timeline position with subtle mouse parallax
    const targetX = cameraState.modelX + (mousePos.current.x * 0.15 * heroFactor);
    const targetY = cameraState.modelY + floatY - (mousePos.current.y * 0.12 * heroFactor);
    const targetZ = cameraState.modelZ;

    outerGroupRef.current.position.x = THREE.MathUtils.lerp(
      outerGroupRef.current.position.x,
      targetX,
      damping
    );
    outerGroupRef.current.position.y = THREE.MathUtils.lerp(
      outerGroupRef.current.position.y,
      targetY,
      damping
    );
    outerGroupRef.current.position.z = THREE.MathUtils.lerp(
      outerGroupRef.current.position.z,
      targetZ,
      damping
    );

    // Dynamic 360° rotation:
    // When on Hero: timeline rotation + interactive drag rotation + smooth mouse cursor hover
    // When scrolling: timeline progression takes over smoothly
    const targetRotY =
      cameraState.modelRotY +
      (dragRotation.current.y * heroFactor) +
      hoverRotY;

    const targetRotX =
      cameraState.modelRotX +
      (dragRotation.current.x * heroFactor) +
      hoverRotX;

    const targetRotZ = cameraState.modelRotZ + floatRotZ;

    outerGroupRef.current.rotation.y = THREE.MathUtils.lerp(
      outerGroupRef.current.rotation.y,
      targetRotY,
      damping
    );
    outerGroupRef.current.rotation.x = THREE.MathUtils.lerp(
      outerGroupRef.current.rotation.x,
      targetRotX,
      damping
    );
    outerGroupRef.current.rotation.z = THREE.MathUtils.lerp(
      outerGroupRef.current.rotation.z,
      targetRotZ,
      damping
    );

    // Responsive scaling
    const targetScale = normScale * deviceScale * (cameraState.modelScaleMultiplier || 1.0);
    outerGroupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(outerGroupRef.current.scale.x, targetScale, damping)
    );
  });

  return (
    <group ref={outerGroupRef} position={[0, 0, 0]}>
      <group ref={innerGroupRef}>
        <primitive object={normalizedScene} />
      </group>
    </group>
  );
}

useGLTF.preload("/models/pentax_k-1_dslr.glb");