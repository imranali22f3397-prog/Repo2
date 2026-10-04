'use client';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { makeRng } from '@/lib/random';

const MOOD: Record<number, string> = {
  [-1]: 'radial-gradient(ellipse at 50% 45%, #fff 0%, #fff5f7 55%, #f9e4ea 100%)',
  0: 'radial-gradient(ellipse at 50% 40%, #fff3e6 0%, #fde4c8 42%, #f7c9b4 100%)',
  1: 'radial-gradient(ellipse at 50% 45%, #fff 0%, #fff5f7 55%, #f9e4ea 100%)',
  2: 'radial-gradient(ellipse at 48% 30%, #ffe8f0 0%, #f7c9d8 50%, #efb0c6 100%)',
  3: 'radial-gradient(ellipse at 50% 45%, #fff7fb 0%, #f8dce6 60%, #efc1d1 100%)',
  4: 'radial-gradient(ellipse at 50% 45%, #fff7fb 0%, #f8dce6 60%, #efc1d1 100%)',
  5: 'radial-gradient(ellipse at 50% 45%, #fff7fb 0%, #f8dce6 60%, #efc1d1 100%)',
  6: 'radial-gradient(ellipse at 50% 45%, #fff7fb 0%, #f8dce6 60%, #efc1d1 100%)',
  7: 'radial-gradient(ellipse at 50% 20%, #eef7ff 0%, #f4e9ff 55%, #ffe8f2 100%)',
  8: 'radial-gradient(ellipse at 50% 50%, #fff6ea 0%, #3a0f26 140%)',
  9: 'radial-gradient(ellipse at 50% 40%, #fff4e8 0%, #f3d5c4 60%, #e8b9a6 100%)',
  10: 'radial-gradient(ellipse at 50% 45%, #68132f 0%, #350817 65%, #21040e 100%)',
};

interface BackdropProps {
  step: number;
}

export function Backdrop({ step }: BackdropProps) {
  const reduce = useReducedMotion();
  const [particles, setParticles] = useState<Array<{ top: number; left: number; size: number; delay: number; duration: number }>>([]);
  const [shift, setShift] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const count = window.innerWidth <= 640 ? 8 : 14;
    const rng = makeRng(42);
    setParticles(
      Array.from({ length: count }, () => ({
        top: rng() * 100,
        left: rng() * 100,
        size: 3 + rng() * 4,
        delay: -rng() * 8,
        duration: 14 + rng() * 8,
      }))
    );
  }, []);

  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  useEffect(() => {
    if (reduce || window.matchMedia('(pointer: coarse)').matches) return;
    const onMove = (e: PointerEvent) => {
      const x = ((e.clientX / window.innerWidth) - 0.5) * 16;
      const y = ((e.clientY / window.innerHeight) - 0.5) * 12;
      setShift({ x, y });
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduce]);

  return (
    <motion.div
      className="recipient-backdrop"
      animate={{ background: MOOD[step] ?? MOOD[-1] }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        transform: `translate3d(${shift.x}px, ${shift.y}px, 0)`,
        opacity: hidden ? 0.35 : 1,
      }}
    >
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="particle"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
          }}
          animate={hidden || reduce ? { opacity: 0.2 } : { opacity: [0.15, 0.55, 0.15], y: [0, -10, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
        />
      ))}
    </motion.div>
  );
}
