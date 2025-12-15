import React, { useEffect, useState, useRef, useMemo, Suspense } from "react";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows, Text } from "@react-three/drei";
import * as THREE from "three";
import Lenis from 'lenis';
import heroImg from './assets/resumesticker.png';
import { motion, AnimatePresence } from "framer-motion";

// --- 1. DATA ---
const skills = [
  "PROMPTS", "JAVA", "AI", "HTML", "RDBMS", "DESIGN", "SOCIAL", "PRODUCTS", 
  "MKTG", "AFFILIATE", "REACT", "VISION", "PYTHON", "TENSORFLOW", "THREE.JS", 
  "FIGMA", "SHOPIFY", "CSS", "BRANDING", "SQL"
];

const SkillText = ({ text, position, rotation }) => {
  return (
  <Text
    position={position}
    rotation={rotation}
    fontSize={0.10}
    color="#FFFFFF"
    font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"

    fontWeight="900"
    anchorX="center"
    anchorY="middle"
    letterSpacing={-0.02}
  >
    {text}
  </Text>
);
};

// --- 2. THE BLACK CRYSTAL (FIXED PHYSICS) ---
const BlackCrystal = () => {
  const meshRef = useRef();
  const groupRef = useRef();
  
  // PHYSICS STATE
  const isDragging = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 }); 

  // --- EVENTS ---
  const onPointerDown = (e) => {
    isDragging.current = true;
    previousMouse.current = { x: e.clientX, y: e.clientY };
    velocity.current = { x: 0, y: 0 }; // Kill momentum instantly on grab
    e.stopPropagation();
    document.body.style.cursor = 'grabbing';
  };

  const onPointerUp = () => {
    isDragging.current = false;
    document.body.style.cursor = 'none';
  };

  const onPointerMove = (e) => {
    if (isDragging.current && groupRef.current) {
      const deltaX = e.clientX - previousMouse.current.x;
      const deltaY = e.clientY - previousMouse.current.y;
      
      // DIRECT CONTROL: We simply ADD the distance to the rotation
      // 0.003 is the "Sensitivity". Lower = Slower/Heavier.
      const sensitivity = 0.003;
      
      groupRef.current.rotation.y += deltaX * sensitivity;
      groupRef.current.rotation.x += deltaY * sensitivity;

      // Store this speed for the inertia release later
      velocity.current = { 
        x: deltaY * sensitivity, 
        y: deltaX * sensitivity 
      };
      
      previousMouse.current = { x: e.clientX, y: e.clientY };
    }
  };

  // GLOBAL EVENT LISTENERS
  useEffect(() => {
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointermove', onPointerMove);
    return () => {
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // IF NOT DRAGGING: Apply Momentum & Friction
      if (!isDragging.current) {
        // Apply the last known velocity (The "Drift")
        groupRef.current.rotation.y += velocity.current.y;
        groupRef.current.rotation.x += velocity.current.x;

        // Friction: Slow it down (0.95 = slippery, 0.90 = heavy/muddy)
        const friction = 0.95;
        velocity.current.x *= friction;
        velocity.current.y *= friction;

        // Super slow idle spin just to keep it alive
       // IDLE SPIN (Rotates Up-to-Down)
groupRef.current.rotation.x += delta * 0.3;
      }
    }
  });

  // GEOMETRY
  const textData = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1, 0); 
    const pos = geo.attributes.position;
    const faces = [];
    // 2. Loop through every triangle (face)
    for (let i = 0; i < pos.count; i += 3) {
      const a = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
      const b = new THREE.Vector3(pos.getX(i+1), pos.getY(i+1), pos.getZ(i+1));
      const c = new THREE.Vector3(pos.getX(i+2), pos.getY(i+2), pos.getZ(i+2));

      // Calculate Center of the Face
      const center = new THREE.Vector3().addVectors(a, b).add(c).divideScalar(3);


      const dummy = new THREE.Object3D();
      dummy.position.copy(center);
      dummy.lookAt(0, 0, 0); 
      dummy.rotateY(Math.PI); 
      dummy.rotateZ(Math.PI); 
       // Push slightly outward (1.01) so it sits ON TOP of the black glass
      const textPos = center.multiplyScalar(1.01);


       faces.push({ pos: textPos, rot: dummy.rotation });
    }
    return skills.map((skill, i) => {
      const f = faces[i % faces.length];
      return { text: skill, pos: f.pos, rot: f.rot };
    });
  }, []);

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.6}>
      <group 
        ref={groupRef} 
        scale={3.5}
        onPointerDown={onPointerDown} 
      >
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1, 0]} /> 
          <meshPhysicalMaterial 
            color="#050505" roughness={0.1} metalness={0.9} 
            clearcoat={1} envMapIntensity={2} 
          />
        </mesh>
        {textData.map((item, index) => (
          <SkillText key={index}  text={item.text} 
            position={item.pos} 
            rotation={item.rot} />
        ))}
      </group>
    </Float>
  );
};

