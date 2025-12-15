import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows } from "@react-three/drei";

const ChromeCrystal = () => {
  const meshRef = useRef();

  // This makes it slowly rotate
  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.4;
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={meshRef} scale={3.2}>
        {/* The Shape: Icosahedron (Geometric Crystal) */}
        {/* args: [radius, detail] -> detail=0 makes it sharp/low-poly */}
        <icosahedronGeometry args={[1, 0]} />
        
        {/* The Material: Liquid Chrome */}
        <meshPhysicalMaterial 
          color="#ffffff"
          roughness={0}       // Perfectly smooth
          metalness={1}       // 100% Metal
          envMapIntensity={1} // Bright reflections
        />
      </mesh>
    </Float>
  );
};

const Shapes = () => {
  return (
    <Canvas camera={{ position: [0, 0, 6] }} gl={{ antialias: true }}>
      {/* Studio Lighting Environment */}
      <Environment preset="studio" />
      
      {/* Soft shadow underneath to make it feel grounded */}
      <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
      
      <ChromeCrystal />
    </Canvas>
  );
};

export default Shapes;