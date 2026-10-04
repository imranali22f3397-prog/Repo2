'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EASE_OUT } from '@/lib/motion';
import { Envelope } from './Envelope';
import { LetterPaper } from './LetterPaper';

interface LetterSceneProps {
  letter: string;
  onNext: () => void;
}

export function LetterScene({ letter, onNext }: LetterSceneProps) {
  const [hint, setHint] = useState(true);
  const [reading, setReading] = useState(false);

  const handleComplete = () => {
    onNext();
  };

  return (
    <div style={{ paddingTop: '8px', textAlign: 'center', position: 'relative', minHeight: '52dvh' }}>
      <AnimatePresence>
        {!reading && hint && (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{
              marginBottom: '12px',
              fontSize: '14px',
              color: '#987984',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            Tap the envelope to open
          </motion.p>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE_OUT }}
        style={{
          position: reading ? 'absolute' : 'relative',
          left: 0,
          right: 0,
          pointerEvents: reading ? 'none' : 'auto',
        }}
      >
        <Envelope
          onOpenStart={() => setHint(false)}
          onOpened={() => setReading(true)}
        />
      </motion.div>

      <AnimatePresence>
        {reading && (
          <motion.div
            key="paper"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            style={{ position: 'relative', zIndex: 6 }}
          >
            <LetterPaper letter={letter} onComplete={handleComplete} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