const Shapes = () => {
  return (
    <Canvas camera={{ position: [0, 0, 6] }} gl={{ antialias: true }}>
      <Suspense fallback={null}>
        <Environment preset="city" />
        <ContactShadows position={[0, -4.5, 0]} opacity={0.4} scale={40} blur={2.5} far={4.5} color="#000000" />
        <BlackCrystal />
      </Suspense>
    </Canvas>
  );
};

// --- 3. UI COMPONENTS (UPDATED FOR MOBILE RESPONSIVENESS) ---
const ScatterCard = ({ title, category, rotation, image, zIndex }) => {
  // Check if we are on mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
  <motion.div 
    drag={!isMobile} // Disable drag on mobile to allow scrolling
    dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
    whileHover={{ scale: 1.1, zIndex: 100, rotate: 0 }}
    // CSS: Relative on Mobile (Stacks), Absolute on Desktop (Scatters)
    className="relative md:absolute top-0 left-0 w-[300px] md:w-[350px] h-[450px] bg-white rounded-xl shadow-2xl overflow-hidden cursor-pointer md:cursor-grab md:active:cursor-grabbing border-4 border-white mb-8 md:mb-0"
    style={{ 
        zIndex: zIndex, 
        // Only random position on desktop
        x: isMobile ? 0 : Math.random() * 20, 
        y: isMobile ? 0 : Math.random() * 20 
    }}
    initial={{ rotate: isMobile ? 0 : rotation }}
  >
    <img src={image} alt={title} className="w-full h-full object-cover pointer-events-none" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
      <h3 className="text-2xl font-black uppercase text-white leading-none">{title}</h3>
      <span className="text-xs text-white/80 font-mono uppercase mt-2">{category}</span>
    </div>
  </motion.div>
  );
};

const Cursor = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  useEffect(() => {
    // Only verify cursor on desktop
    if(window.innerWidth > 768) {
        const move = (e) => setMouse({ x: e.clientX, y: e.clientY });
        window.addEventListener("mousemove", move);
        return () => window.removeEventListener("mousemove", move);
    }
  }, []);
  return (
    <motion.div
      className="hidden md:block fixed top-0 left-0 w-8 h-8 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
      animate={{ x: mouse.x - 16, y: mouse.y - 16 }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
    />
  );
};

