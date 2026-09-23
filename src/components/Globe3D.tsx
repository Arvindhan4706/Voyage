"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Html } from "@react-three/drei";
import * as THREE from "three";

function Earth({ lat, lon, destinationName }: { lat: number; lon: number; destinationName: string }) {
  const earthRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (earthRef.current) {
      // Slowly rotate the Earth
      earthRef.current.rotation.y += 0.002;
    }
  });

  // Calculate pin position on a sphere of radius 2
  const R = 2;
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(R * Math.sin(phi) * Math.cos(theta));
  const z = (R * Math.sin(phi) * Math.sin(theta));
  const y = (R * Math.cos(phi));

  return (
    <group ref={earthRef}>
      {/* The Globe */}
      <Sphere args={[R, 64, 64]}>
        <meshStandardMaterial 
          color="#0e172a" 
          emissive="#06b6d4" 
          emissiveIntensity={0.2}
          wireframe={true} 
          transparent 
          opacity={0.6}
        />
      </Sphere>

      {/* The Pin */}
      <group position={[x, y, z]}>
        {/* Glow effect */}
        <Sphere args={[0.08, 16, 16]}>
          <meshBasicMaterial color="#ef4444" />
        </Sphere>
        
        {/* HTML Label */}
        <Html distanceFactor={10} center>
          <div className="px-3 py-1 bg-black/80 backdrop-blur-md border border-white/20 text-white text-sm rounded-full whitespace-nowrap pointer-events-none transform -translate-y-6 shadow-[0_0_15px_rgba(239,68,68,0.5)] font-bold">
            📍 {destinationName}
          </div>
        </Html>
      </group>
    </group>
  );
}

export default function Globe3D({ lat, lon, destinationName }: { lat: number; lon: number; destinationName: string }) {
  return (
    <div className="w-full h-[400px] relative rounded-3xl overflow-hidden border border-cyan-500/30 bg-gradient-to-b from-slate-900 to-black shadow-[0_0_30px_rgba(6,182,212,0.1)]">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
        <Earth lat={lat} lon={lon} destinationName={destinationName} />
      </Canvas>
      <div className="absolute top-4 left-4 text-xs font-bold text-cyan-500 uppercase tracking-widest flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        Live GPS Tracking
      </div>
    </div>
  );
}
