'use client';

import { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Sparkles } from '@react-three/drei';
import Dragon from '@/components/Dragon';
import { dragonThemes } from '@/lib/themes';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Home() {
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const bgRef = useRef<HTMLDivElement>(null);
  
  const theme = dragonThemes[currentThemeIndex];

  useGSAP(() => {
    if (bgRef.current) {
      gsap.to(bgRef.current, {
        background: `linear-gradient(to bottom, ${theme.bgFrom}, ${theme.bgTo})`,
        duration: 1.5,
        ease: 'power2.inOut'
      });
    }
  }, [theme]);

  return (
    <main ref={bgRef} className="w-full h-screen overflow-hidden relative" style={{ background: `linear-gradient(to bottom, ${dragonThemes[0].bgFrom}, ${dragonThemes[0].bgTo})` }}>
      <Canvas shadows camera={{ position: [4, 2, 6], fov: 45 }}>
        <fog attach="fog" args={[theme.bgTo, 5, 25]} />
        <ambientLight intensity={0.6} />
        
        {/* Main Directional Light */}
        <directionalLight
          position={[-5, 5, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize={2048}
          shadow-bias={-0.0001}
        />
        
        {/* Fill Light */}
        <directionalLight position={[5, 3, -5]} intensity={0.4} />
        
        {/* Rim Light */}
        <directionalLight position={[0, 5, -5]} intensity={0.5} />

        <Dragon theme={theme} />
        
        {/* Snow Particles */}
        <Sparkles 
          count={2000} 
          scale={30} 
          size={2} 
          speed={0.4} 
          opacity={0.6} 
          color="#ffffff" 
          position={[0, 5, 0]}
        />

        {/* Snowy Terrain */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.21, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.9} metalness={0.1} />
        </mesh>

        <ContactShadows 
          position={[0, -0.2, 0]} 
          opacity={0.5} 
          scale={10} 
          blur={2} 
          far={4} 
        />

        <OrbitControls
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2 + 0.1}
          minDistance={3}
          maxDistance={15}
          target={[0, 1, 0]}
        />
      </Canvas>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-10">
        {dragonThemes.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setCurrentThemeIndex(i)}
            className={`w-12 h-12 rounded-full border-4 transition-all duration-300 hover:scale-110 ${currentThemeIndex === i ? 'scale-110 shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'shadow-lg'}`}
            style={{
              background: `linear-gradient(135deg, ${t.colors.blue} 50%, ${t.colors.teal} 50%)`,
              borderColor: currentThemeIndex === i ? 'white' : t.colors.darkBlue,
            }}
          />
        ))}
      </div>
    </main>
  );
}
