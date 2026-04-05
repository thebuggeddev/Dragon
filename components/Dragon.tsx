'use client';

import React, { useMemo, useRef, useLayoutEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const generateVoxels = () => {
  const voxels: Record<string, number[][]> = {
    beige: [], blue: [], darkBlue: [], teal: [], red: [], white: [], yellow: [], black: []
  };

  function fillSym(color: string, xEnd: number, yStart: number, yEnd: number, zStart: number, zEnd: number) {
    for (let x = 0; x <= xEnd; x++) {
      for (let y = yStart; y <= yEnd; y++) {
        for (let z = zStart; z <= zEnd; z++) {
          voxels[color].push([x, y, z]);
          if (x !== 0) voxels[color].push([-x, y, z]);
        }
      }
    }
  }

  function fillOffsetSym(color: string, x1: number, x2: number, y1: number, y2: number, z1: number, z2: number) {
    for (let x = x1; x <= x2; x++) {
      for (let y = y1; y <= y2; y++) {
        for (let z = z1; z <= z2; z++) {
          voxels[color].push([x, y, z]);
          if (x !== 0) voxels[color].push([-x, y, z]);
        }
      }
    }
  }

  // Body
  fillSym('blue', 3, 5, 12, -6, 4);
  fillSym('blue', 4, 6, 14, 0, 5);
  fillSym('blue', 3, 5, 12, -4, -1);
  fillSym('blue', 4, 5, 13, -9, -5);
  fillSym('blue', 5, 7, 13, 1, 4); // Chest width

  // Underbelly
  fillSym('teal', 2, 4, 5, 0, 5);
  fillSym('teal', 2, 3, 4, -4, -1);
  fillSym('teal', 2, 4, 4, -9, -5);

  // Neck
  fillSym('blue', 2, 12, 16, 4, 7);
  fillSym('blue', 2, 15, 18, 6, 9);
  fillSym('blue', 3, 13, 15, 5, 8); // Neck width
  fillSym('teal', 1, 11, 15, 5, 8);
  fillSym('teal', 1, 14, 17, 7, 10);

  // Head Base
  fillSym('beige', 3, 19, 23, 7, 12);
  fillSym('beige', 2, 19, 21, 13, 17);
  fillSym('beige', 2, 18, 20, 18, 19);
  fillOffsetSym('beige', 4, 5, 17, 19, 11, 14); // Cheek
  fillOffsetSym('beige', 4, 5, 21, 22, 9, 11); // Eye ridge

  // Horns
  fillOffsetSym('beige', 2, 3, 23, 24, 5, 8);
  fillOffsetSym('beige', 3, 4, 24, 25, 2, 5);
  fillOffsetSym('beige', 4, 5, 25, 26, -1, 2);
  fillOffsetSym('beige', 5, 5, 26, 27, -3, -2);

  // Side spikes
  fillOffsetSym('beige', 4, 5, 19, 20, 8, 10);

  // Eye
  fillOffsetSym('yellow', 3, 3, 20, 21, 10, 11);
  fillOffsetSym('black', 3, 3, 20, 20, 11, 11);

  // Lower Jaw
  fillSym('blue', 2, 15, 16, 10, 15);
  fillSym('blue', 2, 16, 17, 16, 17);
  fillSym('blue', 3, 15, 16, 11, 14); // Jaw width
  fillSym('teal', 1, 14, 14, 10, 15);
  fillSym('beige', 1, 13, 14, 14, 16);

  // Mouth Interior
  fillSym('red', 1, 17, 18, 11, 16);

  // Teeth
  fillOffsetSym('white', 2, 2, 18, 18, 13, 17);
  fillOffsetSym('white', 2, 2, 17, 17, 13, 16);
  fillOffsetSym('white', 1, 2, 17, 18, 17, 17);

  // Front Legs
  fillOffsetSym('blue', 4, 6, 8, 12, 1, 5);
  fillOffsetSym('darkBlue', 4, 6, 4, 7, 1, 4);
  fillOffsetSym('darkBlue', 4, 6, 0, 3, 2, 5);
  fillOffsetSym('darkBlue', 4, 7, -1, 0, 3, 7);
  fillOffsetSym('beige', 4, 4, -1, -1, 8, 9);
  fillOffsetSym('beige', 6, 6, -1, -1, 8, 9);
  fillOffsetSym('beige', 7, 7, 5, 7, 0, 1);

  // Back Legs
  fillOffsetSym('blue', 4, 7, 7, 13, -9, -4);
  fillOffsetSym('blue', 5, 8, 8, 12, -8, -5); // Thigh width
  fillOffsetSym('darkBlue', 4, 6, 4, 6, -10, -6);
  fillOffsetSym('darkBlue', 4, 6, 1, 3, -8, -5);
  fillOffsetSym('darkBlue', 4, 7, -1, 0, -7, -3);
  fillOffsetSym('beige', 4, 4, -1, -1, -2, -1);
  fillOffsetSym('beige', 6, 6, -1, -1, -2, -1);
  fillOffsetSym('beige', 8, 8, 9, 11, -8, -6);

  // Tail
  fillSym('blue', 3, 9, 12, -12, -9);
  fillSym('blue', 2, 7, 10, -16, -12);
  fillSym('blue', 2, 8, 11, -15, -13); // Tail width
  fillSym('blue', 1, 5, 8, -20, -16);
  fillSym('blue', 1, 3, 5, -24, -20);
  fillSym('beige', 0, 2, 3, -27, -24);

  fillSym('teal', 1, 8, 8, -12, -9);
  fillSym('teal', 1, 6, 6, -16, -12);
  fillSym('teal', 0, 4, 4, -20, -16);
  fillSym('teal', 0, 2, 2, -24, -20);

  fillSym('beige', 0, 13, 14, -11, -9);
  fillSym('beige', 0, 11, 12, -15, -13);
  fillSym('beige', 0, 9, 10, -19, -17);

  // Back spikes
  fillSym('beige', 0, 15, 16, 0, 2);
  fillSym('beige', 0, 14, 15, -4, -2);
  fillSym('beige', 0, 13, 14, -8, -6);

  // Wings (Stepped)
  fillOffsetSym('beige', 3, 4, 14, 15, -2, 2);
  fillOffsetSym('beige', 5, 6, 15, 16, -3, 1);
  fillOffsetSym('beige', 7, 8, 16, 17, -4, 0);
  fillOffsetSym('beige', 9, 10, 17, 18, -5, -1);
  fillOffsetSym('beige', 11, 12, 18, 19, -6, -2);
  fillOffsetSym('beige', 13, 14, 19, 20, -7, -3);
  fillOffsetSym('beige', 15, 16, 20, 21, -8, -4);
  fillOffsetSym('beige', 17, 18, 21, 22, -9, -5);

  fillOffsetSym('beige', 19, 20, 20, 21, -11, -7);
  fillOffsetSym('beige', 21, 22, 19, 20, -13, -9);

  fillOffsetSym('beige', 17, 18, 18, 19, -11, -7);
  fillOffsetSym('beige', 19, 20, 16, 17, -13, -9);

  fillOffsetSym('beige', 15, 16, 16, 17, -10, -6);
  fillOffsetSym('beige', 17, 18, 14, 15, -12, -8);

  fillOffsetSym('teal', 5, 8, 14, 15, -5, -1);
  fillOffsetSym('blue', 9, 12, 15, 16, -7, -3);
  fillOffsetSym('teal', 13, 16, 16, 17, -9, -5);
  fillOffsetSym('blue', 17, 20, 17, 18, -11, -7);

  return voxels;
};

const playBreakSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // Create a few different noise bursts for a "crumbling" effect
    for (let j = 0; j < 6; j++) {
      setTimeout(() => {
        const bufferSize = ctx.sampleRate * (Math.random() * 0.15 + 0.05); 
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = Math.random() * 1000 + 300;
        filter.Q.value = 0.5;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + buffer.duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start();
      }, Math.random() * 250);
    }
  } catch (e) {
    console.error("Audio play failed", e);
  }
};

