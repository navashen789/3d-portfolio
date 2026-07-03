import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Scene() {
  const groupRef = useRef();

  // Slow rotation for background ambient effect
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
      groupRef.current.rotation.x += 0.0005;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, -5]} intensity={1} />

      {/* Abstract 3D floating particles in the background */}
      <group ref={groupRef} position={[0, 0, -2]}>
        {[...Array(50)].map((_, i) => (
          <mesh 
            key={i} 
            position={[
              (Math.random() - 0.5) * 15, 
              (Math.random() - 0.5) * 15, 
              (Math.random() - 0.5) * 15
            ]}
          >
            <octahedronGeometry args={[0.1]} />
            <meshStandardMaterial color="#3b82f6" wireframe opacity={0.3} transparent />
          </mesh>
        ))}
      </group>
    </>
  );
}