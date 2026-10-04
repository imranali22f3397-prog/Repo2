'use client';
import { useEffect, useState } from 'react';
import { useIsMobile } from '@/lib/hooks';
import { makeRng } from '@/lib/random';
import styles from './Petals.module.css';

interface PetalsProps {
  visible: boolean;
}

export function Petals({ visible }: PetalsProps) {
  const isMobile = useIsMobile();
  const [petals, setPetals] = useState<Array<{ id: number; x: string; dur: string; delay: string; size: number }>>([]);

  useEffect(() => {
    if (!visible) return;

    const rng = makeRng(67890);
    const count = isMobile ? 7 : 14;

    const petalData = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: `${-30 + rng() * 60}%`,
      dur: `${9 + rng() * 7}s`,
      delay: `${-rng() * 5}s`,
      size: 12 + rng() * 10,
    }));

    setPetals(petalData);
  }, [visible, isMobile]);

  if (!visible) return null;

  return (
    <>
      {petals.map(petal => (
        <svg
          key={petal.id}
          className={styles.petal}
          style={{
            left: `${50 + parseFloat(petal.x)}%`,
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            '--x': petal.x,
            '--dur': petal.dur,
            '--delay': petal.delay,
          } as React.CSSProperties}
          viewBox="0 0 24 24"
        >
          <defs>
            <linearGradient id={`petal-grad-${petal.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff6b9d" />
              <stop offset="50%" stopColor="#ff8a9e" />
              <stop offset="100%" stopColor="#e0527e" />
            </linearGradient>
          </defs>
          <path
            d="M12 2 C18 8 20 16 12 24 C4 16 6 8 12 2 Z"
            fill={`url(#petal-grad-${petal.id})`}
          />
          <path
            d="M12 2 L12 24"
            stroke="#ffb3c6"
            strokeWidth="0.5"
            opacity="0.5"
          />
        </svg>
      ))}
    </>
  );
}
