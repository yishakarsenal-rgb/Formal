"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Torus, Octahedron, Icosahedron, Box } from "@react-three/drei";
import * as THREE from "three";

function FloatingTorus({
  position,
  scale,
  color,
  speed,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
  speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * speed * 0.4;
    ref.current.rotation.y = state.clock.elapsedTime * speed * 0.6;
  });
  return (
    <Float speed={speed * 0.8} rotationIntensity={0.5} floatIntensity={0.6}>
      <Torus
        ref={ref}
        args={[1, 0.3, 16, 60]}
        position={position}
        scale={scale}
      >
        <meshStandardMaterial
          color={color}
          wireframe
          transparent
          opacity={0.18}
        />
      </Torus>
    </Float>
  );
}

function FloatingOctahedron({
  position,
  scale,
  color,
  speed,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
  speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * speed * 0.5;
    ref.current.rotation.z = state.clock.elapsedTime * speed * 0.3;
  });
  return (
    <Float speed={speed} rotationIntensity={0.8} floatIntensity={0.5}>
      <Octahedron ref={ref} args={[1]} position={position} scale={scale}>
        <meshStandardMaterial
          color={color}
          wireframe
          transparent
          opacity={0.15}
        />
      </Octahedron>
    </Float>
  );
}

function FloatingIcosahedron({
  position,
  scale,
  color,
  speed,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
  speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * speed * 0.4;
    ref.current.rotation.z = state.clock.elapsedTime * speed * 0.2;
  });
  return (
    <Float speed={speed * 1.2} rotationIntensity={0.6} floatIntensity={0.7}>
      <Icosahedron ref={ref} args={[1, 0]} position={position} scale={scale}>
        <meshStandardMaterial
          color={color}
          wireframe
          transparent
          opacity={0.12}
        />
      </Icosahedron>
    </Float>
  );
}

function FloatingBox({
  position,
  scale,
  color,
  speed,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
  speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
    ref.current.rotation.y = state.clock.elapsedTime * speed * 0.5;
  });
  return (
    <Float speed={speed * 0.9} rotationIntensity={0.4} floatIntensity={0.4}>
      <Box ref={ref} args={[1, 1, 1]} position={position} scale={scale}>
        <meshStandardMaterial
          color={color}
          wireframe
          transparent
          opacity={0.14}
        />
      </Box>
    </Float>
  );
}

function ParticleField() {
  const count = 80;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 28;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.015;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#1d4ed8" transparent opacity={0.45} />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <pointLight position={[-5, -5, -5]} intensity={0.4} color="#0ea5e9" />

      <ParticleField />

      {/* left side shapes */}
      <FloatingTorus
        position={[-9, 3, -4]}
        scale={1.2}
        color="#1d4ed8"
        speed={1.2}
      />
      <FloatingOctahedron
        position={[-7, -3, -3]}
        scale={0.9}
        color="#0369a1"
        speed={0.9}
      />
      <FloatingIcosahedron
        position={[-11, 0, -5]}
        scale={1.0}
        color="#0284c7"
        speed={1.1}
      />
      <FloatingBox
        position={[-6, 4, -5]}
        scale={0.7}
        color="#0ea5e9"
        speed={0.8}
      />

      {/* right side shapes */}
      <FloatingTorus
        position={[9, -3, -4]}
        scale={1.1}
        color="#2563eb"
        speed={1.0}
      />
      <FloatingOctahedron
        position={[7, 4, -3]}
        scale={1.0}
        color="#1e40af"
        speed={1.3}
      />
      <FloatingIcosahedron
        position={[11, -1, -5]}
        scale={0.8}
        color="#38bdf8"
        speed={0.7}
      />
      <FloatingBox
        position={[6, -5, -4]}
        scale={0.9}
        color="#7dd3fc"
        speed={1.1}
      />

      {/* top/bottom accent shapes */}
      <FloatingTorus
        position={[0, 7, -6]}
        scale={0.7}
        color="#1d4ed8"
        speed={0.6}
      />
      <FloatingOctahedron
        position={[3, -6, -5]}
        scale={0.6}
        color="#0c4a6e"
        speed={0.8}
      />
      <FloatingIcosahedron
        position={[-3, 6, -6]}
        scale={0.5}
        color="#3b82f6"
        speed={0.9}
      />
    </>
  );
}

export function ThreeDBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
