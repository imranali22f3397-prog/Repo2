'use client';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT, EASE_INOUT } from '@/lib/motion';
import { useTimeouts } from '@/lib/hooks';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { AnimatedName } from './AnimatedName';

interface NameSceneProps {
  recipientName: string;
  onNext: () => void;
}

export function NameScene({ recipientName, onNext }: NameSceneProps) {
  const { later, clearAll } = useTimeouts();
  const isReducedMotion = useReducedMotion();
  const [exitName, setExitName] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const nameLetterCount = recipientName.length;
    const lastLetterDelay = 0.4 + (nameLetterCount - 1) * 0.09 + 0.8;
    const underlineDelay = lastLetterDelay + 0.9;

    later(() => {
      setShowSubtitle(true);
      later(() => setShowButton(true), 600);
    }, underlineDelay * 1000);
  }, [recipientName]);

  const handleClick = () => {
    if (clicked) return;
    setClicked(true);
    setExitName(true);
  };

  const handleExited = () => {
    clearAll();
    onNext();
  };

  return (
    <div className="name-wall-scene">
      <div className="name-heart-wall" aria-hidden>
        {Array.from({ length: 16 }, (_, i) => (
          <span key={i}>❤</span>
        ))}
      </div>
      <Eyebrow>FOR YOU</Eyebrow>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <AnimatedName
          name={recipientName}
          delay={0.4}
          loop={!clicked}
          exit={exitName}
          outline
          onExited={handleExited}
        />
      </div>
      {showSubtitle && (
        <motion.p
          className="subtitle"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        >
          This little surprise was made just for you...
        </motion.p>
      )}
      {showButton && (
        <Button data-testid="continue" onClick={handleClick} guide>
          Open your surprise
        </Button>
      )}
    </div>
  );
}
