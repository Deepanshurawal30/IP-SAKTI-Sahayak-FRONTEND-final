import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

/**
 * A very small, cheap particle field meant to read as ambient
 * botanical dust drifting behind the intro / hero. Not a scene,
 * not a model — a few hundred points with slow drift. Kept off
 * dense content pages entirely for performance.
 */
function Points({ count = 220, color = '#E3B45E', spread = 9 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * spread * 2;
      arr[i * 3 + 1] = (Math.random() - 0.5) * spread;
      arr[i * 3 + 2] = (Math.random() - 0.5) * spread;
    }
    return arr;
  }, [count, spread]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.02;
    ref.current.rotation.x = Math.sin(t * 0.05) * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color={color} transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

export default function ParticleField({ color = '#E3B45E', className, style }) {
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) return null;

  return (
    <div className={className} style={style} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Points color={color} />
      </Canvas>
    </div>
  );
}
