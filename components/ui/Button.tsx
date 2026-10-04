'use client';
import { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_INOUT, EASE_OUT } from '@/lib/motion';
import { ArrowIcon } from '@/components/icons';

interface ButtonProps {
  children: ReactNode;
  guide?: boolean;
  nudge?: boolean;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  'data-testid'?: string;
}

export function Button({
  children,
  guide,
  nudge,
  className = '',
  disabled,
  onClick,
  type = 'button',
  ...rest
}: ButtonProps) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type={type}
      className={`primary bloom-btn ${className}`}
      disabled={disabled}
      onClick={onClick}
      data-testid={rest['data-testid']}
      initial={{ opacity: 0, y: 8 }}
      animate={
        reduce
          ? { opacity: 1, y: 0, scale: 1 }
          : guide
          ? { opacity: 1, y: 0, scale: [1, 1.035, 1] }
          : { opacity: 1, y: 0, scale: 1 }
      }
      transition={
        reduce
          ? { duration: 0.35, ease: EASE_OUT }
          : guide
          ? { duration: 1.8, repeat: Infinity, ease: EASE_INOUT }
          : { duration: 0.45, ease: EASE_OUT }
      }
      whileHover={reduce || disabled ? undefined : { y: -2 }}
      whileTap={reduce || disabled ? undefined : { scale: 0.97 }}
      style={{ minHeight: 44, minWidth: 44 }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        {children}
        {nudge && (
          <motion.span
            aria-hidden
            animate={reduce ? {} : { x: [0, 4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: EASE_INOUT }}
            style={{ display: 'inline-flex' }}
          >
            <ArrowIcon size={16} />
          </motion.span>
        )}
      </span>
    </motion.button>
  );
}
