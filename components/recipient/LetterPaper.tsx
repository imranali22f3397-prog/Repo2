'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from '@/lib/motion';

interface LetterPaperProps {
  letter: string;
  onComplete: () => void;
}

export function LetterPaper({ letter, onComplete }: LetterPaperProps) {
  const isReducedMotion = useReducedMotion();
  const [revealedCount, setRevealedCount] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const letters = Array.from(letter);
  const letterCount = letters.length;
  const visibleLetters = skipped ? letters : letters.slice(0, revealedCount);
  const delayPerLetter = 0.012;

  // Candlelight flicker values
  const flickerValues = Array.from({ length: 8 }, () => 0.5 + Math.random() * 0.15);

  useEffect(() => {
    if (skipped) {
      setRevealedCount(letterCount);
      later(() => {
        setShowSignature(true);
        later(() => {
          setShowContinue(true);
        }, 1500);
      }, 100);
      return;
    }

    if (revealedCount < letterCount) {
      const timer = setTimeout(() => {
        setRevealedCount(prev => {
          const next = prev + 1;
          if (next % 40 === 0 && containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
          }
          return next;
        });
      }, delayPerLetter * 1000);
      return () => clearTimeout(timer);
    } else {
      // All words revealed
      later(() => setShowSignature(true), 500);
      later(() => setShowContinue(true), 2000);
    }
  }, [revealedCount, letterCount, delayPerLetter, skipped]);

  const later = (fn: () => void, ms: number) => {
    const timer = setTimeout(fn, ms);
    return () => clearTimeout(timer);
  };

  const handleTap = () => {
    if (!skipped && revealedCount < letterCount) {
      setSkipped(true);
    }
  };

  const signaturePath = "M10,30 Q20,10 30,25 T50,20 Q60,15 70,25 T90,30 L95,25 Q85,10 70,15 T50,10 Q30,5 20,15 T10,30 Z";

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Candlelight glow */}
      {!isReducedMotion && (
        <motion.div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '120%',
            height: '120%',
            background: 'radial-gradient(circle, rgba(255, 200, 150, 0.3) 0%, transparent 70%)',
            filter: 'blur(30px)',
            zIndex: -1,
          }}
          animate={{ opacity: flickerValues }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
        />
      )}

      <motion.div
        ref={containerRef}
        onClick={handleTap}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
        style={{
          background: '#fffdf8',
          borderRadius: '6px',
          padding: '24px',
          width: 'min(86vw, 380px)',
          maxHeight: '56dvh',
          overflowY: 'auto',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          position: 'relative',
          cursor: skipped || revealedCount >= letterCount ? 'default' : 'pointer',
          fontFamily: 'var(--font-hand)',
          fontSize: 'clamp(20px, 5vw, 24px)',
          lineHeight: 1.5,
          textAlign: 'left',
          whiteSpace: 'pre-wrap',
          color: '#3d2630',
        }}
      >
        {/* Noise texture */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.04,
            pointerEvents: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {visibleLetters.map((letter, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: EASE_OUT }}
            style={{ display: 'inline', whiteSpace: letter === '\n' ? 'pre' : 'pre-wrap' }}
          >
            {letter}
          </motion.span>
        ))}

        {/* Blinking caret */}
        {!skipped && revealedCount < letterCount && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{ display: 'inline-block', width: '2px', height: '1.2em', background: '#8a2a4a', marginLeft: '2px', verticalAlign: 'text-bottom' }}
          />
        )}

        {/* Signature */}
        {showSignature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ marginTop: '24px', textAlign: 'center' }}
          >
            <div style={{ fontSize: '18px', marginBottom: '8px' }}>With love,</div>
            <svg width="100" height="40" viewBox="0 0 100 40">
              <motion.path
                d={signaturePath}
                fill="none"
                stroke="#8a2a4a"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: EASE_OUT }}
              />
              <motion.g
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, duration: 0.3 }}
              >
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="#8a2a4a"
                  transform="translate(80, 20) scale(0.5)"
                />
              </motion.g>
            </svg>
          </motion.div>
        )}
      </motion.div>

      {/* Skip button while the letter is still writing */}
      {!skipped && revealedCount < letterCount && (
        <motion.button
          className="primary"
          type="button"
          onClick={onComplete}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{ marginTop: '18px' }}
        >
          Skip letter →
        </motion.button>
      )}

      {/* Continue button */}
      {showContinue && (
        <motion.button
          className="primary"
          type="button"
          data-testid="continue"
          onClick={onComplete}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{ marginTop: '24px' }}
        >
          Continue →
        </motion.button>
      )}
    </div>
  );
}
