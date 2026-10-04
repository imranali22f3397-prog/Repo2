'use client';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { EASE_OUT } from '@/lib/motion';

export function SceneHeading({ children }: { children: ReactNode }) {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE_OUT }}
    >
      {children}
    </motion.h1>
  );
}