// --- 5. ENVELOPE SECTION (SINGLE COLLAGE FLY-OUT) ---
const EnvelopeSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="relative w-full h-auto py-32 flex flex-col items-center justify-center overflow-visible bg-[#ffffff] z-50">
      
      {/* Background Title */}
      <h1 className="absolute top-10 text-center text-white-300 text-[10vw] font-black opacity-20 pointer-events-none uppercase tracking-tighter leading-none">
        About Me 
      </h1>

      <div className="relative w-[300px] h-[200px] flex items-center justify-center z-10">
        
        {/* --- THE COLLAGE EXPLOSION --- */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ scale: 0.8, y: 100, opacity: 0, rotate: 5 }}
              animate={{ scale: 1, y: -200, opacity: 1, rotate: -2 }} 
              // FIX 2: The Luxury Curve (Bezier). Starts fast, lands soft.
              transition={{ 
                duration: 1.6, 
                ease: [0.22, 1, 0.36, 1] 
              }}
              drag
              // This container holds your single collage image
              className="absolute w-[1000px] cursor-grab active:cursor-grabbing z-50 -left-[75px] md:-left-[75px]" 
            >
              <img 
                src={heroImg} 
                alt="My Resume Collage" 
                className="w-[800px]  h-[800px] object-contain drop-shadow-2xl" 
                style={{ pointerEvents: 'none' }} // Prevents image highlighting while dragging
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- THE ENVELOPE --- */}
        <motion.div 
            // The "Float" animation (Y: -10 to 10) happens infinitely
            animate={
                isOpen 
                ? { y: 200, opacity: 0, pointerEvents: 'none' } 
                : { y: [0, -15, 0], rotateX: [0, 5, 0] }
            }
            transition={
                isOpen 
                ? { duration: 1.2, ease: [0.22, 1, 0.36, 1] } 
                : { repeat: Infinity, duration: 6, ease: "easeInOut" } // Slow luxury float
            }
            className="flex flex-col items-center cursor-pointer group relative drop-shadow-2xl"
            style={{ perspective: 1000 }} // Adds 3D depth to the tilt
            onClick={() => setIsOpen(true)}
        >
            <div className="w-[320px] h-[200px] bg-[#d4d4d4] shadow-2xl relative flex items-center justify-center border-t-2 border-white/50">
                <div className="text-[#a3a3a3] font-serif italic text-xl"></div>
                <div className="absolute w-16 h-16 bg-[#8B0000] rounded-full shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-white font-serif font-bold text-xl">N</span>
                </div>
            </div>
            {/* Flap */}
            <div className="w-0 h-0 border-l-[160px] border-l-transparent border-r-[160px] border-r-transparent border-t-[100px] border-t-[#c0c0c0] absolute top-0"></div>
        </motion.div>

      </div>
    </section>
  );
};