const VoxelMesh = ({ positions, color, isBreaking }: { positions: number[][], color: string, isBreaking: boolean }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempPos = useMemo(() => new THREE.Vector3(), []);
  const tempQuat = useMemo(() => new THREE.Quaternion(), []);
  const targetQuat = useMemo(() => new THREE.Quaternion(), []);

  const [physicsData] = useState(() => {
    return positions.map(pos => {
      const initialPos = new THREE.Vector3(pos[0], pos[1], pos[2]);
      return {
        initialPos,
        currentPos: initialPos.clone(),
        velocity: new THREE.Vector3(),
        rotation: new THREE.Euler(),
        rotVelocity: new THREE.Euler(),
        floorY: -2 + (Math.random() * 0.5) // Static random floor height per voxel
      };
    });
  });

  useLayoutEffect(() => {
    if (isBreaking) {
      physicsData.forEach(data => {
        const dir = new THREE.Vector3(data.initialPos.x, data.initialPos.y - 5, data.initialPos.z).normalize();
        dir.x += (Math.random() - 0.5) * 2.0; // Spread out more to prevent merging
        dir.z += (Math.random() - 0.5) * 2.0;
        dir.normalize();
        if (dir.lengthSq() === 0) dir.set(0, 1, 0);
        
        const speed = Math.random() * 60 + 30; // Faster explosion
        data.velocity.copy(dir).multiplyScalar(speed);
        data.velocity.y += Math.random() * 30 + 15;
        data.rotVelocity.set(Math.random() * 0.8 - 0.4, Math.random() * 0.8 - 0.4, Math.random() * 0.8 - 0.4);
      });
    }
  }, [isBreaking, physicsData]);

  useGSAP(() => {
    if (materialRef.current) {
      const newColor = new THREE.Color(color);
      gsap.to(materialRef.current.color, {
        r: newColor.r,
        g: newColor.g,
        b: newColor.b,
        duration: 1.5,
        ease: 'power2.inOut'
      });
    }
  }, [color]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const dt = delta;

    if (isBreaking) {
      physicsData.forEach((data, i) => {
        data.velocity.y -= 80 * dt; // Stronger Gravity
        data.velocity.x *= (1 - 0.5 * dt); // Air resistance
        data.velocity.z *= (1 - 0.5 * dt);
        
        data.currentPos.addScaledVector(data.velocity, dt);
        
        // Floor collision with static random height variation to prevent z-fighting
        if (data.currentPos.y < data.floorY) {
          data.currentPos.y = data.floorY;
          data.velocity.y *= -0.2; // Stronger bounce dampening
          data.velocity.x *= 0.2; // Stronger friction
          data.velocity.z *= 0.2;
          data.rotVelocity.x *= 0.5;
          data.rotVelocity.y *= 0.5;
          data.rotVelocity.z *= 0.5;
          
          // Kill micro-bounces completely
          if (Math.abs(data.velocity.y) < 5) {
            data.velocity.y = 0;
            data.rotVelocity.set(0, 0, 0);
          }
        }

        data.rotation.x += data.rotVelocity.x * dt * 60;
        data.rotation.y += data.rotVelocity.y * dt * 60;
        data.rotation.z += data.rotVelocity.z * dt * 60;

        dummy.position.copy(data.currentPos);
        dummy.rotation.copy(data.rotation);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    } else {
      let needsUpdate = false;

      physicsData.forEach((data, i) => {
        // Calculate flying animation offsets
        let targetY = data.initialPos.y;
        let targetX = data.initialPos.x;
        
        // Wing flapping (isolated to wing bounding box)
        if (Math.abs(data.initialPos.x) >= 3 && data.initialPos.y >= 14 && data.initialPos.z <= 2) {
          const wingFactor = Math.abs(data.initialPos.x) - 2;
          targetY += Math.sin(t * 8) * wingFactor * 0.4;
        }
        
        // Tail swishing
        if (data.initialPos.z < -8 && Math.abs(data.initialPos.x) < 4) {
          const tailFactor = Math.abs(data.initialPos.z + 8);
          targetX += Math.sin(t * 4 - tailFactor * 0.2) * tailFactor * 0.3;
        }

        // Head bobbing
        if (data.initialPos.z > 12) {
          const headFactor = data.initialPos.z - 12;
          targetY += Math.sin(t * 4) * headFactor * 0.1;
        }

        tempPos.set(targetX, targetY, data.initialPos.z);

        const dist = data.currentPos.distanceTo(tempPos);
        tempQuat.setFromEuler(data.rotation);
        const angle = tempQuat.angleTo(targetQuat);

        if (dist < 0.5 && angle < 0.5) {
          // Snap perfectly to animation to prevent lag-induced intersection and flickering
          data.currentPos.copy(tempPos);
          data.rotation.set(0, 0, 0);
        } else {
          // Fast and snappy reassembly
          data.currentPos.lerp(tempPos, 0.15);
          tempQuat.slerp(targetQuat, 0.15);
          data.rotation.setFromQuaternion(tempQuat);
        }

        dummy.position.copy(data.currentPos);
        dummy.rotation.copy(data.rotation);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
        needsUpdate = true;
      });
      if (needsUpdate) {
        meshRef.current.instanceMatrix.needsUpdate = true;
      }
    }
  });

  useLayoutEffect(() => {
    if (meshRef.current) {
      positions.forEach((pos, i) => {
        dummy.position.set(pos[0], pos[1], pos[2]);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [positions, dummy]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, positions.length]} castShadow receiveShadow>
      <boxGeometry args={[0.98, 0.98, 0.98]} />
      <meshStandardMaterial 
        ref={materialRef} 
        color={color} 
        roughness={0.7} 
        metalness={0.1} 
      />
    </instancedMesh>
  );
};

export default function Dragon({ theme }: { theme: any }) {
  const groupRef = useRef<THREE.Group>(null);
  const voxels = useMemo(() => generateVoxels(), []);
  
  const [clickCount, setClickCount] = useState(0);
  const [isBreaking, setIsBreaking] = useState(false);

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (isBreaking) return;
    
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (groupRef.current) {
      gsap.fromTo(groupRef.current.position, 
        { x: (Math.random() - 0.5) * 0.5, y: (Math.random() - 0.5) * 0.5 },
        { x: 0, y: 0, duration: 0.2, ease: 'elastic.out(1, 0.3)' }
      );
    }

    if (newCount >= 3) {
      setIsBreaking(true);
      setClickCount(0);
      playBreakSound();
      
      setTimeout(() => {
        setIsBreaking(false);
      }, 6000); // Increased wait time to ensure voxels settle completely
    }
  };

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    
    if (!isBreaking) {
      groupRef.current.position.y = Math.sin(t * 2) * 0.1; 
      const scale = 0.1 + Math.sin(t * 3) * 0.001;
      groupRef.current.scale.set(scale, scale, scale);

      const mouseX = (state.mouse.x * Math.PI) / 8;
      const mouseY = (state.mouse.y * Math.PI) / 8;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouseX, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouseY, 0.05);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[0.1, 0.1, 0.1]} onClick={handleClick}>
      {Object.entries(voxels).map(([colorName, positions]) => {
        if (positions.length === 0) return null;
        return (
          <VoxelMesh
            key={colorName}
            positions={positions}
            color={theme.colors[colorName]}
            isBreaking={isBreaking}
          />
        );
      })}
    </group>
  );
}
