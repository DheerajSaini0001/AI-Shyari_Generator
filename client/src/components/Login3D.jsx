import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, PerspectiveCamera, Stars } from "@react-three/drei";
import * as THREE from "three";

/* ---------------- AI CORE ---------------- */

function AICore() {
  const core = useRef();
  const glow = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    core.current.rotation.x = t * 0.2;
    core.current.rotation.y = t * 0.35;

    const pulse = 1 + Math.sin(t * 2) * 0.06;
    core.current.scale.setScalar(pulse);
    glow.current.scale.setScalar(pulse * 1.25);
  });

  return (
    <Float speed={2} floatIntensity={1.8}>
      {/* Solid Core */}
      <mesh ref={core}>
        <icosahedronGeometry args={[1.4, 2]} />
        <meshPhysicalMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={0.8}
          roughness={0.15}
          metalness={0.9}
          transmission={0.6}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Glow Shell */}
      <mesh ref={glow}>
        <icosahedronGeometry args={[1.8, 1]} />
        <meshBasicMaterial
          color="#00e5ff"
          transparent
          opacity={0.15}
          wireframe
        />
      </mesh>
    </Float>
  );
}

/* ---------------- ENERGY RINGS ---------------- */

function EnergyRing({ radius, speed, color }) {
  const ring = useRef();

  useFrame(({ clock }) => {
    ring.current.rotation.z = clock.getElapsedTime() * speed;
  });

  return (
    <mesh ref={ring}>
      <torusGeometry args={[radius, 0.03, 16, 100]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

/* ---------------- PARTICLES ---------------- */

function Particles() {
  const ref = useRef();
  const count = 1200;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      arr[i] = (Math.random() - 0.5) * 35;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.getElapsedTime() * 0.015;
    ref.current.rotation.x = clock.getElapsedTime() * 0.01;
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
        size={0.03}
        color="#8b5cf6"
        opacity={0.45}
        transparent
        sizeAttenuation
      />
    </points>
  );
}

/* ---------------- PARALLAX CAMERA ---------------- */

function ParallaxCamera() {
  const { camera, mouse } = useThree();

  useFrame(() => {
    camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.03;
    camera.position.y += (mouse.y * 0.5 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ---------------- MAIN SCENE ---------------- */

export default function FuturisticBackground() {
  return (
    <div className="absolute inset-0 -z-10 bg-black">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} />
        <ParallaxCamera />

        {/* Lights */}
        <ambientLight intensity={0.35} />
        <pointLight position={[5, 5, 5]} intensity={1.8} color="#00e5ff" />
        <pointLight position={[-5, -5, -5]} intensity={1.2} color="#8b5cf6" />

        {/* Space */}
        <Stars radius={150} depth={60} count={8000} factor={4} fade />

        {/* Objects */}
        <AICore />
        <EnergyRing radius={2.2} speed={0.6} color="#00e5ff" />
        <EnergyRing radius={2.6} speed={-0.4} color="#8b5cf6" />
        <Particles />

        {/* Atmosphere */}
        <fog attach="fog" args={["#050505", 8, 30]} />
      </Canvas>
    </div>
  );
}
