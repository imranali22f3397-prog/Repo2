'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT, EASE_INOUT, DUR, STAGGER } from '@/lib/motion';
import { makeRng } from '@/lib/random';
import { useTimeouts } from '@/lib/hooks';

interface AnimatedNameProps {
  name: string;
  size?: string;
  delay?: number;
  loop?: boolean;
  exit?: boolean;
  outline?: boolean;
  onExited?: () => void;
}

export function AnimatedName({
  name,
  size,
  delay = 0,
  loop = true,
  exit = false,
  outline = false,
  onExited,
}: AnimatedNameProps) {
  const isReducedMotion = useReducedMotion();
  const { later, clearAll } = useTimeouts();
  const [showUnderline, setShowUnderline] = useState(false);
  const [exiting, setExiting] = useState(false);
  const hasExitedRef = useRef(false);
  const [sparklePositions, setSparklePositions] = useState<Array<{ x: number; y: number; delay: number; duration: number; size: number }>>([]);

  const letters = Array.from(name.toUpperCase());
  const isLongName = letters.length > 10;
  const fontSize = size || (isLongName ? 'clamp(36px, 10vw, 64px)' : 'clamp(40px, 12vw, 72px)');

  useEffect(() => {
    const rng = makeRng(789);
    setSparklePositions(
      Array.from({ length: 10 }, () => ({
        x: rng() * 100,
        y: rng() * 60 - 30,
        delay: rng() * 2,
        duration: 5 + rng() * 3,
        size: 4 + rng() * 6,
      }))
    );
  }, []);

  useEffect(() => {
    if (!exit && !isReducedMotion) {
      const lastLetterDelay = delay + (letters.length - 1) * STAGGER + 0.8;
      later(() => setShowUnderline(true), (lastLetterDelay) * 1000);
    }
  }, [exit, letters.length, delay, isReducedMotion]);

  const words = name.toUpperCase().split(' ');

  const handleExit = () => {
    if (hasExitedRef.current) return;
    hasExitedRef.current = true;
    setExiting(true);
    clearAll();
    later(() => {
      onExited?.();
    }, (0.35 + letters.length * 0.04) * 1000);
  };

  useEffect(() => {
    return () => clearAll();
  }, []);

  if (exit && !exiting) {
    handleExit();
  }

  return (
    <div style={{ perspective: '800px', position: 'relative', display: 'inline-block' }}>
      {/* Glow */}
      {!isReducedMotion && (
        <motion.div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '150%',
            height: '150%',
            background: 'radial-gradient(circle, rgba(224, 82, 126, 0.6) 0%, transparent 70%)',
            filter: 'blur(30px)',
            zIndex: -1,
          }}
          animate={{ opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}

      {/* Name */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '0.3em',
          fontFamily: 'Playfair Display, serif',
          fontSize,
          fontWeight: 500,
        }}
      >
        {words.map((word, wordIdx) => (
          <div key={wordIdx} style={{ display: 'inline-flex', whiteSpace: 'nowrap' }}>
            {Array.from(word).map((letter, letterIdx) => {
              const globalIdx = words.slice(0, wordIdx).join('').length + letterIdx;
              return (
                <motion.span
                  key={`${wordIdx}-${letterIdx}`}
                  className={outline ? 'animated-name-outline' : undefined}
                  style={{ display: 'inline-block' }}
                  initial={
                    isReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: 40, rotateX: -50, filter: 'blur(6px)' }
                  }
                  animate={
                    exiting
                      ? { opacity: 0, y: -30 }
                      : isReducedMotion
                      ? { opacity: 1 }
                      : { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }
                  }
                  transition={
                    exiting
                      ? { duration: 0.35, delay: globalIdx * 0.04 }
                      : { duration: 0.8, delay: delay + globalIdx * STAGGER, ease: EASE_OUT }
                  }
                >
                  {!isReducedMotion && loop && !exiting && (
                    <motion.span
                      style={{ display: 'inline-block' }}
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        duration: DUR.ambient,
                        repeat: Infinity,
                        ease: EASE_INOUT,
                        delay: globalIdx * 0.15,
                      }}
                    >
                      {letter}
                    </motion.span>
                  )}
                  {isReducedMotion || exiting || !loop ? letter : null}
                </motion.span>
              );
            })}
          </div>
        ))}
      </div>

      {/* Underline */}
      {!isReducedMotion && !exiting && (
        <motion.div
          style={{
            width: '100%',
            height: '2px',
            background: 'linear-gradient(90deg, #e0527e, #f5c26b)',
            borderRadius: '1px',
            margin: '16px auto 0',
            transformOrigin: 'center',
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: showUnderline ? 1 : 0 }}
          transition={{ duration: 0.9, ease: EASE_OUT }}
        />
      )}

      {/* Sparkles */}
      {!isReducedMotion && !exiting && (
        <>
          {sparklePositions.map((p, i) => (
            <motion.svg
              key={i}
              style={{
                position: 'absolute',
                left: `${p.x}%`,
                top: `${50 + p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                opacity: 0.5,
              }}
              viewBox="0 0 24 24"
              fill="#f5c26b"
              animate={{
                y: [0, -60, -60],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: EASE_INOUT,
              }}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </motion.svg>
          ))}
        </>
      )}
    </div>
  );
}
