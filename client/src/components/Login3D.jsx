import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, PerspectiveCamera, Stars } from "@react-three/drei";
import * as THREE from "three";

/* ================= AI CORE ================= */

function AICore() {
  const core = useRef();
  const glow = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    core.current.rotation.x = t * 0.12;
    core.current.rotation.y = t * 0.18;

    const pulse = 1 + Math.sin(t * 1.6) * 0.04;
    core.current.scale.setScalar(pulse);
    glow.current.scale.setScalar(pulse * 1.35);
  });

  return (
    <Float speed={1.4} floatIntensity={1.2}>
      {/* Core */}
      <mesh ref={core}>
        <icosahedronGeometry args={[1.35, 3]} />
        <meshPhysicalMaterial
          color="#60a5fa"
          emissive="#38bdf8"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.85}
          transmission={0.55}
          thickness={1}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Soft Glow */}
      <mesh ref={glow}>
        <icosahedronGeometry args={[1.9, 1]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.18}
          wireframe
        />
      </mesh>
    </Float>
  );
}

/* ================= ENERGY RINGS ================= */

function EnergyRing({ radius, speed, color, opacity = 0.5 }) {
  const ring = useRef();

  useFrame(({ clock }) => {
    ring.current.rotation.z = clock.getElapsedTime() * speed;
  });

  return (
    <mesh ref={ring}>
      <torusGeometry args={[radius, 0.025, 16, 120]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
}

/* ================= PARTICLES ================= */

function Particles() {
  const ref = useRef();
  const count = 900;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      arr[i] = (Math.random() - 0.5) * 28;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.01;
    ref.current.rotation.x = t * 0.006;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#c084fc"
        opacity={0.35}
        transparent
        sizeAttenuation
      />
    </points>
  );
}

/* ================= PARALLAX CAMERA ================= */

function ParallaxCamera() {
  const { camera, mouse } = useThree();

  useFrame(() => {
    camera.position.x += (mouse.x * 0.6 - camera.position.x) * 0.025;
    camera.position.y += (mouse.y * 0.35 - camera.position.y) * 0.025;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ================= MAIN SCENE ================= */

export default function FuturisticBackground() {
  return (
    <div className="absolute inset-0 -z-10 bg-black">
      <Canvas dpr={[1, 1.5]}>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} />
        <ParallaxCamera />

        {/* Lighting (Soft & Cinematic) */}
        <ambientLight intensity={0.25} />
        <pointLight position={[4, 4, 6]} intensity={1.4} color="#38bdf8" />
        <pointLight position={[-4, -3, -6]} intensity={0.9} color="#c084fc" />

        {/* Deep Space */}
        <Stars radius={120} depth={50} count={6000} factor={3} fade />

        {/* Objects */}
        <AICore />
        <EnergyRing radius={2.2} speed={0.35} color="#38bdf8" />
        <EnergyRing radius={2.7} speed={-0.25} color="#c084fc" opacity={0.4} />
        <Particles />

        {/* Atmosphere */}
        <fog attach="fog" args={["#030712", 9, 32]} />
      </Canvas>
    </div>
  );
}
