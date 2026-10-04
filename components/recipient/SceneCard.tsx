'use client';
import { motion } from 'framer-motion';
import { EASE_INOUT } from '@/lib/motion';

interface SceneCardProps {
  children: React.ReactNode;
}

export function SceneCard({ children }: SceneCardProps) {
  return (
    <motion.div
      className="recipientcard"
      layout
      transition={{ duration: 0.5, ease: EASE_INOUT }}
    >
      {children}
    </motion.div>
  );
}
