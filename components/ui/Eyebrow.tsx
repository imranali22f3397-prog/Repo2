'use client';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { EASE_OUT } from '@/lib/motion';

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="eyebrow"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
