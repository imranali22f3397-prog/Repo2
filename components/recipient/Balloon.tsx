'use client';
import { motion } from 'framer-motion';

interface BalloonProps {
  color: { base: string; light: string; dark: string };
  size: number;
  id?: string;
}

const PALETTE = [
  { base: '#d81745', light: '#ff6b8f', dark: '#8c001f' },
  { base: '#ef456a', light: '#ff9db2', dark: '#b30a35' },
  { base: '#a90028', light: '#f04a70', dark: '#650016' },
  { base: '#f05278', light: '#ffacc0', dark: '#bd143d' },
  { base: '#c60033', light: '#ff5f82', dark: '#78001c' },
  { base: '#e1365d', light: '#ff91aa', dark: '#971130' },
];

export function Balloon({ color, size, id }: BalloonProps) {
  const gradId = `balloon-grad-${id ?? color.base.replace('#', '')}`;
  return (
    <svg
      width={size}
      height={size * 1.56}
      viewBox="0 0 100 156"
      style={{ display: 'block' }}
    >
      <defs>
        <radialGradient id={gradId} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor={color.light} />
          <stop offset="50%" stopColor={color.base} />
          <stop offset="100%" stopColor={color.dark} />
        </radialGradient>
        <filter id={`${gradId}-shadow`} x="-30%" y="-20%" width="160%" height="170%">
          <feDropShadow dx="0" dy="8" stdDeviation="5" floodColor="#7c1028" floodOpacity="0.24" />
        </filter>
      </defs>
      {/* Body */}
      <path
        d="M50 4 C78 4 96 26 96 52 C96 80 72 104 50 108 C28 104 4 80 4 52 C4 26 22 4 50 4 Z"
        fill={`url(#${gradId})`}
        filter={`url(#${gradId}-shadow)`}
      />
      <path
        d="M18 75 C27 100 72 104 87 67"
        stroke="rgba(255,255,255,0.24)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Highlight */}
      <ellipse
        cx="28"
        cy="32"
        rx="4.5"
        ry="8"
        fill="white"
        opacity="0.45"
        transform="rotate(-25, 28, 32)"
      />
      <ellipse
        cx="35"
        cy="22"
        rx="13"
        ry="8"
        fill="white"
        opacity="0.16"
        transform="rotate(-18, 35, 22)"
      />
      {/* Knot */}
      <path
        d="M46 106 L54 106 L52 112 L48 112 Z"
        fill={color.dark}
      />
      {/* String */}
      <path
        d="M50 112 Q50 132 50 152"
        stroke="#c9b8bf"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function getBalloonColor(index: number) {
  return PALETTE[index % PALETTE.length];
}
