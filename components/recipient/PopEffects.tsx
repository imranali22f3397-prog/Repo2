'use client';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { EASE_OUT } from '@/lib/motion';
import { makeRng } from '@/lib/random';

const SHRED_PATH = 'M0 0 C6 -2 10 2 12 8 C6 6 2 4 0 0 Z';

interface PopEffectsProps {
  x: number;
  y: number;
  color: string;
  seed: number;
  onDone: () => void;
}

export function PopEffects({ x, y, color, seed, onDone }: PopEffectsProps) {
  const rng = makeRng(8000 + seed);
  const shreds = Array.from({ length: 5 }, (_, i) => {
    const angle = (i / 5) * Math.PI * 2 + (rng() - 0.5) * 0.5;
    return {
      dist: 20 + rng() * 20,
      fall: 60 + rng() * 30,
      rot: 90 + rng() * 270,
      angle,
    };
  });

  useEffect(() => {
    const t = window.setTimeout(onDone, 1000);
    return () => window.clearTimeout(t);
  }, [onDone]);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 0,
        height: 0,
        pointerEvents: 'none',
        zIndex: 20,
      }}
    >
      <motion.svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        style={{ position: 'absolute', left: -40, top: -40, overflow: 'visible' }}
        initial={{ scale: 0.5, opacity: 0.7 }}
        animate={{ scale: 1.7, opacity: 0 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
      >
        <circle cx="40" cy="40" r="18" fill="none" stroke={color} strokeWidth="3" />
      </motion.svg>

      {shreds.map((s, i) => {
        const dx = Math.cos(s.angle) * s.dist;
        const dy = Math.sin(s.angle) * s.dist;
        return (
          <motion.svg
            key={i}
            width="14"
            height="14"
            viewBox="-2 -4 16 16"
            style={{ position: 'absolute', left: -7, top: -7, overflow: 'visible' }}
            initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            animate={{
              x: dx,
              y: [0, dy, dy + s.fall],
              rotate: s.rot,
              opacity: 0,
            }}
            transition={{ duration: 0.9, ease: EASE_OUT, times: [0, 0.32, 1] }}
          >
            <path d={SHRED_PATH} fill={color} />
          </motion.svg>
        );
      })}
    </div>
  );
}