// --- 4. MAIN APP ---
const App = () => {
  // HEAVY LENIS SCROLL
  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.0, 
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smooth: true,
      wheelMultiplier: 1.5,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#EBEBEB] text-[#1C1C1C] font-sans cursor-auto md:cursor-none selection:bg-[#1C1C1C] selection:text-white">
      <Cursor />
      

      {/* HERO */}
      <section className="relative w-full h-[95vh] px-6 md:px-12 py-8 flex flex-col justify-between">
        <nav className="flex justify-between items-center z-50">
          {/* --- THE AESTHETIC FONT UPDATE --- */}
          <div 
            className="text-5xl md:text-7xl italic tracking-tight"
            style={{ fontFamily: '"DM Serif Display", serif', fontWeight: 400 }}
          >
            Naiya Dave
          </div>
          <div className="uppercase font-bold tracking-widest text-xs">Available for work</div>
        </nav>

<div className="grid grid-cols-1 md:grid-cols-2 h-full items-center relative">
          <div className="z-10 relative">
            <h1 className="text-[15vw] md:text-[10vw] leading-[0.85] font-black uppercase tracking-tighter text-[#1C1C1C]">
              Creative<br />Dev.
            </h1>

            <p className="mt-8 text-lg font-medium max-w-sm leading-relaxed text-[#5C5C5C]">
              AI Researcher & Creative Strategist.
            </p>
          </div>
          
          {/* THE BLACK CRYSTAL */}
          <div className="absolute md:relative top-0 right-0 w-full h-full opacity-100 cursor-grab active:cursor-grabbing">
              <Shapes /> 
          </div>
        </div>
      </section>

      


      {/* MARQUEE */}
      <div className="w-full overflow-hidden my-24 opacity-20 pointer-events-none">
        <motion.div 
          className="flex whitespace-nowrap"
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
        >
          {[...Array(4)].map((_, i) => (
            <h1 key={i} className="text-9xl font-black uppercase tracking-tighter mx-4 text-transparent" style={{ WebkitTextStroke: "2px #1C1C1C" }}>
              CREATIVE • STRATEGY • VISION • DESIGN • 
            </h1>
          ))}
        </motion.div>
      </div>

      {/* WORK SECTION */}
      <div className="text-center mb-12 md:mb-24 z-10">
        <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter">Selected<br/>Work</h2>
        <p className="mt-4 text-xl font-serif italic text-gray-500">
            <span className="md:hidden">( Scroll to explore )</span>
            <span className="hidden md:block">( Drag the cards to explore )</span>
        </p>
      </div>

      {/* MODIFIED: Flex-col for mobile stacking, min-h auto on mobile */}
      <section className="relative w-full min-h-auto md:min-h-[120vh] py-12 md:py-24 px-6 md:px-12 flex flex-col items-center">
        <div className="relative w-full max-w-5xl h-auto md:h-[800px] flex flex-col md:block justify-center items-center gap-8">
          <ScatterCard title="Decent Restaurant" category="Web Design" rotation={-6} image="/Screenshot_2025-12-16-00-07-17-698_com.android.chrome-edit.jpg" zIndex={1} />
          <ScatterCard title="Digital Store" category="Shopify" rotation={-12} image="https://i.pinimg.com/736x/7a/f9/f8/7af9f8b2e5bd6efd5fda10ef99ebb127.jpg" zIndex={3} />
          <ScatterCard title="AI Vision" category="Python" rotation={4} image="https://i.pinimg.com/736x/95/a1/99/95a1999d18f033934c303a6972d21c7c.jpg" zIndex={2} />
          <ScatterCard 
            title="Digit Recognition" 
            category="Deep Learning" 
            rotation={4} 
            image="https://i.pinimg.com/736x/ed/10/53/ed10532bb3eaa7bbd80d6d3bda4207f2.jpg"
            zIndex={4} 
          />
        </div>
      </section>

      <EnvelopeSection />

      {/* FOOTER (FIXED LAYOUT) */}
      <footer className="w-full bg-[#1C1C1C] text-[#EBEBEB] py-20 px-6 md:px-12 flex flex-col justify-between">
        
        {/* TOP ROW: Header + Contact Info */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
            <h2 className="text-[12vw] leading-[0.8] font-bold uppercase mb-8 md:mb-0">Let's Talk</h2>

            <div className="flex flex-col items-start md:items-end gap-2">
                <a href="mailto:davekusum827@email.com" className="text-2xl md:text-3xl font-serif italic hover:text-[#FF4D22] transition-colors">
                    davekusum827@email.com
                </a>
                
                {/* Live Status & Location */}
                <div className="flex flex-col items-start md:items-end opacity-50 font-mono text-xs uppercase tracking-widest mt-2 gap-1">
                    <p>Mahesana, India</p>
                    <div className="flex items-center gap-2 text-green-400">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Available for Work
                    </div>
                </div>
            </div>
        </div>

        {/* BOTTOM ROW: Links + Copyright */}
        <div className="w-full border-t border-[#333] pt-8 flex flex-col md:flex-row justify-between items-center text-sm font-bold uppercase tracking-widest gap-4 md:gap-0">
            <div className="flex gap-6 text-xl md:text-sm">
                <a href="https://www.linkedin.com/in/naiya-dave-9265a330b/" className="hover:text-orange-500">LinkedIn</a>
                <a href="https://github.com/ninikim89" className="hover:text-orange-500">GitHub</a>
                <a href="https://www.instagram.com/naiyawq/" className="hover:text-orange-500">Instagram</a>
            </div>
            <span className="opacity-40 font-mono text-xs">© 2025 Naiya Dave</span>
        </div>

      </footer>
    </div>
  );
};

export default App;