import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text, Cylinder } from "@react-three/drei";

const Sticker = () => {
  const meshRef = useRef();

  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * 0.5; // Rotate like a coin/CD
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.1;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
        {/* The Badge Disc (Cylinder) */}
        <Cylinder args={[2.5, 2.5, 0.2, 64]}>
          <meshStandardMaterial color="#1C1C1C" />
        </Cylinder>
        
        {/* The Text Ring on the Badge */}
        <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.11, 0]}>
           <Text
            position={[0, 0, 0]}
            fontSize={0.6}
            color="#EBEBEB"
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
            anchorX="center"
            anchorY="middle"
          >
            NAIYA
          </Text>
           <Text
            position={[0, -1, 0]}
            fontSize={0.3}
            color="#EBEBEB"
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
            anchorX="center"
            anchorY="middle"
          >
            EST. 2026
          </Text>
        </group>
      </group>
    </Float>
  );
};

const BadgeCanvas = () => {
  return (
    <Canvas camera={{ position: [0, 0, 8] }}>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <Sticker />
    </Canvas>
  );
};

export default BadgeCanvas;